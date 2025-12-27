"use client";

import React from "react";
import { useNavigation } from "@/app/hooks/useNavigation";

type PlatformCard = {
  key: string;
  name: string;
  desc: string;
  tags: string[];
  cta: string;
  serviceType: string;
};

const PLATFORMS: PlatformCard[] = [
  {
    key: "instagram",
    name: "Instagram",
    desc:
      "Boost your posts, gain credibility, and reach the Explore Page with our premium Instagram services.",
    tags: ["Likes", "Followers", "Views"],
    cta: "View Instagram Services",
    serviceType: "likes",
  },
  {
    key: "tiktok",
    name: "TikTok",
    desc:
      "Give your videos the viral push they need to land on the FYP and capture millions of views.",
    tags: ["Likes", "Followers", "Views"],
    cta: "View TikTok Services",
    serviceType: "likes",
  },
  {
    key: "youtube",
    name: "YouTube",
    desc:
      "Increase your video rankings, watch time, and channel authority to stand out on the world's largest video platform.",
    tags: ["Views", "Subscribers", "Likes"],
    cta: "View YouTube Services",
    serviceType: "views",
  },
];

export default function PlatformSection() {
  const { getLink } = useNavigation();

  const [platformContent, setPlatformContent] = React.useState({
    title: "Choose Your Platform to Start Growing",
    subtitle: "We offer specialized services for the world's leading social media platforms. Select yours to see our packages.",
    cards: PLATFORMS
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/homepage');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setPlatformContent({
              title: data.content.platformTitle || "Choose Your Platform to Start Growing",
              subtitle: data.content.platformSubtitle || "We offer specialized services for the world's leading social media platforms. Select yours to see our packages.",
              cards: data.content.platformCards || PLATFORMS
            });
          }
        }
      } catch (error) {
        console.error('Error fetching platform content:', error);
      }
    };
    
    fetchContent();
  }, []);

  const Icon = ({ name }: { name: string }) => {
    switch (name) {
      case "instagram":
        return (
          <img src="/instagram.svg" alt="Instagram" width={24} height={24} />
        );
      case "tiktok":
        return (
         <img src="/tiktok-10.svg" alt="TikTok" width={24} height={24} />
        );
      case "youtube":
        return (
          <img src="/youtube-9.svg" alt="YouTube" width={24} height={24} />
        );
      default:
        return null;
    }
  };
  return (
    <section className="platforms">
      <div className="container">
        <h2 className="platforms-title" dangerouslySetInnerHTML={{ __html: platformContent.title }} />
        <p className="platforms-subtitle">
          {platformContent.subtitle}
        </p>

        <div className="platform-grid">
          {platformContent.cards.map((p: any) => (
            <article key={p.key} className="p-card">
              <div className="p-top">
                <div className={`p-icon ${p.key}`}>
                  <Icon name={p.key} />
                </div>
                <div className="p-name">{p.name}</div>
                <div className="rating-pill">
                  <span className="star">★</span>
                  <span>5.0</span>
                  <span className="muted">4,500+</span>
                </div>
              </div>

              <p className="p-desc">{p.desc}</p>

              <div className="p-tags">
                {p.tags.map((t: string) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>

              <div className="p-cta">
                <a 
                  href={getLink(p.key, p.serviceType)}
                  className="btn btn-dark btn-full"
                >
                  {p.cta}
                  <span className="arrow">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
