import { z } from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    org_id: z.number(),
    category_id: z.number().nullable().optional(),
    category: z.string().nullable().optional(),
    name: z.string().max(100),
    quantity: z.number().int().nonnegative(),
    threshold: z.number().int().nonnegative().default(0),
    price: z.number().nonnegative(),
    supplier: z.string().max(100).optional(),
    notes: z.string().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

export type Product = z.infer<typeof ProductSchema>
