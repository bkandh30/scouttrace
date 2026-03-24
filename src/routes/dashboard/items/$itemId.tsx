import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	ArrowLeftIcon,
	User,
	Calendar,
	Clock,
	ExternalLink,
	ChevronDown,
	Loader2,
	Sparkles,
	FileText,
} from 'lucide-react'
import {
	generateTagsForItemFn,
	getItemByIdFn,
	saveSummaryFn,
} from '@/data/items'
import { useState } from 'react'
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible'
import { Card, CardContent } from '@/components/ui/card'
import { MessageResponse } from '@/components/ai-elements/message'
import { cn } from '@/lib/utils'
import { makeTitle } from '@/lib/seo'
import { getFriendlyDatabaseErrorMessage } from '@/lib/database-errors'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/$itemId')({
	component: RouteComponent,
	loader: ({ params }) => getItemByIdFn({ data: { id: params.itemId } }),
	staleTime: 30_000,
	preloadStaleTime: 30_000,
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
				await router.invalidate({
					filter: (match) => match.routeId === Route.id,
					sync: true,
				})
			}
		},
		onError: (error) => {
			toast.error(
				getFriendlyDatabaseErrorMessage(
					error,
					'Failed to generate summary',
				),
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
			await router.invalidate({
				filter: (match) => match.routeId === Route.id,
				sync: true,
			})
		} catch (error) {
			toast.error(
				getFriendlyDatabaseErrorMessage(
					error,
					'Failed to generate tags',
				),
			)
		} finally {
			setIsGeneratingTags(false)
		}
	}

	const metaItems = [
		data.author && (
			<span key="author" className="inline-flex items-center gap-1.5">
				<User className="size-3.5" />
				{data.author}
			</span>
		),
		data.publishedAt && (
			<span key="published" className="inline-flex items-center gap-1.5">
				<Calendar className="size-3.5" />
				{new Date(data.publishedAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				})}
			</span>
		),
		<span key="saved" className="inline-flex items-center gap-1.5">
			<Clock className="size-3.5" />
			Saved{' '}
			{new Date(data.createdAt).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})}
		</span>,
	].filter(Boolean)

	return (
		<div className="relative flex min-h-full flex-1 flex-col px-4 pt-6 pb-16 sm:px-6 lg:px-8">
			<div className="relative mx-auto w-full max-w-3xl space-y-5">
				{/* ── Back ── */}
				<Link
					to="/dashboard/items"
					className={buttonVariants({
						variant: 'outline',
						size: 'sm',
					})}
				>
					<ArrowLeftIcon className="size-3.5" />
					Items
				</Link>

				{/* ── Hero image ── */}
				{data.ogImage && (
					<div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted">
						<img
							src={data.ogImage}
							alt={data.title ?? 'Item thumbnail'}
							className="size-full object-cover object-top"
						/>
						<div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/40 to-transparent" />
					</div>
				)}

				{/* ── Header ── */}
				<div className="space-y-2">
					<h1 className="text-chart-2 text-xl font-semibold tracking-tight sm:text-2xl">
						{data.title ?? 'Untitled'}
					</h1>

					<div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground/70">
						{metaItems.map((item, i) => (
							<span key={i} className="contents">
								{i > 0 && (
									<span className="text-muted-foreground/20 select-none">
										·
									</span>
								)}
								{item}
							</span>
						))}
						<span className="text-muted-foreground/20 select-none">
							·
						</span>
						<a
							href={data.url}
							className="text-muted-foreground hover:text-foreground hover:border-border inline-flex items-center gap-1.5 rounded-md border border-border/50 px-2 py-0.5 text-xs transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="size-2.5" />
							View source
						</a>
					</div>

					<div className="flex flex-wrap items-center gap-2 pt-0.5">
						{data.tags.length > 0 &&
							data.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-md border border-primary/15 bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
								>
									{tag}
								</span>
							))}
					</div>
				</div>

				{/* ── Summary ── */}
				<Card>
					<div className="flex items-center justify-between px-4 pb-0">
						<h2
							className="text-xs font-medium uppercase tracking-wider"
							style={{ color: 'oklch(0.72 0.10 304)' }}
						>
							Summary
						</h2>

						{data.content && !data.summary && (
							<Button
								onClick={handleGenerateSummary}
								disabled={isLoading}
								size="sm"
								variant="secondary"
							>
								{isLoading ? (
									<>
										<Loader2 className="size-3.5 animate-spin" />
										Generating...
									</>
								) : (
									<>
										<Sparkles className="size-3.5" />
										Generate summary
									</>
								)}
							</Button>
						)}

						{data.summary && data.tags.length === 0 && (
							<Button
								onClick={handleGenerateTags}
								disabled={isGeneratingTags}
								size="xs"
								variant="ghost"
							>
								{isGeneratingTags ? (
									<>
										<Loader2 className="size-3 animate-spin" />
										Generating...
									</>
								) : (
									<>
										<Sparkles className="size-3" />
										Generate tags
									</>
								)}
							</Button>
						)}
					</div>

					<CardContent>
						{summaryText ? (
							<MessageResponse>{summaryText}</MessageResponse>
						) : (
							<div className="flex flex-col items-center py-4 text-center">
								<p className="text-muted-foreground/60 text-sm">
									{data.content
										? 'No summary yet. Generate one to get a quick overview.'
										: 'No content available to summarize.'}
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* ── Full content ── */}
				{data.content && (
					<Collapsible
						open={contentOpen}
						onOpenChange={setContentOpen}
					>
						<CollapsibleTrigger asChild>
							<button
								type="button"
								className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border/40 hover:bg-muted/30"
							>
								<FileText className="text-muted-foreground size-3.5" />
								<span className="text-muted-foreground group-hover:text-foreground text-xs font-medium transition-colors">
									Source content
								</span>
								<div className="flex-1" />
								<ChevronDown
									className={cn(
										'text-muted-foreground/40 size-3.5 transition-transform duration-200 group-hover:text-muted-foreground',
										contentOpen && 'rotate-180',
									)}
								/>
							</button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<Card className="mt-2">
								<CardContent className="max-w-none">
									<MessageResponse>
										{data.content}
									</MessageResponse>
								</CardContent>
							</Card>
						</CollapsibleContent>
					</Collapsible>
				)}
			</div>
		</div>
	)
}
