import { createMiddleware, createStart } from '@tanstack/react-start'
import { authMiddleware } from './middleware/auth'

const loggingMiddleware = createMiddleware({ type: 'request' }).server(
	({ request, next }) => {
		const url = new URL(request.url)
		const shouldLogServerFns = process.env.DEBUG_SERVER_FN_LOGS === 'true'

		if (url.pathname.startsWith('/_serverFn/') && !shouldLogServerFns) {
			return next()
		}

		console.log(`${request.method} ${url.pathname}`)

		return next()
	},
)

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [loggingMiddleware, authMiddleware],
	}
})
