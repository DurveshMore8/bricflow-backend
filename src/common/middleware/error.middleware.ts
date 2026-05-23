import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';

const errorMiddleware = (
    error: ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

export default errorMiddleware;
