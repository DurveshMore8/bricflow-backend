import ApiError from '../../common/errors/ApiError';
import workspaceRepository from './workspace.repository';
import {
    CreateWorkspaceInput,
    InviteMemberInput,
    WorkspaceRole
} from './workspace.types';

class WorkspaceService {
    async createWorkspace(data: CreateWorkspaceInput, userId: string) {
        const workspace = await workspaceRepository.createWorkspace({
            ...data,
            owner: userId
        });

        await workspaceRepository.createMember({
            workspaceId: workspace._id,
            userId,
            role: 'OWNER'
        });

        return workspace;
    }

    async getUserWorkspaces(userId: string) {
        return workspaceRepository.getUserWorkspaces(userId);
    }

    async getWorkspaceDetails(workspaceId: string) {
        const workspace =
            await workspaceRepository.findWorkspaceById(workspaceId);

        if (!workspace) {
            throw new ApiError(404, 'Workspace not found');
        }

        return workspace;
    }

    async inviteMember(workspaceId: string, data: InviteMemberInput) {
        const user = await workspaceRepository.findUserByEmail(data.email);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const existingMember = await workspaceRepository.findMember(
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

    async getWorkspaceMembers(workspaceId: string) {
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

        if (currentUser.role !== 'OWNER') {
            throw new ApiError(403, 'Only owner can change roles');
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

        if (targetMember.role === 'OWNER') {
            throw new ApiError(400, 'Owner role cannot be modified');
        }

        const updatedMember = await workspaceRepository.updateMemberRole(
            workspaceId,
            targetUserId,
            role
        );

        return updatedMember;
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

        if (currentUser.role !== 'OWNER') {
            throw new ApiError(403, 'Only owner can remove members');
        }

        if (currentUserId === targetUserId) {
            throw new ApiError(400, 'Owner cannot remove self');
        }

        const targetMember = await workspaceRepository.findWorkspaceMember(
            workspaceId,
            targetUserId
        );

        if (!targetMember) {
            throw new ApiError(404, 'Member not found');
        }

        return workspaceRepository.removeMember(workspaceId, targetUserId);
    }
}

export default new WorkspaceService();
