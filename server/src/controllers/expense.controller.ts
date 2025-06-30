import { Request, Response } from 'express';
import * as Expenses from '../models/expense.model';
import { sendResponse } from '../utils/response';

export class ExpenseController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const filters = {
            limit: req.query.limit ? Number(req.query.limit) : 50,
            offset: req.query.offset ? Number(req.query.offset) : 0,
            category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
            date_from: req.query.date_from as string | undefined,
            date_to: req.query.date_to as string | undefined,
        };

        const data = await Expenses.getAllExpenses(orgId, filters);
        return sendResponse(res, {
            status: 200,
            message: 'Expenses list fetched.',
            data: {
                expenses: data.data,
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

        const expense = await Expenses.findExpense(id, orgId);
        if (!expense) {
            return sendResponse(res, { status: 404, message: 'Expense not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Expense fetched.',
            data: { expense },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const { amount, date, category_id, notes } = req.body;

        const expense = await Expenses.createExpense({
            org_id: orgId,
            amount,
            date,
            category_id,
            notes,
        });

        return sendResponse(res, {
            status: 201,
            message: 'Expense created.',
            data: { expense },
        });
    }

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await Expenses.findExpense(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Expense not found.' });
        }

        const { amount, date, category_id, notes } = req.body;

        const updated = await Expenses.updateExpense(id, orgId, {
            amount,
            date,
            category_id,
            notes,
        });

        return sendResponse(res, {
            status: 200,
            message: 'Expense updated.',
            data: { expense: updated },
        });
    }

    static async destroy(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await Expenses.findExpense(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Expense not found.' });
        }

        await Expenses.deleteExpense(id, orgId);

        return sendResponse(res, {
            status: 200,
            message: 'Expense deleted.',
        });
    }
}
