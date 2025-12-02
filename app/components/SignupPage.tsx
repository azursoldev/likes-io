"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock
} from "@fortawesome/free-solid-svg-icons";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <section className="signup-page">
      <div className="signup-container">
        {/* Logo Section */}
        <div className="signup-logo-section">
          <a href="/" className="brand-logo">
            <span className="logo-text">Likes</span>
            <span className="logo-dot">.io</span>
          </a>
        </div>

        {/* Title Section */}
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">
          Already have an account? <a href="/login" className="signup-signin-link">Sign in</a>
        </p>

        <div className="signup-form-card">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-input-group">
              <label htmlFor="email" className="signup-label">Email address</label>
              <div className="signup-input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="signup-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="signup-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-input-group">
              <label htmlFor="password" className="signup-label">Password</label>
              <div className="signup-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="signup-input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="signup-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-input-group">
              <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
              <div className="signup-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="signup-input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="signup-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-terms">
              <label className="signup-checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="signup-checkbox"
                  required
                />
                <span>
                  I agree to the <a href="/terms" className="signup-terms-link">Terms of Service</a>
                </span>
              </label>
            </div>

            <button type="submit" className="signup-submit-btn">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

