"use client";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function FreeToolsDashboard() {
  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="freeTools" />
        
        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Free Tools</h1>
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

          <div className="admin-content-area">
            <div className="admin-card">
              <div className="admin-card-body">
                <p className="text-muted">Select a tool to edit (Coming Soon)</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
