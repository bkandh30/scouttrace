import { DottedBackground } from '@/components/dotted-background'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { scrapeUrlFn, mapUrlFn, bulkScrapeUrlsFn, type BulkScrapeProgress } from '@/data/items'
import { importSchema, bulkImportSchema } from '@/schemas/import'
import { cn } from '@/lib/utils'
import { type SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Download, Globe, LinkIcon, Loader2, Search } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { makeTitle } from '@/lib/seo'

export const Route = createFileRoute('/dashboard/import')({
    component: RouteComponent,
    head: () => ({
        meta: [
            { title: makeTitle('Import Content') },
            {
                name: 'description',
                content: 'Import and save web pages to your library. Scrape single URLs or bulk import from websites.',
            },
            { property: 'og:title', content: 'Import Content' },
            {
                property: 'og:description',
                content: 'Import and save web pages to your library. Scrape single URLs or bulk import from websites.',
            },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: 'Import Content' },
            {
                name: 'twitter:description',
                content: 'Import and save web pages to your library. Scrape single URLs or bulk import from websites.',
            },
        ],
    }),
})

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
    const [bulkIsPending, startBulkTransition] = useTransition()

    const [discoveredUrls, setDiscoveredUrls] = useState<Array<SearchResultWeb>>([])
    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
    const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)

    const hasResults = discoveredUrls.length > 0
    const hasSelection = selectedUrls.size > 0
    const allSelected = selectedUrls.size === discoveredUrls.length && hasResults

    function handleSelectAll() {
        if (selectedUrls.size === discoveredUrls.length) {
            setSelectedUrls(new Set())
        } else {
            setSelectedUrls(new Set(discoveredUrls.map((link) => link.url)))
        }
    }

    function handleToggleUrl(url: string) {
        const newSelectedUrls = new Set(selectedUrls)

        if (newSelectedUrls.has(url)) {
            newSelectedUrls.delete(url)
        } else {
            newSelectedUrls.add(url)
        }

        setSelectedUrls(newSelectedUrls)
    }

    function handleBulkImport() {
        startBulkTransition(async () => {
            if (selectedUrls.size === 0) {
                toast.error('Please select at least one URL to import')
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

    const form = useForm({
        defaultValues: {
            url: '',
        },
        validators: {
            onSubmit: importSchema,
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                await scrapeUrlFn({ data: value })
                toast.success('Content imported successfully!')
            })
        },
    })

    const bulkForm = useForm({
        defaultValues: {
            url: '',
            search: '',
        },
        validators: {
            onSubmit: bulkImportSchema,
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                const urls = await mapUrlFn({ data: value })
                setDiscoveredUrls(urls)
            })
        },
    })

    return (
        <div className="relative flex min-h-full flex-1 flex-col px-4 pt-6 pb-16 sm:px-6 lg:px-8">
            <DottedBackground />
            <div className="relative mx-auto w-full max-w-3xl space-y-8">
                {/* ── Page header ── */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Import</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Save web pages to your library by URL.
                    </p>
                </div>

                {/* ── Tabs ── */}
                <Tabs defaultValue="single">
                    <TabsList>
                        <TabsTrigger value="single" className="gap-2">
                            <LinkIcon className="size-3.5" />
                            Single URL
                        </TabsTrigger>
                        <TabsTrigger value="bulk" className="gap-2">
                            <Globe className="size-3.5" />
                            Bulk Import
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Single URL ── */}
                    <TabsContent value="single" className="space-y-6 pt-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            <form.Field
                                name="url"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid
                                    return (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <LinkIcon className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) =>
                                                            field.handleChange(e.target.value)
                                                        }
                                                        aria-invalid={isInvalid}
                                                        aria-label="URL to import"
                                                        placeholder="Paste any URL..."
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
                                                            Import
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

                    </TabsContent>

                    {/* ── Bulk Import ── */}
                    <TabsContent value="bulk" className="space-y-6 pt-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                bulkForm.handleSubmit()
                            }}
                            className="space-y-3"
                        >
                            <bulkForm.Field
                                name="url"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid
                                    return (
                                        <div className="space-y-2">
                                            <div className="flex gap-1.5">
                                                <div className="relative flex-1">
                                                    <Globe className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) =>
                                                            field.handleChange(e.target.value)
                                                        }
                                                        aria-invalid={isInvalid}
                                                        aria-label="Website URL"
                                                        placeholder="Website URL to crawl..."
                                                        autoComplete="off"
                                                        className="h-10 pl-9"
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isPending}
                                                    size="lg"
                                                    className="h-10 px-4"
                                                >
                                                    {isPending ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            Find URLs
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

                            <bulkForm.Field
                                name="search"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid
                                    return (
                                        <div className="space-y-2">
                                            <div className="relative">
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
                                                    aria-label="Filter keywords"
                                                    placeholder="Filter by keyword (optional)"
                                                    autoComplete="off"
                                                    className="h-10 pl-9"
                                                />
                                            </div>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </div>
                                    )
                                }}
                            />
                        </form>

                        {/* ── Discovered URLs ── */}
                        {hasResults && (
                            <div className="space-y-3">
                                {/* Results header */}
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                                        {discoveredUrls.length} results
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
                                    {discoveredUrls.map((link) => {
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
                                                    onCheckedChange={() =>
                                                        handleToggleUrl(link.url)
                                                    }
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
                                                    Importing {progress.completed} of{' '}
                                                    {progress.total}
                                                </span>
                                                <span className="text-muted-foreground font-medium">
                                                    {Math.round(
                                                        (progress.completed / progress.total) *
                                                            100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    (progress.completed / progress.total) * 100
                                                }
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
