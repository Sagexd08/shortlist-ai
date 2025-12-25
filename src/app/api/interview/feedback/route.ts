
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { history, context } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        ROLE: Expert Technical Interviewer.
        TASK: Analyze the following interview transcript and provide a detailed structured feedback report.
        
        CANDIDATE CONTEXT:
        Resume Summary: ${context.resumeText?.slice(0, 1000)}...
        
        TRANSCRIPT:
        ${JSON.stringify(history)}
        
        OUTPUT FORMAT (Markdown):
        # Interview Feedback Report
        
        ## 1. Executive Summary
        [Brief overview of performance]
        
        ## 2. Technical Assessment
        - **Strong Areas**: [List]
        - **Areas for Improvement**: [List]
        
        ## 3. Communication Style
        [Analysis of clarity, confidence, and conciseness]
        
        ## 4. Final Recommendation
        [Hire / No Hire / Lean Hire] - providing justification.
        
        Provide constructive, specific feedback based *only* on the transcript provided.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const feedback = response.text();

        return NextResponse.json({ feedback });

    } catch (error: any) {
        console.error("Feedback Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
}
