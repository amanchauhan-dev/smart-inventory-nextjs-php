import { Request, Response } from 'express';

import { sendResponse } from '../utils/response';
import * as IncomeCategories from '../models/incomeCategory.model';

export class IncomeCategoryController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        const data = await IncomeCategories.getAllIncomeCategories(orgId, { limit, offset });
        return sendResponse(res, {
            status: 200,
            message: 'Income categories fetched.',
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
        const category = await IncomeCategories.findIncomeCategory(id, orgId);
        if (!category) {
            return sendResponse(res, { status: 404, message: 'Income category not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Income category fetched.',
            data: { category },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }
        const { name } = req.body
        const category = await IncomeCategories.createIncomeCategory({
            org_id: orgId,
            name: name,
        });

        return sendResponse(res, {
            status: 201,
            message: 'Income category created.',
            data: { category },
        });
    }

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }
        const { name } = req.body


        const existing = await IncomeCategories.findIncomeCategory(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Income category not found.' });
        }

        const updated = await IncomeCategories.updateIncomeCategory(id, orgId, { name: name });

        return sendResponse(res, {
            status: 200,
            message: 'Income category updated.',
            data: { category: updated },
        });
    }

    static async destroy(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }
        const existing = await IncomeCategories.findIncomeCategory(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Income category not found.' });
        }

        await IncomeCategories.deleteIncomeCategory(id, orgId);
        return sendResponse(res, {
            status: 200,
            message: 'Income category deleted.',
        });
    }
}
