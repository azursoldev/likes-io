"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    captcha: false,
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
              Sign in to access your dashboard, manage your orders, and continue boosting your social media presence.
            </p>
            <p className="login-copyright">© 2025 Likes.io. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <a href="/" className="login-back-link">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Home
            </a>

            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-subtitle">
              Or <a href="/signup" className="login-create-link">create a new account</a>
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-group">
                <label htmlFor="email" className="login-label">Email address</label>
                <div className="login-input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="login-input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="password" className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="login-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-options">
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="login-checkbox"
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="login-forgot-link">Forgot your password?</a>
              </div>

              <div className="login-captcha">
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    name="captcha"
                    checked={formData.captcha}
                    onChange={handleChange}
                    className="login-checkbox"
                  />
                  <span>I'm not a robot</span>
                </label>
                <div className="login-captcha-logo">reCAPTCHA</div>
              </div>

              <button type="submit" className="login-submit-btn">
                Sign in
              </button>

              <div className="login-divider">
                <span>Or continue with</span>
              </div>

              <div className="login-social">
                <button type="button" className="login-social-btn">
                  <FontAwesomeIcon icon={faGoogle} />
                  
                </button>
                <button type="button" className="login-social-btn">
                  <FontAwesomeIcon icon={faFacebook} />
                 
                </button>
                <button type="button" className="login-social-btn">
                  <span className="login-social-icon">J</span>
                 
                </button>
              </div>

              <a href="/admin/login" className="login-admin-link">Are you an administrator?</a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

