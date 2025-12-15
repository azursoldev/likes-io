import axios from 'axios';
import crypto from 'crypto';

interface BigPayMeSession {
  id: string;
  checkout_url: string;
  expires_at: string;
}

interface BigPayMeWebhookEvent {
  id: string;
  type: string;
  data: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id?: string;
    [key: string]: any;
  };
}

export class BigPayMeAPI {
  private apiKey: string;
  private webhookSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.BIGPAYME_API_KEY || '';
    this.webhookSecret = process.env.BIGPAYME_WEBHOOK_SECRET || '';
    this.baseUrl = process.env.BIGPAYME_API_URL || 'https://api.bigpayme.com';
  }

  async createPaymentSession(
    orderId: string,
    amount: number,
    currency: string = 'USD',
    platform?: string
  ): Promise<BigPayMeSession> {
    if (!this.apiKey) {
      throw new Error('BigPayMe API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payments`,
        {
          amount: amount.toFixed(2),
          currency: currency.toUpperCase(),
          order_id: orderId,
          description: `Order ${orderId} - ${platform || 'Social Media Service'}`,
          return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`,
          cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/cancel?orderId=${orderId}`,
          metadata: {
            orderId,
            platform,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.payment_id || response.data.id,
        checkout_url: response.data.checkout_url || response.data.redirect_url,
        expires_at: response.data.expires_at,
      };
    } catch (error: any) {
      console.error('BigPayMe API Error:', error.response?.data || error.message);
      throw new Error(`Failed to create payment session: ${error.response?.data?.message || error.message}`);
    }
  }

  verifyWebhook(signature: string, payload: string): boolean {
    if (!this.webhookSecret) {
      console.warn('BigPayMe webhook secret not configured');
      return false;
    }

    try {
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      const calculatedSignature = hmac.update(payload).digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(calculatedSignature)
      );
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }

  async handleWebhook(event: BigPayMeWebhookEvent): Promise<{
    orderId: string;
    status: 'success' | 'failed';
    transactionId: string;
    amount: number;
  }> {
    const orderId = event.data.order_id || event.data.metadata?.orderId;
    
    if (!orderId) {
      throw new Error('Order ID not found in webhook event');
    }

    const status = event.data.status === 'completed' || event.data.status === 'paid'
      ? 'success'
      : 'failed';

    return {
      orderId,
      status,
      transactionId: event.data.id,
      amount: parseFloat(event.data.amount.toString()),
    };
  }

  async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
  }> {
    if (!this.apiKey) {
      throw new Error('BigPayMe API key not configured');
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        status: response.data.status,
        amount: parseFloat(response.data.amount),
        currency: response.data.currency,
      };
    } catch (error: any) {
      console.error('Get payment status error:', error);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }
}

export const bigPayMeAPI = new BigPayMeAPI();

