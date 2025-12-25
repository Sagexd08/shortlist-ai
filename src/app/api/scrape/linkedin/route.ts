
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }
        if (!url.includes("linkedin.com/in/")) {
            return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
        }
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch LinkedIn profile: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        let extractedData = "";

        const nameMatch = html.match(/<title>(.*?) \| LinkedIn<\/title>/) || html.match(/<meta property="og:title" content="(.*?)"/);
        if (nameMatch) extractedData += `Name: ${nameMatch[1]}\n`;

        const descMatch = html.match(/<meta property="og:description" content="(.*?)"/);
        if (descMatch) extractedData += `About: ${descMatch[1]}\n`;
        if (extractedData.length < 50) {
            return NextResponse.json({
                warning: "Profile is private or behind auth wall.",
                scrapedContent: "",
                manualActionRequired: true
            });
        }

        return NextResponse.json({
            scrapedContent: extractedData
        });

    } catch (error: any) {
        console.error("LinkedIn Scrape Error:", error);
        return NextResponse.json({
            error: "Failed to scrape LinkedIn profile. Security measures may be blocking automated access.",
            manualActionRequired: true
        }, { status: 500 });
    }
}
