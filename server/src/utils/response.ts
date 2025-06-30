import { Response } from 'express';

interface ResponseOptions {
    status: number;
    message: string;
    data?: any;
}

export const sendResponse = (res: Response, options: ResponseOptions) => {
    const { status, message, data } = options;

    const payload: any = {
        status,
        message,
    };

    if (data !== undefined) {
        payload.data = data;
    }

    res.status(status).json(payload);
};
