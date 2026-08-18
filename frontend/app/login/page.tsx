"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Environment Variables and redeploy."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        router.push("/dashboard");
        return;
      }
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || err.name === "TypeError") {
        setError(
          "Could not connect to Supabase authentication. Please verify that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correctly set in your environment variables."
        );
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <Link href="/" className="brand-title">
              Neslink <span className="ai-mark">AI</span>
            </Link>
          </div>
          <div className="nav-actions">
            <Link href="/" className="nav-back-link">
              ← Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your scholarship reviewer desk and saved feedback history.</p>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button className="auth-tab active" type="button">
              Sign In
            </button>
            <Link href="/signup" className="auth-tab">
              Create Account
            </Link>
          </div>

          {error && <div className="auth-notice error-notice">{error}</div>}
          {success && <div className="auth-notice success-notice">{success}</div>}

          <form onSubmit={handleSignIn} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="auth-footer-text">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="auth-link">
                Create one here →
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
