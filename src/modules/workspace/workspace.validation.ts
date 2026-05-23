import { z } from 'zod';

export const createWorkspaceSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional()
});

export const inviteMemberSchema = z.object({
    email: z.email(),
    role: z.enum(['ADMIN', 'DEVELOPER', 'VIEWER'])
});

export const updateRoleSchema = z.object({
    role: z.enum(['ADMIN', 'DEVELOPER', 'VIEWER'])
});
