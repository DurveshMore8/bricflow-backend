import { Router } from 'express';
import authMiddleware from '../../common/middleware/auth.middleware';
import validate from '../../common/middleware/validation.middleware';
import collectionController from './collection.controller';
import { createCollectionSchema } from './collection.validation';

const router = Router({ mergeParams: true });

router.post(
    '/',
    authMiddleware,
    validate(createCollectionSchema),
    collectionController.createCollection
);

router.get('/', authMiddleware, collectionController.getWorkspaceCollections);

router.get(
    '/:collectionId',
    authMiddleware,
    collectionController.getCollectionDetails
);

router.patch(
    '/:collectionId',
    authMiddleware,
    collectionController.updateCollection
);

router.delete(
    '/:collectionId',
    authMiddleware,
    collectionController.deleteCollection
);

export default router;
