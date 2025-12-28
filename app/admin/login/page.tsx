"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@likes.io");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials or not an admin user.");
      return;
    }

    router.push("/admin");
  };

  return (
    <>
      <Header />
      <main className="admin-login-page">
        <div className="admin-login-wrapper">
          <div className="admin-login-title">
            <span className="admin-login-icon">.io</span>
            <h1>Administrator Login</h1>
            <p>Access the Likes.io management dashboard.</p>
          </div>

          <div className="admin-login-card">

            <form onSubmit={handleSubmit} className="admin-login-form">
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error && <p className="admin-login-error">{error}</p>}

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="admin-login-meta">
                <p className="admin-login-note">Not an admin?</p>
                <a href="/" className="admin-login-back">
                  Back to Likes.io
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


