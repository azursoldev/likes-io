export default function AdvantageSection() {
  const items = [
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

  return (
    <section className="advantage">
      <div className="container">
        <h2 className="adv-title">The Likes.io Advantage</h2>
        <p className="adv-sub">We combine premium quality with industry-leading features to deliver growth you can trust.</p>

        <div className="adv-grid">
          {items.map((it) => (
            <div className="adv-card" key={it.title}>
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
