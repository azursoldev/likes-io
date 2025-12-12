"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (1 USD = X EUR)
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92, // Approximate rate
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency") as Currency;
    if (savedCurrency && (savedCurrency === "USD" || savedCurrency === "EUR")) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };

  // Convert price to selected currency
  const convertPrice = (price: number): number => {
    if (currency === "USD") return price;
    return price * EXCHANGE_RATES[currency];
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    const symbol = getCurrencySymbol();
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  // Get currency symbol
  const getCurrencySymbol = (): string => {
    return currency === "EUR" ? "€" : "$";
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

