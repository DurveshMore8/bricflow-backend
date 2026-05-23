import mongoose, { Document, Schema } from 'mongoose';
import { WorkspaceRole } from '../../modules/workspace/workspace.types';

const workspaceRoles: WorkspaceRole[] = [
    'OWNER',
    'ADMIN',
    'DEVELOPER',
    'VIEWER'
];

export interface IWorkspaceMember extends Document {
    workspaceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: WorkspaceRole;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        role: {
            type: String,
            enum: workspaceRoles,
            default: 'DEVELOPER'
        }
    },
    {
        timestamps: true
    }
);

const WorkspaceMember = mongoose.model(
    'WorkspaceMember',
    workspaceMemberSchema
);

export default WorkspaceMember;
