"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faStar,
  faBolt,
  faTimes,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

type WriteReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
};

export default function WriteReviewModal({
  isOpen,
  onClose,
  defaultService = "",
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: defaultService,
    name: "",
    review: "",
  });

  // Update service when defaultService changes
  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          service: defaultService || "",
          name: "",
          review: "",
        });
        setRating(0);
        onClose();
        alert("Thank you! Your review has been submitted for approval.");
      } else {
        alert(data.error || "Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="review-modal-overlay" onClick={handleOverlayClick}>
      <div className="review-modal">
        {/* Left Section */}
        <div className="review-modal-left">
          <div className="review-modal-logo">
            <span className="review-modal-logo-text">Likes</span>
            <span className="review-modal-logo-dot">.io</span>
          </div>
          <h2 className="review-modal-feedback-title">Your Feedback Matters</h2>
          <p className="review-modal-intro">
            Help our community by sharing your honest experience. Your review guides
            others and helps us improve.
          </p>

          <div className="review-modal-guidelines">
            <div className="review-modal-guideline">
              <div className="review-modal-icon review-modal-icon-check">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div className="review-modal-guideline-content">
                <strong>Be specific:</strong> Mention the service you purchased and
                the results you saw.
              </div>
            </div>
            <div className="review-modal-guideline">
              <div className="review-modal-icon review-modal-icon-star">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <div className="review-modal-guideline-content">
                <strong>Be honest:</strong> Whether it's praise or constructive
                feedback, your honest opinion is valuable.
              </div>
            </div>
            <div className="review-modal-guideline">
              <div className="review-modal-icon review-modal-icon-bolt">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <div className="review-modal-guideline-content">
                <strong>Keep it concise:</strong> A few sentences are perfect for
                conveying your experience.
              </div>
            </div>
          </div>

          <p className="review-modal-disclaimer">
            Your email will not be published. By submitting, you agree to our terms.
          </p>
        </div>

        {/* Right Section */}
        <div className="review-modal-right">
          <button className="review-modal-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="review-modal-form-title">Write a Review</h2>

          <form className="review-modal-form" onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="review-modal-field">
              <label className="review-modal-label">Your Rating</label>
              <div className="review-modal-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="review-modal-star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className={`review-modal-star-icon ${
                        star <= (hoverRating || rating) ? "filled" : "outline"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Service Dropdown */}
            <div className="review-modal-field">
              <label htmlFor="service" className="review-modal-label">
                Service Purchased
              </label>
              <div className="review-modal-select-wrapper">
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="review-modal-select"
                  required
                >
                  <option value="">Select a service...</option>
                  <option value="instagram-likes">Instagram Likes</option>
                  <option value="instagram-followers">Instagram Followers</option>
                  <option value="instagram-views">Instagram Views</option>
                  <option value="tiktok-likes">TikTok Likes</option>
                  <option value="tiktok-followers">TikTok Followers</option>
                  <option value="tiktok-views">TikTok Views</option>
                  <option value="youtube-views">YouTube Views</option>
                  <option value="youtube-subscribers">YouTube Subscribers</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="review-modal-select-arrow"
                />
              </div>
            </div>

            {/* Name/Handle */}
            <div className="review-modal-field">
              <label htmlFor="name" className="review-modal-label">
                Your Name/Handle
              </label>
              <div className="review-modal-input-wrapper">
                <FontAwesomeIcon icon={faUser} className="review-modal-input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="review-modal-input"
                  placeholder="@yourhandle"
                  required
                />
              </div>
            </div>

            {/* Review Text */}
            <div className="review-modal-field">
              <label htmlFor="review" className="review-modal-label">
                Your Review
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                className="review-modal-textarea"
                placeholder="Tell us what you think..."
                rows={6}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="review-modal-submit">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

