"use client";

import { useNavigation } from "@/app/hooks/useNavigation";

export type Service = {
  title: string;
  description: string;
  accent: string;
  platform: string;
  serviceType: string;
};

const services: Service[] = [
  {
    title: "Instagram Likes",
    description: "Real, high-quality likes delivered instantly.",
    accent: "#c837ab",
    platform: "instagram",
    serviceType: "likes",
  },
  {
    title: "Instagram Followers",
    description: "Grow with authentic followers and smart pacing.",
    accent: "#ff543e",
    platform: "instagram",
    serviceType: "followers",
  },
  {
    title: "TikTok Views",
    description: "Boost your reach with safe, fast delivery.",
    accent: "#00f2ea",
    platform: "tiktok",
    serviceType: "views",
  },
  {
    title: "YouTube Subscribers",
    description: "Build credibility and accelerate channel growth.",
    accent: "#FF0000",
    platform: "youtube",
    serviceType: "subscribers",
  },
];

export default function ServicesGrid() {
  const { getLink, loading } = useNavigation();

  return (
    <section id="services" className="services">
      <h2>Popular Services</h2>
      <div className="grid">
        {services.map((s) => (
          <article key={s.title} className="card">
            <div className="card-accent" style={{ background: s.accent }} />
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <div className="card-actions">
              <a href={loading ? "#" : getLink(s.platform, s.serviceType)} className="btn primary">Get Started</a>
              <a href={loading ? "#" : getLink(s.platform, s.serviceType)} className="btn">Learn More</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
