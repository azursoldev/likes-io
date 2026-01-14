"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './success.css';

function CheckoutSuccessContentInner() {
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
            <div className="success-icon-wrapper">
              <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            </div>
            
            <h1 className="success-title">
              Payment Successful!
            </h1>
            <p className="success-message">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>

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
