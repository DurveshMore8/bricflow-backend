import { WorkspaceRole, WorkspaceRoleHierarchy } from '../constants/roles';
import ApiError from '../errors/ApiError';
import workspaceRepository from '../repositories/workspace.repository';

export type WorkspacePermission =
    | 'WORKSPACE_UPDATE'
    | 'WORKSPACE_DELETE'
    | 'MEMBER_INVITE'
    | 'MEMBER_UPDATE'
    | 'MEMBER_REMOVE'
    | 'COLLECTION_CREATE'
    | 'COLLECTION_UPDATE'
    | 'COLLECTION_DELETE';

export const workspaceUserAccess: Record<WorkspacePermission, WorkspaceRole[]> =
    {
        WORKSPACE_UPDATE: ['OWNER'],
        WORKSPACE_DELETE: ['OWNER'],
        MEMBER_INVITE: ['OWNER', 'ADMIN'],
        MEMBER_UPDATE: ['OWNER', 'ADMIN'],
        MEMBER_REMOVE: ['OWNER', 'ADMIN'],
        COLLECTION_CREATE: ['OWNER', 'ADMIN', 'DEVELOPER'],
        COLLECTION_UPDATE: ['OWNER', 'ADMIN', 'DEVELOPER'],
        COLLECTION_DELETE: ['OWNER', 'ADMIN', 'DEVELOPER']
    };

class WorkspaceAccessService {
    async validateWorkspace(workspaceId: string) {
        const workspace =
            await workspaceRepository.findWorkspaceById(workspaceId);

        if (!workspace) {
            throw new ApiError(404, 'Workspace not found');
        }

        return workspace;
    }

    async validateWorkspaceMember(workspaceId: string, userId: string) {
        const workspace = await this.validateWorkspace(workspaceId);

        const member = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            userId
        );

        if (!member) {
            throw new ApiError(404, 'Member not found in workspace');
        }

        return { workspace, member };
    }

    async validateWorkspaceMemberAccess(
        workspaceId: string,
        userId: string,
        permissionAccessed: WorkspacePermission
    ) {
        const { workspace, member } = await this.validateWorkspaceMember(
            workspaceId,
            userId
        );

        if (!workspaceUserAccess[permissionAccessed].includes(member.role)) {
            throw new ApiError(403, "You don't have enough permissions");
        }

        return { workspace, member };
    }

    validateRoleHierarchy(
        currentRole: WorkspaceRole,
        targetRole: WorkspaceRole
    ) {
        const validRole =
            WorkspaceRoleHierarchy[currentRole] <
            WorkspaceRoleHierarchy[targetRole];

        if (!validRole) {
            throw new ApiError(403, "You don't have enough permissions");
        }
    }
}

export default new WorkspaceAccessService();
