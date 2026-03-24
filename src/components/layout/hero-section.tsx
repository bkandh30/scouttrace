import { Link } from '@tanstack/react-router'
import {
    Bookmark,
    ChevronRight,
    Compass,
    Download,
    Globe,
    Search,
} from 'lucide-react'
import { motion } from 'motion/react'

import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { Navbar } from '#/components/layout/navbar'
import { DottedBackground } from '#/components/dotted-background'

const ease = [0.25, 0.4, 0.25, 1] as const

const sidebarItems = [
    { icon: Bookmark, label: 'Items', active: true },
    { icon: Download, label: 'Import', active: false },
    { icon: Compass, label: 'Discover', active: false },
]

const previewItems = [
    {
        gradient: 'bg-gradient-to-br from-primary/15 to-primary/5',
        title: 'Understanding Vector Databases',
        author: 'James Briggs',
        status: 'Completed' as const,
        tags: ['AI/ML', 'Search'],
    },
    {
        gradient: 'bg-gradient-to-br from-accent/60 to-accent/20',
        title: 'Web Scraping Best Practices',
        author: 'ScrapingBee Team',
        status: 'Completed' as const,
        tags: ['Scraping', 'Guide'],
    },
    {
        gradient: 'bg-gradient-to-br from-secondary to-card',
        title: 'Building Real-time Pipelines',
        author: 'Spotify Engineering',
        status: 'Pending' as const,
        tags: ['Data', 'Infra'],
    },
]

export default function HeroSection() {
    return (
        <>
            <Navbar />

            <main className="relative overflow-hidden">
                {/* Subtle atmospheric glow — complements the body background gradients */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10"
                >
                    <div
                        className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, oklch(0.6 0.145 304 / 0.04), transparent 60%)',
                        }}
                    />
                    <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />
                </div>

                {/* Dot grid texture — layered above gradients, below content */}
                <DottedBackground className="-z-[5]" />

                {/* Hero content */}
                <section className="relative pt-28 md:pt-40">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            {/* Pill */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease }}
                            >
                                <Link
                                    to="/signup"
                                    className="group mx-auto flex w-fit items-center gap-2.5 rounded-full border border-border/80 bg-card/80 px-5 py-2 text-sm font-medium text-foreground/80 shadow-sm ring-1 ring-white/[0.04] transition-colors duration-200 hover:border-primary/30 hover:text-foreground"
                                >
                                    <span className="size-1.5 rounded-full bg-primary" />
                                    <span>Built for fast-moving research</span>
                                    <ChevronRight className="size-3.5 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Link>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease }}
                                className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:mt-10 lg:text-7xl"
                            >
                                Crawl pages, monitor updates, and save what
                                matters
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease }}
                                className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground md:text-lg"
                            >
                                Scouttrace helps you discover pages, monitor
                                changes, and turn scattered web information into
                                saved, readable intelligence.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease }}
                                className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row"
                            >
                                <div className="rounded-[calc(var(--radius-xl)+0.125rem)] border border-border/40 bg-foreground/5 p-0.5">
                                    <Link
                                        to="/signup"
                                        className={cn(
                                            buttonVariants({ size: 'lg' }),
                                            'rounded-xl px-5 text-base',
                                        )}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                                <a
                                    href="#demo"
                                    className="inline-flex h-9 items-center justify-center rounded-xl px-5 text-base font-medium transition-colors duration-200 bg-[oklch(0.985_0.002_280)] text-[oklch(0.16_0.004_280)] hover:bg-[oklch(0.94_0.004_280)]"
                                >
                                    View Demo
                                </a>
                            </motion.div>
                        </div>
                    </div>

                    {/* Product preview — styled after real Saved Items page */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease }}
                        className="relative mt-10 overflow-hidden px-4 sm:mt-14 md:mt-16"
                    >
                        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl ring-1 ring-white/[0.03]">
                            {/* Browser chrome */}
                            <div className="flex items-center gap-3 border-b border-border/30 px-4 py-3">
                                <div className="flex gap-1.5">
                                    <div className="size-2.5 rounded-full bg-foreground/10" />
                                    <div className="size-2.5 rounded-full bg-foreground/10" />
                                    <div className="size-2.5 rounded-full bg-foreground/10" />
                                </div>
                                <div className="flex flex-1 justify-center">
                                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-4 py-1 text-xs text-muted-foreground/60">
                                        <Globe className="size-3" />
                                        <span>
                                            scouttrace.app/dashboard/items
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard layout */}
                            <div className="flex min-h-[320px] md:min-h-[380px]">
                                {/* Sidebar */}
                                <div className="hidden w-44 shrink-0 border-r border-border/30 p-3 sm:block">
                                    <div className="mb-4 flex items-center gap-2 px-2">
                                        <img
                                            src="/scouttrace.png"
                                            alt=""
                                            className="size-5 rounded object-cover"
                                        />
                                        <span className="text-xs font-semibold">
                                            ScoutTrace
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {sidebarItems.map((item) => (
                                            <div
                                                key={item.label}
                                                className={cn(
                                                    'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs',
                                                    item.active
                                                        ? 'bg-primary/10 font-medium text-primary'
                                                        : 'text-muted-foreground/70',
                                                )}
                                            >
                                                <item.icon className="size-3.5" />
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main content area */}
                                <div className="flex-1 p-3 md:p-4">
                                    {/* Page header */}
                                    <div className="mb-3">
                                        <h2 className="text-sm font-semibold tracking-tight text-foreground">
                                            Saved Items
                                        </h2>
                                        <p className="text-[10px] text-muted-foreground/60">
                                            Your saved articles and content
                                        </p>
                                    </div>

                                    {/* Search + filter bar */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-border/30 bg-muted/20 px-2.5 py-1.5 text-[10px] text-muted-foreground/40">
                                            <Search className="size-3" />
                                            <span>Search by title or tags</span>
                                        </div>
                                        <div className="hidden rounded-lg border border-border/30 bg-muted/20 px-2.5 py-1.5 text-[10px] text-muted-foreground/40 sm:block">
                                            All Statuses
                                        </div>
                                    </div>

                                    {/* Card grid — matches real Saved Items layout */}
                                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
                                        {previewItems.map((item, i) => (
                                            <div
                                                key={i}
                                                className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
                                            >
                                                {/* OG image placeholder */}
                                                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                                    <div
                                                        className={cn(
                                                            'h-full w-full',
                                                            item.gradient,
                                                        )}
                                                    />
                                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card/50 to-transparent" />
                                                </div>

                                                {/* Card content */}
                                                <div className="space-y-1.5 p-2.5">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium',
                                                            item.status ===
                                                                'Completed'
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-secondary text-secondary-foreground',
                                                        )}
                                                    >
                                                        {item.status}
                                                    </span>
                                                    <p className="line-clamp-1 text-xs font-medium leading-snug tracking-tight text-foreground">
                                                        {item.title}
                                                    </p>
                                                    <p className="truncate text-[10px] text-muted-foreground/50">
                                                        {item.author}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        {item.tags.map(
                                                            (tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="rounded-full border border-border/80 bg-secondary px-1.5 py-0.5 text-[9px] text-secondary-foreground"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom fade into page background */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
                    </motion.div>
                </section>
            </main>
        </>
    )
}
