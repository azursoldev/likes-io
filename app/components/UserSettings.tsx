"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UserSettings() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const email = session?.user?.email || "";

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    // Placeholder for real API call
    setTimeout(() => {
      setMessage("Profile updated");
      setLoading(false);
    }, 500);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!password || !newPassword) {
      setError("Enter current and new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    // Placeholder for real API call
    setTimeout(() => {
      setMessage("Password updated");
      setLoading(false);
    }, 500);
  };

  if (status === "loading") {
    return <div className="user-settings"><div className="card">Loading...</div></div>;
  }

  return (
    <div className="user-settings">
      <div className="user-settings-header">
        <h1>Settings</h1>
       
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="settings-grid">
        <div className="card">
          <h2>Profile</h2>
          <form onSubmit={handleProfileSave} className="settings-form">
            <label className="settings-label">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="settings-input"
              />
            </label>
            <label className="settings-label">
              Email
              <input
                type="email"
                value={email}
                readOnly
                className="settings-input"
              />
              <span className="settings-helper">Email cannot be changed.</span>
            </label>
            <button type="submit" className="settings-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Password</h2>
          <form onSubmit={handlePasswordSave} className="settings-form">
            <label className="settings-label">
              Current Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="settings-input"
                placeholder="Current password"
              />
            </label>
            <label className="settings-label">
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="settings-input"
                placeholder="New password"
              />
            </label>
            <button type="submit" className="settings-btn" disabled={loading}>
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Notifications</h2>
          <div className="settings-toggle">
            <label className="settings-label-inline">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              Enable email notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

