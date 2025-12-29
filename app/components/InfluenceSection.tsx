"use client";
import React, { useState } from "react";

export default function InfluenceSection() {
  const [open, setOpen] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [influenceContent, setInfluenceContent] = useState({
    title: "Build Your Empire of Influence",
    subtitle: "A high follower count is your digital passport to credibility. It opens doors to brand deals, organic growth, and authority in your niche."
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/homepage');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setInfluenceContent({
              title: data.content.influenceTitle || "Build Your Empire of Influence",
              subtitle: data.content.influenceSubtitle || "A high follower count is your digital passport to credibility. It opens doors to brand deals, organic growth, and authority in your niche."
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

            {/* Step 1 */}
            <article className={`step-card ${open === 1 ? "open" : ""}`}>
              <header className="step-header" onClick={() => setOpen(open === 1 ? 0 : 1)}>
                <span className="step-index">1.</span>
                <h3>Build Instant Credibility & Trust</h3>
                <span className="step-toggle">{open === 1 ? "▾" : "▸"}</span>
              </header>
              {open === 1 && (
                <div className="step-body">
                  <p>
                    A high follower count is the ultimate social proof. It tells new
                    visitors your account is worth following, making them more likely
                    to click "Follow" without hesitation.
                  </p>
                  <div className="subpoints">
                    <div className="subpoint">
                      <span className="bubble">01</span>
                      <div>
                        <div className="sub-title">Attract Organic Growth</div>
                        <div className="sub-text">People naturally gravitate towards popular accounts. A strong follower base acts like a magnet for organic growth.</div>
                      </div>
                    </div>
                    <div className="subpoint">
                      <span className="bubble">02</span>
                      <div>
                        <div className="sub-title">Increase Brand Trust</div>
                        <div className="sub-text">For businesses, a large following establishes credibility and makes your brand appear more reputable to potential customers and partners.</div>
                      </div>
                    </div>
                    <div className="subpoint">
                      <span className="bubble">03</span>
                      <div>
                        <div className="sub-title">Unlock Platform Features</div>
                        <div className="sub-text">Reaching follower milestones on Instagram can unlock powerful features for driving traffic and engagement.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Step 2 */}
            <article className={`step-card ${open === 2 ? "open" : ""}`}>
              <header className="step-header" onClick={() => setOpen(open === 2 ? 0 : 2)}>
                <span className="step-index">2.</span>
                <h3>Amplify Your Reach & Influence</h3>
                <span className="step-toggle">{open === 2 ? "▾" : "▸"}</span>
              </header>
              {open === 2 && (
                <div className="step-body">
                  <p>
                    A well-grown profile signals trust and authority, increasing audience
                    confidence and brand appeal.
                  </p>
                </div>
              )}
            </article>

            {/* Step 3 */}
            <article className={`step-card ${open === 3 ? "open" : ""}`}>
              <header className="step-header" onClick={() => setOpen(open === 3 ? 0 : 3)}>
                <span className="step-index">3.</span>
                <h3>Kickstart Your Growth</h3>
                <span className="step-toggle">{open === 3 ? "▾" : "▸"}</span>
              </header>
              {open === 3 && (
                <div className="step-body">
                  <p>
                    Higher social proof improves reach and engagement, unlocking new growth
                    loops over time.
                  </p>
                </div>
              )}
            </article>
          </div>

          <div className="influence-right">
            <div className="illus-wrap">
              <div className="glow-circle"></div>
              <img
                src="/businesswoman-receiving-best-award.png"
                alt="Businesswoman receiving best award"
                className="illus-image illus-image-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
