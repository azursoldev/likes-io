"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../dashboard/dashboard.css";

const handleLogout = () => {
  window.location.href = "/login";
};
import {
  faTh,
  faList,
  faLink,
  faQuestionCircle,
  faGear,
  faSignOutAlt,
  faSearch,
  faFilter,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import Footer from "./Footer";

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
  status: "COMPLETED" | "PENDING" | "FAILED";
};

const orders: Order[] = [
  {
    id: "1",
    date: "18 October 2025",
    profile: "@zainjo",
    package: "+50 likes",
    currency: "USD",
    amount: "$1.99",
    paidWith: {
      type: "Mastercard",
      lastFour: "0293",
    },
    status: "COMPLETED",
  },
  {
    id: "2",
    date: "18 Oct 2025",
    profile: "@zainjo",
    package: "+500 views",
    currency: "USD",
    amount: "$2.49",
    paidWith: {
      type: "Mastercard",
      lastFour: "0293",
    },
    status: "COMPLETED",
  },
  {
    id: "3",
    date: "6 Oct 2025",
    profile: "@zainjo",
    package: "+50 likes",
    currency: "USD",
    amount: "$1.99",
    paidWith: {
      type: "Mastercard",
      lastFour: "0293",
    },
    status: "COMPLETED",
  },
];

export default function OrderHistory() {
  const totalOrders = orders.length;
  const startIndex = 1;
  const endIndex = totalOrders;

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-brand">
            <a href="/" className="brand-logo">
              <span className="logo-text">Likes</span>
              <span className="logo-dot">.io</span>
            </a>
          </div>
          <nav className="dashboard-sidebar-nav">
            <div>
              <a href="/dashboard" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faTh} />
                <span>Dashboard</span>
              </a>
              <a href="/dashboard/orders" className="dashboard-sidebar-link active">
                <FontAwesomeIcon icon={faList} />
                <span>Order History</span>
              </a>
              <a href="/dashboard/affiliate" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faLink} />
                <span>Affiliate</span>
              </a>
              <a href="/dashboard/support" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Help & Support</span>
              </a>
            </div>
            <div className="dashboard-sidebar-nav-bottom">
              <div className="dashboard-sidebar-divider"></div>
              <a href="/dashboard/settings" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
              </a>
              <a 
                href="/login" 
                className="dashboard-sidebar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </a>
            </div>
          </nav>
        </aside>

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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}

