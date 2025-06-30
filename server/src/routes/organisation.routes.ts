import { Router } from 'express';
import { OrganisationController } from '../controllers/organisation.controller';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';


export const updateSchema = z.object({
    name: z.string().min(1, "Name is required."),
    address: z.string().min(10, "Address must be atleast 10 characters long")
});
const router = Router();


router.put('/', validate(updateSchema), OrganisationController.update);

export default router;
