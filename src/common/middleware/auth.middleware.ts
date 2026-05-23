import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import tokenHelper from '../helpers/token.helper';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Unauthorized'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = tokenHelper.verifyAccessToken(token) as { id: string };

        req.user = {
            id: decoded.id
        };

        next();
    } catch (e) {
        console.error('Token verification failed:', e);
        return next(new ApiError(401, 'Invalid token'));
    }
};

export default authMiddleware;
