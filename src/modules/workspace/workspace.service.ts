import ApiError from '../../common/errors/ApiError';
import roleHelper from '../../common/helpers/role.helper';
import { withTransaction } from '../../common/helpers/transaction.helper';
import workspaceRepository from './workspace.repository';
import {
    CreateWorkspaceInput,
    InviteMemberInput,
    WorkspaceRole
} from './workspace.types';

class WorkspaceService {
    async createWorkspace(data: CreateWorkspaceInput, userId: string) {
        const workspace = await workspaceRepository.findWorkspaceByName(
            data.name,
            userId
        );

        if (workspace) {
            throw new ApiError(409, 'Workspace with same name already exists');
        }

        return withTransaction(async (session) => {
            const workspace = await workspaceRepository.createWorkspace(
                {
                    ...data,
                    owner: userId
                },
                session
            );

            await workspaceRepository.createMember(
                {
                    workspaceId: workspace._id,
                    userId,
                    role: 'OWNER'
                },
                session
            );

            return workspace;
        });
    }

    async getUserWorkspaces(userId: string) {
        return workspaceRepository.getUserWorkspaces(userId);
    }

    async getWorkspaceDetails(workspaceId: string, userId: string) {
        await this.validateWorkspaceAccess(workspaceId, userId);

        const workspace =
            await workspaceRepository.findWorkspaceById(workspaceId);

        if (!workspace) {
            throw new ApiError(404, 'Workspace not found');
        }

        return workspace;
    }

    async inviteMember(
        workspaceId: string,
        data: InviteMemberInput,
        currentUserId: string
    ) {
        const currentMember = await this.validateWorkspaceAccess(
            workspaceId,
            currentUserId
        );

        if (!roleHelper.canManageMembers(currentMember.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }

        const user = await workspaceRepository.findUserByEmail(data.email);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const existingMember = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            String(user._id)
        );

        if (existingMember) {
            throw new ApiError(409, 'User already exists');
        }

        return workspaceRepository.createMember({
            workspaceId,
            userId: user._id,
            role: data.role
        });
    }

    async getWorkspaceMembers(workspaceId: string, userId: string) {
        await this.validateWorkspaceAccess(workspaceId, userId);

        return workspaceRepository.getWorkspaceMembers(workspaceId);
    }

    async updateRole(
        workspaceId: string,
        targetUserId: string,
        role: WorkspaceRole,
        currentUserId: string
    ) {
        const currentUser = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            currentUserId
        );

        if (!currentUser) {
            throw new ApiError(403, 'Access denied');
        }

        if (!roleHelper.canManageMembers(currentUser.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }

        if (currentUserId === targetUserId) {
            throw new ApiError(400, 'Cannot change your own role');
        }

        const targetMember = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            targetUserId
        );

        if (!targetMember) {
            throw new ApiError(404, 'Member not found');
        }

        const canManage = roleHelper.canManageRole(
            currentUser.role,
            targetMember.role
        );

        if (!canManage) {
            throw new ApiError(403, 'Cannot modify this member');
        }

        return workspaceRepository.updateMemberRole(
            workspaceId,
            targetUserId,
            role
        );
    }

    async removeMember(
        workspaceId: string,
        targetUserId: string,
        currentUserId: string
    ) {
        const currentUser = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            currentUserId
        );

        if (!currentUser) {
            throw new ApiError(403, 'Access denied');
        }

        if (!roleHelper.canManageMembers(currentUser.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }

        if (currentUserId === targetUserId) {
            throw new ApiError(400, 'Cannot remove yourself');
        }

        const targetMember = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            targetUserId
        );

        if (!targetMember) {
            throw new ApiError(404, 'Member not found');
        }

        const canManage = roleHelper.canManageRole(
            currentUser.role,
            targetMember.role
        );

        if (!canManage) {
            throw new ApiError(403, 'Cannot remove this member');
        }

        return workspaceRepository.removeMember(workspaceId, targetUserId);
    }

    private async validateWorkspaceAccess(workspaceId: string, userId: string) {
        const member = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            userId
        );

        if (!member) {
            throw new ApiError(403, 'Access denied');
        }

        return member;
    }
}

export default new WorkspaceService();
