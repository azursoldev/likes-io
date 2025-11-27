type CompareColumn = {
  title: string;
  subtitle: string;
  bullets: string[];
  highlight?: boolean;
  badge?: string;
};

type QualityCompareProps = {
  title?: string;
  columns?: CompareColumn[];
};

const DEFAULT_COLUMNS: CompareColumn[] = [
  {
    title: "High-Quality Likes",
    subtitle: "Great for giving your posts a quick and affordable boost.",
    bullets: [
      "<strong>REAL</strong> likes from <strong>REAL</strong> people",
      "Guaranteed Instant Delivery",
      "Option to split likes on multiple pictures",
      "No password required",
      "Fast Delivery (gradual or instant)",
      "24/7 support",
    ],
  },
  {
    title: "Premium Likes",
    subtitle: "Our best offering for maximum impact and organic growth.",
    bullets: [
      "<strong>REAL</strong> likes from <strong>ACTIVE</strong> users",
      "<strong>Maximum chance to reach the Explore Page</strong>",
      "<strong>Helps attract organic engagement</strong>",
      "Guaranteed Instant Delivery",
      "Option to split likes on multiple pictures",
      "No password required",
      "<strong>Priority 24/7 support</strong>",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

export default function QualityCompare({ title = "Compare Like Quality", columns = DEFAULT_COLUMNS }: QualityCompareProps) {
  return (
    <section className="quality-compare">
      <div className="container">
        <h3 className="qc-section-title">{title}</h3>
        <div className="qc-card">
          <div className="qc-columns">
            {columns.map((col) => (
              <div key={col.title} className={`qc-col ${col.highlight ? "premium" : ""}`}>
                {col.badge && (
                  <span className="qc-recommended" aria-hidden="true">
                    {col.badge}
                  </span>
                )}
                <h4 className="qc-col-title">{col.title}</h4>
                <p className="qc-sub">{col.subtitle}</p>
                <ul className="qc-list">
                  {col.bullets.map((bullet, idx) => (
                    <li key={`${col.title}-${idx}`} dangerouslySetInnerHTML={{ __html: bullet }} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}