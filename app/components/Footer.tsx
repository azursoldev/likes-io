"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigation } from "../hooks/useNavigation";
import { useSettings } from "../contexts/SettingsContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { footerLogoUrl, footerMenu, footerColumnMenus } = useSettings() as any;
  const [showTooltip, setShowTooltip] = useState(false);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { getLink, loading } = useNavigation();
  const footerMenuItems =
    Array.isArray(footerMenu) && footerMenu.length > 0
      ? footerMenu
      : [
          { id: "fallback-faq", label: "FAQ", url: "/faq" },
          { id: "fallback-blog", label: "Blog", url: "/blog" },
          { id: "fallback-about", label: "About Us", url: "/about" },
          { id: "fallback-team", label: "Our Team", url: "/team" },
          { id: "fallback-contact", label: "Contact Us", url: "/contact" },
          { id: "fallback-terms", label: "Terms of Service", url: "/terms" },
          { id: "fallback-privacy", label: "Privacy Policy", url: "/privacy" },
        ];
  const configuredFooterColumns =
    Array.isArray(footerColumnMenus) && footerColumnMenus.length > 0 ? footerColumnMenus : null;

  const [systemStatusEnabled, setSystemStatusEnabled] = useState(false);
  const [systemStatus, setSystemStatus] = useState("Operational");
  const [systemStatusMessage, setSystemStatusMessage] = useState("All Systems Operational");

  useEffect(() => {
    fetch("/api/cms/system-status")
      .then(res => res.json())
      .then(data => {
        setSystemStatusEnabled(data.systemStatusEnabled);
        setSystemStatus(data.systemStatus);
        setSystemStatusMessage(data.systemStatusMessage);
      })
      .catch(err => console.error("Failed to fetch system status:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langBtnRef.current &&
        tooltipRef.current &&
        !langBtnRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showTooltip]);

  const handleLangClick = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <footer className="site-footer">
      {systemStatusEnabled && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '24px 0 0 0',
          width: '100%'
        }}>
          <div className="system-status-banner" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            color: '#1f2937',
            padding: '8px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {systemStatus === 'Operational' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10B981"/>
                <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : systemStatus === 'Degraded' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#F59E0B"/>
                <path d="M12 8V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : systemStatus === 'Maintenance' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#3B82F6"/>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="white"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#EF4444"/>
                <path d="M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span>{systemStatusMessage}</span>
          </div>
        </div>
      )}
      <div className="container">
        {/* Top row nav */}
        <div className="footer-top">
          <nav className="footer-top-nav">
            {footerMenuItems.map((item: any) => (
              <a key={item.id} href={item.url || "#"}>
                {item.label || "Menu item"}
              </a>
            ))}
          </nav>
          <div className="footer-lang">
            <div className="lang-wrapper">
              {showTooltip && (
                <div className="lang-tooltip" ref={tooltipRef}>
                  More languages coming soon!
                </div>
              )}
              <button
                ref={langBtnRef}
                className={`lang-btn ${showTooltip ? "active" : ""}`}
                aria-label="Change language"
                onClick={handleLangClick}
                type="button"
              >
                <span className="flag" aria-hidden>
                  <img src="/flag-eng.PNG" alt="English flag" />
                </span>
                <span className="lang-label">English</span>
                <span className="caret" aria-hidden>▾</span>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Columns */}
        {configuredFooterColumns ? (
          <div className="footer-columns">
            {configuredFooterColumns.map((column: any, columnIndex: number) => (
              <div className="f-col" key={column.id || columnIndex}>
                <h4>{column.title || "Column"}</h4>
                <ul>
                  {Array.isArray(column.items) &&
                    column.items.map((item: any, itemIndex: number) => (
                      <li key={item.id || itemIndex}>
                        {item.url ? (
                          <a href={item.url}>{item.label || "Link"}</a>
                        ) : (
                          <span>{item.label || "Link"}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="footer-columns">
            <div className="f-col">
              <h4>Instagram Services</h4>
              <ul>
                <li><a href={loading ? "#" : getLink("instagram", "likes")}>Buy Instagram Likes</a></li>
                <li><a href={loading ? "#" : getLink("instagram", "followers")}>Buy Instagram Followers</a></li>
                <li><a href={loading ? "#" : getLink("instagram", "views")}>Buy Instagram Views</a></li>
              </ul>
            </div>
            <div className="f-col">
              <h4>TikTok Services</h4>
              <ul>
                <li><a href={loading ? "#" : getLink("tiktok", "likes")}>Buy TikTok Likes</a></li>
                <li><a href={loading ? "#" : getLink("tiktok", "followers")}>Buy TikTok Followers</a></li>
                <li><a href={loading ? "#" : getLink("tiktok", "views")}>Buy TikTok Views</a></li>
              </ul>
            </div>
            <div className="f-col">
              <h4>YouTube Services</h4>
              <ul>
                <li><a href={loading ? "#" : getLink("youtube", "views")}>Buy YouTube Views</a></li>
                <li><a href={loading ? "#" : getLink("youtube", "subscribers")}>Buy YouTube Subscribers</a></li>
                <li><a href={loading ? "#" : getLink("youtube", "likes")}>Buy YouTube Likes</a></li>
              </ul>
            </div>
            <div className="f-col">
              <h4>Tools & Resources</h4>
              <ul>
                <li><a href="/free-instagram-likes">Free Instagram Likes</a></li>
                <li><a href="/free-instagram-followers">Free Instagram Followers</a></li>
                <li><a href="/reviews">Reviews</a></li>
              </ul>
            </div>
            <div className="f-col">
              <h4>My Account</h4>
              <ul>
                <li><a href="/login">Log In</a></li>
                <li><a href="/signup">Sign Up</a></li>
              </ul>
            </div>
            <div className="f-col">
              <h4>Affiliate Program</h4>
              <ul>
                <li><a href="/affiliate">Become an Affiliate</a></li>
                <li>
                  <a href="/login" className="login-link">Log in</a>
                  <span className="login-note"> to view stats.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="brand">
            {footerLogoUrl ? (
              <img src={footerLogoUrl} alt="Likes.io" style={{ maxHeight: '40px' }} />
            ) : (
              <>
                <span className="logo-text">Likes</span>
                <span className="logo-dot">.io</span>
              </>
            )}
          </div>
          <p className="copyright">
            Copyright © {year} Likes.io. All Rights Reserved.
          </p>
          <div className="payments">
            <img src="/likes.io payment methods .svg" alt="Payment methods" />
          </div>
        </div>
      </div>
    </footer>
  );
}
