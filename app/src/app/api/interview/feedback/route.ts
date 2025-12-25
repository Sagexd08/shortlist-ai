
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { history, context } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
        ROLE: Expert Technical Interviewer.
        TASK: Grade this interview.
        
        TRANSCRIPT:
        ${JSON.stringify(history)}
        
        OUTPUT FORMAT (Markdown):
        # Interview Feedback
        
        ## Score: [0-100]
        
        ## Strengths
        - [Point 1]
        
        ## Weaknesses
        - [Point 2]
        
        ## Judgment
        [Hire/No Hire]
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const feedback = response.text();

        return NextResponse.json({ feedback });

    } catch (error: any) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
