import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnChangePassword = req.nextUrl.pathname === '/user/change-password'

    // Check if user must change password
    // We need to cast because the type might not be fully inferred in middleware context sometimes, 
    // but we updated types/next-auth.d.ts so it should be fine.
    const mustChangePassword = req.auth?.user?.mustChangePassword

    if (isLoggedIn && mustChangePassword && !isOnChangePassword) {
        // Force redirect to change password page if they are on any other page
        // We restrict this check primarily to /user/ routes via config matcher to avoid loops on public pages if needed,
        // but typically we want to block them everywhere until they change it.
        // However, allowing them to browse public site might be okay? 
        // User said "una vez la cuenta inicie sesion ... debe ir directamente a la pantalla".
        // So blocking dashboard access is key.
        return NextResponse.redirect(new URL('/user/change-password', req.nextUrl))
    }
})

export const config = {
    // Apply to all user dashboard routes and potentially others where auth is required
    // We exclude api (except maybe protected ones?), static files, etc.
    matcher: ['/', '/user/:path*'],
}
