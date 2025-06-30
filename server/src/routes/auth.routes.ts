import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';



export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    address: z.string().min(1, 'Address is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string(),
});

export const checkMailSchema = z.object({
    email: z.string().email('Invalid email'),
});

const router = Router();
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', AuthController.me);
router.post('/check-email', validate(checkMailSchema), AuthController.checkUniqueEmail);

export default router;



