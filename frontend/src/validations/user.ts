import { z } from 'zod'

export const UserSchema = z.object({
    id: z.number(),
    name: z.string().max(100),
    org_id: z.number(),
    org_name: z.string().nullable(),
    org_address: z.string().nullable(),
    role: z.enum(["staff", 'admin', 'superadmin']),
    profile: z.string().nullable(),
    designation: z.string().nullable(),
    email: z.string().email().max(100),
    password: z.string().min(6),
    created_at: z.string().datetime().optional()
});


export type User = z.infer<typeof UserSchema>
