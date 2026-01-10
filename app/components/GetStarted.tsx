"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useRouter } from "next/navigation";

type PackType = "likes" | "followers" | "views" | "subscribers";
type Platform = "instagram" | "tiktok" | "youtube";
type Quality = "hq" | "premium";

export default function GetStarted() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [packType, setPackType] = useState<PackType>("likes");
  const [quality, setQuality] = useState<Quality>("premium");
  const [qty, setQty] = useState(500);
  
  // Profile fetch state
  const [username, setUsername] = useState("");
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [usernameError, setUsernameError] = useState("");

  // Tab sets per platform
  const PLATFORM_TABS: Record<Platform, PackType[]> = {
    instagram: ["likes", "followers", "views"],
    tiktok: ["likes", "followers", "views"],
    youtube: ["views", "subscribers", "likes"],
  };

  const PRICES: Record<Platform, Record<PackType, number>> = {
    instagram: { likes: 0.03, followers: 0.06, views: 0.02, subscribers: 0.07 },
    tiktok: { likes: 0.025, followers: 0.05, views: 0.02, subscribers: 0.06 },
    youtube: { views: 0.015, subscribers: 0.08, likes: 0.02, followers: 0.06 },
  };

  const LABELS: Record<PackType, string> = {
    likes: "likes",
    followers: "followers",
    views: "views",
    subscribers: "subscribers",
  };

  const PLATFORM_LABELS: Record<Platform, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
  };

  const FEATURES_BY_PLATFORM: Record<Platform, string[]> = {
    instagram: [
      "REAL likes from ACTIVE users",
      "Maximum chance to reach the Explore Page",
      "Helps attract organic engagement",
      "Guaranteed Instant Delivery",
      "Option to split likes on multiple pictures",
      "No password required",
      "Priority 24/7 support",
    ],
    tiktok: [
      "Likes from ACTIVE users",
      "Higher chance to go viral",
      "Helps trigger the For You algorithm",
      "Guaranteed Instant Delivery",
      "No password required",
      "Safe & Secure",
      "Priority 24/7 support",
    ],
    youtube: [
      "Likes from active users",
      "Helps increase video ranking",
      "Increases chance of being recommended",
      "100% Safe & Secure",
      "No password required",
      "Priority 24/7 support",
    ],
  };

  const EXPLAIN_BY_PLATFORM: Record<Platform, string> = {
    instagram:
      "Likes boost posts and credibility, increasing the chance to reach the Explore Page and attract organic engagement.",
    tiktok:
      "Likes are fuel for the 'For You' Page algorithm. Rapid likes can push videos to trending, leading to massive exposure and viral growth.",
    youtube:
      "A strong like-to-dislike ratio is a positive signal to viewers and algorithm alike, helping your content rank and appear in 'Suggested Videos'.",
  };

  const [dynamicFeatures, setDynamicFeatures] = useState<string[]>([]);
  const [dynamicExplanation, setDynamicExplanation] = useState("");
  const [dynamicHeading, setDynamicHeading] = useState("");
  const [dynamicExplanationTitle, setDynamicExplanationTitle] = useState("");
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Clear profile data when platform changes
  useEffect(() => {
    // Default to "likes" for all platforms to match the reference layout
    setPackType("likes");
    setProfileData(null);
    setUsernameError("");
    setUsername("");
  }, [platform]);

  // Fetch profile when username changes (debounced)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username.trim()) {
        setProfileData(null);
        return;
      }

      setIsFetchingProfile(true);
      setUsernameError("");

      try {
        const cleanUsername = username.replace(/^@/, '');
        const res = await fetch(`/api/social/${platform}/profile?username=${cleanUsername}`);
        const data = await res.json();

        if (res.ok && data.profile) {
          setProfileData(data.profile);
        } else {
          // Don't show error immediately while typing, just clear profile
          setProfileData(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetchingProfile(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (username) fetchProfile();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [username, platform]);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setUsernameError("Please enter your username");
      return;
    }

    // Determine destination based on package type
    // Likes/Views need a post link -> Go to /checkout/posts
    // Followers/Subscribers just need profile -> Go to /checkout/final (bypassing details)
    const needsPostLink = ["likes", "views"].includes(packType);
    const nextStep = needsPostLink ? "posts" : "final";
    
    const cleanUsername = username.replace(/^@/, '');
    const type = quality === "hq" ? "High-Quality" : "Premium";
    
    // Construct checkout URL
    const checkoutUrl = `/${platform}/${packType}/checkout/${nextStep}?qty=${displayQty}&price=${displayPrice}&type=${encodeURIComponent(type)}&username=${encodeURIComponent(cleanUsername)}`;

    // If we already have valid profile data, just redirect
    if (profileData && profileData.username.toLowerCase() === cleanUsername.toLowerCase()) {
      router.push(checkoutUrl);
      return;
    }

    // Otherwise validate first
    setIsFetchingProfile(true);
    setUsernameError("");

    try {
      const res = await fetch(`/api/social/${platform}/profile?username=${cleanUsername}`);
      const data = await res.json();

      if (res.ok && data.profile) {
        setProfileData(data.profile);
        router.push(checkoutUrl);
      } else if (res.status === 500 || res.status === 503) {
        // If API fails (e.g. missing API key or service down), allow user to proceed
        // We don't want to block valid users if our validation service is having issues
        console.warn("Profile validation service unavailable, proceeding without validation");
        router.push(checkoutUrl);
      } else {
        setUsernameError("Invalid username. Please check and try again.");
      }
    } catch (error) {
      console.error("Validation error:", error);
      setUsernameError("Validation failed. Please try again.");
    } finally {
      setIsFetchingProfile(false);
    }
  };

  // Fetch dynamic content and packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Get Started Content (Features & Explanation)
        const contentRes = await fetch(`/api/cms/get-started?platform=${platform}&serviceType=${packType}&quality=${quality}`);
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setDynamicFeatures(contentData.features || []);
          setDynamicExplanation(contentData.explanation || "");
          setDynamicHeading(contentData.heading || "");
          setDynamicExplanationTitle(contentData.explanationTitle || "");
        }

        // Fetch Packages
        const packagesRes = await fetch(`/api/cms/service-pages/${platform}/${packType}`);
        if (packagesRes.ok) {
          const packagesData = await packagesRes.json();
          if (packagesData.packages && Array.isArray(packagesData.packages)) {
            // Find the correct tab based on quality
            const targetTabId = quality === "hq" ? "high" : "premium";
            const tab = packagesData.packages.find((t: any) => 
              t.id === targetTabId || 
              t.label?.toLowerCase().includes(targetTabId === "high" ? "high" : "premium")
            );

            if (tab && tab.packages && Array.isArray(tab.packages)) {
              const parsedPackages = tab.packages.map((pkg: any) => ({
                ...pkg,
                // Parse numbers for logic but keep originals if needed
                quantity: typeof pkg.qty === 'string' ? parseInt(pkg.qty.replace(/,/g, ''), 10) : pkg.qty,
                priceVal: typeof pkg.price === 'string' ? parseFloat(pkg.price.replace(/[^0-9.]/g, '')) : pkg.price,
                oldPriceVal: typeof pkg.strike === 'string' ? parseFloat(pkg.strike.replace(/[^0-9.]/g, '')) : pkg.strike,
              })).sort((a: any, b: any) => a.quantity - b.quantity);

              setAvailablePackages(parsedPackages);
              // Set slider to middle or start
              setSliderIndex(0);
            } else {
              setAvailablePackages([]);
            }
          } else {
            setAvailablePackages([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dynamic content", error);
        setAvailablePackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [platform, packType, quality]);

  const selectedPackage = useMemo(() => {
    if (availablePackages.length > 0 && availablePackages[sliderIndex]) {
      return availablePackages[sliderIndex];
    }
    return null;
  }, [availablePackages, sliderIndex]);

  // Derived values for display
  const displayQty = selectedPackage ? selectedPackage.quantity : qty;
  
  // Use price from package if available, otherwise calculate fallback
  const displayPrice = useMemo(() => {
    if (selectedPackage) return selectedPackage.priceVal;
    
    // Fallback logic
    const platformPrices = PRICES[platform] || PRICES.instagram;
    const base = platformPrices[packType] ?? 0.03;
    const unitP = quality === "premium" ? base : base * 0.85;
    return displayQty * unitP;
  }, [selectedPackage, platform, packType, quality, displayQty]);

  const displayOldPrice = useMemo(() => {
    if (selectedPackage && selectedPackage.oldPriceVal) return selectedPackage.oldPriceVal;
    return displayPrice * 1.5; // Default 50% markup if no old price
  }, [selectedPackage, displayPrice]);

  const displayDiscount = useMemo(() => {
    if (selectedPackage && selectedPackage.save) return selectedPackage.save;
    return null;
  }, [selectedPackage]);

  // Use dynamic features if available, else fallback to hardcoded
  const features = dynamicFeatures.length > 0 ? dynamicFeatures : (FEATURES_BY_PLATFORM[platform] || []);
  const explanation = dynamicExplanation || (EXPLAIN_BY_PLATFORM[platform] || "");


  const PillIcon = ({ name }: { name: Platform }) => {
    switch (name) {
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm6.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M14 3v4.6c1.3 1 2.9 1.6 4.6 1.6V13c-1.9-.1-3.6-.8-4.6-1.9V14a5 5 0 11-5-5c.3 0 .7 0 1 .1V6.5c-2.7-.3-5 1.7-5.4 4.3A6 6 0 1014 14V3z"/>
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M10 8l6 4-6 4V8z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Skeleton Loader
  if (loading && availablePackages.length === 0 && dynamicFeatures.length === 0) {
    return (
      <section className="getstarted">
        <div className="container">
          <div className="gs-header">
            <h3 className="font-heading">Get Started Instantly</h3>
            <div className="gs-platforms">
              {['Instagram', 'TikTok', 'YouTube'].map((p) => (
                <button key={p} className="pill">
                  <span className="pill-icon" style={{ width: 12, height: 12, background: '#ccc', borderRadius: '50%' }}></span>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="gs-grid">
            {/* Left card skeleton */}
            <div className="gs-left card-lg boxgray">
              <div className="gs-tabs" style={{ gap: '10px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="shimmer-bg" style={{ width: '100px', height: '40px', borderRadius: '8px' }}></div>
                ))}
              </div>

              <div className="gs-quality" style={{ marginTop: '20px' }}>
                <div className="shimmer-bg" style={{ width: '100%', height: '40px', borderRadius: '8px' }}></div>
              </div>

              <div className="gs-qty" style={{ marginTop: '30px' }}>
                <div className="gs-qty-top">
                  <div className="shimmer-bg" style={{ width: '120px', height: '30px', borderRadius: '4px' }}></div>
                  <div className="shimmer-bg" style={{ width: '80px', height: '30px', borderRadius: '4px' }}></div>
                </div>
                <div className="shimmer-bg" style={{ width: '100%', height: '10px', borderRadius: '4px', marginTop: '20px' }}></div>
              </div>

              <div className="gs-form" style={{ marginTop: '30px' }}>
                 <div className="shimmer-bg" style={{ width: '100%', height: '50px', borderRadius: '12px' }}></div>
                 <div className="shimmer-bg" style={{ width: '100%', height: '50px', borderRadius: '12px', marginTop: '15px' }}></div>
              </div>
            </div>

            {/* Right features skeleton */}
            <div className="gs-right card-lg">
              <div className="shimmer-bg" style={{ width: '60%', height: '24px', borderRadius: '4px', marginBottom: '20px' }}></div>
              <ul className="gs-features">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div className="shimmer-bg" style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div>
                    <div className="shimmer-bg" style={{ width: '80%', height: '20px', borderRadius: '4px' }}></div>
                  </li>
                ))}
              </ul>
              <div className="gs-divider" style={{ margin: '20px 0' }} />
              <div className="shimmer-bg" style={{ width: '70%', height: '24px', borderRadius: '4px', marginBottom: '10px' }}></div>
              <div className="shimmer-bg" style={{ width: '100%', height: '60px', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="getstarted">
      <div className="container">
        <div className="gs-header">
          <h3 className="font-heading">Get Started Instantly</h3>
          <div className="gs-platforms">
            <button className={`pill ${platform === "instagram" ? "active" : ""}`} onClick={() => setPlatform("instagram")}>
              <span className="pill-icon"><img src="/instagram-11.png" alt="Instagram" width={12} height={12} /></span>
              Instagram
            </button>
            <button className={`pill ${platform === "tiktok" ? "active" : ""}`} onClick={() => setPlatform("tiktok")}>
              <span className="pill-icon"><img src="/tiktok-9.png" alt="Tiktok" width={12} height={12} /></span>
              TikTok
            </button>
            <button className={`pill ${platform === "youtube" ? "active" : ""}`} onClick={() => setPlatform("youtube")}>
              <span className="pill-icon"><img src="/youtube-7.png" alt="Youtube" width={12} height={12} /></span>
              YouTube
            </button>
          </div>
        </div>

        <div className="gs-grid">
          {/* Left card */}
          <div className="gs-left card-lg boxgray">
            <div className="gs-tabs">
              {PLATFORM_TABS[platform].map((tab) => (
                <button key={tab} className={`gs-tab ${packType === tab ? "active" : ""}`} onClick={() => setPackType(tab)}>
                  <span className="icon">
                    <img
                      src={tab === "likes" ? "/heart-3.svg" : tab === "followers" ? "/avatar.svg" : tab === "subscribers" ? "/avatar.svg" : "/eye-2.svg"}
                      alt={tab === "likes" ? "Likes" : tab === "followers" ? "Followers" : tab === "subscribers" ? "Subscribers" : "Views"}
                      width={16}
                      height={16}
                    />
                  </span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="gs-quality">
              <button className={`q-tab ${quality === "hq" ? "active" : ""}`} onClick={() => setQuality("hq")}>High-Quality</button>
              <button className={`q-tab ${quality === "premium" ? "active" : ""}`} onClick={() => setQuality("premium")}>Premium</button>
            </div>

            <div className="gs-qty">
              <div className="gs-qty-top">
                <div>
                  <span className="qty-val">{displayQty.toLocaleString()}</span>
                  <span className="qty-label"> {LABELS[packType]}</span>
                  {displayDiscount && (
                    <span className="discount-badge" style={{ marginLeft: '10px', fontSize: '12px', background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '12px' }}>
                      {displayDiscount}
                    </span>
                  )}
                </div>
                <div className="gs-price">
                  <span className="price">{formatPrice(displayPrice)}</span>
                  <span className="old">{formatPrice(displayOldPrice)}</span>
                </div>
              </div>
              
              {availablePackages.length > 0 ? (
                <input
                  className="range"
                  type="range"
                  min={0}
                  max={availablePackages.length - 1}
                  step={1}
                  value={sliderIndex}
                  onChange={(e) => setSliderIndex(parseInt(e.target.value, 10))}
                />
              ) : (
                <input
                  className="range"
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value, 10))}
                />
              )}
            </div>

            <form className="gs-form" onSubmit={handleBuy}>
              <div className="gs-input-group" style={{ position: 'relative' }}>
                <div className="gs-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '12px', border: usernameError ? '1px solid #ef4444' : '1px solid #e2e8f0', padding: '5px' }}>
                  {profileData?.profilePicture && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px', flexShrink: 0 }}>
                      <img src={profileData.profilePicture} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                      className="input-field" 
                      style={{ border: 'none', width: '100%', outline: 'none', padding: '10px 5px' }}
                      placeholder={`Your ${platform === "instagram" ? "Instagram" : platform === "tiktok" ? "TikTok" : "YouTube"} username`} 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {isFetchingProfile && (
                      <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                        <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #f3f3f3', borderTop: '2px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style jsx>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </div>
                    )}
                  </div>
                </div>
                {usernameError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', marginLeft: '5px' }}>{usernameError}</div>}
              </div>

              <button type="submit" className="btn buy-btn" style={{ marginTop: '15px' }}>Get Started</button>

              <div className="gs-trust">
                <span className="trust-item">🛡️ Account-Safe Delivery</span>
                <span className="trust-item">🔒 Secure Checkout</span>
              </div>
            </form>
          </div>

          {/* Right features */}
          <div className="gs-right card-lg">
            <h4 className="gs-right-title">
              {dynamicHeading || `${quality === 'hq' ? 'High Quality' : 'Premium'} ${packType.charAt(0).toUpperCase() + packType.slice(1)} Features`}
            </h4>
            {/* Dynamic Features List */}
            <ul className="gs-features">
              {features.map((feat, i) => (
                <li key={i}>
                  <span className="gs-check-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {feat}
                </li>
              ))}
            </ul>

            <div className="gs-divider" />
            <h4 className="gs-right-sub">
              {dynamicExplanationTitle || `Why Are ${PLATFORM_LABELS[platform]} ${packType.charAt(0).toUpperCase() + packType.slice(1)} Important?`}
            </h4>
            <p className="gs-right-text">{explanation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
