import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getMyFatoorahAPI } from '@/lib/myfatoorah-api';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Optional: require login to initiate session? 
    // Usually safe to allow initiation as long as execution is protected, 
    // but better to match other endpoints.
    
    // For checkout, we might want to allow guest checkout initiation if supported, 
    // but our main checkout requires auth.
    // Let's keep it consistent with /api/payments/create which checks session.
    // However, initiate session is just getting a token, no money moves yet.
    
    const myFatoorahAPI = await getMyFatoorahAPI();
    
    if (!myFatoorahAPI) {
      return NextResponse.json(
        { error: 'MyFatoorah payment is not configured.' },
        { status: 400 }
      );
    }

    // We can pass user ID as customer identifier if logged in
    const customerIdentifier = session?.user?.id || undefined;

    // Use V3 Session for better compatibility
    const data = await myFatoorahAPI.initiateSessionV3(10, 'KWD', customerIdentifier);
    
    // Determine script URL based on test mode
    const isTest = myFatoorahAPI.isTestMode;
    // Using V1 Session JS as recommended for V3 API
    const scriptUrl = isTest 
      ? 'https://demo.myfatoorah.com/sessions/v1/session.js'
      : 'https://portal.myfatoorah.com/sessions/v1/session.js';

    return NextResponse.json({
      sessionId: data.SessionId,
      countryCode: data.CountryCode,
      scriptUrl
    });
  } catch (error: any) {
    console.error('MyFatoorah initiate session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment session' },
      { status: 500 }
    );
  }
}
