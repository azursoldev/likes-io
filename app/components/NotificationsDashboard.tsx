"use client";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

type BannerMessage = { id: string; text: string; icon: string };
type BellNotification = {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: "Low" | "Medium" | "High";
  category: string;
  iconBg?: string;
};

export default function NotificationsDashboard() {
  const [inboxCount, setInboxCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [durationHours, setDurationHours] = useState(24);
  const [bannerMessages, setBannerMessages] = useState<BannerMessage[]>([]);
  
  const [bellNotifications, setBellNotifications] = useState<BellNotification[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nTitle, setNTitle] = useState("");
  const [nDescription, setNDescription] = useState("");
  const [nCategory, setNCategory] = useState("Inbox");
  const [nPriority, setNPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [nIcon, setNIcon] = useState("BellIcon");
  const [nIconBg, setNIconBg] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, bannersRes, notificationsRes] = await Promise.all([
        fetch("/api/admin/settings/notifications"),
        fetch("/api/admin/banner-messages"),
        fetch("/api/admin/notifications"),
      ]);

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        setInboxCount(settings.inboxCount);
        setTeamCount(settings.teamCount);
        setBannerEnabled(settings.bannerEnabled);
        setDurationHours(settings.bannerDurationHours);
      }

      if (bannersRes.ok) {
        setBannerMessages(await bannersRes.json());
      }

      if (notificationsRes.ok) {
        setBellNotifications(await notificationsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: any) => {
    try {
      await fetch("/api/admin/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  const handleInboxCountChange = (val: number) => {
    setInboxCount(val);
    updateSettings({ inboxCount: val });
  };

  const handleTeamCountChange = (val: number) => {
    setTeamCount(val);
    updateSettings({ teamCount: val });
  };

  const handleBannerEnabledChange = (val: boolean) => {
    setBannerEnabled(val);
    updateSettings({ bannerEnabled: val });
  };

  const handleDurationChange = (val: number) => {
    setDurationHours(val);
    updateSettings({ bannerDurationHours: val });
  };

  const addBannerMessage = async () => {
    try {
      const res = await fetch("/api/admin/banner-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "New promotion!", icon: "🔥" }),
      });
      if (res.ok) {
        const newMessage = await res.json();
        setBannerMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Failed to add banner message", error);
    }
  };

  const updateBannerMessage = async (id: string, updates: Partial<BannerMessage>) => {
    // Optimistic update
    setBannerMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    
    // Find current message to merge with updates for API call
    const current = bannerMessages.find(m => m.id === id);
    if (!current) return;
    
    const merged = { ...current, ...updates };

    try {
      await fetch(`/api/admin/banner-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: merged.text, icon: merged.icon, isActive: true }),
      });
    } catch (error) {
      console.error("Failed to update banner message", error);
    }
  };

  const removeBannerMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/banner-messages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBannerMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete banner message", error);
    }
  };

  const addBellNotification = () => {
    resetNotificationForm();
    setShowAddModal(true);
  };

  const removeBellNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBellNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
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

  const handleSaveNotification = async () => {
    if (!nTitle.trim() || !nDescription.trim()) return;
    
    const payload = {
      title: nTitle.trim(),
      description: nDescription.trim(),
      icon: nIcon.trim() || "BellIcon",
      priority: nPriority,
      category: nCategory.trim() || "Inbox",
      iconBg: nIconBg.trim(),
    };

    try {
      if (editingId !== null) {
        const res = await fetch(`/api/admin/notifications/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setBellNotifications((prev) =>
            prev.map((n) => (n.id === editingId ? updated : n))
          );
        }
      } else {
        const res = await fetch("/api/admin/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setBellNotifications((prev) => [created, ...prev]);
        }
      }
      resetNotificationForm();
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to save notification", error);
    }
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

  if (loading) return <div className="p-8">Loading notifications...</div>;

  return (
    <div className="admin-wrapper">
      <PromoBar 
        previewMode={true}
        enabled={bannerEnabled}
        durationHours={durationHours}
        messages={bannerMessages.map(m => ({ text: m.text, icon: m.icon || "🔥" }))}
      />
      <div className="admin-body">
        <AdminSidebar activePage="notifications" />

        <main className="admin-main">
          <AdminToolbar title="Notifications" />
          <div className="admin-content">
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
                    onChange={(e) => handleInboxCountChange(Number(e.target.value))}
                  />
                </div>
                <div className="notif-card">
                  <div className="notif-card-title">Team Count</div>
                  <input
                    type="number"
                    className="notif-input"
                    value={teamCount}
                    onChange={(e) => handleTeamCountChange(Number(e.target.value))}
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
                    onChange={(e) => handleBannerEnabledChange(e.target.checked)}
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
                  onChange={(e) => handleDurationChange(Number(e.target.value))}
                />
              </div>

              <div className="notif-field">
                <label>Banner Messages (will rotate)</label>
                <div className="notif-banner-list">
                  {bannerMessages.map((msg) => (
                    <div key={msg.id} className="notif-banner-pill">
                      <input
                        className="notif-banner-input"
                        style={{ width: "40px", textAlign: "center", marginRight: "8px", flex: "0 0 auto" }}
                        value={msg.icon || "🔥"}
                        onChange={(e) => updateBannerMessage(msg.id, { icon: e.target.value })}
                        placeholder="🔥"
                      />
                      <input
                        className="notif-banner-input notif-size"
                        value={msg.text}
                        onChange={(e) => updateBannerMessage(msg.id, { text: e.target.value })}
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

