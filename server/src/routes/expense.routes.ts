import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

export const createExpenseSchema = z.object({
    amount: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Amount must be a positive number",
    }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.'),
    category_id: z.string().refine((val) => Number(val) > 0, {
        message: "category_id must be a positive number",
    }),
    notes: z.string().optional(),
});

export const updateExpenseSchema = z.object({
    amount: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Amount must be a positive number",
    }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.'),
    category_id: z.string().refine((val) => Number(val) > 0, {
        message: "category_id must be a positive number",
    }),
    notes: z.string().optional(),
});

const router = Router();

router.get('/', ExpenseController.index);
router.get('/:id', ExpenseController.show);
router.post('/', validate(createExpenseSchema), ExpenseController.store);
router.put('/:id', validate(updateExpenseSchema), ExpenseController.update);
router.delete('/:id', ExpenseController.destroy);

export default router;
