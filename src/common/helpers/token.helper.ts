import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

class TokenHelper {
    generateAccessToken(payload: object): string {
        return jwt.sign(payload, ENV.JWT_SECRET!, {
            expiresIn: '1h'
        });
    }

    generateRefreshToken(payload: object): string {
        return jwt.sign(payload, ENV.JWT_REFRESH_SECRET!, {
            expiresIn: '7d'
        });
    }

    verifyAccessToken(token: string) {
        return jwt.verify(token, ENV.JWT_SECRET!);
    }

    verifyRefreshToken(token: string) {
        return jwt.verify(token, ENV.JWT_REFRESH_SECRET!);
    }
}

export default new TokenHelper();
