"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faChevronRight,
  faLink,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";

interface Post {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
}

function PostsSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [manualLink, setManualLink] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";
  const serviceId = searchParams.get("serviceId") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/instagram/posts?username=${username}`);
        const data = await response.json();
        
        if (response.ok) {
          setPosts(data.posts || []);
        } else {
          setError(data.error || "Failed to fetch posts");
        }
      } catch (err) {
        setError("An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  const handlePostSelect = (url: string) => {
    if (selectedPost === url) {
      setSelectedPost(""); // Deselect
      setManualLink("");
    } else {
      setSelectedPost(url);
      setManualLink(url);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      username: username,
      qty: qty,
      price: String(priceValue),
      type: packageType,
    });
    
    // Include post link if selected or manually entered
    const finalLink = selectedPost || manualLink;
    if (finalLink) {
      params.append("postLink", finalLink);
    }
    
    if (serviceId) {
      params.append("serviceId", serviceId);
    }
    
    router.push(`/instagram/followers/checkout/final?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <main className="posts-selection-page">
        <div className="posts-selection-container">
          {/* Progress Indicator */}
          <div className="checkout-progress">
            <div className="progress-step completed">
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Details</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step active">
              <div className="progress-step-icon">
                <span>2</span>
              </div>
              <span className="progress-step-label">Posts</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step">
              <div className="progress-step-icon">
                <span>3</span>
              </div>
              <span className="progress-step-label">Checkout</span>
            </div>
          </div>

          <div className="posts-selection-layout">
            {/* Left Column - Select Post */}
            <div className="posts-selection-left">
              <div className="checkout-card">
                <h2 className="posts-selection-title">Select Posts (Optional)</h2>
                <p className="posts-helper-text" style={{ marginBottom: '20px' }}>
                   Verify your account by selecting a post, or continue to checkout.
                </p>
                
                {loading ? (
                  <div className="loading-state" style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="spinner" style={{ 
                      width: '40px', 
                      height: '40px', 
                      border: '4px solid #f3f3f3', 
                      borderTop: '4px solid #3498db', 
                      borderRadius: '50%', 
                      margin: '0 auto 20px',
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p>Loading posts...</p>
                    <style jsx>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                ) : error ? (
                   <div className="error-state" style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
                     <p>{error}</p>
                     <p className="text-sm text-gray-500" style={{ marginTop: '10px' }}>Ensure your account is public.</p>
                   </div>
                ) : (
                  <div className="posts-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    {posts.map((post) => (
                      <div 
                        key={post.id} 
                        className={`post-item ${selectedPost === post.url ? 'selected' : ''}`}
                        onClick={() => handlePostSelect(post.url)}
                        style={{
                          cursor: 'pointer',
                          border: selectedPost === post.url ? '3px solid #007bff' : '1px solid #eee',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          aspectRatio: '1/1',
                          position: 'relative'
                        }}
                      >
                        <img 
                          src={post.thumbnail} 
                          alt={post.caption} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {selectedPost === post.url && (
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {posts.length === 0 && !loading && !error && (
                  <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No posts found. You can enter a link manually below.
                  </p>
                )}

                {/* Manual Link Input Fallback */}
                <div className="manual-link-section" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <p className="posts-helper-text" style={{ marginBottom: '10px' }}>
                    Can't find your post? Enter the link manually:
                  </p>
                  <form className="posts-selection-form" onSubmit={handleContinue}>
                    <div className="posts-form-group">
                      <div className="posts-input-wrapper">
                        <FontAwesomeIcon icon={faLink} className="posts-input-icon" />
                        <input
                          type="text"
                          className="posts-input"
                          value={manualLink}
                          onChange={(e) => {
                            setManualLink(e.target.value);
                            setSelectedPost(""); // Clear selection if typing manually
                          }}
                          placeholder="https://www.instagram.com/p/C..."
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="posts-selection-right">
              <div className="checkout-card order-summary-card">
                <div className="order-summary-section">
                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <img src="/instagram-11.png" alt="Instagram" width={20} height={20} />
                      </div>
                      <span className="order-summary-text">@{username || "username"}</span>
                    </div>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} Instagram Followers</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-summary-divider"></div>

                  <div className="order-summary-total">
                    <span className="order-summary-label">Subtotal</span>
                    <span className="order-summary-price">{formatPrice(priceValue)} {getCurrencySymbol() === "€" ? "EUR" : "USD"}</span>
                  </div>

                  <button 
                    type="button" 
                    className="order-continue-btn"
                    onClick={handleContinue}
                  >
                    Continue to checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PostsSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsSelectionContent />
    </Suspense>
  );
}
