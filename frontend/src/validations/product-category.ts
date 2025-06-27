import { z } from "zod";

export const ProductCategorySchema = z.object({
    id: z.number(),
    org_id: z.number(),
    name: z.string().max(100),
});


export type ProductCategory = z.infer<typeof ProductCategorySchema>