"use client";

import React, { useState } from "react";
import { useNavigation } from "@/app/hooks/useNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "./IconMap";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function QuickStartSection() {
  const { getLink, loading: navLoading } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [quickStartContent, setQuickStartContent] = useState({
    title: "",
    description1: "",
    description2: "",
    buttons: [] as any[]
  });

  const getIconPath = (icon: string) => {
    if (icon?.startsWith('/') || icon?.startsWith('http')) {
        return icon;
    }
    switch (icon?.toLowerCase()) {
      case 'instagram': return '/instagram-11.png';
      case 'tiktok': return '/tiktok-9.png';
      case 'youtube': return '/youtube-7.png';
      default: return '/instagram-11.png';
    }
  };

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/homepage');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setQuickStartContent({
              title: data.content.quickStartTitle || "",
              description1: data.content.quickStartDescription1 || "",
              description2: data.content.quickStartDescription2 || "",
              buttons: data.content.quickStartButtons || []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching quick start content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  if (loading || navLoading) {
    return (
      <section className="quickstart">
        <div className="container">
          <div className="qs-grid">
            <div className="qs-left">
              <div className="shimmer-bg" style={{ width: '60%', height: '3rem', marginBottom: '1.5rem', borderRadius: '8px' }}></div>
              <div className="shimmer-bg" style={{ width: '100%', height: '1rem', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
              <div className="shimmer-bg" style={{ width: '90%', height: '1rem', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
              <div className="shimmer-bg" style={{ width: '95%', height: '1rem', marginBottom: '1.5rem', borderRadius: '4px' }}></div>
              <div className="shimmer-bg" style={{ width: '100%', height: '1rem', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
              <div className="shimmer-bg" style={{ width: '80%', height: '1rem', borderRadius: '4px' }}></div>
            </div>
            <div className="qs-right">
              <div className="qs-actions">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="shimmer-bg" style={{ width: '100%', height: '60px', borderRadius: '9999px' }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!quickStartContent.title && quickStartContent.buttons.length === 0) {
    return null;
  }

  return (
    <section className="quickstart">
      <div className="container">
        <div className="qs-grid">
          <div className="qs-left">
            <h2 className="qs-title">{quickStartContent.title}</h2>
            <p className="qs-desc">
              {quickStartContent.description1}
            </p>
            <p className="qs-desc">
              {quickStartContent.description2}
            </p>
          </div>

          <div className="qs-right">
            <div className="qs-actions">
              {quickStartContent.buttons.map((btn) => {
                const parts = btn.link.split('/');
                const href = parts.length === 2 
                  ? getLink(parts[0], parts[1]) 
                  : btn.link;
                  
                return (
                  <a key={btn.id} href={href} className={`qs-btn ${btn.gradientClass}`}>
                    <span className="qs-icon">
                       {(btn.icon?.startsWith('/') || btn.icon?.startsWith('http') || ['instagram', 'tiktok', 'youtube'].includes(btn.icon?.toLowerCase())) ? (
                          <img src={getIconPath(btn.icon)} alt={btn.icon} width={18} height={18} />
                       ) : (
                          <FontAwesomeIcon icon={iconMap[btn.icon] || faImage} style={{ width: '18px', height: '18px' }} />
                       )}
                    </span>
                    <span className="qs-label">{btn.label}</span>
                    <span className="arrow" aria-hidden="true"></span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
