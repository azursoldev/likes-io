import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const navigation = await prisma.navigation.findFirst();

    return NextResponse.json({
      headerMenu: navigation?.headerMenu ?? null,
      footerMenu: navigation?.footerMenu ?? null,
      headerColumnMenus: navigation?.headerColumnMenus ?? null,
      footerColumnMenus: navigation?.footerColumnMenus ?? null,
    });
  } catch (error: any) {
    console.error('Get navigation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch navigation' },
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
    const {
      headerMenu,
      footerMenu,
      headerColumnMenus,
      footerColumnMenus,
    } = body;

    const existing = await prisma.navigation.findFirst();

    let navigation;
    if (existing) {
      navigation = await prisma.navigation.update({
        where: { id: existing.id },
        data: {
          headerMenu: headerMenu !== undefined ? headerMenu : undefined,
          footerMenu: footerMenu !== undefined ? footerMenu : undefined,
          headerColumnMenus: headerColumnMenus !== undefined ? headerColumnMenus : undefined,
          footerColumnMenus: footerColumnMenus !== undefined ? footerColumnMenus : undefined,
        },
      });
    } else {
      navigation = await prisma.navigation.create({
        data: {
          headerMenu,
          footerMenu,
          headerColumnMenus,
          footerColumnMenus,
        },
      });
    }

    return NextResponse.json(navigation);
  } catch (error: any) {
    console.error('Update navigation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update navigation' },
      { status: 500 }
    );
  }
}
