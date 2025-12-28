"use client";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faPlus,
  faEdit,
  faTrash,
  faUser,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
};

export default function TeamDashboard() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/team");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      } else {
        setError("Failed to fetch team members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setError("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setDescription("");
    setAvatarUrl("");
    setTwitterUrl("");
    setLinkedinUrl("");
    setDisplayOrder(members.length + 1);
    setIsActive(true);
    setEditingId(null);
    setError(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setDescription(member.description);
    setAvatarUrl(member.avatarUrl || "");
    setTwitterUrl(member.twitterUrl || "");
    setLinkedinUrl(member.linkedinUrl || "");
    setDisplayOrder(member.displayOrder);
    setIsActive(member.isActive);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !role.trim() || !description.trim()) {
      setError("Name, Role, and Description are required");
      return;
    }

    const memberData = {
      name: name.trim(),
      role: role.trim(),
      description: description.trim(),
      avatarUrl: avatarUrl.trim() || null,
      twitterUrl: twitterUrl.trim() || null,
      linkedinUrl: linkedinUrl.trim() || null,
      displayOrder,
      isActive,
    };

    try {
      const url = editingId ? `/api/cms/team/${editingId}` : "/api/cms/team";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      });

      if (res.ok) {
        await fetchMembers();
        setShowModal(false);
        resetForm();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save member");
      }
    } catch (error) {
      console.error("Error saving member:", error);
      setError("An error occurred while saving");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(`/api/cms/team/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchMembers();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      setError("An error occurred while deleting");
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/cms/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...member, isActive: !member.isActive }),
      });

      if (res.ok) {
        await fetchMembers();
      } else {
        setError("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("An error occurred while updating status");
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="team" />
        <main className="admin-main">
          {/* Top Toolbar */}
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Team Management</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      placeholder="Search members..."
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
            {/* Hero Section - Reusing testimonials classes for consistent look */}
            <div className="testimonials-hero">
              <div className="testimonials-hero-left">
                <h1>Our Team</h1>
                <p>Manage your team members, add new talent, or update existing profiles.</p>
              </div>
              <div className="testimonials-hero-right">
                <button className="testimonials-add-btn" onClick={openAdd}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Team Member</span>
                </button>
              </div>
            </div>

            {error && <div className="admin-error-banner" style={{ marginBottom: "20px", padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>{error}</div>}

            {/* Members Table */}
            <div className="testimonials-table-wrapper">
              <table className="testimonials-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role & Description</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                        Loading...
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                        No team members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="testimonials-author-cell">
                          <div className="testimonials-author-content">
                            {member.avatarUrl ? (
                              <img 
                                src={member.avatarUrl} 
                                alt={member.name} 
                                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              <div className="testimonials-avatar">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="testimonials-author-name">{member.name}</span>
                          </div>
                        </td>
                        <td className="testimonials-text-cell">
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>{member.role}</span>
                            <p className="testimonials-text" style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                              {member.description.length > 60 
                                ? member.description.substring(0, 60) + "..." 
                                : member.description}
                            </p>
                          </div>
                        </td>
                        <td className="testimonials-rating-cell">
                          <span className="testimonials-rating-value">
                            {member.displayOrder}
                          </span>
                        </td>
                        <td className="testimonials-status-cell">
                          <span
                            className={`testimonials-status-badge ${
                              member.isActive ? "status-approved" : "status-pending"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="testimonials-actions-cell">
                          <button
                            className="testimonials-edit-btn"
                            onClick={() => toggleStatus(member)}
                            title={member.isActive ? "Deactivate" : "Activate"}
                          >
                            <FontAwesomeIcon icon={member.isActive ? faTimes : faCheck} />
                          </button>
                          <button
                            className="testimonials-edit-btn"
                            onClick={() => openEdit(member)}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="testimonials-delete-btn"
                            onClick={() => handleDelete(member.id)}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay modal-overlay-testimonial">
          <div className="modal">
            <div className="modal-header">
              <h3 className="title-testimonial">{editingId ? "Edit Team Member" : "Add Team Member"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{error}</div>}
              
              <div className="add-service-form-group">
                <label>Name *</label>
                <input
                  className="add-service-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="add-service-form-group">
                <label>Role *</label>
                <input
                  className="add-service-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. CEO & Founder"
                />
              </div>

              <div className="add-service-form-group">
                <label>Description *</label>
                <textarea
                  className="add-service-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short bio..."
                  rows={3}
                />
              </div>

              <div className="add-service-form-group">
                <label>Avatar URL</label>
                <input
                  className="add-service-input"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="add-service-two-columns">
                <div className="add-service-form-group">
                  <label>Twitter URL</label>
                  <input
                    className="add-service-input"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="add-service-form-group">
                  <label>LinkedIn URL</label>
                  <input
                    className="add-service-input"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>

              <div className="add-service-two-columns">
                <div className="add-service-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    className="add-service-input"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="add-service-form-group">
                  <label>Status</label>
                  <select
                    className="add-service-input"
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="add-service-btn cancel" onClick={() => setShowModal(false)} style={{ marginRight: "10px", background: "#f3f4f6", color: "#4b5563" }}>
                Cancel
              </button>
              <button className="add-service-btn save" onClick={handleSave}>
                {editingId ? "Update Member" : "Create Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
