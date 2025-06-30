import { Request, Response } from 'express';
import * as ExpenseCategories from '../models/expenseCategory.model';
import { sendResponse } from '../utils/response';

export class ExpenseCategoryController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        const data = await ExpenseCategories.getAllExpenseCategories(orgId, { limit, offset });
        return sendResponse(res, {
            status: 200,
            message: 'Expense categories fetched.',
            data: {
                categories: data.data,
                count: data.count,
            },
        });
    }

    static async show(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const category = await ExpenseCategories.findExpenseCategory(id, orgId);
        if (!category) {
            return sendResponse(res, { status: 404, message: 'Expense category not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Expense category fetched.',
            data: { category },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const { name, monthly_limit } = req.body;

        const category = await ExpenseCategories.createExpenseCategory({
            org_id: orgId,
            name,
            monthly_limit,
        });

        return sendResponse(res, {
            status: 201,
            message: 'Expense category created.',
            data: { category },
        });
    }

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await ExpenseCategories.findExpenseCategory(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Expense category not found.' });
        }

        const { name, monthly_limit } = req.body;

        const updated = await ExpenseCategories.updateExpenseCategory(id, orgId, {
            name,
            monthly_limit,
        });

        return sendResponse(res, {
            status: 200,
            message: 'Expense category updated.',
            data: { category: updated },
        });
    }

    static async destroy(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await ExpenseCategories.findExpenseCategory(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Expense category not found.' });
        }

        await ExpenseCategories.deleteExpenseCategory(id, orgId);

        return sendResponse(res, {
            status: 200,
            message: 'Expense category deleted.',
        });
    }
}
