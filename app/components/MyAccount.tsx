"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../dashboard/dashboard.css";
import {
  faWallet,
  faUser,
  faEnvelope,
  faClock,
  faKey,
  faBell,
  faExclamationTriangle,
  faArrowRight,
  faTag,
  faShoppingCart,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import Footer from "./Footer";

export default function MyAccount() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(res => res.json())
      .then(data => {
        if (data.balance != null) setWalletBalance(Number(data.balance));
      })
      .catch(() => {});
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle update password logic
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle delete account logic
    }
  };

  return (
    <div className="my-account-wrapper">
      <Header />

      <main className="my-account-main">
        <div className="my-account-header-wrapper">
          <div className="my-account-container">
            <div className="my-account-header">
              <h1 className="my-account-title">My Profile</h1>
              <p className="my-account-subtitle">
                Manage your account details, password, and settings.
              </p>
            </div>
          </div>
        </div>

        <div className="my-account-container">
            <div className="my-account-content">
              {/* My Wallet */}
              <div className="my-account-wallet-card">
                <div className="wallet-info">
                  <div className="wallet-icon-wrapper">
                    <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
                  </div>
                <div className="wallet-details">
                  <h3 className="wallet-title">My Wallet</h3>
                  <p className="wallet-balance">${walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <button className="wallet-add-funds-btn">+ Add Funds</button>
            </div>

              {/* Profile Details */}
              <div className="my-account-profile-card">
                <div className="profile-card-header">
                  <h2 className="profile-card-title">Profile Details</h2>
                  <a href="/dashboard/settings" className="edit-profile-link">Edit Profile</a>
                </div>
                <div className="profile-details-content">
                  <label className="profile-picture-placeholder">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-picture-image" />
                    ) : (
                      <span>Profile</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="profile-picture-input"
                    />
                    <div className="profile-picture-overlay">
                      <span className="profile-picture-text">Change Photo</span>
                    </div>
                  </label>
                  <div className="profile-info-list">
                    <div className="profile-info-item">
                      <FontAwesomeIcon icon={faUser} className="profile-info-icon" />
                      <span className="profile-info-text">Zain</span>
                    </div>
                    <div className="profile-info-item">
                      <FontAwesomeIcon icon={faEnvelope} className="profile-info-icon" />
                      <span className="profile-info-text">zain@jo.com</span>
                    </div>
                    <div className="profile-info-item">
                      <FontAwesomeIcon icon={faClock} className="profile-info-icon" />
                      <span className="profile-info-text">Member since: 18 October 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="my-account-actions-grid">
                <a href="/dashboard" className="my-account-action-card">
                  <div className="action-card-content">
                    <h3 className="action-card-title">Place a New Order</h3>
                    <p className="action-card-desc">Browse our services and boost your profile.</p>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="action-card-arrow" />
                </a>
                <a href="/dashboard/orders" className="my-account-action-card">
                  <div className="action-card-content">
                    <FontAwesomeIcon icon={faCircleCheck} className="action-card-icon" />
                    <h3 className="action-card-title">View Order History</h3>
                    <p className="action-card-desc">Track your previous and current orders.</p>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="action-card-arrow" />
                </a>
                <a href="/dashboard/affiliate" className="my-account-action-card">
                  <div className="action-card-content">
                    <h3 className="action-card-title">
                      <FontAwesomeIcon icon={faTag} className="action-card-icon" />
                      Affiliate Dashboard
                    </h3>
                    <p className="action-card-desc">Track your earnings and referrals.</p>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="action-card-arrow" />
                </a>
              </div>

              {/* Change Password */}
              <div className="my-account-section-card change-password-card">
                <div className="section-card-header">
                  <FontAwesomeIcon icon={faKey} className="section-card-icon" />
                  <h2 className="section-card-title">Change Password</h2>
                </div>
                <form onSubmit={handleUpdatePassword} className="my-account-form">
                  <div className="my-account-form-group">
                    <label htmlFor="currentPassword" className="my-account-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="my-account-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="my-account-form-group">
                    <label htmlFor="newPassword" className="my-account-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="my-account-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="my-account-btn-primary">
                    Update Password
                  </button>
                </form>
              </div>

              {/* Notification Settings */}
              <div className="my-account-section-card notification-settings-card">
                <div className="section-card-header">
                  <FontAwesomeIcon icon={faBell} className="section-card-icon" />
                  <h2 className="section-card-title">Notification Settings</h2>
                </div>
                <div className="my-account-notifications">
                  <div className="my-account-notification-item">
                    <div className="notification-content">
                      <h3 className="notification-title">Order Updates</h3>
                      <p className="notification-desc">
                        Get notified when your order status changes.
                      </p>
                    </div>
                    <label className="my-account-toggle">
                      <input
                        type="checkbox"
                        checked={orderUpdates}
                        onChange={(e) => setOrderUpdates(e.target.checked)}
                      />
                      <span className="my-account-toggle-slider"></span>
                    </label>
                  </div>
                  <div className="my-account-notification-item">
                    <div className="notification-content">
                      <h3 className="notification-title">Promotions & News</h3>
                      <p className="notification-desc">
                        Receive special offers and product updates.
                      </p>
                    </div>
                    <label className="my-account-toggle">
                      <input
                        type="checkbox"
                        checked={promotions}
                        onChange={(e) => setPromotions(e.target.checked)}
                      />
                      <span className="my-account-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="my-account-danger-zone">
                <div className="danger-zone-header">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="danger-zone-icon" />
                  <h2 className="danger-zone-title">Danger Zone</h2>
                </div>
                <p className="danger-zone-text">
                  Deleting your account is a permanent action and cannot be undone. All your data
                  and order history will be removed.
                </p>
                <button className="danger-zone-btn" onClick={handleDeleteAccount}>
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
}

