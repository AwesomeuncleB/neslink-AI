"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <Link href={user ? "/dashboard" : "/"} className="brand-title">
            Neslink <span className="ai-mark">AI</span>
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/#scholarships">Scholarships</Link>
          <Link href="/#rubrics">Rubrics</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>

        <div className="nav-actions">
          {!user ? (
            <div className="auth-nav-group">
              <Link href="/login" className="nav-auth-link">Sign In</Link>
              <Link href="/signup" className="btn-auth-link">Sign Up</Link>
            </div>
          ) : (
            <div className="auth-nav-group">
              {pathname !== "/dashboard" && (
                <Link href="/dashboard" className="nav-auth-link" style={{ fontWeight: 600 }}>
                  Dashboard
                </Link>
              )}
              {pathname !== "/app" && (
                <Link href="/app" className="btn-primary-sm">Reviewer Desk →</Link>
              )}
              <span className="user-badge" title={user.email}>👤 {user.email}</span>
              <button onClick={handleSignOut} className="btn-secondary-sm" type="button">
                Sign Out
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
