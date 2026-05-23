import { Router } from 'express';
import authMiddleware from '../../common/middleware/auth.middleware';
import userController from './user.controller';

const router = Router();

router.get('/profile', authMiddleware, userController.profile);

export default router;
