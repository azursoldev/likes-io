"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheck, faSparkles } from "@fortawesome/free-solid-svg-icons";

type Review = {
  username: string;
  text: string;
};

const reviews: Review[] = [
  {
    username: "@sarahL",
    text: "Likes.io changed the game for my channel. The growth felt natural and the engagement was top-notch. I saw results within the first 24 hours!",
  },
  {
    username: "@MikeP_Fitness",
    text: "...helped us increase conversions by 30%. Incredibly simple and effective.",
  },
  {
    username: "@JessT_Art",
    text: "...helped my art reach a much wider audience than I could have ever managed on my own. Highly recommended!",
  },
  {
    username: "@TravelTom",
    text: "The instant delivery on views is no joke. My latest reel got the boost it needed to get pushed by the algorithm. This service is a must-have for any serious creator.",
  },
  {
    username: "@GamerPro",
    text: "Good service for likes, delivered as promised. The support team was also very helpful when I had a question about splitting likes across multiple posts. Solid experience.",
  },
  {
    username: "@FoodieFinds",
    text: "My food blog's engagement has skyrocketed. The likes are from high-quality profiles which makes my page look so much more credible. Thank you, Likes.io!",
  },
  {
    username: "@MusicMaven",
    text: "Finally, a service that delivers followers that stick. My music is reaching more people, and the growth looks completely organic. I couldn't be happier.",
  },
  {
    username: "@StyleByEva",
    text: "This is the secret weapon every fashion influencer needs. The boost in likes and followers helped me secure a new brand deal. The ROI is incredible!",
  },
  {
    username: "@TechTrends",
    text: "Simple, fast, and secure. The entire process for buying views was seamless. My tech review channel has gained so much traction from this.",
  },
  {
    username: "@DanceMovesDan",
    text: "The TikTok likes gave my video the initial push it needed to get on the FYP. Woke up to thousands of organic views. Incredible!",
  },
  {
    username: "@ComedyQueen",
    text: "Super fast delivery for TikTok likes. It helps my new videos gain momentum right away. Will be using this for all my posts!",
  },
  {
    username: "@DIYHacks",
    text: "Seeing that high like count immediately makes my videos look more popular and encourages more people to watch. Great service.",
  },
];

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

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 12;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="reviews-page">
      <div className="container">
        {/* Header Section */}
        <div className="reviews-page-header">
          <h1 className="reviews-page-title">Our Customer Reviews</h1>
          <p className="reviews-page-subtitle">
            See what 123 real customers are saying about our services.
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

          {/* Trust Statement */}
          <div className="reviews-trust-banner">
            We never offer incentives or pay to hide negative reviews. Our reputation is built on trust.
          </div>

          {/* Review Summary */}
          <div className="reviews-summary">
            <div className="reviews-summary-header">
              <FontAwesomeIcon icon={faSparkles} className="sparkle-icon" />
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

        {/* Review Cards Grid */}
        <div className="reviews-grid">
          {currentReviews.map((review, index) => (
            <div key={index} className="review-card-page">
              <div className="review-card-top">
                <div className="review-avatar">?</div>
                <div className="review-meta">
                  <div className="review-username">{review.username}</div>
                  <div className="review-verified">
                    <FontAwesomeIcon icon={faCheck} className="verified-check" />
                    Verified Buyer
                  </div>
                </div>
              </div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="star-icon-small" />
                ))}
              </div>
              <p className="review-text-page">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className="reviews-write-button-container">
          <button className="reviews-write-button">
            Write Your Review →
          </button>
        </div>

        {/* Pagination */}
        <div className="reviews-pagination">
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

        {/* FAQ Section */}
        <div className="reviews-faq-section">
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
    </section>
  );
}


