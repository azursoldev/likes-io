"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheck } from "@fortawesome/free-solid-svg-icons";
import WriteReviewModal from "./WriteReviewModal";

type Review = {
  id: number;
  handle: string;
  text: string;
  rating: number;
  role?: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 12;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  const faqItems = [
    {
      q: "Are these reviews from real customers?",
      a: "Yes, all reviews are from verified customers who have purchased and used our services. We never fabricate reviews or use fake testimonials.",
    },
    {
      q: "What does the 'Verified Buyer' badge mean?",
      a: "The 'Verified Buyer' badge indicates that the reviewer has completed a purchase through our platform and their review is authentic.",
    },
    {
      q: "How can I leave a review for my purchase?",
      a: "After completing a purchase, you'll receive an email invitation to leave a review. You can also visit our contact page to submit your feedback.",
    },
    {
      q: "Why isn't my review showing up on the page immediately?",
      a: "All reviews go through a moderation process to ensure authenticity and quality. This typically takes 24-48 hours before your review appears.",
    },
    {
      q: "Do you ever edit or remove negative reviews?",
      a: "We never edit or remove negative reviews. We believe in transparency and only remove reviews that violate our terms (spam, fake, or inappropriate content).",
    },
    {
      q: "How is the average star rating calculated?",
      a: "The average star rating is calculated from all verified customer reviews, providing an accurate representation of customer satisfaction.",
    },
  ];

  return (
    <section className="reviews-page">
      {/* Header Section */}
      <div className="reviews-page-header">
        <div className="container">
          <h1 className="reviews-page-title">Our Customer Reviews</h1>
          <p className="reviews-page-subtitle">
            See what {reviews.length || 123} real customers are saying about our services.
          </p>

          {/* Overall Rating */}
          <div className="reviews-rating">
            <div className="reviews-stars-large">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
              ))}
            </div>
            <p className="reviews-rating-text">4.9 out of 5 stars</p>
          </div>
        </div>
      </div>

      <div className="reviews-page-header2">
        <div className="container">
          

          {/* Trust Statement */}
          <div className="reviews-trust-banner">
            We never offer incentives or pay to hide negative reviews. Our reputation is built on trust.
          </div>

          {/* Review Summary */}
          <div className="reviews-summary">
            <div className="reviews-summary-header">
              <FontAwesomeIcon icon={faStar} className="sparkle-icon" />
              <h3 className="reviews-summary-title">Review summary</h3>
            </div>
            <p className="reviews-summary-note">Based on reviews, created with AI</p>
            <p className="reviews-summary-text">
              Customers consistently praise Likes.io for instant delivery of high-quality followers and likes. 
              Many report a significant boost in social media presence, with engagement that feels natural and authentic. 
              The service is particularly noted for stable and authentic-looking profiles, helping them attract organic growth. 
              Users appreciate the straightforward process and reliable support team.
            </p>
          </div>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="reviews-grid">
        <div className="container">
          {loading ? <p>Loading reviews...</p> : currentReviews.map((review, index) => (
            <div key={index} className="review-card-page">
              <div className="review-card-top">
                <div className="review-avatar">{review.handle.charAt(0).toUpperCase()}</div>
                <div className="review-meta">
                  <div className="review-username">{review.handle}</div>
                  <div className="review-verified">
                    <FontAwesomeIcon icon={faCheck} className="verified-check" />
                    {review.role || "Verified Buyer"}
                  </div>
                </div>
              </div>
              <div className="review-stars">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="star-icon-small" />
                ))}
              </div>
              <p className="review-text-page">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="reviews-write-button-container">
        <div className="container">
          <button
            className="reviews-write-button"
            onClick={() => setIsModalOpen(true)}
          >
            Write Your Review →
          </button>
        </div>
      </div>

      {/* Pagination */}
      <div className="reviews-pagination">
        <div className="container">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={`pagination-btn pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="reviews-faq-section">
        <div className="container">
          <h2 className="reviews-faq-title">Frequently Asked Questions</h2>
          <p className="reviews-faq-subtitle">
            Have questions? We've got answers. If you don't see your question here, feel free to contact us.
          </p>
          <div className="reviews-faq-list">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className={`reviews-faq-item ${openFaq === index ? 'open' : ''}`}
              >
                <button
                  className="reviews-faq-head"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="reviews-faq-question">{faq.q}</span>
                  <span className="reviews-faq-toggle">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className="reviews-faq-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
