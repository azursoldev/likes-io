"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function SystemStatusDashboard() {
  const [enableBanner, setEnableBanner] = useState(true);
  const [systemStatus, setSystemStatus] = useState("Operational");
  const [displayMessage, setDisplayMessage] = useState("All Systems Operational");

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="systemStatus" />
        <main className="admin-main">
          <AdminToolbar title="System Status" />
          <div className="system-status-page">
            <div className="system-status-header">
              <h1>System Status</h1>
              <p>Update the system status banner displayed in the website footer.</p>
            </div>

            <div className="system-status-card">
              <h2 className="system-status-card-title">System Status</h2>
              <p className="system-status-card-description">Update the system status banner displayed in the website footer.</p>

              {/* Status Banner Configuration */}
              <div className="system-status-section">
                <h3 className="system-status-section-title">Status Banner Configuration</h3>
                <div className="system-status-form-group">
                  <div className="system-status-toggle-group">
                    <label className="system-status-toggle-label">
                      <span>Enable Status Banner</span>
                    </label>
                    <label className="settings-toggle-switch">
                      <input
                        type="checkbox"
                        checked={enableBanner}
                        onChange={(e) => setEnableBanner(e.target.checked)}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                  <label className="system-status-label">
                    System Status
                    <select
                      className="system-status-input system-status-dark-input"
                      value={systemStatus}
                      onChange={(e) => setSystemStatus(e.target.value)}
                    >
                      <option>Operational</option>
                      <option>Degraded</option>
                      <option>Down</option>
                      <option>Maintenance</option>
                    </select>
                  </label>
                  <label className="system-status-label">
                    Display Message
                    <input
                      type="text"
                      className="system-status-input system-status-dark-input"
                      value={displayMessage}
                      onChange={(e) => setDisplayMessage(e.target.value)}
                    />
                    <span className="system-status-helper-text">This text will be displayed to all users in the footer.</span>
                  </label>
                </div>
              </div>

              {/* Live Preview */}
              <div className="system-status-section">
                <h3 className="system-status-section-title">Live Preview</h3>
                <div className="system-status-preview">
                  <FontAwesomeIcon icon={faCircleCheck} className="system-status-preview-icon" />
                  <span className="system-status-preview-text">{displayMessage}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

