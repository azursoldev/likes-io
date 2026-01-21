"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faList,
  faLink,
  faQuestionCircle,
  faGear,
  faSignOutAlt,
  faWallet,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useSettings } from "../contexts/SettingsContext";

type SidebarProps =
  | "dashboard"
  | "orders"
  | "affiliate"
  | "support"
  | "settings";

export default function UserSidebar({ active = "dashboard" as SidebarProps }) {
  const { formatPrice } = useCurrency();
  const { headerLogoUrl } = useSettings();
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    fetch("/api/wallet/balance")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && typeof data.balance === "number") {
          setWalletBalance(data.balance);
        }
      })
      .catch((err) => console.error("Failed to fetch wallet balance:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      window.location.href = window.location.origin + "/login";
    }
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-brand">
        <a href="/" className="brand-logo">
          {headerLogoUrl ? (
            <img src={headerLogoUrl} alt="Likes.io" style={{ maxHeight: '40px' }} />
          ) : (
            <>
              <span className="logo-text">Likes</span>
              <span className="logo-dot">.io</span>
            </>
          )}
        </a>
      </div>
      
      <div className="dashboard-sidebar-wallet">
        <div className="sidebar-wallet-card">
          <div className="sidebar-wallet-header">
            <FontAwesomeIcon icon={faWallet} />
            <span>My Wallet</span>
          </div>
          <div className="sidebar-wallet-amount">
            {formatPrice(walletBalance)}
          </div>
          {/* <a href="/dashboard/add-funds" className="sidebar-add-funds-btn">
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
            Add Funds
          </a> */}
        </div>
      </div>

      <nav className="dashboard-sidebar-nav">
        <div>
          <a
            href="/dashboard"
            className={`dashboard-sidebar-link ${active === "dashboard" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faTh} />
            <span>Dashboard</span>
          </a>
          <a
            href="/dashboard/orders"
            className={`dashboard-sidebar-link ${active === "orders" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faList} />
            <span>Order History</span>
          </a>
          <a
            href="/dashboard/affiliate"
            className={`dashboard-sidebar-link ${active === "affiliate" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faLink} />
            <span>Affiliate</span>
          </a>
          <a
            href="/dashboard/support"
            className={`dashboard-sidebar-link ${active === "support" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
            <span>Help & Support</span>
          </a>
        </div>
        <div className="dashboard-sidebar-nav-bottom">
          <div className="dashboard-sidebar-divider"></div>
          <a
            href="/dashboard/settings"
            className={`dashboard-sidebar-link ${active === "settings" ? "active" : ""}`}
          >
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
  );
}

