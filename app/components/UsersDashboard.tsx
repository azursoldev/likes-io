"use client";
import { useState } from "react";
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
  id: number;
  name: string;
  email: string;
  joined: string;
  orders: number;
  wallet: string;
  status: "active" | "inactive";
};

const initialUsers: UserRow[] = [
  { id: 1, name: "John Doe", email: "john.d@example.com", joined: "2024-08-01", orders: 5, wallet: "$25.50", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane.s@example.com", joined: "2024-07-28", orders: 2, wallet: "$10.00", status: "inactive" },
  { id: 3, name: "Mike Johnson", email: "mike.j@example.com", joined: "2024-07-15", orders: 12, wallet: "$150.75", status: "active" },
  { id: 4, name: "Emily White", email: "emily.w@example.com", joined: "2024-06-20", orders: 8, wallet: "$0.00", status: "inactive" },
  { id: 5, name: "Chris Green", email: "chris.g@example.com", joined: "2024-05-11", orders: 1, wallet: "$75.20", status: "active" },
];

const paymentIcon = faMoneyBillWave;

export default function UsersDashboard() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", status: false });
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundsAmount, setFundsAmount] = useState("0.01");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", status: true });

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

  const handleSaveChanges = () => {
    // Here you would typically update the user data
    console.log("Saving changes:", editForm);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleAddFunds = () => {
    // Here you would typically add funds to the user's wallet
    console.log("Adding funds:", fundsAmount, "to user:", selectedUser?.name);
    setShowAddFundsModal(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setShowAddFundsModal(false);
    setSelectedUser(null);
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

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleAddUserClick = () => {
    setNewUserForm({ name: "", email: "", status: true });
    setShowAddUserModal(true);
  };

  const handleSaveNewUser = () => {
    if (newUserForm.name && newUserForm.email) {
      const newUser: UserRow = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name: newUserForm.name,
        email: newUserForm.email,
        joined: new Date().toISOString().split('T')[0],
        orders: 0,
        wallet: "$0.00",
        status: newUserForm.status ? "active" : "inactive",
      };
      setUsers([...users, newUser]);
      setShowAddUserModal(false);
      setNewUserForm({ name: "", email: "", status: true });
    }
  };

  const handleCancelAddUser = () => {
    setShowAddUserModal(false);
    setNewUserForm({ name: "", email: "", status: true });
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
              <h1>Users</h1>
              <p>Manage all registered user accounts on the platform.</p>
            </div>
          </div>

          <div className="users-card">
            <div className="users-card-top">
              <div className="admin-search-pill">
                <FontAwesomeIcon icon={faSearch} />
                <input placeholder="Search users..." aria-label="Search users" />
              </div>
              <button className="users-add-btn" onClick={handleAddUserClick}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add User</span>
              </button>
            </div>
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
                        <input type="checkbox" defaultChecked={user.status === "active"} />
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
              <span className="users-footer-text">Showing 1 to 5 of 5 users</span>
              <div className="users-pagination">
                <button className="pager-btn" disabled>
                  Previous
                </button>
                <button className="pager-btn">Next</button>
              </div>
            </div>
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
              <div className="edit-user-form-group">
                <label htmlFor="edit-name">Full Name</label>
                <input
                  type="text"
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="edit-user-input"
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
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="edit-user-modal-footer">
              <button className="edit-user-btn cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="edit-user-btn save" onClick={handleSaveChanges}>
                Save Changes
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
              <p>
                Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="delete-user-modal-footer">
              <button className="delete-user-btn cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="delete-user-btn delete" onClick={handleConfirmDelete}>
                Delete User
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

