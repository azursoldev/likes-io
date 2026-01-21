import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    // 1. Try to fetch from database
    let dbSettings = null;
    try {
      const result: any = await prisma.$queryRaw`SELECT "japApiUrl", "japApiKey" FROM "admin_settings" LIMIT 1`;
      dbSettings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    } catch (e) {
      console.error("Failed to fetch settings from DB:", e);
    }

    const dbApiUrl = dbSettings?.japApiUrl || "";
    const dbApiKey = dbSettings?.japApiKey || "";

    // 2. Fallback to environment variables
    const envApiUrl = process.env.JAP_API_URL || "";
    const envApiKey = process.env.JAP_API_KEY || "";

    // 3. Determine final values (DB takes precedence)
    const rawUrl = dbApiUrl || envApiUrl;
    const rawKey = dbApiKey || envApiKey;

    const source = {
      url: dbApiUrl ? "database" : envApiUrl ? "env" : "none",
      key: dbApiKey ? "database" : envApiKey ? "env" : "none"
    };

    const apiUrlConfigured = !!rawUrl;
    const apiKeyConfigured = !!rawKey;

    // Mask the API key so it is never fully exposed
    const maskedKey = apiKeyConfigured
      ? `${rawKey.slice(0, 4)}************${rawKey.slice(-4)}`
      : "";

    // Provide a short preview of the URL (no query params)
    let apiUrlPreview = "";
    if (apiUrlConfigured) {
      try {
        const url = new URL(rawUrl);
        apiUrlPreview = `${url.origin}${url.pathname}`;
      } catch {
        apiUrlPreview = rawUrl;
      }
    }

    const status =
      apiUrlConfigured && apiKeyConfigured
        ? "connected"
        : apiUrlConfigured || apiKeyConfigured
        ? "partial"
        : "not_configured";

    return NextResponse.json({
      apiUrlConfigured,
      apiKeyConfigured,
      apiUrlPreview,
      maskedKey,
      status,
      source,
      // We send back the actual URL for editing if it's from DB, but mask the key
      // If it's from env, we probably shouldn't send the full URL if we want to be strict, 
      // but usually URL is not secret. Key is secret.
      // Let's send the raw URL if it's safe-ish.
      rawUrl: rawUrl, 
    });
  } catch (error: any) {
    console.error("SMM Panel config error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to read SMM panel config" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { japApiUrl, japApiKey } = body;

    // Check if settings exist
    let settings: any;
    try {
      const result: any = await prisma.$queryRaw`SELECT id FROM "admin_settings" LIMIT 1`;
      settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    } catch (e) {
      console.error("Failed to check settings existence:", e);
    }

    if (!settings) {
      await prisma.adminSettings.create({ data: {} });
    }

    // Update settings
    // We use raw query or updateMany/update
    // Since there's only one row usually, let's use updateMany or findFirst then update
    // But since we checked existence, we can just use update on the ID if we had it, or updateMany.
    // Or executeRaw for safety against Prisma type issues if generated client isn't perfect yet.
    
    // Using prisma.adminSettings.updateMany is safest if ID isn't handy
    await prisma.adminSettings.updateMany({
      data: {
        japApiUrl: japApiUrl || null,
        japApiKey: japApiKey || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SMM Panel config update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update SMM panel config" },
      { status: 500 }
    );
  }
}


