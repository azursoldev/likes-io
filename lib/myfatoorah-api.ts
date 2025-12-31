import { prisma } from "@/lib/prisma";

interface MyFatoorahConfig {
  token: string;
  baseURL: string;
  testMode: boolean;
}

interface InitiatePaymentRequest {
  InvoiceAmount: number;
  CurrencyIso: string;
}

interface ExecutePaymentRequest {
  PaymentMethodId: string;
  CustomerName: string;
  DisplayCurrencyIso: string;
  MobileCountryCode?: string;
  CustomerMobile?: string;
  CustomerEmail: string;
  InvoiceValue: number;
  CallBackUrl: string;
  ErrorUrl: string;
  Language?: string;
  CustomerReference?: string;
  CustomerCivilId?: string;
  UserDefinedField?: string;
  ExpireDate?: string;
  CustomerAddress?: {
    Block: string;
    Street: string;
    HouseBuildingNo: string;
    Address: string;
    AddressInstructions: string;
  };
  InvoiceItems?: Array<{
    ItemName: string;
    Quantity: number;
    UnitPrice: number;
  }>;
}

export class MyFatoorahAPI {
  private config: MyFatoorahConfig;

  constructor(config: MyFatoorahConfig) {
    this.config = config;
  }

  private async request(endpoint: string, method: string, body?: any) {
    const url = `${this.config.baseURL}/v2/${endpoint}`;
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.config.token}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || data.ValidationErrors?.[0]?.Error || 'MyFatoorah API error');
      }

      if (data.IsSuccess === false) {
         throw new Error(data.Message || 'MyFatoorah API returned failure');
      }

      return data.Data;
    } catch (error) {
      console.error(`MyFatoorah API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async initiatePayment(amount: number, currency: string) {
    return this.request('InitiatePayment', 'POST', {
      InvoiceAmount: amount,
      CurrencyIso: currency,
    });
  }

  async createPayment(
    orderId: string,
    amount: number,
    currency: string,
    customerName: string,
    customerEmail: string,
    callbackUrl: string,
    errorUrl: string
  ) {
    // Default to PaymentMethodId 2 (KNET/Credit Card depending on region, usually safe default for hosted page)
    // Or you can use InitiatePayment to get available methods and let user choose.
    // For direct integration as requested, we might need a specific ID or let MF handle it.
    // Using '2' as per user example, but ideally should be dynamic.
    
    const body: ExecutePaymentRequest = {
      PaymentMethodId: '2', 
      CustomerName: customerName,
      DisplayCurrencyIso: currency,
      CustomerEmail: customerEmail,
      InvoiceValue: amount,
      CallBackUrl: callbackUrl,
      ErrorUrl: errorUrl,
      Language: 'en',
      CustomerReference: orderId,
      UserDefinedField: orderId,
      InvoiceItems: [
        {
          ItemName: `Order ${orderId}`,
          Quantity: 1,
          UnitPrice: amount,
        },
      ],
    };

    return this.request('ExecutePayment', 'POST', body);
  }

  async getPaymentStatus(paymentId: string) {
    return this.request('GetPaymentStatus', 'POST', {
      Key: paymentId,
      KeyType: 'InvoiceId',
    });
  }
}

export async function getMyFatoorahAPI(): Promise<MyFatoorahAPI | null> {
  const settings = await prisma.adminSettings.findFirst();

  if (!settings?.myFatoorahToken) {
    return null;
  }

  return new MyFatoorahAPI({
    token: settings.myFatoorahToken,
    baseURL: settings.myFatoorahBaseURL || 'https://apitest.myfatoorah.com',
    testMode: settings.myFatoorahTestMode ?? true,
  });
}
