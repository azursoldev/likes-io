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
    title: "",
    subtitle: "",
    image: "",
    steps: []
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/homepage');
        if (response.ok) {
          const data = await response.json();
          // Use data from API or fall back to defaults
          const content = data.content || {};
          
          setInfluenceContent({
            title: content.influenceTitle || "Build Your Empire of Influence",
            subtitle: content.influenceSubtitle || "Our proven strategy to boost your social media presence.",
            image: content.influenceImage || "/illustrations/influence-girl-star.svg",
            steps: (content.influenceSteps && content.influenceSteps.length > 0) ? content.influenceSteps : [
              {
                id: 1,
                title: "Select Your Package",
                description: "Choose from our variety of high-quality services designed to meet your specific needs."
              },
              {
                id: 2,
                title: "Enter Your Details",
                description: "Provide your username or link. We never ask for your password or sensitive data."
              },
              {
                id: 3,
                title: "Watch Your Growth",
                description: "Sit back and relax while we deliver your order instantly and securely."
              }
            ]
          });
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

  if (!influenceContent.title && influenceContent.steps.length === 0) {
    return null;
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
