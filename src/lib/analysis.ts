import { Skill, SkillCategory, ScoredSkill, MissingSkill, AnalysisResult } from './types';
import natural from 'natural';
// @ts-ignore
import computeCosineSimilarity from 'compute-cosine-similarity';
// @ts-ignore
import stopword from 'stopword';

// --- DATA: Skill Taxonomy (Extensible) ---
// In a real app, this might come from a DB or separate JSON file.
const SKILL_TAXONOMY: Record<string, SkillCategory> = {
    // Languages
    "python": "Core Technical", "javascript": "Core Technical", "typescript": "Core Technical",
    "java": "Core Technical", "c++": "Core Technical", "go": "Core Technical", "rust": "Core Technical",
    "sql": "Core Technical", "html": "Core Technical", "css": "Core Technical",

    // Frameworks/Libs
    "react": "Tools & Frameworks", "next.js": "Tools & Frameworks", "node.js": "Tools & Frameworks",
    "django": "Tools & Frameworks", "flask": "Tools & Frameworks", "fastapi": "Tools & Frameworks",
    "spring": "Tools & Frameworks", "boot": "Tools & Frameworks", "tensorflow": "Tools & Frameworks",
    "pytorch": "Tools & Frameworks", "scikit-learn": "Tools & Frameworks", "pandas": "Tools & Frameworks",
    "numpy": "Tools & Frameworks", "aws": "Tools & Frameworks", "azure": "Tools & Frameworks",
    "gcp": "Tools & Frameworks", "docker": "Tools & Frameworks", "kubernetes": "Tools & Frameworks",
    "terraform": "Tools & Frameworks", "serverless": "Tools & Frameworks", "dynamodb": "Tools & Frameworks",
    "vercel": "Tools & Frameworks",

    // Soft Skills (often harder to match exactly, but we try keywords)
    "leadership": "Soft Skills", "communication": "Soft Skills", "teamwork": "Soft Skills",
    "problem solving": "Soft Skills", "agile": "Soft Skills", "scrum": "Soft Skills",
    "mentorship": "Soft Skills", "collaboration": "Soft Skills",
};

// --- CORE ANALYZER ---

