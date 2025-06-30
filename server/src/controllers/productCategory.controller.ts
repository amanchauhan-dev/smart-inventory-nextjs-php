import { Request, Response } from 'express';
import * as ProductCategories from '../models/productCategory.model';
import { sendResponse } from '../utils/response';

export class ProductCategoryController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        const data = await ProductCategories.getAllCategories(orgId, { limit, offset });

        return sendResponse(res, {
            status: 200,
            message: 'Product categories fetched.',
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

        const category = await ProductCategories.findCategory(id, orgId);
        if (!category) {
            return sendResponse(res, { status: 404, message: 'Product category not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Product category fetched.',
            data: { category },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const { name } = req.body;

        const category = await ProductCategories.createCategory({
            org_id: orgId,
            name,
        });

        return sendResponse(res, {
            status: 201,
            message: 'Product category created.',
            data: { category },
        });
    }

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await ProductCategories.findCategory(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Product category not found.' });
        }

        const { name } = req.body;

        const updated = await ProductCategories.updateCategory(id, orgId, { name });

        return sendResponse(res, {
            status: 200,
            message: 'Product category updated.',
            data: { category: updated },
        });
    }

    static async destroy(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await ProductCategories.findCategory(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Product category not found.' });
        }

        await ProductCategories.deleteCategory(id, orgId);

        return sendResponse(res, {
            status: 200,
            message: 'Product category deleted.',
        });
    }
}
