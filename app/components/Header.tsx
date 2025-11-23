"use client";
import PromoBar from "./PromoBar";

export default function Header() {
  // Dark mode toggle removed per request

  return (
    <>
      <PromoBar />
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <a href="/" className="brand-logo">
            <span className="logo-text">Likes</span>
            <span className="logo-dot">.io</span>
            </a>
          </div>
          <nav className="nav">
            <div className="nav-item">
              <a href="#instagram" className="nav-link">Instagram <span className="caret">▾</span></a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href="/instagram/likes">Buy Instagram Likes</a>
                  <a href="#">Buy Instagram Followers</a>
                  <a href="#">Buy Instagram Views</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#tiktok" className="nav-link">TikTok <span className="caret">▾</span></a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href="#">Buy TikTok Likes</a>
                  <a href="#">Buy TikTok Followers</a>
                  <a href="#">Buy TikTok Views</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#youtube" className="nav-link">YouTube <span className="caret">▾</span></a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href="#">Buy YouTube Views</a>
                  <a href="#">Buy YouTube Subscribers</a>
                  <a href="#">Buy YouTube Likes</a>
                </div>
              </div>
            </div>
            <a href="#faq">FAQ</a>
            <a href="#blog">Blog</a>
          </nav>
          <div className="header-actions">
            <div className="notif" aria-label="Notifications">
              <img src="/alarm-2.svg" alt="Notifications" className="icon" width={20} height={20} />
              <span className="badge">3</span>
            </div>
            <div className="currency">USD <span className="caret">▾</span></div>
            <a className="login" href="#login">Login</a>
            <button className="signup">Sign up</button>
          </div>
        </div>
      </header>
    </>
  );
}