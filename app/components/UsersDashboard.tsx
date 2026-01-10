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
  faMoneyBillWave,
  faSackDollar,
  faBell,
  faTimes,
  faWallet,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

type UserRow = {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  wallet: string;
  status: "active" | "inactive";
};

const paymentIcon = faMoneyBillWave;

export default function UsersDashboard() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<Set<string>>(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", status: false });
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundsAmount, setFundsAmount] = useState("0.01");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", status: true });

  // Fetch users from API
  const fetchUsers = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });
      
      if (search) {
        params.append("search", search);
      }
      
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch users (${response.status})`;
        
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in as an admin to view users.");
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (!data.users) {
        throw new Error("Invalid response format from server");
      }
      
      setUsers(data.users);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.total || 0);
      setCurrentPage(page);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load users. Please check your connection and try again.";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search - reset to page 1 when search changes
  useEffect(() => {
    if (searchQuery === "") return; // Don't search on initial mount
    
    const timer = setTimeout(() => {
      fetchUsers(1, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (user: UserRow) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status === "active",
    });
    setShowEditModal(true);
  };

  const handleAddFundsClick = (user: UserRow) => {
    setSelectedUser(user);
    setFundsAmount("0.01");
    setShowAddFundsModal(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setActionError(null);

      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          status: editForm.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update user (${response.status})`);
      }

      // Success - refresh the list and close modal
      setShowEditModal(false);
      setSelectedUser(null);
      setActionError(null);
      await fetchUsers(currentPage, searchQuery);
    } catch (err: any) {
      setActionError(err.message || "Failed to update user");
      console.error("Error updating user:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      setActionError(null);

      const response = await fetch(`/api/admin/users/${selectedUser.id}/funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: fundsAmount,
          type: 'CREDIT',
          note: 'Admin added funds'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add funds (${response.status})`);
      }

      // Success - refresh the list and close modal
      setShowAddFundsModal(false);
      setSelectedUser(null);
      setActionError(null);
      await fetchUsers(currentPage, searchQuery);
      
      // Optional: Show success toast/alert
      // alert("Funds added successfully");
    } catch (err: any) {
      setActionError(err.message || "Failed to add funds");
      console.error("Error adding funds:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setShowAddFundsModal(false);
    setSelectedUser(null);
    setActionError(null);
  };

  const incrementAmount = () => {
    const current = parseFloat(fundsAmount) || 0;
    setFundsAmount((current + 0.01).toFixed(2));
  };

  const decrementAmount = () => {
    const current = parseFloat(fundsAmount) || 0;
    if (current > 0.01) {
      setFundsAmount((current - 0.01).toFixed(2));
    }
  };

  const handleDeleteClick = (user: UserRow) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setActionError(null);

      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete user (${response.status})`);
      }

      // Success - refresh the list and close modal
      setShowDeleteModal(false);
      setSelectedUser(null);
      setActionError(null);
      await fetchUsers(currentPage, searchQuery);
    } catch (err: any) {
      setActionError(err.message || "Failed to delete user");
      console.error("Error deleting user:", err);
      // Keep modal open on error so user can see the error message
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
    setActionError(null);
  };

  const handleAddUserClick = () => {
    setNewUserForm({ name: "", email: "", status: true });
    setShowAddUserModal(true);
  };

  const handleSaveNewUser = async () => {
    if (newUserForm.name && newUserForm.email) {
      // TODO: Implement API call to create user
      // For now, just refresh the list
      setShowAddUserModal(false);
      setNewUserForm({ name: "", email: "", status: true });
      fetchUsers(currentPage, searchQuery);
    }
  };

  const handleCancelAddUser = () => {
    setShowAddUserModal(false);
    setNewUserForm({ name: "", email: "", status: true });
  };

  const handleStatusToggle = async (user: UserRow, newStatus: boolean) => {
    // Optimistically update UI
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: newStatus ? "active" : "inactive" }
        : u
    ));

    // Mark this user as updating
    setStatusUpdating(prev => new Set(prev).add(user.id));

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update status (${response.status})`);
      }

      // Success - status already updated optimistically
    } catch (err: any) {
      console.error("Error updating status:", err);
      // Revert the toggle on error by refreshing the list
      await fetchUsers(currentPage, searchQuery);
    } finally {
      // Remove from updating set
      setStatusUpdating(prev => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="users" />

        <main className="admin-main">
          <AdminToolbar title="Users" />
          <div className="admin-content">
            <div className="users-hero">
              <div className="users-hero-left">
                <h2>Users</h2>
                <p>Manage all registered user accounts on the platform.</p>
              </div>
            </div>

            <div className="users-card">
              <div className="users-card-top">
                <div className="admin-search-pill">
                  <FontAwesomeIcon icon={faSearch} />
                  <input 
                    placeholder="Search users..." 
                    aria-label="Search users"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <button className="users-add-btn" onClick={handleAddUserClick}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add User</span>
                </button>
              </div>
              
              {loading && (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  Loading users...
                </div>
              )}
              
              {error && (
                <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                  Error: {error}
                </div>
              )}
              
              {!loading && !error && users.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  No users found
                </div>
              )}
              
              {!loading && !error && users.length > 0 && (
                <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Orders</th>
                    <th>Wallet Balance</th>
                    <th>Status</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{user.name.charAt(0)}</div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.joined}</td>
                      <td>{user.orders}</td>
                      <td>
                        <span className="rev-payment wallet-cell">
                          <FontAwesomeIcon icon={faSackDollar} />
                          <span className="rev-pay-label">{user.wallet}</span>
                        </span>
                      </td>
                      <td>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={user.status === "active"}
                            onChange={(e) => handleStatusToggle(user, e.target.checked)}
                            disabled={statusUpdating.has(user.id) || actionLoading}
                          />
                          <span className="toggle-slider" />
                        </label>
                      </td>
                      <td className="actions-col">
                        <button className="link-btn" onClick={() => handleEditClick(user)}>Edit</button>
                        <button className="link-btn add-funds" onClick={() => handleAddFundsClick(user)}>Add Funds</button>
                        <button className="link-btn danger" onClick={() => handleDeleteClick(user)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="users-footer">
                <span className="users-footer-text">
                  Showing {users.length > 0 ? ((currentPage - 1) * 50 + 1) : 0} to {Math.min(currentPage * 50, totalUsers)} of {totalUsers} users
                </span>
                <div className="users-pagination">
                  <button 
                    className="pager-btn" 
                    disabled={currentPage === 1}
                    onClick={() => fetchUsers(currentPage - 1, searchQuery)}
                  >
                    Previous
                  </button>
                  <button 
                    className="pager-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchUsers(currentPage + 1, searchQuery)}
                  >
                    Next
                  </button>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {showEditModal && selectedUser && (
        <div className="edit-user-modal-overlay" onClick={handleCancel}>
          <div className="edit-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-user-modal-header">
              <h2>Edit User</h2>
              <button className="edit-user-modal-close" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="edit-user-modal-body">
              {actionError && (
                <div style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fee", color: "#c33", borderRadius: "4px" }}>
                  {actionError}
                </div>
              )}
              <div className="edit-user-form-group">
                <label htmlFor="edit-name">Full Name</label>
                <input
                  type="text"
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="edit-user-input"
                  disabled={actionLoading}
                />
              </div>

              <div className="edit-user-form-group">
                <label htmlFor="edit-email">Email Address</label>
                <input
                  type="email"
                  id="edit-email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="edit-user-input"
                  disabled={actionLoading}
                />
              </div>

              <div className="edit-user-form-group">
                <label htmlFor="edit-status">Status</label>
                <div className="edit-user-status-row">
                  <span>Active</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.checked })}
                      disabled={actionLoading}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="edit-user-modal-footer">
              <button 
                className="edit-user-btn cancel" 
                onClick={handleCancel}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="edit-user-btn save" 
                onClick={handleSaveChanges}
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFundsModal && selectedUser && (
        <div className="add-funds-modal-overlay" onClick={handleCancel}>
          <div className="add-funds-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-funds-modal-header">
              <div className="add-funds-header-left">
                <FontAwesomeIcon icon={faWallet} className="add-funds-icon" />
                <h2>Add Funds to Wallet</h2>
              </div>
              <button className="add-funds-modal-close" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-funds-modal-body">
              <p className="add-funds-user-info">
                For user: <strong>{selectedUser.name}</strong>
              </p>

              <div className="add-funds-balance-card">
                <div className="add-funds-balance-label">Current Balance</div>
                <div className="add-funds-balance-value">{selectedUser.wallet}</div>
              </div>

              <div className="add-funds-form-group">
                <label htmlFor="add-funds-amount">Amount to Add</label>
                <div className="add-funds-input-wrapper">
                  <input
                    type="text"
                    id="add-funds-amount"
                    value={`$ ${fundsAmount}`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      if (value) {
                        setFundsAmount(parseFloat(value).toFixed(2));
                      } else {
                        setFundsAmount("0.01");
                      }
                    }}
                    className="add-funds-input"
                  />
                  <div className="add-funds-spinner">
                    <button type="button" className="spinner-btn" onClick={incrementAmount}>
                      <FontAwesomeIcon icon={faChevronUp} />
                    </button>
                    <button type="button" className="spinner-btn" onClick={decrementAmount}>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  </div>
                  <div className="add-funds-currency">
                    <span>USD</span>
                    <FontAwesomeIcon icon={faChevronDown} className="currency-chevron" />
                  </div>
                </div>
              </div>
            </div>

            <div className="add-funds-modal-footer">
              <button className="add-funds-btn cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="add-funds-btn add" onClick={handleAddFunds}>
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <div className="delete-user-modal-overlay" onClick={handleCancelDelete}>
          <div className="delete-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-user-modal-header">
              <h2>Delete User</h2>
              <button className="delete-user-modal-close" onClick={handleCancelDelete}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="delete-user-modal-body">
              {actionError && (
                <div style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fee", color: "#c33", borderRadius: "4px" }}>
                  {actionError}
                </div>
              )}
              <p>
                Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="delete-user-modal-footer">
              <button 
                className="delete-user-btn cancel" 
                onClick={handleCancelDelete}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="delete-user-btn delete" 
                onClick={handleConfirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="add-user-modal-overlay" onClick={handleCancelAddUser}>
          <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-user-modal-header">
              <h2>Add New User</h2>
              <button className="add-user-modal-close" onClick={handleCancelAddUser}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-user-modal-body">
              <div className="add-user-form-group">
                <label htmlFor="new-user-name">Full Name</label>
                <input
                  type="text"
                  id="new-user-name"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="add-user-input"
                  placeholder="Enter full name"
                />
              </div>

              <div className="add-user-form-group">
                <label htmlFor="new-user-email">Email Address</label>
                <input
                  type="email"
                  id="new-user-email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="add-user-input"
                  placeholder="Enter email address"
                />
              </div>

              <div className="add-user-form-group">
                <label htmlFor="new-user-status">Status</label>
                <div className="add-user-status-row">
                  <span>Active</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={newUserForm.status}
                      onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="add-user-modal-footer">
              <button className="add-user-btn cancel" onClick={handleCancelAddUser}>
                Cancel
              </button>
              <button className="add-user-btn save" onClick={handleSaveNewUser}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

