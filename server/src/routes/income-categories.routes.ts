import { Router } from 'express';
import { IncomeCategoryController } from '../controllers/incomeCategory.controller';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';


// validation

const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
});

const updateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
});

const router = Router();

router.get('/', IncomeCategoryController.index);
router.get('/:id', IncomeCategoryController.show);
router.post('/', validate(createCategorySchema), IncomeCategoryController.store);
router.put('/:id', validate(updateCategorySchema), IncomeCategoryController.update);
router.delete('/:id', IncomeCategoryController.destroy);

export default router;