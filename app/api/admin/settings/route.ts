import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let settings: any;
    try {
      settings = await prisma.adminSettings.findFirst();
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      // If query fails due to missing columns, return defaults
      if (dbError.message?.includes('Unknown column') || dbError.code === 'P2022') {
        return NextResponse.json({
          // Return all fields with defaults
          cryptomusMerchantId: '',
          cryptomusApiKey: '',
          cryptomusDisplayName: 'Card',
          cryptomusTestMode: false,
          bigPayMerchantId: '',
          bigPayApiKey: '',
          bigPayApiSecret: '',
          bigPayDisplayName: 'Card',
          bigPayTestMode: false,
          exitIntentEnabled: false,
          exitIntentTitle: '',
          exitIntentSubtitle: '',
          exitIntentDiscountCode: '',
          newServiceIndicator: true,
          supportEmail: '',
          defaultCurrency: 'USD',
          hasJapConfig: false,
          hasCheckoutConfig: false,
          hasBigPayMeConfig: false,
          hasRapidApiConfig: false,
          hasSmtpConfig: false,
        });
      }
      throw dbError;
    }

    if (!settings) {
      // Create default settings
      settings = await prisma.adminSettings.create({
        data: {},
      });
    }

    // Mask sensitive API keys
    const maskApiKey = (key: string | null | undefined) => {
      if (!key) return '';
      if (key.length <= 4) return '••••';
      return key.substring(0, 4) + '••••••••';
    };

    // Safely get field values (handle missing columns gracefully)
    const getField = (obj: any, field: string, defaultValue: any = '') => {
      try {
        return obj[field] !== undefined && obj[field] !== null ? obj[field] : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    // Return all settings (mask sensitive keys)
    return NextResponse.json({
      // Cryptomus
      cryptomusMerchantId: getField(settings, 'cryptomusMerchantId', ''),
      cryptomusApiKey: maskApiKey(getField(settings, 'cryptomusApiKey', null)),
      cryptomusDisplayName: getField(settings, 'cryptomusDisplayName', 'Card'),
      cryptomusTestMode: getField(settings, 'cryptomusTestMode', false),
      // BigPay
      bigPayMerchantId: getField(settings, 'bigPayMerchantId', ''),
      bigPayApiKey: maskApiKey(getField(settings, 'bigPayMeApiKey', null)),
      bigPayApiSecret: maskApiKey(getField(settings, 'bigPayApiSecret', null)),
      bigPayDisplayName: getField(settings, 'bigPayDisplayName', 'Card'),
      bigPayTestMode: getField(settings, 'bigPayTestMode', false),
      // Exit Intent
      exitIntentEnabled: getField(settings, 'exitIntentEnabled', false),
      exitIntentTitle: getField(settings, 'exitIntentTitle', ''),
      exitIntentSubtitle: getField(settings, 'exitIntentSubtitle', ''),
      exitIntentDiscountCode: getField(settings, 'exitIntentDiscountCode', ''),
      // Feature Flags
      newServiceIndicator: getField(settings, 'newServiceIndicator', true),
      // Site Config
      supportEmail: getField(settings, 'supportEmail', ''),
      // Other existing fields
      defaultCurrency: settings.defaultCurrency || 'USD',
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
      // Cryptomus
      cryptomusMerchantId,
      cryptomusApiKey,
      cryptomusDisplayName,
      cryptomusTestMode,
      // BigPay
      bigPayMerchantId,
      bigPayApiKey,
      bigPayApiSecret,
      bigPayDisplayName,
      bigPayTestMode,
      // Exit Intent
      exitIntentEnabled,
      exitIntentTitle,
      exitIntentSubtitle,
      exitIntentDiscountCode,
      // Feature Flags
      newServiceIndicator,
      // Site Config
      supportEmail,
      // Existing fields
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
    
    // Cryptomus
    if (cryptomusMerchantId !== undefined) updateData.cryptomusMerchantId = cryptomusMerchantId || null;
    if (cryptomusApiKey !== undefined && !cryptomusApiKey.includes('••••')) {
      updateData.cryptomusApiKey = cryptomusApiKey || null;
    }
    if (cryptomusDisplayName !== undefined) updateData.cryptomusDisplayName = cryptomusDisplayName || null;
    if (cryptomusTestMode !== undefined) updateData.cryptomusTestMode = cryptomusTestMode;
    
    // BigPay
    if (bigPayMerchantId !== undefined) updateData.bigPayMerchantId = bigPayMerchantId || null;
    if (bigPayApiKey !== undefined && !bigPayApiKey.includes('••••')) {
      updateData.bigPayMeApiKey = bigPayApiKey || null;
    }
    if (bigPayApiSecret !== undefined && !bigPayApiSecret.includes('••••')) {
      updateData.bigPayApiSecret = bigPayApiSecret || null;
    }
    if (bigPayDisplayName !== undefined) updateData.bigPayDisplayName = bigPayDisplayName || null;
    if (bigPayTestMode !== undefined) updateData.bigPayTestMode = bigPayTestMode;
    
    // Exit Intent
    if (exitIntentEnabled !== undefined) updateData.exitIntentEnabled = exitIntentEnabled;
    if (exitIntentTitle !== undefined) updateData.exitIntentTitle = exitIntentTitle || null;
    if (exitIntentSubtitle !== undefined) updateData.exitIntentSubtitle = exitIntentSubtitle || null;
    if (exitIntentDiscountCode !== undefined) updateData.exitIntentDiscountCode = exitIntentDiscountCode || null;
    
    // Feature Flags
    if (newServiceIndicator !== undefined) updateData.newServiceIndicator = newServiceIndicator;
    
    // Site Config
    if (supportEmail !== undefined) updateData.supportEmail = supportEmail || null;

    console.log('Updating settings with data:', {
      ...updateData,
      cryptomusApiKey: updateData.cryptomusApiKey ? '[REDACTED]' : undefined,
      bigPayMeApiKey: updateData.bigPayMeApiKey ? '[REDACTED]' : undefined,
      bigPayApiSecret: updateData.bigPayApiSecret ? '[REDACTED]' : undefined,
    });
    
    // Existing fields
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

    try {
      if (settings) {
        console.log('Updating existing settings record:', settings.id);
        settings = await prisma.adminSettings.update({
          where: { id: settings.id },
          data: updateData,
        });
        console.log('Settings updated successfully');
      } else {
        console.log('Creating new settings record');
        settings = await prisma.adminSettings.create({
          data: updateData,
        });
        console.log('Settings created successfully');
      }
    } catch (prismaError: any) {
      console.error('Prisma error:', {
        code: prismaError.code,
        message: prismaError.message,
        meta: prismaError.meta,
      });
      // Check if it's a column doesn't exist error
      if (prismaError.message?.includes('Unknown argument') || prismaError.code === 'P2022') {
        console.error('Database schema mismatch. Please run the migration script:', prismaError.message);
        return NextResponse.json(
          { 
            error: 'Database schema is out of date. Please run the migration script (migration-add-settings-fields.sql) in your database and restart the server.',
            details: prismaError.message 
          },
          { status: 500 }
        );
      }
      throw prismaError;
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

