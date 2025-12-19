import { Skill, SkillCategory, ScoredSkill, MissingSkill, AnalysisResult, AnalysisOptions } from './types';
const natural = require('natural');
const computeCosineSimilarity = require('compute-cosine-similarity');
const stopword = require('stopword');
const SKILL_TAXONOMY: Record<string, SkillCategory> = {
    "python": "Core Technical", "javascript": "Core Technical", "typescript": "Core Technical",
    "java": "Core Technical", "c++": "Core Technical", "go": "Core Technical", "rust": "Core Technical",
    "sql": "Core Technical", "html": "Core Technical", "css": "Core Technical",
    "react": "Tools & Frameworks", "next.js": "Tools & Frameworks", "node.js": "Tools & Frameworks",
    "django": "Tools & Frameworks", "flask": "Tools & Frameworks", "fastapi": "Tools & Frameworks",
    "spring": "Tools & Frameworks", "boot": "Tools & Frameworks", "tensorflow": "Tools & Frameworks",
    "pytorch": "Tools & Frameworks", "scikit-learn": "Tools & Frameworks", "pandas": "Tools & Frameworks",
    "numpy": "Tools & Frameworks", "aws": "Tools & Frameworks", "azure": "Tools & Frameworks",
    "gcp": "Tools & Frameworks", "docker": "Tools & Frameworks", "kubernetes": "Tools & Frameworks",
    "terraform": "Tools & Frameworks", "serverless": "Tools & Frameworks", "dynamodb": "Tools & Frameworks",
    "vercel": "Tools & Frameworks",
    "leadership": "Soft Skills", "communication": "Soft Skills", "teamwork": "Soft Skills",
    "problem solving": "Soft Skills", "agile": "Soft Skills", "scrum": "Soft Skills",
    "mentorship": "Soft Skills", "collaboration": "Soft Skills",
};

