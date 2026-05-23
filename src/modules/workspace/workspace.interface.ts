import mongoose from 'mongoose';
import { WorkspaceRole } from './workspace.types';

export interface CreateWorkspaceRepositoryInput {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId | string;
}

export interface CreateWorkspaceMemberInput {
    workspaceId: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    role: WorkspaceRole;
}
