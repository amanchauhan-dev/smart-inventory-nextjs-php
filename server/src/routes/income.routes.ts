import { Router } from 'express';
import { IncomeController } from '../controllers/income.controller';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';




// Zod schemas
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createIncomeSchema = z.object({
    amount: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Amount must be a positive number",
    }),
    date: z
        .string()
        .regex(dateRegex, 'Date must be in YYYY-MM-DD format.'),
    category_id: z.string().refine((val) => Number(val) > 0, {
        message: "category_id must be a positive number",
    }),
    notes: z.string().optional(),
});

const updateIncomeSchema = z.object({
    amount: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Amount must be a positive number",
    }),
    date: z
        .string()
        .regex(dateRegex, 'Date must be in YYYY-MM-DD format.'),
    category_id: z.string().refine((val) => Number(val) > 0, {
        message: "category_id must be a positive number",
    }),
    notes: z.string().optional(),
});



const router = Router();

router.get('/', IncomeController.index);
router.get('/:id', IncomeController.show);
router.post('/', validate(createIncomeSchema), IncomeController.store);
router.put('/:id', validate(updateIncomeSchema), IncomeController.update);
router.delete('/:id', IncomeController.destroy);

export default router;