"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import PromoBar from "./PromoBar";
import NotificationBell from "./NotificationBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faBars, faTimes, faClock, faBook } from "@fortawesome/free-solid-svg-icons";
import { useCurrency } from "../contexts/CurrencyContext";
import { useSettings } from "../contexts/SettingsContext";
import { useNavigation } from "../hooks/useNavigation";
import "../mobile-response.css";

export default function Header() {
  const { status } = useSession();
  const { currency, setCurrency } = useCurrency();
  const { headerLogoUrl } = useSettings();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { getLink, loading } = useNavigation();

  const currencies = ["USD", "EUR"] as const;

  const toggleMobileSection = (section: string) => {
    setMobileExpanded(mobileExpanded === section ? null : section);
  };

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
          <nav className="nav">
            <div className="nav-item">
              <a href="#instagram" className="nav-link">
                Instagram
                <FontAwesomeIcon icon={faAngleDown} className="caret caret-down" aria-hidden="true" />
                <FontAwesomeIcon icon={faAngleUp} className="caret caret-up" aria-hidden="true" />
              </a>
              <div className="nav-dropdown-wrap">
                <div className="nav-dropdown">
                  <a href={loading ? "#" : getLink("instagram", "likes")}>Buy Instagram Likes</a>
                  <a href={loading ? "#" : getLink("instagram", "followers")}>Buy Instagram Followers</a>
                  <a href={loading ? "#" : getLink("instagram", "views")}>Buy Instagram Views</a>
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
                  <a href={loading ? "#" : getLink("tiktok", "likes")}>Buy TikTok Likes</a>
                  <a href={loading ? "#" : getLink("tiktok", "followers")}>Buy TikTok Followers</a>
                  <a href={loading ? "#" : getLink("tiktok", "views")}>Buy TikTok Views</a>
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
                  <a href={loading ? "#" : getLink("youtube", "likes")}>Buy YouTube Likes</a>
                  <a href={loading ? "#" : getLink("youtube", "views")}>Buy YouTube Views</a>
                  <a href={loading ? "#" : getLink("youtube", "subscribers")}>Buy YouTube Subscribers</a>
                </div>
              </div>
            </div>
            <a href="/faq">FAQ</a>
            <a href="/blog">Blog</a>
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
                  onClick={async () => {
                    try {
                      await signOut({ redirect: false });
                    } finally {
                      window.location.href = window.location.origin + "/login";
                    }
                  }}
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
          <div className="mobile-icons">
             <NotificationBell />
             <button 
               className="mobile-menu-toggle"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               aria-label="Toggle menu"
             >
               <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
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
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="mobile-nav-list">
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileSection('instagram')}>
              <span className="nav-text-icon">Instagram</span>
              <FontAwesomeIcon icon={mobileExpanded === 'instagram' ? faAngleUp : faAngleDown} className="nav-chevron" />
            </button>
            <div className={`mobile-dropdown ${mobileExpanded === 'instagram' ? 'open' : ''}`}>
               <a href={loading ? "#" : getLink("instagram", "likes")} className="mobile-dropdown-link">Buy Instagram Likes</a>
               <a href={loading ? "#" : getLink("instagram", "followers")} className="mobile-dropdown-link">Buy Instagram Followers</a>
               <a href={loading ? "#" : getLink("instagram", "views")} className="mobile-dropdown-link">Buy Instagram Views</a>
            </div>
          </div>
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileSection('tiktok')}>
              <span className="nav-text-icon">TikTok</span>
              <FontAwesomeIcon icon={mobileExpanded === 'tiktok' ? faAngleUp : faAngleDown} className="nav-chevron" />
            </button>
            <div className={`mobile-dropdown ${mobileExpanded === 'tiktok' ? 'open' : ''}`}>
               <a href={loading ? "#" : getLink("tiktok", "likes")} className="mobile-dropdown-link">Buy TikTok Likes</a>
               <a href={loading ? "#" : getLink("tiktok", "followers")} className="mobile-dropdown-link">Buy TikTok Followers</a>
               <a href={loading ? "#" : getLink("tiktok", "views")} className="mobile-dropdown-link">Buy TikTok Views</a>
            </div>
          </div>
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileSection('youtube')}>
              <span className="nav-text-icon">YouTube</span>
              <FontAwesomeIcon icon={mobileExpanded === 'youtube' ? faAngleUp : faAngleDown} className="nav-chevron" />
            </button>
            <div className={`mobile-dropdown ${mobileExpanded === 'youtube' ? 'open' : ''}`}>
               <a href={loading ? "#" : getLink("youtube", "likes")} className="mobile-dropdown-link">Buy YouTube Likes</a>
               <a href={loading ? "#" : getLink("youtube", "views")} className="mobile-dropdown-link">Buy YouTube Views</a>
               <a href={loading ? "#" : getLink("youtube", "subscribers")} className="mobile-dropdown-link">Buy YouTube Subscribers</a>
            </div>
          </div>
          <div className="mobile-nav-item">
            <a href="/faq" className="mobile-nav-link">
              <span className="nav-text-icon">
                <FontAwesomeIcon icon={faClock} className="nav-icon" />
                FAQ
              </span>
            </a>
          </div>
          <div className="mobile-nav-item">
            <a href="/blog" className="mobile-nav-link">
              <span className="nav-text-icon">
                <FontAwesomeIcon icon={faBook} className="nav-icon" />
                Blog
              </span>
            </a>
          </div>
        </nav>
        
        <div className="mobile-actions">
           {/* Currency Selector Mobile */}
            <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
              <div 
                className="mobile-nav-link" 
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                style={{ padding: '0', marginBottom: '0.5rem' }}
              >
                 <span className="nav-text-icon">Currency: {currency}</span>
                 <FontAwesomeIcon icon={isCurrencyOpen ? faAngleUp : faAngleDown} className="nav-chevron" />
              </div>
              {isCurrencyOpen && (
                <div className="currency-dropdown" style={{position:'static', width:'100%', boxShadow:'none', border:'1px solid #eee'}}>
                   {currencies.map((c) => (
                     <div key={c} className={`currency-option ${currency === c ? "active" : ""}`} onClick={() => { setCurrency(c); setIsCurrencyOpen(false); }}>
                       {c}
                     </div>
                   ))}
                </div>
              )}
            </div>
            
           <div className="mobile-auth-buttons">
              {status === "authenticated" ? (
                <>
                  <a className="mobile-btn-secondary" href="/dashboard">My account</a>
                  <button
                    className="mobile-btn-primary"
                    onClick={async () => {
                      try {
                        await signOut({ redirect: false });
                      } finally {
                        window.location.href = window.location.origin + "/login";
                      }
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a className="mobile-btn-secondary" href="/login">Log In</a>
                  <a className="mobile-btn-primary" href="/signup">Sign Up</a>
                </>
              )}
           </div>
        </div>
      </div>
    </>
  );
}
