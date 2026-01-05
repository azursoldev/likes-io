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
  const [username, setUsername] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get package info from URL params if available
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "16.99");
  const packageType = searchParams.get("type") || "High-Quality";
  
  // Format selected package from URL params
  const currencyCode = getCurrencySymbol() === "€" ? "EUR" : "USD";
  const selectedPackage = `${qty} Likes / ${formatPrice(priceValue)} ${currencyCode}`;

  // High-Quality Likes packages
  const highQualityPrices = [5.99, 10.99, 22.99, 16.99, 20.99, 47.99, 84.99];
  const highQualityQuantities = [50, 100, 250, 500, "1K", "2.5K", "5K"];
  
  // Premium Likes packages
  const premiumPrices = [7.49, 13.99, 29.99, 22.99, 34.99, 72.99, 124.99];
  const premiumQuantities = [50, 100, 250, 500, "1K", "2.5K", "5K"];

  // Use the appropriate package list based on packageType
  const packagePrices = packageType === "Premium" ? premiumPrices : highQualityPrices;
  const packageQuantities = packageType === "Premium" ? premiumQuantities : highQualityQuantities;
  
  const packages = packageQuantities.map((qty, idx) => {
    if (qty === "10K+") return "10K+ Custom";
    return `${qty} Likes / ${formatPrice(packagePrices[idx])} ${currencyCode}`;
  });
  
  packages.push("10K+ Custom");

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

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a YouTube channel URL or username");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/social/youtube/profile?username=${encodeURIComponent(username.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch channel");
      }

      if (data.profile) {
        // Use the resolved username (Channel ID) for the next step to ensure consistency
        // But we might want to keep the original input if the user prefers, 
        // however passing the ID ensures the next page doesn't need to re-resolve it.
        const resolvedUsername = data.profile.username; 
        router.push(`/youtube/likes/checkout/posts?username=${encodeURIComponent(resolvedUsername)}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`);
      } else {
        throw new Error("Channel not found");
      }
    } catch (err: any) {
      setError(err.message || "Could not find this YouTube channel. Please check the username.");
    } finally {
      setIsLoading(false);
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
          <h1 className="checkout-title">YouTube Likes Checkout</h1>
          <p className="checkout-subtitle">Start by entering your video link.</p>

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
                <label className="checkout-label">YouTube Channel</label>
                <input
                  type="text"
                  className="checkout-input"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter YouTube Channel URL or Username (e.g. LinusTechTips)"
                  disabled={isLoading}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
              <button type="submit" className="checkout-continue-btn" disabled={isLoading}>
                {isLoading ? "Checking..." : "Continue"}
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

