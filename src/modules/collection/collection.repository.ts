import Collection from '../../database/models/Collection.model';
import Workspace from '../../database/models/Workspace.model';
import WorkspaceMember from '../../database/models/WorkspaceMember.model';
import {
    CreateCollectionRepositoryInput,
    UpdateCollectionRepositoryInput
} from './collection.interface';

class CollectionRepository {
    async createCollection(data: CreateCollectionRepositoryInput) {
        return Collection.create(data);
    }

    async findWorkspaceById(workspaceId: string) {
        return Workspace.findById(workspaceId).lean();
    }

    async findWorkspaceMember(workspaceId: string, userId: string) {
        return WorkspaceMember.findOne({
            workspaceId,
            userId
        }).lean();
    }

    async findCollectionById(collectionId: string) {
        return Collection.findById(collectionId).lean();
    }

    async findCollectionByIdAndWorkspace(
        workspaceId: string,
        collectionId: string
    ) {
        return Collection.find({ workspaceId, _id: collectionId })
            .populate('createdBy', 'name email avatar')
            .lean();
    }

    async findCollectionsByWorkspace(workspaceId: string) {
        return Collection.find({
            workspaceId
        })
            .sort({ createdAt: 1 })
            .populate('createdBy', 'name email avatar')
            .lean();
    }

    async findDuplicateCollection(workspaceId: string, name: string) {
        return Collection.findOne({
            workspaceId,
            name
        }).lean();
    }

    async updateCollection(
        collectionId: string,
        data: Partial<UpdateCollectionRepositoryInput>
    ) {
        return Collection.findByIdAndUpdate(collectionId, data, {
            new: true
        }).lean();
    }

    async deleteCollection(collectionId: string) {
        return Collection.findByIdAndDelete(collectionId).lean();
    }
}

export default new CollectionRepository();
