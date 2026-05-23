import { Request, Response } from 'express';
import responseHelper from '../../common/helpers/response.helper';

class UserController {
    profile(req: Request, res: Response) {
        return responseHelper.success(res, 'Profile fetched successfully', {
            userId: req.user?.id
        });
    }
}

export default new UserController();
