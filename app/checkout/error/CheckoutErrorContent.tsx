"use client";

import "../success/success.css";

import { Suspense, useEffect, useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckoutErrorContentInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const reason = searchParams.get("reason");

  const [order, setOrder] = useState<{
    platform: string;
    serviceType: string;
    quantity: number;
    price: number;
    currency: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`/api/orders/${orderId}/status`)
      .then((res) => {
        if (!res.ok) {
          setFetchFailed(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data?.order) return;
        setOrder(data.order);
      })
      .catch(() => setFetchFailed(true))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  let shortRef: string | null = null;
  if (orderId) {
    shortRef = orderId.length > 12 ? `…${orderId.slice(-8)}` : orderId;
  }

  const isCancel =
    reason === "cancel" || reason === "canceled" || reason === "cancelled";

  return (
    <div className="success-page-wrapper">
      <div className="success-card">
        {loading ? (
          <div className="loading-container">
            <p className="text-gray-600">Loading…</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div
              className="success-icon-wrapper"
              style={{ backgroundColor: "#fee2e2" }}
            >
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="success-icon"
                style={{ color: "#dc2626" }}
              />
            </div>

            <h1 className="success-title" style={{ color: "#b91c1c" }}>
              {isCancel ? "Payment canceled" : "Payment not completed"}
            </h1>
            <p className="success-message">
              {isCancel
                ? "You left the payment page before completing checkout. No charge was made."
                : "We couldn’t confirm your payment. If you were charged and don’t see your order, contact support with your order reference below."}
            </p>

            {(orderId || order) && (
              <div className="order-summary-box">
                <h3 className="summary-title">Order reference</h3>
                <div className="summary-rows">
                  {orderId && (
                    <div className="summary-row">
                      <span className="summary-label">Order ID</span>
                      <span
                        className="summary-value font-mono"
                        style={{ fontSize: "0.85rem", wordBreak: "break-all" }}
                      >
                        {orderId}
                      </span>
                    </div>
                  )}
                  {shortRef && orderId && orderId.length > 12 && (
                    <div className="summary-row">
                      <span className="summary-label">Short ref</span>
                      <span className="summary-value font-mono">{shortRef}</span>
                    </div>
                  )}
                  {order && !fetchFailed && (
                    <>
                      <div className="summary-row">
                        <span className="summary-label">Service</span>
                        <span className="summary-value capitalize">
                          {order.platform} {order.serviceType}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Amount</span>
                        <span className="summary-value font-semibold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: order.currency || "USD",
                          }).format(order.price)}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Status</span>
                        <span className="summary-value">{order.status}</span>
                      </div>
                    </>
                  )}
                  {orderId && fetchFailed && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      We couldn’t load full order details. You can still use the
                      Order ID above when contacting support.
                    </p>
                  )}
                </div>
              </div>
            )}

            {!orderId && (
              <p className="success-message" style={{ marginTop: "-0.5rem" }}>
                If you started a checkout, open the link from your email or try
                your purchase again from the service page.
              </p>
            )}

            <div className="action-buttons">
              <Link href="/" className="btn-success-primary">
                Browse services
              </Link>
              <Link href="/contact" className="btn-success-secondary">
                Contact support
              </Link>
              <Link href="/dashboard/orders" className="btn-success-secondary">
                My orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutErrorContent() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="success-page-wrapper">
            <div className="success-card">
              <div className="loading-container">
                <p className="text-gray-600">Loading…</p>
              </div>
            </div>
          </div>
        }
      >
        <CheckoutErrorContentInner />
      </Suspense>
      <Footer />
    </>
  );
}