export function analyzeResume(
    resumeText: string,
    jdText: string,
    resumeId: string,
    originalFileName: string,
    options?: AnalysisOptions
): AnalysisResult {
    const timestamp = new Date().toISOString();
    const resumeSkills = extractSkills(resumeText);
    const jdSkills = extractSkills(jdText);
    const similarity = computeSemanticSimilarity(resumeText, jdText);
    const { missing, present, extra, skillMatchScore } = analyzeSkillGaps(resumeSkills, jdSkills);
    const keywordCoverage = computeKeywordCoverage(resumeText, jdText);

    // Dynamic Weights
    const wSemantic = options?.weights.semantic ?? 40;
    const wSkills = options?.weights.skills ?? 40;
    const wKeywords = options?.weights.keywords ?? 20;
    const totalWeight = wSemantic + wSkills + wKeywords;

    const rawScore = ((similarity * wSemantic) + (skillMatchScore * wSkills) + (keywordCoverage * wKeywords)) / (totalWeight || 100) * 100; // Normalize if weights don't sum to 100, but they usually should in UI

    // Simple sum normalization:
    // Actually, just summing them works if they are treated as parts of 100. 
    // If they aren't, we should normalize. 
    // Let's assume the UI sends them as parts of 100.

    // Simpler calculation matching original logic style:
    // Original: (Sim * 40) + (Skill * 40) + (Key * 20)  -- implicitly / 100
    // New: (Sim * wS) + (Skill * wSk) + (Key * wK) ... / 100

    const normalizedScore = ((similarity * wSemantic) + (skillMatchScore * wSkills) + (keywordCoverage * wKeywords)) / 100;

    const matchScore = Math.min(100, Math.max(0, Math.round(normalizedScore)));

    const shortlistProbability = computeShortlistProbability(matchScore, resumeSkills.length, missing.length);
    const strengths = generateStrengths(present, extra, matchScore);
    const riskFlags = generateRiskFlags(missing, resumeText);
    const summary = generateSummary(matchScore, shortlistProbability, missing.length);

    // Strictness Thresholds
    const strictness = options?.strictness || 'medium';
    let thresholds = { shortlist: 80, review: 50 };

    if (strictness === 'high') thresholds = { shortlist: 85, review: 60 };
    if (strictness === 'low') thresholds = { shortlist: 70, review: 40 };

    const recommendation = matchScore >= thresholds.shortlist ? 'Shortlist' : matchScore >= thresholds.review ? 'Review' : 'Reject';

    return {
        id: `AN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        resumeId,
        originalFileName,
        timestamp,
        matchScore,
        shortlistProbability,
        skillMatchScore: Math.round(skillMatchScore),
        presentSkills: present,
        missingSkills: missing,
        extraSkills: extra,
        strengths,
        riskFlags,
        summary,
        recommendation,
        parsingMetadata: {
            wordCount: resumeText.split(/\s+/).length,
            detectedFormat: "extracted-text"
        }
    };
}
function generateRiskFlags(missing: MissingSkill[], text: string): string[] {
    const flags: string[] = [];
    const highPriorityMissing = missing.filter(m => m.relevance === 'High');

    if (highPriorityMissing.length > 2) {
        flags.push(`Missing ${highPriorityMissing.length} critical technical requirements.`);
    }

    const wordCount = text.split(/\s+/).length;
    if (wordCount < 200) {
        flags.push("Resume content appears unusually brief (potential lack of detail).");
    }

    return flags;
}

function extractSkills(text: string): Skill[] {
    const foundSkills: Skill[] = [];
    const normalizedText = text.toLowerCase();
    for (const [skill, category] of Object.entries(SKILL_TAXONOMY)) {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
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
    const clean1 = stopword.removeStopwords(tokens1);
    const clean2 = stopword.removeStopwords(tokens2);
    const vocabulary = Array.from(new Set([...clean1, ...clean2]));
    const vec1 = new Array(vocabulary.length).fill(0);
    const vec2 = new Array(vocabulary.length).fill(0);
    clean1.forEach((t: string) => { const i = vocabulary.indexOf(t); if (i >= 0) vec1[i]++; });
    clean2.forEach((t: string) => { const i = vocabulary.indexOf(t); if (i >= 0) vec2[i]++; });
    const similarity = computeCosineSimilarity(vec1, vec2) || 0;
    return similarity * 100;
}
function analyzeSkillGaps(resumeSkills: Skill[], jdSkills: Skill[]) {
    const resumeSkillNames = new Set(resumeSkills.map(s => s.name));
    const jdSkillNames = new Set(jdSkills.map(s => s.name));
    const present: Skill[] = [];
    const missing: MissingSkill[] = [];
    const extra: Skill[] = [];
    jdSkills.forEach(skill => {
        if (resumeSkillNames.has(skill.name)) {
            present.push(skill);
        } else {
            missing.push({ ...skill, relevance: 'High' });
        }
    });

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
    let prob = matchScore;
    if (missingCount > 3) prob -= 10;
    if (skillCount > 10) prob += 5;
    return Math.min(98, Math.max(5, prob));
}
function generateStrengths(present: Skill[], extra: Skill[], score: number): string[] {
    const strengths = [];
    if (score > 80) strengths.push("Strong overall match with job requirements.");
    if (present.length > 5) strengths.push("Candidate possesses key required technical skills.");
    if (extra.length > 3) strengths.push("Candidate brings additional diverse skills to the table.");
    const coreMatches = present.filter(s => s.category === 'Core Technical').map(s => s.name);
    if (coreMatches.length > 0) strengths.push(`Strong core stack: ${coreMatches.slice(0, 3).join(', ')}.`);

    return strengths;
}

function generateSummary(score: number, prob: number, missingCount: number): string {
    if (score >= 80) return "Excellent Match. This candidate closely aligns with the job description and should be shortlisted.";
    if (score >= 60) return "Good potential match. The candidate has most core skills but lacks some distinct requirements.";
    return `Low match. Missing ${missingCount} required skills. Review carefully before shortlisting.`;
}
