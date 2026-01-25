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
  customSettings?: {
    enabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    round?: boolean;
  };
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

  // Determine effective custom settings (prefer tab-specific, fallback to global props)
  const activeCustomSettings = activeTabData.customSettings || {};
  const effCustomEnabled = activeCustomSettings.enabled ?? customEnabled;
  const effCustomMin = activeCustomSettings.min ?? customMinQuantity;
  const effCustomMax = activeCustomSettings.max ?? customMaxQuantity;
  const effCustomStep = activeCustomSettings.step ?? customStep;
  const effCustomRound = activeCustomSettings.round ?? customRoundToStep;

  const defaultIndex = useMemo(() => {
    if (!visiblePackages.length) return 0;
    if (typeof defaultQtyTarget === "undefined") return 0;
    const idx = visiblePackages.findIndex((p) => p.qty === defaultQtyTarget);
    return idx >= 0 ? idx : 0;
  }, [visiblePackages, defaultQtyTarget]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Helper to parse initial quantity from custom package (e.g., "10K+" → 10000, "25K+" → 25000)
  const parseInitialQty = (qty: string | number): number => {
    if (typeof qty === "number") return qty;
    const cleaned = qty.replace(/[+,]/g, "").trim();
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

  // Helper to determine if we should show custom UI for a package
  const shouldShowCustomUI = (p: PackageOption, index: number) => {
    if (typeof p.qty === "string" && p.qty.includes("+")) return true;
    // Check if explicitly marked as custom via offText
    if (p.offText && p.offText.toLowerCase() === "custom") return true;
    // Check if it matches custom min quantity
    if (effCustomEnabled && effCustomMin && parseInitialQty(p.qty) === effCustomMin) return true;
    // Check if package quantity is exactly 10000 (common starting point for custom packages)
    if (parseInitialQty(p.qty) === 10000) return true;
    // Fallback: if custom enabled and it's the last package
    if (effCustomEnabled && index === visiblePackages.length - 1) return true;
    return false;
  };
  
  const getInitialCustomQty = (): number => {
    if (effCustomEnabled && effCustomMin) {
      return effCustomMin;
    }
    for (const pkg of visiblePackages) {
      if (typeof pkg.qty === "string" && pkg.qty.includes("+")) {
        return parseInitialQty(pkg.qty);
      }
      // Check if package quantity is exactly 10000
      if (parseInitialQty(pkg.qty) === 10000) {
        return 10000;
      }
    }
    // If no explicit custom package, but custom enabled, use the last package's qty
    if (effCustomEnabled && visiblePackages.length > 0) {
      return parseInitialQty(visiblePackages[visiblePackages.length - 1].qty);
    }
    return 10000;
  };
  
  const [customQty, setCustomQty] = useState(() => getInitialCustomQty());

  useEffect(() => {
    setSelectedIndex(defaultIndex);
    // Update custom quantity if switching to a custom package
    const newSelected = visiblePackages[defaultIndex];
    if (newSelected && shouldShowCustomUI(newSelected, defaultIndex)) {
      if (effCustomEnabled && effCustomMin) {
        setCustomQty(effCustomMin);
      } else {
        setCustomQty(parseInitialQty(newSelected.qty));
      }
    }
  }, [defaultIndex, visiblePackages, effCustomEnabled, effCustomMin]);

  const selected = visiblePackages[selectedIndex] ?? visiblePackages[defaultIndex];
  const isCustomSelected = selected && shouldShowCustomUI(selected, selectedIndex);
  
  // Calculate price for custom quantity
  const getCustomPrice = () => {
    if (!isCustomSelected || !selected) {
      const symbol = getCurrencySymbol();
      return { price: `${symbol}—`, strike: undefined, save: undefined };
    }

    // NEW: Check if the custom package itself has a configured price.
    // If so, use it as the source of truth for the unit rate.
    const configuredPrice = parsePrice(selected.price);
    const configuredBaseQty = parseInitialQty(selected.qty);

    // If we have a valid configured price (e.g., $26.99 for 10,000)
    if (configuredPrice > 0 && configuredBaseQty > 0) {
      // Calculate unit price based on admin configuration
      const unitPrice = configuredPrice / configuredBaseQty;
      
      // Calculate final price based on current quantity
      const calculatedPrice = customQty * unitPrice;
      
      // Calculate strike price
      // If strike is configured, use its unit rate; otherwise use 1.5x of price
      const configuredStrike = selected.strike ? parsePrice(selected.strike) : 0;
      let calculatedStrike = 0;
      
      if (configuredStrike > 0) {
         const strikeUnitPrice = configuredStrike / configuredBaseQty;
         calculatedStrike = customQty * strikeUnitPrice;
      } else {
         // Default markup if no strike price set
         calculatedStrike = calculatedPrice * 1.5; 
      }

      // Round to cents
      const totalPriceCents = Math.round(calculatedPrice * 100);
      const totalPrice = totalPriceCents / 100;
      const formattedPrice = formatPrice(totalPrice);

      const totalStrikeCents = Math.round(calculatedStrike * 100);
      const totalStrike = totalStrikeCents / 100;
      const strikePrice = formatPrice(totalStrike);

      // Calculate Savings
      const saveCents = totalStrikeCents - totalPriceCents;
      const save = saveCents / 100;

      let saveAmount: string | undefined;
      if (save > 0) {
        const symbol = getCurrencySymbol();
        saveAmount = `You Save ${symbol}${save.toFixed(2)}`;
      }

      return { price: formattedPrice, strike: strikePrice, save: saveAmount };
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
    const step = effCustomStep || 1000;
    const max = effCustomMax || 1000000;
    setCustomQty((prev) => Math.min(prev + step, max));
  };

  const handleCustomDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = effCustomStep || 1000;
    const min = effCustomMin || (selected && shouldShowCustomUI(selected, selectedIndex)
      ? parseInitialQty(selected.qty)
      : 10000);
    setCustomQty((prev) => Math.max(prev - step, min));
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
                  shouldShowCustomUI(p, i) ? "custom" : ""
                }`}
                onClick={() => {
                  setSelectedIndex(i);
                  const pkg = visiblePackages[i];
                  // Set custom quantity based on package base quantity
                  if (pkg && shouldShowCustomUI(pkg, i)) {
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
                  {i === selectedIndex && shouldShowCustomUI(p, i)
                    ? (
                        <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', cursor: 'default' }}>
                          <div
                            className="custom-qty-display"
                            style={{ 
                                width: '100%', 
                                textAlign: 'center', 
                                fontSize: '20px', 
                                fontWeight: 'bold',
                                padding: '4px',
                                color: '#333',
                                marginBottom: '4px'
                            }}
                          >
                            {customQty.toLocaleString()}
                          </div>
                          {(effCustomMin || effCustomMax) && (
                            <div style={{ fontSize: '11px', color: '#666', fontWeight: 'normal', lineHeight: 1.2 }}>
                              Min {effCustomMin?.toLocaleString() ?? "10k"} — Max {effCustomMax?.toLocaleString() ?? "1M"}
                            </div>
                          )}
                        </div>
                      )
                    : p.qty}
                </div>

                {p.offText && <div className="pkg-off">{p.offText}</div>}
                {shouldShowCustomUI(p, i) && (
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