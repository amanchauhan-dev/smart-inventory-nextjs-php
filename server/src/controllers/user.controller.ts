import { Request, Response } from 'express';
import * as Users from '../models/user.model';
import { sendResponse } from '../utils/response';

export class UserController {
    static async index(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organisation ID missing.' });
        }

        const { limit, offset, search, role } = req.query as any;

        const filters = {
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
            search: search || undefined,
            role: role || undefined,
        };

        const data = await Users.getAllUsers(orgId, filters);

        return sendResponse(res, {
            status: 200,
            message: 'Users fetched.',
            data: { users: data.data, count: data.count },
        });
    }

    static async show(req: Request, res: Response) {
        const { id } = req.params;

        const user = await Users.findUserById(Number(id));
        if (!user) {
            return sendResponse(res, { status: 404, message: 'User not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'User fetched.',
            data: { user },
        });
    }

    static async store(req: Request, res: Response) {
        const orgId = req.user?.org_id;
        const { name, email, password, role, designation, profile } = req.body;
        if (!orgId) {
            return sendResponse(res, { status: 400, message: 'Organization ID missing from token.' });
        }

        if (!name || !email || !password) {
            return sendResponse(res, { status: 400, message: 'Name, email & password are required.' });
        }

        if (role && !['staff', 'admin', 'superadmin'].includes(role)) {
            return sendResponse(res, { status: 400, message: 'Invalid role.' });
        }

        const existing = await Users.findUserByEmail(email);
        if (existing) {
            return sendResponse(res, { status: 409, message: 'Email already registered.' });
        }

        const user = await Users.createUser({
            name,
            email,
            password,
            org_id: orgId,
            designation,
            role,
            profile,
        });

        return sendResponse(res, {
            status: 201,
            message: 'User created.',
            data: { user },
        });
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, role, designation, profile } = req.body;

        if (!name || !email) {
            return sendResponse(res, { status: 400, message: 'Name & email are required.' });
        }

        if (role && !['staff', 'admin', 'superadmin'].includes(role)) {
            return sendResponse(res, { status: 400, message: 'Invalid role.' });
        }

        const existing = await Users.findUserByEmail(email);
        if (existing && existing.id !== Number(id)) {
            return sendResponse(res, { status: 409, message: 'Email already registered.' });
        }

        await Users.updateUser(Number(id), {
            name,
            email,
            designation,
            role,
            profile,
        });

        const updatedUser = await Users.findUserById(Number(id));

        return sendResponse(res, {
            status: 201,
            message: 'User updated.',
            data: { user: updatedUser },
        });
    }

    static async destroy(req: Request, res: Response) {
        const { id } = req.params;

        const existing = await Users.findUserById(Number(id));
        if (!existing) {
            return sendResponse(res, { status: 404, message: 'User not found.' });
        }

        await Users.deleteUser(Number(id));

        return sendResponse(res, {
            status: 200,
            message: 'User deleted.',
        });
    }
}
