import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';

const router = Router();

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bricflow API running'
    });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
