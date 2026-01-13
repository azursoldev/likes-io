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
  faVideo,
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../contexts/CurrencyContext";

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
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [inputType, setInputType] = useState<"video" | "channel" | null>(null);
  const [packages, setPackages] = useState<PackageTab[]>(initialPackages || []);
  const [loadingPackages, setLoadingPackages] = useState(!initialPackages);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get package info from URL params if available
  const initialQty = searchParams.get("qty") || "1000";
  const initialPrice = parseFloat(searchParams.get("price") || "29.99");
  const packageType = searchParams.get("type") || "High-Retention";
  
  const [qty, setQty] = useState(initialQty);
  const [priceValue, setPriceValue] = useState(initialPrice);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  
  // Fetch packages from CMS if not provided via props
  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) return;

    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/cms/service-pages/youtube/views");
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
  const selectedPackage = `${qty} Views - ${formatPrice(priceValue)}`;

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPackageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateInput = (value: string) => {
    if (!value) {
      setError("");
      setInputType(null);
      return;
    }

    // Check for Video Link
    const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (videoRegex.test(value)) {
      setInputType("video");
      setError("");
      return;
    }

    // Assume Channel/Username if not video
    // We don't strictly validate channel regex here because usernames can be anything
    setInputType("channel");
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setError("");
  };

  const handlePackageSelect = (pkg: PackageOption) => {
    setQty(typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty));
    setPriceValue(parseFloat(pkg.price.replace(/[^0-9.]/g, "")));
    if (pkg.serviceId) {
      setSelectedServiceId(pkg.serviceId);
    }
    setIsPackageOpen(false);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError("Please enter a video link or channel username");
      return;
    }

    // Basic email validation
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsValidating(true);
    setError("");

    // Determine input type
    let currentInputType = inputType;
    if (!currentInputType) {
        const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        if (videoRegex.test(inputValue)) {
            currentInputType = "video";
        } else {
            currentInputType = "channel";
        }
    }

    try {
      if (currentInputType === "video") {
         // Direct to Final Checkout
         const params = new URLSearchParams({
            videoLink: inputValue,
            qty: typeof qty === "string" ? qty : String(qty),
            price: String(priceValue),
            type: packageType,
            email
         });
         
         if (selectedServiceId) {
            params.append("serviceId", selectedServiceId);
         }
         
         const baseUrl = basePath || "/youtube/views";
         router.push(`${baseUrl}/checkout/final?${params.toString()}`);

      } else {
         // Validate Channel and Go to Posts Selection
         const response = await fetch(`/api/social/youtube/profile?username=${encodeURIComponent(inputValue.trim())}`);
         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || "Failed to fetch channel");
         }

         if (data.profile) {
            const resolvedUsername = data.profile.username;
            const params = new URLSearchParams({
                username: resolvedUsername,
                qty: typeof qty === "string" ? qty : String(qty),
                price: String(priceValue),
                type: packageType,
                email
            });
            if (selectedServiceId) {
                params.append("serviceId", selectedServiceId);
            }
            const baseUrl = basePath || "/youtube/views";
            router.push(`${baseUrl}/checkout/posts?${params.toString()}`);
         } else {
            throw new Error("Channel not found");
         }
      }
    } catch (err: any) {
      setError(err.message || "Could not validate input. Please check your link or username.");
    } finally {
      setIsValidating(false);
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
          <h1 className="checkout-title">YouTube Views Checkout</h1>
          <p className="checkout-subtitle">Start by entering your video link or channel username.</p>

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
                <label className="checkout-label">YouTube Channel / Video Link</label>
                <div style={{ position: 'relative' }}>
                    <input
                    type="text"
                    className="checkout-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter YouTube Video Link or Channel Username"
                    />
                    {isValidating && (
                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className="spinner-sm" style={{ 
                                width: '20px', 
                                height: '20px', 
                                border: '2px solid #f3f3f3', 
                                borderTop: '2px solid #0070f3', 
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite' 
                            }}></div>
                        </div>
                    )}
                </div>
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">Email Address</label>
                <input
                  type="email"
                  className="checkout-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email address"
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
                    <div className="checkout-dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {packages.length > 0 ? (
                        packages.map((tab) => (
                          <div key={tab.id}>
                            <div style={{ padding: '8px 15px', background: '#f8f9fa', fontWeight: 600, fontSize: '0.85rem', color: '#6c757d' }}>
                                {tab.label}
                            </div>
                            {tab.packages.map((pkg, index) => (
                              <button
                                key={index}
                                type="button"
                                className="checkout-dropdown-item"
                                style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                                onClick={() => handlePackageSelect(pkg)}
                              >
                                <span>{pkg.qty} Views</span>
                                <span>{pkg.price}</span>
                              </button>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="checkout-dropdown-item">Loading packages...</div>
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
              <button 
                type="submit" 
                className="checkout-continue-btn" 
                disabled={!inputValue || isValidating}
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
      <style jsx global>{`
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export function YouTubeViewsCheckout({ basePath, packages }: { basePath?: string; packages?: any[] }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent basePath={basePath} packages={packages} />
        </Suspense>
    )
}
