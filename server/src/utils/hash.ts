import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (plain: string, hash: string) => {
    return bcrypt.compare(plain, hash);
};
