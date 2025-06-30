import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';



const router = Router();

router.get('/summary', DashboardController.summary);
router.get('/alerts', DashboardController.alerts);
router.get('/trends', DashboardController.alerts);
router.get('/budget-expense', DashboardController.budgetExpense);
router.get('/income-category', DashboardController.incomeCategory);


export default router;



