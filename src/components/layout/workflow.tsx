import { DottedBackground } from '#/components/dotted-background'
import { BookmarkCheck, Compass, Download, Globe } from 'lucide-react'
import { cn } from '#/lib/utils'

const steps = [
    {
        icon: Compass,
        title: 'Discover',
        description: 'Search the web for content worth saving.',
    },
    {
        icon: Download,
        title: 'Import',
        description: 'Save pages directly to your library by URL.',
    },
    {
        icon: BookmarkCheck,
        title: 'Organize',
        description:
            'Review, filter, and revisit saved items in one place.',
    },
]

const savedItems = [
    {
        title: 'Understanding Vector Databases',
        source: 'pinecone.io',
        status: 'Completed' as const,
        tags: ['AI/ML', 'Search'],
    },
    {
        title: 'Web Scraping Best Practices',
        source: 'scrapingbee.com',
        status: 'Completed' as const,
        tags: ['Scraping', 'Guide'],
    },
    {
        title: 'Building Real-time Pipelines',
        source: 'engineering.spotify.com',
        status: 'Pending' as const,
        tags: ['Data', 'Infra'],
    },
]

const statusStyles = {
    Completed: 'bg-primary text-primary-foreground',
    Pending: 'bg-secondary text-secondary-foreground',
} as const

export default function Workflow() {
    return (
        <section id="workflow" className="relative pt-6 pb-16 md:pt-8 md:pb-32">
            <DottedBackground className="-z-[5]" />
            <div className="mx-auto max-w-5xl space-y-6 px-6 md:space-y-10">
                <div className="max-w-xl">
                    <h2 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                        How Scouttrace works
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Discover, import, and organize web content in three
                        focused steps.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:items-center md:gap-10 lg:gap-16">
                    {/* Stylized Scouttrace preview */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-lg ring-1 ring-white/[0.03]">
                            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Globe className="size-3.5 text-muted-foreground/60" />
                                    <span className="text-xs font-medium">
                                        Saved Items
                                    </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground/50">
                                    3 items
                                </span>
                            </div>
                            <div className="divide-y divide-border/20">
                                {savedItems.map((item) => (
                                    <div
                                        key={item.title}
                                        className="space-y-2 px-4 py-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <p className="truncate text-xs font-medium text-foreground">
                                                    {item.title}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/50">
                                                    {item.source}
                                                </p>
                                            </div>
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                                    statusStyles[item.status],
                                                )}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-border/80 bg-secondary px-1.5 py-0.5 text-[9px] text-secondary-foreground"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Workflow steps */}
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <div key={step.title} className="flex gap-4">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary text-foreground">
                                    <step.icon
                                        className="size-4"
                                        aria-hidden
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
