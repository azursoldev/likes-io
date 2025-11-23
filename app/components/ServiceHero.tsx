export default function ServiceHero({
  title,
  subtitle,
  rating = "4.9/5",
  reviews = "based on 1,352+ reviews",
}: {
  title: string;
  subtitle: string;
  rating?: string;
  reviews?: string;
}) {
  return (
    <section className="hero-section service-hero">
      <div className="container hero-grid">
        <div className="hero-left">
          <h1 className="font-heading hero-title">{title}</h1>
          <p className="hero-sub" style={{ textAlign: "center" }}>{subtitle}</p>
          <div className="reviews-pill" style={{ justifyContent: "center" }}>
            <span className="star" aria-hidden>
              <img src="/trustpilot.svg" alt="Star" width={20} height={20} />
            </span>
            <span className="star" aria-hidden>
              <img src="/trustpilot.svg" alt="Star" width={20} height={20} />
            </span>
            <span className="star" aria-hidden>
              <img src="/trustpilot.svg" alt="Star" width={20} height={20} />
            </span>
            <span className="star" aria-hidden>
              <img src="/trustpilot.svg" alt="Star" width={20} height={20} />
            </span>
            <span className="star" aria-hidden>
              <img src="/trustpilot.svg" alt="Star" width={20} height={20} />
            </span>
            <span className="score">{rating}</span>
            <span className="sep">•</span>
            <span className="count">{reviews}</span>
          </div>
        </div>
      </div>
    </section>
  );
}