export function analyzeResume(resumeText: string, jdText: string, resumeId: string, originalFileName: string): AnalysisResult {
    const timestamp = new Date().toISOString();

    // 1. Extract Skills
    const resumeSkills = extractSkills(resumeText);
    const jdSkills = extractSkills(jdText);

    // 2. Semantic Analysis
    const similarity = computeSemanticSimilarity(resumeText, jdText);

    // 3. Gap Analysis
    const { missing, present, extra, skillMatchScore } = analyzeSkillGaps(resumeSkills, jdSkills);

    // 4. Keyword Coverage
    const keywordCoverage = computeKeywordCoverage(resumeText, jdText);

    // 5. Final Scoring
    // Weights: Semantic (40%), Skills (40%), Keywords (20%)
    const rawScore = (similarity * 40) + (skillMatchScore * 40) + (keywordCoverage * 20);
    const matchScore = Math.min(100, Math.max(0, Math.round(rawScore))); // Clamp 0-100

    const shortlistProbability = computeShortlistProbability(matchScore, resumeSkills.length, missing.length);

    // 6. Generate Insights
    const strengths = generateStrengths(present, extra, matchScore);
    const summary = generateSummary(matchScore, shortlistProbability, missing.length);

    return {
        id: `AN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        resumeId,
        originalFileName,
        timestamp,
        matchScore,
        shortlistProbability,
        presentSkills: present,
        missingSkills: missing,
        extraSkills: extra,
        strengths,
        summary,
        parsingMetadata: {
            wordCount: resumeText.split(/\s+/).length,
            detectedFormat: "extracted-text" // simplified
        }
    };
}

// --- HELPERS ---

function extractSkills(text: string): Skill[] {
    const foundSkills: Skill[] = [];
    const normalizedText = text.toLowerCase();

    // Naive keyword matching against taxonomy
    // In production, we'd use regex with boundaries \bword\b
    for (const [skill, category] of Object.entries(SKILL_TAXONOMY)) {
        // Escape special regex chars if any (simplified here)
        const regex = new RegExp(`\\b${skill}\\b`, 'i');
        if (regex.test(normalizedText)) {
            foundSkills.push({ name: skill, category });
        }
    }
    return foundSkills;
}

function computeSemanticSimilarity(text1: string, text2: string): number {
    const tokenizer = new natural.WordTokenizer();
    const tokens1 = tokenizer.tokenize(text1.toLowerCase());
    const tokens2 = tokenizer.tokenize(text2.toLowerCase());

    // Remove stopwords
    // @ts-ignore
    const clean1 = stopword.removeStopwords(tokens1);
    // @ts-ignore
    const clean2 = stopword.removeStopwords(tokens2);

    // Create frequency vectors
    const vocabulary = Array.from(new Set([...clean1, ...clean2]));
    const vec1 = new Array(vocabulary.length).fill(0);
    const vec2 = new Array(vocabulary.length).fill(0);

    clean1.forEach((t: string) => { const i = vocabulary.indexOf(t); if (i >= 0) vec1[i]++; });
    clean2.forEach((t: string) => { const i = vocabulary.indexOf(t); if (i >= 0) vec2[i]++; });

    const similarity = computeCosineSimilarity(vec1, vec2) || 0;
    return similarity * 100; // normalize 0-100
}

function analyzeSkillGaps(resumeSkills: Skill[], jdSkills: Skill[]) {
    const resumeSkillNames = new Set(resumeSkills.map(s => s.name));
    const jdSkillNames = new Set(jdSkills.map(s => s.name));

    const present: Skill[] = [];
    const missing: MissingSkill[] = [];
    const extra: Skill[] = [];

    // Check JD skills
    jdSkills.forEach(skill => {
        if (resumeSkillNames.has(skill.name)) {
            present.push(skill);
        } else {
            missing.push({ ...skill, relevance: 'High' }); // Default high for straight matches
        }
    });

    // Identify extra
    resumeSkills.forEach(skill => {
        if (!jdSkillNames.has(skill.name)) {
            extra.push(skill);
        }
    });

    const matchCount = present.length;
    const totalRequired = jdSkills.length;
    const skillMatchScore = totalRequired === 0 ? 100 : (matchCount / totalRequired) * 100;

    return { missing, present, extra, skillMatchScore };
}

function computeKeywordCoverage(resumeText: string, jdText: string): number {
    // Simplified keywords overlap (non-skill based, generic Top N words)
    // This helps capture domain terms not in our taxonomy
    const tokenizer = new natural.WordTokenizer();
    const tokensJd = stopword.removeStopwords(tokenizer.tokenize(jdText.toLowerCase()));
    const uniqueJdWords = new Set(tokensJd);

    let matchCount = 0;
    const tokensResume = stopword.removeStopwords(tokenizer.tokenize(resumeText.toLowerCase()));
    const resumeWords = new Set(tokensResume);

    uniqueJdWords.forEach(w => {
        if (resumeWords.has(w)) matchCount++;
    });

    if (uniqueJdWords.size === 0) return 100;
    return (matchCount / uniqueJdWords.size) * 100;
}

function computeShortlistProbability(matchScore: number, skillCount: number, missingCount: number): number {
    // Heuristic formula
    // Base probability is the match score
    let prob = matchScore;

    // Penalize for critical missing skills? (Implicit in match score, but let's amplify)
    if (missingCount > 3) prob -= 10;

    // Bonus for richness of profile (more detected skills = generally better candidate depth)
    if (skillCount > 10) prob += 5;

    return Math.min(98, Math.max(5, prob)); // Cap at 98% (nothing is certain)
}

function generateStrengths(present: Skill[], extra: Skill[], score: number): string[] {
    const strengths = [];
    if (score > 80) strengths.push("Strong overall match with job requirements.");
    if (present.length > 5) strengths.push("Candidate possesses key required technical skills.");
    if (extra.length > 3) strengths.push("Candidate brings additional diverse skills to the table.");

    // Add top matched skills
    const coreMatches = present.filter(s => s.category === 'Core Technical').map(s => s.name);
    if (coreMatches.length > 0) strengths.push(`Strong core stack: ${coreMatches.slice(0, 3).join(', ')}.`);

    return strengths;
}

function generateSummary(score: number, prob: number, missingCount: number): string {
    if (score >= 80) return "Excellent Match. This candidate closely aligns with the job description and should be shortlisted.";
    if (score >= 60) return "Good potential match. The candidate has most core skills but lacks some distinct requirements.";
    return `Low match. Missing ${missingCount} required skills. Review carefully before shortlisting.`;
}
