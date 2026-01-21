"use client";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSave } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

type FreeToolContent = {
  heroTitle: string;
  heroDescription: string;
  rating: string;
  reviewCount: string;
  step1Title?: string | null;
  step1Description?: string | null;
  step2Title?: string | null;
  step2Description?: string | null;
  step3Title?: string | null;
  step3Description?: string | null;
  inputLabel?: string | null;
  inputPlaceholder?: string | null;
  buttonText?: string | null;
  assurance1?: string | null;
  assurance2?: string | null;
  assurance3?: string | null;
};

export default function FreeToolsDashboard() {
  const [selectedTool, setSelectedTool] = useState<"free-instagram-likes" | "free-instagram-followers">("free-instagram-likes");
  const [content, setContent] = useState<FreeToolContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchContent(selectedTool);
  }, [selectedTool]);

  const fetchContent = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/free-tools/${slug}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load content" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/free-tools/${selectedTool}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTitle: content.heroTitle,
          heroDescription: content.heroDescription,
          rating: content.rating,
          reviewCount: content.reviewCount,
        }),
      });

      if (!res.ok) throw new Error("Failed to update content");

      const updatedData = await res.json();
      setContent(updatedData);
      setMessage({ type: "success", text: "Content updated successfully!" });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to update content" });
    } finally {
      setSaving(false);
    }
  };

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
                  <button 
                    className="settings-btn"
                    onClick={handleSave}
                    disabled={saving || loading}
                    style={{
                      padding: "10px 24px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: saving || loading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-content-area">
            {message && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}>
                {message.text}
              </div>
            )}

            <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '24px', marginTop: '20px' }}>
              <button 
                onClick={() => setSelectedTool("free-instagram-likes")}
                style={{
                  padding: "10px 24px",
                  background: selectedTool === "free-instagram-likes" ? "#2563eb" : "#fff",
                  color: selectedTool === "free-instagram-likes" ? "#fff" : "#374151",
                  border: selectedTool === "free-instagram-likes" ? "none" : "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s"
                }}
              >
                Free Instagram Likes
              </button>
              <button 
                onClick={() => setSelectedTool("free-instagram-followers")}
                style={{
                  padding: "10px 24px",
                  background: selectedTool === "free-instagram-followers" ? "#2563eb" : "#fff",
                  color: selectedTool === "free-instagram-followers" ? "#fff" : "#374151",
                  border: selectedTool === "free-instagram-followers" ? "none" : "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s"
                }}
              >
                Free Instagram Followers
              </button>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Hero Section</h2>
              </div>
              <div className="admin-card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : content ? (
                  <div className="form-grid">
                    <div className="form-group full">
                      <label>Title</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.heroTitle}
                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                      />
                    </div>
                    <div className="form-group full">
                      <label>Description</label>
                      <textarea 
                        className="admin-textarea"
                        rows={4}
                        value={content.heroDescription}
                        onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Rating (e.g. 4.9/5)</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.rating}
                        onChange={(e) => setContent({ ...content, rating: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Review Count (e.g. 451+)</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.reviewCount}
                        onChange={(e) => setContent({ ...content, reviewCount: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <p>No content loaded</p>
                )}
              </div>
            </div>

            <div className="admin-card" style={{ marginTop: '24px' }}>
              <div className="admin-card-header">
                <h2>Form Section</h2>
              </div>
              <div className="admin-card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : content ? (
                  <div className="form-grid">
                    {/* Step 1 */}
                    <div className="form-group">
                      <label>Step 1 Title</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.step1Title || ""}
                        onChange={(e) => setContent({ ...content, step1Title: e.target.value })}
                        placeholder="1. Enter Your Username"
                      />
                    </div>
                    <div className="form-group">
                      <label>Step 1 Description</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.step1Description || ""}
                        onChange={(e) => setContent({ ...content, step1Description: e.target.value })}
                      />
                    </div>

                    {/* Step 2 */}
                    <div className="form-group">
                      <label>Step 2 Title</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.step2Title || ""}
                        onChange={(e) => setContent({ ...content, step2Title: e.target.value })}
                        placeholder="2. Select Your Post"
                      />
                    </div>
                    <div className="form-group">
                      <label>Step 2 Description</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.step2Description || ""}
                        onChange={(e) => setContent({ ...content, step2Description: e.target.value })}
                      />
                    </div>

                    {/* Step 3 */}
                    <div className="form-group">
                      <label>Step 3 Title</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.step3Title || ""}
                        onChange={(e) => setContent({ ...content, step3Title: e.target.value })}
                        placeholder="3. Receive Free Likes"
                      />
                    </div>
                    <div className="form-group">
                      <label>Step 3 Description</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.step3Description || ""}
                        onChange={(e) => setContent({ ...content, step3Description: e.target.value })}
                      />
                    </div>

                    {/* Input Fields */}
                    <div className="form-group">
                      <label>Input Label</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.inputLabel || ""}
                        onChange={(e) => setContent({ ...content, inputLabel: e.target.value })}
                        placeholder="Enter Your Instagram Username"
                      />
                    </div>
                    <div className="form-group">
                      <label>Input Placeholder</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.inputPlaceholder || ""}
                        onChange={(e) => setContent({ ...content, inputPlaceholder: e.target.value })}
                        placeholder="@username"
                      />
                    </div>
                    <div className="form-group">
                      <label>Button Text</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.buttonText || ""}
                        onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                        placeholder="Continue →"
                      />
                    </div>

                    {/* Assurance Labels */}
                    <div className="form-group">
                      <label>Assurance 1</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.assurance1 || ""}
                        onChange={(e) => setContent({ ...content, assurance1: e.target.value })}
                        placeholder="No Password Required"
                      />
                    </div>
                    <div className="form-group">
                      <label>Assurance 2</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.assurance2 || ""}
                        onChange={(e) => setContent({ ...content, assurance2: e.target.value })}
                        placeholder="100% Free & Safe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Assurance 3</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={content.assurance3 || ""}
                        onChange={(e) => setContent({ ...content, assurance3: e.target.value })}
                        placeholder="Instant Delivery"
                      />
                    </div>
                  </div>
                ) : (
                  <p>No content loaded</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
