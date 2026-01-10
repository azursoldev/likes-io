"use client";

import { useEffect, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import "./ExitIntentModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCopy } from "@fortawesome/free-solid-svg-icons";

export default function ExitIntentModal() {
  const settings = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if enabled in settings
    if (!settings.exitIntentEnabled) return;

    // Check if already dismissed/claimed
    const dismissed = localStorage.getItem("exit-intent-dismissed");
    if (dismissed) return;

    // Desktop: Mouse leaves window at the top
    const handleDesktopExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
         triggerModal();
      }
    };
    
    // Mobile: Timer fallback (15 seconds)
    // We check user agent to only apply this logic on mobile if needed, 
    // or just apply it generally as a "time on site" trigger which is also common.
    // The requirement said "On mobile: alternate trigger".
    let mobileTimer: NodeJS.Timeout;
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        mobileTimer = setTimeout(() => {
            if (!hasTriggered) triggerModal();
        }, 15000); // 15 seconds
    } else {
        // Also add mouse leave for desktop
        document.addEventListener("mouseleave", handleDesktopExit);
    }

    return () => {
      document.removeEventListener("mouseleave", handleDesktopExit);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, [settings.exitIntentEnabled, hasTriggered]);

  const triggerModal = () => {
      // Double check localStorage before showing
      if (localStorage.getItem("exit-intent-dismissed")) return;
      
      setIsVisible(true);
      setHasTriggered(true);
  };

  const handleClose = () => {
      setIsVisible(false);
      localStorage.setItem("exit-intent-dismissed", "true");
  };

  const copyCode = () => {
      if (settings.exitIntentDiscountCode) {
        navigator.clipboard.writeText(settings.exitIntentDiscountCode);
        // Could show a toast here, but for now alert or just visual feedback
        const codeElement = document.querySelector('.discount-box');
        if (codeElement) {
            codeElement.classList.add('copied');
            setTimeout(() => codeElement.classList.remove('copied'), 200);
        }
      }
  };

  if (!isVisible) return null;

  return (
    <div className="exit-intent-overlay" onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
    }}>
      <div className="exit-intent-modal">
        <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="modal-content">
            <h2>{settings.exitIntentTitle || "Wait! Don't Go!"}</h2>
            <p>{settings.exitIntentSubtitle || "Get a discount before you leave."}</p>
            {settings.exitIntentDiscountCode && (
                <div className="discount-box" onClick={copyCode} title="Click to copy">
                    <span className="code">{settings.exitIntentDiscountCode}</span>
                    <FontAwesomeIcon icon={faCopy} />
                </div>
            )}
             {settings.exitIntentDiscountCode && <p className="small-text">Click code to copy</p>}
        </div>
      </div>
    </div>
  );
}
