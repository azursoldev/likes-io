"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { useSession } from "next-auth/react";

export default function ProfileDashboard() {
  const { data: session, status } = useSession();

  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "unknown@domain.com";
  const userRole = session?.user?.role === "ADMIN" ? "Administrator" : "User";

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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
