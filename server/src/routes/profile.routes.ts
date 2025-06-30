import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

router.get('/', ProfileController.show);
router.put('/username', ProfileController.updateUsername);
router.put('/picture', ProfileController.updateProfile);
router.put('/email', ProfileController.updateEmail);
router.put('/password', ProfileController.updatePassword);

export default router;
