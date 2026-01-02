"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { useState, useEffect } from "react";

export default function SettingsDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [logoType, setLogoType] = useState("Default SVG");
  const [exitIntentEnabled, setExitIntentEnabled] = useState(true);
  const [exitIntentTitle, setExitIntentTitle] = useState("Wait! Don't Go!");
  const [exitIntentSubtitle, setExitIntentSubtitle] = useState("Here's 15% off your first order, just for sticking around.");
  const [exitIntentDiscountCode, setExitIntentDiscountCode] = useState("SAVE15");
  const [newServiceIndicator, setNewServiceIndicator] = useState(true);
  const [bigPayDisplayName, setBigPayDisplayName] = useState("Card");
  const [bigPayMerchantId, setBigPayMerchantId] = useState("");
  const [bigPayApiKey, setBigPayApiKey] = useState("••••••••");
  const [bigPayApiSecret, setBigPayApiSecret] = useState("••••••••");
  const [bigPayTestMode, setBigPayTestMode] = useState(true);
  const [cryptomusDisplayName, setCryptomusDisplayName] = useState("Card");
  const [cryptomusMerchantId, setCryptomusMerchantId] = useState("");
  const [cryptomusApiKey, setCryptomusApiKey] = useState("••••••••");
  const [cryptomusTestMode, setCryptomusTestMode] = useState(true);
  const [supportEmail, setSupportEmail] = useState("support@likes.io");
  
  // SEO & Branding
  const [homeMetaTitle, setHomeMetaTitle] = useState("");
  const [homeMetaDescription, setHomeMetaDescription] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [headerLogoUrl, setHeaderLogoUrl] = useState("");
  const [footerLogoUrl, setFooterLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // RapidAPI
  const [rapidApiKey, setRapidApiKey] = useState("••••••••");
  const [rapidApiInstagramHost, setRapidApiInstagramHost] = useState("instagram120.p.rapidapi.com");
  const [rapidApiTikTokHost, setRapidApiTikTokHost] = useState("tiktok-data.p.rapidapi.com");
  const [rapidApiYouTubeHost, setRapidApiYouTubeHost] = useState("youtube-data.p.rapidapi.com");

  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("");
  const [recaptchaSecretKey, setRecaptchaSecretKey] = useState("••••••••");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("••••••••");
  const [facebookClientId, setFacebookClientId] = useState("");
  const [facebookClientSecret, setFacebookClientSecret] = useState("••••••••");

  // SMTP Configuration
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");

  // MyFatoorah Configuration
  const [myFatoorahToken, setMyFatoorahToken] = useState("••••••••");
  const [myFatoorahBaseURL, setMyFatoorahBaseURL] = useState("https://apitest.myfatoorah.com");
  const [myFatoorahTestMode, setMyFatoorahTestMode] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        // Set all state from fetched data
        if (data.cryptomusMerchantId) setCryptomusMerchantId(data.cryptomusMerchantId);
        if (data.cryptomusApiKey) setCryptomusApiKey(data.cryptomusApiKey);
        if (data.cryptomusDisplayName) setCryptomusDisplayName(data.cryptomusDisplayName);
        if (data.cryptomusTestMode !== undefined) setCryptomusTestMode(data.cryptomusTestMode);
        
        if (data.bigPayMerchantId) setBigPayMerchantId(data.bigPayMerchantId);
        if (data.bigPayApiKey) setBigPayApiKey(data.bigPayApiKey);
        if (data.bigPayApiSecret) setBigPayApiSecret(data.bigPayApiSecret);
        if (data.bigPayDisplayName) setBigPayDisplayName(data.bigPayDisplayName);
        if (data.bigPayTestMode !== undefined) setBigPayTestMode(data.bigPayTestMode);
        
        if (data.exitIntentEnabled !== undefined) setExitIntentEnabled(data.exitIntentEnabled);
        if (data.exitIntentTitle) setExitIntentTitle(data.exitIntentTitle);
        if (data.exitIntentSubtitle) setExitIntentSubtitle(data.exitIntentSubtitle);
        if (data.exitIntentDiscountCode) setExitIntentDiscountCode(data.exitIntentDiscountCode);
        
        if (data.newServiceIndicator !== undefined) setNewServiceIndicator(data.newServiceIndicator);
        if (data.supportEmail) setSupportEmail(data.supportEmail);
        
        // RapidAPI
        if (data.rapidApiKey) setRapidApiKey(data.rapidApiKey);
        if (data.rapidApiInstagramHost) setRapidApiInstagramHost(data.rapidApiInstagramHost);
        if (data.rapidApiTikTokHost) setRapidApiTikTokHost(data.rapidApiTikTokHost);
        if (data.rapidApiYouTubeHost) setRapidApiYouTubeHost(data.rapidApiYouTubeHost);

        if (data.recaptchaSiteKey) setRecaptchaSiteKey(data.recaptchaSiteKey);
        if (data.recaptchaSecretKey) setRecaptchaSecretKey(data.recaptchaSecretKey);
        if (data.googleClientId) setGoogleClientId(data.googleClientId);
        if (data.googleClientSecret) setGoogleClientSecret(data.googleClientSecret);
        if (data.facebookClientId) setFacebookClientId(data.facebookClientId);
        if (data.facebookClientSecret) setFacebookClientSecret(data.facebookClientSecret);

        // SMTP Configuration
        if (data.smtpHost) setSmtpHost(data.smtpHost);
        if (data.smtpPort) setSmtpPort(data.smtpPort.toString());
        if (data.smtpSecure !== undefined) setSmtpSecure(data.smtpSecure);
        if (data.smtpUser) setSmtpUser(data.smtpUser);
        if (data.smtpPass) setSmtpPass(data.smtpPass); // Passwords should probably be masked if not changed, but let's assume API returns it or masked
        if (data.smtpFrom) setSmtpFrom(data.smtpFrom);

        // MyFatoorah Configuration
        if (data.myFatoorahToken) setMyFatoorahToken(data.myFatoorahToken);
        if (data.myFatoorahBaseURL) setMyFatoorahBaseURL(data.myFatoorahBaseURL);
        if (data.myFatoorahTestMode !== undefined) setMyFatoorahTestMode(data.myFatoorahTestMode);

        // SEO & Branding
        if (data.homeMetaTitle) setHomeMetaTitle(data.homeMetaTitle);
        if (data.homeMetaDescription) setHomeMetaDescription(data.homeMetaDescription);
        if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
        if (data.headerLogoUrl) setHeaderLogoUrl(data.headerLogoUrl);
        if (data.footerLogoUrl) setFooterLogoUrl(data.footerLogoUrl);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cryptomusMerchantId,
          cryptomusApiKey: cryptomusApiKey.includes('••••') ? undefined : cryptomusApiKey,
          cryptomusDisplayName,
          cryptomusTestMode,
          bigPayMerchantId,
          bigPayApiKey: bigPayApiKey.includes('••••') ? undefined : bigPayApiKey,
          bigPayApiSecret: bigPayApiSecret.includes('••••') ? undefined : bigPayApiSecret,
          bigPayDisplayName,
          bigPayTestMode,
          exitIntentEnabled,
          exitIntentTitle,
          exitIntentSubtitle,
          exitIntentDiscountCode,
          newServiceIndicator,
          supportEmail,
          // RapidAPI
          rapidApiKey: rapidApiKey.includes('••••') ? undefined : rapidApiKey,
          rapidApiInstagramHost,
          rapidApiTikTokHost,
          rapidApiYouTubeHost,
          recaptchaSiteKey,
          recaptchaSecretKey: recaptchaSecretKey.includes('••••') ? undefined : recaptchaSecretKey,
          googleClientId,
          googleClientSecret: googleClientSecret.includes('••••') ? undefined : googleClientSecret,
          facebookClientId,
          facebookClientSecret: facebookClientSecret.includes('••••') ? undefined : facebookClientSecret,
          // SMTP Configuration
          smtpHost,
          smtpPort: parseInt(smtpPort),
          smtpSecure,
          smtpUser,
          smtpPass,
          smtpFrom,
          // MyFatoorah Configuration
          myFatoorahToken: myFatoorahToken?.includes('••••') ? undefined : myFatoorahToken,
          myFatoorahBaseURL,
          myFatoorahTestMode,
          // SEO & Branding
          homeMetaTitle,
          homeMetaDescription,
          faviconUrl,
          headerLogoUrl,
          footerLogoUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      alert("Settings saved successfully!");
      await fetchSettings(); // Refresh to get masked values
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUrl(data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <PromoBar />
        <div className="admin-body">
          <AdminSidebar activePage="settings" />
          <main className="admin-main">
            <AdminToolbar title="Settings" />
            <div className="admin-content">
              <div style={{ padding: "24px", textAlign: "center" }}>Loading settings...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              <button 
                className="settings-btn" 
                onClick={handleSave}
                disabled={saving}
                style={{ marginTop: "16px", padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: saving ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "500" }}
              >
                {saving ? "Saving..." : "Save All Settings"}
              </button>
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
                
                <label className="settings-label">
                  Header Logo
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="settings-input"
                      value={headerLogoUrl}
                      onChange={(e) => setHeaderLogoUrl(e.target.value)}
                      placeholder="Enter URL or upload image"
                    />
                    <label className="settings-btn" style={{ cursor: 'pointer', margin: 0 }}>
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setHeaderLogoUrl)}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {headerLogoUrl && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <img src={headerLogoUrl} alt="Header Logo Preview" style={{ maxHeight: '50px', maxWidth: '100%' }} />
                    </div>
                  )}
                </label>

                <label className="settings-label">
                  Footer Logo
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="settings-input"
                      value={footerLogoUrl}
                      onChange={(e) => setFooterLogoUrl(e.target.value)}
                      placeholder="Enter URL or upload image"
                    />
                    <label className="settings-btn" style={{ cursor: 'pointer', margin: 0 }}>
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setFooterLogoUrl)}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {footerLogoUrl && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <img src={footerLogoUrl} alt="Footer Logo Preview" style={{ maxHeight: '50px', maxWidth: '100%' }} />
                    </div>
                  )}
                </label>

                <label className="settings-label">
                  Favicon
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="settings-input"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="Enter URL or upload .ico/.png"
                    />
                    <label className="settings-btn" style={{ cursor: 'pointer', margin: 0 }}>
                      Upload
                      <input
                        type="file"
                        hidden
                        accept=".ico,.png,.svg"
                        onChange={(e) => handleFileUpload(e, setFaviconUrl)}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {faviconUrl && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <img src={faviconUrl} alt="Favicon Preview" style={{ width: '32px', height: '32px' }} />
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Home Page SEO */}
            <div className="settings-card">
              <h2 className="settings-card-title">Home Page SEO</h2>
              <div className="settings-form-group">
                <label className="settings-label">
                  Meta Title
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="settings-helper-text">Recommended length: 50-60 characters</span>
                    <span className={`settings-helper-text ${homeMetaTitle.length > 60 ? 'text-red-500' : ''}`}>
                      {homeMetaTitle.length} / 60
                    </span>
                  </div>
                  <input
                    type="text"
                    className="settings-input"
                    value={homeMetaTitle}
                    onChange={(e) => setHomeMetaTitle(e.target.value)}
                    placeholder="Enter meta title for home page"
                  />
                </label>

                <label className="settings-label">
                  Meta Description
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="settings-helper-text">Recommended length: 150-160 characters</span>
                    <span className={`settings-helper-text ${homeMetaDescription.length > 160 ? 'text-red-500' : ''}`}>
                      {homeMetaDescription.length} / 160
                    </span>
                  </div>
                  <textarea
                    className="settings-input"
                    value={homeMetaDescription}
                    onChange={(e) => setHomeMetaDescription(e.target.value)}
                    placeholder="Enter meta description for home page"
                    rows={4}
                    style={{ resize: 'vertical' }}
                  />
                </label>

                {/* SERP Preview */}
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#555' }}>Google Search Preview</h3>
                  <div style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div style={{ color: '#202124', fontSize: '14px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      {faviconUrl && <img src={faviconUrl} alt="" style={{ width: '16px', height: '16px', marginRight: '8px', borderRadius: '50%' }} />}
                      <span>likes.io</span>
                    </div>
                    <div style={{ color: '#1a0dab', fontSize: '20px', lineHeight: '1.3', cursor: 'pointer', textDecoration: 'none' }}>
                      {homeMetaTitle || 'Page Title'}
                    </div>
                    <div style={{ color: '#4d5156', fontSize: '14px', lineHeight: '1.58', marginTop: '4px' }}>
                      {homeMetaDescription || 'Page description will appear here...'}
                    </div>
                  </div>
                </div>
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

            {/* RapidAPI Configuration */}
            <div className="settings-card">
              <h2 className="settings-card-title">RapidAPI Configuration</h2>
              <p className="settings-card-description">Configure API keys and hosts for social media data fetching.</p>
              <div className="settings-form-group">
                <label className="settings-label">
                  RapidAPI Key
                  <input
                    type="password"
                    className="settings-input"
                    value={rapidApiKey}
                    onChange={(e) => setRapidApiKey(e.target.value)}
                    placeholder="Enter your RapidAPI key"
                  />
                  <span className="settings-helper-text">Leave as •••• to keep current value unchanged.</span>
                </label>
                <label className="settings-label">
                  Instagram Host
                  <input
                    type="text"
                    className="settings-input"
                    value={rapidApiInstagramHost}
                    onChange={(e) => setRapidApiInstagramHost(e.target.value)}
                  />
                </label>
                <label className="settings-label">
                  TikTok Host
                  <input
                    type="text"
                    className="settings-input"
                    value={rapidApiTikTokHost}
                    onChange={(e) => setRapidApiTikTokHost(e.target.value)}
                  />
                </label>
                <label className="settings-label">
                  YouTube Host
                  <input
                    type="text"
                    className="settings-input"
                    value={rapidApiYouTubeHost}
                    onChange={(e) => setRapidApiYouTubeHost(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="settings-card">
              <h2 className="settings-card-title">Authentication Keys</h2>
              <p className="settings-card-description">Configure reCAPTCHA and social login credentials.</p>
              <div className="settings-form-group">
                <label className="settings-label">
                  reCAPTCHA Site Key
                  <input
                    type="text"
                    className="settings-input"
                    value={recaptchaSiteKey}
                    onChange={(e) => setRecaptchaSiteKey(e.target.value)}
                    placeholder="Enter your public site key"
                  />
                </label>
                <label className="settings-label">
                  reCAPTCHA Secret Key
                  <input
                    type="password"
                    className="settings-input"
                    value={recaptchaSecretKey}
                    onChange={(e) => setRecaptchaSecretKey(e.target.value)}
                    placeholder="Enter your secret key"
                  />
                  <span className="settings-helper-text">Leave as •••• to keep current value unchanged.</span>
                </label>
                <label className="settings-label">
                  Google Client ID
                  <input
                    type="text"
                    className="settings-input"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    placeholder="Enter Google OAuth Client ID"
                  />
                </label>
                <label className="settings-label">
                  Google Client Secret
                  <input
                    type="password"
                    className="settings-input"
                    value={googleClientSecret}
                    onChange={(e) => setGoogleClientSecret(e.target.value)}
                    placeholder="Enter Google OAuth Client Secret"
                  />
                  <span className="settings-helper-text">Leave as •••• to keep current value unchanged.</span>
                </label>
                <label className="settings-label">
                  Facebook Client ID
                  <input
                    type="text"
                    className="settings-input"
                    value={facebookClientId}
                    onChange={(e) => setFacebookClientId(e.target.value)}
                    placeholder="Enter Facebook OAuth App ID"
                  />
                </label>
                <label className="settings-label">
                  Facebook Client Secret
                  <input
                    type="password"
                    className="settings-input"
                    value={facebookClientSecret}
                    onChange={(e) => setFacebookClientSecret(e.target.value)}
                    placeholder="Enter Facebook OAuth App Secret"
                  />
                  <span className="settings-helper-text">Leave as •••• to keep current value unchanged.</span>
                </label>
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
                    placeholder="e8c0a90f-48c5-4ab0-ae1c-ac6144ae20b9"
                  />
                </label>
                <label className="settings-label">
                  Payout API Key
                  <input
                    type="password"
                    className="settings-input"
                    value={cryptomusApiKey}
                    onChange={(e) => setCryptomusApiKey(e.target.value)}
                    placeholder="Enter your Payout API key"
                  />
                  <span className="settings-helper-text">Leave as •••• to keep current value unchanged.</span>
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

            {/* MyFatoorah Gateway */}
            <div className="settings-card">
              <h2 className="settings-card-title">MyFatoorah Gateway</h2>
              <p className="settings-card-description">Configure MyFatoorah payment gateway settings.</p>
              <div className="settings-form-group">
                <label className="settings-label">
                  API Token
                  <input
                    type="password"
                    className="settings-input"
                    value={myFatoorahToken}
                    onChange={(e) => setMyFatoorahToken(e.target.value)}
                    placeholder="Enter your MyFatoorah API token"
                  />
                  <span className="settings-helper-text">Leave as •••• to keep current value unchanged.</span>
                </label>
                <label className="settings-label">
                  Base URL
                  <input
                    type="text"
                    className="settings-input"
                    value={myFatoorahBaseURL}
                    onChange={(e) => setMyFatoorahBaseURL(e.target.value)}
                    placeholder="https://apitest.myfatoorah.com"
                  />
                </label>
                <div className="settings-toggle-group">
                  <label className="settings-toggle-label">
                    <span>Test Mode</span>
                    <span className="settings-toggle-description">Enable to use the test environment (apitest.myfatoorah.com).</span>
                  </label>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={myFatoorahTestMode}
                      onChange={(e) => setMyFatoorahTestMode(e.target.checked)}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Email Configuration (SMTP) */}
            <div className="settings-card">
              <h2 className="settings-card-title">Email Configuration (SMTP)</h2>
              <p className="settings-card-description">Configure SMTP settings for sending system emails.</p>
              <div className="settings-form-group">
                <label className="settings-label">
                  SMTP Host
                  <input
                    type="text"
                    className="settings-input"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.example.com"
                  />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label className="settings-label">
                    SMTP Port
                    <input
                      type="number"
                      className="settings-input"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="587"
                    />
                  </label>
                  <label className="settings-label">
                    From Email
                    <input
                      type="email"
                      className="settings-input"
                      value={smtpFrom}
                      onChange={(e) => setSmtpFrom(e.target.value)}
                      placeholder="noreply@example.com"
                    />
                  </label>
                </div>
                <label className="settings-label">
                  SMTP User
                  <input
                    type="text"
                    className="settings-input"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="user@example.com"
                  />
                </label>
                <label className="settings-label">
                  SMTP Password
                  <input
                    type="password"
                    className="settings-input"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Enter SMTP password"
                  />
                </label>
                <div className="settings-toggle-group">
                  <label className="settings-toggle-label">
                    <span>Secure (SSL/TLS)</span>
                    <span className="settings-toggle-description">Enable if your SMTP server requires a secure connection.</span>
                  </label>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={smtpSecure}
                      onChange={(e) => setSmtpSecure(e.target.checked)}
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
