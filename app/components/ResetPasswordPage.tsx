"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }
      setSuccess("Password updated! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
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
              Secure your account with a new password.
            </p>
            <p className="login-copyright">© 2025 Likes.io. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <h1 className="login-title">Set a new password</h1>
            <p className="login-subtitle">Enter and confirm your new password.</p>

            {error && <div className="login-alert login-alert-error">{error}</div>}
            {success && (
              <div className="login-alert login-alert-success">{success}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-group">
                <label htmlFor="password" className="login-label">
                  New password
                </label>
                <div className="login-input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="login-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="confirmPassword" className="login-label">
                  Confirm password
                </label>
                <div className="login-input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="login-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
