export type Service = {
  title: string;
  description: string;
  accent: string;
};

const services: Service[] = [
  {
    title: "Instagram Likes",
    description: "Real, high-quality likes delivered instantly.",
    accent: "#c837ab",
  },
  {
    title: "Instagram Followers",
    description: "Grow with authentic followers and smart pacing.",
    accent: "#ff543e",
  },
  {
    title: "TikTok Views",
    description: "Boost your reach with safe, fast delivery.",
    accent: "#00f2ea",
  },
  {
    title: "YouTube Subscribers",
    description: "Build credibility and accelerate channel growth.",
    accent: "#FF0000",
  },
];

export default function ServicesGrid() {
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
              <button className="btn primary">Buy Now</button>
              <button className="btn">Learn More</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}