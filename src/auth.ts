
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials)

                    if (parsedCredentials.success) {
                        const { email: rawEmail, password } = parsedCredentials.data
                        const email = rawEmail.trim().toLowerCase();

                        console.log(`[Auth] Attempting login for: ${email}`);

                        const user = await prisma.user.findFirst({ 
                            where: { 
                                email: {
                                    equals: email,
                                    mode: 'insensitive'
                                }
                            } 
                        });

                        if (!user) {
                            console.log(`[Auth] User not found: ${email}`);
                            return null;
                        }

                        if (!user.emailVerified) {
                            console.log(`[Auth] User not verified: ${email}`);
                            // We can throw an error to be caught by the frontend, or return null.
                            // Throwing allows specific error messages.
                            throw new Error("Por favor verifica tu correo electrónico antes de iniciar sesión.");
                        }

                        const passwordsMatch = await bcrypt.compare(password.trim(), user.password);
                        if (passwordsMatch) {
                            console.log(`[Auth] Login successful for: ${email}`);

                            // --- CUTOVER AL PORTAL DE PAGOS ---
                            // Los clientes (role USER) que ya reservaron y pagaron ya no
                            // deben usar Lomas: su ficha (pagos, mora, documentos) vive en
                            // el portal de pagos.aliminspa.cl. EXCEPCION: si aun le falta
                            // firmar el Contrato de Reserva (y no es legacy/papel), lo
                            // dejamos entrar normal hasta que pueda firmar (esa parte todavia
                            // no existe en el portal).
                            let needsPortalRedirect = false;
                            if (user.role === Role.USER) {
                                const stillNeedsToSign = await prisma.reservation.count({
                                    where: {
                                        buyer_id: user.id,
                                        status: 'paid',
                                        signed_at: null,
                                        is_legacy: false,
                                    },
                                });
                                const hasAnyPaidReservation = await prisma.reservation.count({
                                    where: { buyer_id: user.id, status: 'paid' },
                                });
                                needsPortalRedirect = hasAnyPaidReservation > 0 && stillNeedsToSign === 0;
                            }

                            return { ...user, needsPortalRedirect };
                        }

                        console.log(`[Auth] Password mismatch for: ${email}`);
                    } else {
                        console.log("[Auth] Invalid credentials format");
                    }

                    return null;
                } catch (error) {
                    console.error("[Auth] Error in authorize:", error);
                    // If it's our custom error, throw it so NextAuth knows about it
                    if (error instanceof Error && error.message.includes("verifica tu correo")) {
                         throw error;
                    }
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                // Use type assertion if needed, though extending types/next-auth.d.ts should handle it
                token.mustChangePassword = (user as any).mustChangePassword;
                token.needsPortalRedirect = (user as any).needsPortalRedirect ?? false;
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as Role
                session.user.id = token.id as string
                session.user.mustChangePassword = token.mustChangePassword as boolean;
                session.user.needsPortalRedirect = (token.needsPortalRedirect as boolean) ?? false;

                // --- Administrative Impersonation Support ---
                // If the logged-in user is an ADMIN and an 'impersonation_token' exists,
                // we override the session with the impersonated user's data.
                if (token.role === Role.ADMIN) {
                    try {
                        const { cookies } = await import('next/headers');
                        const cookieStore = await cookies();
                        const impersonationToken = cookieStore.get('impersonation_token')?.value;

                        if (impersonationToken) {
                            const { verifyMobileToken } = await import('@/lib/mobile-auth');
                            const payload = await verifyMobileToken(impersonationToken);

                            if (payload && payload.userId) {
                                // Inject impersonated user data into the session returned to the client
                                session.user.id = payload.userId;
                                session.user.email = payload.email || session.user.email;
                                session.user.role = (payload.role as Role) || Role.USER;
                                (session as any).isImpersonating = true;
                                (session as any).adminEmail = token.email; 
                                console.log(`[Auth] Admin ${token.email} is impersonating User ID: ${payload.userId}`);
                            }
                        }
                    } catch (err) {
                        console.error("[Auth] Impersonation error:", err);
                    }
                }
            }
            return session
        },
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Specific for Easypanel/Docker behind proxy
})
