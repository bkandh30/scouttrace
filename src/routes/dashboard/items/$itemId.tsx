import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArrowLeftIcon, User, Calendar, Clock, ExternalLink, ChevronDown, Loader2, Sparkles } from 'lucide-react'
import { generateTagsForItemFn, getItemByIdFn, saveSummaryFn } from '@/data/items'
import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Card, CardContent } from '@/components/ui/card'
import { MessageResponse } from '@/components/ai-elements/message'
import { cn } from '@/lib/utils'
import { makeTitle } from '@/lib/seo'
import { getFriendlyDatabaseErrorMessage } from '@/lib/database-errors'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

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
    },
})

function RouteComponent() {
    const data = Route.useLoaderData()
    const [contentOpen, setContentOpen] = useState(false)
    const [isGeneratingTags, setIsGeneratingTags] = useState(false)
    const router = useRouter()

    const { completion, complete, isLoading } = useCompletion({
        api: '/api/ai/summary',
        initialCompletion: data.summary ? data.summary : undefined,
        streamProtocol: 'text',
        body: {
            itemId: data.id,
        },
        onFinish: async (_prompt, completionText) => {
            try {
                await saveSummaryFn({
                    data: {
                        id: data.id,
                        summary: completionText,
                    },
                })
                await generateTagsForItemFn({
                    data: {
                        id: data.id,
                    },
                })
                toast.success('Summary and tags generated')
            } catch (error) {
                toast.error(
                    getFriendlyDatabaseErrorMessage(
                        error,
                        'Failed to save summary or generate tags',
                    ),
                )
            } finally {
                await router.invalidate()
            }
        },
        onError: (error) => {
            toast.error(
                getFriendlyDatabaseErrorMessage(error, 'Failed to generate summary'),
            )
        },
    })

    const summaryText = completion || data.summary || ''

    function handleGenerateSummary() {
        if (!data.content) {
            toast.error('No content available to summarize')
            return
        }

        complete(data.content)
    }

    async function handleGenerateTags() {
        if (!summaryText) {
            toast.error('No summary available to generate tags from')
            return
        }

        setIsGeneratingTags(true)

        try {
            await generateTagsForItemFn({
                data: {
                    id: data.id,
                },
            })
            toast.success('Tags generated and saved')
            await router.invalidate()
        } catch (error) {
            toast.error(
                getFriendlyDatabaseErrorMessage(error, 'Failed to generate tags'),
            )
        } finally {
            setIsGeneratingTags(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 w-full">
            <div className="flex justify-start">
                <Link
                    to="/dashboard/items"
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Items
                </Link>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                    src={data.ogImage ?? 'https://placehold.co/600x400'}
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

            {/* Summary Section */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                                Summary
                            </h2>

                            {summaryText ? (
                                <MessageResponse>{summaryText}</MessageResponse>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    {data.content
                                        ? 'No summary available. Click the button to generate summary.'
                                        : 'No content available to summarize.'}
                                </p>
                            )}
                        </div>

                        {data.content && !data.summary && (
                            <Button
                                onClick={handleGenerateSummary}
                                disabled={isLoading}
                                size="sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 size-4" />
                                        Generate Summary
                                    </>
                                )}
                            </Button>
                        )}

                        {data.summary && data.tags.length === 0 && (
                            <Button
                                onClick={handleGenerateTags}
                                disabled={isGeneratingTags}
                                size="sm"
                            >
                                {isGeneratingTags ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 size-4" />
                                        Generate Tags
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

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
