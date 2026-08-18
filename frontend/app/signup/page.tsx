"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
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
      // Use explicit production URL if set; fall back to current origin (only works if running on the real server)
      const siteBase =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const redirectUrl = siteBase ? `${siteBase}/auth/callback?next=/dashboard` : undefined;

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) throw authError;

      if (data.session) {
        router.push("/dashboard");
        return;
      } else {
        setSuccess("Account created! Please check your email inbox to confirm your account — clicking the link will take you directly to your Dashboard.");
      }
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || err.name === "TypeError") {
        setError(
          "Could not connect to Supabase authentication. Please verify that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correctly set in your environment variables."
        );
      } else {
        setError(err.message || "Registration failed. Please check your information.");
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
            <h1>Create Free Account</h1>
            <p>Sign up to review your scholarship essays and track your feedback on your personal dashboard.</p>
          </div>

          <div className="auth-tabs" role="tablist">
            <Link href="/login" className="auth-tab">
              Sign In
            </Link>
            <button className="auth-tab active" type="button">
              Create Account
            </button>
          </div>

          {error && <div className="auth-notice error-notice">{error}</div>}
          {success && <div className="auth-notice success-notice">{success}</div>}

          <form onSubmit={handleSignUp} className="auth-form">
            <div className="auth-field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Free Account"}
            </button>

            <p className="auth-footer-text">
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Sign in here →
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
