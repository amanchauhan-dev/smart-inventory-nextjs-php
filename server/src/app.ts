import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import IncomeCatgoriesRoutes from './routes/income-categories.routes';
import IncomeRoutes from './routes/income.routes';
import { authenticate } from './middleware/auth.middleware';
import ExpenseCatgoriesRoutes from './routes/expenseCategory.routes';
import ExpenseRoutes from './routes/expense.routes';
import ProductCatgoriesRoutes from './routes/productCategory.routes';
import ProductRoutes from './routes/product.routes';
import ProfileRoutes from './routes/profile.routes';
import UserRoutes from './routes/user.routes';
import OrganisationRoutes from './routes/organisation.routes';
import path from 'path';

const app = express();



app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);



app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "..", 'public', 'index.html'));
})

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/income-categories', authenticate, IncomeCatgoriesRoutes);
app.use('/api/incomes', authenticate, IncomeRoutes);
app.use('/api/expense-categories', authenticate, ExpenseCatgoriesRoutes);
app.use('/api/expenses', authenticate, ExpenseRoutes);
app.use('/api/product-categories', authenticate, ProductCatgoriesRoutes);
app.use('/api/products', authenticate, ProductRoutes);
app.use('/api/profile', authenticate, ProfileRoutes);
app.use('/api/users', authenticate, UserRoutes);
app.use('/api/organisation', authenticate, OrganisationRoutes);

app.get('/', (req, res) => {
    res.send('API is running 🚀');
});

export default app;
