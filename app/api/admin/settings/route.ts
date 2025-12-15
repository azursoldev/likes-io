import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.adminSettings.create({
        data: {},
      });
    }

    // Don't return sensitive data in full
    return NextResponse.json({
      defaultCurrency: settings.defaultCurrency,
      hasJapConfig: !!settings.japApiKey,
      hasCheckoutConfig: !!settings.checkoutApiKey,
      hasBigPayMeConfig: !!settings.bigPayMeApiKey,
      hasRapidApiConfig: !!settings.rapidApiKey,
      hasSmtpConfig: !!settings.smtpHost,
    });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
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
      japApiUrl,
      japApiKey,
      checkoutApiKey,
      checkoutWebhookSecret,
      bigPayMeApiKey,
      bigPayMeWebhookSecret,
      rapidApiKey,
      rapidApiInstagramHost,
      rapidApiTikTokHost,
      rapidApiYouTubeHost,
      smtpHost,
      smtpUser,
      smtpPass,
      defaultCurrency,
    } = body;

    let settings = await prisma.adminSettings.findFirst();

    const updateData: any = {};
    if (japApiUrl !== undefined) updateData.japApiUrl = japApiUrl;
    if (japApiKey !== undefined) updateData.japApiKey = japApiKey;
    if (checkoutApiKey !== undefined) updateData.checkoutApiKey = checkoutApiKey;
    if (checkoutWebhookSecret !== undefined) updateData.checkoutWebhookSecret = checkoutWebhookSecret;
    if (bigPayMeApiKey !== undefined) updateData.bigPayMeApiKey = bigPayMeApiKey;
    if (bigPayMeWebhookSecret !== undefined) updateData.bigPayMeWebhookSecret = bigPayMeWebhookSecret;
    if (rapidApiKey !== undefined) updateData.rapidApiKey = rapidApiKey;
    if (rapidApiInstagramHost !== undefined) updateData.rapidApiInstagramHost = rapidApiInstagramHost;
    if (rapidApiTikTokHost !== undefined) updateData.rapidApiTikTokHost = rapidApiTikTokHost;
    if (rapidApiYouTubeHost !== undefined) updateData.rapidApiYouTubeHost = rapidApiYouTubeHost;
    if (smtpHost !== undefined) updateData.smtpHost = smtpHost;
    if (smtpUser !== undefined) updateData.smtpUser = smtpUser;
    if (smtpPass !== undefined) updateData.smtpPass = smtpPass;
    if (defaultCurrency !== undefined) updateData.defaultCurrency = defaultCurrency;

    if (settings) {
      settings = await prisma.adminSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.adminSettings.create({
        data: updateData,
      });
    }

    // Return without sensitive data
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

