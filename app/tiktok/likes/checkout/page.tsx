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
  faAngleDown,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCurrency } from "../../../contexts/CurrencyContext";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

 

  // Get package info from URL params if available
  const qty = searchParams.get("qty") || "1K";
  const priceValue = parseFloat(searchParams.get("price") || "14.99");
  const packageType = searchParams.get("type") || "High-Quality";
  
  // Format selected package from URL params
  const currencyCode = getCurrencySymbol() === "€" ? "EUR" : "USD";
  const selectedPackage = `${qty} Likes / ${formatPrice(priceValue)} ${currencyCode}`;

  // High-Quality Likes packages
  const highQualityPrices = [2.99, 5.99, 9.99, 14.99, 29.99, 44.99, 69.99];
  const highQualityQuantities = [100, 250, 500, "1K", "2.5K", "5K", "10K"];
  
  // Premium Likes packages
  const premiumPrices = [4.49, 9.49, 15.99, 27.99, 54.99, 89.99, 149.99];
  const premiumQuantities = [100, 250, 500, "1K", "2.5K", "5K", "10K"];

  // Use the appropriate package list based on packageType
  const isPremium = packageType.includes("Premium");
  const packagePrices = isPremium ? premiumPrices : highQualityPrices;
  const packageQuantities = isPremium ? premiumQuantities : highQualityQuantities;
  
  // Check if current package is a custom/special package
  const currentQtyIndex = packageQuantities.findIndex(q => String(q) === qty);
  const isCustomPrice = currentQtyIndex !== -1 && Math.abs(packagePrices[currentQtyIndex] - priceValue) > 0.01;
  const isCustomQty = currentQtyIndex === -1;
  const isCustomPackage = isCustomPrice || isCustomQty;

  let packages: string[];
  
  if (isCustomPackage) {
    // If it's a custom package (different price or quantity than standard), 
    // show only this package to avoid confusion
    packages = [`${qty} Likes / ${formatPrice(priceValue)} ${currencyCode}`];
  } else {
    packages = packageQuantities.map((q, idx) => {
      if (q === "25K+") return "25K+ Custom";
      return `${q} Likes / ${formatPrice(packagePrices[idx])} ${currencyCode}`;
    });
    packages.push("25K+ Custom");
  }

  const handlePackageSelect = (index: number) => {
    setIsPackageOpen(false);
    
    if (isCustomPackage) {
      // If it's a custom package, there's only one option (index 0)
      return;
    }

    // Handle custom package case (last item)
    if (index >= packageQuantities.length) {
      // Logic for custom package if needed, or just close for now
      return;
    }

    const newQty = packageQuantities[index];
    const newPrice = packagePrices[index];
    
    // Update URL with new package details
    router.push(`/tiktok/likes/checkout?qty=${newQty}&price=${newPrice}&type=${encodeURIComponent(packageType)}`);
  };

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

  // Validate Email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate TikTok username via API
  const validateUsername = async (usernameValue: string) => {
    if (!usernameValue.trim()) {
      setUsernameError("Please enter your TikTok username");
      setUsernameValid(false);
      return false;
    }

    setIsValidating(true);
    setUsernameError("");

    try {
      // Use the profile endpoint to validate username
      const response = await fetch(`/api/social/tiktok/profile?username=${encodeURIComponent(usernameValue)}`);
      const data = await response.json();

      if (response.ok && data.profile) {
        setUsernameValid(true);
        setUsernameError("");
        setIsValidating(false);
        return true;
      } else {
        setUsernameValid(false);
        setUsernameError(data.error || "Invalid username or profile not found");
        setIsValidating(false);
        return false;
      }
    } catch (error) {
      console.error("Error validating username:", error);
      setUsernameValid(false);
      setUsernameError("Failed to validate username. Please try again.");
      setIsValidating(false);
      return false;
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    setUsernameError("");

    // First validate email format locally
    let isEmailValid = true;
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      isEmailValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isEmailValid = false;
    }

    if (!isEmailValid) {
        return;
    }

    // Then validate username via API
    const isUsernameValid = await validateUsername(username);

    if (isUsernameValid) {
      // Navigate to posts selection page
      router.push(`/tiktok/likes/checkout/posts?username=${encodeURIComponent(username)}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}&email=${encodeURIComponent(email)}`);
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
          <h1 className="checkout-title">TikTok Likes Checkout</h1>
          <p className="checkout-subtitle">Start by entering your username.</p>

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
                <label className="checkout-label">TikTok username</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className={`checkout-input ${usernameError ? "checkout-input-error" : ""} ${usernameValid ? "checkout-input-valid" : ""}`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    placeholder="Enter your TikTok username"
                    disabled={isValidating}
                  />
                  {isValidating && (
                    <span style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      color: "#666"
                    }}>
                      Validating...
                    </span>
                  )}
                  {usernameValid && !isValidating && (
                    <span style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      color: "#10b981"
                    }}>
                      ✓ Valid
                    </span>
                  )}
                </div>
                {usernameError && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{usernameError}</p>}
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">Email address</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    className={`checkout-input ${emailError ? "checkout-input-error" : ""}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter your email address"
                  />
                  <div style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                </div>
                {emailError && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{emailError}</p>}
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
                          onClick={() => handlePackageSelect(idx)}
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
              <button 
                type="submit" 
                className="checkout-continue-btn"
                disabled={isValidating}
                style={{ opacity: isValidating ? 0.7 : 1, cursor: isValidating ? 'not-allowed' : 'pointer' }}
              >
                {isValidating ? "Validating..." : "Continue"}
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

