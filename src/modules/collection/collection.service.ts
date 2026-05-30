import ApiError from '../../common/errors/ApiError';
import roleHelper from '../../common/helpers/role.helper';
import collectionRepository from './collection.repository';
import {
    CreateCollectionInput,
    UpdateCollectionInput
} from './collection.types';

class CollectionService {
    private async validateWorkspace(workspaceId: string) {
        const workspace =
            await collectionRepository.findWorkspaceById(workspaceId);

        if (!workspace) {
            throw new ApiError(404, 'Workspace not found');
        }

        return workspace;
    }

    private async validateWorkspaceAccess(workspaceId: string, userId: string) {
        const member = await collectionRepository.findWorkspaceMember(
            workspaceId,
            userId
        );

        if (!member) {
            throw new ApiError(403, 'Access denied');
        }

        return member;
    }

    async createCollection(
        data: CreateCollectionInput,
        workspaceId: string,
        userId: string
    ) {
        await this.validateWorkspace(workspaceId);

        const currentMember = await this.validateWorkspaceAccess(
            workspaceId,
            userId
        );

        if (!roleHelper.canManageCollections(currentMember.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }

        const duplicateCollection =
            await collectionRepository.findDuplicateCollection(
                workspaceId,
                data.name
            );

        if (duplicateCollection) {
            throw new ApiError(409, 'Collection with same name already exists');
        }

        return collectionRepository.createCollection({
            ...data,
            workspaceId: workspaceId,
            createdBy: userId
        });
    }

    async getWorkspaceCollections(workspaceId: string, userId: string) {
        await this.validateWorkspace(workspaceId);

        await this.validateWorkspaceAccess(workspaceId, userId);

        return collectionRepository.findCollectionsByWorkspace(workspaceId);
    }

    async getCollectionDetails(
        workspaceId: string,
        collectionId: string,
        userId: string
    ) {
        await this.validateWorkspace(workspaceId);

        await this.validateWorkspaceAccess(workspaceId, userId);

        const collection =
            await collectionRepository.findCollectionByIdAndWorkspace(
                workspaceId,
                collectionId
            );

        if (!collection) {
            throw new ApiError(404, 'Collection not found in workspace');
        }

        return collection;
    }

    async updateCollection(
        workspaceId: string,
        collectionId: string,
        userId: string,
        data: UpdateCollectionInput
    ) {
        await this.validateWorkspace(workspaceId);

        const currentMember = await this.validateWorkspaceAccess(
            workspaceId,
            userId
        );

        if (!roleHelper.canManageCollections(currentMember.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }

        const collection =
            await collectionRepository.findCollectionByIdAndWorkspace(
                workspaceId,
                collectionId
            );

        if (!collection) {
            throw new ApiError(404, 'Collection not found in workspace');
        }

        const updatedCollection = await collectionRepository.updateCollection(
            collectionId,
            data
        );

        return updatedCollection;
    }

    async deleteCollection(
        workspaceId: string,
        collectionId: string,
        userId: string
    ) {
        await this.validateWorkspace(workspaceId);

        await this.validateWorkspaceAccess(workspaceId, userId);

        const collection =
            await collectionRepository.findCollectionByIdAndWorkspace(
                workspaceId,
                collectionId
            );

        if (!collection) {
            throw new ApiError(404, 'Collection not found in workspace');
        }

        const deletedCollection =
            await collectionRepository.deleteCollection(collectionId);

        return deletedCollection;
    }
}

export default new CollectionService();
