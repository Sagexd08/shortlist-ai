import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (
                    credentials?.email === 'demo@shortlist.ai' &&
                    credentials?.password === 'demo123'
                ) {
                    return {
                        id: '1',
                        name: 'Demo User',
                        email: 'demo@shortlist.ai',
                        image: null,
                    };
                }
                return null;
            },
        }),
    ],

    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/auth/error',
    },

    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user && token.id) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
