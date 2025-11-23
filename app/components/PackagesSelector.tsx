"use client";

import { useMemo, useState } from "react";

type Package = {
  qty: number | string;
  perLike: string;
  price: string;
  strike?: string;
  save?: string;
  offText?: string;
};

export default function PackagesSelector() {
  const tabs = [
    { id: "high", label: "High-Quality Likes" },
    { id: "premium", label: "Premium Likes" },
  ] as const;

  const packagesByTab: Record<(typeof tabs)[number]["id"], Package[]> = {
    high: [
      { qty: 50, perLike: "$0.3599 / like", price: "$2.99", offText: "5% OFF" },
      { qty: 100, perLike: "$0.2899 / like", price: "$8.99", offText: "8% OFF" },
      { qty: 250, perLike: "$0.0899 / like", price: "$22.49", offText: "12% OFF" },
      { qty: 500, perLike: "$0.0360 / like", price: "$17.99", strike: "$27.99", save: "You Save $10.00", offText: "10% OFF" },
      { qty: "1K", perLike: "$0.0200 / like", price: "$19.99", offText: "25% OFF" },
      { qty: "2.5K", perLike: "$0.1020 / like", price: "$64.99", offText: "5% OFF" },
      { qty: "5K", perLike: "$0.1000 / like", price: "$99.00", offText: "10% OFF" },
      { qty: "10,000+", perLike: "$0.0700 / like", price: "$—", offText: "CUSTOM" },
    ],
    premium: [
      { qty: 50, perLike: "$0.4200 / like", price: "$3.49", offText: "5% OFF" },
      { qty: 100, perLike: "$0.3200 / like", price: "$9.99", offText: "8% OFF" },
      { qty: 250, perLike: "$0.1200 / like", price: "$29.99", offText: "12% OFF" },
      { qty: 500, perLike: "$0.0500 / like", price: "$24.99", strike: "$34.99", save: "You Save $10.00", offText: "10% OFF" },
      { qty: "1K", perLike: "$0.0300 / like", price: "$29.99", offText: "25% OFF" },
      { qty: "2.5K", perLike: "$0.1100 / like", price: "$79.99", offText: "5% OFF" },
      { qty: "5K", perLike: "$0.1050 / like", price: "$109.00", offText: "10% OFF" },
      { qty: "10,000+", perLike: "$0.0800 / like", price: "$—", offText: "CUSTOM" },
    ],
  };

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("high");
  const defaultIndex = useMemo(() => {
    // Try to default to the 500 likes package if present
    const list = packagesByTab[activeTab];
    const idx = list.findIndex((p) => p.qty === 500);
    return idx >= 0 ? idx : 0;
  }, [activeTab]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Ensure selected index follows tab change
  const visiblePackages = packagesByTab[activeTab];
  const selected = visiblePackages[selectedIndex] ?? visiblePackages[defaultIndex];

  function handleTabClick(id: (typeof tabs)[number]["id"]) {
    setActiveTab(id);
    // Reset selection to default for tab
    const list = packagesByTab[id];
    const idx = list.findIndex((p) => p.qty === 500);
    setSelectedIndex(idx >= 0 ? idx : 0);
  }

  return (
    <section className="packages">
      <div className="container">
        <div className="packages-card">
          <div className="pkg-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`pkg-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => handleTabClick(t.id)}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pkg-grid">
            {visiblePackages.map((p, i) => (
              <button
                key={`${activeTab}-${p.qty}-${i}`}
                className={`pkg-item ${i === selectedIndex ? "active" : ""} ${typeof p.qty === "string" && p.qty.includes("+") ? "custom" : ""}`}
                onClick={() => setSelectedIndex(i)}
                type="button"
              >
                <div className="pkg-val">{p.qty}</div>
                <div className="pkg-label">Likes</div>
                <div className="pkg-sub">{p.perLike}</div>
                {p.offText && <div className="pkg-off">{p.offText}</div>}
              </button>
            ))}
          </div>

          <div className="pkg-bottom">
            <div className="pkg-price">
              <div className="price-main">{selected?.price ?? "$—"}</div>
              {selected?.strike && <div className="price-strike">{selected.strike}</div>}
              {selected?.save && <div className="price-save">{selected.save}</div>}
            </div>
            <button className="btn buy-btn" type="button">
              Buy {selected?.qty} Likes Now
            </button>
            <div className="pkg-safety">
              <span>✅ 100% Safe Delivery</span>
              <span>🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}