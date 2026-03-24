import { DottedBackground } from '#/components/dotted-background'

const footerLinks = [
	{ label: 'Features', href: '#features' },
	{ label: 'Workflow', href: '#workflow' },
] as const

export default function FooterSection() {
	return (
		<footer className="relative overflow-hidden border-t border-border/40 pb-10 pt-10 md:pb-14 md:pt-12">
			<DottedBackground className="-z-[5] opacity-40" />

			<div className="mx-auto max-w-5xl px-6">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
						<p className="text-sm font-medium tracking-tight text-foreground">
							Scouttrace
						</p>

						<nav
							aria-label="Footer"
							className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm sm:justify-end"
						>
							{footerLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							))}

							<a
								href="https://github.com/bkandh30"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								GitHub
							</a>
						</nav>
					</div>

					<p className="text-center text-xs text-muted-foreground sm:text-left">
						© 2026 Scouttrace. Built by Bhavya Kandhari using
						TanStack Start.
					</p>
				</div>
			</div>
		</footer>
	)
}
