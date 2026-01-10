"use client";

import React, { useState } from "react";
import { useNavigation } from "@/app/hooks/useNavigation";

export default function QuickStartSection() {
  const { getLink, loading: navLoading } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [quickStartContent, setQuickStartContent] = useState({
    title: "Get Started Now",
    description1: "And importantly, Likes.io’s real followers, likes, views, and comments are available at very reasonable prices that are never higher than those charged by other reputable providers.",
    description2: "Honest, trustworthy, responsible, and powerful TikTok and Instagram growth is what we’ve specialized in for more than a dozen years. We invite you to join our family of satisfied customers today!",
    buttons: [
      { id: 1, label: "BUY INSTAGRAM FOLLOWERS", link: "instagram/followers", gradientClass: "grad-orange", icon: "instagram" },
      { id: 2, label: "BUY INSTAGRAM LIKES", link: "instagram/likes", gradientClass: "grad-red", icon: "instagram" },
      { id: 3, label: "BUY INSTAGRAM VIEWS", link: "instagram/views", gradientClass: "grad-pink", icon: "instagram" },
      { id: 4, label: "BUY TIKTOK LIKES", link: "tiktok/likes", gradientClass: "grad-purple", icon: "tiktok" },
      { id: 5, label: "BUY TIKTOK VIEWS", link: "tiktok/views", gradientClass: "grad-violet", icon: "tiktok" },
      { id: 6, label: "BUY TIKTOK FOLLOWERS", link: "tiktok/followers", gradientClass: "grad-magenta", icon: "tiktok" }
    ]
  });

  const getIconPath = (icon: string) => {
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
              title: data.content.quickStartTitle || "Get Started Now",
              description1: data.content.quickStartDescription1 || "And importantly, Likes.io’s real followers, likes, views, and comments are available at very reasonable prices that are never higher than those charged by other reputable providers.",
              description2: data.content.quickStartDescription2 || "Honest, trustworthy, responsible, and powerful TikTok and Instagram growth is what we’ve specialized in for more than a dozen years. We invite you to join our family of satisfied customers today!",
              buttons: data.content.quickStartButtons || [
                { id: 1, label: "BUY INSTAGRAM FOLLOWERS", link: "instagram/followers", gradientClass: "grad-orange", icon: "instagram" },
                { id: 2, label: "BUY INSTAGRAM LIKES", link: "instagram/likes", gradientClass: "grad-red", icon: "instagram" },
                { id: 3, label: "BUY INSTAGRAM VIEWS", link: "instagram/views", gradientClass: "grad-pink", icon: "instagram" },
                { id: 4, label: "BUY TIKTOK LIKES", link: "tiktok/likes", gradientClass: "grad-purple", icon: "tiktok" },
                { id: 5, label: "BUY TIKTOK VIEWS", link: "tiktok/views", gradientClass: "grad-violet", icon: "tiktok" },
                { id: 6, label: "BUY TIKTOK FOLLOWERS", link: "tiktok/followers", gradientClass: "grad-magenta", icon: "tiktok" }
              ]
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
                      <img src={getIconPath(btn.icon)} alt={btn.icon} width={18} height={18} />
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
