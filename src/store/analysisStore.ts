import { create } from 'zustand';

// Unified Analysis Result Interface (Backend + Frontend needs)
export interface AnalysisResult {
  id: string;
  resumeId?: string;
  originalFileName: string;
  resumeName: string; // Alias for UI
  timestamp: string | Date;
  matchScore: number;
  shortlistProbability: number;
  riskFlags: number; // UI expects a count
  riskDetails?: string[]; // Actual flag strings

  // UI Specific
  skillCoverage: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];

  // Backend Raw Data
  presentSkills?: any[];
  strengths?: string[];
  summary?: string;
  recommendation: 'strong_fit' | 'consider' | 'weak_fit' | 'Shortlist' | 'Review' | 'Reject';
  aiSummary: string;
  jobTitle: string;

  resumeText: string;
  jobDescription: string;
}

export type AnalysisStep =
  | 'idle'
  | 'parsing'
  | 'extracting'
  | 'matching'
  | 'computing'
  | 'complete';

interface AnalysisState {
  currentStep: AnalysisStep;
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  history: AnalysisResult[];

  startAnalysis: (resumeName: string, resumeText: string, jobDescription: string) => Promise<void>;
  setStep: (step: AnalysisStep) => void;
  reset: () => void;
  completeAnalysis: (result: AnalysisResult) => void;
  loadFromHistory: (id: string) => void;
  fetchHistory: () => Promise<void>;
  clearHistory: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  currentStep: 'idle',
  currentResult: null,
  isAnalyzing: false,
  history: [],

  startAnalysis: async (resumeName, resumeText, jobDescription) => {
    set({ isAnalyzing: true, currentStep: 'parsing', currentResult: null });

    // Visual progress only
    const progressInterval = setInterval(() => {
      set(state => {
        const steps: AnalysisStep[] = ['parsing', 'extracting', 'matching', 'computing'];
        const currentIndex = steps.indexOf(state.currentStep);
        if (currentIndex < steps.length - 1 && currentIndex >= 0) {
          return { currentStep: steps[currentIndex + 1] };
        }
        return {};
      });
    }, 1200);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: `temp-${Date.now()}`,
          text: resumeText,
          jdText: jobDescription,
          originalName: resumeName
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await res.json();

      // Map Backend Data to Frontend UI
      const mappedResult: AnalysisResult = {
        id: data.id,
        timestamp: data.timestamp,
        resumeName: data.originalFileName,
        jobTitle: 'Analyzed Role',
        matchScore: data.matchScore,
        skillCoverage: data.skillMatchScore || 0,
        shortlistProbability: data.shortlistProbability || 0,
        riskFlags: Array.isArray(data.riskFlags) ? data.riskFlags.length : 0,
        matchedSkills: data.presentSkills ? data.presentSkills.map((s: any) => s.name) : [],
        missingSkills: data.missingSkills ? data.missingSkills.map((s: any) => s.name) : [],
        extraSkills: data.extraSkills ? data.extraSkills.map((s: any) => s.name) : [],
        aiSummary: data.summary,
        recommendation: data.recommendation === 'Shortlist' ? 'strong_fit' : data.recommendation === 'Review' ? 'consider' : 'weak_fit',
        resumeText,
        jobDescription,
        originalFileName: data.originalFileName,
        // Preserve raw data if needed
        presentSkills: data.presentSkills,
        strengths: data.strengths
      };

      set(state => ({
        currentResult: mappedResult,
        currentStep: 'complete',
        isAnalyzing: false,
        history: [mappedResult, ...state.history].slice(0, 20)
      }));

    } catch (error: any) {
      clearInterval(progressInterval);
      set({ isAnalyzing: false, currentStep: 'idle' });
      console.error(error);
      alert(`Analysis Error: ${error.message}`);
    }
  },

  setStep: (step) => set({ currentStep: step }),

  completeAnalysis: (result) => set(state => ({
    currentResult: result,
    currentStep: 'complete',
    isAnalyzing: false,
    history: [result, ...state.history].slice(0, 20),
  })),

  loadFromHistory: (id) => {
    const result = get().history.find(h => h.id === id);
    if (result) {
      set({ currentResult: result, currentStep: 'complete' });
    }
  },

  fetchHistory: async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        const mappedHistory: AnalysisResult[] = data.map((d: any) => ({
          id: d.id,
          resumeId: d.resumeId,
          originalFileName: d.originalFileName,
          resumeName: d.originalFileName,
          timestamp: d.timestamp,
          matchScore: d.matchScore,
          shortlistProbability: d.shortlistProbability || 0,
          riskFlags: Array.isArray(d.riskFlags) ? d.riskFlags.length : 0,
          riskDetails: d.riskFlags,
          skillCoverage: d.skillMatchScore || 0,
          matchedSkills: d.presentSkills?.map((s: any) => s.name) || [],
          missingSkills: d.missingSkills?.map((s: any) => s.name) || [],
          extraSkills: d.extraSkills?.map((s: any) => s.name) || [],
          aiSummary: d.summary || '',
          recommendation: d.recommendation === 'Shortlist' ? 'strong_fit' : d.recommendation === 'Review' ? 'consider' : 'weak_fit',
          jobTitle: 'Analyzed Role',
          resumeText: '',
          jobDescription: ''
        }));
        set({ history: mappedHistory });
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  },

  clearHistory: () => set({ history: [] }),

  reset: () => set({ currentStep: 'idle', currentResult: null, isAnalyzing: false }),
}));
