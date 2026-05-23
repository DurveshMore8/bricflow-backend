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

    login = async (req: Request, res: Response) => {
        const result = await authService.login(req.body);

        return responseHelper.success(res, 'Login successful', result);
    };

    refreshToken = async (req: Request, res: Response) => {
        const result = await authService.refreshToken(req.body);

        return responseHelper.success(res, 'Token refreshed', result);
    };

    logout = async (req: Request, res: Response) => {
        await authService.logout(req.user!.id);

        return responseHelper.success(res, 'Logout successful');
    };
}

export default new AuthController();
