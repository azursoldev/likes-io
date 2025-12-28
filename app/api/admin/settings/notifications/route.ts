import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.adminSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          inboxCount: 0,
          teamCount: 0,
          bannerEnabled: true,
          bannerDurationHours: 24,
        },
      });
    }

    return NextResponse.json({
      inboxCount: settings.inboxCount,
      teamCount: settings.teamCount,
      bannerEnabled: settings.bannerEnabled,
      bannerDurationHours: settings.bannerDurationHours,
    });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          inboxCount: body.inboxCount ?? 0,
          teamCount: body.teamCount ?? 0,
          bannerEnabled: body.bannerEnabled ?? true,
          bannerDurationHours: body.bannerDurationHours ?? 24,
        },
      });
    } else {
      settings = await prisma.adminSettings.update({
        where: { id: settings.id },
        data: {
          inboxCount: body.inboxCount,
          teamCount: body.teamCount,
          bannerEnabled: body.bannerEnabled,
          bannerDurationHours: body.bannerDurationHours,
        },
      });
    }

    return NextResponse.json({
      inboxCount: settings.inboxCount,
      teamCount: settings.teamCount,
      bannerEnabled: settings.bannerEnabled,
      bannerDurationHours: settings.bannerDurationHours,
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json({ error: "Failed to update notification settings" }, { status: 500 });
  }
}
