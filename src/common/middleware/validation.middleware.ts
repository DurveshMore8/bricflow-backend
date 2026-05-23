import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(new Error(result.error.issues[0].message));
        }

        req.body = result.data;

        next();
    };
};

export default validate;
