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

export default function TermsPage({ data }: { data?: any }) {
  const [sections, setSections] = useState<TermSection[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (data && data.sections) {
      const mappedSections = data.sections.map((s: any) => ({
        ...s,
        icon: (s.icon && (s.icon.startsWith('/') || s.icon.startsWith('http'))) 
          ? s.icon 
          : (ICON_MAP[s.icon] || faCheck)
      }));
      setSections(mappedSections);
    } else {
      setSections([]);
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
            Please read these terms and conditions carefully before using Our Service. {(data?.updatedAt || data?.updated_at) ? `Last updated: ${new Date(data?.updatedAt || data?.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
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
                      {(typeof section.icon === 'string' && (section.icon.startsWith('/') || section.icon.startsWith('http'))) ? (
                        <img 
                          src={section.icon} 
                          alt={section.title} 
                          style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                        />
                      ) : (
                        <FontAwesomeIcon icon={section.icon} />
                      )}
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
