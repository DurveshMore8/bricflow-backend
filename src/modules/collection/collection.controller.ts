import { Request, Response } from 'express';
import responseHelper from '../../common/helpers/response.helper';
import collectionService from './collection.service';
import { CollectionParams } from './collection.types';

class CollectionController {
    createCollection = async (
        req: Request<CollectionParams>,
        res: Response
    ) => {
        const collection = await collectionService.createCollection(
            req.body,
            req.params.workspaceId,
            req.user!.id
        );

        return responseHelper.success(
            res,
            'Collection created',
            collection,
            201
        );
    };

    getWorkspaceCollections = async (
        req: Request<CollectionParams>,
        res: Response
    ) => {
        const collections = await collectionService.getWorkspaceCollections(
            req.params.workspaceId,
            req.user!.id
        );

        return responseHelper.success(res, 'Collections fetched', collections);
    };

    getCollectionDetails = async (
        req: Request<CollectionParams>,
        res: Response
    ) => {
        const collection = await collectionService.getCollectionDetails(
            req.params.workspaceId,
            req.params.collectionId,
            req.user!.id
        );

        return responseHelper.success(res, 'Collection fetched', collection);
    };
}

export default new CollectionController();
