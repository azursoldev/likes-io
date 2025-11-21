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
            <span className="logo-text">Likes</span>
            <span className="logo-dot">.io</span>
          </div>
          <nav className="nav">
            <a href="#instagram">Instagram <span className="caret">▾</span></a>
            <a href="#tiktok">TikTok <span className="caret">▾</span></a>
            <a href="#youtube">YouTube <span className="caret">▾</span></a>
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