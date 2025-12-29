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
  faBookOpen,
  faStar,
  faUser,
  faDollarSign,
  faXmark,
  faCircleNotch,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type PrivacySection = {
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

export default function PrivacyPolicyPage({ data }: { data?: any }) {
  const [sections, setSections] = useState<PrivacySection[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (data && data.sections) {
      const mappedSections = data.sections.map((s: any) => ({
        ...s,
        icon: ICON_MAP[s.icon] || faCheck // Fallback to check icon
      }));
      setSections(mappedSections);
    } else {
      setSections([]);
    }
  }, [data]);


  useEffect(() => {
    if (sections.length > 0) {
        // Set active section if not set or if it doesn't exist in current sections
        if (!activeSection || !sections.find(s => s.id === activeSection)) {
             setActiveSection(sections[0].id);
        }
    }
  }, [sections]);


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
  }, [sections]);

  const extractMainHeading = (content: string): string | null => {
    const lines = content.split("\n").filter((line) => line.trim());
    const firstLine = lines[0]?.trim();
    if (firstLine?.match(/^\*\*\d+\.\s+.*\*\*$/)) {
      return firstLine.replace(/\*\*/g, "");
    }
    return null;
  };

  const formatContent = (content: string, skipFirstHeading: boolean = false) => {
    const lines = content.split("\n").filter((line) => line.trim());
    const result: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let currentList: string[] = [];
    let firstHeadingSkipped = false;
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Check for numbered headings (e.g., **1. Title**)
      if (trimmedLine.match(/^\*\*\d+\.\s+.*\*\*$/)) {
        // Skip the first numbered heading if skipFirstHeading is true
        if (skipFirstHeading && !firstHeadingSkipped) {
          firstHeadingSkipped = true;
          return;
        }
        if (currentParagraph.length > 0) {
          result.push(
            <p key={`para-${lineIndex}`} className="privacy-text">
              {formatInlineText(currentParagraph.join(" "))}
            </p>
          );
          currentParagraph = [];
        }
        if (currentList.length > 0) {
          result.push(
            <ul key={`ul-${lineIndex}`} className="privacy-list">
              {currentList.map((item, idx) => (
                <li key={idx} className="privacy-list-item">
                  {formatInlineText(item)}
                </li>
              ))}
            </ul>
          );
          currentList = [];
        }
        const headerText = trimmedLine.slice(2, -2);
        result.push(
          <h3 key={`header-${lineIndex}`} className="privacy-section-title">
            {headerText}
          </h3>
        );
        return;
      }
      
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
        if (currentList.length > 0) {
          result.push(
            <ul key={`ul-${lineIndex}`} className="privacy-list">
              {currentList.map((item, idx) => (
                <li key={idx} className="privacy-list-item">
                  {formatInlineText(item)}
                </li>
              ))}
            </ul>
          );
          currentList = [];
        }
        const headerText = trimmedLine.slice(2, -2);
        result.push(
          <h4 key={`header-${lineIndex}`} className="privacy-subheading">
            {headerText}
          </h4>
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
        currentList.push(listText);
      } else {
        if (currentList.length > 0) {
          result.push(
            <ul key={`ul-${lineIndex}`} className="privacy-list">
              {currentList.map((item, idx) => (
                <li key={idx} className="privacy-list-item">
                  {formatInlineText(item)}
                </li>
              ))}
            </ul>
          );
          currentList = [];
        }
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
    if (currentList.length > 0) {
      result.push(
        <ul key="ul-final" className="privacy-list">
          {currentList.map((item, idx) => (
            <li key={idx} className="privacy-list-item">
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
    }
    
    return result;
  };

  const formatInlineText = (text: string) => {
    // Split by markdown links first, then by bold text
    const linkPattern = /(\[.*?\]\(.*?\))/g;
    const parts = text.split(linkPattern);
    
    return parts.map((part, index) => {
      // Handle markdown links [text](url)
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <Link key={index} href={linkMatch[2]} className="privacy-link">
            {linkMatch[1]}
          </Link>
        );
      }
      
      // Handle bold text **text**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((boldPart, boldIndex) => {
        if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
          return (
            <strong key={`${index}-${boldIndex}`}>
              {boldPart.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${index}-${boldIndex}`}>{boldPart}</span>;
      });
    });
  };

  return (
    <section className="privacy-page">
      <div className="privacy-hero">
        <div className="container">
          <div className="privacy-hero-icon">
            <FontAwesomeIcon icon={faLock} style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <h1 className="privacy-title">
            Privacy <span className="privacy-title-accent">Policy</span>
          </h1>
          <p className="privacy-subtitle">
            Your privacy is important to us. {(data?.updatedAt || data?.updated_at) ? `Last updated: ${new Date(data?.updatedAt || data?.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
          </p>
        </div>
      </div>

      <div className="privacy-container">
        <div className="container">
          <div className="privacy-content">
          <aside className="privacy-sidebar">
            <nav className="privacy-sidebar-nav">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(section.id);
                    if (element) {
                      const offset = 100;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                      setActiveSection(section.id);
                    }
                  }}
                  className={`privacy-sidebar-link ${activeSection === section.id ? "active" : ""}`}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <main className="privacy-main">
            {sections.map((section, index) => {
               const mainHeading = extractMainHeading(section.content);
               const displayHeading = mainHeading || `${index + 1}. ${section.title}`;
               
               return (
              <div 
                key={section.id} 
                id={section.id} 
                className="privacy-section"
              >
                <div className="privacy-section-header">
                  <div className="privacy-section-icon">
                    <FontAwesomeIcon icon={section.icon} />
                  </div>
                  <h2 className="privacy-section-heading">
                    {displayHeading}
                  </h2>
                </div>
                
                <div className="privacy-section-body">
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
