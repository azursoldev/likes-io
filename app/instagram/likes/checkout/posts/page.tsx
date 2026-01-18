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
  isVideo?: boolean;
}

function PostsSelectionContent() {
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
  const email = searchParams.get("email") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";
  const serviceId = searchParams.get("serviceId") || "";

  const [userProfile, setUserProfile] = useState<{ profilePicture: string; username: string } | null>(null);
  const [imageError, setImageError] = useState(false);

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
        const response = await fetch(`/api/social/instagram/profile?username=${username}`);
        if (response.ok) {
            const data = await response.json();
            const profile = data.profile || data;
            
            if (profile.profilePicture) {
                setUserProfile({
                    profilePicture: profile.profilePicture,
                    username: profile.username
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
      
      const url = cursor 
        ? `/api/instagram/posts?username=${username}&cursor=${encodeURIComponent(cursor)}`
        : `/api/instagram/posts?username=${username}`;

      const response = await fetch(url);
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
      } else {
        if (!cursor) setError(data.error || "Failed to fetch posts");
      }
    } catch (err) {
      if (!cursor) setError("An error occurred while fetching posts");
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

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchPosts(nextCursor);
    }
  };

  const handlePostSelect = (url: string) => {
    if (selectedPosts.includes(url)) {
      setSelectedPosts(prev => prev.filter(p => p !== url));
    } else {
      const newCount = selectedPosts.length + 1;
      const potentialLikesPerPost = Math.floor(parseInt(qty) / newCount);
      
      if (potentialLikesPerPost < 50) {
        alert(`Cannot select more posts. Minimum 50 likes per post required.\nCurrent package: ${qty} likes.`);
        return;
      }
      
      setSelectedPosts(prev => [...prev, url]);
    }
    setPostLink(""); // Clear manual input when selecting from grid
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLinks = selectedPosts.length > 0 ? selectedPosts : (postLink ? [postLink] : []);
    
    if (finalLinks.length > 0) {
      // Navigate to final checkout step
      const params = new URLSearchParams({
        username: username,
        email: email,
        qty: qty,
        price: String(priceValue),
        type: packageType,
        postLink: finalLinks.join(','),
      });
      if (serviceId) {
        params.append("serviceId", serviceId);
      }
      router.push(`/instagram/likes/checkout/final?${params.toString()}`);
    }
  };

  // Calculate Subtotal - Price is now total for the package, not per post
  const postCount = selectedPosts.length || (postLink ? 1 : 0);
  const subtotal = priceValue;
  const likesPerPost = Math.floor(parseInt(qty) / (postCount || 1));

  return (
    <>
      <Header />
      <main className="posts-selection-page">
        <div className="posts-selection-container">
          {/* Progress Indicator */}
          <div className="checkout-progress">
            <div className="progress-step completed">
              <div className="progress-step-icon">
                <span>1</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 className="posts-selection-title" style={{ margin: 0 }}>Select Posts</h2>
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
                  <>
                    <div className="posts-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(5, 1fr)', 
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
                            border: selectedPosts.includes(post.url) ? '3px solid #f97316' : '1px solid #eee',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
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
                          {/* Top Right Video Icon */}
                          {post.isVideo && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(0,0,0,0.6)',
                              borderRadius: '4px',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              zIndex: 5
                            }}>
                              <FontAwesomeIcon icon={faPlay} style={{ fontSize: '10px' }} />
                            </div>
                          )}

                          {/* Center Added Amount Badge (Only when selected) */}
                          {selectedPosts.includes(post.url) && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10
                            }}>
                              <div style={{
                                background: '#f97316',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                fontSize: '12px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                whiteSpace: 'nowrap'
                              }}>
                                <FontAwesomeIcon icon={faHeart} style={{ marginRight: '6px' }} />
                                + {formatCount(Math.floor(parseInt(qty) / selectedPosts.length))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {nextCursor && (
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
                    Can't find your post? Enter the link manually:
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
                             src={`/api/image-proxy?url=${encodeURIComponent(userProfile.profilePicture)}`}
                             alt={username} 
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                             onError={() => setImageError(true)}
                           />
                         ) : (
                           <img src="/instagram-11.png" alt="Instagram" width={20} height={20} />
                         )}
                      </div>
                      <span className="order-summary-text order-summary-url" style={{ fontWeight: '600' }}>
                        @{username || "username"}
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
                        <span className="order-summary-text">{qty} Instagram Likes</span>
                        <span className="order-summary-subtext">
                          {likesPerPost} likes / {postCount} post{postCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="order-change-btn" onClick={() => router.push(`/instagram/likes/checkout?qty=${qty}&price=${priceValue}&type=${packageType}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`)}>Change</button>
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
