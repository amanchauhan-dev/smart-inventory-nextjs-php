import { z } from "zod";

export const IncomeSchema = z.object({
    id: z.number(),
    org_id: z.number(),
    amount: z.number().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category_id: z.number(),
    category: z.string(),
    notes: z.string().optional(),
    created_at: z.string().datetime().optional(),
});


export type Income = z.infer<typeof IncomeSchema>