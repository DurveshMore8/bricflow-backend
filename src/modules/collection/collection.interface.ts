import mongoose from 'mongoose';

export interface CreateCollectionRepositoryInput {
    name: string;
    description?: string;
    workspaceId: mongoose.Types.ObjectId | string;
    createdBy: mongoose.Types.ObjectId | string;
}

export interface UpdateCollectionRepositoryInput {
    name: string;
    description?: string;
}
