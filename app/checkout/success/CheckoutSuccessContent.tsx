"use client";

import './success.css';

import { Suspense, useEffect, useRef, useState } from 'react';
import { faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Link from 'next/link';
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics';
import { useSearchParams } from 'next/navigation';

function CheckoutSuccessContentInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ziinaCheckComplete, setZiinaCheckComplete] = useState(false);
  const { trackPurchase } = useGoogleAnalytics();
  const trackedRef = useRef(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`);
      if (!res.ok) {
        if (res.status === 401) throw new Error('Please log in to view your order');
        throw new Error('Failed to load order');
      }
      const data = await res.json();
      setOrder(data.order);
      return data.order;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!orderId) {
      setError('Order ID missing');
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderId]);

  // Ziina: sync status from Ziina GET /payment_intent/{id}; when done (or after timeout), set ziinaCheckComplete so we show real status
  const syncAttemptedRef = useRef(false);
  useEffect(() => {
    if (!orderId || !order || order.status !== 'PENDING_PAYMENT' || syncAttemptedRef.current) return;
    const gateway = order.payment?.gateway;
    if (gateway !== 'ZIINA') return;

    syncAttemptedRef.current = true;
    const timeout = setTimeout(() => setZiinaCheckComplete(true), 10000); // fallback: stop "Confirming..." after 10s

    fetch(`/api/orders/${orderId}/sync-payment`)
      .then((res) => res.json())
      .then((data) => {
        if (data.synced && data.orderStatus) {
          setOrder((prev: any) => (prev ? { ...prev, status: data.orderStatus } : prev));
        }
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        fetchOrder().then(() => setZiinaCheckComplete(true));
      });
  }, [orderId, order?.status, order?.payment?.gateway]);

  // When order is still PENDING_PAYMENT, poll for status update (webhook or sync may have updated)
  useEffect(() => {
    if (!orderId || !order || order.status !== 'PENDING_PAYMENT') return;

    const maxPolls = 20; // 20 * 3s = 60s
    let count = 0;

    const interval = setInterval(async () => {
      count += 1;
      if (count > maxPolls) {
        clearInterval(interval);
        return;
      }
      const updated = await fetch(`/api/orders/${orderId}/status`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data?.order ?? null);
      if (updated && updated.status !== 'PENDING_PAYMENT') {
        setOrder(updated);
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

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

    if (order) {
       if (order.status === 'PENDING_PAYMENT' && order.payment?.gateway === 'ZIINA') {
         document.title = 'Confirming payment | Likes.io';
       } else if (order.status === 'PENDING_PAYMENT') {
         document.title = 'Payment Pending | Likes.io';
       } else if (order.status === 'FAILED' || order.status === 'CANCELLED') {
         document.title = 'Payment Failed | Likes.io';
       }
    }
  }, [order, trackPurchase]);

  return (
    <div className="success-page-wrapper">
      <div className="success-card">
        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} className="loading-spinner fa-spin" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-title">Unable to load order</div>
            <p className="success-message">{error}</p>
            <Link 
              href="/dashboard"
              className="btn-success-primary"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in">
            {order.status === 'PENDING_PAYMENT' && order.payment?.gateway === 'ZIINA' && !ziinaCheckComplete ? (
              <>
                <div className="loading-container" style={{ marginBottom: '1rem' }}>
                  <FontAwesomeIcon icon={faSpinner} className="loading-spinner fa-spin" />
                  <p className="text-gray-600">Confirming your payment...</p>
                </div>
              </>
            ) : order.status === 'PENDING_PAYMENT' || order.status === 'FAILED' || order.status === 'CANCELLED' ? (
              <>
                <div className="success-icon-wrapper" style={{ backgroundColor: '#fee2e2' }}>
                  <FontAwesomeIcon icon={faTimesCircle} className="success-icon" style={{ color: '#ef4444' }} />
                </div>
                
                <h1 className="success-title" style={{ color: '#ef4444' }}>
                  {order.status === 'PENDING_PAYMENT' ? 'Payment Not Completed' : 'Payment Failed'}
                </h1>
                <p className="success-message">
                  {order.status === 'PENDING_PAYMENT' 
                    ? "We haven't received your payment confirmation yet. If you paid via Crypto, it may take a few minutes to confirm." 
                    : "Your payment could not be processed. Please try again."}
                </p>
              </>
            ) : (
              <>
                <div className="success-icon-wrapper">
                  <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                </div>
                
                <h1 className="success-title">
                  Payment Successful!
                </h1>
                <p className="success-message">
                  Thank you for your purchase. Your order has been received and is being processed.
                </p>
              </>
            )}

            <div className="order-summary-box">
              <h3 className="summary-title">
                Order Summary
              </h3>
              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-label">Order ID</span>
                  <span className="summary-value font-mono">{orderId}</span>
                </div>
                {order && (
                  <>
                    <div className="summary-row">
                      <span className="summary-label">Service</span>
                      <span className="summary-value capitalize">
                        {order.platform} {order.serviceType}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Quantity</span>
                      <span className="summary-value">{order.quantity}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Total Amount</span>
                      <span className="summary-value font-semibold">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: order.currency || 'USD'
                        }).format(order.price)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="action-buttons">
              <Link 
                href="/dashboard"
                className="btn-success-primary"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/"
                className="btn-success-secondary"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessContent() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
        <CheckoutSuccessContentInner />
      </Suspense>
      <Footer />
    </>
  );
}
