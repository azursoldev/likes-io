"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LoginPage({ dbSiteKey }: { dbSiteKey?: string | null }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const siteKey = dbSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    if (!siteKey) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaReady(true);
    script.onerror = () => setRecaptchaReady(false);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [siteKey]);

  const getRecaptchaToken = async (): Promise<string | null> => {
    // Check if we are on localhost
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    try {
      if (!siteKey) {
        return isLocalhost ? "LOCALHOST_BYPASS" : null;
      }
      
      if (!recaptchaReady || !window.grecaptcha) {
        return isLocalhost ? "LOCALHOST_BYPASS" : null;
      }

      await window.grecaptcha.ready();
      const token = await window.grecaptcha.execute(siteKey, { action: "login" });
      return token;
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
      return isLocalhost ? "LOCALHOST_BYPASS" : null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const recaptchaToken = await getRecaptchaToken();
    if (!recaptchaToken) {
      console.warn("reCAPTCHA token generation failed, proceeding.");
    }

    const finalToken = recaptchaToken || "RECAPTCHA_FAILED_CLIENT_SIDE";

    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email.trim(),
      password: formData.password,
      recaptchaToken: finalToken,
    });

    if (res?.error) {
      setError(res.error || "Invalid credentials.");
      setLoading(false);
      return;
    }

    // On success, go to dashboard
    router.push("/dashboard");
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

              <div className="login-captcha-logo">Protected by reCAPTCHA</div>

              {error && <div className="login-alert login-alert-error">{error}</div>}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="login-divider">
                <span>Or continue with</span>
              </div>

              <div className="login-social">
                <button
                  type="button"
                  className="login-social-btn"
                  onClick={() => signIn("google")}
                  aria-label="Sign in with Google"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button
                  type="button"
                  className="login-social-btn"
                  onClick={() => signIn("facebook")}
                  aria-label="Sign in with Facebook"
                >
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
