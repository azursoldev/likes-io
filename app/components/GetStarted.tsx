"use client";
import React, { useEffect, useMemo, useState } from "react";

type PackType = "likes" | "followers" | "views" | "subscribers";
type Platform = "instagram" | "tiktok" | "youtube";
type Quality = "hq" | "premium";

export default function GetStarted() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [packType, setPackType] = useState<PackType>("likes");
  const [quality, setQuality] = useState<Quality>("premium");
  const [qty, setQty] = useState(500);

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

  useEffect(() => {
    // Default to "likes" for all platforms to match the reference layout
    setPackType("likes");
  }, [platform]);

  const unitPrice = useMemo(() => {
    const platformPrices = PRICES[platform] || PRICES.instagram;
    const base = platformPrices[packType] ?? 0.03;
    return quality === "premium" ? base : base * 0.85;
  }, [platform, packType, quality]);

  const price = useMemo(() => (qty * unitPrice), [qty, unitPrice]);
  const oldPrice = useMemo(() => (price + 10), [price]);

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
                  <span className="qty-val">{qty.toLocaleString()}</span>
                  <span className="qty-label"> {LABELS[packType]}</span>
                </div>
                <div className="gs-price">
                  <span className="price">${price.toFixed(2)}</span>
                  <span className="old">${oldPrice.toFixed(2)}</span>
                </div>
              </div>
              <input
                className="range"
                type="range"
                min={50}
                max={5000}
                step={50}
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value, 10))}
              />
            </div>

            <form className="gs-form" onSubmit={(e) => { e.preventDefault(); }}>
              <div className="gs-input">
                <input className="input-field" placeholder={`Your ${platform === "instagram" ? "Instagram" : platform === "tiktok" ? "TikTok" : "YouTube"} username`} />
              </div>

              <button type="submit" className="btn buy-btn">Buy Now</button>

              <div className="gs-trust">
                <span className="trust-item">🛡️ 100% Safe Delivery</span>
                <span className="trust-item">🔒 Secure Checkout</span>
              </div>
            </form>
          </div>

          {/* Right features */}
          <div className="gs-right card-lg">
            <h4 className="gs-right-title">Premium {packType.charAt(0).toUpperCase() + packType.slice(1)} Features</h4>
            <ul className="gs-checklist">
              {FEATURES_BY_PLATFORM[platform].map((item, idx) => (
                <li key={idx}><span className="check">✓</span><span className="plus">+</span> {item}</li>
              ))}
            </ul>

            <div className="gs-divider" />
            <h4 className="gs-right-sub">Why Are {PLATFORM_LABELS[platform]} {packType.charAt(0).toUpperCase() + packType.slice(1)} Important?</h4>
            <p className="gs-right-text">{EXPLAIN_BY_PLATFORM[platform]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}