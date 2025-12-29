"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfileDashboard() {
  const { data: session, status } = useSession();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "unknown@domain.com";
  const userRole = session?.user?.role === "ADMIN" ? "Administrator" : "User";
  
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch("/api/admin/profile/avatar");
        if (res.ok) {
          const data = await res.json();
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchAvatar();
  }, []);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setAvatarUrl(data.url);
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/profile/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save avatar");
      }
      alert("Avatar saved");
      try {
        window.dispatchEvent(new CustomEvent("avatar-updated"));
      } catch {}
    } catch (err: any) {
      alert(err.message || "Failed to save avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar />
        <main className="admin-main">
          <AdminToolbar title="My Profile" />
          <div className="admin-content">
            <div className="settings-page">
              <div className="settings-card">
                <h2 className="settings-card-title">Account Details</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Name
                    <input
                      type="text"
                      className="settings-input"
                      value={userName}
                      readOnly
                    />
                  </label>
                  <label className="settings-label">
                    Email
                    <input
                      type="text"
                      className="settings-input"
                      value={userEmail}
                      readOnly
                    />
                  </label>
                  <label className="settings-label">
                    Role
                    <input
                      type="text"
                      className="settings-input"
                      value={userRole}
                      readOnly
                    />
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h2 className="settings-card-title">Session Status</h2>
                <p className="settings-card-description">
                  {status === "loading"
                    ? "Loading your session..."
                    : status === "authenticated"
                    ? "You are logged in."
                    : "You are not logged in."}
                </p>
              </div>

              <div className="settings-card">
                <h2 className="settings-card-title">Avatar</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Avatar URL
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="settings-input"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="Enter URL or upload image"
                      />
                      <label className="settings-btn" style={{ cursor: 'pointer', margin: 0 }}>
                        Upload
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {avatarUrl && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                        <img src={avatarUrl} alt="Avatar Preview" style={{ maxHeight: '80px', maxWidth: '100%', borderRadius: '8px' }} />
                      </div>
                    )}
                  </label>
                  <button 
                    className="settings-btn" 
                    onClick={handleSaveAvatar}
                    disabled={saving}
                    style={{ marginTop: "16px", padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: saving ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "500" }}
                  >
                    {saving ? "Saving..." : "Save Avatar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
