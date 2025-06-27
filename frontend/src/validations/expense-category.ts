import { z } from "zod";

export const ExpenseCategorySchema = z.object({
    id: z.number(),
    org_id: z.number(),
    name: z.string().max(100),
    monthly_limit: z.number().nonnegative().default(0),
});

export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>