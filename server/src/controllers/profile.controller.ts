import { Request, Response } from 'express';
import * as Users from '../models/user.model';
import { sendResponse } from '../utils/response';

export class ProfileController {
    static async show(req: Request, res: Response) {
        const userId = req.user?.id;
        if (!userId) {
            return sendResponse(res, { status: 400, message: 'User ID missing from token.' });
        }

        const profile = await Users.findUserById(userId);
        if (!profile) {
            return sendResponse(res, { status: 404, message: 'Profile not found.' });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Profile found.',
            data: { profile },
        });
    }

    static async updateUsername(req: Request, res: Response) {
        const userId = req.user?.id;
        const { name } = req.body;

        if (!userId) {
            return sendResponse(res, { status: 400, message: 'User ID missing from token.' });
        }

        if (!name) {
            return sendResponse(res, { status: 400, message: 'Name is required.' });
        }

        const profile = await Users.updateUserName(userId, name);

        return sendResponse(res, {
            status: 200,
            message: 'Profile updated.',
            data: { profile },
        });
    }

    static async updateProfile(req: Request, res: Response) {
        const userId = req.user?.id;
        const { profileURL } = req.body;

        if (!userId) {
            return sendResponse(res, { status: 400, message: 'User ID missing from token.' });
        }

        if (!profileURL) {
            return sendResponse(res, { status: 400, message: 'Profile URL is required.' });
        }

        const profile = await Users.updateUserProfile(userId, profileURL);

        return sendResponse(res, {
            status: 200,
            message: 'Profile updated.',
            data: { profile },
        });
    }

    static async updateEmail(req: Request, res: Response) {
        const userId = req.user?.id;
        const { email } = req.body;

        if (!userId) {
            return sendResponse(res, { status: 400, message: 'User ID missing from token.' });
        }

        if (!email) {
            return sendResponse(res, { status: 400, message: 'Email is required.' });
        }

        const profile = await Users.updateUserEmail(userId, email);

        return sendResponse(res, {
            status: 200,
            message: 'Profile updated.',
            data: { profile },
        });
    }

    static async updatePassword(req: Request, res: Response) {
        const { currentPassword, newPassword } = req.body;
        const email = req.user?.email;

        if (!email) {
            return sendResponse(res, { status: 400, message: 'Email missing from token.' });
        }

        if (!currentPassword || !newPassword) {
            return sendResponse(res, { status: 400, message: 'Current and new passwords are required.' });
        }

        const user = await Users.verifyPassword(email, currentPassword);
        if (!user) {
            return sendResponse(res, { status: 401, message: 'Invalid current password.' });
        }

        const updatedProfile = await Users.updateUserPassword(user.id, newPassword);

        return sendResponse(res, {
            status: 200,
            message: 'Password changed.',
            data: { profile: updatedProfile },
        });
    }
}
