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
    customSkills: { name: string; category: 'Core Technical' | 'Tools & Frameworks' | 'Soft Skills' | 'Other' }[];

    setWeights: (weights: AnalysisWeights) => void;
    setStrictness: (strictness: StrictnessLevel) => void;
    addCustomSkill: (skill: { name: string; category: string }) => void;
    removeCustomSkill: (name: string) => void;
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
            customSkills: [],

            setWeights: (weights) => set({ weights }),
            setStrictness: (strictness) => set({ strictness }),
            addCustomSkill: (skill) => set((state) => ({
                customSkills: [...state.customSkills, { ...skill, category: skill.category as "Core Technical" | "Tools & Frameworks" | "Soft Skills" | "Other" }]
            })),
            removeCustomSkill: (name) => set((state) => ({
                customSkills: state.customSkills.filter(s => s.name !== name)
            })),
            resetDefaults: () => set({
                weights: DEFAULT_WEIGHTS,
                strictness: DEFAULT_STRICTNESS,
                customSkills: []
            }),
        }),
        {
            name: 'shortlist-settings',
        }
    )
);
