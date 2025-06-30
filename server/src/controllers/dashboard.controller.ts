import { Request, Response } from 'express';
import sql from '../config/db';
import { sendResponse } from '../utils/response';

export class DashboardController {

    static async summary(req: Request, res: Response) {
        const orgId = req.user?.org_id;

        if (!orgId) {
            return sendResponse(res, {
                status: 400,
                message: 'Organization ID not found in user data.',
                data: null,
            });
        }

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const lastDate = new Date().getDate();

        const incomeRes = await sql<{ total_income: number | null }[]>`
                            SELECT COALESCE(SUM(amount), 0)::float AS total_income
                            FROM incomes
                            WHERE org_id = ${orgId}
                                AND EXTRACT(MONTH FROM date) = ${month}
                                AND EXTRACT(YEAR FROM date) = ${year}
                                AND EXTRACT(DAY FROM date) <= ${lastDate}
                            `;
        const income = incomeRes[0]?.total_income ?? 0;

        const expenseRes = await sql<{ total_expenses: number | null }[]>`
                                SELECT COALESCE(SUM(amount), 0)::float AS total_expenses
                                FROM expenses
                                WHERE org_id = ${orgId}
                                    AND EXTRACT(MONTH FROM date) = ${month}
                                    AND EXTRACT(YEAR FROM date) = ${year}
                                    AND EXTRACT(DAY FROM date) <= ${lastDate}
                                `;
        const expenses = expenseRes[0]?.total_expenses ?? 0;

        const productRes = await sql<{ total_products: number }[]>`
                            SELECT COUNT(id)::int AS total_products
                            FROM products
                            WHERE org_id = ${orgId}
                            `;
        const products = productRes[0]?.total_products ?? 0;

        const balance = income - expenses;

        return sendResponse(res, {
            status: 200,
            message: 'Dashboard summary',
            data: {
                total_income: income.toFixed(2),
                total_expenses: expenses.toFixed(2),
                balance: balance.toFixed(2),
                products,
            },
        });
    }

    static async alerts(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, {
                status: 400,
                message: 'Organization ID not found in user data.',
                data: null,
            });
        }

        const budgetWarnings = await sql`
    SELECT c.name, c.monthly_limit,
      COALESCE(SUM(e.amount), 0)::float AS spent,
      c.id
    FROM expense_categories c
    LEFT JOIN expenses e ON e.category_id = c.id
      AND EXTRACT(MONTH FROM e.date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM e.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    WHERE c.org_id = ${orgId}
    GROUP BY c.id
    HAVING COALESCE(SUM(e.amount), 0) >= c.monthly_limit * 0.9
  `;

        const lowStockProducts = await sql`
    SELECT name, quantity, threshold, id
    FROM products
    WHERE org_id = ${orgId} AND quantity <= threshold
  `;

        return sendResponse(res, {
            status: 200,
            message: 'Alerts fetched successfully.',
            data: {
                budget_warnings: budgetWarnings,
                low_stock_products: lowStockProducts,
            },
        });
    }


    static async trends(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, {
                status: 400,
                message: 'Organization ID not found in user data.',
                data: null,
            });
        }
        let { month, year } = req.query as { month?: string; year?: string };

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const monthNum = month ? Number(month) : currentMonth;
        const yearNum = year ? Number(year) : currentYear;

        const lastDate = monthNum === currentMonth && yearNum === currentYear
            ? new Date().getDate()
            : new Date(yearNum, monthNum, 0).getDate();

        // Daily income
        const incomeData = await sql<{ day: number; total: number }[]>`
      SELECT EXTRACT(DAY FROM date)::int AS day, SUM(amount)::float AS total
      FROM incomes
      WHERE org_id = ${orgId}
        AND EXTRACT(MONTH FROM date) = ${monthNum}
        AND EXTRACT(YEAR FROM date) = ${yearNum}
        AND EXTRACT(DAY FROM date) <= ${lastDate}
      GROUP BY day
    `;
        const incomeMap = new Map(incomeData.map(row => [row.day, row.total]));

        // Daily expenses
        const expenseData = await sql<{ day: number; total: number }[]>`
      SELECT EXTRACT(DAY FROM date)::int AS day, SUM(amount)::float AS total
      FROM expenses
      WHERE org_id = ${orgId}
        AND EXTRACT(MONTH FROM date) = ${monthNum}
        AND EXTRACT(YEAR FROM date) = ${yearNum}
        AND EXTRACT(DAY FROM date) <= ${lastDate}
      GROUP BY day
    `;
        const expenseMap = new Map(expenseData.map(row => [row.day, row.total]));

        let trendData: { day: number; income: string; expense: string }[] = [];
        let totalIncome = 0;
        let totalExpense = 0;

        for (let day = 1; day <= lastDate; day++) {
            const income = incomeMap.get(day) ?? 0;
            const expense = expenseMap.get(day) ?? 0;

            trendData.push({
                day,
                income: income.toFixed(2),
                expense: expense.toFixed(2),
            });

            totalIncome += income;
            totalExpense += expense;
        }

        let trendPercent = totalExpense === 0 ? 0 : ((totalIncome - totalExpense) * 100) / totalExpense;
        if (totalExpense === 0 && totalIncome === 0) {
            trendPercent = 0;
        }

        return sendResponse(res, {
            status: 200,
            message: 'Income vs Expense trends till today.',
            data: {
                data: trendData,
                trend: trendPercent.toFixed(2),
            },
        });
    }

    static async budgetExpense(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, {
                status: 400,
                message: 'Organization ID not found in user data.',
                data: null,
            });
        }
        let { month, year } = req.query as { month?: string; year?: string };

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const monthNum = month ? Number(month) : currentMonth;
        const yearNum = year ? Number(year) : currentYear;

        const stmt = await sql`
      SELECT 
        ec.id,
        ec.name,
        ec.monthly_limit AS budget,
        COALESCE(SUM(e.amount), 0)::float AS spent
      FROM expense_categories ec
      LEFT JOIN expenses e ON e.category_id = ec.id
        AND EXTRACT(MONTH FROM e.date) = ${monthNum}
        AND EXTRACT(YEAR FROM e.date) = ${yearNum}
      WHERE ec.org_id = ${orgId}
      GROUP BY ec.id
    `;

        return sendResponse(res, {
            status: 200,
            message: `Budget - Expense trends till ${monthNum}`,
            data: { data: stmt },
        });
    }

    static async incomeCategory(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, {
                status: 400,
                message: 'Organization ID not found in user data.',
                data: null,
            });
        }
        let { month, year } = req.query as { month?: string; year?: string };

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const monthNum = month ? Number(month) : currentMonth;
        const yearNum = year ? Number(year) : currentYear;

        const stmt = await sql`
      SELECT 
        ic.id,
        ic.name AS category,
        COALESCE(SUM(i.amount), 0)::float AS income
      FROM incomes_categories ic
      LEFT JOIN incomes i ON i.category_id = ic.id
        AND EXTRACT(MONTH FROM i.date) = ${monthNum}
        AND EXTRACT(YEAR FROM i.date) = ${yearNum}
      WHERE ic.org_id = ${orgId}
      GROUP BY ic.id
    `;

        return sendResponse(res, {
            status: 200,
            message: `Income - Category trends till ${monthNum}`,
            data: { data: stmt },
        });
    }
}
