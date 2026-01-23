"use client";
import { useEffect, useState } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faFilter,
  faSort,
  faStar,
  faEdit,
  faTrash,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

type DbTestimonial = {
  id: string;
  handle: string;
  role?: string | null;
  text: string;
  rating?: number | null;
  platform?: string | null;
  serviceType?: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  displayOrder: number;
};

const SERVICE_OPTIONS = [
  { label: "General (All Pages)", value: "" },
  { label: "Instagram (General)", value: "INSTAGRAM" },
  { label: "Instagram Likes", value: "INSTAGRAM-LIKES" },
  { label: "Instagram Followers", value: "INSTAGRAM-FOLLOWERS" },
  { label: "Instagram Views", value: "INSTAGRAM-VIEWS" },
  { label: "Free Instagram Likes", value: "FREE_INSTAGRAM-LIKES" },
  { label: "Free Instagram Followers", value: "FREE_INSTAGRAM-FOLLOWERS" },
  { label: "TikTok (General)", value: "TIKTOK" },
  { label: "TikTok Likes", value: "TIKTOK-LIKES" },
  { label: "TikTok Followers", value: "TIKTOK-FOLLOWERS" },
  { label: "TikTok Views", value: "TIKTOK-VIEWS" },
  { label: "YouTube (General)", value: "YOUTUBE" },
  { label: "YouTube Views", value: "YOUTUBE-VIEWS" },
  { label: "YouTube Subscribers", value: "YOUTUBE-SUBSCRIBERS" },
  { label: "Reviews Page", value: "REVIEWS" },
];

