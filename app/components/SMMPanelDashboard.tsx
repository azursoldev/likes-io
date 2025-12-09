"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function SMMPanelDashboard() {
  const [apiUrl, setApiUrl] = useState("https://yourprovider.com/api/v2");
  const [apiKey, setApiKey] = useState("************");

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="smmPanel" />
        <main className="admin-main">
          <AdminToolbar title="SMM Panel Integration" />
          <div className="smm-panel-page">
            <div className="smm-panel-header">
              <h1>SMM Panel Integration</h1>
              <p>Connect your site to a Social Media Marketing (SMM) panel provider to automate orders.</p>
            </div>

            <div className="smm-panel-content">
              {/* Provider API Settings */}
              <div className="smm-panel-card">
                <h2 className="smm-panel-card-title">Provider API Settings</h2>
                <p className="smm-panel-card-description">Enter the API credentials from your SMM provider. These are required to automate order fulfillment.</p>
                <div className="smm-panel-form-group">
                  <label className="smm-panel-label">
                    API URL
                    <input
                      type="text"
                      className="smm-panel-input"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                    />
                    <span className="smm-panel-hint">The API endpoint provided by your SMM panel.</span>
                  </label>
                  <label className="smm-panel-label">
                    API Key
                    <input
                      type="password"
                      className="smm-panel-input"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <span className="smm-panel-hint">Your secret API key for authentication.</span>
                  </label>
                  <div className="smm-panel-connection-status">
                    <label className="smm-panel-label">Connection Status</label>
                    <div className="smm-panel-status-indicator">
                      <FontAwesomeIcon icon={faCircleInfo} className="smm-panel-status-icon" />
                      <span className="smm-panel-status-text">Not Configured</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Connect */}
              <div className="smm-panel-card">
                <h2 className="smm-panel-card-title">
                  <FontAwesomeIcon icon={faLink} style={{ marginRight: "8px" }} />
                  How to Connect
                </h2>
                <div className="smm-panel-steps">
                  <div className="smm-panel-step">
                    <div className="smm-panel-step-number">1</div>
                    <div className="smm-panel-step-content">
                      <strong>Enter API Details:</strong> Get the API URL and Key from your SMM provider and save them on this page.
                    </div>
                  </div>
                  <div className="smm-panel-step">
                    <div className="smm-panel-step-number">2</div>
                    <div className="smm-panel-step-content">
                      <strong>Find Service IDs:</strong> Log in to your SMM provider's website and find the unique 'Service ID' for each package you want to sell (e.g., the ID for '100 Instagram Likes').
                    </div>
                  </div>
                  <div className="smm-panel-step">
                    <div className="smm-panel-step-number">3</div>
                    <div className="smm-panel-step-content">
                      <strong>Link Your Products:</strong> Go to the Services page, edit a service, and enter the corresponding Service ID for each price package.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

