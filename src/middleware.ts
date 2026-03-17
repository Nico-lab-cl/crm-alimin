import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnChangePassword = req.nextUrl.pathname === '/user/change-password'

    const mustChangePassword = req.auth?.user?.mustChangePassword

    if (isLoggedIn && mustChangePassword && !isOnChangePassword) {
        return NextResponse.redirect(new URL('/user/change-password', req.nextUrl))
    }
})

export const config = {
    matcher: ['/user/:path*'],
}
