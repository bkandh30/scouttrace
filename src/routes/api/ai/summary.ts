import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/db'
import {
	createDatabaseWakeupResponse,
	isDatabaseWakeupError,
} from '@/lib/database-errors'
import { openrouter } from '@/lib/openrouter'
import { streamText } from 'ai'

export const Route = createFileRoute('/api/ai/summary')({
	server: {
		handlers: {
			POST: async ({ request, context }) => {
				const userId = context?.session.user.id

				if (!userId) {
					return new Response('Unauthorized action. Please login first.', {
						status: 401,
					})
				}

				const { itemId, prompt } = await request.json()
				if (!itemId || !prompt) {
					return new Response('Missing prompt or itemId', {
						status: 400,
					})
				}

				let item

				try {
					item = await prisma.savedItem.findUnique({
						where: {
							id: itemId,
							userId,
						},
					})
				} catch (error) {
					if (isDatabaseWakeupError(error)) {
						return createDatabaseWakeupResponse()
					}
					throw error
				}

				if (!item) {
					return new Response('Item not found.', { status: 404 })
				}

				const result = streamText({
					model: openrouter.chat('z-ai/glm-4.5-air:free'),
					prompt: `You are a helpful assistant that creates concise, informative summaries of web content.
                    Requirements:
                    - Be 2 paragraphs long
                    - Capture the main points and key takeaways
                    - Use a clear, professional tone

                    Content to summarize: 
                    ${prompt}`,
				})

				return result.toTextStreamResponse()
			},
		},
	},
})