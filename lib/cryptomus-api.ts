import axios from 'axios';
import crypto from 'crypto';

interface CryptomusPayment {
  uuid: string;
  order_id: string;
  amount: string;
  currency: string;
  payment_url: string;
  payment_status: string;
  network?: string;
  address?: string;
  from?: string;
  txid?: string;
  payment_currency?: string;
  payment_amount?: string;
}

interface CryptomusCreatePaymentRequest {
  amount: string;
  currency: string;
  order_id: string;
  url_return?: string;
  url_callback?: string;
  is_payment_multiple?: boolean;
  lifetime?: number;
  to_currency?: string;
  subtract?: number;
  accuracy_payment_percent?: number;
  additional_data?: string;
  currencies?: string[];
  network?: string;
  address?: string;
  from?: string;
  is_refresh?: boolean;
}

export class CryptomusAPI {
  private merchantId: string;
  private apiKey: string;
  private baseUrl: string;
  private testMode: boolean;

  constructor(merchantId?: string, apiKey?: string, testMode: boolean = false) {
    this.merchantId = merchantId || process.env.CRYPTOMUS_MERCHANT_ID || '';
    this.apiKey = apiKey || process.env.CRYPTOMUS_API_KEY || '';
    this.baseUrl = 'https://api.cryptomus.com/v1';
    this.testMode = testMode;
  }

  /**
   * Generate signature for Cryptomus API request
   */
  private generateSignature(payload: string): string {
    const sign = crypto
      .createHash('md5')
      .update(Buffer.from(payload).toString('base64') + this.apiKey)
      .digest('hex');
    return sign;
  }

  /**
   * Create a payment
   */
  async createPayment(
    orderId: string,
    amount: number,
    currency: string = 'USD',
    returnUrl?: string,
    callbackUrl?: string
  ): Promise<CryptomusPayment> {
    if (!this.merchantId || !this.apiKey) {
      throw new Error('Cryptomus merchant ID and API key must be configured');
    }

    const payload: CryptomusCreatePaymentRequest = {
      amount: amount.toFixed(2),
      currency: currency.toUpperCase(),
      order_id: orderId,
      url_return: returnUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`,
      url_callback: callbackUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/webhooks/cryptomus`,
      is_payment_multiple: false,
      lifetime: 7200, // 2 hours
    };

    const payloadString = JSON.stringify(payload);
    const sign = this.generateSignature(payloadString);

    try {
      const response = await axios.post(
        `${this.baseUrl}/payment`,
        payloadString,
        {
          headers: {
            'merchant': this.merchantId,
            'sign': sign,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.state === 0 && response.data.result) {
        return {
          uuid: response.data.result.uuid || '',
          order_id: response.data.result.order_id || orderId,
          amount: response.data.result.amount || amount.toFixed(2),
          currency: response.data.result.currency || currency.toUpperCase(),
          payment_url: response.data.result.url || '',
          payment_status: response.data.result.payment_status || 'wait',
          network: response.data.result.network,
          address: response.data.result.address,
          from: response.data.result.from,
          txid: response.data.result.txid,
          payment_currency: response.data.result.payment_currency,
          payment_amount: response.data.result.payment_amount,
        };
      } else {
        throw new Error(response.data.message || 'Failed to create Cryptomus payment');
      }
    } catch (error: any) {
      console.error('Cryptomus API Error:', error.response?.data || error.message);
      throw new Error(
        `Failed to create Cryptomus payment: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<CryptomusPayment> {
    if (!this.merchantId || !this.apiKey) {
      throw new Error('Cryptomus merchant ID and API key must be configured');
    }

    const payload = { order_id: orderId };
    const payloadString = JSON.stringify(payload);
    const sign = this.generateSignature(payloadString);

    try {
      const response = await axios.post(
        `${this.baseUrl}/payment/info`,
        payloadString,
        {
          headers: {
            'merchant': this.merchantId,
            'sign': sign,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.state === 0 && response.data.result) {
        return {
          uuid: response.data.result.uuid || '',
          order_id: response.data.result.order_id || orderId,
          amount: response.data.result.amount || '0',
          currency: response.data.result.currency || 'USD',
          payment_url: response.data.result.url || '',
          payment_status: response.data.result.payment_status || 'wait',
          network: response.data.result.network,
          address: response.data.result.address,
          from: response.data.result.from,
          txid: response.data.result.txid,
          payment_currency: response.data.result.payment_currency,
          payment_amount: response.data.result.payment_amount,
        };
      } else {
        throw new Error(response.data.message || 'Failed to get payment status');
      }
    } catch (error: any) {
      console.error('Get Cryptomus payment status error:', error);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: any, signature: string): boolean {
    if (!this.apiKey) {
      console.warn('Cryptomus API key not configured');
      return false;
    }

    try {
      const payloadString = JSON.stringify(payload);
      const calculatedSignature = this.generateSignature(payloadString);
      return calculatedSignature === signature;
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }
}

// Create a function to get Cryptomus API instance with settings from database
export async function getCryptomusAPI(): Promise<CryptomusAPI | null> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const settings = await prisma.adminSettings.findFirst();
    
    if (!settings || !settings.cryptomusMerchantId || !settings.cryptomusApiKey) {
      return null;
    }

    // Unmask API key if it's masked (contains ••••)
    let apiKey = settings.cryptomusApiKey;
    if (apiKey.includes('••••')) {
      // If masked, try to get from environment variable
      apiKey = process.env.CRYPTOMUS_API_KEY || '';
      if (!apiKey) {
        console.warn('Cryptomus API key is masked and not available in environment');
        return null;
      }
    }

    return new CryptomusAPI(
      settings.cryptomusMerchantId,
      apiKey,
      settings.cryptomusTestMode || false
    );
  } catch (error) {
    console.error('Failed to get Cryptomus API instance:', error);
    return null;
  }
}

