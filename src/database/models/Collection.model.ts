import mongoose, { Document, Schema } from 'mongoose';

export interface ICollection extends Document {
    name: string;
    description?: string;
    workspaceId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
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

        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

collectionSchema.index(
    {
        workspaceId: 1,
        name: 1
    },
    {
        unique: true
    }
);

const Collection = mongoose.model<ICollection>('Collection', collectionSchema);

export default Collection;
