import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, BUCKET_NAME } from '@/lib/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { parseResume } from '@/lib/parser';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileId = uuidv4();
        const ext = file.name.split('.').pop()?.toLowerCase();
        const key = `resumes/${fileId}.${ext}`;

        // 1. Parse Text immediately (fail fast if invalid)
        let text = "";
        try {
            text = await parseResume(buffer, file.type);
        } catch (error) {
            console.error("Parsing failed:", error);
            return NextResponse.json({ error: "Failed to read resume text. Please ensure it is a valid PDF or DOCX." }, { status: 422 });
        }

        // 2. Upload to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            Metadata: {
                originalName: file.name
            }
        }));

        // 3. Return ID and Text to client
        return NextResponse.json({
            id: fileId,
            key: key,
            originalName: file.name,
            text: text
        });

    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({
            error: "Internal Server Error during upload",
            details: error.message || String(error)
        }, { status: 500 });
    }
}
