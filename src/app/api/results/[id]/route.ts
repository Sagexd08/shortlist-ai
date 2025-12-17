import { NextRequest, NextResponse } from 'next/server';
import { docClient, TABLE_NAME } from '@/lib/aws';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id || !TABLE_NAME) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const result = await docClient.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
        }));

        if (!result.Item) {
            return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
        }

        return NextResponse.json(result.Item);

    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
    }
}
