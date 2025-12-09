"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { useState } from "react";

type Currency = {
  id: number;
  name: string;
  code: string;
  symbol: string;
  rate: string;
};

const initialCurrencies: Currency[] = [
  { id: 1, name: "US Dollar", code: "USD", symbol: "$", rate: "1" },
  { id: 2, name: "Euro", code: "EUR", symbol: "€", rate: "0.93" },
];

export default function CurrencyRatesDashboard() {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);

  const handleUpdateCurrency = (id: number, field: keyof Currency, value: string) => {
    setCurrencies((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="currencyRates" />
        <main className="admin-main">
          <AdminToolbar title="Currency Rates" />
          <div className="currency-rates-page">
            <div className="currency-rates-header">
              <h1>Currency Rates</h1>
              <p>Manage currency exchange rates relative to USD.</p>
            </div>

            <div className="currency-rates-card">
              {currencies.map((currency) => (
                <div key={currency.id} className="currency-row">
                  <div className="currency-name-section">
                    <h3 className="currency-name">{currency.name} ({currency.code})</h3>
                  </div>
                  <div className="currency-fields">
                    <label className="currency-label">
                      Symbol
                      <input
                        type="text"
                        className="currency-input currency-dark-input"
                        value={currency.symbol}
                        onChange={(e) => handleUpdateCurrency(currency.id, "symbol", e.target.value)}
                      />
                    </label>
                    <label className="currency-label">
                      Rate (vs USD)
                      <input
                        type="text"
                        className="currency-input currency-dark-input"
                        value={currency.rate}
                        onChange={(e) => handleUpdateCurrency(currency.id, "rate", e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

