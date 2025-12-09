"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type BannerMessage = { id: number; text: string };
type BellNotification = {
  id: number;
  title: string;
  description: string;
  icon: string;
  priority: "Low" | "Medium" | "High";
  category: string;
  iconBg?: string;
};

const initialBannerMessages: BannerMessage[] = [
  { id: 1, text: "FLASH SALE: Get 30% off all Instagram Followers packages for the next 24 hours." },
  { id: 2, text: "Go viral! Buy TikTok Likes and get a FREE views boost on us." },
  { id: 3, text: "Limited Time: Double your YouTube Views on select packages today only." },
];

const initialBellNotifications: BellNotification[] = [
  { id: 1, title: "Order #1234 Complete", description: "Your order of 1,000 Likes has been delivered.", icon: "CheckCircleIcon", priority: "Medium", category: "Inbox", iconBg: "bg-green-100 text-green-600" },
  { id: 2, title: "Flash Sale!", description: "Get 30% off TikTok likes for the next 24 hours.", icon: "FireIcon", priority: "High", category: "Inbox", iconBg: "bg-red-100 text-red-600" },
  { id: 3, title: "New Team Member", description: "Sophia Rodriguez has joined the support team.", icon: "UserIcon", priority: "Low", category: "Team", iconBg: "bg-blue-100 text-blue-600" },
  { id: 4, title: "New Blog Post for Review", description: "The 2024 algorithm article is ready for your feedback.", icon: "BookOpenIcon", priority: "Medium", category: "Inbox", iconBg: "bg-amber-100 text-amber-600" },
  { id: 5, title: "You got a new review!", description: "A customer left a 5-star review.", icon: "StarIcon", priority: "Low", category: "Inbox", iconBg: "bg-sky-100 text-sky-600" },
];

