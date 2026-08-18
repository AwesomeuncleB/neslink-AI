"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nextUrl = searchParams.get("next") || "/dashboard";

    const handleAuth = async () => {
      try {
        // Clean hash fragment from browser URL immediately so token is never displayed
        if (typeof window !== "undefined" && window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }

        // Check if session is already active or being established by supabase-js
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          router.replace(nextUrl);
          return;
        }

        // Listen for auth event (e.g. SIGNED_IN from token verification)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession || event === "SIGNED_IN" || event === "USER_UPDATED") {
            router.replace(nextUrl);
          }
        });

        // Fallback timer: if after 2.5s no session, check again or redirect
        const timeout = setTimeout(async () => {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            router.replace(nextUrl);
          } else {
            router.replace("/login");
          }
        }, 2500);

        return () => {
          authListener.subscription.unsubscribe();
          clearTimeout(timeout);
        };
      } catch (err: any) {
        setError(err.message || "Failed to verify authentication.");
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--body-bg)",
      color: "var(--body-text)",
      fontFamily: "var(--font-main)",
      padding: "2rem",
      textAlign: "center"
    }}>
      {error ? (
        <div style={{ maxWidth: "420px", background: "var(--card-bg)", padding: "2rem", borderRadius: "6px", border: "1px solid var(--stamp-red)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--stamp-red)", marginBottom: "0.5rem" }}>Verification Notice</h2>
          <p style={{ color: "var(--fog)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="btn-primary-sm"
            style={{ width: "100%", padding: "0.75rem" }}
          >
            Continue to Sign In →
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "420px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "3px solid var(--rule-on-navy)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1.5rem"
          }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Verifying your account…
          </h2>
          <p style={{ color: "var(--fog)", fontSize: "0.9rem" }}>
            Securing your session and redirecting you to your dashboard.
          </p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
