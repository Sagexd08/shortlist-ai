import { pipeline, env } from '@xenova/transformers';

// Skip local check to download from HF Hub
env.allowLocalModels = false;
env.useBrowserCache = false;

// Singleton to hold the model pipeline
let featureExtractor: any = null;

export async function getEmbedding(text: string): Promise<number[]> {
    if (!featureExtractor) {
        console.log("Loading Transformer model...");
        // 'feature-extraction' task for embeddings
        featureExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    // Generate embedding
    // mean_pooling: true ensures we get a single vector for the sentence
    const output = await featureExtractor(text, { pooling: 'mean', normalize: true });

    // Convert Float32Array to regular array
    return Array.from(output.data);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

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
