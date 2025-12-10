"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../dashboard/dashboard.css";

type AdminToolbarProps = {
  title: string;
};

export default function AdminToolbar({ title }: AdminToolbarProps) {
  return (
    <div className="admin-toolbar-wrapper">
      <div className="admin-toolbar-container">
        <div className="admin-toolbar">
          <div className="admin-toolbar-left">
            <h1>{title}</h1>
          </div>
          <div className="admin-toolbar-right">
            <div className="admin-search-pill">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
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
  );
}

