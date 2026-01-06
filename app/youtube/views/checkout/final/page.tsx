"use client";

import { useState, Suspense, useEffect } from "react";
import Script from "next/script";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faThumbsUp,
  faChevronRight,
  faLock,
  faCreditCard,
  faInfoCircle,
  faLink,
  faUserPlus,
  faShieldHalved,
  faTag,
  faCoins,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import Link from "next/link";

export function FinalCheckoutContent({ basePath }: { basePath?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol, currency } = useCurrency();
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "1000";
  const priceValue = parseFloat(searchParams.get("price") || "29.99");
  const packageType = searchParams.get("type") || "High-Retention";
  const videoLink = searchParams.get("videoLink") || "";
  const packageServiceId = searchParams.get("serviceId") || "";
  // If we have a videoLink, display that. If not, maybe username.
  const displayLink = videoLink || (username ? `@${username}` : "");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [email, setEmail] = useState("");
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
  
  // MyFatoorah State
  const [mfSession, setMfSession] = useState<{sessionId: string, countryCode: string, scriptUrl: string} | null>(null);
  const [isMfLoaded, setIsMfLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paymentMethod === "card" && !mfSession) {
      // Initiate MyFatoorah Session
      fetch("/api/payments/initiate-session", {
        method: "POST",
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error("MF Init Error:", data.error);
            setError("Failed to load payment form");
          } else {
            setMfSession(data);
          }
        })
        .catch(err => {
          console.error("MF Fetch Error:", err);
          setError("Failed to load payment form");
        });
    }
  }, [paymentMethod, mfSession]);

  useEffect(() => {
    if (paymentMethod === "card" && mfSession && isMfLoaded && (window as any).myFatoorah) {
      try {
        const config = {
          countryCode: mfSession.countryCode,
          sessionId: mfSession.sessionId,
          cardViewId: "mf-card-element",
          supportedNetworks: "visa,mastercard,amex,mada",
          style: {
            direction: "ltr",
            cardHeight: 130,
            input: {
              color: "black",
              fontSize: "13px",
              fontFamily: "sans-serif",
              inputHeight: "32px",
              inputMargin: "0px",
              borderColor: "e2e8f0",
              borderWidth: "1px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              placeHolder: {
                holderName: "Name On Card",
                cardNumber: "Number",
                expiryDate: "MM / YY",
                securityCode: "CVV",
              }
            },
            label: {
              display: false,
              color: "black",
              fontSize: "13px",
              fontWeight: "normal",
              fontFamily: "sans-serif",
              text: {
                holderName: "Card Holder Name",
                cardNumber: "Card Number",
                expiryDate: "Expiry Date",
                securityCode: "Security Code",
              },
            },
            error: {
              borderColor: "red",
              borderRadius: "8px",
              boxShadow: "0px",
            },
          },
        };
        (window as any).myFatoorah.init(config);
      } catch (err) {
        console.error("MF Init Exception:", err);
      }
    }
  }, [paymentMethod, mfSession, isMfLoaded]);

  // Views specific offers
  const offers = [
    { id: "offer1", text: "100 Likes", price: 5.99, icon: faThumbsUp },
    { id: "offer2", text: "50 Subscribers", price: 11.24, icon: faUserPlus },
    { id: "offer3", text: "20 Comments", price: 8.99, icon: faLink }
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
          serviceType: `youtube_views`,
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
      if (paymentMethod === "card") {
        if (!mfSession || !(window as any).myFatoorah) {
          throw new Error("Payment form not loaded");
        }

        // Process MyFatoorah Embedded Payment
        const mfResponse = await (window as any).myFatoorah.submit();
        
        console.log("MF Submit Response:", mfResponse);

        if (!mfResponse || !mfResponse.SessionId) {
          throw new Error("Invalid payment data");
        }

        // Now call our backend with the card token (SessionId)
        await processBackendPayment(mfResponse.SessionId);

      } else {
        // Crypto or other methods
        await processBackendPayment();
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      if (err.message && err.message.includes("MyFatoorah")) {
         setError("Please check your card details.");
      } else {
         setError(err.message || "Payment failed");
      }
      setProcessing(false);
    }
  };

  const processBackendPayment = async (cardSessionId?: string) => {
    const platformUpper = "YOUTUBE";
    const serviceType = "VIEWS"; // Hardcoded for this page

    const paymentResponse = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        platform: platformUpper,
        serviceType,
        quantity: parseInt(qty) || 1000,
        price: finalPrice,
        link: videoLink || username, // Use videoLink or username
        paymentMethod: paymentMethod === "card" ? "myfatoorah" : paymentMethod,
        currency: currencyCode,
        email: email, 
        sessionId: cardSessionId,
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

    const data = await paymentResponse.json();
    
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else if (data.paymentStatus === "Paid" || data.paymentStatus === "Success") {
      window.location.href = `/checkout/success?orderId=${data.orderId}`;
    } else {
      window.location.href = `/checkout/success?orderId=${data.orderId}`;
    }
  };

  return (
    <>
      <Header />
      {mfSession?.scriptUrl && (
        <Script 
          src={mfSession.scriptUrl}
          strategy="lazyOnload"
          onLoad={() => setIsMfLoaded(true)}
        />
      )}
      <main className="final-checkout-page">
        <div className="final-checkout-container">
          <div className="checkout-progress">
            <div className="progress-step completed">
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Details</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step completed">
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Videos</span>
            </div>
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
                          {/* MyFatoorah Embedded Container */}
                          <div style={{ width: "100%", minHeight: "150px" }}>
                            {!isMfLoaded && <p>Loading payment form...</p>}
                            <div id="mf-card-element" style={{ width: "100%" }}></div>
                          </div>
                          
                          <div className="form-group" style={{ marginTop: "1rem" }}>
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
                  </div>

                  {error && (
                    <div className="error-alert" style={{color: 'red', marginBottom: '10px'}}>
                      <FontAwesomeIcon icon={faInfoCircle} /> {error}
                    </div>
                  )}

                  <button type="submit" className="pay-button" disabled={processing}>
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

              <h3 className="offers-title">EXCLUSIVE OFFERS</h3>
              
              <div className="checkout-card exclusive-offers">
                {offers.map((offer, index) => (
                  <div key={offer.id} className={`offer-item ${index % 2 === 0 ? 'offer-green' : 'offer-pink'} ${addedOffers.find(o => o.id === offer.id) ? "offer-added" : ""}`}>
                    <div className="offer-badge">25%</div>
                    <FontAwesomeIcon icon={offer.icon} className="offer-icon" />
                    <div className="offer-details">
                      <span className="offer-text">{offer.text}</span>
                      <div className="offer-price">
                        <span className="offer-price-new">Only {formatPrice(offer.price)}</span>
                      </div>
                    </div>
                    <button 
                      className="offer-add-btn"
                      onClick={() => handleAddOffer(offer)}
                      disabled={!!addedOffers.find(o => o.id === offer.id)}
                    >
                      {addedOffers.find(o => o.id === offer.id) ? "Added" : "+ Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="final-checkout-right">
              <div className="checkout-card">
                <div className="account-info-item">
                  <div className="account-info-left">
                    <img src="/youtube-7.png" alt="YouTube" width={20} height={20} />
                    <span className="account-info-url">{displayLink}</span>
                  </div>
                  <button type="button" className="change-button" onClick={() => window.history.back()}>Change</button>
                </div>
              </div>

              <div className="checkout-card order-summary-final">
                <h3 className="order-summary-title">Order summary</h3>
                
                <div className="order-item">
                  <div className="order-item-left">
                    <FontAwesomeIcon icon={faEye} className="order-item-icon" />
                    <div className="order-item-details">
                      <span className="order-item-text">{qty} YouTube Views</span>
                      <span className="order-item-subtext">{packageType}</span>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <style jsx>{`
        .final-checkout-page {
          min-height: 80vh;
          padding: 120px 20px 60px;
          background-color: #f8f9fa;
        }
        
        .final-checkout-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .checkout-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 50px;
          gap: 15px;
        }
        
        .progress-step {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        
        .progress-step-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e9ecef;
          color: #adb5bd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .progress-step-label {
          font-weight: 600;
          color: #adb5bd;
          font-size: 0.9rem;
        }
        
        .progress-step.completed .progress-step-icon {
          background: #28a745;
          color: white;
        }
        
        .progress-step.completed .progress-step-label {
          color: #28a745;
        }
        
        .progress-step.active .progress-step-icon {
          background: #0070f3;
          color: white;
        }
        
        .progress-step.active .progress-step-label {
          color: #0070f3;
        }
        
        .progress-arrow {
          color: #adb5bd;
          font-size: 0.8rem;
        }
        
        .final-checkout-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
        }
        
        @media (max-width: 900px) {
          .final-checkout-layout {
            grid-template-columns: 1fr;
          }
        }
        
        .checkout-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          margin-bottom: 30px;
        }
        
        .final-checkout-title {
          margin-bottom: 25px;
          font-size: 1.5rem;
          color: #1a1a1a;
        }
        
        .payment-method-section {
          margin-bottom: 30px;
        }
        
        .payment-method-heading {
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: #495057;
        }
        
        .payment-option {
          margin-bottom: 15px;
        }
        
        .payment-option-label {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .payment-radio:checked + .payment-option-icon + span {
          color: #0070f3;
          font-weight: 600;
        }
        
        .payment-radio:checked ~ .payment-option-label {
          border-color: #0070f3;
          background: #f8f9fa;
        }
        
        .payment-option-icon {
          font-size: 1.2rem;
          color: #6c757d;
        }
        
        .card-form {
          margin-top: 15px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #495057;
        }
        
        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .pay-button {
          width: 100%;
          padding: 16px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s;
        }
        
        .pay-button:hover {
          background: #0051a2;
        }
        
        .pay-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .payment-guarantees {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .guarantee-icon {
          color: #28a745;
        }
        
        .payment-terms {
          text-align: center;
          margin-top: 20px;
          font-size: 0.85rem;
          color: #adb5bd;
        }
        
        .payment-link {
          color: #0070f3;
          text-decoration: none;
        }
        
        .account-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .account-info-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .account-info-url {
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .change-button {
          color: #0070f3;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        
        .order-summary-title {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }
        
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 15px;
        }
        
        .order-item-left {
          display: flex;
          gap: 15px;
        }
        
        .order-item-icon {
          color: #0070f3;
          margin-top: 4px;
        }
        
        .order-item-details {
          display: flex;
          flex-direction: column;
        }
        
        .order-item-text {
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .order-item-subtext {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .order-item-price {
          font-weight: 600;
        }
        
        .coupon-section {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 12px;
        }
        
        .coupon-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .toggle-switch {
          position: relative;
          width: 40px;
          height: 24px;
        }
        
        .coupon-checkbox {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        .coupon-checkbox:checked + .toggle-slider {
          background-color: #0070f3;
        }
        
        .coupon-checkbox:checked + .toggle-slider:before {
          transform: translateX(16px);
        }
        
        .coupon-input-wrapper {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .coupon-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 8px;
        }
        
        .coupon-apply-btn {
          padding: 0 20px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        
        .order-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e9ecef;
        }
        
        .total-label {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .total-price-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .currency-button {
          padding: 4px 8px;
          background: #e9ecef;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.8rem;
        }
        
        .total-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0070f3;
        }

        .offers-title {
          font-size: 1.2rem;
          margin-bottom: 20px;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .exclusive-offers {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .offer-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          position: relative;
          gap: 15px;
        }

        .offer-green {
          background: #f0fff4;
          border-color: #c3e6cb;
        }

        .offer-pink {
          background: #fff0f6;
          border-color: #fcc2d7;
        }

        .offer-added {
          border-color: #0070f3;
          background: #f0f7ff;
        }

        .offer-badge {
          position: absolute;
          top: -10px;
          left: 10px;
          background: #ff4757;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .offer-icon {
          font-size: 1.5rem;
          color: #495057;
        }

        .offer-details {
          flex: 1;
        }

        .offer-text {
          display: block;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .offer-price-new {
          color: #0070f3;
          font-weight: 700;
        }

        .offer-add-btn {
          padding: 6px 15px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .offer-add-btn:hover {
          transform: scale(1.05);
        }

        .offer-add-btn:disabled {
          background: #28a745;
          cursor: default;
          transform: none;
        }
        .badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          color: #adb5bd;
          font-weight: 600;
        }
        
        .payment-method.active .badge {
          background: white;
          color: #0070f3;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          border-color: #0070f3;
          outline: none;
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
        
        .input-with-icon .form-input {
          padding-left: 40px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .crypto-details {
          text-align: center;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 30px;
          color: #6c757d;
        }
        
        .coupon-section {
          margin-bottom: 25px;
          border-top: 1px solid #e9ecef;
          padding-top: 20px;
        }
        
        .coupon-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0070f3;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 15px;
        }
        
        .coupon-input-group {
          display: flex;
          gap: 10px;
        }
        
        .coupon-input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
        }
        
        .coupon-btn {
          padding: 10px 20px;
          background: #e9ecef;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          color: #495057;
          cursor: pointer;
        }
        
        .pay-button {
          width: 100%;
          padding: 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.3s;
        }
        
        .pay-button:hover {
          background: #218838;
        }
        
        .pay-button:disabled {
          background: #94d3a2;
          cursor: not-allowed;
        }
        
        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
          color: #adb5bd;
          font-size: 0.85rem;
        }
        
        .summary-card {
          background: white;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          margin-bottom: 25px;
        }
        
        .summary-card h3 {
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: #1a1a1a;
        }
        
        .summary-main-item {
          display: flex;
          gap: 15px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 20px;
        }
        
        .item-icon {
          width: 50px;
          height: 50px;
          background: #f8f9fa;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0070f3;
          font-size: 1.2rem;
        }
        
        .item-details {
          flex: 1;
        }
        
        .item-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        
        .item-subtitle {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 4px;
        }
        
        .item-link {
          font-size: 0.8rem;
          color: #0070f3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .item-price {
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .added-offers-list {
          margin-bottom: 20px;
        }
        
        .added-offer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
        
        .offer-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #495057;
        }
        
        .offer-icon {
          color: #adb5bd;
          font-size: 0.8rem;
        }
        
        .offer-price-action {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .remove-offer-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          padding: 0;
        }
        
        .summary-totals {
          margin-top: 10px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #6c757d;
          font-size: 0.95rem;
        }
        
        .total-row.discount {
          color: #28a745;
        }
        
        .total-divider {
          height: 1px;
          background: #e9ecef;
          margin: 15px 0;
        }
        
        .total-row.final {
          color: #1a1a1a;
          font-weight: 700;
          font-size: 1.2rem;
        }
        
        .upsell-box {
          background: white;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }
        
        .upsell-box h4 {
          margin-bottom: 15px;
          font-size: 1rem;
          color: #495057;
        }
        
        .upsell-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        
        .upsell-item:hover {
          border-color: #0070f3;
          background: #f8f9fa;
        }
        
        .upsell-icon {
          width: 32px;
          height: 32px;
          background: #e9ecef;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 0.8rem;
        }
        
        .upsell-info {
          flex: 1;
        }
        
        .upsell-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #495057;
        }
        
        .upsell-price {
          font-size: 0.8rem;
          color: #adb5bd;
        }
        
        .upsell-add-btn {
          padding: 5px 12px;
          background: white;
          border: 1px solid #0070f3;
          color: #0070f3;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .upsell-add-btn:hover {
          background: #0070f3;
          color: white;
        }
        
        .error-alert {
          background: #fff5f5;
          color: #dc3545;
          padding: 12px 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          border: 1px solid #ffe3e3;
        }
      `}</style>
    </>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FinalCheckoutContent />
        </Suspense>
    )
}
