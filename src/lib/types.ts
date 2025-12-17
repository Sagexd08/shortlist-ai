export type SkillCategory = 'Core Technical' | 'Tools & Frameworks' | 'Soft Skills' | 'Other';

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface ScoredSkill extends Skill {
  score?: number; // Relevance score or frequency
}

export interface MissingSkill extends Skill {
  relevance: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  id: string; // Analysis ID
  resumeId: string; // S3 Key or ID
  originalFileName: string;
  timestamp: string;
  
  // Scores
  matchScore: number; // 0-100
  shortlistProbability: number; // 0-100%
  
  // Skills
  presentSkills: Skill[];
  missingSkills: MissingSkill[];
  extraSkills: Skill[]; // Present but not in JD
  
  // Insights
  strengths: string[];
  summary: string;
  
  // Metadata for debugging/transparency
  parsingMetadata?: {
    wordCount: number;
    pageCount?: number;
    detectedFormat: string;
  };
}

export interface AnalysisRequest {
  resumeId: string;
  jobDescription: string;
}
