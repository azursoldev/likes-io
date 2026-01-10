"use client";
import React, { useState, useEffect } from "react";

type InfluenceSubpoint = {
  title: string;
  text: string;
};

type InfluenceStep = {
  id: number;
  title: string;
  description: string;
  subpoints?: InfluenceSubpoint[];
};

export default function InfluenceSection() {
  const [open, setOpen] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [influenceContent, setInfluenceContent] = useState<{
    title: string;
    subtitle: string;
    image: string;
    steps: InfluenceStep[];
  }>({
    title: "Build Your Empire of Influence",
    subtitle: "A high follower count is your digital passport to credibility. It opens doors to brand deals, organic growth, and authority in your niche.",
    image: "/businesswoman-receiving-best-award.png",
    steps: [
      {
        id: 1,
        title: "Build Instant Credibility & Trust",
        description: "A high follower count is the ultimate social proof. It tells new visitors your account is worth following, making them more likely to click \"Follow\" without hesitation.",
        subpoints: [
          { title: "Attract Organic Growth", text: "People naturally gravitate towards popular accounts. A strong follower base acts like a magnet for organic growth." },
          { title: "Increase Brand Trust", text: "For businesses, a large following establishes credibility and makes your brand appear more reputable to potential customers and partners." },
          { title: "Unlock Platform Features", text: "Reaching follower milestones on Instagram can unlock powerful features for driving traffic and engagement." }
        ]
      },
      {
        id: 2,
        title: "Amplify Your Reach & Influence",
        description: "A well-grown profile signals trust and authority, increasing audience confidence and brand appeal."
      },
      {
        id: 3,
        title: "Kickstart Your Growth",
        description: "Higher social proof improves reach and engagement, unlocking new growth loops over time."
      }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/homepage');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setInfluenceContent({
              title: data.content.influenceTitle || "Build Your Empire of Influence",
              subtitle: data.content.influenceSubtitle || "A high follower count is your digital passport to credibility. It opens doors to brand deals, organic growth, and authority in your niche.",
              image: data.content.influenceImage || "/businesswoman-receiving-best-award.png",
              steps: data.content.influenceSteps || influenceContent.steps
            });
          }
        }
      } catch (error) {
        console.error('Error fetching influence content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="influence">
        <div className="container">
          <div className="influence-grid">
            <div className="influence-left">
              <div className="shimmer-bg" style={{ width: '80%', height: '3rem', marginBottom: '1.5rem', borderRadius: '8px' }}></div>
              <div className="shimmer-bg" style={{ width: '100%', height: '1.5rem', marginBottom: '1rem', borderRadius: '4px' }}></div>
              <div className="shimmer-bg" style={{ width: '90%', height: '1.5rem', marginBottom: '3rem', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="influence">
      <div className="container">
        <div className="influence-grid">
          <div className="influence-left">
            <h2 className="influence-title" dangerouslySetInnerHTML={{ __html: influenceContent.title }} />
            <p className="influence-desc">
              {influenceContent.subtitle}
            </p>

            {influenceContent.steps.map((step, index) => (
              <article key={step.id || index} className={`step-card ${open === (index + 1) ? "open" : ""}`}>
                <header className="step-header" onClick={() => setOpen(open === (index + 1) ? 0 : (index + 1))}>
                  <span className="step-index">{index + 1}.</span>
                  <h3>{step.title}</h3>
                  <span className="step-toggle">{open === (index + 1) ? "▾" : "▸"}</span>
                </header>
                {open === (index + 1) && (
                  <div className="step-body">
                    <p>{step.description}</p>
                    {step.subpoints && step.subpoints.length > 0 && (
                      <div className="subpoints">
                        {step.subpoints.map((sub, subIndex) => (
                          <div key={subIndex} className="subpoint">
                            <span className="bubble">{String(subIndex + 1).padStart(2, '0')}</span>
                            <div>
                              <div className="sub-title">{sub.title}</div>
                              <div className="sub-text">{sub.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="influence-right">
            <div className="illus-wrap">
              <div className="glow-circle"></div>
              <img
                src={influenceContent.image}
                alt="Influence Section Image"
                className="illus-image illus-image-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
