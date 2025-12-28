"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import PromoBar from "./PromoBar";
import NotificationBell from "./NotificationBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNavigation } from "../hooks/useNavigation";

export default function Header() {
  const { status } = useSession();
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
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
                  <a href={getLink("instagram", "likes")}>Buy Instagram Likes</a>
                  <a href={getLink("instagram", "followers")}>Buy Instagram Followers</a>
                  <a href={getLink("instagram", "views")}>Buy Instagram Views</a>
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
                  <a href={getLink("tiktok", "likes")}>Buy TikTok Likes</a>
                  <a href={getLink("tiktok", "followers")}>Buy TikTok Followers</a>
                  <a href={getLink("tiktok", "views")}>Buy TikTok Views</a>
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
                  <a href={getLink("youtube", "likes")}>Buy YouTube Likes</a>
                  <a href={getLink("youtube", "views")}>Buy YouTube Views</a>
                  <a href={getLink("youtube", "subscribers")}>Buy YouTube Subscribers</a>
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
        </div>
      </header>
    </>
  );
}
