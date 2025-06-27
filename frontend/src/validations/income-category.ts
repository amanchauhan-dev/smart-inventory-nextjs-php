import { z } from "zod";

export const IncomeCategorySchema = z.object({
    id: z.number(),
    org_id: z.number(),
    name: z.string().max(100),
});

export type IncomeCategory = z.infer<typeof IncomeCategorySchema>