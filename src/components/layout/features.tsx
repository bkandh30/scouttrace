import { DottedBackground } from '#/components/dotted-background'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { BookmarkCheck, Compass, Eye } from 'lucide-react'
import type { ReactNode } from 'react'

const features = [
    {
        icon: Compass,
        title: 'Discover sources',
        description:
            'Point ScoutTrace at any URL and extract structured content — articles, docs, research — in seconds.',
    },
    {
        icon: Eye,
        title: 'Monitor updates',
        description:
            'Track pages for changes and get notified when content shifts. Less manual checking, more signal.',
    },
    {
        icon: BookmarkCheck,
        title: 'Save and organize',
        description:
            'Build a searchable library from your web finds. Tag, filter, and revisit with full-text search.',
    },
]

export default function Features() {
    return (
        <section id="features" className="relative py-16 md:py-32">
            <DottedBackground className="-z-[5]" />
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                        From discovery to saved intelligence
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Everything you need to crawl, monitor, and organize
                        web content — in one focused workflow.
                    </p>
                </div>
                <div className="mx-auto mt-10 grid max-w-sm gap-6 sm:max-w-none sm:grid-cols-3 md:mt-16">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="group text-center"
                        >
                            <CardHeader className="pb-3">
                                <IconDecorator>
                                    <feature.icon
                                        className="size-5"
                                        aria-hidden
                                    />
                                </IconDecorator>
                                <h3 className="mt-4 text-base font-medium">
                                    {feature.title}
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

const IconDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mx-auto flex size-11 items-center justify-center rounded-lg border border-border/50 bg-secondary text-foreground">
        {children}
    </div>
)
