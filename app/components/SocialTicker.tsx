export default function SocialTicker() {
  const items = [
    "Free Instagram Likes",
    "Free Instagram Followers",
    "Free TikTok Views",
    "Real YouTube Subscribers",
    "Instant Delivery",
    "Safe & Secure",
  ];

  return (
    <div className="ticker">
      <div className="ticker-track animate-ticker-scroll">
        {[...items, ...items].map((text, idx) => (
          <span className="ticker-item animate-ticker-item" key={idx}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}