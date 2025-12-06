"use client";
import { useState } from "react";
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

export default function SettingsDashboard() {
  const [fullName, setFullName] = useState("Zain");
  const [email, setEmail] = useState("zain@jo.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save profile logic
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle update password logic
  };

  const handleLogout = () => {
    // Handle logout logic - clear session, redirect to login, etc.
    // For now, redirect to login page
    window.location.href = "/login";
  };

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
              <a href="/dashboard/settings" className="dashboard-sidebar-link active">
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
            <h1 className="settings-title">Settings</h1>

            <div className="settings-content">
              {/* Profile Information */}
              <div className="settings-card">
                <h2 className="settings-card-title">Profile Information</h2>
                <form onSubmit={handleSaveProfile} className="settings-form">
                  <div className="settings-form-group">
                    <label htmlFor="fullName" className="settings-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="settings-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="email" className="settings-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="settings-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="settings-btn">
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="settings-card">
                <h2 className="settings-card-title">Change Password</h2>
                <form onSubmit={handleUpdatePassword} className="settings-form">
                  <div className="settings-form-group">
                    <label htmlFor="currentPassword" className="settings-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="settings-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="newPassword" className="settings-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="settings-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="settings-btn">
                    Update Password
                  </button>
                </form>
              </div>

              {/* Notifications */}
              <div className="settings-card">
                <h2 className="settings-card-title">Notifications</h2>
                <div className="settings-notifications">
                  <div className="settings-notification-item">
                    <div className="settings-notification-content">
                      <h3 className="settings-notification-title">Order updates</h3>
                      <p className="settings-notification-desc">
                        Get notified when your order status changes.
                      </p>
                    </div>
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={orderUpdates}
                        onChange={(e) => setOrderUpdates(e.target.checked)}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                  <div className="settings-notification-item">
                    <div className="settings-notification-content">
                      <h3 className="settings-notification-title">Promotions and news</h3>
                      <p className="settings-notification-desc">
                        Receive special offers and product updates.
                      </p>
                    </div>
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={promotions}
                        onChange={(e) => setPromotions(e.target.checked)}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

