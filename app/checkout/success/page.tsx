'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { trackPurchase } = useGoogleAnalytics();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID missing');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) {
          if (res.status === 401) throw new Error('Please log in to view your order');
          throw new Error('Failed to load order');
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && !trackedRef.current) {
      trackPurchase(order.id, order.price, 'USD', [
        {
          item_id: order.serviceType,
          item_name: `${order.platform} ${order.serviceType}`,
          price: order.price,
          quantity: order.quantity,
        },
      ]);
      trackedRef.current = true;
    }
  }, [order, trackPurchase]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {loading ? (
          <div className="py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <div className="text-red-500 text-xl mb-4">Unable to load order</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/my-account"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to My Account
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">
                    {order.platform} {order.serviceType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-blue-600">
                    ${order.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard/orders"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Track Order
              </Link>
              <Link 
                href="/"
                className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
          </div>
        }>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
