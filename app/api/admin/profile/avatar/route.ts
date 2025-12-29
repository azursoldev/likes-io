import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId = (session.user as any).id as string | undefined;
    const userEmail = (session.user as any).email as string | undefined;
    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT`;
    } catch (e) {
      // ignore
    }
    if (!userId && userEmail) {
      const idRes: any = await prisma.$queryRaw`
        SELECT "id" FROM "User" WHERE "email" = ${userEmail} LIMIT 1
      `;
      if (Array.isArray(idRes) && idRes.length > 0) {
        userId = idRes[0]?.id;
      }
    }
    if (!userId) {
      return NextResponse.json({ error: 'User not found for session' }, { status: 404 });
    }
    const result: any = await prisma.$queryRaw`
      SELECT "avatarUrl" FROM "User" WHERE "id" = ${userId} LIMIT 1
    `;
    const avatarUrl = Array.isArray(result) && result.length > 0 ? result[0]?.avatarUrl || null : null;
    return NextResponse.json({ avatarUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch avatar' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId = (session.user as any).id as string | undefined;
    const userEmail = (session.user as any).email as string | undefined;
    const body = await request.json();
    console.log('PUT /api/admin/profile/avatar body:', body);
    const { avatarUrl } = body;
    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT`;
    } catch (e) {
      // ignore
    }
    if (!userId && userEmail) {
      const idRes: any = await prisma.$queryRaw`
        SELECT "id" FROM "User" WHERE "email" = ${userEmail} LIMIT 1
      `;
      if (Array.isArray(idRes) && idRes.length > 0) {
        userId = idRes[0]?.id;
      }
    }
    if (!userId) {
      return NextResponse.json({ error: 'User not found for session' }, { status: 404 });
    }
    const result = await prisma.$executeRaw`
      UPDATE "User" SET "avatarUrl" = ${avatarUrl || null} WHERE "id" = ${userId}
    `;
    return NextResponse.json({ success: true, avatarUrl: avatarUrl || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update avatar' }, { status: 500 });
  }
}
