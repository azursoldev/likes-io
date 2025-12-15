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
  // Countdown seconds (kept from existing behavior)
  const [seconds, setSeconds] = useState(20 * 3600 + 26 * 60 + 51);
  const [visible, setVisible] = useState(true);
  // Rotating promo messages
  const messages = [
    "Limited Time: Double your YouTube Views on select packages today only!",
    "Boost Instagram reach with premium likes and followers.",
    "Grow TikTok faster with high-quality likes and views.",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Rotate message every 2 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(id);
  }, [messages.length]);

  if (!visible) return null;

  return (
    <div className="promo-bar">
      <div className="container promo-inner">
        {/* Centered area: icon, rotating message, and countdown */}
        <div className="promo-left" aria-live="polite">
          <span className="promo-icon" aria-hidden>
            🔔
          </span>
          <span key={msgIndex} className="promo-message fadeup">
            {messages[msgIndex]}
          </span>
          <span className="countdown" aria-label="Offer ends in">
            {formatTime(seconds)}
          </span>
        </div>
        {/* Right area: close button */}
        <div className="promo-right">
          <button className="promo-close" aria-label="Close" onClick={() => setVisible(false)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
