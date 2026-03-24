import {
    ErrorComponent,
    HeadContent,
    Scripts,
    createRootRoute,
    isRedirect,
    useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { makeTitle } from '@/lib/seo'
import { authClient } from '@/lib/auth-client'
import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;root.classList.remove('light','dark');root.classList.add('dark');root.setAttribute('data-theme','dark');root.style.colorScheme='dark';}catch(e){}})();`

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: makeTitle(),
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    errorComponent: RootErrorComponent,
    shellComponent: RootDocument,
})

function RootErrorComponent({ error }: { error: unknown }) {
    const router = useRouter()

    useEffect(() => {
        if (!isRedirect(error)) {
            return
        }

        void router.navigate(router.resolveRedirect(error).options)
    }, [error, router])

    if (isRedirect(error)) {
        return null
    }

    if (error instanceof Response) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-lg font-semibold">Request failed</h1>
                    <p className="text-sm text-muted-foreground">
                        {error.status ? `Status ${error.status}` : 'An unexpected response was returned.'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-xl">
                <ErrorComponent error={error} />
            </div>
        </div>
    )
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
                <HeadContent />
            </head>
            <body>
                <AuthSessionBridge />
                {children}
                <Toaster closeButton={true} position="bottom-center" />
                <TanStackDevtools
                    config={{
                        position: 'bottom-right',
                    }}
                    plugins={[
                        {
                            name: 'Tanstack Router',
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    )
}

function AuthSessionBridge() {
    authClient.useSession()

    return null
}
