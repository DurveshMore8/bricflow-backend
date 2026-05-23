import { Router } from 'express';
import authMiddleware from '../../common/middleware/auth.middleware';
import validate from '../../common/middleware/validation.middleware';
import authController from './auth.controller';
import { loginSchema, refreshSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.post('/refresh', validate(refreshSchema), authController.refreshToken);

router.post('/logout', authMiddleware, authController.logout);

export default router;
