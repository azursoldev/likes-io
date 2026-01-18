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
  const [selectedPosts, setSelectedPosts] = useState<string[]>(initialPostLink ? [initialPostLink] : []);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectionError, setSelectionError] = useState("");
  
  const username = searchParams.get("username") || "";
  const email = searchParams.get("email") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";

  const parseQty = (val: string) => {
    if (!val) return 0;
    const clean = val.toLowerCase().trim();
    if (clean.endsWith('k')) return parseFloat(clean) * 1000;
    if (clean.endsWith('m')) return parseFloat(clean) * 1000000;
    return parseInt(clean.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const totalLikes = parseQty(qty);
  const selectedCount = selectedPosts.length || (postLink ? 1 : 0);
  const likesPerPost = selectedCount > 0 ? Math.floor(totalLikes / selectedCount) : totalLikes;

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

  const [userProfile, setUserProfile] = useState<{ profilePicture: string; username: string } | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchUserProfile = async () => {
    if (!username) return;
    try {
        console.log("Fetching user profile for:", username);
        const response = await fetch(`/api/social/tiktok/profile?username=${username}`);
        if (response.ok) {
            const data = await response.json();
            console.log("Profile API Response:", data);
            const profile = data.profile || data;
            
            if (profile.profilePicture) {
                console.log("Setting profile picture:", profile.profilePicture);
                setUserProfile({
                    profilePicture: profile.profilePicture,
                    username: profile.username
                });
                setImageError(false);
            } else {
                console.warn("No profile picture found in data");
            }
        } else {
            console.error("Profile fetch failed:", response.status);
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
        ? `/api/social/tiktok/posts?username=${username}&cursor=${encodeURIComponent(cursor)}`
        : `/api/social/tiktok/posts?username=${username}`;

      console.log('Fetching posts from:', url);

      const response = await fetch(url);
      const data = await response.json();
      
      console.log('API Response:', data);

      if (response.ok) {
        const newPosts = data.posts || [];
        console.log('Parsed posts:', newPosts.length);
        
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
        console.error('API Error:', data.error);
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
      fetchUserProfile();
    }
  }, [username, initialPostLink]);

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchPosts(nextCursor);
    }
  };

  const handlePostSelect = (url: string) => {
    setSelectedPosts(prev => {
      if (prev.includes(url)) {
        setSelectionError("");
        return prev.filter(p => p !== url);
      } else {
        const newCount = prev.length + 1;
        const potentialLikesPerPost = Math.floor(totalLikes / newCount);
        
        if (potentialLikesPerPost < 50 && totalLikes >= 50) {
            setSelectionError("Minimum 50 likes per post required. Please deselect a post to add another.");
            return prev;
        }
        
        setSelectionError("");
        return [...prev, url];
      }
    });
    setPostLink(""); // Clear manual input when selecting from grid to avoid confusion
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLinks = selectedPosts.length > 0 ? selectedPosts : (postLink ? [postLink] : []);

    if (finalLinks.length > 0) {
      // Navigate to final checkout step
      // Pass comma-separated links
      router.push(`/tiktok/likes/checkout/final?username=${username}&qty=${qty}&price=${priceValue}&type=${packageType}&postLink=${encodeURIComponent(finalLinks.join(','))}&email=${encodeURIComponent(email)}`);
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
                  <div>
                    <h2 className="posts-selection-title" style={{ margin: 0 }}>Select Posts</h2>
                    {selectionError && (
                        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', fontWeight: '500' }}>
                            {selectionError}
                        </p>
                    )}
                  </div>
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
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                      gap: '12px',
                      marginBottom: '20px'
                    }}>
                      {posts.map((post) => (
                        <div 
                          key={post.id} 
                          className={`post-item`}
                          onClick={() => handlePostSelect(post.url)}
                          style={{
                            cursor: 'pointer',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                            position: 'relative',
                            backgroundColor: '#000',
                            transition: 'all 0.2s ease',
                            transform: selectedPosts.includes(post.url) ? 'scale(0.98)' : 'scale(1)',
                            boxShadow: selectedPosts.includes(post.url) ? '0 0 0 3px #ff4500' : 'none'
                          }}
                        >
                          <img 
                            src={post.thumbnail} 
                            alt="TikTok video" 
                            referrerPolicy="no-referrer"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              opacity: selectedPosts.includes(post.url) ? 0.9 : 1
                            }} 
                          />
                          
                          {/* Selection Indicator (Checkmark) or Play Icon */}
                          {selectedPosts.includes(post.url) ? (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '24px',
                              height: '24px',
                              background: '#ff4500',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '12px',
                              zIndex: 10,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                              <FontAwesomeIcon icon={faCheck} />
                            </div>
                          ) : (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '24px',
                              height: '24px',
                              background: 'rgba(0,0,0,0.4)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '10px',
                              backdropFilter: 'blur(2px)'
                            }}>
                              <FontAwesomeIcon icon={faPlay} style={{ marginLeft: '2px' }} />
                            </div>
                          )}

                          {/* Selected Badge - Bottom Center (Like "Needs likes") */}
                          {selectedPosts.includes(post.url) && (
                            <div style={{
                              position: 'absolute',
                              bottom: '10px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#ff4500', // Orange color similar to screenshot
                              color: '#fff',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              zIndex: 10,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              whiteSpace: 'nowrap',
                              width: 'max-content'
                            }}>
                              <FontAwesomeIcon icon={faHeart} />
                              <span>+ {likesPerPost}</span>
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
                            setSelectedPosts([]); // Clear grid selection when manually typing
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
                             referrerPolicy="no-referrer"
                             onError={(e) => {
                               console.error("Image load error for URL:", userProfile.profilePicture);
                               setImageError(true);
                             }}
                           />
                         ) : (
                           <img src="/tiktok-9.png" alt="TikTok" width={20} height={20} />
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
                        <span className="order-summary-text">{qty} TikTok Likes</span>
                        <span className="order-summary-subtext">
                          {likesPerPost} likes / {selectedCount} post{selectedCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="order-change-btn" onClick={() => router.push(`/tiktok/likes/checkout?qty=${qty}&price=${priceValue}&type=${packageType}&email=${email}`)}>Change</button>
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
