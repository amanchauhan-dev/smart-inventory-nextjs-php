import { z } from "zod";

export const ExpenseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  category_id: z.number(),
  category: z.string(),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  notes: z.string().optional(),
  created_at: z.string().datetime().optional(),
});


export type Expense = z.infer<typeof ExpenseSchema>