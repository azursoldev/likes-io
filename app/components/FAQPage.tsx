"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

type FAQCategory = {
  id: string;
  label: string;
};

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const categories: FAQCategory[] = [
  { id: "general", label: "General Knowledge" },
  { id: "orders", label: "Orders & Delivery" },
  { id: "safety", label: "Account Safety" },
  { id: "billing", label: "Billing Questions" },
];

const faqs: FAQItem[] = [
  // General Knowledge
  {
    id: "1",
    category: "general",
    question: "What is Likes.io and how does it work?",
    answer: "Likes.io is a leading marketplace for social media promotion. You can buy followers, likes, views, and more for nearly all social media networks. We offer affordable prices without compromising on service quality. Simply select your package, provide your account details (no password required), and watch your engagement grow.",
  },
  {
    id: "2",
    category: "general",
    question: "Is using Likes.io safe for my social media account?",
    answer: "Yes, absolutely. We use safe delivery methods and quality profiles that comply with platform guidelines to minimize risk and maintain account health. We never ask for your password, and all our services are designed to be discreet and secure.",
  },
  {
    id: "3",
    category: "general",
    question: 'What is the difference between "High-Quality" and "Premium" services?',
    answer: "High-Quality services offer great value with real-looking profiles, perfect for quick boosts and budget-conscious users. Premium services provide the highest authenticity and retention, ideal for brands seeking top-tier credibility with active users and maximum organic growth potential.",
  },
  {
    id: "4",
    category: "general",
    question: "How quickly will I receive my order?",
    answer: "Most orders begin within minutes of purchase. Delivery time depends on your selected package size and pacing preferences. Smaller packages typically complete within hours, while larger orders may take a few days for maximum safety and natural delivery.",
  },
  {
    id: "5",
    category: "general",
    question: "Which social media platforms do you support?",
    answer: "We support Instagram, TikTok, YouTube, Facebook, Twitter, and many other major social media platforms. You can find everything on our website to improve your presence on these platforms.",
  },
  // Orders & Delivery
  {
    id: "6",
    category: "orders",
    question: "How long does delivery take?",
    answer: "Delivery typically starts within minutes of purchase. Completion time varies based on package size: small packages (50-500) usually complete within 1-2 hours, medium packages (1K-5K) within 24-48 hours, and large packages (10K+) may take 3-7 days for gradual, natural delivery.",
  },
  {
    id: "7",
    category: "orders",
    question: "Can I cancel or modify my order after purchase?",
    answer: "Contact our support team immediately if you need to cancel or modify your order. If delivery hasn't started, we can usually adjust or cancel the order. Once delivery begins, modifications may be limited, but our support team will work with you to find the best solution.",
  },
  {
    id: "8",
    category: "orders",
    question: "What happens if my order doesn't complete?",
    answer: "If your order doesn't complete as expected, contact our 24/7 support team. We offer refill guarantees and will ensure you receive the full service you paid for. Premium packages include lifetime refill guarantees for added peace of mind.",
  },
  {
    id: "9",
    category: "orders",
    question: "Can I split my order across multiple posts/accounts?",
    answer: "Yes, depending on your package, you can distribute engagement across multiple posts or accounts. During checkout, you can specify how you'd like to split your order. This feature is available for most packages.",
  },
  // Account Safety
  {
    id: "10",
    category: "safety",
    question: "Do I need to provide my password?",
    answer: "Never. We will never ask for your password. We only need your username and the post/channel link(s) to deliver engagement. Your account security is our top priority.",
  },
  {
    id: "11",
    category: "safety",
    question: "Will my account get banned or suspended?",
    answer: "We use safe delivery methods that comply with platform guidelines. Our services are designed to mimic organic growth patterns, minimizing any risk to your account. However, we always recommend following platform terms of service and using our services responsibly.",
  },
  {
    id: "12",
    category: "safety",
    question: "Are the followers/likes/views from real accounts?",
    answer: "Our High-Quality services use real-looking profiles with authentic appearance. Premium services use accounts from active users with real activity. All our services are designed to appear natural and comply with platform guidelines.",
  },
  {
    id: "13",
    category: "safety",
    question: "Is my payment information secure?",
    answer: "Yes, absolutely. We use industry-standard encryption and secure payment processors. We never store your full payment details, and all transactions are processed through secure, PCI-compliant payment gateways.",
  },
  // Billing Questions
  {
    id: "14",
    category: "billing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and other secure payment methods. All payment options are displayed at checkout.",
  },
  {
    id: "15",
    category: "billing",
    question: "Do you offer refunds?",
    answer: "Refunds are handled per our policy. If we fail to deliver as promised, we will make it right. Premium packages include satisfaction guarantees. Contact our support team if you have concerns about your order.",
  },
  {
    id: "16",
    category: "billing",
    question: "Are there any hidden fees?",
    answer: "No, there are no hidden fees. The price displayed is the final price you'll pay. All taxes and fees are included in the displayed price, so you know exactly what you're paying upfront.",
  },
  {
    id: "17",
    category: "billing",
    question: "Can I get a discount for bulk orders?",
    answer: "Yes! We offer discounts for larger packages, and you can contact our sales team for custom pricing on very large orders (10,000+). Premium packages also offer better value per unit for larger quantities.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => faq.category === activeCategory);

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <section className="faq-page">
      <div className="container">
        <div className="faq-page-header">
          <h1 className="faq-page-title">
            Frequently Asked Questions <span className="faq-emoji">👋</span>
          </h1>
        </div>

        <div className="faq-page-content">
          <aside className="faq-sidebar">
            <nav className="faq-categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`faq-category-btn ${activeCategory === category.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenQuestion(null);
                  }}
                  type="button"
                >
                  {category.label}
                  {activeCategory === category.id && (
                    <FontAwesomeIcon icon={faAngleRight} className="faq-category-arrow" />
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <div className="faq-questions">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-question-item ${openQuestion === faq.id ? "open" : ""}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => toggleQuestion(faq.id)}
                  type="button"
                  aria-expanded={openQuestion === faq.id}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-question-toggle">
                    {openQuestion === faq.id ? "−" : "+"}
                  </span>
                </button>
                {openQuestion === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

