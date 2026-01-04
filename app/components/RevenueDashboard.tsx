"use client";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCreditCard,
  faBitcoinSign,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

export type TransactionRow = {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: string;
  orderId: string;
};

export type RevenueSummary = {
  today: string;
  week: string;
  month: string;
  total: string;
};

const paymentIcon = (method: string) => {
  if (method.toLowerCase().includes("crypto")) return faBitcoinSign;
  return faCreditCard;
};

const statusIcon = (status: string) => {
  const key = status.toLowerCase();
  if (key === "completed" || key === "success") return faCheckCircle;
  if (key === "pending") return faClock;
  return faTimesCircle;
};

interface RevenueDashboardProps {
  initialTransactions?: TransactionRow[];
  summary?: RevenueSummary;
}

export default function RevenueDashboard({ 
  initialTransactions = [], 
  summary = {
    today: "$0.00",
    week: "$0.00",
    month: "$0.00",
    total: "$0.00"
  }
}: RevenueDashboardProps) {
  const summaryCards = [
    { title: "Today’s Revenue", value: summary.today },
    { title: "This Week’s Revenue", value: summary.week },
    { title: "This Month’s Revenue", value: summary.month },
    { title: "Total Revenue", value: summary.total },
  ];

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="revenue" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Revenue</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search..." aria-label="Search" />
                  </div>
                  <button className="admin-icon-btn" aria-label="Notifications">
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                  <div className="admin-user-chip">
                    <div className="chip-avatar">AU</div>
                    <div className="chip-meta">
                      <span className="chip-name">Admin User</span>
                      <span className="chip-role">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="revenue-content">
            <div className="revenue-header">
              <h2>Revenue Management</h2>
              <p>Track all income and view transaction history.</p>
            </div>

            <section className="revenue-stats-row">
              {summaryCards.map((card) => (
                <div className="revenue-stat-card" key={card.title}>
                  <div className="revenue-stat-row">
                    <div className="revenue-stat-icon">
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                    <div className="revenue-stat-text">
                      <div className="revenue-stat-title">{card.title}</div>
                      <div className="revenue-stat-value">{card.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="revenue-stack">
              <div className="revenue-chart-card">
                <div className="revenue-card-header">Revenue (Last 7 Days)</div>
                <div className="revenue-chart-placeholder">Chart Placeholder</div>
              </div>

              <div className="revenue-table-card">
                <div className="revenue-card-header">Transaction History</div>
                <table className="revenue-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialTransactions.map((txn) => (
                      <tr key={txn.id}>
                        <td>{txn.id}</td>
                        <td>{txn.date}</td>
                        <td>{txn.amount}</td>
                        <td>
                          <span className="rev-payment">
                            <FontAwesomeIcon icon={paymentIcon(txn.method)} />
                            <span className="rev-pay-label">{txn.method}</span>
                          </span>
                        </td>
                        <td>
                          <span className={`rev-status rev-${txn.status.toLowerCase()}`}>
                            <FontAwesomeIcon icon={statusIcon(txn.status)} />
                            <span className="rev-status-label">{txn.status}</span>
                          </span>
                        </td>
                        <td>{txn.orderId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

