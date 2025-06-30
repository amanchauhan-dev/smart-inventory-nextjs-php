import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    price: z.string().refine((val) => Number(val) >= 0, {
        message: "price must be a positive number",
    }),
    category_id: z.string().refine((val) => Number(val) > 0, {
        message: "category_id must be a positive number",
    }),
    quantity: z.string().refine((val) => Number(val) >= 0, {
        message: "quantity must be a positive number",
    }),
    threshold: z.string().refine((val) => Number(val) >= 0, {
        message: "threshold must be a positive number",
    }).optional(),
    supplier: z.string().optional(),
    notes: z.string().optional(),
});

export const updateProductSchema = createProductSchema;

const router = Router();

router.get('/', ProductController.index);
router.get('/:id', ProductController.show);
router.post('/', validate(createProductSchema), ProductController.store);
router.put('/:id', validate(updateProductSchema), ProductController.update);
router.delete('/:id', ProductController.destroy);

export default router;
