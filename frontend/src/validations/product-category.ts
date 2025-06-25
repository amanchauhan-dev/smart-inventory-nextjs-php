import { z } from "zod";

export const ProductCategorySchema = z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.string().max(100),
});


export type ProductCategory = z.infer<typeof ProductCategorySchema>