export default function NotificationsDashboard() {
  const [inboxCount, setInboxCount] = useState(7);
  const [teamCount, setTeamCount] = useState(9);
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [durationHours, setDurationHours] = useState(24);
  const [bannerMessages, setBannerMessages] = useState<BannerMessage[]>(initialBannerMessages);

  const [bellNotifications, setBellNotifications] = useState<BellNotification[]>(initialBellNotifications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nTitle, setNTitle] = useState("");
  const [nDescription, setNDescription] = useState("");
  const [nCategory, setNCategory] = useState("Inbox");
  const [nPriority, setNPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [nIcon, setNIcon] = useState("BellIcon");
  const [nIconBg, setNIconBg] = useState("");

  const addBannerMessage = () => {
    setBannerMessages((prev) => [...prev, { id: Date.now(), text: "New promotion!" }]);
  };

  const updateBannerMessage = (id: number, text: string) => {
    setBannerMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));
  };

  const removeBannerMessage = (id: number) => {
    setBannerMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addBellNotification = () => {
    setShowAddModal(true);
  };

  const removeBellNotification = (id: number) => {
    setBellNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const resetNotificationForm = () => {
    setNTitle("");
    setNDescription("");
    setNCategory("Inbox");
    setNPriority("Medium");
    setNIcon("BellIcon");
    setNIconBg("");
    setEditingId(null);
  };

  const handleSaveNotification = () => {
    if (!nTitle.trim() || !nDescription.trim()) return;
    if (editingId !== null) {
      setBellNotifications((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                title: nTitle.trim(),
                description: nDescription.trim(),
                icon: nIcon.trim() || "BellIcon",
                priority: nPriority,
                category: nCategory.trim() || "Inbox",
                iconBg: nIconBg.trim(),
              }
            : n
        )
      );
    } else {
      const next: BellNotification = {
        id: Date.now(),
        title: nTitle.trim(),
        description: nDescription.trim(),
        icon: nIcon.trim() || "BellIcon",
        priority: nPriority,
        category: nCategory.trim() || "Inbox",
        iconBg: nIconBg.trim(),
      };
      setBellNotifications((prev) => [...prev, next]);
    }
    resetNotificationForm();
    setShowAddModal(false);
  };

  const handleStartEditNotification = (n: BellNotification) => {
    setEditingId(n.id);
    setNTitle(n.title);
    setNDescription(n.description);
    setNCategory(n.category || "Inbox");
    setNPriority(n.priority);
    setNIcon(n.icon || "BellIcon");
    setNIconBg(n.iconBg || "");
    setShowAddModal(true);
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="notifications" />

        <main className="admin-main">
          <AdminToolbar title="Notifications" />

          <div className="notif-intro">
            <h1>Notifications & Banners</h1>
            <p>Manage sitewide promotional banners and user bell notifications.</p>
          </div>

          <div className="notif-section-card">
            <div className="notif-section-header">
              <h3>Header Notification Counts</h3>
            </div>
            <div className="notif-header-card">
              <div className="notif-card">
                <div className="notif-card-title">Inbox Count</div>
                <input
                  type="number"
                  className="notif-input"
                  value={inboxCount}
                  onChange={(e) => setInboxCount(Number(e.target.value))}
                />
              </div>
              <div className="notif-card">
                <div className="notif-card-title">Team Count</div>
                <input
                  type="number"
                  className="notif-input"
                  value={teamCount}
                  onChange={(e) => setTeamCount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="notif-section-card">
            <div className="notif-section-header">
              <h3>Promotional Banner</h3>
            </div>
            <div className="notif-toggle-row">
              <label className="notif-toggle-label">
                Enable Banner
                <input
                  type="checkbox"
                  checked={bannerEnabled}
                  onChange={(e) => setBannerEnabled(e.target.checked)}
                />
                <span className={`notif-toggle ${bannerEnabled ? "on" : ""}`} />
              </label>
            </div>

            <div className="notif-field">
              <label>Countdown Duration (in hours)</label>
              <input
                type="number"
                className="notif-input notif-size"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
              />
            </div>

            <div className="notif-field">
              <label>Banner Messages (will rotate)</label>
              <div className="notif-banner-list">
                {bannerMessages.map((msg) => (
                  <div key={msg.id} className="notif-banner-pill">
                    <span>🔥</span>
                    <input
                      className="notif-banner-input notif-size"
                      value={msg.text}
                      onChange={(e) => updateBannerMessage(msg.id, e.target.value)}
                      placeholder="New promotion!"
                    />
                    <button className="notif-pill-close" onClick={() => removeBannerMessage(msg.id)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="notif-add-link" onClick={addBannerMessage}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Message</span>
              </button>
            </div>
          </div>

          <div className="notif-section-card">
            <div className="notif-section-header">
              <h3>Bell Icon Notifications</h3>
              <button className="notif-add-btn" onClick={addBellNotification}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Notification</span>
              </button>
            </div>

            <div className="notif-table-wrapper">
              <table className="notif-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Icon</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bellNotifications.map((n) => (
                    <tr key={n.id}>
                      <td>{n.title}</td>
                      <td>{n.description}</td>
                      <td>{n.icon}</td>
                    <td>
                      <span className={`notif-pill priority-${n.priority.toLowerCase()}`}>{n.priority}</span>
                    </td>
                    <td className="team-actions">
                      <button className="team-edit" onClick={() => handleStartEditNotification(n)}>
                        Edit
                      </button>
                      <button className="team-delete" onClick={() => removeBellNotification(n.id)}>
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

      {showAddModal && (
        <div className="faq-modal-backdrop">
          <div className="faq-modal">
            <div className="faq-modal-header">
              <h3>{editingId !== null ? "Edit Notification" : "Add Notification"}</h3>
              <button
                className="faq-modal-close"
                onClick={() => {
                  resetNotificationForm();
                  setShowAddModal(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="faq-modal-body">
              <label className="faq-modal-label">
                Title
                <input
                  className="faq-modal-input"
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  placeholder="Notification title"
                />
              </label>
              <label className="faq-modal-label">
                Description
                <textarea
                  className="faq-modal-textarea"
                  value={nDescription}
                  onChange={(e) => setNDescription(e.target.value)}
                  placeholder="Notification description"
                  rows={4}
                />
              </label>

              <div className="modal-row two-col">
                <label className="faq-modal-label">
                  Category
                  <select
                    className="faq-modal-input"
                    value={nCategory}
                    onChange={(e) => setNCategory(e.target.value)}
                  >
                    <option>Inbox</option>
                    <option>Team</option>
                    <option>System</option>
                  </select>
                </label>
                <label className="faq-modal-label">
                  Priority
                  <select
                    className="faq-modal-input"
                    value={nPriority}
                    onChange={(e) => setNPriority(e.target.value as "Low" | "Medium" | "High")}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="modal-row two-col">
                <label className="faq-modal-label">
                  Icon
                  <select
                    className="faq-modal-input"
                    value={nIcon}
                    onChange={(e) => setNIcon(e.target.value)}
                  >
                    <option>BellIcon</option>
                    <option>CheckCircleIcon</option>
                    <option>FireIcon</option>
                    <option>UserIcon</option>
                    <option>BookOpenIcon</option>
                    <option>StarIcon</option>
                  </select>
                </label>
                <label className="faq-modal-label">
                  Icon Color BG
                  <input
                    className="faq-modal-input"
                    value={nIconBg}
                    onChange={(e) => setNIconBg(e.target.value)}
                    placeholder="e.g., bg-blue-100 text-blue-600"
                  />
                </label>
              </div>
            </div>
            <div className="faq-modal-footer">
              <button
                className="faq-modal-cancel"
                onClick={() => {
                  resetNotificationForm();
                  setShowAddModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="faq-modal-save"
                onClick={handleSaveNotification}
                disabled={!nTitle.trim() || !nDescription.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

