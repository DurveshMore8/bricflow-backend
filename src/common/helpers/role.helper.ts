import { WorkspaceRole } from '../../modules/workspace/workspace.types';

class RoleHelper {
    private hierarchy: Record<WorkspaceRole, number> = {
        OWNER: 4,
        ADMIN: 3,
        DEVELOPER: 2,
        VIEWER: 1
    };

    canManageRole(
        currentRole: WorkspaceRole,
        targetRole: WorkspaceRole
    ): boolean {
        return this.hierarchy[currentRole] > this.hierarchy[targetRole];
    }
}

export default new RoleHelper();
