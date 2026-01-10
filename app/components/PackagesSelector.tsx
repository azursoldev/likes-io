"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faMinus, faLock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useCurrency } from "../contexts/CurrencyContext";

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
  platform?: string;
  serviceType?: string;
  slug?: string;
  customEnabled?: boolean;
  customMinQuantity?: number;
  customMaxQuantity?: number;
  customStep?: number;
  customRoundToStep?: boolean;
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
const DEFAULT_CTA_TEMPLATE = "Get Started";

export default function PackagesSelector({
  tabsConfig,
  metricLabel = DEFAULT_METRIC,
  defaultQtyTarget = 500,
  ctaTemplate = DEFAULT_CTA_TEMPLATE,
  platform: propPlatform,
  serviceType: propServiceType,
  slug,
  customEnabled = false,
  customMinQuantity,
  customMaxQuantity,
  customStep = 1000,
  customRoundToStep = false,
}: PackagesSelectorProps) {
  const pathname = usePathname();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  
  const platform = propPlatform || (pathname?.includes("/tiktok/") ? "tiktok" : pathname?.includes("/youtube/") ? "youtube" : "instagram");
  
  // Use propServiceType if available, otherwise derive from metricLabel or pathname
  const serviceType = propServiceType || (metricLabel.toLowerCase() === "subscribers" ? "subscribers" : metricLabel.toLowerCase());

  const tabs = useMemo(() => {
    // Always use tabsConfig from CMS - don't fall back to hardcoded defaults
    // This ensures all pricing is dynamic and managed through admin dashboard
    if (!tabsConfig || !Array.isArray(tabsConfig) || tabsConfig.length === 0) {
      return []; // Return empty array instead of defaults - will show empty state
    }
    // Return all tabs from CMS, even if some have empty packages arrays
    return tabsConfig;
  }, [tabsConfig]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  // Helper to parse price from string (e.g., "$2.99" -> 2.99)
  const parsePrice = (priceStr: string): number => {
    if (priceStr === "$—" || priceStr === "—") return 0;
    const cleaned = priceStr.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };



  useEffect(() => {
    if (!tabs.length) {
      return;
    }
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // Show empty state if no tabs configured (fully dynamic - no hardcoded defaults)
  if (!tabs || tabs.length === 0) {
    return (
      <section className="packages">
        <div className="container">
          <div className="packages-card">
            <p style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              Pricing packages are being configured. Please check back soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const visiblePackages = (activeTabData?.packages && Array.isArray(activeTabData.packages)) 
    ? activeTabData.packages 
    : [];

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
  
  // Type guard to check if qty is a custom string (contains "+")
  const isCustomQty = (qty: string | number): qty is string => {
    return typeof qty === "string" && qty.includes("+");
  };
  
  const getInitialCustomQty = (): number => {
    if (customEnabled && customMinQuantity) {
      return customMinQuantity;
    }
    for (const pkg of visiblePackages) {
      if (typeof pkg.qty === "string" && pkg.qty.includes("+")) {
        return parseInitialQty(pkg.qty);
      }
    }
    return 10000;
  };
  
  const [customQty, setCustomQty] = useState(() => getInitialCustomQty());

  useEffect(() => {
    setSelectedIndex(defaultIndex);
    // Update custom quantity if switching to a custom package
    const newSelected = visiblePackages[defaultIndex];
    if (newSelected && isCustomQty(newSelected.qty)) {
      if (customEnabled && customMinQuantity) {
        setCustomQty(customMinQuantity);
      } else {
        setCustomQty(parseInitialQty(newSelected.qty));
      }
    }
  }, [defaultIndex, visiblePackages, customEnabled, customMinQuantity]);

  const selected = visiblePackages[selectedIndex] ?? visiblePackages[defaultIndex];
  const isCustomSelected = typeof selected?.qty === "string" && selected.qty.includes("+");
  
  // Calculate price for custom quantity
  const getCustomPrice = () => {
    if (!isCustomSelected || !selected) {
      const symbol = getCurrencySymbol();
      return { price: `${symbol}—`, strike: undefined, save: undefined };
    }
    
    // 1. Get all fixed packages sorted by quantity
    const fixedPackages = visiblePackages
      .filter((p) => !isCustomQty(p.qty))
      .map((p) => {
        const qty = typeof p.qty === "number" ? p.qty : parseInitialQty(p.qty);
        const price = parsePrice(p.price);
        // If strike is not present, default to 2x price (as per existing logic fallback)
        const strike = p.strike ? parsePrice(p.strike) : price * 2;
        return { qty, price, strike };
      })
      .sort((a, b) => a.qty - b.qty);

    if (fixedPackages.length === 0) {
      const symbol = getCurrencySymbol();
      return { price: `${symbol}—`, strike: undefined, save: undefined };
    }

    let calculatedPrice = 0;
    let calculatedStrike = 0;

    // 2. Calculate based on range
    if (customQty <= fixedPackages[0].qty) {
      // Below min: Use rate of min package
      const minPkg = fixedPackages[0];
      const ratio = customQty / minPkg.qty;
      calculatedPrice = minPkg.price * ratio;
      calculatedStrike = minPkg.strike * ratio;
    } else if (customQty >= fixedPackages[fixedPackages.length - 1].qty) {
      // Above max: Use rate of max package (per requirement "based on a per-1k rate from nearest tier")
      const maxPkg = fixedPackages[fixedPackages.length - 1];
      const ratio = customQty / maxPkg.qty;
      calculatedPrice = maxPkg.price * ratio;
      calculatedStrike = maxPkg.strike * ratio;
    } else {
      // In between: Linear interpolation
      let lower = fixedPackages[0];
      let upper = fixedPackages[fixedPackages.length - 1];
      
      for (let i = 0; i < fixedPackages.length - 1; i++) {
        if (fixedPackages[i].qty <= customQty && fixedPackages[i+1].qty >= customQty) {
          lower = fixedPackages[i];
          upper = fixedPackages[i+1];
          break;
        }
      }
      
      const range = upper.qty - lower.qty;
      // Avoid division by zero
      const progress = range === 0 ? 0 : (customQty - lower.qty) / range;
      
      calculatedPrice = lower.price + (upper.price - lower.price) * progress;
      calculatedStrike = lower.strike + (upper.strike - lower.strike) * progress;
    }
    
    // 3. Round to cents (Decimal-safe)
    const totalPriceCents = Math.round(calculatedPrice * 100);
    const totalPrice = totalPriceCents / 100;
    const formattedPrice = formatPrice(totalPrice);

    const totalStrikeCents = Math.round(calculatedStrike * 100);
    const totalStrike = totalStrikeCents / 100;
    const strikePrice = formatPrice(totalStrike);
    
    // 4. Calculate Savings
    const saveCents = totalStrikeCents - totalPriceCents;
    const save = saveCents / 100;
    
    let saveAmount: string | undefined;
    if (save > 0) {
      const symbol = getCurrencySymbol();
      saveAmount = `You Save ${symbol}${save.toFixed(2)}`;
    }
    
    return { price: formattedPrice, strike: strikePrice, save: saveAmount };
  };

  const handleCustomIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = customStep || 1000;
    const max = customMaxQuantity || 1000000;
    setCustomQty((prev) => Math.min(prev + step, max));
  };

  const handleCustomDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = customStep || 1000;
    const min = customMinQuantity || (selected && isCustomQty(selected.qty)
      ? parseInitialQty(selected.qty)
      : 10000);
    setCustomQty((prev) => Math.max(prev - step, min));
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      // Handle empty input temporarily if needed, or just let it stay 0
      // We might need a separate display state if we want to allow empty input
      setCustomQty(0);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setCustomQty(num);
    }
  };

  const handleCustomInputBlur = () => {
    let newVal = customQty;
    // Handle 0 or empty by resetting to min
    if (newVal === 0) {
       newVal = customMinQuantity || (selected && isCustomQty(selected.qty) ? parseInitialQty(selected.qty) : 10000);
    }
    
    const min = customMinQuantity || (selected && isCustomQty(selected.qty) ? parseInitialQty(selected.qty) : 10000);
    const max = customMaxQuantity || 1000000;

    if (newVal < min) newVal = min;
    if (newVal > max) newVal = max;

    if (customRoundToStep && customStep) {
        newVal = Math.round(newVal / customStep) * customStep;
        if (newVal < min) newVal = min;
        if (newVal > max) newVal = max;
    }
    
    setCustomQty(newVal);
  };

  const displayQty = isCustomSelected ? customQty.toLocaleString() + "+" : String(selected?.qty ?? "");
  const customPriceData = isCustomSelected ? getCustomPrice() : null;
  
  // Format prices using currency context
  const formatDisplayPrice = (priceStr: string): string => {
    if (priceStr === "$—" || priceStr === "—") {
      const symbol = getCurrencySymbol();
      return `${symbol}—`;
    }
    const price = parsePrice(priceStr);
    return formatPrice(price);
  };

  const formatDisplayStrike = (strikeStr?: string): string | undefined => {
    if (!strikeStr) return undefined;
    const price = parsePrice(strikeStr);
    return formatPrice(price);
  };

  const formatDisplaySave = (saveStr?: string): string | undefined => {
    if (!saveStr) return undefined;
    // Extract the price from "You Save $X.XX"
    const match = saveStr.match(/\$([\d.]+)/);
    if (match) {
      const price = parseFloat(match[1]);
      const symbol = getCurrencySymbol();
      return saveStr.replace(/\$[\d.]+/, `${symbol}${price.toFixed(2)}`);
    }
    return saveStr;
  };

  const displayPrice = customPriceData?.price ?? (selected?.price ? formatDisplayPrice(selected.price) : `${getCurrencySymbol()}—`);
  const displayStrike = customPriceData?.strike ?? (selected?.strike ? formatDisplayStrike(selected.strike) : undefined);
  const displaySave = customPriceData?.save ?? (selected?.save ? formatDisplaySave(selected.save) : undefined);
  const formatButtonLabel = (pkg?: PackageOption, qty?: string) => {
    if (!pkg) return "Get Started";
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
                  if (pkg && isCustomQty(pkg.qty)) {
                    setCustomQty(parseInitialQty(pkg.qty));
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
                    ? (customEnabled ? (
                        <div onClick={(e) => e.stopPropagation()} style={{ width: '100%' }}>
                          <input
                            type="number"
                            value={customQty === 0 ? "" : customQty}
                            onChange={handleCustomInputChange}
                            onBlur={handleCustomInputBlur}
                            className="custom-qty-input"
                            style={{ 
                                width: '100%', 
                                textAlign: 'center', 
                                fontSize: '18px', 
                                fontWeight: 'bold',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '4px',
                                background: '#fff',
                                color: '#333',
                                marginBottom: '4px'
                            }}
                          />
                          {(customMinQuantity || customMaxQuantity) && (
                            <div style={{ fontSize: '11px', color: '#666', fontWeight: 'normal', lineHeight: 1.2 }}>
                              Min {customMinQuantity?.toLocaleString() ?? "10k"} — Max {customMaxQuantity?.toLocaleString() ?? "1M"}
                            </div>
                          )}
                        </div>
                      ) : (
                        customQty.toLocaleString() + "+"
                      ))
                    : p.qty}
                </div>

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
            <a 
              href={slug ? `/${slug}/checkout?qty=${displayQty}&price=${parsePrice(displayPrice)}&type=${encodeURIComponent(activeTabData?.label || 'High-Quality')}` : `/${platform.toLowerCase()}/${serviceType.toLowerCase()}/checkout?qty=${displayQty}&price=${parsePrice(displayPrice)}&type=${encodeURIComponent(activeTabData?.label || 'High-Quality')}`}
              className="btn buy-btn"
            >
              {buttonLabel}
            </a>
            <div className="pkg-safety">
              <span className="safety-item">
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>Account-Safe Delivery</span>
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