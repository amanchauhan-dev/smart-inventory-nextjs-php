import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { PayloadType } from './utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: PayloadType;
        }
    }
}
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
