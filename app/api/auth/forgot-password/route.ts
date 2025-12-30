import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { emailService } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    const genericSuccess = NextResponse.json({ success: true });

    if (!user) {
      return genericSuccess;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(
      rawToken
    )}`;

    try {
      await emailService.sendEmail({
        to: email,
        subject: "Reset your Likes.io password",
        html: `
          <h1>Password Reset</h1>
          <p>You requested to reset your password.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return genericSuccess;
  } catch (error: any) {
    console.error("Forgot-password error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
