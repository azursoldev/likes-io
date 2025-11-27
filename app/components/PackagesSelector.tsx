"use client";

import { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faMinus, faLock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export type PackageOption = {
  qty: number | string;
  perLike: string;
  price: string;
  strike?: string;
  save?: string;
  offText?: string;
};

export type PackageTabConfig = {
  id: string;
  label: string;
  packages: PackageOption[];
};

type PackagesSelectorProps = {
  tabsConfig?: PackageTabConfig[];
  metricLabel?: string;
  defaultQtyTarget?: PackageOption["qty"];
  ctaTemplate?: string;
};

const DEFAULT_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Likes",
    packages: [
      { qty: 50, perLike: "$0.3599 / like", price: "$2.99", offText: "5% OFF" },
      { qty: 100, perLike: "$0.2899 / like", price: "$8.99", offText: "8% OFF" },
      { qty: 250, perLike: "$0.0899 / like", price: "$22.49", offText: "12% OFF" },
      { qty: 500, perLike: "$0.0360 / like", price: "$17.99", strike: "$27.99", save: "You Save $10.00", offText: "10% OFF" },
      { qty: "1K", perLike: "$0.0200 / like", price: "$19.99", offText: "25% OFF" },
      { qty: "2.5K", perLike: "$0.1020 / like", price: "$64.99", offText: "5% OFF" },
      { qty: "5K", perLike: "$0.1000 / like", price: "$99.00", offText: "10% OFF" },
      { qty: "10,000+", perLike: "$0.0700 / like", price: "$—", offText: "CUSTOM" },
    ],
  },
  {
    id: "premium",
    label: "Premium Likes",
    packages: [
      { qty: 50, perLike: "$0.4200 / like", price: "$3.49", offText: "5% OFF" },
      { qty: 100, perLike: "$0.3200 / like", price: "$9.99", offText: "8% OFF" },
      { qty: 250, perLike: "$0.1200 / like", price: "$29.99", offText: "12% OFF" },
      { qty: 500, perLike: "$0.0500 / like", price: "$24.99", strike: "$34.99", save: "You Save $10.00", offText: "10% OFF" },
      { qty: "1K", perLike: "$0.0300 / like", price: "$29.99", offText: "25% OFF" },
      { qty: "2.5K", perLike: "$0.1100 / like", price: "$79.99", offText: "5% OFF" },
      { qty: "5K", perLike: "$0.1050 / like", price: "$109.00", offText: "10% OFF" },
      { qty: "10,000+", perLike: "$0.0800 / like", price: "$—", offText: "CUSTOM" },
    ],
  },
];

const DEFAULT_METRIC = "Likes";
const DEFAULT_CTA_TEMPLATE = "Buy {qty} {metric} Now";

export default function PackagesSelector({
  tabsConfig,
  metricLabel = DEFAULT_METRIC,
  defaultQtyTarget = 500,
  ctaTemplate = DEFAULT_CTA_TEMPLATE,
}: PackagesSelectorProps) {
  const tabs = useMemo(() => (tabsConfig && tabsConfig.length ? tabsConfig : DEFAULT_TABS), [tabsConfig]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    if (!tabs.length) {
      return;
    }
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const visiblePackages = activeTabData?.packages ?? [];

  const defaultIndex = useMemo(() => {
    if (!visiblePackages.length) return 0;
    if (typeof defaultQtyTarget === "undefined") return 0;
    const idx = visiblePackages.findIndex((p) => p.qty === defaultQtyTarget);
    return idx >= 0 ? idx : 0;
  }, [visiblePackages, defaultQtyTarget]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(defaultIndex);
  }, [defaultIndex]);

  const selected = visiblePackages[selectedIndex] ?? visiblePackages[defaultIndex];
  const formatButtonLabel = (pkg?: PackageOption) => {
    if (!pkg) return `Buy ${metricLabel}`;
    return ctaTemplate.replace("{qty}", String(pkg.qty)).replace("{metric}", metricLabel);
  };
  const buttonLabel = formatButtonLabel(selected);

  return (
    <section className="packages">
      <div className="container">
        <div className="packages-card">
          <div className="pkg-tabs">
            <div className="pkg-tabs-inner">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`pkg-tab ${activeTab === t.id ? "active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                type="button"
              >
                {t.label}
              </button>
            ))}
            </div>
          </div>

          <div className="pkg-grid">
            {visiblePackages.map((p, i) => (
              <button
                key={`${activeTab}-${p.qty}-${i}`}
                className={`pkg-item ${i === selectedIndex ? "active" : ""} ${
                  typeof p.qty === "string" && p.qty.includes("+") ? "custom" : ""
                }`}
                onClick={() => setSelectedIndex(i)}
                type="button"
              >
                {i === selectedIndex && (
                  <span className="pkg-check" aria-hidden>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
                <div className="pkg-val">{p.qty}</div>
                <div className="pkg-label">{metricLabel}</div>
                <div className="pkg-sub">{p.perLike}</div>
                {p.offText && <div className="pkg-off">{p.offText}</div>}
                {typeof p.qty === "string" && p.qty.includes("+") && (
                  <>
                    <span className="pkg-minus" aria-hidden>
                      <FontAwesomeIcon icon={faMinus} />
                    </span>
                    <span className="pkg-plus" aria-hidden>
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </>
                )}
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
              {buttonLabel}
            </button>
            <div className="pkg-safety">
              <span className="safety-item">
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>100% Safe Delivery</span>
              </span>
              <span className="safety-item">
                <FontAwesomeIcon icon={faLock} />
                <span>Secure Checkout</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}