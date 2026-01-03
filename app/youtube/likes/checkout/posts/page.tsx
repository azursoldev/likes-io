"use client";

import { useState, Suspense, useEffect } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faLink,
  faThumbsUp,
  faChevronRight,
  faPlay,
  faEye,
  faHeart
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
  views: number;
  timestamp: string;
}

function PostsSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [postLink, setPostLink] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [imageError, setImageError] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "16.99");
  const packageType = searchParams.get("type") || "High-Quality";

  useEffect(() => {
    if (username) {
      setLoading(true);
      
      // Fetch profile
      fetch(`/api/social/youtube/profile?username=${encodeURIComponent(username)}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setUserProfile(data.profile);
          }
        })
        .catch(err => console.error("Failed to fetch profile:", err));

      // Fetch posts
      fetch(`/api/social/youtube/posts?username=${encodeURIComponent(username)}`)
        .then(res => res.json())
        .then(data => {
          if (data.posts) {
            setPosts(data.posts);
          }
        })
        .catch(err => {
          console.error("Failed to fetch posts:", err);
          setError("Failed to load videos. You can still enter a link manually.");
        })
        .finally(() => setLoading(false));
    }
  }, [username]);

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
    // Clear manual link if selecting posts
    setPostLink("");
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPostLink = postLink;
    
    // If posts are selected, construct a comma-separated list of URLs
    if (selectedPosts.length > 0) {
      const selectedUrls = posts
        .filter(p => selectedPosts.includes(p.id))
        .map(p => p.url);
      finalPostLink = selectedUrls.join(',');
    }

    if (finalPostLink.trim()) {
      // Navigate to final checkout step
      router.push(`/youtube/likes/checkout/final?username=${username}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}&postLink=${encodeURIComponent(finalPostLink)}`);
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
            {/* Left Column - Posts Grid or Manual Link */}
            <div className="posts-selection-left">
              <div className="checkout-card">
                <h2 className="posts-selection-title">Select Videos</h2>
                <p className="posts-selection-subtitle">
                  Select the videos you want to distribute likes to, or enter a link manually below.
                </p>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {posts.map((post) => (
                      <div 
                        key={post.id}
                        className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedPosts.includes(post.id) 
                            ? "border-red-600 ring-2 ring-red-100" 
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => togglePostSelection(post.id)}
                      >
                        <img 
                          src={post.thumbnail} 
                          alt={post.caption} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
                        
                        {/* Selected Overlay */}
                        {selectedPosts.includes(post.id) && (
                          <div className="absolute inset-0 bg-red-600 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-red-600 text-white rounded-full p-2">
                              <FontAwesomeIcon icon={faCheck} />
                            </div>
                          </div>
                        )}

                        {/* Video Stats Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-xs flex justify-between items-end">
                          <span className="truncate max-w-[70%]">{post.caption}</span>
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faEye} />
                            {post.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No videos found. Please enter a link manually.
                  </div>
                )}

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <form className="posts-selection-form" onSubmit={handleContinue}>
                  <div className="posts-form-group">
                    <label className="checkout-label">Manual YouTube Video Link</label>
                    <div className="posts-input-wrapper">
                      <FontAwesomeIcon icon={faLink} className="posts-input-icon" />
                      <input
                        type="text"
                        className="posts-input"
                        value={postLink}
                        onChange={(e) => {
                          setPostLink(e.target.value);
                          setSelectedPosts([]); // Clear selection if typing manual link
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <p className="posts-helper-text">
                      Paste the full URL of the video you want to boost if it's not listed above.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="posts-selection-right">
              <div className="checkout-card order-summary-card">
                <div className="order-summary-section">
                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        {userProfile?.profilePicture && !imageError ? (
                          <img 
                            src={userProfile.profilePicture} 
                            alt={username} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <img src="/youtube-7.png" alt="YouTube" width={20} height={20} />
                        )}
                      </div>
                      <span className="order-summary-text">
                        {userProfile?.displayUsername || userProfile?.fullName || username || "username"}
                      </span>
                    </div>
                    <button type="button" className="order-change-btn" onClick={() => router.back()}>Change</button>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} YouTube Likes</span>
                        <span className="order-summary-subtext">
                          {selectedPosts.length > 0 
                            ? `Applying to ${selectedPosts.length} video${selectedPosts.length > 1 ? 's' : ''}`
                            : postLink 
                              ? "Applying to 1 video"
                              : "Select videos to continue"}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="order-change-btn">Change</button>
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

