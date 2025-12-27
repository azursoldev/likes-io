"use client";
import { useState, useRef, useEffect, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck, 
  faStar,
  faUser, 
  faDollarSign, 
  faXmark,
  faCircleNotch,
  faTriangleExclamation,
  faClock,
  faHeadset,
  faBookOpen,
  faArrowRight,
  faLock,
  faHand,
  faCommentDots
} from "@fortawesome/free-solid-svg-icons";

type TermSection = {
  id: string;
  title: string;
  icon: any;
  content: string;
};

const ICON_MAP: Record<string, any> = {
  faBookOpen,
  faCheck,
  faStar,
  faUser,
  faDollarSign,
  faXmark,
  faCircleNotch,
  faTriangleExclamation,
  faClock,
  faHeadset,
  faArrowRight,
  faLock,
  faHand,
  faCommentDots
};

const defaultSections: TermSection[] = [
  {
    id: "definitions",
    title: "Definitions",
    icon: faBookOpen,
    content: `**1. Interpretation and Definitions**

**Interpretation**

The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.

**Definitions**

For the purposes of these Terms of Service:

- **Company** (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Likes.io, operated by Last Page Ltd. (HE470127), Nicosia, Cyprus.
- **Service** refers to the Website.
- **Terms of Service** (also referred as "Terms") mean these Terms of Service that form the entire agreement between You and the Company regarding the use of the Service.
- **Website** refers to Likes.io, accessible from https://likes.io
- **You** means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.`
  },
  {
    id: "acknowledgment",
    title: "Acknowledgment",
    icon: faCheck,
    content: `**2. Acknowledgment**

These are the Terms of Service governing the use of this Service and the agreement that operates between You and the Company. These Terms of Service set out the rights and obligations of all users regarding the use of the Service.

Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms of Service. These Terms of Service apply to all visitors, users and others who access or use the Service.

By accessing or using the Service You agree to be bound by these Terms of Service. If You disagree with any part of these Terms of Service then You may not access the Service.

You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.`
  },
  {
    id: "service",
    title: "The Service",
    icon: faStar,
    content: `**3. Service Description**

Likes.io provides social media marketing services, including but not limited to likes, followers, views, subscribers, and other forms of engagement across various social media platforms including Instagram, TikTok, YouTube, Facebook, Twitter, and others.

**Service Availability**

We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We do not guarantee that the Service will be available at all times or that it will be uninterrupted, secure, or error-free.

**Service Delivery**

While we strive to deliver all services as described, we do not guarantee:
- That follower interactions will be maintained after delivery
- That 100% of profiles for purchased accounts will remain complete or active
- Exact delivery times, as these may vary based on platform policies and service demand

We commit to delivering services using safe methods that comply with platform guidelines to the best of our ability.`
  },
  {
    id: "user-role",
    title: "Your Role",
    icon: faUser,
    content: `**4. User Responsibilities**

**Account Requirements**

- You must ensure that your social media accounts are set to public during the delivery period of any service you purchase
- You are responsible for maintaining the security of your account credentials
- You must provide accurate information when using our Service

**Prohibited Uses**

You agree not to use the Service:
- For any unlawful purpose or to solicit others to perform unlawful acts
- To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
- To infringe upon or violate our intellectual property rights or the intellectual property rights of others
- To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
- To submit false or misleading information
- For content that is hateful, threatening, pornographic, or otherwise objectionable

**Fraudulent Activity**

You agree not to file fraudulent disputes or chargebacks. Fraudulent disputes may result in immediate account termination, IP ban, and legal action.`
  },
  {
    id: "payments",
    title: "Payments & Refunds",
    icon: faDollarSign,
    content: `**5. Payment and Refunds**

**Payment Terms**

All purchases are final. By completing a purchase, you agree to pay the amount specified for the selected service package.

**Refund Policy**

We offer refunds only in the following circumstances:
- If services are not delivered within 7 days of purchase (excluding custom or large orders that specify longer delivery times)
- If you contact our support team within 48 hours of purchase and delivery has not yet begun

Refunds will be processed to the original payment method within 5-10 business days.

**No Refunds For**
- Services that have been delivered, even partially
- Orders cancelled after delivery has begun
- User error (e.g., incorrect username, private account settings)
- Account bans or suspensions by the social media platform
- Changes to social media platform policies

**Fraudulent Disputes**

Filing a fraudulent dispute or chargeback may result in:
- Immediate account termination
- Permanent IP ban
- Legal action to recover costs and damages`
  },
  {
    id: "termination",
    title: "Termination",
    icon: faXmark,
    content: `**6. Termination**

We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms of Service.

Upon termination, Your right to use the Service will cease immediately.

If You wish to terminate Your account, You may simply discontinue using the Service and contact us to request account deletion. However, any pending orders will be completed according to our standard delivery processes.

We reserve the right to refuse service to anyone for any reason at any time.`
  },
  {
    id: "liability",
    title: "Liability",
    icon: faCircleNotch,
    content: `**7. Limitation of Liability**

Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.

To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.

Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.

**"As Is" and "As Available" Disclaimer**

The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory, or otherwise.`
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: faTriangleExclamation,
    content: `**8. Governing Law**

The laws of Cyprus, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Service may also be subject to other local, state, national, or international laws.

Any disputes arising out of or relating to these Terms of Service or the Service shall be subject to the exclusive jurisdiction of the courts of Cyprus.`
  },
  {
    id: "changes",
    title: "Changes",
    icon: faClock,
    content: `**9. Changes to These Terms of Service**

We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material, We will make reasonable efforts to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.

By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service.

We may update our Terms of Service from time to time. Thus, You are advised to review this page periodically for any changes. We will notify You of any changes by posting the new Terms of Service on this page.

These changes are effective immediately after they are posted on this page.`
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: faHeadset,
    content: `**10. Contact Us**

If you have any questions about these Terms of Service, You can contact us:

- By visiting our contact page: https://likes.io/contact
- By email: support@likes.io

We aim to respond to all inquiries within 24-48 hours during business days.`
  }
];

