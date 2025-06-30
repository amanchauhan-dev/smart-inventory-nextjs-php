import { Request, Response } from 'express';
import * as userModel from '../models/user.model';
import { generateToken, PayloadType, UserRole, verifyToken } from '../utils/jwt';
import { sendResponse } from '../utils/response';
import * as organisationModel from "../models/organisation.model"

export class AuthController {
    static async register(req: Request, res: Response) {
        const { name, email, address, username, password } = req.body;

        if (!name || !email || !address || !username || !password) {
            return sendResponse(res, { status: 400, message: 'Name, email, address, username & password are required.' });
        }

        const existing = await userModel.findUserByEmail(email);
        if (existing) {
            return sendResponse(res, { status: 409, message: 'Email already registered.' });
        }

        // Create organisation
        const orgData = await organisationModel.createOrganisation({ name, address });

        // Create user
        const userData = {
            name: username,
            email,
            password,
            role: 'superadmin',
            designation: 'Owner',
            org_id: orgData.id,
        };

        const userDetail = await userModel.createUser(userData);

        return sendResponse(res, {
            status: 201,
            message: 'Organisation created.',
            data: {
                organisation: orgData,
                user: userDetail,
            },
        });
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(res, { status: 400, message: 'Email and password are required.' });
        }

        const user = await userModel.verifyPassword(email, password);
        if (!user) {
            return sendResponse(res, { status: 401, message: 'Invalid email or password.' });
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role as UserRole,
            org_id: user.org_id,
        });

        return sendResponse(res, {
            status: 200,
            message: 'Login successful.',
            data: {
                token,
                user,
            },
        });
    }

    static async me(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return sendResponse(res, { status: 401, message: 'Authorization header missing.' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyToken(token);
        if (!decoded) {
            return sendResponse(res, { status: 401, message: 'Invalid or expired token.' });
        }

        const user = await userModel.findUserById(decoded.id);
        return sendResponse(res, {
            status: 200,
            message: 'Authenticated.',
            data: { user },
        });
    }

    static async checkUniqueEmail(req: Request, res: Response) {
        const { email } = req.body;
        if (!email) {
            return sendResponse(res, { status: 400, message: 'Email required.' });
        }

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return sendResponse(res, {
                status: 200,
                message: "Email doesn't used yet.",
                data: { success: true },
            });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Email is in use.',
            data: { success: false },
        });
    }
}
