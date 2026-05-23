import { Request, Response } from 'express';

import responseHelper from '../../common/helpers/response.helper';
import authService from './auth.service';

class AuthController {
    register = async (req: Request, res: Response) => {
        const result = await authService.register(req.body);

        return responseHelper.success(
            res,
            'User registered successfully',
            result,
            201
        );
    };
}

export default new AuthController();
