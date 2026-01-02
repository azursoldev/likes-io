"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faLink,
  faHeart,
  faChevronRight,
  faPlay
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
  views?: number;
}

function PostsSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const initialPostLink = searchParams.get("postLink") || "";
  const [postLink, setPostLink] = useState(initialPostLink);
  const [selectedPost, setSelectedPost] = useState<string>(initialPostLink);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";

  const fetchPosts = async (cursor?: string) => {
    if (!username) return;
    
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const url = cursor 
        ? `/api/social/tiktok/posts?username=${username}&cursor=${encodeURIComponent(cursor)}`
        : `/api/social/tiktok/posts?username=${username}`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        // data.posts is the result object containing { posts: [...], nextCursor: ... }
        const result = data.posts;
        const newPosts = result.posts || [];
        
        if (cursor) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        setNextCursor(result.nextCursor || null);
      } else {
        if (!cursor) setError(data.error || "Failed to fetch posts");
      }
    } catch (err) {
      if (!cursor) setError("An error occurred while fetching posts");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // If we have a username but no specific post link, fetch posts
    if (username && !initialPostLink) {
      fetchPosts();
    }
  }, [username, initialPostLink]);

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchPosts(nextCursor);
    }
  };

  const handlePostSelect = (url: string) => {
    setSelectedPost(url);
    setPostLink(url); // Sync manual input
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLink = selectedPost || postLink;

    if (finalLink.trim()) {
      // Navigate to final checkout step
      router.push(`/tiktok/likes/checkout/final?username=${username}&qty=${qty}&price=${priceValue}&type=${packageType}&postLink=${encodeURIComponent(finalLink)}`);
    }
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
                <h2 className="posts-selection-title">Select Post</h2>
                
                {loading ? (
                  <div className="loading-state" style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="spinner" style={{ 
                      width: '40px', 
                      height: '40px', 
                      border: '4px solid #f3f3f3', 
                      borderTop: '4px solid #000000', 
                      borderRadius: '50%', 
                      margin: '0 auto 20px',
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p>Loading videos...</p>
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
                     <p className="text-sm text-gray-500" style={{ marginTop: '10px' }}>
                       Ensure your account is public. You can enter the link manually below.
                     </p>
                   </div>
                ) : posts.length > 0 ? (
                  <>
                    <div className="posts-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                      gap: '10px',
                      marginBottom: '20px'
                    }}>
                      {posts.map((post) => (
                        <div 
                          key={post.id} 
                          className={`post-item`}
                          onClick={() => handlePostSelect(post.url)}
                          style={{
                            cursor: 'pointer',
                            border: selectedPost === post.url ? '3px solid #f97316' : '1px solid #eee',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            aspectRatio: '9/16',
                            position: 'relative',
                            backgroundColor: '#000'
                          }}
                        >
                          <img 
                            src={post.thumbnail} 
                            alt="TikTok video" 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              opacity: selectedPost === post.url ? 0.8 : 1
                            }} 
                          />
                          {selectedPost === post.url && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              color: '#fff',
                              fontSize: '24px'
                            }}>
                              <FontAwesomeIcon icon={faCheck} />
                            </div>
                          )}
                          <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            padding: '4px 8px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            color: '#fff',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FontAwesomeIcon icon={faPlay} style={{ fontSize: '8px' }} />
                            <span>{post.views || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {nextCursor && (
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button 
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          style={{
                            padding: '8px 16px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {loadingMore ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No videos found. You can enter a link manually below.
                  </p>
                )}

                {/* Manual Link Input Fallback */}
                <div className="manual-link-section" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <p className="posts-helper-text" style={{ marginBottom: '10px' }}>
                    Can't find your video? Enter the link manually:
                  </p>
                  <form className="posts-selection-form" onSubmit={handleContinue}>
                    <div className="posts-form-group">
                      <div className="posts-input-wrapper">
                        <FontAwesomeIcon icon={faLink} className="posts-input-icon" />
                        <input
                          type="text"
                          className="posts-input"
                          value={postLink}
                          onChange={(e) => {
                            setPostLink(e.target.value);
                            setSelectedPost(e.target.value);
                          }}
                          placeholder="https://www.tiktok.com/@username/video/..."
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
                        <img src="/tiktok-9.png" alt="TikTok" width={20} height={20} />
                      </div>
                      <span className="order-summary-text order-summary-url">
                        {postLink ? 'Video Selected' : `@${username}`}
                      </span>
                    </div>
                    <button type="button" className="order-change-btn" onClick={() => router.back()}>Change</button>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faHeart} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} TikTok Likes</span>
                        <span className="order-summary-subtext">Applying to 1 post.</span>
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
                    disabled={!selectedPost && !postLink.trim()}
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
