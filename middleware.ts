import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAdmin = token?.role === "ADMIN"
    const isLoginPage = req.nextUrl.pathname === "/admin/login"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Handle Admin Login Page
    if (isLoginPage) {
      if (isAuth && isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.next()
    }

    // Handle Protected Admin Routes
    if (isAdminRoute) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // For admin routes, we return true here to let the middleware function handle the specific redirects
        // (e.g. redirecting to /admin/login instead of /login)
        if (pathname.startsWith("/admin")) {
          return true
        }

        // Dashboard routes require authentication
        if (pathname.startsWith("/dashboard")) {
          return !!token
        }
        
        // My account requires authentication
        if (pathname.startsWith("/my-account")) {
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

