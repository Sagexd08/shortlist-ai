import { NextRequest, NextResponse } from 'next/server';
import { docClient, TABLE_NAME } from '@/lib/aws';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_req: NextRequest) {
    try {
        if (!TABLE_NAME) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = (session.user as any).id || session.user.email;
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :uid',
            ExpressionAttributeValues: {
                ':uid': userId
            },
            Limit: 20
        });

        const response = await docClient.send(command);
        const items = (response.Items || []).sort((a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return NextResponse.json(items);

    } catch (error) {
        console.error("History Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
