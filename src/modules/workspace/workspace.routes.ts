import { Router } from 'express';
import authMiddleware from '../../common/middleware/auth.middleware';
import validate from '../../common/middleware/validation.middleware';
import workspaceController from './workspace.controller';
import {
    createWorkspaceSchema,
    inviteMemberSchema,
    updateRoleSchema
} from './workspace.validation';

const router = Router();

router.post(
    '/',
    authMiddleware,
    validate(createWorkspaceSchema),
    workspaceController.createWorkspace
);
router.get('/', authMiddleware, workspaceController.getUserWorkspaces);
router.get('/:id', authMiddleware, workspaceController.getWorkspaceDetails);
router.post(
    '/:id/members',
    authMiddleware,
    validate(inviteMemberSchema),
    workspaceController.inviteMember
);
router.get('/:id/members', authMiddleware, workspaceController.getMembers);
router.patch(
    '/:id/members/:userId',
    authMiddleware,
    validate(updateRoleSchema),
    workspaceController.updateRole
);
router.delete(
    '/:id/members/:userId',
    authMiddleware,
    workspaceController.removeMember
);

export default router;
