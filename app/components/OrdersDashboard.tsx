"use client";
import { useState, useEffect, useRef } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faSearch,
  faBell,
  faChevronDown,
  faDownload,
  faList,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export type OrderRow = {
  id: string;
  date: string;
  customer: string;
  email: string;
  service: string;
  serviceIcon: string;
  smmOrderId: string;
  amount: string;
  status: string;
};

const getServiceIcon = (icon: string) => {
  if (icon === "instagram") return faInstagram;
  if (icon === "tiktok") return faTiktok;
  if (icon === "youtube") return faYoutube;
  return faList;
};

import { useRouter, useSearchParams } from "next/navigation";

interface OrdersDashboardProps {
  initialOrders?: OrderRow[];
  currentPage?: number;
  totalPages?: number;
  totalOrders?: number;
  currentStatus?: string;
}

export default function OrdersDashboard({ 
  initialOrders = [], 
  currentPage = 1, 
  totalPages = 1, 
  totalOrders = 0,
  currentStatus = "All"
}: OrdersDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(currentStatus);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state with props
  useEffect(() => {
    setStatusFilter(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleStatusSelect = (status: string) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
    
    // Update URL for server-side filtering
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter change
    if (status === "All") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`?${params.toString()}`);
  };

  const handleDetailsClick = (order: OrderRow) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const getPlatformName = (icon: string) => {
    if (icon === "instagram") return "Instagram";
    if (icon === "tiktok") return "TikTok";
    if (icon === "youtube") return "YouTube";
    return "Unknown";
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // We rely on server-side filtering now, so initialOrders is already filtered
  const filteredOrders = initialOrders;

  const statusOptions = ["All", "PENDING_PAYMENT", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"];

  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalOrders);

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="orders" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Orders</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search..." aria-label="Search" />
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
          <div className="orders-hero">
            <div className="orders-hero-left">
              <h1>Orders</h1>
              <p>Monitor and manage all customer orders.</p>
            </div>
          </div>

          <div className="orders-card">
            <div className="orders-card-top">
              <div className="admin-search-pill orders-search">
                <FontAwesomeIcon icon={faSearch} />
                <input placeholder="Search by Order ID, na" aria-label="Search orders" />
              </div>
              <div className="orders-actions-right">
                <div className="orders-filter-dropdown-wrapper" ref={dropdownRef}>
                  <div 
                    className="orders-filter-dropdown"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <span>Status: {statusFilter === "All" ? "All" : formatStatus(statusFilter)}</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                  {showStatusDropdown && (
                    <div className="orders-filter-dropdown-menu">
                      {statusOptions.map((option) => (
                        <div
                          key={option}
                          className={`orders-filter-option ${statusFilter === option ? "active" : ""}`}
                          onClick={() => handleStatusSelect(option)}
                        >
                          {option === "All" ? "All" : formatStatus(option)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="orders-export-btn">
                  <FontAwesomeIcon icon={faDownload} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>SMM Order ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.customer}</td>
                    <td>
                      <div className="order-service-cell">
                        <FontAwesomeIcon icon={getServiceIcon(order.serviceIcon)} className="service-icon" />
                        <span>{order.service}</span>
                      </div>
                    </td>
                    <td>{order.smmOrderId}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`order-status-badge order-status-${order.status.toLowerCase()}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td>
                      <button className="order-details-link" onClick={() => handleDetailsClick(order)}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="orders-footer">
              <span className="orders-footer-text">
                Showing {totalOrders === 0 ? 0 : startItem} to {endItem} of {totalOrders} orders
              </span>
              <div className="orders-pagination">
                <button 
                  className="pager-btn" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  className="pager-btn" 
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>

      {showDetailsModal && selectedOrder && (
        <div className="order-details-modal-overlay" onClick={handleCloseModal}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-details-modal-header">
              <h2>Order Details</h2>
              <button className="order-details-modal-close" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="order-details-modal-body">
              <div className="order-details-id">{selectedOrder.id}</div>
              <div className="order-details-divider"></div>

              <div className="order-details-info">
                <div className="order-details-row">
                  <span className="order-details-label">Date</span>
                  <span className="order-details-value">{selectedOrder.date}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Customer</span>
                  <span className="order-details-value">{selectedOrder.customer}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Email</span>
                  <span className="order-details-value">{selectedOrder.email}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Service</span>
                  <span className="order-details-value">{selectedOrder.service}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Platform</span>
                  <span className="order-details-value">{getPlatformName(selectedOrder.serviceIcon)}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Amount</span>
                  <span className="order-details-value">{selectedOrder.amount}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Status</span>
                  <span className={`order-details-value order-status-badge order-status-${selectedOrder.status.toLowerCase()}`}>
                    {formatStatus(selectedOrder.status)}
                  </span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">SMM Order ID</span>
                  <span className="order-details-value">{selectedOrder.smmOrderId}</span>
                </div>
              </div>
            </div>

            <div className="order-details-modal-footer">
              <button className="order-details-close-btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

