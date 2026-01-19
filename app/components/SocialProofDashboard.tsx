"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { useMemo, useState, useEffect } from "react";

type Platform = "Instagram" | "YouTube" | "TikTok";

type SocialProofActivity = {
  id: string;
  platform: Platform;
  username: string;
  service: string;
  timeText: string;
  notificationLabel?: string;
};

const platformIconMap: Record<Platform, any> = {
  Instagram: faInstagram,
  YouTube: faYoutube,
  TikTok: faTiktok,
};

export default function SocialProofDashboard() {
  const [activities, setActivities] = useState<SocialProofActivity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [username, setUsername] = useState("");
  const [service, setService] = useState("");
  const [timeText, setTimeText] = useState("");
  const [notificationLabel, setNotificationLabel] = useState("just purchased");
  const [loading, setLoading] = useState(true);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/admin/social-proof', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlatform("Instagram");
    setUsername("");
    setService("");
    setTimeText("");
    setNotificationLabel("just purchased");
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleStartEdit = (item: SocialProofActivity) => {
    setEditingId(item.id);
    setPlatform(item.platform);
    setUsername(item.username);
    setService(item.service);
    setTimeText(item.timeText);
    setNotificationLabel(item.notificationLabel || "just purchased");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!username.trim() || !service.trim() || !timeText.trim()) return;

    try {
      if (editingId !== null) {
        // Update
        const res = await fetch(`/api/admin/social-proof/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform, username, service, timeText, notificationLabel })
        });
        
        if (res.ok) {
          const updated = await res.json();
          setActivities(prev => prev.map(item => item.id === editingId ? updated : item));
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert(`Failed to update activity: ${errorData.error || 'Unknown error'}`);
        }
      } else {
        // Create
        const res = await fetch('/api/admin/social-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform, username, service, timeText, notificationLabel })
        });
        
        if (res.ok) {
          const created = await res.json();
          setActivities(prev => [...prev, created]);
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert(`Failed to create activity: ${errorData.error || 'Unknown error'}`);
        }
      }
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to save activity");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    try {
      const res = await fetch(`/api/admin/social-proof/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setActivities((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete activity");
      }
    } catch (error) {
       console.error("Failed to delete", error);
       alert("Failed to delete activity");
    }
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="socialProof" />
        <main className="admin-main">
          <AdminToolbar title="Social Proof Ticker" />
          <div className="social-proof-page">
            <div className="social-proof-header">
              <div>
                <h2>Social Proof Ticker</h2>
                <p>Manage the recent purchase notifications shown on the homepage.</p>
              </div>
              <button className="social-proof-add-btn" onClick={handleStartAdd}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Activity</span>
              </button>
            </div>

            <div className="social-proof-card">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="social-proof-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Username</th>
                      <th>Notification Label</th>
                      <th>Service Purchased</th>
                      <th>Time Text</th>
                      <th className="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{textAlign: "center", padding: "20px"}}>No activities found. Add one to get started.</td>
                        </tr>
                    ) : (
                        activities.map((item) => (
                        <tr key={item.id}>
                            <td className="platform-cell">
                            <span className={`platform-pill platform-${item.platform.toLowerCase()}`}>
                                <FontAwesomeIcon icon={platformIconMap[item.platform]} />
                            </span>
                            </td>
                            <td className="username-cell">{item.username}</td>
                            <td>{item.notificationLabel || "just purchased"}</td>
                            <td>{item.service}</td>
                            <td>{item.timeText}</td>
                            <td className="actions-cell">
                            <button className="link-btn" onClick={() => handleStartEdit(item)}>
                                Edit
                            </button>
                            <button className="link-btn danger" onClick={() => handleDelete(item.id)}>
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="faq-modal-backdrop">
          <div className="faq-modal social-proof-modal">
            <div className="faq-modal-header">
              <h3>{isEditing ? "Edit Activity" : "Add New Activity"}</h3>
              <button
                className="faq-modal-close"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="faq-modal-body">
              <div className="modal-row two-col">
                <label className="faq-modal-label">
                  Platform
                  <select className="faq-modal-input" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </label>
                <label className="faq-modal-label">
                  Username
                  <input
                    className="faq-modal-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@username"
                  />
                </label>
              </div>

              <div className="modal-row two-col">
                <label className="faq-modal-label">
                  Notification Label
                  <input
                    className="faq-modal-input"
                    value={notificationLabel}
                    onChange={(e) => setNotificationLabel(e.target.value)}
                    placeholder="e.g. just purchased"
                  />
                </label>
                <label className="faq-modal-label">
                  Service
                  <input
                    className="faq-modal-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. 1,000 Premium Likes"
                  />
                </label>
              </div>

              <div className="modal-row">
                <label className="faq-modal-label">
                  Time Text
                  <input
                    className="faq-modal-input"
                    value={timeText}
                    onChange={(e) => setTimeText(e.target.value)}
                    placeholder="e.g. 12s ago"
                  />
                </label>
              </div>

              <div className="faq-modal-actions">
                <button
                  className="faq-btn-secondary"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button className="faq-btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
