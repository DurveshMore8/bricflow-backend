import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

class TokenHelper {
    generateAccessToken(payload: object) {
        return jwt.sign(payload, ENV.JWT_SECRET!, {
            expiresIn: '1h'
        });
    }

    generateRefreshToken(payload: object) {
        return jwt.sign(payload, ENV.JWT_REFRESH_SECRET!, {
            expiresIn: '7d'
        });
    }
}

export default new TokenHelper();
