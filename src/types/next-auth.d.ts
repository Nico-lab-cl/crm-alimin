
import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role: Role
            id: string
            mustChangePassword: boolean
            /** True si el cliente ya no necesita usar Lomas (debe ir al portal de pagos) */
            needsPortalRedirect: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
        mustChangePassword: boolean
        needsPortalRedirect?: boolean
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        role: Role
        id: string
        needsPortalRedirect?: boolean
    }
}
