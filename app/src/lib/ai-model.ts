import { pipeline, env } from '@xenova/transformers';

// Skip local check to download from HF Hub
env.allowLocalModels = false;
env.useBrowserCache = false;

// Singleton to hold the model pipeline
let featureExtractor: any = null;

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

/**
 * Splits text into meaningful chunks (sentences/paragraphs) rather than arbitrary characters.
 */
function smartChunk(text: string): string[] {
    // Split by newlines or period+space to get sentence-like structures
    // Filter out short/empty chunks to reduce noise
    return text.split(/(?:\r\n|\r|\n|\. )+/)
        .map(c => c.trim())
        .filter(c => c.length > 50); // specialized for Resumes: ignore short headers/bullet points like "Skills"
}

/**
 * Generates embeddings for a list of text chunks.
 */
async function getEmbeddingsRaw(chunks: string[]): Promise<number[][]> {
    if (!featureExtractor) {
        console.log(`Loading Transformer model (${MODEL_NAME})...`);
        featureExtractor = await pipeline('feature-extraction', MODEL_NAME);
    }

    const embeddings: number[][] = [];

    // Process sequentially
    for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        const output = await featureExtractor(chunk, { pooling: 'mean', normalize: true });
        embeddings.push(Array.from(output.data));
    }

    return embeddings;
}

/**
 * Calculates a robust semantic match score between a Resume and Job Description.
 * Strategy: "Coverage Score"
 * 1. Decompose JD into key requirements (chunks).
 * 2. Decompose Resume into sections (chunks).
 * 3. For each JD chunk, find the BEST matching Resume chunk.
 * 4. Average these best scores to see how well the Resume covers the JD.
 */
export async function computeSemanticScore(resumeText: string, jdText: string): Promise<number> {
    const jdChunks = smartChunk(jdText);
    const resumeChunks = smartChunk(resumeText);

    if (jdChunks.length === 0 || resumeChunks.length === 0) return 0;

    const jdEmbeddings = await getEmbeddingsRaw(jdChunks);
    const resumeEmbeddings = await getEmbeddingsRaw(resumeChunks);

    let totalMaxSim = 0;

    // For each requirement in the JD...
    for (const jdVec of jdEmbeddings) {
        let maxSim = -1; // Cosine sim range is [-1, 1]

        // ...find the best supporting evidence in the Resume
        for (const resVec of resumeEmbeddings) {
            const sim = cosineSimilarity(jdVec, resVec);
            if (sim > maxSim) maxSim = sim;
        }

        // If even the best match is negative, treat as 0
        totalMaxSim += Math.max(0, maxSim);
    }

    // Average the coverage
    // If JD has 5 parts, and Resume perfectly matches 4 but completely misses 1, 
    // score should be 80%, not dragged down by the average of the whole document.
    const coverageScore = totalMaxSim / jdEmbeddings.length;

    return coverageScore * 100; // Scale to 0-100
}

/**
 * Legacy single embedding function (still useful for quick comparisons)
 */
export async function getEmbedding(text: string): Promise<number[]> {
    const embeds = await getEmbeddingsRaw([text.slice(0, 1000)]); // Limit context for single embed
    return embeds[0] || [];
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    if (vecA.length !== vecB.length) return 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}
