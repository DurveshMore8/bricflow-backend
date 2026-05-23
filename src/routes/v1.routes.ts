import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bricflow API running'
    });
});

router.use('/auth', authRoutes);

export default router;
