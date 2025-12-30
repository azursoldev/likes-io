import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Verify reCAPTCHA token (v3) - Skip for admin
        if (credentials.email !== "admin@example.com") {
            let secret = process.env.RECAPTCHA_SECRET_KEY
            try {
              const result: any = await prisma.$queryRaw`SELECT * FROM "admin_settings" LIMIT 1`
              const settings = Array.isArray(result) && result.length > 0 ? result[0] : null
              if (settings && settings.recaptchaSecretKey) {
                secret = settings.recaptchaSecretKey as string
              }
            } catch {}
            
            const recaptchaToken = (credentials as any).recaptchaToken as string | undefined
            
            if (recaptchaToken === "LOCALHOST_BYPASS" || recaptchaToken === "RECAPTCHA_FAILED_CLIENT_SIDE") {
               // Bypass verification for localhost/dev or if client-side execution failed
            } else if (secret) {
                if (!recaptchaToken) {
                  return null
                }
                try {
                  const body = new URLSearchParams({
                    secret,
                    response: recaptchaToken,
                  }).toString()
                  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body,
                  })
                  const verifyJson = await verifyRes.json()
                  if (!verifyJson.success) {
                    return null
                  }
                  // If v3, check score threshold
                  if (typeof verifyJson.score === "number" && verifyJson.score < 0.5) {
                    return null
                  }
                } catch (e) {
                  return null
                }
            }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || user.isBlocked) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

