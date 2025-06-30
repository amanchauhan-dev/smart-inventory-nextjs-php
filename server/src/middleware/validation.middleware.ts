import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { sendResponse } from '../utils/response';

export const validate =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body || {});
        if (!result.success) {
            const flat = result.error.flatten();
            return sendResponse(res, {
                status: 400,
                message: 'Validation failed.',
                data: { errors: flat.fieldErrors },
            });
        }
        req.body = result.data;
        next();
    };
