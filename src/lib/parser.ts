import mammoth from 'mammoth';
// @ts-ignore
import PDFParser from 'pdf2json';

export async function parseResume(buffer: Buffer, mimeType: string): Promise<string> {
    let text = '';

    try {
        if (mimeType === 'application/pdf') {
            text = await new Promise<string>((resolve, reject) => {
                // @ts-ignore
                const pdfParser = new PDFParser(null, 1); // 1 = text content only

                pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));

                pdfParser.on("pdfParser_dataReady", () => {
                    // getRawTextContent() is the method for extraction when using the event-based approach with '1' constructor
                    // However, types might be tricky. The dataReady event argument contains the JSON structure.
                    // But getRawTextContent() is a method on the instance.
                    try {
                        const raw = pdfParser.getRawTextContent();
                        resolve(raw);
                    } catch (e) {
                        reject(e);
                    }
                });

                pdfParser.parseBuffer(buffer);
            });
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
        // Return empty string or partial text instead of crashing the whole flow if possible, 
        // but throwing is okay for now as the upstream handles it.
        throw new Error("Failed to parse resume file.");
    }

    return normalizeText(text);
}

function normalizeText(text: string): string {
    if (!text) return "";

    // 1. Lowercase
    let normalized = text.toLowerCase();

    // 2. Decode URL entities sometimes present in PDF text (e.g. %20)
    try {
        normalized = decodeURIComponent(normalized);
    } catch (e) {
        // ignore
    }

    // 3. Remove special characters/noise (cleaning up pdf2json artifacts)
    // pdf2json might leave dashes or weird layout chars
    normalized = normalized.replace(/----------------Page \(\d+\) Break----------------/gm, ' ');

    // 4. Compact multiple spaces
    normalized = normalized.replace(/\s+/g, ' ');

    return normalized.trim();
}
