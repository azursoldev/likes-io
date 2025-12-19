"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCircleInfo, faSync, faCopy, faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type SMMPanelStatus = "connected" | "partial" | "not_configured";

interface JAPService {
  service: number;
  name: string;
  category: string;
  type: string;
  rate: number;
  min: number;
  max: number;
}

export default function SMMPanelDashboard() {
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<SMMPanelStatus>("not_configured");
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<JAPService[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/smm-panel/config");
        if (!res.ok) {
          throw new Error("Failed to load SMM panel config");
        }
        const data = await res.json();

        // Show preview values from env so the page reflects real config
        if (data.apiUrlConfigured && data.apiUrlPreview) {
          setApiUrl(data.apiUrlPreview);
        } else {
          setApiUrl("https://justanotherpanel.com/api/v2");
        }

        if (data.apiKeyConfigured && data.maskedKey) {
          setApiKey(data.maskedKey);
        } else {
          setApiKey("************");
        }

        setStatus(data.status as SMMPanelStatus);
      } catch (e) {
        console.error(e);
        setStatus("not_configured");
        setApiUrl("https://justanotherpanel.com/api/v2");
        setApiKey("************");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const syncServices = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/jap/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      
      if (!res.ok) {
        throw new Error("Failed to sync services");
      }

      // Fetch services list to display
      const servicesRes = await fetch("/api/admin/jap/services");
      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error syncing services:", error);
      alert("Failed to sync services. Make sure your JAP API credentials are configured correctly.");
    } finally {
      setSyncing(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await fetch("/api/admin/jap/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  useEffect(() => {
    if (status === "connected") {
      loadServices();
    }
  }, [status]);

  const copyServiceId = (serviceId: number) => {
    navigator.clipboard.writeText(serviceId.toString());
    setCopiedId(serviceId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const statusText =
    status === "connected"
      ? "Connected (JAP credentials found in environment)"
      : status === "partial"
      ? "Partially Configured (missing URL or Key in environment)"
      : "Not Configured (set JAP_API_URL and JAP_API_KEY in your .env.local file)";

  const statusClassName =
    status === "connected"
      ? "smm-panel-status-text smm-panel-status-text--ok"
      : status === "partial"
      ? "smm-panel-status-text smm-panel-status-text--warn"
      : "smm-panel-status-text smm-panel-status-text--error";

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
                    {/* This field is informational – real value comes from JAP_API_URL */}
                    <input
                      type="text"
                      className="smm-panel-input"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                    />
                    <span className="smm-panel-hint">
                      Current value is read from <code>JAP_API_URL</code>. To change it, update your <code>.env.local</code> file
                      (e.g. <code>JAP_API_URL={`https://justanotherpanel.com/api/v2`}</code>) and restart the server.
                    </span>
                  </label>
                  <label className="smm-panel-label">
                    API Key
                    {/* Masked for security – real value comes from JAP_API_KEY */}
                    <input
                      type="password"
                      className="smm-panel-input"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <span className="smm-panel-hint">
                      Stored securely in <code>JAP_API_KEY</code>. Paste your key into <code>.env.local</code> and restart the server; this field will
                      show a masked preview.
                    </span>
                  </label>
                  <div className="smm-panel-connection-status">
                    <label className="smm-panel-label">Connection Status</label>
                    <div className="smm-panel-status-indicator">
                      <FontAwesomeIcon icon={faCircleInfo} className="smm-panel-status-icon" />
                      <span className={statusClassName}>
                        {loading ? "Checking configuration..." : statusText}
                      </span>
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
                      <strong>Enter API Details:</strong> Get the API URL and Key from your SMM provider and save them in your <code>.env.local</code> file as <code>JAP_API_URL</code> and <code>JAP_API_KEY</code>, then restart your server.
                    </div>
                  </div>
                  <div className="smm-panel-step">
                    <div className="smm-panel-step-number">2</div>
                    <div className="smm-panel-step-content">
                      <strong>Sync Services:</strong> Once connected, click "Sync Services" below to fetch all available services from JustAnotherPanel. You can search and filter services by category.
                    </div>
                  </div>
                  <div className="smm-panel-step">
                    <div className="smm-panel-step-number">3</div>
                    <div className="smm-panel-step-content">
                      <strong>Copy Service IDs:</strong> Click the copy icon next to any service to copy its Service ID. Then go to the Services page, edit a service, and paste the Service ID into the "Service ID" field for each pricing tier.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Services - New Row */}
            {status === "connected" && (
              <div className="smm-panel-content" style={{ marginTop: "2rem", gridTemplateColumns: "1fr" }}>
                <div className="smm-panel-card" style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 className="smm-panel-card-title">Available Services</h2>
                    <button
                      onClick={syncServices}
                      disabled={syncing}
                      style={{
                        padding: "0.5rem 1rem",
                        background: syncing ? "#ccc" : "#ff6b35",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: syncing ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faSync} spin={syncing} />
                      {syncing ? "Syncing..." : "Sync Services"}
                    </button>
                  </div>
                  <p className="smm-panel-card-description">
                    View all available services from JustAnotherPanel. Click the copy icon to copy a Service ID, then paste it into the "Service ID" field when editing pricing tiers in the Services page.
                  </p>

                  {services.length > 0 && (
                    <>
                      <div style={{ 
                        display: "flex", 
                        gap: "12px", 
                        marginBottom: "1.5rem", 
                        flexWrap: "wrap",
                        alignItems: "center"
                      }}>
                        <div style={{ 
                          position: "relative", 
                          flex: "1", 
                          minWidth: "250px",
                          maxWidth: "400px"
                        }}>
                          <FontAwesomeIcon
                            icon={faSearch}
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#9ca3af",
                              fontSize: "14px",
                              pointerEvents: "none",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              fontSize: "14px",
                              color: "#111827",
                              background: "#fff",
                              boxSizing: "border-box",
                              outline: "none",
                              transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                          />
                        </div>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          style={{
                            padding: "10px 36px 10px 12px",
                            border: "1px solid #111827",
                            borderRadius: "6px",
                            minWidth: "180px",
                            fontSize: "14px",
                            color: "#111827",
                            background: "#fff",
                            cursor: "pointer",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23111827' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                            boxSizing: "border-box",
                            outline: "none",
                            transition: "border-color 0.2s",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                          onBlur={(e) => e.target.style.borderColor = "#111827"}
                        >
                          <option value="all">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div
                        style={{
                          maxHeight: "500px",
                          overflowY: "auto",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead style={{ background: "#f5f5f5", position: "sticky", top: 0 }}>
                            <tr>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>Service ID</th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>Category</th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>Type</th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>Rate</th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>Min-Max</th>
                              <th style={{ padding: "0.75rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredServices.length === 0 ? (
                              <tr>
                                <td colSpan={7} style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                                  No services found matching your search.
                                </td>
                              </tr>
                            ) : (
                              filteredServices.map((service) => (
                                <tr key={service.service} style={{ borderBottom: "1px solid #eee" }}>
                                  <td style={{ padding: "0.75rem", fontWeight: "bold" }}>{service.service}</td>
                                  <td style={{ padding: "0.75rem" }}>{service.name}</td>
                                  <td style={{ padding: "0.75rem" }}>{service.category}</td>
                                  <td style={{ padding: "0.75rem" }}>{service.type}</td>
                                  <td style={{ padding: "0.75rem" }}>${service.rate}</td>
                                  <td style={{ padding: "0.75rem" }}>
                                    {service.min} - {service.max === 0 ? "∞" : service.max}
                                  </td>
                                  <td style={{ padding: "0.75rem", textAlign: "center" }}>
                                    <button
                                      onClick={() => copyServiceId(service.service)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: copiedId === service.service ? "#4caf50" : "#666",
                                        padding: "0.25rem",
                                      }}
                                      title="Copy Service ID"
                                    >
                                      <FontAwesomeIcon icon={copiedId === service.service ? faCheck : faCopy} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {services.length === 0 && !syncing && (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                      <p>No services loaded yet. Click "Sync Services" to fetch services from JustAnotherPanel.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

