"use client";
import { useState, useRef, useEffect } from "react";
import PromoBar from "./PromoBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  const currencies = ["USD", "EUR"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };

    if (isCurrencyOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCurrencyOpen]);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setIsCurrencyOpen(false);
  };

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
              <a href="#instagram" className="nav-link">
                Instagram
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href="/instagram/likes">Buy Instagram Likes</a>
                  <a href="/instagram/followers">Buy Instagram Followers</a>
                  <a href="/instagram/views">Buy Instagram Views</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#tiktok" className="nav-link">
                TikTok
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href="/tiktok/likes">Buy TikTok Likes</a>
                  <a href="/tiktok/followers">Buy TikTok Followers</a>
                  <a href="/tiktok/views">Buy TikTok Views</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#youtube" className="nav-link">
                YouTube
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href="/youtube/likes">Buy YouTube Likes</a>
                  <a href="/youtube/views">Buy YouTube Views</a>
                  <a href="/youtube/subscribers">Buy YouTube Subscribers</a>
                </div>
              </div>
            </div>
            <a href="/faq">FAQ</a>
            <a href="/blog">Blog</a>
          </nav>
          <div className="header-actions">
            <div className="notif" aria-label="Notifications">
              <img src="/alarm-2.svg" alt="Notifications" className="icon" width={20} height={20} />
              <span className="badge">3</span>
            </div>
            <div className="currency-selector" ref={currencyRef}>
              <div 
                className="currency-trigger" 
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={isCurrencyOpen}
              >
                {selectedCurrency} 
                <span className="caret">{isCurrencyOpen ? "▴" : "▾"}</span>
              </div>
              {isCurrencyOpen && (
                <div className="currency-dropdown">
                  {currencies.map((currency) => (
                    <div
                      key={currency}
                      className={`currency-option ${selectedCurrency === currency ? "active" : ""}`}
                      onClick={() => handleCurrencySelect(currency)}
                      role="option"
                      aria-selected={selectedCurrency === currency}
                    >
                      {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <a className="login" href="/login">Login</a>
            <a className="signup" href="/signup">Sign up</a>
          </div>
        </div>
      </header>
    </>
  );
}