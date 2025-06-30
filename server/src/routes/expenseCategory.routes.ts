import { Router } from 'express';
import { ExpenseCategoryController } from '../controllers/expenseCategory.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

export const createExpenseCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
    monthly_limit: z.string().refine((val) => Number(val) >= 0, {
        message: "monthly_limit must be a positive number",
    }).optional(),
});

export const updateExpenseCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
    monthly_limit: z.string().refine((val) => Number(val) >= 0, {
        message: "monthly_limit must be a positive number",
    }).optional(),
});


router.get('/', ExpenseCategoryController.index);
router.get('/:id', ExpenseCategoryController.show);
router.post('/', validate(createExpenseCategorySchema), ExpenseCategoryController.store);
router.put('/:id', validate(updateExpenseCategorySchema), ExpenseCategoryController.update);
router.delete('/:id', ExpenseCategoryController.destroy);

export default router;
