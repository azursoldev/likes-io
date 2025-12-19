import axios from 'axios';
import { Platform, ServiceType } from '@prisma/client';

interface JAPService {
  service?: number; // Service ID (primary field)
  id?: number; // Alternative field name some APIs use
  name: string;
  category: string;
  type: string;
  rate: number;
  min: number;
  max: number;
}

interface JAPOrderResponse {
  order: number;
  status?: string;
  remains?: number;
  start_count?: number;
  charge?: number;
  currency?: string;
}

interface JAPStatusResponse {
  status: string;
  charge?: number;
  remains?: number;
  start_count?: number;
  currency?: string;
}

interface JAPBalanceResponse {
  balance: number;
  currency?: string;
}

export class JAPAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.JAP_API_URL || '';
    this.apiKey = process.env.JAP_API_KEY || '';
  }

  /**
   * Connect to JAP API using form-encoded POST requests
   * Matches the PHP implementation format
   */
  private async connect(postData: Record<string, any>): Promise<any> {
    if (!this.apiUrl || !this.apiKey) {
      throw new Error('JAP API credentials not configured');
    }

    try {
      // Build form-encoded data
      const formData = new URLSearchParams();
      Object.keys(postData).forEach((key) => {
        const value = postData[key];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await axios({
        method: 'POST',
        url: this.apiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
        },
        data: formData.toString(),
        timeout: 30000,
        validateStatus: () => true, // Don't throw on HTTP errors, we'll handle them
      });

      // JAP API returns JSON strings, parse them
      if (typeof response.data === 'string') {
        try {
          return JSON.parse(response.data);
        } catch {
          return response.data;
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('JAP API Error:', error.response?.data || error.message);
      throw new Error(`JAP API Error: ${error.response?.data?.message || error.message || 'Connection failed'}`);
    }
  }

  private mapPlatformToJAPCategory(platform: Platform): string {
    const mapping: Record<Platform, string> = {
      INSTAGRAM: 'Instagram',
      TIKTOK: 'TikTok',
      YOUTUBE: 'YouTube',
    };
    return mapping[platform] || platform;
  }

  private mapServiceTypeToJAPType(serviceType: ServiceType): string {
    const mapping: Record<ServiceType, string> = {
      LIKES: 'Likes',
      FOLLOWERS: 'Followers',
      VIEWS: 'Views',
      SUBSCRIBERS: 'Subscribers',
    };
    return mapping[serviceType] || serviceType;
  }

  /**
   * Get all services from JAP
   * Matches: $api->services()
   */
  async syncServices(platform?: Platform): Promise<JAPService[]> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'services',
      });

      // JAP returns services as an array or object
      let services: JAPService[] = [];
      if (Array.isArray(response)) {
        services = response;
      } else if (typeof response === 'object') {
        // Sometimes it's wrapped in an object
        services = Object.values(response) as JAPService[];
      }

      // Filter by platform if provided
      if (platform && services.length > 0) {
        const category = this.mapPlatformToJAPCategory(platform);
        return services.filter((service: JAPService) => 
          service.category === category
        );
      }

      return services || [];
    } catch (error: any) {
      console.error('Failed to sync services:', error);
      throw error;
    }
  }

  /**
   * Create a new order
   * Matches: $api->order(['service' => 1, 'link' => '...', 'quantity' => 100])
   */
  async createOrder(
    serviceId: string | number,
    link: string,
    quantity: number,
    options?: {
      runs?: number;
      interval?: number;
      username?: string;
      keywords?: string;
      comments?: string;
      usernames?: string;
      hashtags?: string;
      hashtag?: string;
      media?: string;
      country?: string;
      device?: string;
      type_of_traffic?: number;
      google_keyword?: string;
      min?: number;
      max?: number;
      posts?: number;
      old_posts?: number;
      delay?: number;
      expiry?: string;
      answer_number?: string;
      groups?: string;
    }
  ): Promise<JAPOrderResponse> {
    try {
      const orderData: Record<string, any> = {
        key: this.apiKey,
        action: 'add',
        service: serviceId,
        link,
      };

      // Add quantity if provided
      if (quantity) {
        orderData.quantity = quantity;
      }

      // Add optional parameters
      if (options) {
        Object.keys(options).forEach((key) => {
          const value = (options as any)[key];
          if (value !== undefined && value !== null) {
            orderData[key] = value;
          }
        });
      }

      const response = await this.connect(orderData);

      return {
        order: response.order || response.id || 0,
        status: response.status,
        remains: response.remains,
        start_count: response.start_count,
        charge: response.charge,
        currency: response.currency,
      };
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  /**
   * Get order status
   * Matches: $api->status($orderId)
   */
  async getOrderStatus(japOrderId: string | number): Promise<JAPStatusResponse> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'status',
        order: japOrderId,
      });
      
      return {
        status: response.status || 'processing',
        remains: response.remains,
        start_count: response.start_count,
        charge: response.charge,
        currency: response.currency,
      };
    } catch (error: any) {
      console.error('Failed to get order status:', error);
      throw error;
    }
  }

  /**
   * Get multiple orders status
   * Matches: $api->multiStatus([1, 2, 3])
   */
  async getMultiOrderStatus(orderIds: (string | number)[]): Promise<JAPStatusResponse[]> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'status',
        orders: orderIds.join(','),
      });

      // JAP returns an array or object with order IDs as keys
      if (Array.isArray(response)) {
        return response;
      } else if (typeof response === 'object') {
        return Object.values(response) as JAPStatusResponse[];
      }

      return [];
    } catch (error: any) {
      console.error('Failed to get multi order status:', error);
      throw error;
    }
  }

  /**
   * Request refill for an order
   * Matches: $api->refill($orderId)
   */
  async refillOrder(orderId: number): Promise<{ refill: number }> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'refill',
        order: orderId,
      });

      return {
        refill: response.refill || response.id || 0,
      };
    } catch (error: any) {
      console.error('Failed to refill order:', error);
      throw error;
    }
  }

  /**
   * Request refill for multiple orders
   * Matches: $api->multiRefill([1, 2])
   */
  async refillOrders(orderIds: number[]): Promise<{ refill: number }[]> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'refill',
        orders: orderIds.join(','),
      });

      if (Array.isArray(response)) {
        return response;
      } else if (typeof response === 'object') {
        return Object.values(response) as { refill: number }[];
      }

      return [];
    } catch (error: any) {
      console.error('Failed to refill orders:', error);
      throw error;
    }
  }

  /**
   * Get refill status
   * Matches: $api->refillStatus($refillId)
   */
  async getRefillStatus(refillId: number): Promise<any> {
    try {
      return await this.connect({
        key: this.apiKey,
        action: 'refill_status',
        refill: refillId,
      });
    } catch (error: any) {
      console.error('Failed to get refill status:', error);
      throw error;
    }
  }

  /**
   * Get multiple refill statuses
   * Matches: $api->multiRefillStatus([1, 2])
   */
  async getMultiRefillStatus(refillIds: number[]): Promise<any[]> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'refill_status',
        refills: refillIds.join(','),
      });

      if (Array.isArray(response)) {
        return response;
      } else if (typeof response === 'object') {
        return Object.values(response);
      }

      return [];
    } catch (error: any) {
      console.error('Failed to get multi refill status:', error);
      throw error;
    }
  }

  /**
   * Cancel orders
   * Matches: $api->cancel([1, 2, 3])
   */
  async cancelOrders(orderIds: number[]): Promise<any> {
    try {
      return await this.connect({
        key: this.apiKey,
        action: 'cancel',
        orders: orderIds.join(','),
      });
    } catch (error: any) {
      console.error('Failed to cancel orders:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   * Matches: $api->balance()
   */
  async getBalance(): Promise<number> {
    try {
      const response = await this.connect({
        key: this.apiKey,
        action: 'balance',
      });

      return response.balance || 0;
    } catch (error: any) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  // Retry logic helper
  async retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}

export const japAPI = new JAPAPI();

