import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // If user is authenticated
        if (token) {
            // If trying to access dashboard but onboarding not completed
            if (path.startsWith("/dashboard") && !token.onboardingCompleted) {
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }

            // If trying to access onboarding but already completed
            if (path.startsWith("/onboarding") && token.onboardingCompleted) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/resume/:path*",
        "/api/profile/:path*",
        "/onboarding"
    ],
};
