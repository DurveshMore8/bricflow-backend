export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export const WorkspaceRoleHierarchy: Record<WorkspaceRole, number> = {
    OWNER: 4,
    ADMIN: 3,
    DEVELOPER: 2,
    VIEWER: 1
};
