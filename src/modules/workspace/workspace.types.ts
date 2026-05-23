export type CreateWorkspaceInput = {
    name: string;
    description?: string;
};

export type InviteMemberInput = {
    email: string;
    role: WorkspaceRole;
};

export type UpdateMemberRoleInput = {
    role: WorkspaceRole;
};

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export type WorkspaceParams = {
    id: string;
};

export type WorkspaceMemberParams = {
    id: string;
    userId: string;
};
