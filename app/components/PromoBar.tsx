"use client";
import { useEffect, useState } from "react";

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

interface BannerMessage {
  id: string;
  text: string;
  icon: string;
  isActive: boolean;
}

interface PromoBarProps {
  previewMode?: boolean;
  enabled?: boolean;
  durationHours?: number;
  messages?: { text: string; icon: string }[];
}

export default function PromoBar({ previewMode, enabled, durationHours, messages: previewMessages }: PromoBarProps = {}) {
  const [seconds, setSeconds] = useState(0);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<{ text: string; icon: string }[]>([]);
  const [msgIndex, setMsgIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize data (either from props or API)
  useEffect(() => {
    async function init() {
      if (previewMode) {
        // Preview mode: use props directly
        if (!enabled) {
          setVisible(false);
          setLoading(false);
          return;
        }
        
        const activeMessages = previewMessages || [];
        if (activeMessages.length === 0) {
          setVisible(false);
          setLoading(false);
          return;
        }

        setMessages(activeMessages);
        setVisible(true);
        setLoading(false);

        // For preview, just start countdown from full duration
        const durationSeconds = (durationHours || 24) * 3600;
        setSeconds(durationSeconds);
        return;
      }

      // Normal mode: fetch from API
      try {
        // Check if user previously closed it
        const isClosed = localStorage.getItem("promoClosed");
        if (isClosed) {
          setLoading(false);
          return;
        }

        const [settingsRes, messagesRes] = await Promise.all([
          fetch("/api/admin/settings/notifications"),
          fetch("/api/admin/banner-messages"),
        ]);

        if (settingsRes.ok && messagesRes.ok) {
          const settings = await settingsRes.json();
          const allMessages: BannerMessage[] = await messagesRes.json();
          
          if (!settings.bannerEnabled) {
            setLoading(false);
            return;
          }

          const activeMessages = allMessages
            .filter((m) => m.isActive)
            .map((m) => ({ text: m.text, icon: m.icon || "🔥" }));

          if (activeMessages.length === 0) {
            setLoading(false);
            return;
          }

          setMessages(activeMessages);
          setVisible(true);
          
          // Setup countdown
          const durationSeconds = (settings.bannerDurationHours || 24) * 3600;
          
          // Check for existing expiry
          const storedExpiry = localStorage.getItem("promoExpiry");
          const now = Date.now();
          
          let expiryTime = 0;
          
          if (storedExpiry) {
            expiryTime = parseInt(storedExpiry, 10);
            if (expiryTime < now) {
              // Expired, reset
              expiryTime = now + durationSeconds * 1000;
              localStorage.setItem("promoExpiry", String(expiryTime));
            }
          } else {
            expiryTime = now + durationSeconds * 1000;
            localStorage.setItem("promoExpiry", String(expiryTime));
          }

          const remaining = Math.max(0, (expiryTime - now) / 1000);
          setSeconds(remaining);
        }
      } catch (error) {
        console.error("Failed to load promo bar data", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [previewMode, enabled, durationHours, previewMessages]);

  // Countdown timer
  useEffect(() => {
    if (!visible) return;
    
    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [visible]);

  // Rotate message every 3 seconds
  useEffect(() => {
    if (!visible || messages.length <= 1) return;

    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [visible, messages.length]);

  const handleClose = () => {
    setVisible(false);
    if (!previewMode) {
      localStorage.setItem("promoClosed", "true");
    }
  };

  if (loading) return null;
  if (!visible) return null;
  if (messages.length === 0) return null;

  return (
    <div className="promo-bar">
      <div className="container promo-inner">
        {/* Centered area: icon, rotating message, and countdown */}
        <div className="promo-left" aria-live="polite">
          <span className="promo-icon" aria-hidden>
            {messages[msgIndex].icon}
          </span>
          <span key={msgIndex} className="promo-message fadeup">
            {messages[msgIndex].text}
          </span>
          <span className="countdown" aria-label="Offer ends in">
            {formatTime(seconds)}
          </span>
        </div>
        {/* Right area: close button */}
        <div className="promo-right">
          <button className="promo-close" aria-label="Close" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
