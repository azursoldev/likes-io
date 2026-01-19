"use client";

import { useState, useEffect } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";

export default function NavigationDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [headerLogoUrl, setHeaderLogoUrl] = useState("");
  const [footerLogoUrl, setFooterLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [headerMenu, setHeaderMenu] = useState<any[]>([]);
  const [footerMenu, setFooterMenu] = useState<any[]>([]);
  const [headerColumnMenus, setHeaderColumnMenus] = useState<any[]>([]);
  const [footerColumnMenus, setFooterColumnMenus] = useState<any[]>([]);

  const getDefaultHeaderColumnMenus = () => [
    {
      id: "header-col-instagram",
      title: "Instagram Services",
      items: [
        {
          id: "header-col-instagram-likes",
          label: "Buy Instagram Likes",
          platform: "instagram",
          serviceType: "likes",
          url: "",
        },
        {
          id: "header-col-instagram-followers",
          label: "Buy Instagram Followers",
          platform: "instagram",
          serviceType: "followers",
          url: "",
        },
        {
          id: "header-col-instagram-views",
          label: "Buy Instagram Views",
          platform: "instagram",
          serviceType: "views",
          url: "",
        },
      ],
    },
    {
      id: "header-col-tiktok",
      title: "TikTok Services",
      items: [
        {
          id: "header-col-tiktok-likes",
          label: "Buy TikTok Likes",
          platform: "tiktok",
          serviceType: "likes",
          url: "",
        },
        {
          id: "header-col-tiktok-followers",
          label: "Buy TikTok Followers",
          platform: "tiktok",
          serviceType: "followers",
          url: "",
        },
        {
          id: "header-col-tiktok-views",
          label: "Buy TikTok Views",
          platform: "tiktok",
          serviceType: "views",
          url: "",
        },
      ],
    },
    {
      id: "header-col-youtube",
      title: "YouTube Services",
      items: [
        {
          id: "header-col-youtube-views",
          label: "Buy YouTube Views",
          platform: "youtube",
          serviceType: "views",
          url: "",
        },
        {
          id: "header-col-youtube-subscribers",
          label: "Buy YouTube Subscribers",
          platform: "youtube",
          serviceType: "subscribers",
          url: "",
        },
        {
          id: "header-col-youtube-likes",
          label: "Buy YouTube Likes",
          platform: "youtube",
          serviceType: "likes",
          url: "",
        },
      ],
    },
  ];

  const getDefaultFooterColumnMenus = () => [
    {
      id: "footer-col-instagram",
      title: "Instagram Services",
      items: [
        { id: "footer-col-instagram-likes", label: "Buy Instagram Likes", url: "" },
        { id: "footer-col-instagram-followers", label: "Buy Instagram Followers", url: "" },
        { id: "footer-col-instagram-views", label: "Buy Instagram Views", url: "" },
      ],
    },
    {
      id: "footer-col-tiktok",
      title: "TikTok Services",
      items: [
        { id: "footer-col-tiktok-likes", label: "Buy TikTok Likes", url: "" },
        { id: "footer-col-tiktok-followers", label: "Buy TikTok Followers", url: "" },
        { id: "footer-col-tiktok-views", label: "Buy TikTok Views", url: "" },
      ],
    },
    {
      id: "footer-col-youtube",
      title: "YouTube Services",
      items: [
        { id: "footer-col-youtube-views", label: "Buy YouTube Views", url: "" },
        { id: "footer-col-youtube-subscribers", label: "Buy YouTube Subscribers", url: "" },
        { id: "footer-col-youtube-likes", label: "Buy YouTube Likes", url: "" },
      ],
    },
    {
      id: "footer-col-tools",
      title: "Tools & Resources",
      items: [
        { id: "footer-col-tools-free-likes", label: "Free Instagram Likes", url: "/free-instagram-likes" },
        { id: "footer-col-tools-free-followers", label: "Free Instagram Followers", url: "/free-instagram-followers" },
        { id: "footer-col-tools-reviews", label: "Reviews", url: "/reviews" },
      ],
    },
    {
      id: "footer-col-account",
      title: "My Account",
      items: [
        { id: "footer-col-account-login", label: "Log In", url: "/login" },
        { id: "footer-col-account-signup", label: "Sign Up", url: "/signup" },
      ],
    },
    {
      id: "footer-col-affiliate",
      title: "Affiliate Program",
      items: [
        { id: "footer-col-affiliate-become", label: "Become an Affiliate", url: "/affiliate" },
        { id: "footer-col-affiliate-login", label: "Log in to view stats.", url: "/login" },
      ],
    },
  ];

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/navigation");
      if (response.ok) {
        const data = await response.json();
        if (data.headerLogoUrl) setHeaderLogoUrl(data.headerLogoUrl);
        if (data.footerLogoUrl) setFooterLogoUrl(data.footerLogoUrl);
        if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
        if (Array.isArray(data.headerMenu)) {
          setHeaderMenu(
            data.headerMenu.map((item: any, index: number) => ({
              id: item.id || `header-${index}-${Date.now()}`,
              label: item.label || "",
              url: item.url || "",
            }))
          );
        } else {
          setHeaderMenu([
            { id: "header-faq", label: "FAQ", url: "/faq" },
            { id: "header-blog", label: "Blog", url: "/blog" },
          ]);
        }
        if (Array.isArray(data.footerMenu)) {
          setFooterMenu(
            data.footerMenu.map((item: any, index: number) => ({
              id: item.id || `footer-${index}-${Date.now()}`,
              label: item.label || "",
              url: item.url || "",
            }))
          );
        } else {
          setFooterMenu([
            { id: "footer-faq", label: "FAQ", url: "/faq" },
            { id: "footer-blog", label: "Blog", url: "/blog" },
            { id: "footer-about", label: "About Us", url: "/about" },
            { id: "footer-team", label: "Our Team", url: "/team" },
            { id: "footer-contact", label: "Contact Us", url: "/contact" },
            { id: "footer-terms", label: "Terms of Service", url: "/terms" },
            { id: "footer-privacy", label: "Privacy Policy", url: "/privacy" },
          ]);
        }
        if (Array.isArray(data.headerColumnMenus)) {
          setHeaderColumnMenus(
            data.headerColumnMenus.map((column: any, columnIndex: number) => ({
              id: column.id || `header-col-${columnIndex}-${Date.now()}`,
              title: column.title || "",
              items: Array.isArray(column.items)
                ? column.items.map((item: any, itemIndex: number) => ({
                    id: item.id || `header-item-${columnIndex}-${itemIndex}-${Date.now()}`,
                    label: item.label || "",
                    platform: item.platform || "",
                    serviceType: item.serviceType || "",
                    url: item.url || "",
                  }))
                : [],
            }))
          );
        } else {
          setHeaderColumnMenus(getDefaultHeaderColumnMenus());
        }
        if (Array.isArray(data.footerColumnMenus)) {
          setFooterColumnMenus(
            data.footerColumnMenus.map((column: any, columnIndex: number) => ({
              id: column.id || `footer-col-${columnIndex}-${Date.now()}`,
              title: column.title || "",
              items: Array.isArray(column.items)
                ? column.items.map((item: any, itemIndex: number) => ({
                    id: item.id || `footer-item-${columnIndex}-${itemIndex}-${Date.now()}`,
                    label: item.label || "",
                    url: item.url || "",
                  }))
                : [],
            }))
          );
        } else {
          setFooterColumnMenus(getDefaultFooterColumnMenus());
        }
      }
    } catch (error) {
      console.error("Error fetching navigation settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const sanitizedHeaderColumnMenus = headerColumnMenus
        .map((column: any, columnIndex: number) => {
          const title = (column.title || "").trim();
          const items = Array.isArray(column.items)
            ? column.items
                .map((item: any, itemIndex: number) => {
                  const label = (item.label || "").trim();
                  const url = (item.url || "").trim();
                  return { ...item, label, url };
                })
                .filter((item: any) => item.label || item.url)
            : [];
          if (!title && items.length === 0) {
            return null;
          }
          return { ...column, title, items };
        })
        .filter((column: any) => column !== null);
      const response = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerLogoUrl,
          footerLogoUrl,
          faviconUrl,
          headerMenu,
          footerMenu,
          headerColumnMenus: sanitizedHeaderColumnMenus,
          footerColumnMenus,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to save navigation settings");
      }

      alert("Navigation settings saved successfully.");
      await fetchNavigation();
    } catch (error: any) {
      console.error("Error saving navigation settings:", error);
      alert(error.message || "Failed to save navigation settings");
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setUrl(data.url);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      alert(`Failed to upload file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <PromoBar />
        <div className="admin-body">
          <AdminSidebar activePage="navigation" />
          <main className="admin-main">
            <AdminToolbar title="Navigation" />
            <div className="admin-content">
              <div style={{ padding: "24px", textAlign: "center" }}>Loading navigation settings...</div>
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
        <AdminSidebar activePage="navigation" />
        <main className="admin-main">
          <AdminToolbar title="Navigation" />
          <div className="settings-page">
            <div className="settings-header">
              <h1>Navigation</h1>
              <p>Manage header and footer branding and navigation menus used across the site.</p>
              <button
                className="settings-btn"
                onClick={handleSave}
                disabled={saving}
                style={{
                  marginTop: "16px",
                  padding: "10px 24px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {saving ? "Saving..." : "Save Navigation"}
              </button>
            </div>

            {false && (
              <div className="settings-card">
                <h2 className="settings-card-title">Header Logo</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Header Logo URL
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        className="settings-input"
                        value={headerLogoUrl}
                        onChange={(e) => setHeaderLogoUrl(e.target.value)}
                        placeholder="Enter URL or upload image"
                      />
                      <label className="settings-btn" style={{ cursor: "pointer", margin: 0 }}>
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
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                        }}
                      >
                        <img
                          src={headerLogoUrl}
                          alt="Header Logo Preview"
                          style={{ maxHeight: "50px", maxWidth: "100%" }}
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div className="settings-card">
              <h2 className="settings-card-title">Header Menu</h2>
              <p className="settings-card-description">Links shown in the top navigation (desktop and mobile).</p>
              <div className="settings-form-group">
                {headerMenu.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      gap: "8px",
                      marginBottom: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => {
                        const next = [...headerMenu];
                        next[index] = { ...next[index], label: e.target.value };
                        setHeaderMenu(next);
                      }}
                    />
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="URL (e.g. /faq)"
                      value={item.url}
                      onChange={(e) => {
                        const next = [...headerMenu];
                        next[index] = { ...next[index], url: e.target.value };
                        setHeaderMenu(next);
                      }}
                    />
                    <button
                      type="button"
                      className="settings-btn"
                      onClick={() => {
                        setHeaderMenu(headerMenu.filter((_, i) => i !== index));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="settings-btn"
                  onClick={() => {
                    setHeaderMenu([
                      ...headerMenu,
                      {
                        id: `header-${Date.now()}-${headerMenu.length}`,
                        label: "",
                        url: "",
                      },
                    ]);
                  }}
                >
                  Add Header Link
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h2 className="settings-card-title">Header Column Menus</h2>
              <p className="settings-card-description">
                Edit the dropdown columns shown in the header navigation.
              </p>
              <div className="settings-form-group">
                {headerColumnMenus.map((column, columnIndex) => (
                  <div
                    key={column.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="Column title (e.g. Instagram Services)"
                      value={column.title}
                      onChange={(e) => {
                        const next = [...headerColumnMenus];
                        next[columnIndex] = { ...next[columnIndex], title: e.target.value };
                        setHeaderColumnMenus(next);
                      }}
                    />
                    {Array.isArray(column.items) &&
                      column.items.map((item: any, itemIndex: number) => (
                        <div
                          key={item.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr auto",
                            gap: "8px",
                            marginTop: "8px",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="text"
                            className="settings-input"
                            placeholder="Link label"
                            value={item.label}
                            onChange={(e) => {
                              const next = [...headerColumnMenus];
                              const items = Array.isArray(next[columnIndex].items)
                                ? [...next[columnIndex].items]
                                : [];
                              items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                              next[columnIndex] = { ...next[columnIndex], items };
                              setHeaderColumnMenus(next);
                            }}
                          />
                          <input
                            type="text"
                            className="settings-input"
                            placeholder="URL (optional, e.g. /instagram/likes)"
                            value={item.url}
                            onChange={(e) => {
                              const next = [...headerColumnMenus];
                              const items = Array.isArray(next[columnIndex].items)
                                ? [...next[columnIndex].items]
                                : [];
                              items[itemIndex] = { ...items[itemIndex], url: e.target.value };
                              next[columnIndex] = { ...next[columnIndex], items };
                              setHeaderColumnMenus(next);
                            }}
                          />
                          <button
                            type="button"
                            className="settings-btn"
                            onClick={() => {
                              const next = [...headerColumnMenus];
                              const items = Array.isArray(next[columnIndex].items)
                                ? next[columnIndex].items.filter((_: any, i: number) => i !== itemIndex)
                                : [];
                              next[columnIndex] = { ...next[columnIndex], items };
                              setHeaderColumnMenus(next);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      className="settings-btn"
                      style={{ marginTop: "8px" }}
                      onClick={() => {
                        const next = [...headerColumnMenus];
                        const items = Array.isArray(next[columnIndex].items)
                          ? [...next[columnIndex].items]
                          : [];
                        items.push({
                          id: `header-item-${columnIndex}-${Date.now()}-${items.length}`,
                          label: "",
                          platform: "",
                          serviceType: "",
                          url: "",
                        });
                        next[columnIndex] = { ...next[columnIndex], items };
                        setHeaderColumnMenus(next);
                      }}
                    >
                      Add Link
                    </button>
                    <button
                      type="button"
                      className="settings-btn"
                      style={{ marginTop: "8px", marginLeft: "8px" }}
                      onClick={() => {
                        setHeaderColumnMenus(
                          headerColumnMenus.filter((_: any, i: number) => i !== columnIndex)
                        );
                      }}
                    >
                      Remove Column
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="settings-btn"
                  onClick={() => {
                    setHeaderColumnMenus([
                      ...headerColumnMenus,
                      {
                        id: `header-col-${Date.now()}-${headerColumnMenus.length}`,
                        title: "",
                        items: [],
                      },
                    ]);
                  }}
                >
                  Add Column
                </button>
              </div>
            </div>

            {false && (
              <div className="settings-card">
                <h2 className="settings-card-title">Footer Logo</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Footer Logo URL
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        className="settings-input"
                        value={footerLogoUrl}
                        onChange={(e) => setFooterLogoUrl(e.target.value)}
                        placeholder="Enter URL or upload image"
                      />
                      <label className="settings-btn" style={{ cursor: "pointer", margin: 0 }}>
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
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                        }}
                      >
                        <img
                          src={footerLogoUrl}
                          alt="Footer Logo Preview"
                          style={{ maxHeight: "50px", maxWidth: "100%" }}
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {false && (
              <div className="settings-card">
                <h2 className="settings-card-title">Favicon</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Favicon URL
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        className="settings-input"
                        value={faviconUrl}
                        onChange={(e) => setFaviconUrl(e.target.value)}
                        placeholder="Enter URL or upload .ico/.png"
                      />
                      <label className="settings-btn" style={{ cursor: "pointer", margin: 0 }}>
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
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                        }}
                      >
                        <img
                          src={faviconUrl}
                          alt="Favicon Preview"
                          style={{ width: "32px", height: "32px" }}
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div className="settings-card">
              <h2 className="settings-card-title">Footer Top Menu</h2>
              <p className="settings-card-description">Links shown in the top row of the footer.</p>
              <div className="settings-form-group">
                {footerMenu.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      gap: "8px",
                      marginBottom: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => {
                        const next = [...footerMenu];
                        next[index] = { ...next[index], label: e.target.value };
                        setFooterMenu(next);
                      }}
                    />
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="URL (e.g. /about)"
                      value={item.url}
                      onChange={(e) => {
                        const next = [...footerMenu];
                        next[index] = { ...next[index], url: e.target.value };
                        setFooterMenu(next);
                      }}
                    />
                    <button
                      type="button"
                      className="settings-btn"
                      onClick={() => {
                        setFooterMenu(footerMenu.filter((_, i) => i !== index));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="settings-btn"
                  onClick={() => {
                    setFooterMenu([
                      ...footerMenu,
                      {
                        id: `footer-${Date.now()}-${footerMenu.length}`,
                        label: "",
                        url: "",
                      },
                    ]);
                  }}
                >
                  Add Footer Link
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h2 className="settings-card-title">Footer Column Menus</h2>
              <p className="settings-card-description">
                Edit the columns and links shown in the footer grid.
              </p>
              <div className="settings-form-group">
                {footerColumnMenus.map((column, columnIndex) => (
                  <div
                    key={column.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="Column title (e.g. Instagram Services)"
                      value={column.title}
                      onChange={(e) => {
                        const next = [...footerColumnMenus];
                        next[columnIndex] = { ...next[columnIndex], title: e.target.value };
                        setFooterColumnMenus(next);
                      }}
                    />
                    {Array.isArray(column.items) &&
                      column.items.map((item: any, itemIndex: number) => (
                        <div
                          key={item.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr auto",
                            gap: "8px",
                            marginTop: "8px",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="text"
                            className="settings-input"
                            placeholder="Link label"
                            value={item.label}
                            onChange={(e) => {
                              const next = [...footerColumnMenus];
                              const items = Array.isArray(next[columnIndex].items)
                                ? [...next[columnIndex].items]
                                : [];
                              items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                              next[columnIndex] = { ...next[columnIndex], items };
                              setFooterColumnMenus(next);
                            }}
                          />
                          <input
                            type="text"
                            className="settings-input"
                            placeholder="URL (e.g. /free-instagram-likes)"
                            value={item.url}
                            onChange={(e) => {
                              const next = [...footerColumnMenus];
                              const items = Array.isArray(next[columnIndex].items)
                                ? [...next[columnIndex].items]
                                : [];
                              items[itemIndex] = { ...items[itemIndex], url: e.target.value };
                              next[columnIndex] = { ...next[columnIndex], items };
                              setFooterColumnMenus(next);
                            }}
                          />
                          <button
                            type="button"
                            className="settings-btn"
                            onClick={() => {
                              const next = [...footerColumnMenus];
                              const items = Array.isArray(next[columnIndex].items)
                                ? next[columnIndex].items.filter((_: any, i: number) => i !== itemIndex)
                                : [];
                              next[columnIndex] = { ...next[columnIndex], items };
                              setFooterColumnMenus(next);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      className="settings-btn"
                      style={{ marginTop: "8px" }}
                      onClick={() => {
                        const next = [...footerColumnMenus];
                        const items = Array.isArray(next[columnIndex].items)
                          ? [...next[columnIndex].items]
                          : [];
                        items.push({
                          id: `footer-item-${columnIndex}-${Date.now()}-${items.length}`,
                          label: "",
                          url: "",
                        });
                        next[columnIndex] = { ...next[columnIndex], items };
                        setFooterColumnMenus(next);
                      }}
                    >
                      Add Link
                    </button>
                    <button
                      type="button"
                      className="settings-btn"
                      style={{ marginTop: "8px", marginLeft: "8px" }}
                      onClick={() => {
                        setFooterColumnMenus(footerColumnMenus.filter((_: any, i: number) => i !== columnIndex));
                      }}
                    >
                      Remove Column
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="settings-btn"
                  onClick={() => {
                    setFooterColumnMenus([
                      ...footerColumnMenus,
                      {
                        id: `footer-col-${Date.now()}-${footerColumnMenus.length}`,
                        title: "",
                        items: [],
                      },
                    ]);
                  }}
                >
                  Add Column
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
