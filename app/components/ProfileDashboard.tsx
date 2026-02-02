"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfileDashboard() {
  const { data: session, status, update } = useSession();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Profile State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userRole = session?.user?.role === "ADMIN" ? "Administrator" : "User";
  
  useEffect(() => {
    // Fetch latest profile data
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    };
    fetchProfile();
  }, []);

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
      setIsSavingAvatar(true);
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
      setIsSavingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword && !currentPassword) {
      setError("Current password is required to set a new password");
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
      
      // Update session if name or email changed
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: data.user.name,
            email: data.user.email,
          },
        });
      }

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
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
              
              {error && (
                <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "20px" }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ padding: "12px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "20px" }}>
                  {success}
                </div>
              )}

              <div className="settings-card">
                <h2 className="settings-card-title">Account Details</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Name
                    <input
                      type="text"
                      className="settings-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label className="settings-label">
                    Email
                    <input
                      type="email"
                      className="settings-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="settings-label">
                    Role
                    <input
                      type="text"
                      className="settings-input"
                      value={userRole}
                      readOnly
                      style={{ background: "#f3f4f6", cursor: "not-allowed" }}
                    />
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h2 className="settings-card-title">Change Password</h2>
                <div className="settings-form-group">
                  <label className="settings-label">
                    Current Password
                    <input
                      type="password"
                      className="settings-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password to change"
                    />
                  </label>
                  <label className="settings-label">
                    New Password
                    <input
                      type="password"
                      className="settings-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                    />
                  </label>
                  <label className="settings-label">
                    Confirm New Password
                    <input
                      type="password"
                      className="settings-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </label>

                  <button 
                    className="settings-btn" 
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    style={{ marginTop: "16px", padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: isSavingProfile ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "500" }}
                  >
                    {isSavingProfile ? "Saving..." : "Save Profile Changes"}
                  </button>
                </div>
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
                    disabled={isSavingAvatar}
                    style={{ marginTop: "16px", padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: isSavingAvatar ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "500" }}
                  >
                    {isSavingAvatar ? "Saving..." : "Save Avatar"}
                  </button>
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

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
