import { createServerFn } from '@tanstack/react-start'
import { firecrawl } from '@/lib/firecrawl'
import { importSchema, extractSchema } from '@/schemas/import'
import { prisma } from '@/db'
import { authFnMiddleware } from '@/middleware/auth'
import z from 'zod'
import { bulkImportSchema } from '@/schemas/import'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
    .middleware([authFnMiddleware])
    .inputValidator(importSchema)
    .handler(async ({ data, context }) => {

        const item = await prisma.savedItem.create({
            data: {
                url: data.url,
                userId: context.session.user.id,
                status: 'PROCESSING',
            }
        })

        try {
            const result = await firecrawl.scrape(data.url, {
                    formats: [
                        'markdown',
                        {
                            type: 'json',
                            prompt: 'Extract the article author and published date from this page. Return null when unavailable.',
                            // schema: extractSchema,
                        },
                    ],
                    location: { country: 'US', languages: ['en'] },
                    onlyMainContent: true,
                    proxy: 'auto',
                }
            )

            const jsonData = result.json as z.infer<typeof extractSchema>;
            
            let publishedAt = null;
            if (jsonData.publishedAt) {
                const parsed = new Date(jsonData.publishedAt);

                if (!isNaN(parsed.getTime())) {
                    publishedAt = parsed;
                }
            }

            const updatedItem = await prisma.savedItem.update({
                where: {
                    id: item.id,
                },
                data: {
                    title: result.metadata?.title || null,
                    content: result.markdown || null,
                    ogImage: result.metadata?.ogImage || null,
                    author: jsonData.author || null,
                    publishedAt: publishedAt,
                    status: 'COMPLETED',
                }
            })

            return updatedItem;
        } catch {
            const failedItem = await prisma.savedItem.update({
                where: {
                    id: item.id,
                },
                data: {
                    status: 'FAILED',
                },
            })
            return failedItem;
        }
    })


export const mapUrlFn = createServerFn({ method: 'POST' })
    .middleware([authFnMiddleware])
    .inputValidator(bulkImportSchema)
    .handler(async ({ data }) => {
        const result = await firecrawl.map(data.url, {
            limit: 10,
            search: data.search,
            location: {
                country: 'US',
                languages: ['en'],
            },
        })

        return result.links;
    })