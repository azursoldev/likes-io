import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin routes require authentication
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
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
    "/admin/:path*",
    "/dashboard/:path*",
    "/my-account/:path*",
  ],
}

