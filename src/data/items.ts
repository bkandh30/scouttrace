import { createServerFn } from '@tanstack/react-start'
import { firecrawl } from '@/lib/firecrawl'
import { importSchema, extractSchema } from '@/schemas/import'
import { prisma } from '@/db'
import { authFnMiddleware } from '@/middleware/auth'
import z from 'zod'
import { bulkImportSchema } from '@/schemas/import'
import { notFound } from '@tanstack/react-router'

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

export type BulkScrapeProgress = {
    completed: number;
    total: number;
    url: string;
    status: 'success' | 'failed';
}

export const bulkScrapeUrlsFn = createServerFn({ method: 'POST' })
    .middleware([authFnMiddleware])
    .inputValidator(
        z.object({
            urls: z.array(z.url()),
        }),
    )
    .handler(async function* ({ data, context }) {
        const total = data.urls.length;

        for (let i = 0; i < data.urls.length; i++) {
            const url = data.urls[i];

            const item = await prisma.savedItem.create({
                data: {
                    url: url,
                    userId: context.session.user.id,
                    status: 'PENDING',
                },
            })

            let status: BulkScrapeProgress['status'] = 'success';

            try {
                const result = await firecrawl.scrape(url, {
                    formats: [
                        'markdown',
                        {
                            type: 'json',
                            prompt: 'Extract the article author and published date from this page. Return null when unavailable.',
                        }
                    ],
                    location: { country: 'US', languages: ['en'] },
                    onlyMainContent: true,
                    proxy: 'auto',
                })

                const jsonData = result.json as z.infer<typeof extractSchema>;

                let publishedAt = null;
                if (jsonData.publishedAt) {
                    const parsed = new Date(jsonData.publishedAt);

                    if (!isNaN(parsed.getTime())) {
                        publishedAt = parsed;
                    }
                }

                await prisma.savedItem.update({
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
                    },
                })
            } catch {
                status = 'failed';
                await prisma.savedItem.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        status: 'FAILED',
                    },
                })
            }

            const progress: BulkScrapeProgress = {
                completed: i + 1,
                total: total,
                url: url,
                status: status,
            }

            yield progress;
        }
    })

export const getItemsFn = createServerFn({ method: 'GET' })
    .middleware([authFnMiddleware])
    .handler(async ({ context }) => {
        const items = await prisma.savedItem.findMany({
            where: {
                userId: context.session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return items;
    })

export const getItemByIdFn = createServerFn({ method: 'GET' })
    .middleware([authFnMiddleware])
    .inputValidator(z.object({ id: z.string() }))
    .handler(async ({ context, data }) => {
        const item = await prisma.savedItem.findUnique({
            where: {
                userId: context.session.user.id,
                id: data.id,
            },
        })

        if (!item) {
            throw notFound()
        }

        return item
    })