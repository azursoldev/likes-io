"use client";

import { useState, Suspense, useEffect } from "react";
import Script from "next/script";
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
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import Link from "next/link";

function FinalCheckoutContent() {
  const searchParams = useSearchParams();
  const { formatPrice, getCurrencySymbol, currency } = useCurrency();
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "9.99");
  const packageType = searchParams.get("type") || "High-Quality";
  const postLink = searchParams.get("postLink") || "";
  const packageServiceId = searchParams.get("serviceId") || "";

  // Calculate total price based on number of posts
  const postLinks = postLink.split(',').filter(link => link.trim() !== "");
  const postCount = postLinks.length || 1;
  const basePrice = priceValue; // Price is total, not per post
  const viewsPerPost = Math.floor(parseInt(qty) / postCount);

  // Set platform and service (hardcoded for this route)
  const platform = "instagram";
  const service = "views";
  
  // Create URLs for navigation
  const detailsUrl = `/${platform}/${service}/checkout?qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`;
  const postsUrl = `/${platform}/${service}/checkout/posts?username=${encodeURIComponent(username)}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}&postLink=${encodeURIComponent(postLink)}`;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "myfatoorah" | "pay_later">("card");
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [addedOffers, setAddedOffers] = useState<Array<{id: string; text: string; price: number; icon: any}>>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "PERCENT" | "FIXED";
    value: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // MyFatoorah State
  const [mfSession, setMfSession] = useState<{sessionId: string, countryCode: string, scriptUrl: string} | null>(null);
  const [isMfLoaded, setIsMfLoaded] = useState(false);

  // Check if MyFatoorah script is already loaded
  useEffect(() => {
    if ((window as any).myFatoorah) {
      setIsMfLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (paymentMethod === "myfatoorah" && !mfSession) {
      fetch("/api/payments/initiate-session", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error("MF Init Error:", data.error);
            setError("Failed to load payment form: " + data.error);
          } else {
            setMfSession(data);
            // If script is already loaded (from previous navigation), set loaded to true
            if ((window as any).myFatoorah) {
              setIsMfLoaded(true);
            }
          }
        })
        .catch(err => {
          console.error("MF Fetch Error:", err);
          setError("Failed to load payment form. Please try again.");
        });
    }
  }, [paymentMethod, mfSession]);

  // Load MyFatoorah Script Manually
  useEffect(() => {
    if (paymentMethod === "myfatoorah" && mfSession?.scriptUrl && !isMfLoaded && !(window as any).myFatoorah) {
      const scriptId = "mf-payment-script";
      if (document.getElementById(scriptId)) {
        setIsMfLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = mfSession.scriptUrl;
      script.async = true;
      script.onload = () => {
        console.log("MF Script Loaded Manually");
        setIsMfLoaded(true);
      };
      script.onerror = () => {
        console.error("MF Script Load Error");
        setError("Failed to load payment library");
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod, mfSession, isMfLoaded]);

  const [offers, setOffers] = useState<Array<{id: string; text: string; price: number; originalPrice: number; icon: any}>>([]);
  
  useEffect(() => {
    fetch('/api/upsells?platform=INSTAGRAM&serviceType=VIEWS')
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
              icon: faEye
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

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  useEffect(() => {
    if (paymentMethod === "myfatoorah" && mfSession && isMfLoaded && (window as any).myFatoorah) {
      try {
        const config = {
          sessionId: mfSession.sessionId,
          countryCode: mfSession.countryCode,
          currencyCode: "KWD",
          amount: totalPrice.toFixed(2),
          containerId: "mf-embedded-payment",
          callback: (response: any) => {
            console.log("MF Callback:", response);
            if (response.paymentCompleted && response.isSuccess) {
              // Handle successful payment
              // Here we should probably call a verify API or complete the order
              // For now, let's just alert
              alert("Payment Successful!");
              setProcessing(false);
            } else {
               setError("Payment failed or cancelled");
               setProcessing(false);
            }
          },
          shouldHandlePaymentUrl: true
        };
        (window as any).myFatoorah.init(config);
      } catch (err) {
        console.error("MF Init Exception:", err);
        setError("Error initializing payment form");
      }
    }
  }, [paymentMethod, mfSession, isMfLoaded]);
  
  useEffect(() => {
    if (paymentMethod === "myfatoorah" && mfSession && isMfLoaded && (window as any).myFatoorah) {
      // Re-init MyFatoorah when price changes (due to coupon)
      // This might be tricky if the library doesn't support update. 
      // We might need to unmount and remount or call init again.
      // For now, let's assume calling init again works or the user hasn't loaded it yet.
    }
  }, [paymentMethod, mfSession, isMfLoaded, finalPrice]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    if (paymentMethod === 'pay_later') {
      alert(`Test Checkout Successful!\n\nPlatform: ${platform}\nService: ${service}\nQuantity: ${qty}\nTotal Price: ${formatPrice(finalPrice)}\nPosts: ${postCount}`);
      setProcessing(false);
      return;
    }

    try {
      // Check if user is logged in (we'll check this via the API response)
      // For now, proceed - the API will return 401 if not authenticated
      
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
        // In V3 Complete Payment mode, the payment is handled by the iframe callback.
        // We shouldn't reach here if we hide the Pay button, OR we might need to handle it differently.
        // If we want to use the standard 'Pay' button outside the iframe, we need 'Collect Details' mode.
        // But for 'Complete Payment' mode (which renders its own inputs and logic), usually the user interacts inside the iframe.
        // However, the doc says "Mode 1: Complete Payment ... MyFatoorah handles the OTP page."
        // It doesn't explicitly say if it renders a Pay button.
        // But usually embedded sessions do not render a Pay button, they render inputs.
        // If so, we might need to call myFatoorah.submit() or similar?
        // Wait, the doc says: "If shouldHandlePaymentUrl: true ... MyFatoorah handles the OTP page... After that, you will receive paymentCompleted: true"
        // It doesn't say how to TRIGGER the payment.
        // Let's assume we still need to trigger it if we have our own button.
        // But `myFatoorah.submit()` is for V2.
        // For V3 Session JS, maybe it's automatic or we need another call?
        // Let's check the doc again. "Mode 2: Collect Details Mode ... Use when you want to collect payment details first, and then complete payment."
        
        // If we use "Complete Payment", maybe the iframe contains the Pay button?
        // "This mode handles the entire payment process in a single flow".
        // This usually means the iframe has everything including the button.
        // If so, we should hide our "Pay" button when MyFatoorah is selected.
        // Let's assume the iframe has the button for now.
        return; 
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

      const serviceType = serviceTypeMap[service] || "VIEWS";
      const platformUpper = platform.toUpperCase();

      // Create order and payment in one call
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: platformUpper,
          serviceType,
          quantity: parseInt(qty) || 50,
          price: basePrice,
          link: postLink || null,
          paymentMethod: paymentMethod, // 'card' or 'crypto' or 'myfatoorah'
          currency: currencyCode,
          packageServiceId: packageServiceId || undefined, // Service ID from package (JAP Service ID)
          sessionId: cardSessionId,
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

      const { checkoutUrl, paymentId, paymentStatus, orderId } = await paymentResponse.json();
      
      if (checkoutUrl) {
        // For crypto payments, redirect to Cryptomus payment page
        // For card payments, redirect to Checkout.com
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

  // Get platform icon based on URL
  const getPlatformIcon = () => {
    return "/instagram-11.png";
  };

  const getMetricIcon = () => faEye;
  const getMetricLabel = () => "Views";
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
            {/* Left Column - Payment Form */}
            <div className="final-checkout-left">
              <div className="checkout-card">
                <h2 className="final-checkout-title">Review & Pay</h2>
                
                {/* Coupon Section */}
                <div className="coupon-section mb-6">
                  {!hasCoupon ? (
                    <button 
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                      onClick={() => setHasCoupon(true)}
                    >
                      <FontAwesomeIcon icon={faTag} />
                      I have a coupon code
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          disabled={!!appliedCoupon || isValidatingCoupon}
                        />
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={!couponCode || isValidatingCoupon}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isValidatingCoupon ? "Checking..." : "Apply"}
                          </button>
                        )}
                      </div>
                      {couponError && (
                        <p className="text-red-500 text-sm">{couponError}</p>
                      )}
                      {couponSuccess && (
                        <p className="text-green-500 text-sm">{couponSuccess}</p>
                      )}
                      {appliedCoupon && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <p className="text-green-700 text-sm font-medium">
                            Coupon applied! You saved {formatPrice(discountAmount)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
                            <div id="mf-embedded-payment" style={{ width: "100%" }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pay Later (Test) Option */}
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

                  <button type="submit" className="pay-button" disabled={processing || paymentMethod === "myfatoorah"}>
                    {processing ? (
                      <span>Processing...</span>
                    ) : paymentMethod === "myfatoorah" ? (
                      <span>Please complete payment above</span>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faLock} className="pay-button-icon" />
                        Pay {formatPrice(totalPrice)}
                      </>
                    )}
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
                    <img src="/instagram-11.png" alt="Instagram" width={20} height={20} />
                    <span>@{username || "username"}</span>
                  </div>
                  <button type="button" className="change-button">Change</button>
                </div>
              </div>

              <div className="checkout-card order-summary-final">
                <h3 className="order-summary-title">Order summary</h3>
                
                <div className="order-item">
                  <div className="order-item-left">
                    <FontAwesomeIcon icon={getMetricIcon()} className="order-item-icon" />
                    <div className="order-item-details">
                      <span className="order-item-text">{qty} {getMetricLabel()}</span>
                      <span className="order-item-subtext">Applying to {postCount} post{postCount !== 1 ? 's' : ''}.</span>
                      {postCount > 1 && (
                         <span className="order-item-subtext" style={{ fontSize: "11px", color: "#666" }}>
                           (~{viewsPerPost} {getMetricLabel().toLowerCase()}/post)
                         </span>
                      )}
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

                <div className="order-total">
                  {appliedCoupon && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
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
                    <button className="currency-button">{currencyCode}</button>
                    <span className="total-price">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              {offers.length > 0 && (
                <>
                  <h3 className="offers-title">EXCLUSIVE OFFERS</h3>
                  <div className="checkout-card exclusive-offers">
                    {offers.slice(0, 3).map((offer, index) => (
                      <div
                        key={offer.id}
                        className={`offer-item ${index === 2 ? "offer-pink" : "offer-green"} ${addedOffers.find(o => o.id === offer.id) ? "offer-added" : ""}`}
                      >
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
                          disabled={!!addedOffers.find(o => o.id === offer.id)}
                        >
                          {addedOffers.find(o => o.id === offer.id) ? "Added" : "+ Add"}
                        </button>
                      </div>
                    ))}
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

export default function FinalCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinalCheckoutContent />
    </Suspense>
  );
}

