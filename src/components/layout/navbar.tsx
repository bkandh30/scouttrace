import * as React from 'react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

import { Button, buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { authClient } from '#/lib/auth-client'
import { toast } from 'sonner'

const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#workflow' },
]

export function Navbar() {
    const { data: session, isPending } = authClient.useSession()
    const navigate = useNavigate()
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: async () => {
                    await router.invalidate()
                    toast.success('Logged out successfully')
                    await navigate({ to: '/' })
                },
                onError: ({ error }) => {
                    toast.error(error.message)
                },
            },
        })
    }

    const [scrolled, setScrolled] = React.useState(false)
    const [menuOpen, setMenuOpen] = React.useState(false)

    React.useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <nav
            className={cn(
                'fixed top-0 z-50 w-full border-b transition-all duration-300',
                scrolled
                    ? 'border-border/50 bg-background/80 shadow-md backdrop-blur-xl'
                    : 'border-transparent bg-transparent',
            )}
        >
            <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-2">
                {/* Brand */}
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
                >
                    <img
                        src="/scouttrace.png"
                        alt="ScoutTrace Logo"
                        className="size-8 rounded-md object-cover"
                    />
                    <span className="text-lg font-bold tracking-tight">
                        ScoutTrace
                    </span>
                </Link>

                {/* Desktop nav links */}
                <ul className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.href}
                                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Desktop actions */}
                <div className="hidden items-center justify-end gap-2 md:flex">
                    {isPending ? null : session ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={buttonVariants({
                                    variant: 'default',
                                    size: 'sm',
                                })}
                            >
                                Dashboard
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className={buttonVariants({ size: 'sm' })}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    className="relative -mr-1 p-2 text-foreground md:hidden"
                >
                    <Menu
                        className={cn(
                            'size-5 transition-all duration-200',
                            menuOpen && 'rotate-90 scale-0 opacity-0',
                        )}
                    />
                    <X
                        className={cn(
                            'absolute inset-0 m-auto size-5 transition-all duration-200',
                            !menuOpen && '-rotate-90 scale-0 opacity-0',
                        )}
                    />
                </button>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="border-t border-border/30 bg-background/95 px-4 py-4 backdrop-blur-xl md:hidden">
                    <ul className="space-y-1">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex flex-col gap-2 border-t border-border/30 pt-3">
                        {isPending ? null : session ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={buttonVariants({ size: 'sm' })}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setMenuOpen(false)
                                        handleSignOut()
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                    })}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className={buttonVariants({ size: 'sm' })}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
