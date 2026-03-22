import z from 'zod'

export const importSchema = z.object({
    url: z.url(),
})

export const bulkImportSchema = z.object({
    url: z.url(),
    search: z.string(),
})

export const extractSchema = z.object({
    author: z.string().nullable().optional(),
    publishedAt: z.string().nullable().optional(),
})

export type ExtractData = z.infer<typeof extractSchema>

export const searchSchema = z.object({
    query: z.string().min(1),
})