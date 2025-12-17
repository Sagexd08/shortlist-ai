import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseResume(buffer: Buffer, mimeType: string): Promise<string> {
    let text = '';

    try {
        if (mimeType === 'application/pdf') {
            const data = await pdf(buffer);
            text = data.text;
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }
    } catch (error) {
        console.error("Parser Error:", error);
        throw new Error("Failed to parse resume file.");
    }

    return normalizeText(text);
}

function normalizeText(text: string): string {
    if (!text) return "";

    // 1. Lowercase
    let normalized = text.toLowerCase();

    // 2. Remove special characters but keep alphanumeric, basic punctuation, and newlines
    // We want to keep logical structure for some heuristics, so we won't be too aggressive yet.
    // We'll replace tabs/multiple spaces with single space.
    normalized = normalized.replace(/[\t\r]/g, ' ');

    // 3. Compact multiple spaces
    normalized = normalized.replace(/\s+/g, ' ');

    // 4. Basic noise removal (optional - can be expanded)
    // Remove non-ascii if necessary, but names might have accents. 
    // For now, let's keep it simple.

    return normalized.trim();
}
