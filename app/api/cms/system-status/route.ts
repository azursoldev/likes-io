import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Public endpoint for fetching status (allow non-admin to see status)
    // But maybe we want to restrict full settings?
    // For the banner, public needs to read it.
    // So we won't check for admin session for GET, or we'll make a separate public endpoint?
    // Usually CMS APIs are protected.
    // Let's check if this is for the Dashboard or the Public site.
    // The Dashboard needs it. The Public site needs it.
    // If this is under `cms`, it might be protected?
    // Let's assume GET is public or we make a public version.
    // However, the existing `admin/settings` is protected.
    // I'll make this protected for editing, but for public access, maybe I should use a separate route or allow public GET.
    // Let's allow public GET for now, or just check session for PUT.
    
    // Actually, looking at `app/api/cms/team/route.ts` (implied from context), CMS routes might be public for fetching content?
    // Let's check `app/components/TeamPage.tsx` fetching `/api/cms/team`.
    // It fetches on client side. So it must be public.
    
    let settings: any;
    try {
      const result: any = await prisma.$queryRaw`SELECT "systemStatus", "systemStatusMessage", "systemStatusEnabled" FROM "admin_settings" LIMIT 1`;
      settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      // Return defaults if table/columns missing
      return NextResponse.json({
        systemStatus: "Operational",
        systemStatusMessage: "All Systems Operational",
        systemStatusEnabled: true
      });
    }

    if (!settings) {
      return NextResponse.json({
        systemStatus: "Operational",
        systemStatusMessage: "All Systems Operational",
        systemStatusEnabled: true
      });
    }

    return NextResponse.json({
      systemStatus: settings.systemStatus || "Operational",
      systemStatusMessage: settings.systemStatusMessage || "All Systems Operational",
      systemStatusEnabled: settings.systemStatusEnabled ?? true
    });
  } catch (error: any) {
    console.error('Get system status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch system status' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { systemStatus, systemStatusMessage, systemStatusEnabled } = body;

    let settings: any;
    try {
      const result: any = await prisma.$queryRaw`SELECT id FROM "admin_settings" LIMIT 1`;
      settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    } catch (e) {
      console.error("Failed to fetch settings for update:", e);
    }

    if (!settings) {
      // Create new settings if not exists
      // We use raw query or prisma create
      // Using prisma create might fail if types are not updated, so let's use raw query if possible or prisma create with 'any' cast
      // But prisma create requires all mandatory fields. AdminSettings has no mandatory fields except ID.
      // So prisma.adminSettings.create({ data: {} }) should work.
      settings = await prisma.adminSettings.create({ data: {} });
    }

    // Use raw SQL to update to avoid Prisma Client type issues
    await prisma.$executeRaw`
      UPDATE "admin_settings"
      SET 
        "systemStatus" = ${systemStatus},
        "systemStatusMessage" = ${systemStatusMessage},
        "systemStatusEnabled" = ${systemStatusEnabled}
      WHERE "id" = ${settings.id}
    `;

    return NextResponse.json({
      success: true,
      systemStatus,
      systemStatusMessage,
      systemStatusEnabled
    });

  } catch (error: any) {
    console.error('Update system status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update system status' },
      { status: 500 }
    );
  }
}
