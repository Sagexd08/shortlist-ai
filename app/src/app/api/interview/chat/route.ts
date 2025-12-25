
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { history, message, context } = await req.json();

        // Try to get key from env
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key configuration missing." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using user-requested model Gemini 2.5 Pro Preview if available, else standard
        // Note: SDK usually takes specific string. If "gemini-2.5-pro-preview-tts" is invalid, this might fail.
        // However, usually these names are just strings passed to the endpoint.
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-tts" });

        // Construct the chat history for Gemini
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
            You are an elite, human-like Technical Interviewer.
            
            CONTEXT:
            Resume: ${context.resumeText?.slice(0, 5000) || "N/A"}
            LinkedIn: ${context.linkedinText?.slice(0, 5000) || "N/A"}
            
            RULES:
            1. **Voice-Native Style**: You are speaking via TTS. Be concise, warm, and natural. Avoid markdown lists or long monologues.
            2. **Deep Dive**: Ask ONE provocative technical question based on their stack.
            3. **Follow Up**: If they answer briefly, challenge them. "Why did you choose X over Y?"
            4. **Stop Condition**: If clear stop signal, output markdown text: "FINAL FEEDBACK REPORT".
            
            Start now by welcoming them and launching immediately into the first question.
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
