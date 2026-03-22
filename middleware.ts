import { withAuth, type NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

/**
 * Permanent redirect to lowercase pathname so /BUY-tiktok-likes → /buy-tiktok-likes
 * (matches DB slugs and avoids duplicate URLs). Skips API, Next internals, and root.
 */
function redirectToLowercasePathname(req: NextRequest): NextResponse | null {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return null
  }

  const pathname = req.nextUrl.pathname
  const lower = pathname.toLowerCase()
  if (pathname === lower) {
    return null
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return null
  }

  const url = req.nextUrl.clone()
  url.pathname = lower
  return NextResponse.redirect(url, 308)
}

const authMiddleware = withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          if (req.nextUrl.pathname === "/admin/login") {
            return true
          }
          return token?.role === "ADMIN"
        }
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith("/my-account")) {
          return !!token
        }
        return true
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const lowerRedirect = redirectToLowercasePathname(req)
  if (lowerRedirect) {
    return lowerRedirect
  }
  return authMiddleware(req as NextRequestWithAuth, event)
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
