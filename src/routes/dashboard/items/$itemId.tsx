import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArrowLeftIcon, User, Calendar, Clock, ExternalLink, Badge, ChevronDown } from 'lucide-react'
import { getItemByIdFn } from '@/data/items'
import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Card, CardContent } from '@/components/ui/card'
import { MessageResponse } from '@/components/ai-elements/message'
import { cn } from '@/lib/utils'
import { makeTitle } from '@/lib/seo'


export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemByIdFn({ data: { id: params.itemId } }),
  head: ({ loaderData }) => {
    const title = makeTitle(loaderData?.title ?? 'Item Details')
    const description =
        loaderData?.summary ??
        'View saved article details and AI-generated summary'
    const image = loaderData?.ogImage

    return {
        meta: [
            { title },
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: 'article' },
            ...(image ? [{ property: 'og:image', content: image }] : []),
            {
            name: 'twitter:card',
            content: image ? 'summary_large_image' : 'summary',
            },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            ...(image ? [{ name: 'twitter:image', content: image }] : []),
            ...(loaderData?.author
            ? [{ name: 'author', content: loaderData.author }]
            : []),
        ],
    }
  }
})

function RouteComponent() {
    const data  = Route.useLoaderData()
    const [contentOpen, setContentOpen] = useState(false)
    const router = useRouter()

    return (
        <div className="mx-auto max-w-3xl space-y-6 w-full">
            <div className="flex justify-start">
                <Link
                    to='/dashboard/items'
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Items
                </Link>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img 
                    src={
                        data.ogImage ?? 'https://placehold.co/600x400'
                    }
                    alt={data.title ?? 'Item Thumbnail'}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                    {data.title ?? 'Untitled'}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {data.author && (
                    <span className="inline-flex items-center gap-1">
                    <User className="size-3.5" />
                    {data.author}
                    </span>
                )}

                {data.publishedAt && (
                    <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {new Date(data.publishedAt).toLocaleDateString('en-US')}
                    </span>
                )}

                <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    Saved {new Date(data.createdAt).toLocaleDateString('en-US')}
                </span>
            </div>

            <a
                href={data.url}
                className="text-chart-3 hover:underline inline-flex items-center gap-1 text-sm"
                target="_blank"
            >
                View Original Item
                <ExternalLink className="size-3.5" />
            </a>

            {/* Tags */}
            {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                    ))}
                </div>
            )}

            {/* To-do: Summary Section */}

            {/* Content Section */}
            {data.content && (
                <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
                    <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        <span className="font-medium">View Full Content</span>
                        <ChevronDown
                        className={cn(
                            contentOpen ? 'rotate-180' : '',
                            'size-4 transition-transform duration-200',
                        )}
                        />
                    </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                    <Card className="mt-2">
                        <CardContent>
                        <MessageResponse>{data.content}</MessageResponse>
                        </CardContent>
                    </Card>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    )
}
