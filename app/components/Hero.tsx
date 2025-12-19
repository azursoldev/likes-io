"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Default values matching current UI
const DEFAULT_TITLE = `Real Social Media
Growth, <span class="accent">Delivered</span>
<span class="accent"> Instantly!</span>`;
const DEFAULT_SUBTITLE = "Get real, high-quality likes, followers, and views to boost your social presence, reach the Explore Page, and grow your brand organically.";
const DEFAULT_RATING = "5.0";
const DEFAULT_REVIEW_COUNT = "1,442+ Reviews";
const DEFAULT_BUTTONS = [
  { text: "View Packages", link: "#services-overview" },
  { text: "Free Likes Trial", link: "#free-trial" },
];

export default function Hero() {
  const [heroContent, setHeroContent] = useState({
    title: DEFAULT_TITLE,
    subtitle: DEFAULT_SUBTITLE,
    rating: DEFAULT_RATING,
    reviewCount: DEFAULT_REVIEW_COUNT,
    buttons: DEFAULT_BUTTONS,
  });
  const [contentLoaded, setContentLoaded] = useState(false);
  // Fetch homepage content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/homepage');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            // Parse title - handle HTML and line breaks
            let title = data.content.heroTitle || DEFAULT_TITLE;
            // Convert \n to <br /> if not already HTML
            if (title.includes('\n') && !title.includes('<br')) {
              title = title.split('\n').map((line: string, i: number, arr: string[]) => 
                i < arr.length - 1 ? `${line}<br />` : line
              ).join('');
            }
            
            // Parse buttons
            let buttons = DEFAULT_BUTTONS;
            if (data.content.heroCtaButtons && Array.isArray(data.content.heroCtaButtons)) {
              buttons = data.content.heroCtaButtons.map((btn: any) => ({
                text: btn.text || btn.label || DEFAULT_BUTTONS[0].text,
                link: btn.link || btn.href || DEFAULT_BUTTONS[0].link,
              }));
            }
            
            setHeroContent({
              title,
              subtitle: data.content.heroSubtitle || DEFAULT_SUBTITLE,
              rating: data.content.heroRating || DEFAULT_RATING,
              reviewCount: data.content.heroReviewCount || DEFAULT_REVIEW_COUNT,
              buttons,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
        // Use defaults on error
      } finally {
        setContentLoaded(true);
      }
    };
    
    fetchContent();
  }, []);

  // Social update rotation every 3 seconds
  const updates = [
    { handle: "@fitfoodie", item: "5,000 Followers", time: "1m ago" },
    { handle: "@yourbrand", item: "8.3k Views", time: "1h ago" },
    { handle: "@davidArt", item: "1,000 Likes", time: "3m ago" },
  ];
  const [uIndex, setUIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setUIndex((i) => (i + 1) % updates.length), 5000);
    return () => clearInterval(id);
  }, []);

  // Floating pill rotation: Likes, Followers, Views every 5 seconds
  const floatUpdates = [
    { icon: "❤", iconClass: "lf-icon", text: "+2.1k Likes", sub: "in 12 minutes" },
    { icon: "👤", iconClass: "db-icon", text: "+500 Followers", sub: "delivered" },
    { icon: "👁️", iconClass: "vw-icon", text: "+8.3k Views", sub: "in 1 hour" },
  ];
  const [fIndex, setFIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFIndex((i) => (i + 1) % floatUpdates.length), 5000);
    return () => clearInterval(id);
  }, []);
  const currentUpdate = floatUpdates[fIndex];
  const iconSrc =
    currentUpdate.iconClass === "lf-icon"
      ? "/heart-3.svg"
      : currentUpdate.iconClass === "vw-icon"
      ? "/eye-2.svg"
      : "/avatar.svg";
  const iconAlt =
    currentUpdate.iconClass === "lf-icon"
      ? "Likes"
      : currentUpdate.iconClass === "vw-icon"
      ? "Views"
      : "Followers";
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-left">
          <h1 
            className="font-heading hero-title"
            dangerouslySetInnerHTML={{ __html: heroContent.title }}
          />
          <p className="hero-sub">
            {heroContent.subtitle}
          </p>
          <div className="reviews-pill">
            <span className="star" aria-hidden>
              <FontAwesomeIcon icon={faStar} />
            </span>
            <span className="score">{heroContent.rating}</span>
            <span className="sep">•</span>
            <span className="count">{heroContent.reviewCount}</span>
          </div>
          <div className="cta">
            {heroContent.buttons.map((btn, index) => (
              <a
                key={index}
                href={btn.link}
                className={`btn ${index === 0 ? 'dark' : 'light'}`}
              >
                {btn.text}
              </a>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar" />
              <div className="profile-meta">
                <div className="handle">@yourprofile</div>
                <div className="role">Lifestyle Creator</div>
              </div>
            </div>
            <div className="profile-image" />
            <div className="stats-row">
              <div className="stat">
                <div className="val">1,258</div>
                <div className="label">Likes</div>
              </div>
              <div className="stat">
                <div className="val">15.2k</div>
                <div className="label">Followers</div>
              </div>
              <div className="stat">
                <div className="val">3.4%</div>
                <div className="label">Engagement</div>
              </div>
            </div>
            <div className="delivered-badge">
              <span className="db-icon" aria-hidden><img src="/avatar.svg" alt="User" width={16} height={16} /></span>
              <span className="main-text">+500 Followers</span>
              <span className="sub">delivered</span>
            </div>
            <div className="likes-float">
              <span className={currentUpdate.iconClass} aria-hidden>
                <img src={iconSrc} alt={iconAlt} width={16} height={16} />
              </span>
              <span className="main-text">{currentUpdate.text}</span>
              <span className="sub">{currentUpdate.sub}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="social-update fadeup" key={uIndex}>
        <span className="pill">
          <span className="ig-logo" aria-hidden="true" />
          <span className="handle">{updates[uIndex].handle}</span>      
          <span className="muted">just purchased</span>
          <b className="accent-num">{updates[uIndex].item}</b>
          <span className="time">{updates[uIndex].time}</span>
        </span>
      </div>
    </section>
  );
}
