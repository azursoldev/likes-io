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
  
  // Helper to parse initial quantity from custom package (e.g., "10K+" → 10000, "25K+" → 25000)
  const parseInitialQty = (qtyStr: string): number => {
    const cleaned = qtyStr.replace(/[+,]/g, "").trim();
    if (cleaned.includes("K")) {
      const num = parseFloat(cleaned.replace("K", ""));
      return Math.round(num * 1000);
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? 10000 : Math.round(num);
  };
  
  const getInitialCustomQty = () => {
    const customPkg = visiblePackages.find((p) => typeof p.qty === "string" && p.qty.includes("+"));
    return customPkg && typeof customPkg.qty === "string" ? parseInitialQty(customPkg.qty as string) : 10000;
  };
  
  const [customQty, setCustomQty] = useState(() => getInitialCustomQty());

  useEffect(() => {
    setSelectedIndex(defaultIndex);
    // Update custom quantity if switching to a custom package
    const newSelected = visiblePackages[defaultIndex];
    if (newSelected && typeof newSelected.qty === "string" && newSelected.qty.includes("+")) {
      setCustomQty(parseInitialQty(newSelected.qty as string));
    }
  }, [defaultIndex, visiblePackages]);

  const selected = visiblePackages[selectedIndex] ?? visiblePackages[defaultIndex];
  const isCustomSelected = typeof selected?.qty === "string" && selected.qty.includes("+");
  
  // Calculate price for custom quantity
  const getCustomPrice = () => {
    if (!isCustomSelected || !selected) return { price: "$—", strike: undefined, save: undefined };
    
    // Try to extract price from perLike field
    let pricePerUnit: number | null = null;
    const perLikeMatch = selected.perLike.match(/\$([\d.]+)/);
    if (perLikeMatch) {
      pricePerUnit = parseFloat(perLikeMatch[1]);
    } else {
      // If no price in perLike, use the last non-custom package's pricing
      const nonCustomPackages = visiblePackages.filter(
        (p) => typeof p.qty !== "string" || !p.qty.includes("+")
      );
      if (nonCustomPackages.length > 0) {
        const lastPackage = nonCustomPackages[nonCustomPackages.length - 1];
        const lastPerLikeMatch = lastPackage.perLike.match(/\$([\d.]+)/);
        if (lastPerLikeMatch) {
          pricePerUnit = parseFloat(lastPerLikeMatch[1]);
        }
      }
    }
    
    if (!pricePerUnit) return { price: "$—", strike: undefined, save: undefined };
    
    const totalPrice = (customQty * pricePerUnit).toFixed(2);
    
    // Calculate strike price and savings if original package has them
    let strikePrice: string | undefined;
    let saveAmount: string | undefined;
    
    // Calculate strike price and savings
    // Use the first package (usually smallest/least discounted) as base for strike price
    const basePackage = visiblePackages[0];
    if (basePackage && basePackage.perLike) {
      const basePerLikeMatch = basePackage.perLike.match(/\$([\d.]+)/);
      if (basePerLikeMatch) {
        const basePerUnit = parseFloat(basePerLikeMatch[1]);
        // Calculate strike as 2x the current price (50% discount) or use package strike if available
        const strikePerUnit = selected.strike 
          ? (parseFloat(selected.strike.replace(/[^0-9.]/g, "")) / (typeof selected.qty === "number" ? selected.qty : 10000))
          : pricePerUnit * 2; // Default to 2x (50% off)
        const totalStrike = (customQty * strikePerUnit).toFixed(2);
        strikePrice = `$${totalStrike}`;
        const save = (parseFloat(totalStrike) - parseFloat(totalPrice)).toFixed(2);
        if (parseFloat(save) > 0) {
          saveAmount = `You Save $${save}`;
        }
      }
    }
    
    return { price: `$${totalPrice}`, strike: strikePrice, save: saveAmount };
  };

  const handleCustomIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomQty((prev) => Math.min(prev + 1000, 1000000));
  };

  const handleCustomDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const minQty = selected && typeof selected.qty === "string" && selected.qty.includes("+")
      ? parseInitialQty(selected.qty as string)
      : 10000;
    setCustomQty((prev) => Math.max(prev - 1000, minQty));
  };

  const displayQty = isCustomSelected ? customQty.toLocaleString() + "+" : String(selected?.qty ?? "");
  const customPriceData = isCustomSelected ? getCustomPrice() : null;
  const displayPrice = customPriceData?.price ?? selected?.price ?? "$—";
  const displayStrike = customPriceData?.strike ?? selected?.strike;
  const displaySave = customPriceData?.save ?? selected?.save;
  const formatButtonLabel = (pkg?: PackageOption, qty?: string) => {
    if (!pkg) return `Buy ${metricLabel}`;
    const qtyToUse = qty ?? String(pkg.qty);
    return ctaTemplate.replace("{qty}", qtyToUse).replace("{metric}", metricLabel);
  };
  const buttonLabel = formatButtonLabel(selected, isCustomSelected ? displayQty : undefined);

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
                onClick={() => {
                  setSelectedIndex(i);
                  const pkg = visiblePackages[i];
                  // Set custom quantity based on package base quantity
                  if (pkg && typeof pkg.qty === "string" && pkg.qty.includes("+")) {
                    setCustomQty(parseInitialQty(pkg.qty as string));
                  } else {
                    // Reset to default when switching to non-custom package
                    setCustomQty(10000);
                  }
                }}
                type="button"
              >
                {i === selectedIndex && (
                  <span className="pkg-check" aria-hidden>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
                <div className="pkg-val">
                  {i === selectedIndex && typeof p.qty === "string" && p.qty.includes("+")
                    ? customQty.toLocaleString() + "+"
                    : p.qty}
                </div>
                <div className="pkg-label">{metricLabel}</div>
                <div className="pkg-sub">{p.perLike}</div>
                {p.offText && <div className="pkg-off">{p.offText}</div>}
                {typeof p.qty === "string" && p.qty.includes("+") && (
                  <>
                    <div
                      className="pkg-minus"
                      onClick={handleCustomDecrement}
                      role="button"
                      tabIndex={0}
                      aria-label="Decrease quantity"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCustomDecrement(e as any);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </div>
                    <div
                      className="pkg-plus"
                      onClick={handleCustomIncrement}
                      role="button"
                      tabIndex={0}
                      aria-label="Increase quantity"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCustomIncrement(e as any);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="pkg-bottom">
            <div className="pkg-price">
              <div className="price-main">{displayPrice}</div>
              {displayStrike && <div className="price-strike">{displayStrike}</div>}
              {displaySave && <div className="price-save">{displaySave}</div>}
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