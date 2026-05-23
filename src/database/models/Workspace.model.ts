import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspace extends Document {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ''
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);

export default Workspace;
