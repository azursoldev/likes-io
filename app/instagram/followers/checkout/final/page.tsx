"use client";

import { useState, Suspense, useEffect } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faHeart,
  faChevronRight,
  faLock,
  faCreditCard,
  faInfoCircle,
  faLink,
  faShieldHalved,
  faTag,
  faCoins,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import Link from "next/link";

export function FinalCheckoutContent({ basePath }: { basePath?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { formatPrice, getCurrencySymbol, currency } = useCurrency();
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";
  const postLink = searchParams.get("postLink") || "";
  const packageServiceId = searchParams.get("serviceId") || "";

  // Get platform and service from pathname or use basePath
  const pathParts = pathname?.split("/") || [];
  const platform = pathParts[1] || "instagram";
  const service = pathParts[2] || "followers";
  
  // Create URLs for navigation
  const baseUrl = basePath || `/${platform}/${service}`;
  const detailsUrl = `${baseUrl}/checkout?qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`;
  // No postsUrl for followers

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "PERCENT" | "FIXED";
    value: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [addedOffers, setAddedOffers] = useState<Array<{id: string; text: string; price: number; icon: any}>>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [offers, setOffers] = useState<Array<{id: string; text: string; price: number; originalPrice: number; icon: any}>>([]);

  useEffect(() => {
    fetch('/api/upsells?platform=INSTAGRAM&serviceType=FOLLOWERS')
      .then(res => res.json())
      .then(data => {
        if (data.upsells && Array.isArray(data.upsells) && data.upsells.length > 0) {
          setOffers(data.upsells.map((u: any) => {
            let p = u.basePrice;
            if (u.discountType === 'PERCENT') {
              p -= (p * u.discountValue / 100);
            } else {
              p -= u.discountValue;
            }
            return {
              id: u.id,
              text: u.title,
              price: Math.max(0, p),
              originalPrice: u.basePrice,
              icon: u.badgeIcon === 'tag' ? faTag : faUser
            };
          }));
        } else {
          setOffers([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch upsells:", err);
        setOffers([]);
      });
  }, []);

  const handleAddOffer = (offer: typeof offers[0]) => {
    if (!addedOffers.find(o => o.id === offer.id)) {
      setAddedOffers([...addedOffers, offer]);
    }
  };

  const handleRemoveOffer = (offerId: string) => {
    setAddedOffers(addedOffers.filter(o => o.id !== offerId));
  };

  const offersTotal = addedOffers.reduce((sum, offer) => sum + offer.price, 0);
  const totalPrice = priceValue + offersTotal;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENT") {
      discountAmount = (totalPrice * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const currencyCode = currency;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: totalPrice,
          serviceType: `${platform}_${service}`,
        }),
      });
      
      const data = await res.json();
      
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponSuccess(data.message);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message);
        setCouponSuccess("");
      }
    } catch (error) {
      setCouponError("Failed to validate coupon");
      setCouponSuccess("");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      // Validate required fields
      if (paymentMethod === "card") {
        if (!cardholderName || !email || !cardNumber || !expiry || !cvc) {
          setError("Please fill in all card details");
          setProcessing(false);
          return;
        }
      }

      if (!username) {
        setError("Username is required");
        setProcessing(false);
        return;
      }

      // Map service type from path
      const serviceTypeMap: Record<string, string> = {
        likes: "LIKES",
        followers: "FOLLOWERS",
        views: "VIEWS",
        subscribers: "SUBSCRIBERS"
      };

      const serviceType = serviceTypeMap[service] || "FOLLOWERS";
      const platformUpper = platform.toUpperCase();

      // Determine link
      let targetLink = postLink;
      if (!targetLink && service === "followers" && username) {
        // Construct profile link for followers if not provided
        targetLink = `https://instagram.com/${username}`;
      }

      // Create order and payment in one call
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: platformUpper,
          serviceType,
          quantity: parseInt(qty) || 50,
          price: priceValue,
          link: targetLink || null,
          paymentMethod: paymentMethod, // 'card' or 'crypto'
          currency: currencyCode,
          packageServiceId: packageServiceId || undefined,
          couponCode: appliedCoupon?.code,
          upsellIds: addedOffers.map(o => o.id),
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        if (paymentResponse.status === 401) {
          throw new Error("Please log in to complete your purchase");
        }
        throw new Error(errorData.error || "Failed to process payment");
      }

      const { checkoutUrl } = await paymentResponse.json();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  // Get platform icon based on URL
  const getPlatformIcon = () => {
    return "/instagram-11.png";
  };

  const getMetricIcon = () => faUser; // Followers icon
  const getMetricLabel = () => "Followers";
  const getPlatformName = () => "Instagram";

  return (
    <>
      <Header />
      <main className="final-checkout-page">
        <div className="final-checkout-container">
          {/* Progress Indicator */}
          <div className="checkout-progress">
            <Link href={detailsUrl} className="progress-step completed" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Details</span>
            </Link>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            {/* Removed Posts Step */}
            <div className="progress-step active">
              <div className="progress-step-icon">
                <span>2</span>
              </div>
              <span className="progress-step-label">Checkout</span>
            </div>
          </div>

          <div className="final-checkout-layout">
            {/* Left Column - Payment Form */}
            <div className="final-checkout-left">
              <div className="checkout-card">
                <h2 className="final-checkout-title">Review & Pay</h2>
                
                <form className="payment-form" onSubmit={handlePayment}>
                  <div className="payment-method-section">
                    <h3 className="payment-method-heading">Payment method</h3>
                    
                    {/* Card Payment Option */}
                    <div className="payment-option">
                      <label className="payment-option-label">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="payment-radio"
                        />
                        <FontAwesomeIcon icon={faCreditCard} className="payment-option-icon" />
                        <span>Card</span>
                      </label>
                      
                      {paymentMethod === "card" && (
                        <div className="card-form">
                          <div className="form-group">
                            <label className="form-label">Cardholder name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={cardholderName}
                              onChange={(e) => setCardholderName(e.target.value)}
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                              type="email"
                              className="form-input"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">Card number</label>
                            <div className="card-input-wrapper">
                              <input
                                type="text"
                                className="form-input card-number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                required
                              />
                              <div className="card-icons">
                                <span className="card-icon">Visa</span>
                                <span className="card-icon">MC</span>
                                <span className="card-icon">Amex</span>
                                <span className="card-icon">Disc</span>
                                <span className="card-icon">JCB</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">MM/YY</label>
                              <input
                                type="text"
                                className="form-input"
                                value={expiry}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                                  if (value.length >= 2) {
                                    setExpiry(value.slice(0, 2) + "/" + value.slice(2));
                                  } else {
                                    setExpiry(value);
                                  }
                                }}
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label className="form-label">
                                CVC
                                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="123"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Crypto Payment Option */}
                    <div className="payment-option">
                      <label className="payment-option-label">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="crypto"
                          checked={paymentMethod === "crypto"}
                          onChange={() => setPaymentMethod("crypto")}
                          className="payment-radio"
                        />
                        <FontAwesomeIcon icon={faCoins} className="payment-option-icon" />
                        <span>Pay with Crypto</span>
                      </label>
                      
                      {paymentMethod === "crypto" && (
                        <div className="crypto-form">
                          <div className="crypto-message-box">
                            <p>You will be redirected to Cryptomus to complete your payment securely.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div style={{ 
                      padding: "12px", 
                      background: "#fef2f2", 
                      border: "1px solid #fecaca", 
                      borderRadius: "6px", 
                      color: "#dc2626",
                      marginBottom: "16px",
                      fontSize: "14px"
                    }}>
                      {error}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="pay-button"
                    disabled={processing}
                    style={{ opacity: processing ? 0.6 : 1, cursor: processing ? "not-allowed" : "pointer" }}
                  >
                    <FontAwesomeIcon icon={faLock} className="pay-button-icon" />
                    {processing ? "Processing..." : `Pay ${formatPrice(finalPrice)}`}
                  </button>

                  <div className="payment-guarantees">
                    <div className="guarantee-item">
                      <FontAwesomeIcon icon={faCheck} className="guarantee-icon" />
                      <span>100% Safe Payment</span>
                    </div>
                    <div className="guarantee-item">
                      <span className="money-icon">💰</span>
                      <span>Money-Back Guarantee</span>
                    </div>
                  </div>

                  <p className="payment-terms">
                    By clicking Pay, you agree to the{" "}
                    <a href="/terms" className="payment-link">Terms of Service</a> and{" "}
                    <a href="/privacy" className="payment-link">Privacy Policy</a>.
                  </p>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary & Offers */}
            <div className="final-checkout-right">
              {/* Account/Post Info */}
              <div className="checkout-card">
                <div className="account-info-item">
                  <div className="account-info-left">
                    <img src={getPlatformIcon()} alt={getPlatformName()} width={20} height={20} />
                    <span>@{username || "username"}</span>
                  </div>
                  <button type="button" className="change-button">Change</button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="checkout-card order-summary-final">
                <h3 className="order-summary-title">Order summary</h3>
                
                <div className="order-item">
                  <div className="order-item-left">
                    <FontAwesomeIcon icon={getMetricIcon()} className="order-item-icon" />
                    <div className="order-item-details">
                      <span className="order-item-text">{qty} {getPlatformName()} {getMetricLabel()}</span>
                      <span className="order-item-subtext">Target: @{username}</span>
                    </div>
                  </div>
                  <span className="order-item-price">{formatPrice(priceValue)}</span>
                </div>

                {addedOffers.map((offer) => (
                  <div key={offer.id} className="order-item">
                    <div className="order-item-left">
                      <FontAwesomeIcon icon={offer.icon} className="order-item-icon" />
                      <div className="order-item-details">
                        <span className="order-item-text">{offer.text}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="order-item-price">{formatPrice(offer.price)}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOffer(offer.id)}
                        className="remove-offer-btn"
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", padding: "0 4px" }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {appliedCoupon && (
                  <div className="order-item discount-item" style={{ color: "#22c55e" }}>
                    <div className="order-item-left">
                      <FontAwesomeIcon icon={faTag} className="order-item-icon" />
                      <div className="order-item-details">
                        <span className="order-item-text">Discount ({appliedCoupon.code})</span>
                      </div>
                    </div>
                    <span className="order-item-price">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="coupon-section">
                  <label className="coupon-toggle">
                    <span>I have a coupon code</span>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={hasCoupon}
                        onChange={(e) => setHasCoupon(e.target.checked)}
                        className="coupon-checkbox"
                      />
                      <span className="toggle-slider"></span>
                    </div>
                  </label>
                  {hasCoupon && (
                    <div className="coupon-input-wrapper" style={{ flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <input
                          type="text"
                          className="coupon-input"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon"
                          disabled={isValidatingCoupon || !!appliedCoupon}
                          style={{ flex: 1 }}
                        />
                        {appliedCoupon ? (
                          <button 
                            type="button" 
                            className="coupon-apply-btn"
                            onClick={() => {
                              setAppliedCoupon(null);
                              setCouponCode("");
                              setCouponSuccess("");
                              setCouponError("");
                            }}
                            style={{ background: "#ef4444" }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="coupon-apply-btn"
                            onClick={handleApplyCoupon}
                            disabled={isValidatingCoupon || !couponCode}
                          >
                            {isValidatingCoupon ? "..." : "Apply"}
                          </button>
                        )}
                      </div>
                      {couponError && <p style={{color: '#ef4444', fontSize: '12px', margin: 0}}>{couponError}</p>}
                      {couponSuccess && <p style={{color: '#22c55e', fontSize: '12px', margin: 0}}>{couponSuccess}</p>}
                    </div>
                  )}
                </div>

                <div className="order-total">
                  <span className="total-label">Total to pay</span>
                  <div className="total-price-wrapper">
                    <button className="currency-button">{currencyCode}</button>
                    <span className="total-price">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Exclusive Offers */}
              {offers.length > 0 && (
                <>
                  <h3 className="offers-title">EXCLUSIVE OFFERS</h3>
                  <div className="checkout-card exclusive-offers">
                    {offers.slice(0, 3).map((offer, idx) => {
                      const colorClass = idx === 2 ? "offer-pink" : "offer-green";
                      const isAdded = !!addedOffers.find(o => o.id === offer.id);
                      return (
                        <div key={offer.id} className={`offer-item ${colorClass} ${isAdded ? "offer-added" : ""}`}>
                          <div className="offer-badge">25%</div>
                          <FontAwesomeIcon icon={offer.icon} className="offer-icon" />
                          <div className="offer-details">
                            <span className="offer-text">{offer.text}</span>
                            <div className="offer-price">
                              <span className="offer-price-new">For only {formatPrice(offer.price)}</span>
                              <span className="offer-price-old">{formatPrice(offer.originalPrice)}</span>
                            </div>
                          </div>
                          <button 
                            className="offer-add-btn"
                            onClick={() => handleAddOffer(offer)}
                            disabled={isAdded}
                          >
                            {isAdded ? "Added" : "+ Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Security Guarantees */}
              <div className="checkout-card security-guarantees">
                <div className="guarantee-item">
                  <div className="guarantee-icon-wrapper shield-wrapper">
                    <FontAwesomeIcon icon={faShieldHalved} className="guarantee-icon shield-icon" />
                    <FontAwesomeIcon icon={faCheck} className="guarantee-check" />
                  </div>
                  <span>Safe & Secure Payment</span>
                </div>
                <div className="guarantee-item">
                  <FontAwesomeIcon icon={faTag} className="guarantee-icon tag-icon" />
                  <span>30 Day Money Back Guarantee</span>
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

export default function FinalCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <FinalCheckoutContent />
    </Suspense>
  );
}
