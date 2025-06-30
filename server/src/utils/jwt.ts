import jwt from 'jsonwebtoken';

export type UserRole = 'staff' | 'admin' | 'superadmin';

export type PayloadType = {
    id: number;
    email: string;
    role: UserRole;
    org_id: number;
};

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// Generate token
export const generateToken = (payload: PayloadType): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

// Verify and decode token
export const verifyToken = (token: string): PayloadType | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as PayloadType;
        return decoded;
    } catch (err) {
        // Token invalid or expired
        return null;
    }
};
