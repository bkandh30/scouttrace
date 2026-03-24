import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { getItemsFn } from '@/data/items'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { copyToClipboardFn } from '@/lib/clipboard'
import { CopyIcon, Inbox, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ItemStatus } from '@/generated/prisma/enums'
// import z from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import { useEffect, useState, Suspense, use } from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { makeTitle } from '@/lib/seo'
import { itemsSearchSchema } from '@/schemas/import'
import type { ItemsSearch } from '@/schemas/import'

export const Route = createFileRoute('/dashboard/items/')({
    component: RouteComponent,
    loader: () => ({ itemsPromise: getItemsFn() }),
    staleTime: 30_000,
    preloadStaleTime: 30_000,
    validateSearch: zodValidator(itemsSearchSchema),
    head: () => ({
        meta: [
            { title: makeTitle('Saved Items') },
            {
                name: 'description',
                content:
                    'Browse and manage your saved articles, bookmarks and content.',
            },
            { property: 'og:title', content: 'Saved Items' },
            {
                property: 'og:description',
                content:
                    'Browse and manage your saved articles, bookmarks and content.',
            },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: 'Saved Items' },
            {
                name: 'twitter:description',
                content:
                    'Browse and manage your saved articles, bookmarks and content.',
            },
            {
                name: 'twitter:image',
                content: 'https://scouttrace.com/scouttrace.png',
            },
        ],
    }),
})

function ItemsGridSkeleton() {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden pt-0">
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="size-8 rounded-md" />
                        </div>
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-3.5 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}

function ItemsList({
    q,
    status,
    data,
}: {
    q: ItemsSearch['q']
    status: ItemsSearch['status']
    data: ReturnType<typeof getItemsFn>
}) {
    const items = use(data)
    const filteredItems = items.filter((item) => {
        const matchesQuery =
            q === '' ||
            item.title?.toLowerCase().includes(q.toLowerCase()) ||
            item.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))

        const matchesStatus = status === 'all' || item.status === status

        return matchesQuery && matchesStatus
    })

    if (filteredItems.length === 0) {
        return (
            <Empty className="border rounded-lg h-full">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Inbox className="size-12" />
                    </EmptyMedia>
                    <EmptyTitle>No items found</EmptyTitle>
                    <EmptyDescription>
                        No items match your current search filters.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Link className={buttonVariants()} to="/dashboard/import">
                        Import URL
                    </Link>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
                const visibleTags = item.tags.slice(0, 3)
                const remainingTagCount = item.tags.length - visibleTags.length

                return (
                    <Card
                        key={item.id}
                        className="group overflow-hidden pt-0 transition-all duration-200 hover:ring-foreground/15 hover:shadow-md"
                    >
                        <Link
                            to="/dashboard/items/$itemId"
                            params={{ itemId: item.id }}
                            preload={false}
                            className="block"
                        >
                            {item.ogImage && (
                                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                    <img
                                        src={item.ogImage}
                                        alt={item.title ?? 'Article thumbnail'}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                    />
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/50 to-transparent" />
                                </div>
                            )}

                            <CardHeader className="space-y-2.5 pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <Badge
                                        variant={
                                            item.status === 'COMPLETED' ? 'default' : 'secondary'
                                        }
                                    >
                                        {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                                    </Badge>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8 text-muted-foreground/50 transition-colors hover:text-foreground"
                                        onClick={async (e) => {
                                            e.preventDefault()
                                            await copyToClipboardFn(item.url)
                                        }}
                                    >
                                        <CopyIcon className="size-4" />
                                    </Button>
                                </div>

                                <CardTitle className="line-clamp-2 text-[16px] font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                                    {item.title}
                                </CardTitle>

                                {item.author && (
                                    <p className="truncate text-xs text-muted-foreground/70">
                                        {item.author}
                                    </p>
                                )}

                                {visibleTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {visibleTags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="max-w-full border-border/80"
                                            >
                                                <span className="truncate">{tag}</span>
                                            </Badge>
                                        ))}

                                        {remainingTagCount > 0 && (
                                            <Badge variant="outline">+{remainingTagCount}</Badge>
                                        )}
                                    </div>
                                )}
                            </CardHeader>
                        </Link>
                    </Card>
                )
            })}
        </div>
    )
}

function RouteComponent() {
    const { itemsPromise } = Route.useLoaderData()
    const { q, status } = Route.useSearch()
    const [searchInput, setSearchInput] = useState(q)
    const navigate = useNavigate({ from: Route.fullPath })

    useEffect(() => {
        if (searchInput === q) return

        const timeoutId = setTimeout(() => {
            navigate({ search: (prev) => ({ ...prev, q: searchInput }) })
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchInput, navigate, q])

    return (
        <div className="flex flex-1 flex-col gap-5">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    Saved Items
                </h1>
                <p className="text-sm text-muted-foreground/80">
                    Your saved articles and content
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by title or tags"
                        className="pl-9"
                    />
                </div>
                <Select
                    value={status}
                    onValueChange={(value) =>
                        navigate({
                            search: (prev) => ({
                                ...prev,
                                status: value as typeof status,
                            }),
                        })
                    }
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.values(ItemStatus).map((itemStatus) => (
                            <SelectItem key={itemStatus} value={itemStatus}>
                                {itemStatus.charAt(0) +
                                    itemStatus.slice(1).toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Suspense fallback={<ItemsGridSkeleton />}>
                <ItemsList q={q} status={status} data={itemsPromise} />
            </Suspense>
        </div>
    )
}
