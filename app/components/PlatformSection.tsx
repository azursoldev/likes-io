import React from "react";

type PlatformCard = {
  key: string;
  name: string;
  desc: string;
  tags: string[];
  cta: string;
};

const PLATFORMS: PlatformCard[] = [
  {
    key: "instagram",
    name: "Instagram",
    desc:
      "Boost your posts, gain credibility, and reach the Explore Page with our premium Instagram services.",
    tags: ["Likes", "Followers", "Views"],
    cta: "View Instagram Services",
  },
  {
    key: "tiktok",
    name: "TikTok",
    desc:
      "Give your videos the viral push they need to land on the FYP and capture millions of views.",
    tags: ["Likes", "Followers", "Views"],
    cta: "View TikTok Services",
  },
  {
    key: "youtube",
    name: "YouTube",
    desc:
      "Increase your video rankings, watch time, and channel authority to stand out on the world's largest video platform.",
    tags: ["Views", "Subscribers", "Likes"],
    cta: "View YouTube Services",
  },
];

export default function PlatformSection() {
  const Icon = ({ name }: { name: string }) => {
    switch (name) {
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm6.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M14 3v4.6c1.3 1 2.9 1.6 4.6 1.6V13c-1.9-.1-3.6-.8-4.6-1.9V14a5 5 0 11-5-5c.3 0 .7 0 1 .1V6.5c-2.7-.3-5 1.7-5.4 4.3A6 6 0 1014 14V3z"/>
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M10 8l6 4-6 4V8z"/>
          </svg>
        );
      default:
        return null;
    }
  };
  return (
    <section className="platforms">
      <div className="container">
        <h2 className="platforms-title">Choose Your Platform to Start <br /> Growing</h2>
        <p className="platforms-subtitle">
          We offer specialized services for the world's leading social media platforms.
          Select yours to see our packages.
        </p>

        <div className="platform-grid">
          {PLATFORMS.map((p) => (
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
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>

              <div className="p-cta">
                <button className="btn btn-dark btn-full">
                  {p.cta}
                  <span className="arrow">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}