"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDollarSign, 
  faChartBar, 
  faClock,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

const benefits = [
  {
    icon: faDollarSign,
    text: "Earn a competitive 25% recurring commission on every sale you refer. The more you sell, the more you earn.",
  },
  {
    icon: faChartBar,
    text: "Our site is highly optimized for conversions, meaning more of your traffic turns into sales and earnings for you.",
  },
  {
    icon: faClock,
    text: "Our affiliate dashboard provides real-time stats on your clicks, sign-ups, and earnings.",
  },
];

const steps = [
  {
    number: "01",
    title: "Join the Program",
    description: "Sign up using the simple form below. It's free and only takes a minute.",
  },
  {
    number: "02",
    title: "Promote Likes.io",
    description: "Share your unique referral link on your blog, social media, or website.",
  },
  {
    number: "03",
    title: "Earn Commissions",
    description: "Get paid for every customer who makes a purchase through your link.",
  },
];

const affiliateFAQs = [
  {
    q: "How much can I earn as an affiliate?",
    a: "Your earning potential is uncapped. The more sales you refer through your unique link, the more commission you will make.",
  },
  {
    q: "How and when do I get paid?",
    a: "We process affiliate payments monthly via PayPal or bank transfer. Payments are sent by the 15th of each month for the previous month's earnings, provided you've reached the minimum payout threshold of $50.",
  },
  {
    q: "How does the tracking work?",
    a: "Each affiliate receives a unique tracking link. When someone clicks your link and makes a purchase, it's automatically tracked and attributed to your account. Our system uses cookies to track referrals for up to 90 days.",
  },
  {
    q: "Do I get a dashboard to track my performance?",
    a: "Yes! Once approved, you'll get access to a comprehensive affiliate dashboard where you can track clicks, conversions, earnings, and view detailed analytics in real-time.",
  },
];

export default function AffiliatePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    website: "",
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add API call here
  };

  return (
    <section className="affiliate-page">
      <div className="container">
        {/* Hero Section */}
        <div className="affiliate-hero">
          <h1 className="affiliate-hero-title">Partner with Likes.io & Earn</h1>
          <p className="affiliate-hero-subtitle">
            Join our affiliate program to earn generous commissions by promoting the #1 social media growth service on the market.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="affiliate-benefits">
          <div className="affiliate-benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="affiliate-benefit-card">
                <div className="affiliate-benefit-icon">
                  <FontAwesomeIcon icon={benefit.icon} />
                </div>
                <p className="affiliate-benefit-text">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="affiliate-how-it-works">
          <h2 className="affiliate-section-title">How It Works</h2>
          <p className="affiliate-section-subtitle">Getting started is as easy as 1, 2, 3.</p>
          <div className="affiliate-steps">
            {steps.map((step, index) => (
              <div key={index} className="affiliate-step">
                <div className="affiliate-step-number">{step.number}</div>
                <div className="affiliate-step-content">
                  <h3 className="affiliate-step-title">{step.title}</h3>
                  <p className="affiliate-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate FAQs Section */}
        <div className="affiliate-faqs">
          <h2 className="affiliate-section-title">Affiliate FAQs</h2>
          <div className="affiliate-faq-list">
            {affiliateFAQs.map((faq, index) => (
              <div
                key={index}
                className={`affiliate-faq-item ${openFaq === index ? "open" : ""}`}
              >
                <button
                  className="affiliate-faq-head"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="affiliate-faq-question">{faq.q}</span>
                  <span className="affiliate-faq-toggle">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && (
                  <div className="affiliate-faq-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Become an Affiliate Form Section */}
        <div className="affiliate-form-section">
          <h2 className="affiliate-section-title">Become an Affiliate Today</h2>
          <p className="affiliate-section-subtitle">Fill out the form below to get started.</p>
          <form className="affiliate-form" onSubmit={handleSubmit}>
            <div className="affiliate-form-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>
            <div className="affiliate-form-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Enter your email address"
              />
            </div>
            <div className="affiliate-form-field">
              <label htmlFor="website">Website or Social Media Profile</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="e.g., https://instagram.com/yourhandle"
              />
            </div>
            <button type="submit" className="affiliate-submit-btn">
              Join Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

