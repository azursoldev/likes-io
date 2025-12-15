import axios from 'axios';
import crypto from 'crypto';

interface CheckoutSession {
  id: string;
  checkout_url: string;
  expires_at: string;
}

interface CheckoutWebhookEvent {
  id: string;
  type: string;
  data: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reference?: string;
    [key: string]: any;
  };
}

export class CheckoutAPI {
  private apiKey: string;
  private webhookSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CHECKOUT_API_KEY || '';
    this.webhookSecret = process.env.CHECKOUT_WEBHOOK_SECRET || '';
    this.baseUrl = process.env.CHECKOUT_API_URL || 'https://api.checkout.com';
  }

  async createPaymentSession(
    orderId: string,
    amount: number,
    currency: string = 'USD',
    platform?: string
  ): Promise<CheckoutSession> {
    if (!this.apiKey) {
      throw new Error('Checkout.com API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toUpperCase(),
          reference: orderId,
          description: `Order ${orderId} - ${platform || 'Social Media Service'}`,
          success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`,
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
        id: response.data.id,
        checkout_url: response.data.links?.payment || response.data.redirect_link,
        expires_at: response.data.expires_at,
      };
    } catch (error: any) {
      console.error('Checkout.com API Error:', error.response?.data || error.message);
      throw new Error(`Failed to create payment session: ${error.response?.data?.message || error.message}`);
    }
  }

  verifyWebhook(signature: string, payload: string): boolean {
    if (!this.webhookSecret) {
      console.warn('Checkout.com webhook secret not configured');
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

  async handleWebhook(event: CheckoutWebhookEvent): Promise<{
    orderId: string;
    status: 'success' | 'failed';
    transactionId: string;
    amount: number;
  }> {
    const orderId = event.data.reference || event.data.metadata?.orderId;
    
    if (!orderId) {
      throw new Error('Order ID not found in webhook event');
    }

    const status = event.data.status === 'Authorized' || event.data.status === 'Captured' 
      ? 'success' 
      : 'failed';

    return {
      orderId,
      status,
      transactionId: event.data.id,
      amount: event.data.amount / 100, // Convert from cents
    };
  }

  async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
  }> {
    if (!this.apiKey) {
      throw new Error('Checkout.com API key not configured');
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        status: response.data.status,
        amount: response.data.amount / 100,
        currency: response.data.currency,
      };
    } catch (error: any) {
      console.error('Get payment status error:', error);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }
}

export const checkoutAPI = new CheckoutAPI();

