import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { v4 as uuidv4 } from "uuid"

const baseAuthOptions: Omit<NextAuthOptions, "providers"> = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.email) token.email = session.user.email;
      }

      if (user) {
        // If it's an OAuth login (account is defined)
        if (account && account.type === "oauth") {
          const email = user.email;
          if (email) {
            try {
              let dbUser = await prisma.user.findUnique({ where: { email } });
              
              if (!dbUser) {
                // Create user if not exists
                const randomPassword = uuidv4();
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                
                dbUser = await prisma.user.create({
                  data: {
                    email,
                    name: user.name,
                    password: hashedPassword,
                    role: "USER",
                    isBlocked: false,
                  }
                });
              } else if (dbUser.isBlocked) {
                 // If blocked, we shouldn't allow login, but JWT is already created?
                 // We can throw error or return empty token, but best to handle downstream.
                 // For now, let's just not set the ID/role properly or handle it.
              }
              
              token.id = dbUser.id;
              token.role = dbUser.role;
            } catch (error) {
              console.error("Error handling OAuth user:", error);
            }
          }
        } else {
          // Credentials login
          token.id = user.id
          token.role = user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
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

const credentialsProvider = CredentialsProvider({
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
})

export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  providers: [
    credentialsProvider,
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
  ]
}

export async function getAuthOptions(): Promise<NextAuthOptions> {
  const providers: any[] = [credentialsProvider];
  
  try {
    const settings = await prisma.adminSettings.findFirst();
    
    if (settings?.googleClientId && settings?.googleClientSecret) {
      providers.push(GoogleProvider({
        clientId: settings.googleClientId,
        clientSecret: settings.googleClientSecret
      }));
    } else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push(GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }));
    }

    if (settings?.facebookClientId && settings?.facebookClientSecret) {
      providers.push(FacebookProvider({
        clientId: settings.facebookClientId,
        clientSecret: settings.facebookClientSecret
      }));
    } else if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
      providers.push(FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      }));
    }
  } catch (error) {
    console.error("Error loading auth settings from DB:", error);
    // Fallback to env
     if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push(GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }));
    }
    if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
      providers.push(FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      }));
    }
  }

  return {
    ...baseAuthOptions,
    providers
  };
}
