import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const rawUrl = process.env.JAP_API_URL || "";
    const rawKey = process.env.JAP_API_KEY || "";

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
    });
  } catch (error: any) {
    console.error("SMM Panel config error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to read SMM panel config" },
      { status: 500 }
    );
  }
}


