"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../dashboard/dashboard.css";

import {
  faSearch,
  faPlus,
  faMinus,
  faArrowRight,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import {
  faClipboard,
  faCreditCard,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import UserSidebar from "./UserSidebar";
import Header from "./Header";
import Footer from "./Footer";

const popularTopics = [
  {
    icon: faBookOpen,
    title: "Getting Started",
    colorClass: "topic-icon-blue",
    showIcon: true,
  },
  {
    icon: faClipboard,
    title: "Orders & Delivery",
    colorClass: "topic-icon-green",
    showIcon: true,
  },
  {
    icon: faCreditCard,
    title: "Billing & Payments",
    colorClass: "topic-icon-purple",
    showIcon: true,
  },
  {
    icon: faUser,
    title: "Account Management",
    colorClass: "topic-icon-yellow",
    showIcon: true,
  },
];

const faqs = [
  {
    id: 1,
    question: "I did not receive my order, what do I do?",
    answer: "Most orders are delivered instantly. However, during peak times, it might take a few hours. If you haven't received your order after 24 hours, please contact our 24/7 support with your order ID.",
  },
  {
    id: 2,
    question: "Why are my followers or likes dropping?",
    answer: "Some platforms periodically remove inactive or fake accounts, which can cause a temporary drop in followers or likes. This is normal and happens across all accounts. Our services use high-quality profiles to minimize this effect.",
  },
  {
    id: 3,
    question: "Is my payment information secure?",
    answer: "Yes, absolutely. We use industry-standard encryption and secure payment processors. We never store your full payment details, and all transactions are processed through PCI-compliant payment gateways.",
  },
];

export default function HelpSupportDashboard() {
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        {/* Left Sidebar */}
        <UserSidebar active="support" />

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="container">
            <div className="help-support-content">
              <div className="help-support-header">
                <h1 className="help-support-title">Help & Support</h1>
                <p className="help-support-subtitle">How can we help you today?</p>

                {/* Search Bar */}
                <div className="help-search">
                  <FontAwesomeIcon icon={faSearch} className="help-search-icon" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    className="help-search-input"
                  />
                </div>
              </div>

              {/* Popular Topics */}
              <div className="popular-topics-section">
                <h2 className="popular-topics-title">Popular Topics</h2>
                <div className="popular-topics-grid">
                  {popularTopics.map((topic, index) => (
                    <div key={index} className="popular-topic-card">
                      {topic.showIcon && (
                        <div className={`popular-topic-icon ${topic.colorClass}`}>
                          <FontAwesomeIcon icon={topic.icon} style={{ fontSize: '32px' }} />
                        </div>
                      )}
                      <h3 className="popular-topic-title">{topic.title}</h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="help-faq-section">
                <h2 className="help-faq-title">Frequently Asked Questions</h2>
                <div className="help-faq-list">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className={`help-faq-item ${openFaq === faq.id ? "open" : ""}`}
                    >
                      <button
                        className="help-faq-head"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={openFaq === faq.id}
                      >
                        <span className="help-faq-question">{faq.question}</span>
                        <span className="help-faq-toggle">
                          <FontAwesomeIcon icon={openFaq === faq.id ? faMinus : faPlus} />
                        </span>
                      </button>
                      {openFaq === faq.id && (
                        <div className="help-faq-body">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Still Need Help Section */}
              <div className="still-need-help">
                <div className="still-need-help-content">
                  <h3 className="still-need-help-title">Still need help?</h3>
                  <p className="still-need-help-text">Our support team is available 24/7 to assist you.</p>
                </div>
                <a href="/contact" className="contact-support-btn">
                  Contact Support
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

