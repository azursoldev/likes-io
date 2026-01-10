import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow public access to the admin login page
    if (req.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

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
        // Admin routes require admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          // Allow access to login page without token
          if (req.nextUrl.pathname === "/admin/login") {
            return true
          }
          return token?.role === "ADMIN"
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
    pages: {
      signIn: "/login",
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

