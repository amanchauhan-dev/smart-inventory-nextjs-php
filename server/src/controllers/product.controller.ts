import { Request, Response } from 'express';
import * as Products from '../models/product.model';
import { sendResponse } from '../utils/response';

export class ProductController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;
        const low_stock = req.query.low_stock === 'true';
        const search = req.query.search ? String(req.query.search) : undefined;

        const data = await Products.getAllProducts(orgId, { limit, offset, category_id, low_stock, search });

        return sendResponse(res, {
            status: 200,
            message: 'Products fetched.',
            data: {
                products: data.data,
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

        const product = await Products.findProduct(id, orgId);
        if (!product) {
            return sendResponse(res, { status: 404, message: 'Product not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Product fetched.',
            data: { product },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const { name, price, category_id, quantity, threshold, supplier, notes } = req.body;

        if (!name || !price || !category_id || !quantity) {
            return sendResponse(res, { status: 400, message: 'Name, price, category_id & quantity are required.' });
        }

        const product = await Products.createProduct({
            org_id: orgId,
            name,
            price,
            category_id,
            quantity,
            threshold,
            supplier,
            notes,
        });

        return sendResponse(res, {
            status: 201,
            message: 'Product created.',
            data: { product },
        });
    }

    static async update(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);

        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await Products.findProduct(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Product not found.' });
        }

        const { name, price, category_id, quantity, threshold, supplier, notes } = req.body;

        if (!name || !price || !category_id || !quantity) {
            return sendResponse(res, { status: 400, message: 'Name, price, category_id & quantity are required.' });
        }

        const updated = await Products.updateProduct(id, orgId, {
            name,
            price,
            category_id,
            quantity,
            threshold,
            supplier,
            notes,
        });

        return sendResponse(res, {
            status: 200,
            message: 'Product updated.',
            data: { product: updated },
        });
    }

    static async destroy(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const id = Number(req.params.id);

        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        const existing = await Products.findProduct(id, orgId);
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'Product not found.' });
        }

        await Products.deleteProduct(id, orgId);

        return sendResponse(res, {
            status: 200,
            message: 'Product deleted.',
        });
    }
}
