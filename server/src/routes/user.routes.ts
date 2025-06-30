import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    role: z.enum(["staff", "admin", "superadmin"]).optional(),
    designation: z.string().optional(),
    profile: z.string().optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email."),
    role: z.enum(["staff", "admin", "superadmin"]).optional(),
    designation: z.string().optional(),
    profile: z.string().optional(),
});
const router = Router();

router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.post('/', validate(createUserSchema), UserController.store);
router.put('/:id', validate(updateUserSchema), UserController.update);
router.delete('/:id', UserController.destroy);

export default router;
