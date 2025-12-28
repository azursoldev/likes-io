interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
}

interface AdvantageSectionProps {
  title?: string;
  subtitle?: string;
  items?: BenefitItem[];
}

export default function AdvantageSection({ title, subtitle, items }: AdvantageSectionProps) {
  const defaultItems = [
    {
      icon: "/fast-delivery.svg",
      title: "Instant Delivery",
      desc: "Your order begins the moment you check out, with tangible results in minutes.",
    },
    {
      icon: "/premium-quality.svg",
      title: "Premium Quality",
      desc: "Enhance your social proof with engagement from high-quality, real-looking profiles.",
    },
    {
      icon: "/shield.svg",
      title: "100% Safe & Secure",
      desc: "Your account's safety is our priority. We never ask for your password.",
    },
    {
      icon: "/24-hour-service.svg",
      title: "24/7 Customer Support",
      desc: "Our dedicated global support team is always available to help you.",
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;
  const displayTitle = title || "The Likes.io Advantage";
  const displaySubtitle = subtitle || "We combine premium quality with industry-leading features to deliver growth you can trust.";

  return (
    <section className="advantage">
      <div className="container">
        <h2 className="adv-title">{displayTitle}</h2>
        <p className="adv-sub">{displaySubtitle}</p>

        <div className="adv-grid">
          {displayItems.map((it, idx) => (
            <div className="adv-card" key={idx}>
              <div className="adv-icon">
                <img src={it.icon} alt="" />
              </div>
              <div className="adv-card-title">{it.title}</div>
              <div className="adv-card-desc">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
