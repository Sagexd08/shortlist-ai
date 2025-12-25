import { z } from 'zod';
export const AnalyzeRequestSchema = z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    text: z.string().min(10, 'Resume text must be at least 10 characters'),
    jdText: z.string().min(10, 'Job description must be at least 10 characters'),
    originalName: z.string().min(1, 'File name is required'),
    options: z.object({
        weights: z.object({
            skills: z.number().min(0).max(100).optional(),
            experience: z.number().min(0).max(100).optional(),
            education: z.number().min(0).max(100).optional(),
        }).optional(),
        strictness: z.enum(['low', 'medium', 'high']).optional(),
        customSkills: z.array(z.string()).optional(),
    }).optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

// --- Career Recommendation ---
export const RecommendRequestSchema = z.object({
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    bio: z.string().optional(),
});

export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;

// --- LinkedIn Profile ---
export const LinkedInProfileSchema = z.object({
    name: z.string().optional(),
    headline: z.string().optional(),
    skills: z.array(z.string()).optional(),
    bio: z.string().optional(),
    url: z.string().url().optional(),
    connectedAt: z.string().optional(),
});

export type LinkedInProfileData = z.infer<typeof LinkedInProfileSchema>;
export const UploadRequestSchema = z.object({
    fileName: z.string().min(1, 'File name is required'),
    fileType: z.enum(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']),
    fileSize: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
});

export type UploadRequest = z.infer<typeof UploadRequestSchema>;
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const errorMessage = result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, error: errorMessage };
}
