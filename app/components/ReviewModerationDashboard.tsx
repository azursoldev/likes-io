"use client";
import { useState, useEffect } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faCheckCircle,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type Review = {
  id: string;
  author: string;
  quote: string;
  service: string;
  rating: number;
};

export default function ReviewModerationDashboard() {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/cms/testimonials?approved=false');
      if (response.ok) {
        const data = await response.json();
        const formattedReviews = data.testimonials.map((t: any) => ({
          id: t.id,
          author: t.handle,
          quote: t.text,
          service: formatService(t.platform, t.serviceType),
          rating: t.rating
        }));
        setPendingReviews(formattedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatService = (platform?: string, type?: string) => {
    if (!platform) return "General";
    const p = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
    const t = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : "";
    return `${p} ${t}`.trim();
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/cms/testimonials/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve: true })
      });
      
      if (response.ok) {
        setPendingReviews(pendingReviews.filter(review => review.id !== id));
      } else {
        alert("Failed to approve review");
      }
    } catch (error) {
      console.error("Error approving review:", error);
      alert("Error approving review");
    }
  };

  const handleDecline = async (id: string) => {
    if (!confirm("Are you sure you want to decline (delete) this review?")) return;
    
    try {
      const response = await fetch(`/api/cms/testimonials/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPendingReviews(pendingReviews.filter(review => review.id !== id));
      } else {
        alert("Failed to decline review");
      }
    } catch (error) {
      console.error("Error declining review:", error);
      alert("Error declining review");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`review-star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="reviewModeration" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Review Moderation</h1>
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
          <div className="review-hero">
            <div className="review-hero-left">
              <h1>Review Moderation</h1>
              <p>Approve or decline new user-submitted reviews.</p>
            </div>
          </div>
          
          <div className="review-table-wrapper">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                Loading reviews...
              </div>
            ) : pendingReviews.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No pending reviews found.
              </div>
            ) : (
            <table className="review-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Quote</th>
                  <th>Service</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((review) => (
                  <tr key={review.id}>
                    <td className="review-author-cell">
                      <div className="review-author-content">
                        <div className="review-avatar">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <span className="review-author-name">{review.author}</span>
                      </div>
                    </td>
                    <td className="review-quote-cell">
                      <p className="review-quote-text">{review.quote}</p>
                    </td>
                    <td className="review-service-cell">
                      <span>{review.service}</span>
                    </td>
                    <td className="review-rating-cell">
                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="review-actions-cell">
                      <button className="review-approve-btn" onClick={() => handleApprove(review.id)}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span>Approve</span>
                      </button>
                      <button className="review-decline-btn" onClick={() => handleDecline(review.id)}>
                        <FontAwesomeIcon icon={faTimes} />
                        <span>Decline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}

