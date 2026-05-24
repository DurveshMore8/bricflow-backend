import z from 'zod';

export const createCollectionSchema = z.object({
    name: z.string().trim().min(3),
    description: z.string().optional()
});
