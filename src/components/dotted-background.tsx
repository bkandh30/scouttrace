import { cn } from '@/lib/utils'

export function DottedBackground({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 overflow-hidden',
                className,
            )}
        >
            {/* Dot grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, oklch(0.36 0.004 280 / 0.30) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />
            {/* Central vignette mask */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 55% 50% at 50% 38%, oklch(0.16 0.004 280) 0%, oklch(0.16 0.004 280 / 0.6) 50%, transparent 100%)',
                }}
            />
        </div>
    )
}
