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

export function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [videoLink, setVideoLink] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [linkValid, setLinkValid] = useState(false);
  const [packages, setPackages] = useState<PackageTab[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get package info from URL params if available
  const initialQty = searchParams.get("qty") || "1000";
  const initialPrice = parseFloat(searchParams.get("price") || "29.99");
  const packageType = searchParams.get("type") || "High-Retention";
  
  const [qty, setQty] = useState(initialQty);
  const [priceValue, setPriceValue] = useState(initialPrice);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  
  // Fetch packages from CMS
  useEffect(() => {
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

  const validateLink = async (link: string) => {
    if (!link) {
      setLinkError("");
      setLinkValid(false);
      return;
    }

    // Basic YouTube link validation regex
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(link)) {
        // Also allow channel links? No, views are for videos.
        setLinkError("Please enter a valid YouTube video URL");
        setLinkValid(false);
        return;
    }

    setIsValidating(true);
    setLinkError("");

    // Simulate API validation (or implement real one if needed)
    setTimeout(() => {
      setIsValidating(false);
      setLinkValid(true);
    }, 500);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVideoLink(val);
    validateLink(val);
  };

  const handlePackageSelect = (pkg: PackageOption) => {
    setQty(typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty));
    setPriceValue(parseFloat(pkg.price.replace(/[^0-9.]/g, "")));
    if (pkg.serviceId) {
      setSelectedServiceId(pkg.serviceId);
    }
    setIsPackageOpen(false);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (videoLink.trim() && linkValid) {
      // Navigate to final checkout directly, skipping posts selection
      const params = new URLSearchParams({
        videoLink: videoLink,
        qty: typeof qty === "string" ? qty : String(qty),
        price: String(priceValue),
        type: packageType,
      });
      
      if (selectedServiceId) {
        params.append("serviceId", selectedServiceId);
      }
      
      router.push(`/youtube/views/checkout/final?${params.toString()}`);
    } else if (!videoLink.trim()) {
        setLinkError("Please enter a video link");
    }
  };

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">YouTube Views Checkout</h1>
          
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-label">Details</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-label">Checkout</span>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleContinue}>
            <div className="form-group">
              <label htmlFor="videoLink" className="form-label">
                YouTube Video Link
              </label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faVideo} className="input-icon" />
                <input
                  type="text"
                  id="videoLink"
                  className={`form-input ${linkError ? "error" : ""} ${linkValid ? "valid" : ""}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoLink}
                  onChange={handleLinkChange}
                />
                {isValidating && <div className="spinner-sm"></div>}
              </div>
              {linkError && <p className="error-message">{linkError}</p>}
            </div>

            <div className="form-group" ref={dropdownRef}>
              <label className="form-label">Select Package</label>
              <div 
                className={`package-selector ${isPackageOpen ? "open" : ""}`}
                onClick={() => setIsPackageOpen(!isPackageOpen)}
              >
                <div className="selected-package">
                  <span>{selectedPackage}</span>
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
                
                {isPackageOpen && (
                  <div className="package-dropdown">
                    {packages.length > 0 ? (
                      packages.map((tab) => (
                        <div key={tab.id} className="package-group">
                          <div className="package-group-title">{tab.label}</div>
                          {tab.packages.map((pkg, index) => (
                            <div 
                              key={index} 
                              className="package-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePackageSelect(pkg);
                              }}
                            >
                              <span className="pkg-qty">{pkg.qty} Views</span>
                              <span className="pkg-price">{pkg.price}</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="package-option">
                        <span>Loading packages...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="order-summary-box">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Service</span>
                <span>YouTube Views</span>
              </div>
              <div className="summary-row">
                <span>Quantity</span>
                <span>{qty}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(priceValue)}</span>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <FontAwesomeIcon icon={faThumbsUp} className="feature-icon" />
                <span>High Quality</span>
              </div>
              <div className="feature-item">
                <FontAwesomeIcon icon={faShieldHalved} className="feature-icon" />
                <span>Non-Drop</span>
              </div>
              <div className="feature-item">
                <FontAwesomeIcon icon={faClock} className="feature-icon" />
                <span>Fast Delivery</span>
              </div>
              <div className="feature-item">
                <FontAwesomeIcon icon={faLock} className="feature-icon" />
                <span>Secure</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="checkout-continue-btn"
              disabled={!linkValid || !videoLink}
            >
              Continue
            </button>
          </form>
        </div>
      </main>
      <Footer />
      
      <style jsx>{`
        .checkout-page {
          min-height: 80vh;
          padding: 120px 20px 60px;
          background-color: #f8f9fa;
        }
        
        .checkout-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .checkout-title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          color: #1a1a1a;
        }
        
        .checkout-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          position: relative;
          z-index: 2;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #e9ecef;
          color: #adb5bd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .step.active .step-number {
          background: #0070f3;
          color: white;
        }
        
        .step-label {
          font-size: 0.8rem;
          color: #adb5bd;
          font-weight: 500;
        }
        
        .step.active .step-label {
          color: #0070f3;
        }
        
        .step-line {
          width: 60px;
          height: 2px;
          background: #e9ecef;
          margin: 0 10px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 25px;
          position: relative;
        }
        
        .form-label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #495057;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #adb5bd;
        }
        
        .form-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          border-color: #0070f3;
          outline: none;
          box-shadow: 0 0 0 4px rgba(0,112,243,0.1);
        }
        
        .form-input.valid {
          border-color: #28a745;
        }
        
        .form-input.error {
          border-color: #dc3545;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 5px;
        }
        
        .package-selector {
          position: relative;
          cursor: pointer;
        }
        
        .selected-package {
          width: 100%;
          padding: 15px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          transition: all 0.3s ease;
        }
        
        .package-selector.open .selected-package {
          border-color: #0070f3;
        }
        
        .package-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          margin-top: 5px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .package-group-title {
          padding: 10px 15px;
          background: #f8f9fa;
          font-weight: 600;
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        .package-option {
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }
        
        .package-option:hover {
          background: #f1f3f5;
        }
        
        .order-summary-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 25px;
        }
        
        .order-summary-box h3 {
          margin-bottom: 15px;
          font-size: 1.1rem;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #6c757d;
        }
        
        .summary-divider {
          height: 1px;
          background: #e9ecef;
          margin: 15px 0;
        }
        
        .summary-row.total {
          color: #1a1a1a;
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .feature-icon {
          color: #0070f3;
        }
        
        .checkout-continue-btn {
          width: 100%;
          padding: 16px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .checkout-continue-btn:hover {
          background: #0051a2;
        }
        
        .checkout-continue-btn:disabled {
          background: #a0c4f2;
          cursor: not-allowed;
        }

        .spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}
