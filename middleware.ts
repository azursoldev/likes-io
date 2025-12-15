import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // TEMP: allow all /admin routes without auth
        // Dashboard routes require authentication
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        // My account requires authentication
        if (req.nextUrl.pathname.startsWith("/my-account")) {
          return !!token
        }
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-account/:path*",
  ],
}

