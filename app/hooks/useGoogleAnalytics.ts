export const useGoogleAnalytics = () => {
  const trackEvent = (action: string, params: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, params);
    } else {
      console.log('GA4 Event (Dev):', action, params);
    }
  };

  const trackPurchase = (transactionId: string, value: number, currency: string, items: any[]) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  };

  const trackBeginCheckout = (items: any[], value: number, currency: string) => {
    trackEvent('begin_checkout', {
      currency: currency,
      value: value,
      items: items,
    });
  };

  return { trackEvent, trackPurchase, trackBeginCheckout };
};
