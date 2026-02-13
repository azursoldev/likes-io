"use client";
import { useState } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUserPlus,
  faArrowUpRightDots,
  faChartLine,
  faBell,
  faBars,
  faTimes,
  faDollarSign,
  faArrowUp,
  faArrowDown,
  faClipboardList,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";

interface DashboardData {
  dailyRevenue: number;
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  orders: {
    id: string;
    customer: string;
    service: string;
    amount: string;
    status: string;
    paymentStatus?: string;
  }[];
  salesChart?: { date: string; amount: number }[];
}

interface AdminDashboardProps {
  initialData?: DashboardData;
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUnpaid, setShowUnpaid] = useState(false);

  const stats = [
    {
      title: "Daily Revenue",
      value: initialData ? `$${initialData.dailyRevenue.toFixed(2)}` : "$0.00",
      delta: "vs last week",
      icon: faDollarSign,
      iconColor: "#16a34a",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: initialData ? `$${initialData.totalRevenue.toFixed(2)}` : "$0.00",
      delta: "vs last week",
      icon: faChartLine,
      iconColor: "#2563eb",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: initialData ? initialData.totalOrders.toString() : "0",
      delta: "vs last week",
      icon: faClipboardList,
      iconColor: "#f97316",
      trend: "up",
    },
    {
      title: "Total Users",
      value: initialData ? initialData.totalUsers.toString() : "0",
      delta: "vs last week",
      icon: faCloud,
      iconColor: "#9333ea",
      trend: "down",
    },
  ];

  const rawOrders = initialData?.orders || [];
  const filteredOrders = showUnpaid 
    ? rawOrders 
    : rawOrders.filter(order => order.paymentStatus === "PAID" || order.status === "COMPLETED");
  
  const displayOrders = filteredOrders.slice(0, 5);

  return (
    <div className="admin-wrapper">
      <PromoBar />

      <div className="admin-body">
        <div className={`admin-sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`admin-sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
          <AdminSidebar activePage="dashboard" />
        </div>

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <button 
                  className="admin-sidebar-toggle"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
                </button>
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
          <div className="admin-content">
          <section className="admin-stats-row">
            {stats.map((stat) => (
              <div className="admin-stat-card" key={stat.title}>
                <div className="admin-stat-header">
                  <div className="admin-stat-title">{stat.title}</div>
                  <div className="admin-stat-icon" style={{ backgroundColor: stat.iconColor }}>
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                </div>
                <div className="admin-stat-content">
                  <div className="admin-stat-value">{stat.value}</div>
                  <div className={`admin-stat-delta ${stat.trend === "up" ? "delta-up" : "delta-down"}`}>
                    {stat.trend === "up" ? (
                      <FontAwesomeIcon icon={faArrowUp} className="delta-arrow" />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDown} className="delta-arrow" />
                    )}
                    {stat.delta}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="admin-grid">
            <div className="admin-card admin-orders-card">
              <div className="admin-card-header">
                <h2>Recent Orders</h2>
                <div className="admin-card-actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label className="admin-toggle-label" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      padding: 0,
                      background: 'none',
                      border: 'none'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={showUnpaid} 
                        onChange={(e) => setShowUnpaid(e.target.checked)} 
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '40px',
                        height: '20px',
                        backgroundColor: showUnpaid ? '#2563eb' : '#cbd5e1',
                        borderRadius: '20px',
                        transition: '.4s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '14px',
                          width: '14px',
                          left: showUnpaid ? '22px' : '4px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Show unpaid attempts</span>
                  </div>
                </div>
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
                  {displayOrders.map((order) => (
                    <tr key={order.id}>
                      <td title={order.id}>#{order.id.slice(-6).toUpperCase()}</td>
                      <td>{order.customer}</td>
                      <td>{order.service}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`order-status order-status-${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                  {displayOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        No recent orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-card admin-sales-card">
              <div className="admin-card-header">
                <h2>Sales This Week</h2>
              </div>
              <div className="admin-chart-container" style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '20px 10px' }}>
                {initialData?.salesChart?.map((day) => {
                  const maxAmount = Math.max(...(initialData.salesChart?.map(d => d.amount) || [1]));
                  const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                  const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div 
                        className="chart-bar" 
                        style={{ 
                          width: '100%', 
                          height: `${height}%`, 
                          backgroundColor: '#2563eb', 
                          borderRadius: '4px 4px 0 0',
                          minHeight: day.amount > 0 ? '4px' : '0',
                          transition: 'height 0.3s ease'
                        }}
                        title={`$${day.amount.toFixed(2)}`}
                      ></div>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{date}</span>
                    </div>
                  );
                })}
                {(!initialData?.salesChart || initialData.salesChart.length === 0) && (
                  <div className="admin-placeholder-chart">No sales data available</div>
                )}
              </div>
            </div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}

