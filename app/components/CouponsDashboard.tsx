"use client";
import { useState, useEffect } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTicket,
  faPercent,
  faDollarSign,
  faTrash,
  faTimes,
  faCheck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  currency: string;
  status: "ACTIVE" | "DISABLED" | "EXPIRED";
  startsAt: string | null;
  expiresAt: string | null;
  maxRedemptions: number | null;
  maxRedemptionsPerUser: number | null;
  minOrderAmount: number | null;
  createdAt: string;
  _count?: {
    redemptions: number;
  };
};

export default function CouponsDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENT" as "PERCENT" | "FIXED",
    value: "",
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
    startsAt: "",
    expiresAt: "",
    maxRedemptions: "",
    maxRedemptionsPerUser: "",
    minOrderAmount: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);

    try {
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : null,
        maxRedemptionsPerUser: formData.maxRedemptionsPerUser ? parseInt(formData.maxRedemptionsPerUser) : null,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        startsAt: formData.startsAt || null,
        expiresAt: formData.expiresAt || null,
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create coupon");
      }

      setShowAddModal(false);
      setFormData({
        code: "",
        type: "PERCENT",
        value: "",
        status: "ACTIVE",
        startsAt: "",
        expiresAt: "",
        maxRedemptions: "",
        maxRedemptionsPerUser: "",
        minOrderAmount: "",
      });
      fetchCoupons();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete coupon");
      
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    try {
      // Optimistic update
      setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, status: newStatus } : c));

      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...coupon, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      fetchCoupons(); // Revert on error
    }
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="coupons" />

        <main className="admin-main">
          <AdminToolbar title="Coupons" />
          <div className="admin-content">
            <div className="users-hero">
              <div className="users-hero-left">
                <h2>Coupons</h2>
                <p>Manage discount codes and promotions.</p>
              </div>
            </div>

            <div className="users-card">
              <div className="users-card-top">
                <div className="admin-search-pill" style={{ visibility: 'hidden' }}>
                  {/* Placeholder for search alignment */}
                  <FontAwesomeIcon icon={faSearch} />
                  <input placeholder="Search..." />
                </div>
                <button className="users-add-btn" onClick={() => setShowAddModal(true)}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Create Coupon</span>
                </button>
              </div>

              {loading && <div className="p-8 text-center">Loading coupons...</div>}
              {error && <div className="p-8 text-center text-red-500">{error}</div>}

              {!loading && !error && (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Status</th>
                      <th>Usage</th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td>
                          <div className="font-bold">{coupon.code}</div>
                          <div className="text-xs text-gray-500">
                            Min: {coupon.minOrderAmount ? `$${coupon.minOrderAmount}` : "None"}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon 
                              icon={coupon.type === "PERCENT" ? faPercent : faDollarSign} 
                              className="text-gray-400"
                            />
                            <span>
                              {coupon.value}
                              {coupon.type === "PERCENT" ? "%" : " USD"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <button 
                            className={`status-badge ${coupon.status.toLowerCase()}`}
                            onClick={() => handleToggleStatus(coupon)}
                            style={{ 
                              background: coupon.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                              color: coupon.status === "ACTIVE" ? "#166534" : "#991b1b",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                          >
                            {coupon.status}
                          </button>
                        </td>
                        <td>
                          <div className="text-sm">
                            {coupon._count?.redemptions || 0} used
                            {coupon.maxRedemptions && ` / ${coupon.maxRedemptions}`}
                          </div>
                        </td>
                        <td>
                          {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                        </td>
                        <td>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-8 text-gray-500">
                          No coupons found. Create one to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="edit-user-modal-overlay">
          <div className="edit-user-modal" style={{ maxWidth: "500px" }}>
            <div className="edit-user-modal-header">
              <h2>Create New Coupon</h2>
              <button className="edit-user-modal-close" onClick={() => setShowAddModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon}>
              <div className="edit-user-modal-body">
                {actionError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                    {actionError}
                  </div>
                )}

                <div className="form-group mb-4">
                  <label className="block text-sm font-medium mb-1">Coupon Code</label>
                  <input
                    required
                    type="text"
                    className="form-input w-full p-2 border rounded"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      className="form-input w-full p-2 border rounded"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="PERCENT">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-1">Value</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="form-input w-full p-2 border rounded"
                      value={formData.value}
                      onChange={e => setFormData({...formData, value: e.target.value})}
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-1">Max Redemptions</label>
                    <input
                      type="number"
                      className="form-input w-full p-2 border rounded"
                      value={formData.maxRedemptions}
                      onChange={e => setFormData({...formData, maxRedemptions: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-1">Min Order ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input w-full p-2 border rounded"
                      value={formData.minOrderAmount}
                      onChange={e => setFormData({...formData, minOrderAmount: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="block text-sm font-medium mb-1">Expires At</label>
                  <input
                    type="date"
                    className="form-input w-full p-2 border rounded"
                    value={formData.expiresAt}
                    onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                  />
                </div>
              </div>

              <div className="edit-user-modal-footer flex justify-end gap-2 p-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
