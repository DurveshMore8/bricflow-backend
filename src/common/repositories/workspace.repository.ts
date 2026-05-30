import Workspace from '../../database/models/Workspace.model';
import WorkspaceMember from '../../database/models/WorkspaceMember.model';

class WorkspaceRepository {
    async findWorkspaceById(workspaceId: string) {
        return Workspace.findOne({ workspaceId }).lean();
    }

    async findWorkspaceMember(workspaceId: string, userId: string) {
        return WorkspaceMember.findOne({ workspaceId, userId }).lean();
    }
}

export default new WorkspaceRepository();
