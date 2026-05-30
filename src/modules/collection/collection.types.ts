export type CollectionParams = {
    workspaceId: string;
    collectionId: string;
};

export type CreateCollectionInput = {
    name: string;
    description?: string;
};

export type UpdateCollectionInput = {
    name?: string;
    description?: string;
};
