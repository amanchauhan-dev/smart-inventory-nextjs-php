import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(403).json({ message: 'Invalid token' });
            return
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return
    }
};
