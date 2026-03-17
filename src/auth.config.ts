import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
                token.mustChangePassword = (user as any).mustChangePassword;
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as any
                session.user.id = token.id as string
                session.user.mustChangePassword = token.mustChangePassword as boolean;
            }
            return session
        },
    },
    providers: [], // Configured in auth.ts
    secret: process.env.AUTH_SECRET,
    trustHost: true,
} satisfies NextAuthConfig
