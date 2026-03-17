import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const ZIINA_API_BASE = "https://api-v2.ziina.com/api";

interface ZiinaConfig {
  apiKey: string;
  testMode: boolean;
}

interface CreatePaymentIntentParams {
  amount: number; // in major units (e.g. 10.50)
  currency: string; // ISO 4217 e.g. USD, AED
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  message?: string;
  orderId?: string;
}

/**
 * Convert price in major units to Ziina base units (cents/fils).
 * Ziina expects e.g. $10.50 as 1050.
 */
function toBaseUnits(amount: number): number {
  return Math.round(amount * 100);
}

export class ZiinaAPI {
  private config: ZiinaConfig;

  constructor(config: ZiinaConfig) {
    this.config = config;
  }

  get isTestMode() {
    return this.config.testMode;
  }

  private async request<T>(endpoint: string, method: string, body?: object): Promise<T> {
    const url = `${ZIINA_API_BASE}${endpoint}`;
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const msg =
        (data as any)?.message ||
        (data as any)?.latest_error?.message ||
        "Ziina API error";
      throw new Error(msg);
    }

    return data as T;
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
    id: string;
    redirect_url: string;
    status: string;
    amount: number;
    currency_code: string;
  }> {
    const body = {
      amount: toBaseUnits(params.amount),
      currency_code: params.currency,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      failure_url: params.failureUrl,
      message: params.message || `Order ${params.orderId || ""}`,
      test: this.config.testMode,
    };

    return this.request("/payment_intent", "POST", body);
  }

  verifyWebhookSignature(payload: string, secret: string, signature: string): boolean {
    if (!payload || !secret || !signature) return false;
    try {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(payload);
      const calculated = hmac.digest("hex");
      return signature === calculated;
    } catch (e) {
      console.error("Ziina webhook signature verification failed:", e);
      return false;
    }
  }
}

export async function getZiinaAPI(): Promise<ZiinaAPI | null> {
  const apiKey = process.env.ZIINA_API_KEY || "";
  if (!apiKey) return null;

  const settings = await prisma.adminSettings.findFirst();
  const s = settings as { ziinaTestMode?: boolean } | null;
  const testMode = s?.ziinaTestMode ?? (process.env.ZIINA_TEST_MODE ? process.env.ZIINA_TEST_MODE === "true" : true);

  return new ZiinaAPI({ apiKey, testMode });
}
