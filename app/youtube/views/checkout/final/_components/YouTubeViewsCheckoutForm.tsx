"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faEye,
  faChevronRight,
  faLock,
  faCreditCard,
  faInfoCircle,
  faUserPlus,
  faShieldHalved,
  faTag,
  faWallet
} from "@fortawesome/free-solid-svg-icons";
import {
  faBitcoin
} from "@fortawesome/free-brands-svg-icons";
import { useCurrency } from "@/app/contexts/CurrencyContext";

export default function YouTubeViewsCheckoutForm() {
  const { currency } = useCurrency();
  
  // Locked Currency Logic to prevent glitch
  const [lockedCurrency] = useState<"USD" | "EUR">(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const urlCurrency = sp.get("currency");
      if (urlCurrency === "USD" || urlCurrency === "EUR") return urlCurrency;
    }
    return currency === "EUR" ? "EUR" : "USD";
  });

  const formatPrice = (price: number): string => {
    const rate = lockedCurrency === "EUR" ? 0.92 : 1;
    const symbol = lockedCurrency === "EUR" ? "€" : "$";
    return `${symbol}${(price * rate).toFixed(2)}`;
  };
  
  const [username, setUsername] = useState("");
  const [qty, setQty] = useState("1000");
  const [priceValue, setPriceValue] = useState<number>(29.99);
  const [packageType, setPackageType] = useState("High-Retention");
  const [videoLink, setVideoLink] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setUsername(sp.get("username") || "");
      setQty(sp.get("qty") || "1000");
      setPriceValue(parseFloat(sp.get("price") || "29.99"));
      setPackageType(sp.get("type") || "High-Retention");
      setVideoLink(sp.get("videoLink") || "");
      const em = sp.get("email") || "";
      setEmail(em);
    }
  }, []);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "myfatoorah" | "wallet">("card");
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch wallet balance
  useEffect(() => {
    fetch("/api/wallet/balance")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && typeof data.balance === "number") {
          setWalletBalance(data.balance);
        }
      })
      .catch((err) => console.error("Failed to fetch wallet balance:", err));
  }, []);

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "PERCENT" | "FIXED";
    value: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [addedOffers, setAddedOffers] = useState<Array<{id: string; text: string; price: number; icon: any}>>([]);
  
  // MyFatoorah State
  const [mfSession, setMfSession] = useState<{sessionId: string, countryCode: string, scriptUrl: string} | null>(null);
  const [isMfLoaded, setIsMfLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paymentMethod === "myfatoorah" && !mfSession) {
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
    if (paymentMethod === "myfatoorah" && mfSession && isMfLoaded && (window as any).myFatoorah) {
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
            label: { display: false },
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

  const [offers, setOffers] = useState<Array<{id: string; text: string; price: number; originalPrice: number; discount: number; icon: any}>>([]);
  const [channelInfo, setChannelInfo] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    if (username) {
      fetch(`/api/social/YOUTUBE/profile?username=${username}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setChannelInfo({
              name: data.profile.fullName || data.profile.username,
              avatar: data.profile.profilePicture || data.profile.profilePicUrl || data.profile.avatar
            });
          }
        })
        .catch(err => console.error("Failed to fetch profile:", err));
    }
  }, [username]);

  useEffect(() => {
    fetch('/api/upsells?platform=YOUTUBE&serviceType=VIEWS')
      .then(res => res.json())
      .then(data => {
        if (data.upsells) {
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
               discount: u.discountValue,
               icon: u.badgeIcon === 'user-plus' ? faUserPlus : faEye // Adapted for Views
             };
          }));
        }
      })
      .catch(err => console.error("Failed to fetch upsells:", err));
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
  const subtotal = totalPrice;

  // Views specific logic for multiple videos
  const videoLinks = videoLink.split(",").filter(s => s.trim());
  const videoCount = videoLinks.length;

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
          serviceType: "youtube_views",
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

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      let cardSessionId: string | undefined;

      // Validate required fields
      if (paymentMethod === "card") {
        if (!cardholderName || !email || !cardNumber || !expiry || !cvc) {
          setError("Please fill in all card details");
          setProcessing(false);
          return;
        }
      } else if (paymentMethod === "myfatoorah") {
        if (!mfSession || !(window as any).myFatoorah) {
           throw new Error("Payment form not loaded");
        }
        const mfResponse = await (window as any).myFatoorah.submit();
        if (!mfResponse || !mfResponse.SessionId) {
          throw new Error("Invalid payment data");
        }
        cardSessionId = mfResponse.SessionId;
      } else if (paymentMethod === "wallet") {
        if (walletBalance < finalPrice) {
          setError("Insufficient wallet balance");
          setProcessing(false);
          return;
        }
      }

      if (!videoLink && !username) {
         // Should have at least one
      }

      const platformUpper = "YOUTUBE";
      const serviceType = "VIEWS";

      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: platformUpper,
          serviceType,
          quantity: parseInt(qty) || 1000,
          price: priceValue, // Send base price, let backend calculate totals with upsells/coupons
          upsellIds: addedOffers.map(o => o.id),
          couponCode: appliedCoupon?.code,
          link: videoLink || `https://youtube.com/@${username}`,
          paymentMethod: paymentMethod,
          currency: lockedCurrency,
          email: email,
          sessionId: cardSessionId
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        if (paymentResponse.status === 401) {
          throw new Error("Please log in to complete your purchase");
        }
        throw new Error(errorData.error || "Failed to process payment");
      }

      const { checkoutUrl, paymentId, paymentStatus, orderId } = await paymentResponse.json();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else if (paymentStatus === "Paid" || paymentStatus === "Success") {
        window.location.href = `/checkout/success?orderId=${orderId}`;
      } else {
        window.location.href = `/checkout/success?orderId=${orderId}`;
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      if (err.message && err.message.includes("MyFatoorah")) {
        setError("Please check your card details.");
      } else {
        setError(err.message || "Failed to process payment. Please try again.");
      }
      setProcessing(false);
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
                <span>1</span>
              </div>
              <span className="progress-step-label">Details</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step completed">
              <div className="progress-step-icon">
                <span>2</span>
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
                    
                    {/* Wallet Payment Option */}
                    {walletBalance > 0 && (
                      <div className="payment-option">
                        <label className="payment-option-label">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="wallet"
                            checked={paymentMethod === "wallet"}
                            onChange={() => setPaymentMethod("wallet")}
                            className="payment-radio"
                          />
                          <FontAwesomeIcon icon={faWallet} className="payment-option-icon" />
                          <span>Wallet (Balance: {formatPrice(walletBalance)})</span>
                        </label>
                        
                        {paymentMethod === "wallet" && (
                          <div className="crypto-form">
                            <div className="crypto-message-box">
                              {walletBalance >= finalPrice ? (
                                <p style={{ color: '#16a34a' }}>
                                  Use your wallet balance to pay for this order instantly.
                                </p>
                              ) : (
                                <p style={{ color: '#dc2626' }}>
                                  Insufficient balance. Please add funds to your wallet or choose another payment method.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

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
                        <FontAwesomeIcon icon={faBitcoin} className="payment-option-icon" />
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

                    {/* MyFatoorah Payment Option */}
                    <div className="payment-option">
                      <label className="payment-option-label">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="myfatoorah"
                          checked={paymentMethod === "myfatoorah"}
                          onChange={() => setPaymentMethod("myfatoorah")}
                          className="payment-radio"
                        />
                        <FontAwesomeIcon icon={faCreditCard} className="payment-option-icon" />
                        <span>MyFatoorah (KNET, Visa/Master)</span>
                      </label>
                      
                      {paymentMethod === "myfatoorah" && (
                        <div className="crypto-form">
                          {/* MyFatoorah Embedded Container */}
                          <div style={{ width: "100%", minHeight: "150px" }}>
                            {!isMfLoaded && <p>Loading payment form...</p>}
                            <div id="mf-card-element" style={{ width: "100%" }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

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
            </div>

            <div className="final-checkout-right">
              <div className="checkout-card">
                <div className="account-info-item">
                  <div className="account-info-left" style={{ alignItems: "center" }}>
                    {channelInfo ? (
                      <>
                        <img 
                          src={channelInfo.avatar} 
                          alt={channelInfo.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/youtube-7.png";
                            target.style.objectFit = "contain";
                            target.style.padding = "4px";
                          }}
                          style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }} 
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                           <span className="account-info-name" style={{ fontWeight: "600", fontSize: "14px" }}>{channelInfo.name}</span>
                           <span className="account-info-url" style={{ fontSize: "12px", color: "#666" }}>@{username}</span>
                        </div>
                      </>
                     ) : (
                       <>
                         <img src="/youtube-7.png" alt="YouTube" width={20} height={20} />
                         <span className="account-info-name" style={{ fontWeight: "600", fontSize: "14px" }}>{`@${username || "username"}`}</span>
                       </>
                     )}
                  </div>
                  <button type="button" className="change-button">Change</button>
                </div>
              </div>

              <div className="checkout-card order-summary-final">
                <h3 className="order-summary-title">Order summary</h3>
                
                <div className="order-item">
                  <div className="order-item-left">
                    <FontAwesomeIcon icon={faEye} className="order-item-icon" />
                    <div className="order-item-details">
                      <span className="order-item-text">{qty} YouTube Views</span>
                      <span className="order-item-subtext" style={{ marginTop: "4px", display: "block" }}>
                        Applying to {videoCount} video{videoCount !== 1 ? 's' : ''}.
                      </span>
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
                    <div className="coupon-input-wrapper" style={{ flexDirection: "column", gap: "10px" }}>
                      <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                        <input
                          type="text"
                          className="coupon-input"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon"
                          disabled={!!appliedCoupon || isValidatingCoupon}
                        />
                        {appliedCoupon ? (
                          <button 
                            type="button" 
                            className="coupon-apply-btn" 
                            onClick={handleRemoveCoupon}
                            style={{ background: "#ef4444", color: "white" }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="coupon-apply-btn" 
                            onClick={handleApplyCoupon}
                            disabled={!couponCode || isValidatingCoupon}
                          >
                            {isValidatingCoupon ? "..." : "Apply"}
                          </button>
                        )}
                      </div>
                      
                      {couponError && (
                        <p className="text-red-500 text-sm" style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{couponError}</p>
                      )}
                      {couponSuccess && (
                        <p className="text-green-500 text-sm" style={{ color: "#22c55e", fontSize: "13px", margin: 0 }}>{couponSuccess}</p>
                      )}
                      
                      {appliedCoupon && (
                        <div style={{ padding: "8px", background: "#f0fdf4", borderRadius: "6px", border: "1px solid #dcfce7" }}>
                          <p style={{ color: "#15803d", fontSize: "13px", margin: 0, fontWeight: 500 }}>
                            Coupon applied! You saved {formatPrice(discountAmount)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="order-total">
                  {appliedCoupon && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#22c55e" }}>
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <span className="total-label">Total to pay</span>
                  <div className="total-price-wrapper">
                    <button className="currency-button">{currency === 'EUR' ? 'EUR' : lockedCurrency}</button>
                    <span className="total-price">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              {offers.length > 0 && (
                <>
                  <h3 className="offers-title">EXCLUSIVE OFFERS</h3>
                  
                  <div className="checkout-card exclusive-offers">
                     {offers.map((offer, index) => {
                       const discountPercent = offer.originalPrice > 0 
                         ? Math.round((1 - offer.price / offer.originalPrice) * 100) 
                         : 0;
                       return (
                         <div key={offer.id} className={`offer-item ${index % 2 === 0 ? 'offer-green' : 'offer-pink'} ${addedOffers.find(o => o.id === offer.id) ? "offer-added" : ""}`}>
                           <div className="offer-badge">{discountPercent}%</div>
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
                            disabled={!!addedOffers.find(o => o.id === offer.id)}
                          >
                            {addedOffers.find(o => o.id === offer.id) ? "Added" : "+ Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

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