export default function TermsPage({ data }: { data?: any }) {
  const [sections, setSections] = useState<TermSection[]>(defaultSections);
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (data && data.sections) {
      const mappedSections = data.sections.map((s: any) => ({
        ...s,
        icon: ICON_MAP[s.icon] || faCheck // Fallback to check icon
      }));
      setSections(mappedSections);
    } else {
      setSections(defaultSections);
    }
  }, [data]);

  useEffect(() => {
    if (sections.length > 0) {
        if (!activeSection || !sections.find(s => s.id === activeSection)) {
            setActiveSection(sections[0].id);
        }
    }
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const ref = sectionRefs.current[section.id];
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const ref = sectionRefs.current[id];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const extractMainHeading = (content: string): string | null => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const firstLine = lines[0]?.trim();
    if (firstLine?.match(/^\*\*\d+\.\s+.*\*\*$/)) {
      return firstLine.replace(/\*\*/g, '');
    }
    return null;
  };

  const formatContent = (content: string, skipFirstHeading: boolean = false) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const elements: ReactElement[] = [];
    let currentParagraph = '';
    let currentList: string[] = [];
    let firstHeadingSkipped = false;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for numbered headings (e.g., **1. Title**)
      if (trimmed.match(/^\*\*\d+\.\s+.*\*\*$/)) {
        // Skip the first numbered heading if skipFirstHeading is true
        if (skipFirstHeading && !firstHeadingSkipped) {
          firstHeadingSkipped = true;
          return;
        }
        if (currentParagraph) {
          elements.push(<p key={`p-${index}`} className="terms-text">{currentParagraph.trim()}</p>);
          currentParagraph = '';
        }
        const headingText = trimmed.replace(/\*\*/g, '');
        elements.push(<h3 key={`h-${index}`} className="terms-section-title">{headingText}</h3>);
        return;
      }
      
      // Check for bold subheadings (e.g., **Subheading**)
      if (trimmed.match(/^\*\*[^*]+\*\*$/) && !trimmed.includes('-')) {
        if (currentParagraph) {
          elements.push(<p key={`p-${index}`} className="terms-text">{currentParagraph.trim()}</p>);
          currentParagraph = '';
        }
        if (currentList.length > 0) {
          elements.push(
            <ul key={`ul-${index}`} className="terms-list">
              {currentList.map((item, idx) => {
                const itemParts = item.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <li key={idx} className="terms-list-item">
                    {itemParts.map((part, pIdx) => {
                      if (part.match(/^\*\*[^*]+\*\*$/)) {
                        return <strong key={pIdx}>{part.replace(/\*\*/g, '')}</strong>;
                      }
                      return <span key={pIdx}>{part}</span>;
                    })}
                  </li>
                );
              })}
            </ul>
          );
          currentList = [];
        }
        const subheadingText = trimmed.replace(/\*\*/g, '');
        elements.push(<h4 key={`h4-${index}`} className="terms-subheading">{subheadingText}</h4>);
        return;
      }
      
      // Check for list items (starting with -)
      if (trimmed.startsWith('- ')) {
        if (currentParagraph) {
          elements.push(<p key={`p-${index}`} className="terms-text">{currentParagraph.trim()}</p>);
          currentParagraph = '';
        }
        currentList.push(trimmed.substring(2));
        return;
      }
      
      // Regular paragraph text
      if (trimmed) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`ul-${index}`} className="terms-list">
              {currentList.map((item, idx) => {
                const itemParts = item.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <li key={idx} className="terms-list-item">
                    {itemParts.map((part, pIdx) => {
                      if (part.match(/^\*\*[^*]+\*\*$/)) {
                        return <strong key={pIdx}>{part.replace(/\*\*/g, '')}</strong>;
                      }
                      return <span key={pIdx}>{part}</span>;
                    })}
                  </li>
                );
              })}
            </ul>
          );
          currentList = [];
        }
        
        // Add to current paragraph
        currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
      }
    });
    
    // Add remaining content
    if (currentParagraph) {
      const paragraphParts = currentParagraph.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key="p-final" className="terms-text">
          {paragraphParts.map((part, pIdx) => {
            if (part.match(/^\*\*[^*]+\*\*$/)) {
              return <strong key={pIdx}>{part.replace(/\*\*/g, '')}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    }
    if (currentList.length > 0) {
      elements.push(
        <ul key="ul-final" className="terms-list">
          {currentList.map((item, idx) => {
            const itemParts = item.split(/(\*\*[^*]+\*\*)/g);
            return (
              <li key={idx} className="terms-list-item">
                {itemParts.map((part, pIdx) => {
                  if (part.match(/^\*\*[^*]+\*\*$/)) {
                    return <strong key={pIdx}>{part.replace(/\*\*/g, '')}</strong>;
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </li>
            );
          })}
        </ul>
      );
    }
    
    return elements;
  };

  return (
    <section className="terms-page">
      <div className="terms-hero">
        <div className="container">
          <div className="terms-hero-icon">
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <h1 className="terms-title">
            Terms of <span className="terms-title-accent">Service</span>
          </h1>
          <p className="terms-subtitle">
            Please read these terms and conditions carefully before using Our Service. Last updated: August 05, 2024.
          </p>
        </div>
      </div>
      <div className="terms-container">
      <div className="container">
        <div className="terms-content">
          <aside className="terms-sidebar">
            <nav className="terms-sidebar-nav">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`terms-sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionClick(section.id);
                  }}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <main className="terms-main">
            {sections.map((section, index) => {
              const mainHeading = extractMainHeading(section.content);
              const displayHeading = mainHeading || `${index + 1}. ${section.title}`;
              
              return (
                <div
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className="terms-section"
                >
                  <div className="terms-section-header">
                    <div className="terms-section-icon">
                      <FontAwesomeIcon icon={section.icon} />
                    </div>
                    <h2 className="terms-section-heading">{displayHeading}</h2>
                  </div>
                  <div className="terms-section-body">
                    {formatContent(section.content, !!mainHeading)}
                  </div>
                </div>
              );
            })}
          </main>
        </div>
        </div>
      </div>
    </section>
  );
}
