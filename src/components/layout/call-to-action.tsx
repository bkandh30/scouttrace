import { Link } from '@tanstack/react-router'
import { ArrowRight, Github } from 'lucide-react'

import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export default function CallToAction() {
	return (
		<section className="relative pb-24 pt-8 md:pb-32 md:pt-12">
			{/* Subtle top glow for visual continuity */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10"
			>
				<div
					className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full"
					style={{
						background:
							'radial-gradient(ellipse at center, oklch(0.6 0.145 304 / 0.03), transparent 60%)',
					}}
				/>
			</div>

			<div className="mx-auto max-w-2xl px-6">
				<div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-8 shadow-lg ring-1 ring-white/[0.03] md:p-12">
					<p className="text-xs font-medium uppercase tracking-widest text-primary">
						Explore the project
					</p>

					<h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
						See Scouttrace in action
					</h2>

					<p className="mt-4 max-w-md text-balance text-muted-foreground">
						Discover how Scouttrace helps you find, import, and
						organize useful web content — all in one focused
						workflow.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<div className="rounded-[calc(var(--radius-xl)+0.125rem)] border border-border/40 bg-foreground/5 p-0.5">
							<Link
								to="/dashboard"
								className={cn(
									buttonVariants({ size: 'lg' }),
									'gap-2 rounded-xl px-5 text-sm',
								)}
							>
								Open Dashboard
								<ArrowRight className="size-3.5" />
							</Link>
						</div>

						<a
							href="https://github.com/bkandh30"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								buttonVariants({
									variant: 'outline',
									size: 'lg',
								}),
								'gap-2 rounded-xl px-5 text-sm',
							)}
						>
							<Github className="size-3.5" />
							View on GitHub
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}
