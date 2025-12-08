"use client";
import { useState } from "react";
import "../dashboard/dashboard.css";
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
  id: number;
  author: string;
  quote: string;
  service: string;
  rating: number;
};

const reviews: Review[] = [
  {
    id: 1,
    author: "@newbie_creator",
    quote: "This service was pretty good! I saw a nice jump in my likes count almost immediately. Will probably use again.",
    service: "Instagram Likes",
    rating: 5,
  },
  {
    id: 2,
    author: "@tiktok_dancer_123",
    quote: "WOW! The TikTok views I bought really helped my video get noticed. Super happy with the results!",
    service: "TikTok Views",
    rating: 5,
  },
];

export default function ReviewModerationDashboard() {
  const [pendingReviews, setPendingReviews] = useState(reviews);

  const handleApprove = (id: number) => {
    const review = pendingReviews.find(r => r.id === id);
    if (review) {
      setPendingReviews(pendingReviews.filter(review => review.id !== id));
      // Here you would typically send an API request to approve the review
      console.log("Approved review:", review);
    }
  };

  const handleDecline = (id: number) => {
    const review = pendingReviews.find(r => r.id === id);
    if (review && confirm("Are you sure you want to decline this review?")) {
      setPendingReviews(pendingReviews.filter(review => review.id !== id));
      // Here you would typically send an API request to decline the review
      console.log("Declined review:", review);
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

          <div className="review-hero">
            <div className="review-hero-left">
              <h1>Review Moderation</h1>
              <p>Approve or decline new user-submitted reviews.</p>
            </div>
          </div>

          <div className="review-table-wrapper">
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
          </div>
        </main>
      </div>
    </div>
  );
}

