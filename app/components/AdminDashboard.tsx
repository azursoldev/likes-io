"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUserPlus,
  faArrowUpRightDots,
  faChartLine,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const stats = [
  {
    title: "Daily Revenue",
    value: "$0.00",
    delta: "+5.24% vs last week",
    icon: faArrowUpRightDots,
    trend: "up",
  },
  {
    title: "Total Revenue",
    value: "$62.46",
    delta: "+12.5% vs last week",
    icon: faChartLine,
    trend: "up",
  },
  {
    title: "Total Orders",
    value: "6",
    delta: "+8.2% vs last week",
    icon: faShoppingCart,
    trend: "up",
  },
  {
    title: "New Users",
    value: "45",
    delta: "-2.1% vs last week",
    icon: faUserPlus,
    trend: "down",
  },
];

const orders = [
  { id: "#12345", customer: "John Doe", service: "1K Premium Likes", amount: "$29.99", status: "Completed" },
  { id: "#12344", customer: "Emily White", service: "500 Followers", amount: "$7.99", status: "Completed" },
  { id: "#12343", customer: "Jane Smith", service: "10K Views", amount: "$39.99", status: "Processing" },
  { id: "#12342", customer: "Mike Johnson", service: "2.5K Followers", amount: "$28.89", status: "Failed" },
  { id: "#12341", customer: "Chris Green", service: "100 Premium Likes", amount: "$5.99", status: "Completed" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-wrapper">
      <PromoBar />

      <div className="admin-body">
        <AdminSidebar activePage="dashboard" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <h1>Dashboard</h1>
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

          <section className="admin-stats-row">
            {stats.map((stat) => (
              <div className="admin-stat-card" key={stat.title}>
                <div className="admin-stat-top">
                  <div className="admin-stat-title">{stat.title}</div>
                  <div className="admin-stat-icon">
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                </div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className={`admin-stat-delta ${stat.trend === "up" ? "delta-up" : "delta-down"}`}>{stat.delta}</div>
              </div>
            ))}
          </section>

          <section className="admin-grid">
            <div className="admin-card admin-orders-card">
              <div className="admin-card-header">
                <h2>Recent Orders</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>SERVICE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.service}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`admin-status admin-status-${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-card admin-sales-card">
              <div className="admin-card-header">
                <h2>Sales This Week</h2>
              </div>
              <div className="admin-placeholder-chart">Chart Placeholder</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

