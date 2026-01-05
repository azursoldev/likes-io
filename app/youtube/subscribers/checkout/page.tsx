"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faThumbsUp, 
  faCoffee, 
  faClock, 
  faShield,
  faShieldHalved,
  faLock,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../contexts/CurrencyContext";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [username, setUsername] = useState("kyliejenner");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get package info from URL params if available
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "34.99");
  const packageType = searchParams.get("type") || "High-Quality";
  
  // Format selected package from URL params
  const currencyCode = getCurrencySymbol() === "€" ? "EUR" : "USD";
  const selectedPackage = `${qty} Subscribers / ${formatPrice(priceValue)} ${currencyCode}`;

  // High-Quality Subscribers packages
  const highQualityPrices = [24.99, 41.99, 74.99, 34.99, 54.99, 109.99, 179.99];
  const highQualityQuantities = [50, 100, 250, 500, "1K", "2.5K", "5K"];
  
  // Premium Subscribers packages
  const premiumPrices = [30.99, 53.99, 104.99, 44.99, 79.99, 169.99, 289.99];
  const premiumQuantities = [50, 100, 250, 500, "1K", "2.5K", "5K"];

  // Use the appropriate package list based on packageType
  const packagePrices = packageType === "Premium" ? premiumPrices : highQualityPrices;
  const packageQuantities = packageType === "Premium" ? premiumQuantities : highQualityQuantities;
  
  const packages = packageQuantities.map((qty, idx) => {
    if (qty === "10,000+") return "10,000+ Custom";
    return `${qty} Subscribers / ${formatPrice(packagePrices[idx])} ${currencyCode}`;
  });
  
  packages.push("10,000+ Custom");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPackageOpen(false);
      }
    };

    if (isPackageOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isPackageOpen]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Navigate directly to final checkout step for subscribers
      router.push(`/youtube/subscribers/checkout/final?username=${encodeURIComponent(username)}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`);
    }
  };

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          {/* Selection Indicator */}
          <div className="checkout-indicator">
            <div className="checkout-indicator-dot"></div>
            <span className="checkout-indicator-text">SELECTION</span>
          </div>

          {/* Title and Subtitle */}
          <h1 className="checkout-title">YouTube Subscribers Checkout</h1>
          <p className="checkout-subtitle">Start by entering your channel URL.</p>

          {/* Features List Card */}
          <div className="checkout-card checkout-features-card">
            <div className="checkout-features">
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faThumbsUp} className="checkout-feature-icon" />
                <span>Internationally acclaimed services & top ratings.</span>
              </div>
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faCoffee} className="checkout-feature-icon" />
                <span>24/7 support team ready to help.</span>
              </div>
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faClock} className="checkout-feature-icon" />
                <span>10+ years in the marketing business.</span>
              </div>
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faShield} className="checkout-feature-icon" />
                <span>PCI DSS compliant payment system using 256-bit encryption.</span>
              </div>
            </div>
          </div>

          {/* Form Section Card */}
          <div className="checkout-card checkout-form-card">
            <form className="checkout-form" onSubmit={handleContinue}>
              <div className="checkout-form-group">
                <label className="checkout-label">YouTube channel URL</label>
                <input
                  type="text"
                  className="checkout-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your YouTube channel URL"
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">Product package</label>
                <div className="checkout-dropdown-wrapper" ref={dropdownRef}>
                  <button
                    type="button"
                    className="checkout-dropdown"
                    onClick={() => setIsPackageOpen(!isPackageOpen)}
                  >
                    <span>{selectedPackage}</span>
                    <FontAwesomeIcon icon={faAngleDown} className="checkout-dropdown-icon" />
                  </button>
                  {isPackageOpen && (
                    <div className="checkout-dropdown-menu">
                      {packages.map((pkg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="checkout-dropdown-item"
                          onClick={() => {
                            setIsPackageOpen(false);
                          }}
                        >
                          {pkg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Disclaimer */}
              <p className="checkout-legal">
                By continuing, you agree to our{" "}
                <a href="/terms" className="checkout-link">terms of service</a> and{" "}
                <a href="/privacy" className="checkout-link">privacy policy</a>.
              </p>

              {/* Continue Button */}
              <button type="submit" className="checkout-continue-btn">
                Continue
              </button>

              {/* Security Assurance */}
              <div className="checkout-security">
                <div className="checkout-security-item">
                  <FontAwesomeIcon icon={faShieldHalved} className="checkout-security-icon" />
                  <span>Account-Safe Delivery</span>
                </div>
                <div className="checkout-security-item">
                  <FontAwesomeIcon icon={faLock} className="checkout-security-icon" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </form>
          </div>

          {/* Payment Methods Card */}
          <div className="checkout-card checkout-payment-card">
            <div className="checkout-payment">
              <span className="checkout-payment-label">Pay securely with</span>
              <div className="checkout-payment-icons">
                {/* iCH Logo */}
                <div className="checkout-payment-icon-wrapper">
                  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="40" rx="6" fill="#0066CC"/>
                    <circle cx="12" cy="12" r="3" fill="#FFA500"/>
                    <text x="30" y="26" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="1px">iCH</text>
                  </svg>
                </div>
                {/* Mastercard Logo */}
                <div className="checkout-payment-icon-wrapper">
                  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="40" rx="6" fill="#1A1F71"/>
                    <circle cx="20" cy="20" r="9" fill="#EB001B"/>
                    <circle cx="40" cy="20" r="9" fill="#F79E1B"/>
                    <circle cx="30" cy="20" r="8.5" fill="#FF5F00"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

