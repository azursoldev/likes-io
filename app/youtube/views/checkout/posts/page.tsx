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
  faPlay,
  faThumbsUp,
  faEye
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

function PostsSelectionContent({ basePath }: { basePath?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const initialPostLink = searchParams.get("postLink") || "";
  const [postLink, setPostLink] = useState(initialPostLink);
  const [selectedPosts, setSelectedPosts] = useState<string[]>(initialPostLink ? [initialPostLink] : []);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "1000";
  const priceValue = parseFloat(searchParams.get("price") || "29.99");
  const packageType = searchParams.get("type") || "High-Retention";
  const serviceId = searchParams.get("serviceId") || "";

  const [userProfile, setUserProfile] = useState<{ profilePicture: string; username: string } | null>(null);
  const [imageError, setImageError] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(100);

  const formatCount = (count: number) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  };

  const fetchUserProfile = async () => {
    if (!username) return;
    try {
        const response = await fetch(`/api/social/youtube/profile?username=${encodeURIComponent(username)}`);
        if (response.ok) {
            const data = await response.json();
            const profile = data.profile || data;
            
            if (profile.profilePicture) {
                setUserProfile({
                    profilePicture: profile.profilePicture,
                    username: profile.displayUsername || profile.fullName || profile.username || username
                });
                setImageError(false);
            }
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
  };

  const fetchPosts = async (cursor?: string) => {
    if (!username) return;
    
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const timestamp = new Date().getTime();
      const url = cursor 
        ? `/api/social/youtube/posts?username=${encodeURIComponent(username)}&cursor=${encodeURIComponent(cursor)}&_t=${timestamp}`
        : `/api/social/youtube/posts?username=${encodeURIComponent(username)}&_t=${timestamp}`;

      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const newPosts = data.posts || [];
        if (cursor) {
          setPosts(prev => {
             const existingIds = new Set(prev.map(p => p.id));
             const uniqueNewPosts = newPosts.filter((p: Post) => !existingIds.has(p.id));
             return [...prev, ...uniqueNewPosts];
          });
        } else {
          setPosts(newPosts);
        }
        setNextCursor(data.nextCursor || null);
        
        // If we fetched more posts, ensure visible count covers them if it was restricting
        if (cursor) {
             setVisibleCount(prev => Math.max(prev, newPosts.length + posts.length));
        } else {
             // Initial load - show all (up to a reasonable limit, e.g. 100)
             setVisibleCount(Math.max(100, newPosts.length));
        }
      } else {
        if (!cursor) setError(data.error || "Failed to fetch videos");
        else setNextCursor(null); // Stop auto-loading on error
      }
    } catch (err) {
      if (!cursor) setError("An error occurred while fetching videos");
      else setNextCursor(null); // Stop auto-loading on error
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (username) {
        fetchPosts();
        fetchUserProfile();
    }
  }, [username]);

  // Auto-load more posts if we haven't filled the visible count (e.g. initial 50)
  /* 
  useEffect(() => {
    if (!loading && !loadingMore && nextCursor && posts.length < visibleCount) {
        fetchPosts(nextCursor);
    }
  }, [loading, loadingMore, nextCursor, posts.length, visibleCount]);
  */

  const handleLoadMore = () => {
    // Just fetch next page directly
    if (nextCursor) {
      fetchPosts(nextCursor);
    }
    // Also increase visible count to ensure new posts are shown
    setVisibleCount(prev => prev + 50);
  };

  const handlePostSelect = (url: string) => {
    setSelectedPosts(prev => {
      if (prev.includes(url)) {
        return prev.filter(p => p !== url);
      } else {
        // Check if adding another post would result in less than 50 views per post
        const newCount = prev.length + 1;
        const potentialSplitQty = Math.floor(parseInt(qty) / newCount);
        
        if (potentialSplitQty < 50) {
          alert(`You cannot select more videos. Minimum 50 views per video required.`);
          return prev;
        }

        return [...prev, url];
      }
    });
    setPostLink(""); // Clear manual input when selecting from grid
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLinks = selectedPosts.length > 0 ? selectedPosts : (postLink ? [postLink] : []);
    
    if (finalLinks.length > 0) {
      // Calculate total price based on number of videos selected
      const count = finalLinks.length;
      // Don't multiply price, keep base price
      const totalBasePrice = priceValue;
      // Split quantity across posts
      const splitQty = Math.floor(parseInt(qty) / count);

      const params = new URLSearchParams({
        username,
        videoLink: finalLinks.join(','),
        qty: String(splitQty),
        price: String(totalBasePrice), // Pass the calculated total price
        type: packageType,
      });
      if (serviceId) {
        params.append("serviceId", serviceId);
      }
      
      const baseUrl = basePath || "/youtube/views";
      router.push(`${baseUrl}/checkout/final?${params.toString()}`);
    }
  };

  // Calculate Subtotal
  const postCount = selectedPosts.length || (postLink ? 1 : 0);
  const subtotal = priceValue; // Price stays same regardless of post count
  const displayQtyPerPost = Math.floor(parseInt(qty) / (postCount || 1));

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
              <span className="progress-step-label">Videos</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 className="posts-selection-title" style={{ margin: 0 }}>Select Videos</h2>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {selectedPosts.length || (postLink ? 1 : 0)} selected
                  </span>
                </div>
                
                {loading ? (
                  <div className="loading-state" style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="spinner" style={{ 
                      width: '40px', 
                      height: '40px', 
                      border: '4px solid #f3f3f3', 
                      borderTop: '4px solid #f97316', 
                      borderRadius: '50%', 
                      margin: '0 auto 20px',
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p>Loading videos...</p>
                  </div>
                ) : error ? (
                   <div className="error-state" style={{ padding: '20px', textAlign: 'center', color: '#ea580c' }}>
                     <p>{error}</p>
                     <p className="text-sm text-gray-500" style={{ marginTop: '10px' }}>Ensure your channel is public.</p>
                   </div>
                ) : (
                  <>
                    <div className="posts-grid" style={{ 
                      marginBottom: '20px'
                    }}>
                      {posts.slice(0, visibleCount).map((post) => (
                        <div 
                          key={post.id}  
                          className={`post-item`}
                          onClick={() => handlePostSelect(post.url)}
                          style={{
                            cursor: 'pointer',
                            border: selectedPosts.includes(post.url) ? '3px solid #f97316' : '1px solid #eee',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            aspectRatio: '16/9',
                            position: 'relative',
                            backgroundColor: '#000'
                          }}
                        >
                          <img 
                            src={post.thumbnail} 
                            alt={post.caption} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                opacity: selectedPosts.includes(post.url) ? 0.8 : 1
                            }}
                          />
                          
                          {/* Selected Overlay - Checkmark */}
                          {selectedPosts.includes(post.url) && (
                            <div style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: '#f97316',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              zIndex: 10
                            }}>
                              <FontAwesomeIcon icon={faCheck} />
                            </div>
                          )}

                          {/* Selected Overlay - Quantity Badge */}
                          {selectedPosts.includes(post.url) && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: '#f97316',
                              color: 'white',
                              borderRadius: '20px',
                              padding: '4px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              zIndex: 10,
                              whiteSpace: 'nowrap'
                            }}>
                              <FontAwesomeIcon icon={faEye} />
                              <span>+ {displayQtyPerPost}</span>
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
                            justifyContent: 'space-between'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FontAwesomeIcon icon={faEye} style={{ fontSize: '10px' }} />
                              <span>{formatCount(post.views || 0)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: '10px' }} />
                              <span>{formatCount(post.likes || 0)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    { (nextCursor || visibleCount < posts.length) && (
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button 
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          style={{
                            padding: '10px 20px',
                            background: '#f3f4f6',
                            color: '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loadingMore ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          {loadingMore ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}
                  </>
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
                            setSelectedPosts([]); // Clear selection if typing manually
                          }}
                          placeholder="https://www.youtube.com/watch?v=..."
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
                      <div className="order-summary-icon" style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        border: '2px solid #f97316',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                         {userProfile?.profilePicture && !imageError ? (
                           <img 
                             src={userProfile.profilePicture}
                             alt={username} 
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                             onError={() => setImageError(true)}
                           />
                         ) : (
                           <img src="/youtube-7.png" alt="YouTube" width={20} height={20} />
                         )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span className="order-summary-text order-summary-url" style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userProfile?.username || username || "username"}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="order-change-btn" onClick={() => router.back()}>Change</button>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faEye} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} YouTube Views</span>
                        <span className="order-summary-subtext">
                             {displayQtyPerPost} views / {postCount} video{postCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="order-change-btn" onClick={() => router.push(`/youtube/views/checkout?qty=${qty}&price=${priceValue}&type=${packageType}`)}>Change</button>
                  </div>

                  <div className="order-summary-divider"></div>

                  <div className="order-summary-total">
                    <span className="order-summary-label">Subtotal</span>
                    <span className="order-summary-price">{formatPrice(subtotal)} {getCurrencySymbol() === "€" ? "EUR" : "USD"}</span>
                  </div>

                  <button 
                    type="button" 
                    className="order-continue-btn"
                    onClick={handleContinue}
                    disabled={selectedPosts.length === 0 && !postLink.trim()}
                    style={{ backgroundColor: '#f97316' }}
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
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr) !important;
          gap: 10px;
          margin-bottom: 20px;
        }
        @media (max-width: 1024px) {
          .posts-grid {
             grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 768px) {
          .posts-grid {
             grid-template-columns: repeat(3, 1fr);
          }
          .posts-selection-layout {
            flex-direction: column;
          }
          .posts-selection-right {
            margin-top: 20px;
          }
        }
        @media (max-width: 480px) {
          .posts-grid {
             grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}

export default function Page({ basePath }: { basePath?: string } = {}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsSelectionContent basePath={basePath} />
    </Suspense>
  );
}
