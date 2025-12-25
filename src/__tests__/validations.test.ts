import { validateRequest, AnalyzeRequestSchema, RecommendRequestSchema } from '@/lib/validations';

describe('Validation Schemas', () => {
    describe('AnalyzeRequestSchema', () => {
        it('should validate a valid analyze request', () => {
            const validRequest = {
                resumeId: 'test-123',
                text: 'This is a sample resume with enough text',
                jdText: 'This is a job description with requirements',
                originalName: 'resume.pdf',
            };

            const result = validateRequest(AnalyzeRequestSchema, validRequest);
            expect(result.success).toBe(true);
        });

        it('should reject request with missing resumeId', () => {
            const invalidRequest = {
                text: 'Sample text',
                jdText: 'Job description',
                originalName: 'resume.pdf',
            };

            const result = validateRequest(AnalyzeRequestSchema, invalidRequest);
            expect(result.success).toBe(false);
        });

        it('should reject request with short text', () => {
            const invalidRequest = {
                resumeId: 'test-123',
                text: 'Short',
                jdText: 'This is a valid job description',
                originalName: 'resume.pdf',
            };

            const result = validateRequest(AnalyzeRequestSchema, invalidRequest);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toContain('at least 10 characters');
            }
        });
    });

    describe('RecommendRequestSchema', () => {
        it('should validate request with skills array', () => {
            const validRequest = {
                skills: ['React', 'TypeScript', 'Node.js'],
                bio: 'Experienced developer',
            };

            const result = validateRequest(RecommendRequestSchema, validRequest);
            expect(result.success).toBe(true);
        });

        it('should reject empty skills array', () => {
            const invalidRequest = {
                skills: [],
                bio: 'Some bio',
            };

            const result = validateRequest(RecommendRequestSchema, invalidRequest);
            expect(result.success).toBe(false);
        });
    });
});
