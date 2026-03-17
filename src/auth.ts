import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials)

                    if (parsedCredentials.success) {
                        const { email, password } = parsedCredentials.data

                        console.log(`[Auth] Attempting login for: ${email}`);

                        const user = await prisma.user.findUnique({ where: { email } });

                        if (!user) {
                            console.log(`[Auth] User not found: ${email}`);
                            return null;
                        }

                        if (!user.emailVerified) {
                            console.log(`[Auth] User not verified: ${email}`);
                            throw new Error("Por favor verifica tu correo electrónico antes de iniciar sesión.");
                        }

                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) {
                            console.log(`[Auth] Login successful for: ${email}`);
                            return user;
                        }

                        console.log(`[Auth] Password mismatch for: ${email}`);
                    } else {
                        console.log("[Auth] Invalid credentials format");
                    }

                    return null;
                } catch (error) {
                    console.error("[Auth] Error in authorize:", error);
                    return null;
                }
            },
        }),
    ],
})
