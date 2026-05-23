import User from '../../database/models/User.model';
import Workspace from '../../database/models/Workspace.model';
import WorkspaceMember from '../../database/models/WorkspaceMember.model';
import {
    CreateWorkspaceMemberInput,
    CreateWorkspaceRepositoryInput
} from './workspace.interface';

class WorkspaceRepository {
    async createWorkspace(data: CreateWorkspaceRepositoryInput) {
        return Workspace.create(data);
    }

    async createMember(data: CreateWorkspaceMemberInput) {
        return WorkspaceMember.create(data);
    }

    async getUserWorkspaces(userId: string) {
        return WorkspaceMember.find({
            userId
        }).populate('workspaceId');
    }

    async findWorkspaceById(workspaceId: string) {
        return Workspace.findById(workspaceId);
    }

    async findUserByEmail(email: string) {
        return User.findOne({
            email
        });
    }

    async getWorkspaceMembers(workspaceId: string) {
        return WorkspaceMember.find({
            workspaceId
        }).populate('userId', 'name email avatar');
    }

    async findMember(workspaceId: string, userId: string) {
        return WorkspaceMember.findOne({
            workspaceId,
            userId
        });
    }

    async updateMemberRole(workspaceId: string, userId: string, role: string) {
        return WorkspaceMember.findOneAndUpdate(
            { workspaceId, userId },
            { role },
            { new: true }
        );
    }

    async removeMember(workspaceId: string, userId: string) {
        return WorkspaceMember.findOneAndDelete({
            workspaceId,
            userId
        });
    }

    async findWorkspaceMember(workspaceId: string, userId: string) {
        return WorkspaceMember.findOne({
            workspaceId,
            userId
        });
    }
}

export default new WorkspaceRepository();
