import { DottedBackground } from '@/components/dotted-background'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { type BulkScrapeProgress, bulkScrapeUrlsFn, searchWebFn } from '@/data/items'
import { searchSchema } from '@/schemas/import'
import { cn } from '@/lib/utils'
import { type SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Download, Globe, Loader2, Search, SearchX } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { makeTitle } from '@/lib/seo'

export const Route = createFileRoute('/dashboard/discover')({
    component: RouteComponent,
    head: () => ({
        meta: [
            { title: makeTitle('Discover') },
            {
                name: 'description',
                content: 'Search the web for articles on any topic and import interesting content to your library.',
            },
            { property: 'og:title', content: 'Discover' },
            {
                property: 'og:description',
                content: 'Search the web for articles on any topic and import interesting content to your library.',
            },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: 'Discover' },
            {
                name: 'twitter:description',
                content: 'Search the web for articles on any topic and import interesting content to your library.',
            },
        ],
    }),
})

const EXAMPLE_QUERIES = [
    'React Server Components',
    'AI agents architecture',
    'TypeScript design patterns',
    'System design interviews',
]

function getUrlDisplay(url: string) {
    try {
        const parsed = new URL(url)
        return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '')
    } catch {
        return url
    }
}

function RouteComponent() {
    const [isPending, startTransition] = useTransition()
    const [searchResults, setSearchResults] = useState<Array<SearchResultWeb>>([])
    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
    const [bulkIsPending, startBulkTransition] = useTransition()
    const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)
    const [hasSearched, setHasSearched] = useState(false)

    const hasResults = searchResults.length > 0
    const hasSelection = selectedUrls.size > 0
    const allSelected = selectedUrls.size === searchResults.length && hasResults

    function handleSelectAll() {
        if (selectedUrls.size === searchResults.length) {
            setSelectedUrls(new Set())
        } else {
            setSelectedUrls(new Set(searchResults.map((link) => link.url)))
        }
    }

    function handleToggleUrl(url: string) {
        const newSelected = new Set(selectedUrls)

        if (newSelected.has(url)) {
            newSelected.delete(url)
        } else {
            newSelected.add(url)
        }

        setSelectedUrls(newSelected)
    }

    function handleBulkImport() {
        startBulkTransition(async () => {
            if (selectedUrls.size === 0) {
                toast.error('Please select at least one URL to import.')
                return
            }

            setProgress({
                completed: 0,
                total: selectedUrls.size,
                url: '',
                status: 'success',
            })
            let successCount = 0
            let failedCount = 0

            for await (const update of await bulkScrapeUrlsFn({
                data: { urls: Array.from(selectedUrls) },
            })) {
                setProgress(update)

                if (update.status === 'success') {
                    successCount++
                } else {
                    failedCount++
                }
            }

            setProgress(null)

            if (failedCount > 0) {
                toast.success(`Imported ${successCount} URLs (${failedCount} failed)`)
            } else {
                toast.success(`Successfully imported ${successCount} URLs`)
            }
        })
    }

    function handleExampleQuery(query: string) {
        form.setFieldValue('query', query)
        startTransition(async () => {
            const result = await searchWebFn({ data: { query } })
            setSearchResults(result)
            setHasSearched(true)
        })
    }

    const form = useForm({
        defaultValues: {
            query: '',
        },
        validators: {
            onSubmit: searchSchema,
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                const result = await searchWebFn({
                    data: {
                        query: value.query,
                    },
                })

                setSearchResults(result)
                setHasSearched(true)
            })
        },
    })

    return (
        <div className="relative flex min-h-full flex-1 flex-col px-4 pt-6 pb-16 sm:px-6 lg:px-8">
            <DottedBackground />
            <div className="relative mx-auto w-full max-w-3xl space-y-8">
                {/* ── Page header ── */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Find and import content from across the web.
                    </p>
                </div>

                {/* ── Search ── */}
                <div className="space-y-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <form.Field
                            name="query"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    aria-label="Search query"
                                                    placeholder="Search for any topic..."
                                                    autoComplete="off"
                                                    className="h-10 pl-9"
                                                />
                                            </div>
                                            <Button
                                                disabled={isPending}
                                                type="submit"
                                                size="lg"
                                                className="h-10 px-4"
                                            >
                                                {isPending ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        Search
                                                        <ArrowRight className="size-3.5" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </div>
                                )
                            }}
                        />
                    </form>

                    {/* Example query chips */}
                    {!hasResults && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-muted-foreground/50 text-xs">Try:</span>
                            {EXAMPLE_QUERIES.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => handleExampleQuery(q)}
                                    disabled={isPending}
                                    className="text-muted-foreground hover:text-foreground hover:border-border rounded-md border border-border/50 bg-transparent px-2 py-0.5 text-xs transition-colors disabled:opacity-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Empty state: before any search ── */}
                {!hasResults && !isPending && !hasSearched && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-xl">
                            <Globe className="text-muted-foreground size-6" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Search for a topic to discover content worth importing.
                        </p>
                    </div>
                )}

                {/* ── Empty state: search returned nothing ── */}
                {!hasResults && !isPending && hasSearched && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-xl">
                            <SearchX className="text-muted-foreground size-6" />
                        </div>
                        <p className="text-sm font-medium">No results found</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Try a different query or broaden your search.
                        </p>
                    </div>
                )}

                {/* ── Loading state ── */}
                {isPending && !hasResults && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 className="text-muted-foreground mb-3 size-5 animate-spin" />
                        <p className="text-muted-foreground text-sm">Searching the web...</p>
                    </div>
                )}

                {/* ── Results ── */}
                {hasResults && (
                    <div className="space-y-3">
                        {/* Results header */}
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                                {searchResults.length} results
                            </p>
                            <Button
                                onClick={handleSelectAll}
                                type="button"
                                variant="outline"
                                size="sm"
                            >
                                {allSelected ? 'Deselect all' : 'Select all'}
                            </Button>
                        </div>

                        {/* Results list */}
                        <div className="divide-border/50 max-h-[28rem] divide-y overflow-y-auto rounded-lg border">
                            {searchResults.map((link) => {
                                const isSelected = selectedUrls.has(link.url)
                                return (
                                    <label
                                        key={link.url}
                                        className={cn(
                                            'flex cursor-pointer items-start gap-3 border-l-2 px-4 py-3 transition-colors',
                                            isSelected
                                                ? 'bg-primary/[0.04] border-l-primary'
                                                : 'border-l-transparent hover:bg-muted/40',
                                        )}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleToggleUrl(link.url)}
                                            className="mt-0.5"
                                        />
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <p className="truncate text-sm font-medium leading-snug">
                                                {link.title ?? 'Untitled page'}
                                            </p>
                                            {link.description && (
                                                <p className="text-muted-foreground line-clamp-1 text-xs leading-relaxed">
                                                    {link.description}
                                                </p>
                                            )}
                                            <p className="text-muted-foreground/40 truncate text-xs">
                                                {getUrlDisplay(link.url)}
                                            </p>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>

                        {/* Import section */}
                        <div className="space-y-3 pt-1">
                            {progress && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Importing {progress.completed} of {progress.total}
                                        </span>
                                        <span className="text-muted-foreground font-medium">
                                            {Math.round(
                                                (progress.completed / progress.total) * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={(progress.completed / progress.total) * 100}
                                    />
                                </div>
                            )}

                            <Button
                                disabled={bulkIsPending || !hasSelection}
                                onClick={handleBulkImport}
                                className="w-full"
                                size="lg"
                                type="button"
                            >
                                {bulkIsPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        {progress
                                            ? `Importing ${progress.completed}/${progress.total}...`
                                            : 'Starting...'}
                                    </>
                                ) : (
                                    <>
                                        <Download className="size-3.5" />
                                        {hasSelection
                                            ? `Import ${selectedUrls.size} selected`
                                            : 'Select items to import'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
