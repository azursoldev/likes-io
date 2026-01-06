"use client";

import { useState, Suspense } from "react";
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
  faUserPlus,
  faShieldHalved,
  faTag,
  faCoins
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import Link from "next/link";

function FinalCheckoutContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol, currency } = useCurrency();
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";
  const postLink = searchParams.get("postLink") || "";
  const packageServiceId = searchParams.get("serviceId") || "";

  // Calculate total price based on number of posts
  const postLinks = postLink.split(',').filter(link => link.trim() !== "");
  const postCount = postLinks.length || 1;
  const basePrice = priceValue * postCount;

  // Get platform and service from pathname
  const pathParts = pathname?.split("/") || [];
  const platform = pathParts[1] || "tiktok";
  const service = pathParts[2] || "likes";
  
  // Create URLs for navigation
  const detailsUrl = `/${platform}/${service}/checkout?qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`;
  const postsUrl = `/${platform}/${service}/checkout/posts?username=${encodeURIComponent(username)}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}&postLink=${encodeURIComponent(postLink)}`;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "pay_later">("card");
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

  const offers = [
    { id: "offer1", text: "50 likes x 10 posts", price: 5.99, icon: faHeart },
    { id: "offer2", text: "100 likes x 10 posts", price: 11.24, icon: faHeart },
    { id: "offer3", text: "1K followers", price: 11.24, icon: faUserPlus }
  ];

  const handleAddOffer = (offer: typeof offers[0]) => {
    if (!addedOffers.find(o => o.id === offer.id)) {
      setAddedOffers([...addedOffers, offer]);
    }
  };

  const handleRemoveOffer = (offerId: string) => {
    setAddedOffers(addedOffers.filter(o => o.id !== offerId));
  };

  const offersTotal = addedOffers.reduce((sum, offer) => sum + offer.price, 0);
  const totalPrice = basePrice + offersTotal;

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

      if (paymentMethod === "pay_later") {
        alert(`Test Checkout Successful!\n\nPlatform: ${platform}\nService: ${service}\nQuantity: ${qty}\nOriginal Price: ${formatPrice(totalPrice)}\nDiscount: ${formatPrice(discountAmount)}\nFinal Price: ${formatPrice(finalPrice)}\nPosts: ${postCount}`);
        setProcessing(false);
        return;
      }

      const platformUpper = platform.toUpperCase();
      const serviceType = service.toUpperCase(); // LIKES

      // Create order and payment in one call
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: platformUpper,
          serviceType,
          quantity: parseInt(qty) || 500,
          price: finalPrice,
          link: postLink || null, // For likes we might have multiple links or one
          paymentMethod: paymentMethod, // 'card' or 'crypto'
          currency: currencyCode,
          packageServiceId: packageServiceId || undefined,
          couponCode: appliedCoupon?.code,
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

  return (
    <>
      <Header />
      <main className="final-checkout-page">
        <div className="final-checkout-container">
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
            <Link href={postsUrl} className="progress-step completed" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Posts</span>
            </Link>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step active">
              <div className="progress-step-icon">
                <span>3</span>
              </div>
              <span className="progress-step-label">Checkout</span>
            </div>
          </div>

          <div className="final-checkout-layout">
            <div className="final-checkout-left">
              <div className="checkout-card">
                <h2 className="final-checkout-title">Review & Pay</h2>
                
                <form className="payment-form" onSubmit={handlePayment}>
                  <div className="payment-method-section">
                    <h3 className="payment-method-heading">Payment method</h3>
                    
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
                    <div className="payment-option">
                      <label className="payment-option-label">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_later"
                          checked={paymentMethod === "pay_later"}
                          onChange={() => setPaymentMethod("pay_later")}
                          className="payment-radio"
                        />
                        <FontAwesomeIcon icon={faShieldHalved} className="payment-option-icon" />
                        <span>Pay Later (Test)</span>
                      </label>
                      
                      {paymentMethod === "pay_later" && (
                        <div className="crypto-form">
                          <div className="crypto-message-box">
                            <p>This is a test payment method. No actual charge will be made.</p>
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

            <div className="final-checkout-right">
              <div className="checkout-card">
                <div className="account-info-item">
                  <div className="account-info-left">
                    <img src="/tiktok-9.png" alt="TikTok" width={20} height={20} />
                    <span className="account-info-url">
                      {postCount > 1 ? `${postCount} posts selected` : (postLink || `@${username || "username"}`)}
                    </span>
                  </div>
                  <button type="button" className="change-button">Change</button>
                </div>
              </div>

              <div className="checkout-card order-summary-final">
                <h3 className="order-summary-title">Order summary</h3>
                
                <div className="order-item">
                  <div className="order-item-left">
                    <FontAwesomeIcon icon={faHeart} className="order-item-icon" />
                    <div className="order-item-details">
                      <span className="order-item-text">{qty} TikTok Likes</span>
                      <span className="order-item-subtext">{packageType} {postCount > 1 ? `x ${postCount} posts` : ''}</span>
                    </div>
                  </div>
                  <span className="order-item-price">{formatPrice(basePrice)}</span>
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

              <h3 className="offers-title">EXCLUSIVE OFFERS</h3>
              
              <div className="checkout-card exclusive-offers">
                <div className={`offer-item offer-green ${addedOffers.find(o => o.id === "offer1") ? "offer-added" : ""}`}>
                  <div className="offer-badge">25%</div>
                  <FontAwesomeIcon icon={faHeart} className="offer-icon" />
                  <div className="offer-details">
                    <span className="offer-text">50 likes x 10 posts</span>
                    <div className="offer-price">
                      <span className="offer-price-new">For only {formatPrice(5.99)}</span>
                      <span className="offer-price-old">{formatPrice(7.99)}</span>
                    </div>
                  </div>
                  <button 
                    className="offer-add-btn"
                    onClick={() => handleAddOffer(offers[0])}
                    disabled={!!addedOffers.find(o => o.id === "offer1")}
                  >
                    {addedOffers.find(o => o.id === "offer1") ? "Added" : "+ Add"}
                  </button>
                </div>

                <div className={`offer-item offer-green ${addedOffers.find(o => o.id === "offer2") ? "offer-added" : ""}`}>
                  <div className="offer-badge">25%</div>
                  <FontAwesomeIcon icon={faHeart} className="offer-icon" />
                  <div className="offer-details">
                    <span className="offer-text">100 likes x 10 posts</span>
                    <div className="offer-price">
                      <span className="offer-price-new">For only {formatPrice(11.24)}</span>
                      <span className="offer-price-old">{formatPrice(14.99)}</span>
                    </div>
                  </div>
                  <button 
                    className="offer-add-btn"
                    onClick={() => handleAddOffer(offers[1])}
                    disabled={!!addedOffers.find(o => o.id === "offer2")}
                  >
                    {addedOffers.find(o => o.id === "offer2") ? "Added" : "+ Add"}
                  </button>
                </div>

                <div className={`offer-item offer-pink ${addedOffers.find(o => o.id === "offer3") ? "offer-added" : ""}`}>
                  <div className="offer-badge">25%</div>
                  <FontAwesomeIcon icon={faUserPlus} className="offer-icon" />
                  <div className="offer-details">
                    <span className="offer-text">1K followers</span>
                    <div className="offer-price">
                      <span className="offer-price-new">For only {formatPrice(11.24)}</span>
                      <span className="offer-price-old">{formatPrice(14.99)}</span>
                    </div>
                  </div>
                  <button 
                    className="offer-add-btn"
                    onClick={() => handleAddOffer(offers[2])}
                    disabled={!!addedOffers.find(o => o.id === "offer3")}
                  >
                    {addedOffers.find(o => o.id === "offer3") ? "Added" : "+ Add"}
                  </button>
                </div>
              </div>

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
    <Suspense fallback={<div>Loading...</div>}>
      <FinalCheckoutContent />
    </Suspense>
  );
}

