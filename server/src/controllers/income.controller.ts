import { Request, Response } from 'express';
import * as IncomeModel from '../models/income.model';
import { sendResponse } from '../utils/response';


export class IncomeController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        const data = await IncomeModel.getAllIncomes(orgId, { limit, offset });
        return sendResponse(res, {
            status: 200,
            message: 'Income list fetched.',
            data: {
                incomes: data.data,
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

        const income = await IncomeModel.findIncome(id, orgId);
        if (!income) {
            return sendResponse(res, { status: 404, message: 'Income not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Income fetched.',
            data: { income },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const data = req.body;
        const newIncome = await IncomeModel.createIncome({
            org_id: orgId,
            amount: data.amount,
            date: data.date,
            category_id: data.category_id,
            notes: data.notes || undefined,
        });

        return sendResponse(res, {
            status: 201,
            message: 'Income created.',
            data: { income: newIncome },
        });
    }

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const data = req.body
        const existing = await IncomeModel.findIncome(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Income not found.' });
        }

        const updated = await IncomeModel.updateIncome(id, orgId, {
            amount: data.amount,
            date: data.date,
            category_id: data.category_id,
            notes: data.notes || undefined,
        });

        return sendResponse(res, {
            status: 200,
            message: 'Income updated.',
            data: { income: updated },
        });
    }

    static async destroy(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await IncomeModel.findIncome(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Income not found.' });
        }

        await IncomeModel.deleteIncome(id, orgId);
        return sendResponse(res, {
            status: 200,
            message: 'Income deleted.',
        });
    }
}
