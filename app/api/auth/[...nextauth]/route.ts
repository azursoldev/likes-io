import NextAuth from "next-auth/next"
import { getAuthOptions } from "@/lib/auth-options"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function handler(req: any, ctx: any) {
  const options = await getAuthOptions()
  return NextAuth(options)(req, ctx)
}

export { handler as GET, handler as POST }