export default function TestimonialsDashboard() {
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Partial<DbTestimonial>>({
    handle: "",
    role: "",
    text: "",
    rating: 5,
    platform: null,
    serviceType: null,
    isApproved: true,
    isFeatured: false,
    displayOrder: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch testimonials");
      const list: DbTestimonial[] = data.testimonials || [];
      setTestimonials(list);
    } catch (e: any) {
      setError(e.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTestimonials();
  }, []);
  const openAdd = () => {
    setFormData({
      handle: "",
      role: "",
      text: "",
      rating: 5,
      platform: null,
      serviceType: null,
      isApproved: true,
      isFeatured: false,
      displayOrder: testimonials.length,
    });
    setEditingId(null);
    setShowAddModal(true);
  };
  const openEdit = (t: DbTestimonial) => {
    setFormData({
      handle: t.handle,
      role: t.role || "",
      text: t.text,
      rating: t.rating || 5,
      platform: t.platform || null,
      serviceType: t.serviceType || null,
      isApproved: t.isApproved,
      isFeatured: t.isFeatured,
      displayOrder: t.displayOrder,
    });
    setEditingId(t.id);
    setShowEditModal(true);
  };
  const submitAdd = async () => {
    try {
      const res = await fetch("/api/cms/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create testimonial");
      setShowAddModal(false);
      setSuccess("Testimonial added");
      setTimeout(() => setSuccess(null), 1500);
      fetchTestimonials();
    } catch (e: any) {
      setError(e.message || "Failed to create testimonial");
    }
  };
  const submitEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch("/api/cms/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update testimonial");
      setShowEditModal(false);
      setEditingId(null);
      fetchTestimonials();
    } catch (e: any) {
      setError(e.message || "Failed to update testimonial");
    }
  };
  const toggleApprove = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/cms/testimonials/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update approve status");
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, isApproved: approve } : t)));
    } catch (e: any) {
      setError(e.message || "Failed to update approve status");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/cms/testimonials?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete testimonial");
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete testimonial");
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    (t.handle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.text || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="testimonials" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Published Testimonials</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">🔍</span>
                    <input
                      placeholder="Search..."
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="admin-icon-btn" aria-label="Notifications">
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                  <div className="admin-user-chip">
                    <div className="chip-avatar">AU</div>
                    <div className="chip-meta">
                      <span className="chip-name">Admin User</span>
                      <span className="chip-role">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-content">
            <div className="testimonials-hero">
              <div className="testimonials-hero-left">
                <h1>Testimonial Management</h1>
                <p>Manage your testimonials, approve or delete them, or add new ones.</p>
              </div>
              <div className="testimonials-hero-right">
                <button className="testimonials-add-btn" onClick={openAdd}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Testimonial</span>
                </button>
              </div>
            </div>
            {error && <div className="admin-error-banner">{error}</div>}
            {success && <div className="admin-success-banner">{success}</div>}

            <div className="testimonials-table-wrapper">
            <table className="testimonials-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Testimonial</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td className="testimonials-author-cell">
                      <div className="testimonials-author-content">
                        <div className="testimonials-avatar">
                          {(testimonial.handle || "").charAt(0).toUpperCase()}
                        </div>
                        <span className="testimonials-author-name">{testimonial.handle}</span>
                      </div>
                    </td>
                    <td className="testimonials-text-cell">
                      <p className="testimonials-text">{testimonial.text}</p>
                    </td>
                    <td className="testimonials-rating-cell">
                      <span className="testimonials-rating-value">
                        {((testimonial.rating || 0) % 1 === 0 ? (testimonial.rating || 0).toFixed(0) : (testimonial.rating || 0).toFixed(1))}/5
                      </span>
                    </td>
                    <td className="testimonials-status-cell">
                      <span
                        className={`testimonials-status-badge ${
                          testimonial.isApproved ? "status-approved" : "status-pending"
                        }`}
                      >
                        {testimonial.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="testimonials-actions-cell">
                      <button
                        className="testimonials-edit-btn"
                        onClick={() => toggleApprove(testimonial.id, !testimonial.isApproved)}
                      >
                        {testimonial.isApproved ? "Unapprove" : "Approve"}
                      </button>
                      <button
                        className="testimonials-edit-btn"
                        onClick={() => openEdit(testimonial)}
                      >
                        Edit
                      </button>
                      <button
                        className="testimonials-delete-btn"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTestimonials.length === 0 && (
              <div className="no-testimonials-message">No testimonials found.</div>
            )}
            </div>
            {showAddModal && (
              <div className="modal-overlay modal-overlay-testimonial">
                <div className="modal">
                  <div className="modal-header">
                    <h3 className="title-testimonial">Add Testimonial</h3>
                    <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="add-service-form-group">
                      <label>Name/Handle</label>
                      <input className="add-service-input" required value={formData.handle as string} onChange={(e) => setFormData({ ...formData, handle: e.target.value })} />
                    </div>
                    <div className="add-service-form-group">
                      <label>Role</label>
                      <input className="add-service-input" value={(formData.role as string) || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                    </div>
                    <div className="add-service-form-group">
                      <label>Service Page</label>
                      <select 
                        className="add-service-input" 
                        value={formData.platform && formData.serviceType ? `${formData.platform}-${formData.serviceType}` : formData.platform || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) {
                            setFormData({ ...formData, platform: null, serviceType: null });
                          } else if (val.includes("-")) {
                            const [p, s] = val.split("-");
                            setFormData({ ...formData, platform: p, serviceType: s });
                          } else {
                            setFormData({ ...formData, platform: val, serviceType: null });
                          }
                        }}
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="add-service-form-group">
                      <label>Testimonial</label>
                      <textarea className="add-service-textarea" rows={4} required value={formData.text as string} onChange={(e) => setFormData({ ...formData, text: e.target.value })} />
                    </div>
                    <div className="add-service-two-columns">
                      <div className="add-service-form-group">
                        <label>Rating</label>
                        <input type="number" step="0.5" className="add-service-input" value={Number(formData.rating)} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
                      </div>
                      <div className="add-service-form-group">
                        <label>Approved</label>
                        <select className="add-service-input" value={formData.isApproved ? "true" : "false"} onChange={(e) => setFormData({ ...formData, isApproved: e.target.value === "true" })}>
                          <option value="true">Approved</option>
                          <option value="false">Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="add-service-btn save" onClick={submitAdd}>Save</button>
                  </div>
                </div>
              </div>
            )}
            {showEditModal && (
              <div className="modal-overlay modal-overlay-testimonial">
                <div className="modal">
                  <div className="modal-header">
                    <h3 className="title-testimonial">Edit Testimonial</h3>
                    <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="add-service-form-group">
                      <label>Name/Handle</label>
                      <input className="add-service-input" value={formData.handle as string} onChange={(e) => setFormData({ ...formData, handle: e.target.value })} />
                    </div>
                    <div className="add-service-form-group">
                      <label>Role</label>
                      <input className="add-service-input" value={(formData.role as string) || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                    </div>
                    <div className="add-service-form-group">
                      <label>Service Page</label>
                      <select 
                        className="add-service-input" 
                        value={formData.platform && formData.serviceType ? `${formData.platform}-${formData.serviceType}` : formData.platform || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) {
                            setFormData({ ...formData, platform: null, serviceType: null });
                          } else if (val.includes("-")) {
                            const [p, s] = val.split("-");
                            setFormData({ ...formData, platform: p, serviceType: s });
                          } else {
                            setFormData({ ...formData, platform: val, serviceType: null });
                          }
                        }}
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="add-service-form-group">
                      <label>Testimonial</label>
                      <textarea className="add-service-textarea" rows={4} value={formData.text as string} onChange={(e) => setFormData({ ...formData, text: e.target.value })} />
                    </div>
                    <div className="add-service-two-columns">
                      <div className="add-service-form-group">
                        <label>Rating</label>
                        <input type="number" step="0.5" className="add-service-input" value={Number(formData.rating)} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
                      </div>
                      <div className="add-service-form-group">
                        <label>Approved</label>
                        <select className="add-service-input" value={formData.isApproved ? "true" : "false"} onChange={(e) => setFormData({ ...formData, isApproved: e.target.value === "true" })}>
                          <option value="true">Approved</option>
                          <option value="false">Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="add-service-btn save" onClick={submitEdit}>Save Changes</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
