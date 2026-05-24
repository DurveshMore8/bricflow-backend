import mongoose from 'mongoose';
import User from '../../database/models/User.model';
import Workspace from '../../database/models/Workspace.model';
import WorkspaceMember from '../../database/models/WorkspaceMember.model';
import {
    CreateWorkspaceMemberInput,
    CreateWorkspaceRepositoryInput
} from './workspace.interface';
import { WorkspaceRole } from './workspace.types';

class WorkspaceRepository {
    async createWorkspace(
        data: CreateWorkspaceRepositoryInput,
        session?: mongoose.ClientSession
    ) {
        return Workspace.create([data], { session }).then((docs) => docs[0]);
    }

    async createMember(
        data: CreateWorkspaceMemberInput,
        session?: mongoose.ClientSession
    ) {
        return WorkspaceMember.create([data], { session }).then(
            (docs) => docs[0]
        );
    }

    async getUserWorkspaces(userId: string) {
        return WorkspaceMember.find({
            userId
        })
            .populate('workspaceId')
            .lean();
    }

    async findWorkspaceById(workspaceId: string) {
        return Workspace.findById(workspaceId).lean();
    }

    async findUserByEmail(email: string) {
        return User.findOne({
            email
        }).lean();
    }

    async getWorkspaceMembers(workspaceId: string) {
        return WorkspaceMember.find({
            workspaceId
        })
            .populate('userId', 'name email avatar')
            .lean();
    }

    async findWorkspaceMember(workspaceId: string, userId: string) {
        return WorkspaceMember.findOne({
            workspaceId,
            userId
        }).lean();
    }

    async updateMemberRole(
        workspaceId: string,
        userId: string,
        role: WorkspaceRole
    ) {
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
}

export default new WorkspaceRepository();
