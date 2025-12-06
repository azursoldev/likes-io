"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../dashboard/dashboard.css";
import {
  faTh,
  faList,
  faLink,
  faQuestionCircle,
  faGear,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import Footer from "./Footer";

export default function AffiliateDashboard() {
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
              <a href="/dashboard/orders" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faList} />
                <span>Order History</span>
              </a>
              <a href="/dashboard/affiliate" className="dashboard-sidebar-link active">
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
              <a href="/login" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="container">
            <div className="affiliate-dashboard-content">
              <p className="affiliate-no-data">No affiliate data available</p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

