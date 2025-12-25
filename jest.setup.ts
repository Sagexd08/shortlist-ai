import '@testing-library/jest-dom';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement('div', { ...props, ref }, children)
        ),
        span: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement('span', { ...props, ref }, children)
        ),
        button: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement('button', { ...props, ref }, children)
        ),
    },
    AnimatePresence: ({ children }: any) => children,
}));

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
    value: {
        speak: jest.fn(),
        cancel: jest.fn(),
        getVoices: jest.fn(() => []),
        onvoiceschanged: null,
    },
});

// Mock SpeechRecognition
(global as any).webkitSpeechRecognition = jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    onend: null,
    onerror: null,
}));

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (typeof args[0] === 'string' && args[0].includes('Warning:')) return;
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
