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
      // Use raw query to ensure we get all fields even if client is outdated
      const result: any = await prisma.$queryRaw`SELECT * FROM "admin_settings" LIMIT 1`;
      settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
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
      // MyFatoorah Settings
      myFatoorahToken: maskApiKey(getField(settings, 'myFatoorahToken', null)),
      myFatoorahBaseURL: getField(settings, 'myFatoorahBaseURL', 'https://apitest.myfatoorah.com'),
      myFatoorahTestMode: getField(settings, 'myFatoorahTestMode', true),
      myFatoorahWebhookSecret: maskApiKey(getField(settings, 'myFatoorahWebhookSecret', null)),

      // SEO & BrandingSMTP Configuration
      smtpHost: getField(settings, 'smtpHost', ''),
      smtpPort: getField(settings, 'smtpPort', 587),
      smtpSecure: getField(settings, 'smtpSecure', false),
      smtpUser: getField(settings, 'smtpUser', ''),
      smtpPass: getField(settings, 'smtpPass', ''),
      smtpFrom: getField(settings, 'smtpFrom', ''),
      // RapidAPI
      rapidApiKey: maskApiKey(getField(settings, 'rapidApiKey', null)),
      rapidApiInstagramHost: getField(settings, 'rapidApiInstagramHost', 'instagram120.p.rapidapi.com'),
      rapidApiTikTokHost: getField(settings, 'rapidApiTikTokHost', 'tiktok-data.p.rapidapi.com'),
      rapidApiYouTubeHost: getField(settings, 'rapidApiYouTubeHost', 'youtube-data.p.rapidapi.com'),
      recaptchaSiteKey: getField(settings, 'recaptchaSiteKey', ''),
      recaptchaSecretKey: maskApiKey(getField(settings, 'recaptchaSecretKey', null)),
      googleClientId: getField(settings, 'googleClientId', ''),
      googleClientSecret: maskApiKey(getField(settings, 'googleClientSecret', null)),
      facebookClientId: getField(settings, 'facebookClientId', ''),
      facebookClientSecret: maskApiKey(getField(settings, 'facebookClientSecret', null)),
      // SEO & Branding
      homeMetaTitle: getField(settings, 'homeMetaTitle', ''),
      homeMetaDescription: getField(settings, 'homeMetaDescription', ''),
      faviconUrl: getField(settings, 'faviconUrl', ''),
      headerLogoUrl: getField(settings, 'headerLogoUrl', ''),
      footerLogoUrl: getField(settings, 'footerLogoUrl', ''),
      robotsTxtContent: getField(settings, 'robotsTxtContent', 'User-agent: *\nAllow: /'),
      customSitemapXml: getField(settings, 'customSitemapXml', ''),
      sitemapEnabled: getField(settings, 'sitemapEnabled', true),
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
    console.log('PUT /api/admin/settings received body:', JSON.stringify(body, null, 2));
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
      // SEO & Branding
      homeMetaTitle,
      homeMetaDescription,
      robotsTxtContent,
      customSitemapXml,
      sitemapEnabled,
      faviconUrl,
      headerLogoUrl,
      footerLogoUrl,
      
      // Analytics & Integrations
      googleAnalyticsId,
      googleSiteVerification,

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
      recaptchaSiteKey,
      recaptchaSecretKey,
      googleClientId,
      googleClientSecret,
      facebookClientId,
      facebookClientSecret,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpPass,
      smtpFrom,
      defaultCurrency,
      myFatoorahToken,
      myFatoorahBaseURL,
      myFatoorahTestMode,
    } = body;

    let settings: any;
    try {
      const result: any = await prisma.$queryRaw`SELECT * FROM "admin_settings" LIMIT 1`;
      settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    } catch (e) {
      console.error("Failed to fetch settings for update:", e);
    }

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

    // SEO & Branding - Handled via raw SQL below to avoid Prisma schema mismatch errors
    // if (homeMetaTitle !== undefined) updateData.homeMetaTitle = homeMetaTitle || null;
    // if (homeMetaDescription !== undefined) updateData.homeMetaDescription = homeMetaDescription || null;
    // if (faviconUrl !== undefined) updateData.faviconUrl = faviconUrl || null;
    // if (headerLogoUrl !== undefined) updateData.headerLogoUrl = headerLogoUrl || null;
    // if (footerLogoUrl !== undefined) updateData.footerLogoUrl = footerLogoUrl || null;

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
    if (recaptchaSiteKey !== undefined) updateData.recaptchaSiteKey = recaptchaSiteKey || null;
    if (recaptchaSecretKey !== undefined && !recaptchaSecretKey.includes('••••')) {
      updateData.recaptchaSecretKey = recaptchaSecretKey || null;
    }
    if (googleClientId !== undefined) updateData.googleClientId = googleClientId || null;
    if (googleClientSecret !== undefined && !googleClientSecret.includes('••••')) {
      updateData.googleClientSecret = googleClientSecret || null;
    }
    if (facebookClientId !== undefined) updateData.facebookClientId = facebookClientId || null;
    if (facebookClientSecret !== undefined && !facebookClientSecret.includes('••••')) {
      updateData.facebookClientSecret = facebookClientSecret || null;
    }
    if (smtpHost !== undefined) updateData.smtpHost = smtpHost;
    if (smtpPort !== undefined) updateData.smtpPort = smtpPort ? parseInt(smtpPort) : null;
    if (smtpSecure !== undefined) updateData.smtpSecure = smtpSecure;
    if (smtpUser !== undefined) updateData.smtpUser = smtpUser;
    if (smtpPass !== undefined) updateData.smtpPass = smtpPass;
    if (smtpFrom !== undefined) updateData.smtpFrom = smtpFrom;

    // Analytics & Integrations
    if (googleAnalyticsId !== undefined) updateData.googleAnalyticsId = googleAnalyticsId || null;
    if (googleSiteVerification !== undefined) updateData.googleSiteVerification = googleSiteVerification || null;

    // MyFatoorah Settings
    if (myFatoorahToken !== undefined && !myFatoorahToken.includes('••••')) {
      updateData.myFatoorahToken = myFatoorahToken || null;
    }
    if (myFatoorahBaseURL !== undefined) updateData.myFatoorahBaseURL = myFatoorahBaseURL;
    if (myFatoorahTestMode !== undefined) updateData.myFatoorahTestMode = myFatoorahTestMode;
    if (body.myFatoorahWebhookSecret !== undefined && !body.myFatoorahWebhookSecret.includes('••••')) {
      updateData.myFatoorahWebhookSecret = body.myFatoorahWebhookSecret || null;
    }

    if (defaultCurrency !== undefined) updateData.defaultCurrency = defaultCurrency;

    try {
      if (settings) {
        console.log('Updating existing settings record:', settings.id);
        await prisma.adminSettings.update({
          where: { id: settings.id },
          data: updateData,
        });
        console.log('Standard settings updated successfully');
      } else {
        console.log('Creating new settings record');
        const created = await prisma.adminSettings.create({
          data: updateData,
        });
        settings = created;
        console.log('Settings created successfully');
      }

      // Force update SEO & Branding fields via raw SQL
      // This is necessary because the Prisma Client might be outdated (locked by dev server)
      // and therefore unaware of these new columns.
      if (settings && settings.id) {
       try {
         console.log('Force updating SEO/Branding fields via raw SQL for ID:', settings.id);
         
           // Ensure values are safe for SQL (convert undefined to null if not provided, but prefer existing value if undefined)
           // Note: Empty strings from frontend will be treated as valid values, but we can convert to null if desired.
           // Current logic: undefined -> keep existing (or null). provided (inc empty string) -> use it.
           
           const getVal = (newVal: any, existingVal: any) => {
             if (newVal !== undefined) return newVal;
             return existingVal !== undefined ? existingVal : null;
           };

           const safeTitle = getVal(homeMetaTitle, settings.homeMetaTitle);
           const safeDesc = getVal(homeMetaDescription, settings.homeMetaDescription);
           const safeRobots = getVal(robotsTxtContent, settings.robotsTxtContent);
           const safeFavicon = getVal(faviconUrl, settings.faviconUrl);
           const safeHeader = getVal(headerLogoUrl, settings.headerLogoUrl);
           const safeFooter = getVal(footerLogoUrl, settings.footerLogoUrl);
           const safeCustomSitemapXml = getVal(customSitemapXml, settings.customSitemapXml);
           const safeSitemapEnabled = getVal(sitemapEnabled, settings.sitemapEnabled);

           const result = await prisma.$executeRaw`
             UPDATE "admin_settings"
             SET 
               "homeMetaTitle" = ${safeTitle},
               "homeMetaDescription" = ${safeDesc},
               "robotsTxtContent" = ${safeRobots},
               "customSitemapXml" = ${safeCustomSitemapXml},
               "sitemapEnabled" = ${safeSitemapEnabled},
               "faviconUrl" = ${safeFavicon},
               "headerLogoUrl" = ${safeHeader},
               "footerLogoUrl" = ${safeFooter}
             WHERE "id" = ${settings.id}
           `;
           console.log('Raw SQL update result:', result);
           
           const getSecretVal = (newVal: any, existingVal: any) => {
             if (newVal !== undefined) return newVal;
             return existingVal !== undefined ? existingVal : null;
           };
           const safeRecaptchaSiteKey = getVal(recaptchaSiteKey, settings.recaptchaSiteKey);
           const safeRecaptchaSecretKey = getSecretVal(recaptchaSecretKey, settings.recaptchaSecretKey);
           const safeGoogleClientId = getVal(googleClientId, settings.googleClientId);
           const safeGoogleClientSecret = getSecretVal(googleClientSecret, settings.googleClientSecret);
           const safeFacebookClientId = getVal(facebookClientId, settings.facebookClientId);
           const safeFacebookClientSecret = getSecretVal(facebookClientSecret, settings.facebookClientSecret);
           
           const authResult = await prisma.$executeRaw`
             UPDATE "admin_settings"
             SET
               "recaptchaSiteKey" = ${safeRecaptchaSiteKey},
               "recaptchaSecretKey" = ${safeRecaptchaSecretKey},
               "googleClientId" = ${safeGoogleClientId},
               "googleClientSecret" = ${safeGoogleClientSecret},
               "facebookClientId" = ${safeFacebookClientId},
               "facebookClientSecret" = ${safeFacebookClientSecret}
             WHERE "id" = ${settings.id}
           `;
           console.log('Raw SQL auth update result:', authResult);
         } catch (rawError: any) {
           console.error('Raw SQL Update Error:', rawError);
           // Don't fail the whole request if only SEO fields fail, but log it.
           // Or should we fail? Better to fail so user knows.
           throw rawError; 
         }
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
      debug: {
        seo: {
          homeMetaTitle: homeMetaTitle || null,
          homeMetaDescription: homeMetaDescription || null,
          faviconUrl: faviconUrl || null,
          headerLogoUrl: headerLogoUrl || null,
          footerLogoUrl: footerLogoUrl || null
        }
      }
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

