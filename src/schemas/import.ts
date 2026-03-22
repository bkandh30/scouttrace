import { ItemStatus } from '#/generated/prisma/enums'
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

export const itemsSearchSchema = z.object({
    q: z.string().default(''),
    status: z.union([z.literal('all'), z.enum(ItemStatus)]).default('all'),
})

export type ItemsSearch = z.infer<typeof itemsSearchSchema>