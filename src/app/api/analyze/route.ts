import { NextRequest, NextResponse } from 'next/server';
import { docClient, TABLE_NAME } from '@/lib/aws';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { analyzeResume } from '@/lib/analysis';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resumeId, text, jdText, originalName } = body;

        if (!text || !jdText) {
            return NextResponse.json({ error: "Missing resume text or job description" }, { status: 400 });
        }

        // 1. Run Analysis Pipeline
        const analysisResult = analyzeResume(text, jdText, resumeId, originalName || "Unknown");

        // 2. Persist Results to DynamoDB
        if (TABLE_NAME) {
            try {
                await docClient.send(new PutCommand({
                    TableName: TABLE_NAME,
                    Item: analysisResult
                }));
            } catch (dbError) {
                console.error("DynamoDB Write Error:", dbError);
                // We continue even if DB fails, returning result to user is 1st priority for UX.
                // But in production, we might want to alert.
            }
        }

        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
    }
}
