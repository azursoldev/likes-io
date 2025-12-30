"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import PromoBar from "./PromoBar";
import NotificationBell from "./NotificationBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faBars, faTimes, faClock, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useCurrency } from "../contexts/CurrencyContext";
import { useSettings } from "../contexts/SettingsContext";
import { useNavigation } from "../hooks/useNavigation";

export default function Header() {
  const { status } = useSession();
  const { currency, setCurrency } = useCurrency();
  const { headerLogoUrl } = useSettings();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { getLink } = useNavigation();

  const currencies = ["USD", "EUR"] as const;

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleCurrencySelect = (selectedCurrency: typeof currencies[number]) => {
    setCurrency(selectedCurrency);
    setIsCurrencyOpen(false);
  };

  return (
    <>
      <PromoBar />
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <a href="/" className="brand-logo">
              {headerLogoUrl ? (
                <img src={headerLogoUrl} alt="Likes.io" style={{ maxHeight: '40px' }} />
              ) : (
                <>
                  <span className="logo-text">Likes</span>
                  <span className="logo-dot">.io</span>
                </>
              )}
            </a>
          </div>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          {isMobileMenuOpen && (
            <div 
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          <nav className={`nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {isMobileMenuOpen && (
              <>
                <div className="mobile-menu-header">
                  <a href="/" className="mobile-menu-logo" onClick={() => setIsMobileMenuOpen(false)}>
                    {headerLogoUrl ? (
                      <img src={headerLogoUrl} alt="Likes.io" style={{ maxHeight: '40px' }} />
                    ) : (
                      <>
                        <span className="logo-text">Likes</span>
                        <span className="logo-dot">.io</span>
                      </>
                    )}
                  </a>
                  <button 
                    className="mobile-menu-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </>
            )}
            <div className="nav-item">
              <a href="#instagram" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Instagram
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href={getLink("instagram", "likes")} onClick={() => setIsMobileMenuOpen(false)}>Buy Instagram Likes</a>
                  <a href={getLink("instagram", "followers")} onClick={() => setIsMobileMenuOpen(false)}>Buy Instagram Followers</a>
                  <a href={getLink("instagram", "views")} onClick={() => setIsMobileMenuOpen(false)}>Buy Instagram Views</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#tiktok" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                TikTok
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href={getLink("tiktok", "likes")} onClick={() => setIsMobileMenuOpen(false)}>Buy TikTok Likes</a>
                  <a href={getLink("tiktok", "followers")} onClick={() => setIsMobileMenuOpen(false)}>Buy TikTok Followers</a>
                  <a href={getLink("tiktok", "views")} onClick={() => setIsMobileMenuOpen(false)}>Buy TikTok Views</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#youtube" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                YouTube
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href={getLink("youtube", "likes")} onClick={() => setIsMobileMenuOpen(false)}>Buy YouTube Likes</a>
                  <a href={getLink("youtube", "views")} onClick={() => setIsMobileMenuOpen(false)}>Buy YouTube Views</a>
                  <a href={getLink("youtube", "subscribers")} onClick={() => setIsMobileMenuOpen(false)}>Buy YouTube Subscribers</a>
                </div>
              </div>
            </div>
            <a href="/faq" className="nav-link-with-icon" onClick={() => setIsMobileMenuOpen(false)}>
              <FontAwesomeIcon icon={faClock} className="nav-icon" />
              FAQ
            </a>
            <a href="/blog" className="nav-link-with-icon" onClick={() => setIsMobileMenuOpen(false)}>
              <FontAwesomeIcon icon={faBookOpen} className="nav-icon" />
              Blog
            </a>
            {isMobileMenuOpen && (
              <div className="header-actions mobile-menu-open">
                {status === "authenticated" ? (
                  <>
                    <a className="login" href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>My account</a>
                    <button
                      type="button"
                      className="signup"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a className="signup mobile-signup-btn" href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</a>
                    <a className="login mobile-login-link" href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</a>
                  </>
                )}
              </div>
            )}
          </nav>
          <div className="header-actions">
            <NotificationBell />
            <div className="currency-selector" ref={currencyRef}>
              <div 
                className="currency-trigger" 
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={isCurrencyOpen}
              >
                {currency} 
                <span className="caret">{isCurrencyOpen ? "▴" : "▾"}</span>
              </div>
              {isCurrencyOpen && (
                <div className="currency-dropdown">
                  {currencies.map((currencyItem) => (
                    <div
                      key={currencyItem}
                      className={`currency-option ${currency === currencyItem ? "active" : ""}`}
                      onClick={() => handleCurrencySelect(currencyItem)}
                      role="option"
                      aria-selected={currency === currencyItem}
                    >
                      {currencyItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {status === "authenticated" ? (
              <>
                <a className="login" href="/dashboard">My account</a>
                <button
                  type="button"
                  className="signup"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a className="login" href="/login">Login</a>
                <a className="signup" href="/signup">Sign up</a>
              </>
            )}
          </div>
    </>
  );
}
