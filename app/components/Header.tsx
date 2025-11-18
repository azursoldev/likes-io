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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C10.343 2 9 3.343 9 5V6.07C6.718 7.133 5.082 9.34 5.003 11.79L5 12v3l-1 1v1h16v-1l-1-1v-3c0-2.761-2.239-5-5-5V5c0-1.657-1.343-3-3-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
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