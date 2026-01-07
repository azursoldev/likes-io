"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faList,
  faLink,
  faQuestionCircle,
  faGear,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

type SidebarProps =
  | "dashboard"
  | "orders"
  | "affiliate"
  | "support"
  | "settings";

export default function UserSidebar({ active = "dashboard" as SidebarProps }) {
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
          <span className="logo-text">Likes</span>
          <span className="logo-dot">.io</span>
        </a>
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

