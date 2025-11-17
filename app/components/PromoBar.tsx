"use client";
import { useEffect, useState } from "react";

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function PromoBar() {
  const [seconds, setSeconds] = useState(20 * 3600 + 26 * 60 + 51);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="promo-bar">
      <div className="container promo-inner">
        <div className="promo-left">
          <span className="promo-icon" aria-hidden>
            🔔
          </span>
          <span className="promo-text">
            Limited Time: Double your YouTube Views on select packages today only!
          </span>
        </div>
        <div className="promo-right">
          <span className="countdown">{formatTime(seconds)}</span>
          <button className="promo-close" aria-label="Close" onClick={() => setVisible(false)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}