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
  faShieldHalved,
  faTag,
  faCoins,
  faVideo,
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import Link from "next/link";

export function FinalCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { formatPrice, getCurrencySymbol, currency } = useCurrency();
  
  const videoLink = searchParams.get("videoLink") || "";
  const qty = searchParams.get("qty") || "1000";
  const priceValue = parseFloat(searchParams.get("price") || "29.99");
  const packageType = searchParams.get("type") || "High-Retention";
  const packageServiceId = searchParams.get("serviceId") || "";

  // Get platform and service from pathname
  const pathParts = pathname?.split("/") || [];
  const platform = pathParts[1] || "youtube";
  const service = pathParts[2] || "views";
  
  // Create URLs for navigation
  const detailsUrl = `/${platform}/${service}/checkout?qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
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

  // YouTube specific offers
  const offers = [
    { id: "offer1", text: "100 Likes", price: 5.99, icon: faHeart },
    { id: "offer2", text: "50 Subscribers", price: 11.24, icon: faVideo },
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
  const currencyCode = currency;

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

      if (!videoLink) {
        setError("Video link is required");
        setProcessing(false);
        return;
      }

      const serviceType = "VIEWS";
      const platformUpper = "YOUTUBE";

      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformUpper,
          serviceType,
          quantity: parseInt(qty) || 1000,
          price: totalPrice,
          link: videoLink,
          paymentMethod: paymentMethod,
          currency: currencyCode,
          packageServiceId: packageServiceId || undefined,
          email: email, // Include email for receipt
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Payment failed");
      }

      const paymentData = await paymentResponse.json();
      
      // Redirect to success page or payment gateway
      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        // Fallback for demo/testing
        alert("Payment successful! (Simulation)");
        router.push("/");
      }

    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  // Helper to get icon for metric
  const getMetricIcon = () => faPlay;
  const getMetricLabel = () => "Views";

  return (
    <>
      <Header />
      <main className="final-checkout-page">
        <div className="final-checkout-container">
          <div className="checkout-progress">
            <Link href={detailsUrl} className="progress-step completed">
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Details</span>
            </Link>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step active">
              <div className="progress-step-icon">
                <span>2</span>
              </div>
              <span className="progress-step-label">Checkout</span>
            </div>
          </div>

          <div className="checkout-content-grid">
            <div className="payment-column">
              <h2 className="section-title">Payment Method</h2>
              
              {error && (
                <div className="error-alert">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>{error}</span>
                </div>
              )}

              <div className="payment-methods">
                <div 
                  className={`payment-method ${paymentMethod === "card" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="method-radio"></div>
                  <FontAwesomeIcon icon={faCreditCard} className="method-icon" />
                  <span className="method-name">Credit Card</span>
                  <div className="method-badges">
                    <span className="badge">Visa</span>
                    <span className="badge">Mastercard</span>
                  </div>
                </div>
                
                <div 
                  className={`payment-method ${paymentMethod === "crypto" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <div className="method-radio"></div>
                  <FontAwesomeIcon icon={faCoins} className="method-icon" />
                  <span className="method-name">Crypto</span>
                  <div className="method-badges">
                    <span className="badge">BTC</span>
                    <span className="badge">ETH</span>
                    <span className="badge">-10%</span>
                  </div>
                </div>
              </div>

              <form className="payment-form" onSubmit={handlePayment}>
                {paymentMethod === "card" && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="form-input"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Card Number</label>
                      <div className="input-with-icon">
                        <FontAwesomeIcon icon={faCreditCard} className="input-icon" />
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          className="form-input"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="form-input"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVC</label>
                        <div className="input-with-icon">
                          <FontAwesomeIcon icon={faLock} className="input-icon" />
                          <input 
                            type="text" 
                            placeholder="123" 
                            className="form-input"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === "crypto" && (
                  <div className="crypto-details">
                    <p>You will be redirected to Coinbase Commerce to complete your payment securely.</p>
                    <div className="crypto-logos">
                      {/* Add crypto logos if needed */}
                    </div>
                  </div>
                )}

                <div className="coupon-section">
                  <div 
                    className="coupon-toggle"
                    onClick={() => setHasCoupon(!hasCoupon)}
                  >
                    <FontAwesomeIcon icon={faTag} />
                    <span>Have a coupon code?</span>
                  </div>
                  
                  {hasCoupon && (
                    <div className="coupon-input-group">
                      <input 
                        type="text" 
                        placeholder="Enter code" 
                        className="coupon-input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button type="button" className="coupon-btn">Apply</button>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="pay-button"
                  disabled={processing}
                >
                  {processing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faLock} />
                      Pay {formatPrice(totalPrice)}
                    </>
                  )}
                </button>
                
                <p className="secure-note">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  Your payment information is encrypted and secure.
                </p>
              </form>
            </div>

            <div className="summary-column">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-main-item">
                  <div className="item-icon">
                    <FontAwesomeIcon icon={getMetricIcon()} />
                  </div>
                  <div className="item-details">
                    <div className="item-title">{qty} YouTube {getMetricLabel()}</div>
                    <div className="item-subtitle">{packageType}</div>
                    {videoLink && (
                      <div className="item-link" title={videoLink}>
                         {videoLink.length > 30 ? videoLink.substring(0, 30) + "..." : videoLink}
                      </div>
                    )}
                  </div>
                  <div className="item-price">{formatPrice(priceValue)}</div>
                </div>

                {addedOffers.length > 0 && (
                  <div className="added-offers-list">
                    {addedOffers.map(offer => (
                      <div key={offer.id} className="added-offer-item">
                        <div className="offer-info">
                          <FontAwesomeIcon icon={offer.icon} className="offer-icon" />
                          <span>{offer.text}</span>
                        </div>
                        <div className="offer-price-action">
                          <span>{formatPrice(offer.price)}</span>
                          <button 
                            className="remove-offer-btn"
                            onClick={() => handleRemoveOffer(offer.id)}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="summary-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(priceValue)}</span>
                  </div>
                  {addedOffers.length > 0 && (
                    <div className="total-row">
                      <span>Add-ons</span>
                      <span>{formatPrice(offersTotal)}</span>
                    </div>
                  )}
                  {paymentMethod === "crypto" && (
                    <div className="total-row discount">
                      <span>Crypto Discount (10%)</span>
                      <span>-{formatPrice(totalPrice * 0.1)}</span>
                    </div>
                  )}
                  <div className="total-divider"></div>
                  <div className="total-row final">
                    <span>Total</span>
                    <span>{formatPrice(paymentMethod === "crypto" ? totalPrice * 0.9 : totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="upsell-box">
                <h4>Frequently Bought Together</h4>
                <div className="upsell-list">
                  {offers.filter(o => !addedOffers.find(ao => ao.id === o.id)).map(offer => (
                    <div key={offer.id} className="upsell-item">
                      <div className="upsell-icon">
                        <FontAwesomeIcon icon={offer.icon} />
                      </div>
                      <div className="upsell-info">
                        <div className="upsell-text">{offer.text}</div>
                        <div className="upsell-price">{formatPrice(offer.price)}</div>
                      </div>
                      <button 
                        className="upsell-add-btn"
                        onClick={() => handleAddOffer(offer)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
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
        
        .checkout-content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
        }
        
        @media (max-width: 900px) {
          .checkout-content-grid {
            grid-template-columns: 1fr;
          }
          
          .summary-column {
            order: -1;
          }
        }
        
        .payment-column {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }
        
        .section-title {
          margin-bottom: 25px;
          font-size: 1.5rem;
          color: #1a1a1a;
        }
        
        .payment-methods {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .payment-method {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 15px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }
        
        .payment-method.active {
          border-color: #0070f3;
          background: #f0f7ff;
        }
        
        .method-radio {
          width: 20px;
          height: 20px;
          border: 2px solid #adb5bd;
          border-radius: 50%;
          position: absolute;
          top: 15px;
          right: 15px;
        }
        
        .payment-method.active .method-radio {
          border-color: #0070f3;
          background: #0070f3;
          box-shadow: inset 0 0 0 4px white;
        }
        
        .method-icon {
          font-size: 1.5rem;
          color: #495057;
          margin-top: 10px;
        }
        
        .payment-method.active .method-icon {
          color: #0070f3;
        }
        
        .method-name {
          font-weight: 600;
          color: #495057;
        }
        
        .method-badges {
          display: flex;
          gap: 5px;
        }
        
        .badge {
          background: #f8f9fa;
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
