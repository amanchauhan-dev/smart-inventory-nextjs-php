import { Router } from 'express';
import { ProductCategoryController } from '../controllers/productCategory.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

export const createProductCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
});

export const updateProductCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
});
const router = Router();

router.get('/', ProductCategoryController.index);
router.get('/:id', ProductCategoryController.show);
router.post('/', validate(createProductCategorySchema), ProductCategoryController.store);
router.put('/:id', validate(updateProductCategorySchema), ProductCategoryController.update);
router.delete('/:id', ProductCategoryController.destroy);

export default router;
