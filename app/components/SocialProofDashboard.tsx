"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { useMemo, useState } from "react";

type Platform = "Instagram" | "YouTube" | "TikTok";

type SocialProofActivity = {
  id: number;
  platform: Platform;
  username: string;
  service: string;
  timeText: string;
};

const platformIconMap: Record<Platform, any> = {
  Instagram: faInstagram,
  YouTube: faYoutube,
  TikTok: faTiktok,
};

const initialActivities: SocialProofActivity[] = [
  { id: 1, platform: "Instagram", username: "@stylebyjess", service: "1,000 Premium Likes", timeText: "12s ago" },
  { id: 2, platform: "YouTube", username: "@dancemoves", service: "5,000 Views", timeText: "28s ago" },
  { id: 3, platform: "YouTube", username: "@gamerpro", service: "500 Subscribers", timeText: "45s ago" },
  { id: 4, platform: "Instagram", username: "@fitfoodie", service: "5,000 Followers", timeText: "1m ago" },
  { id: 5, platform: "Instagram", username: "@travelvlogs", service: "10,000 Likes", timeText: "2m ago" },
  { id: 6, platform: "Instagram", username: "@techreviews", service: "10,000 Views", timeText: "3m ago" },
];

export default function SocialProofDashboard() {
  const [activities, setActivities] = useState<SocialProofActivity[]>(initialActivities);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [username, setUsername] = useState("");
  const [service, setService] = useState("");
  const [timeText, setTimeText] = useState("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const resetForm = () => {
    setPlatform("Instagram");
    setUsername("");
    setService("");
    setTimeText("");
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
    setShowModal(true);
  };

  const handleSave = () => {
    if (!username.trim() || !service.trim() || !timeText.trim()) return;

    if (editingId !== null) {
      setActivities((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                platform,
                username: username.trim(),
                service: service.trim(),
                timeText: timeText.trim(),
              }
            : item
        )
      );
    } else {
      const next: SocialProofActivity = {
        id: Date.now(),
        platform,
        username: username.trim(),
        service: service.trim(),
        timeText: timeText.trim(),
      };
      setActivities((prev) => [...prev, next]);
    }

    resetForm();
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this activity?")) return;
    setActivities((prev) => prev.filter((item) => item.id !== id));
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
              <table className="social-proof-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Username</th>
                    <th>Service Purchased</th>
                    <th>Time Text</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((item) => (
                    <tr key={item.id}>
                      <td className="platform-cell">
                        <span className={`platform-pill platform-${item.platform.toLowerCase()}`}>
                          <FontAwesomeIcon icon={platformIconMap[item.platform]} />
                        </span>
                      </td>
                      <td className="username-cell">{item.username}</td>
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
                  ))}
                </tbody>
              </table>
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
              <label className="faq-modal-label">
                Service Purchased
                <input
                  className="faq-modal-input"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g., 1,000 Premium Likes"
                />
              </label>
              <label className="faq-modal-label">
                Time Ago Text
                <input
                  className="faq-modal-input"
                  value={timeText}
                  onChange={(e) => setTimeText(e.target.value)}
                  placeholder="e.g., 12s ago"
                />
              </label>
            </div>
            <div className="faq-modal-footer">
              <button
                className="faq-modal-cancel"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button className="faq-modal-save" onClick={handleSave} disabled={!username.trim() || !service.trim() || !timeText.trim()}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

