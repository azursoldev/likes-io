"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../admin/dashboard.css";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "./UserSidebar";
import {
  faSearch,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faEye,
  faXmark,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

type Order = {
  id: string;
  date: string;
  profile: string;
  package: string;
  currency: string;
  amount: string;
  paidWith: {
    type: string;
    lastFour: string;
  };
  status: string;
  email: string;
  smmOrderId?: string;
};

interface OrderHistoryProps {
  initialOrders: Order[];
}

export default function OrderHistory({ initialOrders = [] }: OrderHistoryProps) {
  const [orders] = useState<Order[]>(initialOrders);
  const totalOrders = orders.length;
  const startIndex = totalOrders > 0 ? 1 : 0;
  const endIndex = totalOrders;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        <UserSidebar active="orders" />

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="container">
            <div className="order-history-header">
              <h1 className="order-history-title">Order History</h1>
              
              <div className="order-history-controls">
                {/* Search */}
                <div className="order-search">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="order-search-input"
                  />
                </div>
                
                {/* Filter Button */}
                <button className="order-filter-btn">
                  <FontAwesomeIcon icon={faFilter} />
                  <span>Showing all orders</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="order-history-table-wrapper">
              <table className="order-history-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>PROFILE</th>
                    <th>PACKAGE</th>
                    <th>AMOUNT</th>
                    <th>PAID WITH</th>
                    <th>STATUS</th>
                    <th className="order-actions-col"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.date}</td>
                      <td>{order.profile}</td>
                      <td>{order.package}</td>
                      <td>
                        <div className="amount-display">
                          <span className="currency-badge">{order.currency}</span>
                          <span className="amount-value">{order.amount}</span>
                        </div>
                      </td>
                      <td>
                        <div className="payment-method">
                          <div className="mastercard-logo">
                            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                              <circle cx="10" cy="8" r="4.5" fill="#EB001B"/>
                              <circle cx="14" cy="8" r="4.5" fill="#F79E1B"/>
                            </svg>
                          </div>
                          <span className="payment-last-four">... {order.paidWith.lastFour}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`order-status order-status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="order-action-cell">
                        <button
                          className="order-action-btn"
                          aria-label="View order"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <span className="order-action-dot">
                            <span className="dot-large"></span>
                            <span className="dot-small"></span>
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order-history-pagination">
                <span className="pagination-info">
                  {startIndex}-{endIndex} of {totalOrders}
                </span>
                <div className="pagination-controls">
                  <button className="pagination-btn" disabled>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className="pagination-btn" disabled>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-modal-header">
              <div>
                <h2 className="order-modal-title">Order Status</h2>
                <p className="order-modal-id">{selectedOrder.id}</p>
              </div>
              <button
                className="order-modal-close"
                aria-label="Close"
                onClick={() => setSelectedOrder(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="order-modal-subtitle">Your order is completed!</div>

            <div className="order-modal-progress">
              <div className="order-modal-progress-bar">
                <div className="order-modal-progress-fill" style={{ width: "100%" }} />
              </div>
              <div className="order-modal-steps">
                <span className="order-step">Received</span>
                <span className="order-step">Processing</span>
                <span className="order-step active">Completed</span>
              </div>
            </div>

            <div className="order-modal-status-row">
              <span className="order-modal-status-label">Order status</span>
              <span className={`order-status order-status-${selectedOrder.status.toLowerCase()}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="order-modal-row">
              <span className="order-modal-label">E-mail</span>
              <span className="order-modal-value">{selectedOrder.email}</span>
            </div>

            <div className="order-modal-row">
              <span className="order-modal-label">Payment method</span>
              <span className="order-modal-value payment-method">
                <div className="mastercard-logo">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                    <circle cx="10" cy="8" r="4.5" fill="#EB001B"/>
                    <circle cx="14" cy="8" r="4.5" fill="#F79E1B"/>
                  </svg>
                </div>
                <span className="payment-last-four">... {selectedOrder.paidWith.lastFour}</span>
              </span>
            </div>

            <div className="order-modal-row">
              <span className="order-modal-label">Date paid</span>
              <span className="order-modal-value">{selectedOrder.date}</span>
            </div>

            <div className="order-modal-row">
              <span className="order-modal-label">SMM Order ID</span>
              <span className="order-modal-value">{selectedOrder.smmOrderId ?? "N/A"}</span>
            </div>

            <div className="order-modal-divider"></div>

            <div className="order-modal-line order-modal-line-item">
              <div className="order-line-left">
                <span className="order-line-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <span className="order-modal-line-title">{selectedOrder.package}</span>
              </div>
              <span className="order-modal-line-amount">{selectedOrder.amount}</span>
            </div>

            <div className="order-modal-line">
              <span className="order-modal-label">Amount paid</span>
              <div className="amount-display">
                <span className="currency-badge">{selectedOrder.currency}</span>
                <span className="amount-value">{selectedOrder.amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

