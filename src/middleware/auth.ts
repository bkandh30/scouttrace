import { createMiddleware } from '@tanstack/react-start'
import { auth } from '@/lib/auth'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { createDatabaseWakeupResponse, isDatabaseWakeupError } from '@/lib/database-errors'

const SESSION_RETRY_DELAY_MS = 500
const sessionUnavailable = Symbol('session-unavailable')

async function getSessionWithRetry(headers: Headers) {
    try {
        return await auth.api.getSession({ headers })
    } catch (error) {
        if (!isDatabaseWakeupError(error)) {
            throw error
        }

        await new Promise((resolve) => setTimeout(resolve, SESSION_RETRY_DELAY_MS))

        try {
            return await auth.api.getSession({ headers })
        } catch (retryError) {
            if (!isDatabaseWakeupError(retryError)) {
                throw retryError
            }

            return sessionUnavailable;
        }
    }
}

async function loadSession(headers: Headers) {
    let session:
        | Awaited<ReturnType<typeof auth.api.getSession>>
        | typeof sessionUnavailable

    try {
        session = await getSessionWithRetry(headers)
    } catch (error) {
        if (isDatabaseWakeupError(error)) {
            throw createDatabaseWakeupResponse()
        }

        throw error
    }

    if (session === sessionUnavailable) {
        throw createDatabaseWakeupResponse()
    }

    return session
}

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
    async ({ next }) => {
        const headers = getRequestHeaders()
        const session = await loadSession(headers)

        if (!session) {
            throw redirect({ to: '/login' })
        }

        return next({ context: { session } })
    },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
    async ({ next, request }) => {
        const url = new URL(request.url)

        if (
            !url.pathname.startsWith('/dashboard') &&
            !url.pathname.startsWith('/api/ai')
        ) {
            return next()
        }

        const headers = getRequestHeaders()
        let session: Awaited<ReturnType<typeof auth.api.getSession>>

        try {
            session = await loadSession(headers)
        } catch (error) {
            if (error instanceof Response) {
                return error
            }

            throw error
        }

        if (!session) {
            throw redirect({ to: '/login' })
        }

        return next({ context: { session } })
    }
)
