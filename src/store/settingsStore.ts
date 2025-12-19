import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnalysisWeights {
    semantic: number;
    skills: number;
    keywords: number;
}

export type StrictnessLevel = 'low' | 'medium' | 'high';

export interface SettingsState {
    weights: AnalysisWeights;
    strictness: StrictnessLevel;
    theme: 'dark'; // Fixed for now

    setWeights: (weights: AnalysisWeights) => void;
    setStrictness: (strictness: StrictnessLevel) => void;
    resetDefaults: () => void;
}

export const DEFAULT_WEIGHTS: AnalysisWeights = {
    semantic: 40,
    skills: 40,
    keywords: 20
};

export const DEFAULT_STRICTNESS: StrictnessLevel = 'medium';

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            weights: DEFAULT_WEIGHTS,
            strictness: DEFAULT_STRICTNESS,
            theme: 'dark',

            setWeights: (weights) => set({ weights }),
            setStrictness: (strictness) => set({ strictness }),
            resetDefaults: () => set({
                weights: DEFAULT_WEIGHTS,
                strictness: DEFAULT_STRICTNESS
            }),
        }),
        {
            name: 'shortlist-settings',
        }
    )
);
