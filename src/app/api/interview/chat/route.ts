
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { history, message, context } = await req.json();
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key configuration missing." }, { status: 500 });
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const formattedHistory = history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
        });

        let prompt = message;
        if (history.length === 0) {
            prompt = `
            SYSTEM INSTRUCTION:
            You are an expert Technical Interviewer for a software engineering role.
            
            CANDIDATE CONTEXT:
            Resume Summary: ${context.resumeText?.slice(0, 5000) || "Not provided"}
            LinkedIn Profile: ${context.linkedinText?.slice(0, 5000) || "Not provided"}
            
            RULES:
            1. Conduct a realistic live interview.
            2. Ask ONE question at a time.
            3. Do NOT provide feedback after each answer. Just acknowledge and move to the next relevant question.
            4. Dig deep. If the answer is vague, ask a follow-up.
            5. Keep your responses conversational and concise (suitable for Text-to-Speech). Avoid long lists.
            6. If the user indicates they are done or says "End Interview", STOP asking questions and provide a "FINAL FEEDBACK REPORT" in markdown format, grading them on technical depth, communication, and clarity.
            
            Start by briefly welcoming the candidate and asking the first technical question based on their experience.
            `;

            if (message) {
                prompt += `\n\nUser: ${message}`;
            }
        }

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Gemini Chat Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
    }
}
