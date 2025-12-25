'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Session Provider wrapper for client-side auth state
 */
export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
