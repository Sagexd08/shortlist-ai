import { NextRequest, NextResponse } from 'next/server';
import { docClient, TABLE_NAME } from '@/lib/aws';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
    try {
        if (!TABLE_NAME) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 });
        }

        // In a real app, we would query by UserID (GSI)
        // For this portfolio demo, we'll scan the top 20 items (simulating a personal history)
        const command = new ScanCommand({
            TableName: TABLE_NAME,
            Limit: 20
        });

        const response = await docClient.send(command);

        // Sort by timestamp desc
        const items = response.Items?.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ) || [];

        return NextResponse.json(items);

    } catch (error) {
        console.error("History Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
