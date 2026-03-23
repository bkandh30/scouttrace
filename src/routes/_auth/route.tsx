import { createFileRoute, useRouterState, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
    component: RouteComponent,
})

function RouteComponent() {
    const pathname = useRouterState({ select: (state) => state.location.pathname })
    const isLoginRoute = pathname.startsWith('/login')
    const isSignupRoute = pathname.startsWith('/signup')
    const isCompactAuthRoute = isLoginRoute || isSignupRoute

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0">
                <div className="auth-page-glow absolute inset-x-0 top-0 h-[34rem]" />
                <div className="auth-page-grid absolute inset-0 bg-[size:4.75rem_4.75rem] opacity-[0.06]" />
                <div className="auth-page-wash absolute inset-0" />
            </div>

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-5 sm:px-6 lg:px-8">
                <div
                    className={`grid w-full gap-6 lg:gap-10 ${
                        isCompactAuthRoute
                            ? 'lg:grid-cols-[minmax(0,0.76fr)_minmax(31rem,34rem)]'
                            : 'lg:grid-cols-[minmax(0,1fr)_minmax(28rem,32rem)]'
                    }`}
                >
                    <section
                        className={`auth-brand-panel relative overflow-hidden rounded-[calc(var(--radius)*1.8)] border p-6 backdrop-blur-xl sm:p-8 ${
                            isCompactAuthRoute
                                ? isSignupRoute
                                    ? 'lg:min-h-[31rem] lg:p-7'
                                    : 'lg:min-h-[34rem] lg:p-8'
                                : 'lg:min-h-[42rem] lg:p-10'
                        } ${
                            isCompactAuthRoute ? 'hidden lg:block' : ''
                        }`}
                    >
                        <div className="auth-brand-panel-overlay absolute inset-0" />
                        <div
                            className={`relative flex h-full flex-col ${
                                isCompactAuthRoute
                                    ? isSignupRoute
                                        ? 'justify-center gap-6'
                                        : 'justify-center gap-8'
                                    : 'justify-between gap-10'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <Link
                                    to="/"
                                    className="auth-home-link inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    <span className="auth-logo-mark flex size-9 items-center justify-center rounded-2xl">
                                        <img
                                            src="/scouttrace.png"
                                            alt="ScoutTrace Logo"
                                            className="size-6 rounded-md object-cover"
                                        />
                                    </span>
                                    <span className="tracking-tight">ScoutTrace</span>
                                </Link>
                                <div className="auth-pill-muted hidden rounded-full border px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] sm:inline-flex">
                                    Research Workspace
                                </div>
                            </div>

                            <div
                                className={
                                    isCompactAuthRoute
                                        ? isSignupRoute
                                            ? 'max-w-[24rem] space-y-2'
                                            : 'max-w-[24rem] space-y-3'
                                        : 'max-w-[36rem] space-y-5'
                                }
                            >
                                <div
                                    className={
                                        isCompactAuthRoute
                                            ? isSignupRoute
                                                ? 'space-y-2'
                                                : 'space-y-3'
                                            : 'max-w-[31rem] space-y-3'
                                    }
                                >
                                    <p className="auth-kicker text-[0.72rem] font-medium uppercase tracking-[0.22em]">
                                        Focused web intelligence
                                    </p>
                                    <h1
                                        className={`max-w-[28rem] font-semibold tracking-[-0.035em] text-foreground ${
                                            isCompactAuthRoute
                                                ? 'max-w-[22rem] text-[2rem] leading-[1.1]'
                                                : 'text-3xl sm:text-[2.35rem]'
                                        }`}
                                    >
                                        {isSignupRoute
                                            ? 'ScoutTrace helps you build a durable web intelligence workspace.'
                                            : 'ScoutTrace helps you capture and organize web intelligence.'}
                                    </h1>
                                    <p
                                        className={`text-sm leading-7 ${
                                            isCompactAuthRoute
                                                ? 'auth-brand-copy max-w-[23rem]'
                                                : 'auth-brand-copy max-w-[30rem] sm:text-[0.96rem]'
                                        }`}
                                    >
                                        {isSignupRoute
                                            ? 'A calm, technical environment for saving sources, shaping summaries, and organizing research from the open web.'
                                            : 'A calm, technical workspace for building a durable research library from the open web.'}
                                    </p>
                                    {isLoginRoute ? (
                                        <p className="auth-brand-copy-subtle max-w-[22rem] text-sm leading-7">
                                            Sign in to return to your saved sources, summaries, and
                                            ongoing research flow.
                                        </p>
                                    ) : null}
                                </div>

                                <div
                                    className={`${
                                        isCompactAuthRoute
                                            ? isSignupRoute
                                                ? 'space-y-1 pt-0'
                                                : 'space-y-2 pt-1'
                                            : 'grid gap-3 sm:grid-cols-3'
                                    }`}
                                >
                                    {isCompactAuthRoute ? (
                                        <>
                                            <div className="auth-brand-list-row flex items-center gap-2 text-sm">
                                                <span className="auth-brand-list-rule h-px w-5" />
                                                {isSignupRoute
                                                    ? 'Save sources with the original page always attached'
                                                    : 'Saved sources stay connected to the original page'}
                                            </div>
                                            <div className="auth-brand-list-row flex items-center gap-2 text-sm">
                                                <span className="auth-brand-list-rule h-px w-5" />
                                                {isSignupRoute
                                                    ? 'Keep summaries and captured context in one place'
                                                    : 'Summaries and captured context remain in one place'}
                                            </div>
                                            <div className="auth-brand-list-row flex items-center gap-2 text-sm">
                                                <span className="auth-brand-list-rule h-px w-5" />
                                                Built for steady, repeatable research work
                                            </div>
                                        </>
                                    ) : null}
                                </div>

                                {isSignupRoute ? (
                                    <p className="auth-brand-note max-w-[22rem] pt-1 text-sm leading-7">
                                        Built for focused collection, clean summaries, and steady
                                        research habits over time.
                                    </p>
                                ) : null}
                            </div>

                            <div className={`auth-brand-copy hidden max-w-[30rem] text-sm leading-7 lg:block ${isCompactAuthRoute ? 'hidden' : ''}`}>
                                Secure access to your saved sources, summaries, and research
                                workflow.
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center justify-center lg:justify-end">
                        <div className="w-full max-w-[34rem] space-y-3">
                            {isCompactAuthRoute ? (
                                <Link
                                    to="/"
                                    className="auth-back-link inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors"
                                >
                                    <ArrowLeft className="size-4 text-muted-foreground" />
                                    Back to homepage
                                </Link>
                            ) : null}
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
