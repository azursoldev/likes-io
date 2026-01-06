"use client";
import { useState, useEffect } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTimes,
  faCheck,
  faBan,
  faTag,
  faThumbsUp,
  faUserPlus,
  faArrowUp,
  faEdit,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

type Upsell = {
  id: string;
  title: string;
  description: string | null;
  basePrice: number;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  platform: string | null;
  serviceType: string | null;
  isActive: boolean;
  sortOrder: number;
  badgeText: string | null;
  badgeIcon: string | null;
  createdAt: string;
};

export default function UpsellsDashboard() {
  const [upsells, setUpsells] = useState<Upsell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: "",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    discountValue: "",
    platform: "",
    serviceType: "",
    badgeText: "",
    badgeIcon: "thumbs-up",
    sortOrder: "0",
    isActive: true
  });

  const fetchUpsells = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/upsells");
      if (!res.ok) throw new Error("Failed to fetch upsells");
      const data = await res.json();
      setUpsells(data.upsells || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpsells();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      basePrice: "",
      discountType: "PERCENT",
      discountValue: "",
      platform: "",
      serviceType: "",
      badgeText: "",
      badgeIcon: "thumbs-up",
      sortOrder: "0",
      isActive: true
    });
    setEditingId(null);
    setActionError(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (upsell: Upsell) => {
    setFormData({
      title: upsell.title,
      description: upsell.description || "",
      basePrice: upsell.basePrice.toString(),
      discountType: upsell.discountType,
      discountValue: upsell.discountValue.toString(),
      platform: upsell.platform || "",
      serviceType: upsell.serviceType || "",
      badgeText: upsell.badgeText || "",
      badgeIcon: upsell.badgeIcon || "thumbs-up",
      sortOrder: upsell.sortOrder.toString(),
      isActive: upsell.isActive
    });
    setEditingId(upsell.id);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        discountValue: parseFloat(formData.discountValue),
        platform: formData.platform || null,
        serviceType: formData.serviceType || null,
        badgeText: formData.badgeText || null,
        sortOrder: parseInt(formData.sortOrder)
      };

      const url = editingId 
        ? `/api/admin/upsells/${editingId}`
        : "/api/admin/upsells";
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save upsell");
      }

      setShowAddModal(false);
      resetForm();
      fetchUpsells();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this upsell?")) return;
    
    try {
      const res = await fetch(`/api/admin/upsells/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete upsell");
      fetchUpsells();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleStatus = async (upsell: Upsell) => {
    try {
      const res = await fetch(`/api/admin/upsells/${upsell.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...upsell,
          basePrice: upsell.basePrice.toString(),
          discountValue: upsell.discountValue.toString(),
          isActive: !upsell.isActive 
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchUpsells();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="upsells" />
        <main className="admin-main">
          <AdminToolbar title="Upsells" />
          <div className="admin-content">
            <div className="users-hero">
              <div className="users-hero-left">
                <h2>Upsells</h2>
                <p>Manage upsells and order bumps.</p>
              </div>
            </div>
            <div className="users-card">
              <div className="users-card-top">
                <div className="admin-search-pill">
                  <FontAwesomeIcon icon={faSearch} />
                  <input 
                    placeholder="Search upsells..." 
                    aria-label="Search upsells"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="users-add-btn" onClick={handleOpenAdd}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Create Upsell</span>
                </button>
              </div>

          {error && (
            <div className="p-8 text-center text-red-500">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center">Loading upsells...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Targeting</th>
                      <th>Status</th>
                      <th>Order</th>
                      <th className="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upsells
                      .filter(u => {
                        const q = searchQuery.toLowerCase();
                        return (
                          u.title.toLowerCase().includes(q) ||
                          (u.description || "").toLowerCase().includes(q) ||
                          (u.platform || "").toLowerCase().includes(q) ||
                          (u.serviceType || "").toLowerCase().includes(q)
                        );
                      })
                      .map((upsell) => (
                      <tr key={upsell.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{upsell.title}</div>
                          <div className="text-xs text-gray-500">{upsell.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">${upsell.basePrice.toFixed(2)}</div>
                          <div className="text-xs text-green-600">
                            {upsell.discountValue > 0 ? (
                              upsell.discountType === 'PERCENT' 
                                ? `-${upsell.discountValue}% OFF` 
                                : `-$${upsell.discountValue} OFF`
                            ) : 'No Discount'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {upsell.platform ? (
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                {upsell.platform}
                              </span>
                            ) : <span className="text-gray-400 text-xs">All Platforms</span>}
                            {upsell.serviceType ? (
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 w-fit">
                                {upsell.serviceType}
                              </span>
                            ) : <span className="text-gray-400 text-xs">All Services</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <label className="toggle-switch">
                            <input 
                              type="checkbox" 
                              checked={upsell.isActive}
                              onChange={() => toggleStatus(upsell)}
                              disabled={actionLoading}
                            />
                            <span className="toggle-slider" />
                          </label>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {upsell.sortOrder}
                        </td>
                        <td className="actions-col">
                          <button className="link-btn" onClick={() => handleEdit(upsell)}>Edit</button>
                          <button className="link-btn danger" onClick={() => handleDelete(upsell.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {upsells.filter(u => {
                      const q = searchQuery.toLowerCase();
                      return (
                        u.title.toLowerCase().includes(q) ||
                        (u.description || "").toLowerCase().includes(q) ||
                        (u.platform || "").toLowerCase().includes(q) ||
                        (u.serviceType || "").toLowerCase().includes(q)
                      );
                    }).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          No upsells found. Create one to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </div>
          </div>
        </main>
      </div>

      {!loading && !error && upsells.length > 0 && (
        <div className="users-footer">
          <span className="users-footer-text">
            Showing 1 to {upsells.filter(u => {
              const q = searchQuery.toLowerCase();
              return (
                u.title.toLowerCase().includes(q) ||
                (u.description || "").toLowerCase().includes(q) ||
                (u.platform || "").toLowerCase().includes(q) ||
                (u.serviceType || "").toLowerCase().includes(q)
              );
            }).length} of {upsells.length} upsells
          </span>
        </div>
      )}

      {showAddModal && (
        <div className="edit-user-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="edit-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-user-modal-header">
              <h2>{editingId ? "Edit Upsell" : "Create New Upsell"}</h2>
              <button className="edit-user-modal-close" onClick={() => setShowAddModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {actionError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {actionError}
                </div>
              )}

              <div className="edit-user-modal-body">
                <div>
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Basic Info</h4>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-title">Title</label>
                    <input
                      type="text"
                      id="edit-title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                      placeholder="e.g. 50 Likes Bonus"
                    />
                  </div>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-description">Description</label>
                    <textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                      placeholder="e.g. Add 50 extra likes for just $2"
                      rows={2}
                    />
                  </div>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-sort-order">Sort Order</label>
                    <input
                      type="number"
                      id="edit-sort-order"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Pricing</h4>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-base-price">Base Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="edit-base-price"
                      required
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                      placeholder="0.00"
                    />
                  </div>
                    <div>
                      <div className="edit-user-form-group inline">
                        <label htmlFor="edit-discount-type">Discount Type</label>
                        <select
                          id="edit-discount-type"
                          value={formData.discountType}
                          onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                          className="edit-user-input"
                          disabled={actionLoading}
                        >
                          <option value="PERCENT">Percent (%)</option>
                          <option value="FIXED">Fixed Amount ($)</option>
                        </select>
                      </div>
                      <div className="edit-user-form-group inline">
                        <label htmlFor="edit-discount-value">Discount Value</label>
                        <input
                          type="number"
                          step="0.01"
                          id="edit-discount-value"
                          value={formData.discountValue}
                          onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                          className="edit-user-input"
                          disabled={actionLoading}
                          placeholder="0"
                        />
                      </div>
                    </div>
                </div>

                {/* Targeting */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Targeting (Optional)</h4>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-platform">Platform</label>
                    <select
                      id="edit-platform"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                    >
                      <option value="">All Platforms</option>
                      <option value="YOUTUBE">YouTube</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="TIKTOK">TikTok</option>
                    </select>
                  </div>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-service-type">Service Type</label>
                    <input
                      type="text"
                      id="edit-service-type"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                      placeholder="e.g. LIKES"
                    />
                  </div>
                </div>

                {/* Display */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Display</h4>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-badge-text">Badge Text</label>
                    <input
                      type="text"
                      id="edit-badge-text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                      placeholder="e.g. BEST VALUE"
                    />
                  </div>
                    <div className="edit-user-form-group inline">
                      <label htmlFor="edit-badge-icon">Icon</label>
                    <select
                      id="edit-badge-icon"
                      value={formData.badgeIcon}
                      onChange={(e) => setFormData({ ...formData, badgeIcon: e.target.value })}
                      className="edit-user-input"
                      disabled={actionLoading}
                    >
                      <option value="thumbs-up">Thumbs Up</option>
                      <option value="user-plus">User Plus</option>
                      <option value="arrow-up">Arrow Up</option>
                      <option value="tag">Tag</option>
                    </select>
                  </div>
                </div>
                </div>
              </div>
              <div className="edit-user-modal-footer">
                <button 
                  type="button" 
                  className="edit-user-btn cancel" 
                  onClick={() => setShowAddModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="edit-user-btn save" 
                  disabled={actionLoading}
                >
                  {actionLoading ? (editingId ? "Saving..." : "Creating...") : (editingId ? "Save Changes" : "Create Upsell")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
