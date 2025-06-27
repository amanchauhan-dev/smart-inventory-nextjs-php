import { z } from 'zod'

export const OrganisationSchema = z.object({
    id: z.number(),
    name: z.string().max(100),
    address: z.string(),
    created_at: z.string().datetime().optional()
});


export type Organisation = z.infer<typeof OrganisationSchema>
