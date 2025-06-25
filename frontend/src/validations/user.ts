import { z } from 'zod'

export const UserSchema = z.object({
    id: z.number(),
    name: z.string().max(100),
    profile: z.string(),
    email: z.string().email().max(100),
    password: z.string().min(6),
    created_at: z.string().datetime().optional()
});


export type User = z.infer<typeof UserSchema>
