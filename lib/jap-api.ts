import axios from 'axios';
import { Platform, ServiceType } from '@prisma/client';

interface JAPService {
  id: string;
  name: string;
  category: string;
  type: string;
  rate: number;
  min: number;
  max: number;
  available: boolean;
}

interface JAPOrderResponse {
  order: number;
  status?: string;
  remains?: number;
  start_count?: number;
}

export class JAPAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.JAP_API_URL || '';
    this.apiKey = process.env.JAP_API_KEY || '';
  }

  private async request(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    if (!this.apiUrl || !this.apiKey) {
      throw new Error('JAP API credentials not configured');
    }

    try {
      const response = await axios({
        method,
        url: `${this.apiUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        data,
        timeout: 30000,
      });

      return response.data;
    } catch (error: any) {
      console.error('JAP API Error:', error.response?.data || error.message);
      throw new Error(`JAP API Error: ${error.response?.data?.message || error.message}`);
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

  async syncServices(platform?: Platform): Promise<JAPService[]> {
    try {
      const services = await this.request('/services', 'GET');
      
      // Filter by platform if provided
      if (platform) {
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

  async createOrder(
    serviceId: string,
    link: string,
    quantity: number,
    platform: Platform
  ): Promise<JAPOrderResponse> {
    try {
      const response = await this.request('/order', 'POST', {
        service: serviceId,
        link,
        quantity,
      });

      return {
        order: response.order || response.id,
        status: response.status,
        remains: response.remains,
        start_count: response.start_count,
      };
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  async getOrderStatus(japOrderId: string): Promise<{
    status: string;
    remains?: number;
    start_count?: number;
    delivered?: number;
  }> {
    try {
      const response = await this.request(`/order/${japOrderId}`, 'GET');
      
      return {
        status: response.status || 'processing',
        remains: response.remains,
        start_count: response.start_count,
        delivered: response.delivered,
      };
    } catch (error: any) {
      console.error('Failed to get order status:', error);
      throw error;
    }
  }

  async getBalance(): Promise<number> {
    try {
      const response = await this.request('/balance', 'GET');
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

