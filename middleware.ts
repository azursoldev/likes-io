import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => {
        // TEMP: Allow all routes without authentication
        return true
      },
    },
  }
)

export const config = {
  matcher: [],
}

