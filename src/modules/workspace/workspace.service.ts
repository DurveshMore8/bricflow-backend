import ApiError from '../../common/errors/ApiError';
import { withTransaction } from '../../common/helpers/transaction.helper';
import workspaceAccessService from '../../common/services/workspace-access.service';
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
        const { workspace } =
            await workspaceAccessService.validateWorkspaceMember(
                workspaceId,
                userId
            );

        return workspace;
    }

    async inviteMember(
        workspaceId: string,
        data: InviteMemberInput,
        currentUserId: string
    ) {
        await workspaceAccessService.validateWorkspaceMemberAccess(
            workspaceId,
            currentUserId,
            'MEMBER_INVITE'
        );

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
        await workspaceAccessService.validateWorkspaceMember(
            workspaceId,
            userId
        );

        return workspaceRepository.getWorkspaceMembers(workspaceId);
    }

    async updateRole(
        workspaceId: string,
        targetUserId: string,
        role: WorkspaceRole,
        currentUserId: string
    ) {
        if (currentUserId === targetUserId) {
            throw new ApiError(400, 'Cannot change your own role');
        }

        const currentMember = (
            await workspaceAccessService.validateWorkspaceMemberAccess(
                workspaceId,
                currentUserId,
                'MEMBER_UPDATE'
            )
        ).member;

        const targetMember = (
            await workspaceAccessService.validateWorkspaceMember(
                workspaceId,
                targetUserId
            )
        ).member;

        workspaceAccessService.validateRoleHierarchy(
            currentMember.role,
            targetMember.role
        );

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
        if (currentUserId === targetUserId) {
            throw new ApiError(400, 'Cannot remove yourself');
        }

        const currentMember = (
            await workspaceAccessService.validateWorkspaceMemberAccess(
                workspaceId,
                currentUserId,
                'MEMBER_UPDATE'
            )
        ).member;

        const targetMember = (
            await workspaceAccessService.validateWorkspaceMember(
                workspaceId,
                targetUserId
            )
        ).member;

        workspaceAccessService.validateRoleHierarchy(
            currentMember.role,
            targetMember.role
        );

        return workspaceRepository.removeMember(workspaceId, targetUserId);
    }
}

export default new WorkspaceService();
