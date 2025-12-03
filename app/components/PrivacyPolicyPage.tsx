"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faArrowRight,
  faLock,
  faHand,
  faClock,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type PrivacySection = {
  id: string;
  title: string;
  icon: any;
  content: string;
};

const sections: PrivacySection[] = [
  {
    id: "data-collection",
    title: "Data Collection",
    icon: faTriangleExclamation,
    content: `**Information We Collect**

We collect information that you provide directly to us when you use our Service. This includes:

- **Personal Information:** Your name, email address, and social media username/URL when you make a purchase or create an account
- **Payment Information:** All payment information is handled securely by trusted third-party payment processors. We do not store your full payment card details
- **Usage Information:** Information about how you use our Service, including pages visited, time spent, and features used
- **Device Information:** Technical information about your device, browser, and IP address for security and service improvement purposes`,
  },
  {
    id: "data-usage",
    title: "Data Usage",
    icon: faCheck,
    content: `**How We Use Your Information**

We use the information we collect to:

- **Process Transactions:** Complete your purchases and deliver the services you've requested
- **Send Updates:** Keep you informed about your orders, delivery status, and important service updates
- **Respond to Support:** Address your questions, concerns, and support requests promptly
- **Analyze Usage Trends:** Understand how our Service is used to improve functionality and user experience
- **Ensure Security:** Detect and prevent fraud, abuse, and other security threats
- **Comply with Legal Obligations:** Meet our legal and regulatory requirements`,
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    icon: faArrowRight,
    content: `**Information Sharing**

**We do not sell your personal information.**

We may share your information only in the following limited circumstances:

- **Trusted Third-Party Payment Processors:** To process payments securely. These processors are required to maintain the confidentiality of your information
- **Legal Obligations:** When required by law, court order, or government regulation
- **Protection of Rights:** To protect our rights, privacy, safety, or property, or that of our users or others
- **Business Transfers:** In connection with any merger, sale of company assets, or acquisition, your information may be transferred as part of that transaction

We do not share your information with third parties for their marketing purposes.`,
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: faLock,
    content: `**Data Security**

We implement robust security measures to protect your personal information:

- **Secure Connections:** All data transmission is encrypted using SSL (Secure Socket Layer) technology
- **Certified Payment Gateways:** We use industry-standard, PCI-compliant payment processors to handle all financial transactions
- **Access Controls:** Your personal information is accessible only to authorized personnel who need it to perform their job functions
- **Regular Security Audits:** We conduct regular security assessments to identify and address potential vulnerabilities

While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to maintaining the highest standards of data protection.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: faHand,
    content: `**Your Choices & Rights**

You have the following rights regarding your personal information:

- **Opt-Out of Promotional Communications:** You can opt out of receiving promotional emails by clicking the unsubscribe link in any promotional email we send you, or by contacting us directly
- **Access Your Information:** You can request access to the personal information we hold about you
- **Update Your Information:** You can update or correct your personal information through your account settings or by contacting us
- **Delete Your Information:** You can request deletion of your personal information, subject to certain legal and operational requirements
- **Essential Communications:** Please note that even if you opt out of promotional communications, we may still send you essential, non-promotional messages related to your account or orders, such as order confirmations and delivery updates`,
  },
  {
    id: "policy-changes",
    title: "Policy Changes",
    icon: faClock,
    content: `**Changes to This Policy**

We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:

- Update the "Last updated" date at the top of this Privacy Policy
- Post the revised policy on this page with a clear indication of what has changed
- Notify you of significant changes via email or a prominent notice on our Service

We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information. Your continued use of our Service after any changes indicates your acceptance of the updated Privacy Policy.`,
  },
  {
    id: "contact-us",
    title: "Contact Us",
    icon: faCommentDots,
    content: `**Contact Us**

If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

- **Email:** [contact us](/contact)
- **Website:** Visit our [contact page](/contact) for more ways to reach us

We are committed to addressing your privacy concerns and will respond to your inquiries as promptly as possible.`,
  },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatContent = (content: string) => {
    const lines = content.split("\n").filter((line) => line.trim());
    const result: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**") && !trimmedLine.includes("\n")) {
        // Header text
        if (currentParagraph.length > 0) {
          result.push(
            <p key={`para-${lineIndex}`} className="privacy-text">
              {formatInlineText(currentParagraph.join(" "))}
            </p>
          );
          currentParagraph = [];
        }
        const headerText = trimmedLine.slice(2, -2);
        result.push(
          <h3 key={`header-${lineIndex}`} className="privacy-section-title">
            {headerText}
          </h3>
        );
      } else if (trimmedLine.startsWith("-")) {
        // List item
        if (currentParagraph.length > 0) {
          result.push(
            <p key={`para-${lineIndex}`} className="privacy-text">
              {formatInlineText(currentParagraph.join(" "))}
            </p>
          );
          currentParagraph = [];
        }
        const listText = trimmedLine.replace(/^-\s*/, "");
        result.push(
          <div key={`list-${lineIndex}`} className="privacy-list-item">
            {formatInlineText(listText)}
          </div>
        );
      } else {
        currentParagraph.push(trimmedLine);
      }
    });
    
    if (currentParagraph.length > 0) {
      result.push(
        <p key="para-final" className="privacy-text">
          {formatInlineText(currentParagraph.join(" "))}
        </p>
      );
    }
    
    return result;
  };

  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="privacy-page">
      {/* Hero Section */}
      <div className="privacy-hero">
        <div className="container">
          <div className="privacy-hero-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <h1 className="privacy-title">
            Privacy <span className="privacy-title-accent">Policy</span>
          </h1>
          <p className="privacy-subtitle">
            Your privacy is our priority. This policy outlines our commitment to protecting your data and how we use it to provide our services.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="privacy-content">
        <div className="container">
          {/* Sidebar Navigation */}
          <aside className="privacy-sidebar">
            <nav className="privacy-sidebar-nav">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`privacy-sidebar-link ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section.id);
                  }}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content Sections */}
          <main className="privacy-main">
            {sections.map((section, index) => (
              <div key={section.id} id={section.id} className="privacy-section">
                <div className="privacy-section-header">
                  <div className="privacy-section-icon">
                    <FontAwesomeIcon icon={section.icon} />
                  </div>
                  <div>
                    <span className="privacy-section-number">{index + 1}.</span>
                    <h2 className="privacy-section-heading">{section.title}</h2>
                  </div>
                </div>
                <div className="privacy-section-body">
                  {formatContent(section.content)}
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}

