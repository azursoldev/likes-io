"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { useState } from "react";

export default function SettingsDashboard() {
  const [logoType, setLogoType] = useState("Default SVG");
  const [exitIntentEnabled, setExitIntentEnabled] = useState(true);
  const [exitIntentTitle, setExitIntentTitle] = useState("Wait! Don't Go!");
  const [exitIntentSubtitle, setExitIntentSubtitle] = useState("Here's 15% off your first order, just for sticking around.");
  const [exitIntentDiscountCode, setExitIntentDiscountCode] = useState("SAVE15");
  const [newServiceIndicator, setNewServiceIndicator] = useState(true);
  const [bigPayDisplayName, setBigPayDisplayName] = useState("Card");
  const [bigPayMerchantId, setBigPayMerchantId] = useState("123");
  const [bigPayApiKey, setBigPayApiKey] = useState("••••••••");
  const [bigPayApiSecret, setBigPayApiSecret] = useState("••••••••");
  const [bigPayTestMode, setBigPayTestMode] = useState(true);
  const [cryptomusDisplayName, setCryptomusDisplayName] = useState("Card");
  const [cryptomusMerchantId, setCryptomusMerchantId] = useState("123");
  const [cryptomusApiKey, setCryptomusApiKey] = useState("••••••••");
  const [cryptomusTestMode, setCryptomusTestMode] = useState(true);
  const [supportEmail, setSupportEmail] = useState("support@likes.io");

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="settings" />
        <main className="admin-main">
          <AdminToolbar title="Settings" />
          <div className="settings-page">
            <div className="settings-header">
              <h1>Settings</h1>
              <p>Manage site-wide settings and feature flags.</p>
            </div>

            {/* Logo & Branding */}
            <div className="settings-card">
              <h2 className="settings-card-title">Logo & Branding</h2>
              <div className="settings-form-group">
                <label className="settings-label">
                  Logo Type
                  <select className="settings-input" value={logoType} onChange={(e) => setLogoType(e.target.value)}>
                    <option>Default SVG</option>
                    <option>Custom Image</option>
                    <option>Text Only</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Exit Intent Modal */}
            <div className="settings-card">
              <h2 className="settings-card-title">Exit Intent Modal</h2>
              <p className="settings-card-description">Configure the popup that appears when a user is about to leave the site.</p>
              <div className="settings-form-group">
                <div className="settings-toggle-group">
                  <label className="settings-toggle-label">
                    <span>Enable Exit Intent Modal</span>
                    <span className="settings-toggle-description">Show a discount offer to users who attempt to leave the page.</span>
                  </label>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={exitIntentEnabled}
                      onChange={(e) => setExitIntentEnabled(e.target.checked)}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
                {exitIntentEnabled && (
                  <>
                    <label className="settings-label">
                      Title
                      <input
                        type="text"
                        className="settings-input"
                        value={exitIntentTitle}
                        onChange={(e) => setExitIntentTitle(e.target.value)}
                      />
                    </label>
                    <label className="settings-label">
                      Subtitle
                      <input
                        type="text"
                        className="settings-input"
                        value={exitIntentSubtitle}
                        onChange={(e) => setExitIntentSubtitle(e.target.value)}
                      />
                    </label>
                    <label className="settings-label">
                      Discount Code
                      <input
                        type="text"
                        className="settings-input"
                        value={exitIntentDiscountCode}
                        onChange={(e) => setExitIntentDiscountCode(e.target.value)}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Feature Flags */}
            <div className="settings-card">
              <h2 className="settings-card-title">Feature Flags</h2>
              <p className="settings-card-description">Enable or disable features across the website in real-time.</p>
              <div className="settings-form-group">
                <div className="settings-toggle-group">
                  <div>
                    <span className="settings-feature-name">New Service Indicator</span>
                    <span className="settings-feature-description">Display a 'NEW' tag on recently added services.</span>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={newServiceIndicator}
                      onChange={(e) => setNewServiceIndicator(e.target.checked)}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Credit Card Gateway (BigPay) */}
            <div className="settings-card">
              <h2 className="settings-card-title">Credit Card Gateway (BigPay)</h2>
              <div className="settings-form-group">
                <label className="settings-label">
                  Display Name
                  <input
                    type="text"
                    className="settings-input"
                    value={bigPayDisplayName}
                    onChange={(e) => setBigPayDisplayName(e.target.value)}
                  />
                  <span className="settings-helper-text">The name shown to customers at checkout.</span>
                </label>
                <label className="settings-label">
                  Merchant ID
                  <input
                    type="text"
                    className="settings-input"
                    value={bigPayMerchantId}
                    onChange={(e) => setBigPayMerchantId(e.target.value)}
                  />
                </label>
                <label className="settings-label">
                  API Key
                  <input
                    type="password"
                    className="settings-input"
                    value={bigPayApiKey}
                    onChange={(e) => setBigPayApiKey(e.target.value)}
                  />
                </label>
                <label className="settings-label">
                  API Secret
                  <input
                    type="password"
                    className="settings-input"
                    value={bigPayApiSecret}
                    onChange={(e) => setBigPayApiSecret(e.target.value)}
                  />
                </label>
                <div className="settings-toggle-group">
                  <label className="settings-toggle-label">
                    <span>Test Mode</span>
                    <span className="settings-toggle-description">Enable to process test transactions without actual charges.</span>
                  </label>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={bigPayTestMode}
                      onChange={(e) => setBigPayTestMode(e.target.checked)}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Crypto Gateway (Cryptomus) */}
            <div className="settings-card">
              <h2 className="settings-card-title">Crypto Gateway (Cryptomus)</h2>
              <div className="settings-form-group">
                <label className="settings-label">
                  Display Name
                  <input
                    type="text"
                    className="settings-input"
                    value={cryptomusDisplayName}
                    onChange={(e) => setCryptomusDisplayName(e.target.value)}
                  />
                  <span className="settings-helper-text">The name shown to customers at checkout.</span>
                </label>
                <label className="settings-label">
                  Merchant ID
                  <input
                    type="text"
                    className="settings-input"
                    value={cryptomusMerchantId}
                    onChange={(e) => setCryptomusMerchantId(e.target.value)}
                  />
                </label>
                <label className="settings-label">
                  API Key
                  <input
                    type="password"
                    className="settings-input"
                    value={cryptomusApiKey}
                    onChange={(e) => setCryptomusApiKey(e.target.value)}
                  />
                </label>
                <div className="settings-toggle-group">
                  <label className="settings-toggle-label">
                    <span>Test Mode</span>
                    <span className="settings-toggle-description">Enable to process test transactions without actual charges.</span>
                  </label>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={cryptomusTestMode}
                      onChange={(e) => setCryptomusTestMode(e.target.checked)}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Site Configuration */}
            <div className="settings-card">
              <h2 className="settings-card-title">Site Configuration</h2>
              <div className="settings-form-group">
                <label className="settings-label">
                  Support Email
                  <input
                    type="email"
                    className="settings-input"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
