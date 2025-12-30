"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to start password reset.");
      }
      setSuccess(
        "If an account exists for this email, a reset link has been sent."
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-logo">
              <a href="/" className="brand-logo">
                <span className="logo-text">Likes</span>
                <span className="logo-dot">.io</span>
              </a>
            </div>
            <p className="login-promo-text">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <p className="login-copyright">© 2025 Likes.io. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <a href="/login" className="login-back-link">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Login
            </a>

            <h1 className="login-title">Forgot your password?</h1>
            <p className="login-subtitle">
              Enter your email and we’ll send you a reset link.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-group">
                <label htmlFor="email" className="login-label">
                  Email address
                </label>
                <div className="login-input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="login-input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="login-alert login-alert-error">{error}</div>}
              {success && (
                <div className="login-alert login-alert-success">{success}</div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
