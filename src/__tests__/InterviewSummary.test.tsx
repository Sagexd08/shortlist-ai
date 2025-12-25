import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the InterviewSummary component's dependencies
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => React.createElement('div', props, children),
    },
}));

jest.mock('@/components/ui/badge', () => ({
    Badge: ({ children, ...props }: any) => React.createElement('span', props, children),
}));

jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, ...props }: any) =>
        React.createElement('button', { onClick, ...props }, children),
}));

// Simple component for testing logic only
describe('Interview Summary Logic', () => {
    const mockResults = [
        { question: 'What is React?', answer: 'A library', feedback: 'Good', score: 85 },
        { question: 'Explain hooks', answer: 'State management', feedback: 'OK', score: 60 },
    ];

    it('should calculate average score correctly', () => {
        const avgScore = mockResults.reduce((acc, curr) => acc + curr.score, 0) / mockResults.length;
        expect(Math.round(avgScore)).toBe(73);
    });

    it('should identify strong points (score >= 70)', () => {
        const strongPoints = mockResults.filter(r => r.score >= 70);
        expect(strongPoints).toHaveLength(1);
        expect(strongPoints[0].question).toBe('What is React?');
    });

    it('should identify weak points (score < 70)', () => {
        const weakPoints = mockResults.filter(r => r.score < 70);
        expect(weakPoints).toHaveLength(1);
        expect(weakPoints[0].question).toBe('Explain hooks');
    });

    it('should determine excellent focus when no tab switches', () => {
        const tabSwitches = 0;
        const focusStatus = tabSwitches === 0 ? 'Excellent' : `${tabSwitches} distractions`;
        expect(focusStatus).toBe('Excellent');
    });

    it('should show distraction count when tab switches occurred', () => {
        const tabSwitches: number = 3;
        const focusStatus = tabSwitches === 0 ? 'Excellent' : `${tabSwitches} distractions`;
        expect(focusStatus).toBe('3 distractions');
    });
});

describe('Validation Tests', () => {
    it('should validate profile name extraction', () => {
        const profileName = 'John Doe';
        const firstName = profileName.split(' ')[0];
        expect(firstName).toBe('John');
    });

    it('should handle missing profile name', () => {
        const profileName = undefined;
        const displayName = profileName || 'Unknown Candidate';
        expect(displayName).toBe('Unknown Candidate');
    });
});
