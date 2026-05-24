import { Request, Response } from 'express';
import responseHelper from '../../common/helpers/response.helper';
import workspaceService from './workspace.service';
import { WorkspaceMemberParams, WorkspaceParams } from './workspace.types';

class WorkspaceController {
    createWorkspace = async (req: Request, res: Response) => {
        const workspace = await workspaceService.createWorkspace(
            req.body,
            req.user!.id
        );

        return responseHelper.success(res, 'Workspace created', workspace, 201);
    };

    getUserWorkspaces = async (req: Request, res: Response) => {
        const workspaces = await workspaceService.getUserWorkspaces(
            req.user!.id
        );

        return responseHelper.success(res, 'Workspaces fetched', workspaces);
    };

    getWorkspaceDetails = async (
        req: Request<WorkspaceParams>,
        res: Response
    ) => {
        const data = await workspaceService.getWorkspaceDetails(
            req.params.id,
            req.user!.id
        );

        return responseHelper.success(res, 'Workspace fetched', data);
    };

    inviteMember = async (req: Request<WorkspaceParams>, res: Response) => {
        const member = await workspaceService.inviteMember(
            req.params.id,
            req.body,
            req.user!.id
        );

        return responseHelper.success(res, 'Member added', member);
    };

    getMembers = async (req: Request<WorkspaceParams>, res: Response) => {
        const members = await workspaceService.getWorkspaceMembers(
            req.params.id,
            req.user!.id
        );

        return responseHelper.success(res, 'Members fetched', members);
    };

    updateRole = async (req: Request<WorkspaceMemberParams>, res: Response) => {
        const member = await workspaceService.updateRole(
            req.params.id,
            req.params.userId,
            req.body.role,
            req.user!.id
        );

        return responseHelper.success(res, 'Role updated', member);
    };

    removeMember = async (
        req: Request<WorkspaceMemberParams>,
        res: Response
    ) => {
        await workspaceService.removeMember(
            req.params.id,
            req.params.userId,
            req.user!.id
        );

        return responseHelper.success(res, 'Member removed');
    };
}

export default new WorkspaceController();
