"use client";

import { useState, Suspense, useEffect, useRef, useMemo } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faThumbsUp, 
  faCoffee, 
  faClock, 
  faShield, 
  faShieldHalved, 
  faLock, 
  faAngleDown, 
  faUser,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../contexts/CurrencyContext";

type PackageOption = {
  qty: number | string;
  price: string;
  strike?: string;
  offText?: string;
  serviceId?: string;
};

type PackageTab = {
  id: string;
  label: string;
  packages: PackageOption[];
};

function CheckoutContent({ basePath, packages: initialPackages }: { basePath?: string; packages?: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [packages, setPackages] = useState<PackageTab[]>(initialPackages || []);
  const [loadingPackages, setLoadingPackages] = useState(!initialPackages);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get package info from URL params if available
  const initialQty = searchParams.get("qty") || "500";
  const initialPrice = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";
  
  const [qty, setQty] = useState(initialQty);
  const [priceValue, setPriceValue] = useState(initialPrice);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  
  // Fetch packages from CMS if not provided via props
  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) return;
    
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/cms/service-pages/instagram/followers");
        if (response.ok) {
          const data = await response.json();
          if (data.packages && Array.isArray(data.packages) && data.packages.length > 0) {
            setPackages(data.packages);
            
            // Try to match initial package from URL params
            const allPackages: PackageOption[] = [];
            data.packages.forEach((tab: PackageTab) => {
              tab.packages.forEach((pkg: PackageOption) => {
                allPackages.push(pkg);
              });
            });
            
            // Find matching package from URL params
            const matchingPackage = allPackages.find((pkg) => {
              const pkgQty = typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty);
              const pkgPrice = parseFloat(pkg.price.replace(/[^0-9.]/g, ""));
              return pkgQty === initialQty && Math.abs(pkgPrice - initialPrice) < 0.01;
            });
            
            if (matchingPackage) {
              setQty(typeof matchingPackage.qty === "string" ? matchingPackage.qty : String(matchingPackage.qty));
              setPriceValue(parseFloat(matchingPackage.price.replace(/[^0-9.]/g, "")));
              if (matchingPackage.serviceId) {
                setSelectedServiceId(matchingPackage.serviceId);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    };
    
    fetchPackages();
  }, []);

  // Format selected package
  const currencyCode = getCurrencySymbol() === "€" ? "EUR" : "USD";
  const selectedPackage = useMemo(() => {
    const qtyDisplay = typeof qty === "string" ? qty : String(qty);
    return `${qtyDisplay} Followers / ${formatPrice(priceValue)} ${currencyCode}`;
  }, [qty, priceValue, formatPrice, currencyCode]);

  // Build package options list from CMS data (remove duplicates, prioritize ones with serviceId)
  const packageOptions = useMemo(() => {
    const optionsMap = new Map<string, { label: string; qty: string | number; price: number; tabLabel: string; serviceId?: string }>();
    
    packages.forEach((tab) => {
      tab.packages.forEach((pkg) => {
        const priceNum = parseFloat(pkg.price.replace(/[^0-9.]/g, "") || "0");
        const qtyDisplay = typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty);
        
        // Create a unique key based on quantity and price to avoid duplicates
        const uniqueKey = `${qtyDisplay}_${priceNum}`;
        
        // Only add if not already exists, or if this one has better discount info or serviceId
        const existing = optionsMap.get(uniqueKey);
        if (!existing || pkg.offText || (pkg.serviceId && !existing.serviceId)) {
          const offText = pkg.offText ? ` - ${pkg.offText}` : "";
          optionsMap.set(uniqueKey, {
            label: `${qtyDisplay} Followers / ${formatPrice(priceNum)} ${currencyCode}${offText}`,
            qty: pkg.qty,
            price: priceNum,
            tabLabel: tab.label,
            serviceId: pkg.serviceId,
          });
        }
      });
    });
    
    // Convert map to array and sort by quantity (numeric first, then string)
    return Array.from(optionsMap.values()).sort((a, b) => {
      const aQty = typeof a.qty === "string" ? parseFloat(a.qty.replace(/[^0-9.]/g, "")) || 999999 : a.qty;
      const bQty = typeof b.qty === "string" ? parseFloat(b.qty.replace(/[^0-9.]/g, "")) || 999999 : b.qty;
      return aQty - bQty;
    });
  }, [packages, formatPrice, currencyCode]);

  // Validate Instagram username via API
  const validateUsername = async (usernameValue: string): Promise<boolean> => {
    if (!usernameValue.trim()) {
      setUsernameError("Please enter your Instagram username");
      setUsernameValid(false);
      return false;
    }

    setIsValidating(true);
    setUsernameError("");

    try {
      const response = await fetch(`/api/instagram/validate-username?username=${encodeURIComponent(usernameValue)}`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setUsernameValid(true);
        setUsernameError("");
        setIsValidating(false);
        return true;
      } else {
        setUsernameValid(false);
        setUsernameError(data.error || "Invalid username");
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

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
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

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    
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
    // This is now an async check that blocks continuation until resolved
    const isUsernameValid = await validateUsername(username);
    
    if (isUsernameValid) {
      // Navigate to posts selection page
      const params = new URLSearchParams({
        username: username,
        email: email,
        qty: typeof qty === "string" ? qty : String(qty),
        price: String(priceValue),
        type: packageType,
      });
      if (selectedServiceId) {
        params.append("serviceId", selectedServiceId);
      }
      router.push(`/instagram/followers/checkout/final?${params.toString()}`);
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
          <h1 className="checkout-title">Instagram Followers Checkout</h1>
          <p className="checkout-subtitle">Start by entering your username.</p>

          {/* Features List Card */}
          <div className="checkout-card checkout-features-card">
            <div className="checkout-features">
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faUser} className="checkout-feature-icon" />
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
                <label className="checkout-label">Instagram username</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className={`checkout-input ${usernameError ? "checkout-input-error" : ""} ${usernameValid ? "checkout-input-valid" : ""}`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    placeholder="Enter your Instagram username"
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
                {usernameError && (
                  <span style={{
                    display: "block",
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#ef4444"
                  }}>
                    {usernameError}
                  </span>
                )}
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
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      width: "16px",
                      height: "16px"
                    }}
                  />
                </div>
                {emailError && (
                  <span style={{
                    display: "block",
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#ef4444"
                  }}>
                    {emailError}
                  </span>
                )}
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">Product package</label>
                <div className="checkout-dropdown-wrapper" ref={dropdownRef}>
                  <button
                    type="button"
                    className="checkout-dropdown"
                    onClick={() => setIsPackageOpen(!isPackageOpen)}
                    disabled={loadingPackages}
                  >
                    <span>{loadingPackages ? "Loading packages..." : selectedPackage}</span>
                    <FontAwesomeIcon icon={faAngleDown} className="checkout-dropdown-icon" />
                  </button>
                  {isPackageOpen && !loadingPackages && (
                    <div className="checkout-dropdown-menu">
                      {packageOptions.length === 0 ? (
                        <div style={{ padding: "12px", textAlign: "center", color: "#666" }}>
                          No packages available
                        </div>
                      ) : (
                        packageOptions.map((pkg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="checkout-dropdown-item"
                            onClick={() => {
                              setQty(typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty));
                              setPriceValue(pkg.price);
                              setSelectedServiceId(pkg.serviceId || "");
                              setIsPackageOpen(false);
                            }}
                          >
                            {pkg.label}
                          </button>
                        ))
                      )}
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
         
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function InstagramFollowersCheckout({ basePath, packages }: { basePath?: string; packages?: any[] }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CheckoutContent basePath={basePath} packages={packages} />
    </Suspense>
  );
}
