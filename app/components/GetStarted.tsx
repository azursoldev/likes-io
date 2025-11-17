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
    // Reset default pack per platform for more natural UX
    const defaultPack = platform === "youtube" ? "views" : "likes";
    setPackType(defaultPack);
  }, [platform]);

  const unitPrice = useMemo(() => {
    const platformPrices = PRICES[platform] || PRICES.instagram;
    const base = platformPrices[packType] ?? 0.03;
    return quality === "premium" ? base : base * 0.85;
  }, [platform, packType, quality]);

  const price = useMemo(() => (qty * unitPrice), [qty, unitPrice]);
  const oldPrice = useMemo(() => (price + 10), [price]);

  return (
    <section className="getstarted">
      <div className="container">
        <div className="gs-header">
          <h3 className="font-heading">Get Started Instantly</h3>
          <div className="gs-platforms">
            <button className={`pill ${platform === "instagram" ? "active" : ""}`} onClick={() => setPlatform("instagram")}>Instagram</button>
            <button className={`pill ${platform === "tiktok" ? "active" : ""}`} onClick={() => setPlatform("tiktok")}>TikTok</button>
            <button className={`pill ${platform === "youtube" ? "active" : ""}`} onClick={() => setPlatform("youtube")}>YouTube</button>
          </div>
        </div>

        <div className="gs-grid">
          {/* Left card */}
          <div className="gs-left card-lg">
            <div className="gs-tabs">
              {PLATFORM_TABS[platform].map((tab) => (
                <button key={tab} className={`gs-tab ${packType === tab ? "active" : ""}`} onClick={() => setPackType(tab)}>
                  <span className="icon">{tab === "likes" ? "❤" : tab === "followers" ? "👤" : tab === "subscribers" ? "👥" : "👁️"}</span>
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

            <div className="gs-input">
              <input className="input-field" placeholder={`Your ${platform === "instagram" ? "Instagram" : platform === "tiktok" ? "TikTok" : "YouTube"} username`} />
            </div>

            <button className="btn buy-btn">Buy Now</button>

            <div className="gs-trust">
              <span className="trust-item">🛡️ 100% Safe Delivery</span>
              <span className="trust-item">🔒 Secure Checkout</span>
            </div>
          </div>

          {/* Right features */}
          <div className="gs-right card-lg">
            <h4 className="gs-right-title">Premium {packType.charAt(0).toUpperCase() + packType.slice(1)} Features</h4>
            <ul className="gs-checklist">
              {FEATURES_BY_PLATFORM[platform].map((item, idx) => (
                <li key={idx}><span className="check">✓</span> {item}</li>
              ))}
            </ul>

            <h4 className="gs-right-sub">Why Are {PLATFORM_LABELS[platform]} {packType.charAt(0).toUpperCase() + packType.slice(1)} Important?</h4>
            <p className="gs-right-text">{EXPLAIN_BY_PLATFORM[platform]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}