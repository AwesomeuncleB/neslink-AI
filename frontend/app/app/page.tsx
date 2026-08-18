"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/useAuth";
import { SCHOLARSHIPS } from "@/lib/rubrics";
import { Question, Scholarship, JudgeResult, HistoryRow } from "@/lib/types";

export default function ReviewerDeskPage() {
  const { user, signOut } = useAuth();

  const scholarshipsList = Object.values(SCHOLARSHIPS);
  const [view, setView] = useState<"reviewer" | "dashboard" | "settings" | "profile">("dashboard");
  const [selectedScholarshipKey, setSelectedScholarshipKey] = useState("chevening");
  const [selectedQuestionKey, setSelectedQuestionKey] = useState("leadership");
  const [essayText, setEssayText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dashboard state
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgScore: 0,
    topScholarship: "",
    lastReviewDate: "",
  });

  const selectedScholarship: Scholarship =
    SCHOLARSHIPS[selectedScholarshipKey] || SCHOLARSHIPS.chevening;
  const isActive = selectedScholarship.status === "active";

  const availableQuestions: Question[] = isActive && selectedScholarship.questions
    ? Object.values(selectedScholarship.questions)
    : [];

  const currentQuestion = availableQuestions.find((q) => q.key === selectedQuestionKey)
    || availableQuestions[0];

  const words = essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean).length : 0;
  const wordLimit = currentQuestion?.word_limit || 500;
  const isOverLimit = words > wordLimit;

  const handleSubmit = async () => {
    if (!essayText.trim()) {
      setError("Paste an essay first.");
      return;
    }
    if (!isActive) {
      setError("Select Chevening to get feedback — other scholarships are currently in calibration.");
      return;
    }

    const activeUserId = user?.id ?? null;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarship_key: selectedScholarshipKey,
          question_key: selectedQuestionKey,
          essay_text: essayText,
          user_id: activeUserId ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Could not reach the evaluation server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Load dashboard history data
  useEffect(() => {
    if (user && view === "dashboard") {
      loadHistory();
    }
  }, [user, view]);

  const loadHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/history?user_id=${user.id}`);
      const data = await res.json();
      if (res.ok) {
        const evaluations: HistoryRow[] = Array.isArray(data) ? data : (data.evaluations || []);
        setHistory(evaluations);
        // Calculate stats
        const total = evaluations.length;
        const avgScore = total > 0
          ? Math.round(evaluations.reduce((sum: number, h: HistoryRow) => sum + (h.overall_score || 0), 0) / total)
          : 0;
        const scholarshipCounts: Record<string, number> = {};
        evaluations.forEach((h: HistoryRow) => {
          const key = h.scholarship_key || "chevening";
          scholarshipCounts[key] = (scholarshipCounts[key] || 0) + 1;
        });
        const topScholarship = Object.entries(scholarshipCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
        const lastReview = total > 0 ? evaluations[0]?.created_at || "" : "";
        setStats({
          totalReviews: total,
          avgScore,
          topScholarship: SCHOLARSHIPS[topScholarship]?.name || "Chevening",
          lastReviewDate: lastReview ? new Date(lastReview).toLocaleDateString() : "",
        });
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <>
      {/* LETTERHEAD */}
      <header className="letterhead">
        <div className="letterhead-inner">
          <div className="letterhead-top">
            <div className="letterhead-nav-left">
              <Link href="/" className="nav-back-link">
                ← Home
              </Link>
              <div className="view-toggle" style={{ marginLeft: "1rem", display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setView("dashboard")}
                  className={view === "dashboard" ? "btn-primary-sm" : "btn-secondary-sm"}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setView("reviewer")}
                  className={view === "reviewer" ? "btn-primary-sm" : "btn-secondary-sm"}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  Reviewer Desk
                </button>
                <button
                  type="button"
                  onClick={() => setView("profile")}
                  className={view === "profile" ? "btn-primary-sm" : "btn-secondary-sm"}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className={view === "settings" ? "btn-primary-sm" : "btn-secondary-sm"}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  Settings
                </button>
              </div>
            </div>
            <div className="letterhead-nav-right">
              {user ? (
                <div className="auth-nav-group">
                  <span className="user-badge" title={user.email}>
                    👤 {user.email}
                  </span>
                  <button onClick={signOut} className="btn-secondary-sm" type="button">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="auth-nav-group">
                  <Link href="/login" className="nav-auth-link">
                    Sign In
                  </Link>
                  <Link href="/signup" className="btn-auth-link">
                    Sign Up
                  </Link>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
          <h1>
            Neslink <span className="ai-mark">AI</span>
          </h1>
        </div>
      </header>

      {/* DESK WORKSPACE */}
      <main className="desk">
        {view === "reviewer" ? (
          <>
            {/* ── LEFT SHEET: APPLICANT COPY ─────────────────────────────────── */}
            <section className="sheet form-sheet">
              <div className="sheet-label">Applicant copy</div>

              {/* 1. Scholarship */}
              <label className="field-label" htmlFor="scholarship-select">
                1. Select Scholarship Program
              </label>
              <select
                id="scholarship-select"
                value={selectedScholarshipKey}
                onChange={(e) => {
                  const key = e.target.value;
                  setSelectedScholarshipKey(key);
                  setResult(null);
                  setError(null);
                  const qs = SCHOLARSHIPS[key]?.questions;
                  if (qs) setSelectedQuestionKey(Object.keys(qs)[0]);
                }}
              >
                {scholarshipsList.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name} {s.status === "coming_soon" ? "(Coming Soon)" : "✓ Active"}
                  </option>
                ))}
              </select>

              {/* 2. Questions — only for active scholarships */}
              {isActive ? (
                <>
                  <label className="field-label" htmlFor="question-select">
                    2. Which essay question are you answering?
                  </label>
                  <select
                    id="question-select"
                    value={selectedQuestionKey}
                    onChange={(e) => {
                      setSelectedQuestionKey(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                  >
                    {availableQuestions.map((q) => (
                      <option key={q.key} value={q.key}>
                        {q.label}
                      </option>
                    ))}
                  </select>

                  {currentQuestion && (
                    <div className="prompt-echo" id="prompt-echo">
                      {currentQuestion.prompt}
                    </div>
                  )}

                  <label className="field-label" htmlFor="essay-text">
                    Your essay
                  </label>
                  <textarea
                    id="essay-text"
                    placeholder="Paste your draft here…"
                    spellCheck={false}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                  />

                  <div className="meta-row">
                    <span id="word-count" className={isOverLimit ? "over-limit" : ""}>
                      {words} words
                    </span>
                    <span id="word-limit-note">limit: {wordLimit} words</span>
                  </div>

                  <button
                    id="submit-btn"
                    onClick={handleSubmit}
                    disabled={submitting || !essayText.trim()}
                  >
                    {submitting ? "Reading…" : "Submit for reading"}
                  </button>

                  <p className="disclaimer">
                    This reviews your own writing only — it never drafts or rewrites sentences for you, in line with scholarship rules on AI-generated content.
                  </p>
                </>
              ) : (
                /* Coming-soon panel */
                <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(211,168,86,0.08)", border: "1px solid var(--gold)", borderRadius: "4px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "var(--gold-bright)", margin: "0 0 0.5rem" }}>
                    {selectedScholarship.name} — Coming Soon
                  </h3>
                  <p style={{ fontSize: "0.92rem", color: "var(--ink-soft)", lineHeight: 1.5, margin: "0 0 1rem" }}>
                    {selectedScholarship.description} The reading committee rubric for this scholarship is currently being calibrated.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={() => setSelectedScholarshipKey("chevening")}
                  >
                    Switch to Chevening Scholarship →
                  </button>
                </div>
              )}
            </section>

            {/* ── RIGHT SHEET: READING PANEL COPY ───────────────────────────── */}
            <section className="sheet verdict-sheet" id="verdict-sheet">
              <div className="sheet-label">Reading panel copy</div>

              {error && <div className="error-box">{error}</div>}

              {submitting && (
                <p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
                  Reading your essay against the rubric…
                </p>
              )}

              {!submitting && !result && !error && (
                <div className="verdict-empty" id="margin-empty">
                  <p>
                    Your assessment sheet will appear here — a score, a criteria grid, and what to fix first.
                  </p>
                </div>
              )}

              {!submitting && result && (
                <div className="verdict-results" id="margin-results">
                  {/* Score Stamp */}
                  <div className="stamp-wrap">
                    <div className="stamp">
                      <span className="stamp-score">{result.overall_score}</span>
                      <span className="stamp-of">OUT OF 10</span>
                    </div>
                    <div className="stamp-meta">
                      <div className="panel-line">Reading panel verdict</div>
                      <div className={`wc-line${result.within_word_limit ? "" : " over-limit"}`}>
                        {result.word_count} / {result.word_limit} words —{" "}
                        {result.within_word_limit ? "within limit" : "OVER LIMIT"}
                      </div>
                    </div>
                  </div>

                  {/* Assessment Grid */}
                  <div className="section-heading">Assessment grid</div>
                  <table className="grid-table">
                    <tbody>
                      {result.criteria?.map((c, i) => (
                        <tr key={i}>
                          <td className="crit-name">{c.name}</td>
                          <td className="crit-score">{c.score}/5</td>
                          <td className="crit-note">{c.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Fix First */}
                  {result.top_suggestions?.length > 0 && (
                    <>
                      <div className="section-heading">Fix first</div>
                      <ul className="suggestions">
                        {result.top_suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Margin Notes */}
                  {result.line_notes?.length > 0 && (
                    <>
                      <div className="section-heading">Margin notes</div>
                      {result.line_notes.map((n, i) => (
                        <div key={i} className="line-note">
                          <span className="quote">&ldquo;{n.quote}&rdquo;</span>
                          <span className="note">{n.note}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </section>
          </>
        ) : view === "profile" ? (
          /* PROFILE VIEW */
          <>
            <section className="sheet" style={{ gridColumn: "1 / -1" }}>
              <div className="sheet-label">Profile</div>
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="field-label">Email</label>
                  <div style={{ padding: "0.75rem", background: "var(--navy-raised)", border: "1px solid var(--rule-on-navy)", borderRadius: "4px", marginTop: "0.5rem" }}>
                    {user?.email}
                  </div>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || ""}
                    placeholder="Enter your full name"
                    style={{ width: "100%", padding: "0.75rem", background: "var(--navy-raised)", border: "1px solid var(--rule-on-navy)", borderRadius: "4px", marginTop: "0.5rem", color: "var(--body-text)", fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="field-label">Account Created</label>
                  <div style={{ padding: "0.75rem", background: "var(--navy-raised)", border: "1px solid var(--rule-on-navy)", borderRadius: "4px", marginTop: "0.5rem", color: "var(--fog)" }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                  </div>
                </div>
                <button type="button" className="btn-primary-sm" style={{ marginTop: "1rem" }}>
                  Save Changes
                </button>
              </div>
            </section>
          </>
        ) : view === "settings" ? (
          /* SETTINGS VIEW */
          <>
            <section className="sheet" style={{ gridColumn: "1 / -1" }}>
              <div className="sheet-label">Settings</div>
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label className="field-label">Theme Preference</label>
                  <div style={{ padding: "0.75rem", background: "var(--navy-raised)", border: "1px solid var(--rule-on-navy)", borderRadius: "4px", marginTop: "0.5rem" }}>
                    Your theme is controlled by the toggle in the top right corner.
                  </div>
                </div>
                <div>
                  <label className="field-label">Email Notifications</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <input type="checkbox" id="email-notif" defaultChecked style={{ width: "1.25rem", height: "1.25rem" }} />
                    <label htmlFor="email-notif" style={{ color: "var(--body-text)" }}>Receive email updates about new scholarship rubrics</label>
                  </div>
                </div>
                <div>
                  <label className="field-label">Data & Privacy</label>
                  <div style={{ padding: "1rem", background: "rgba(211,168,86,0.08)", border: "1px solid var(--gold)", borderRadius: "4px", marginTop: "0.5rem" }}>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem" }}>Your essay drafts are processed privately and never shared or used for training.</p>
                    <button type="button" className="btn-secondary-sm" style={{ fontSize: "0.85rem" }}>
                      Request Data Export
                    </button>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--rule-on-navy)", paddingTop: "1.5rem" }}>
                  <label className="field-label" style={{ color: "#fb7185" }}>Danger Zone</label>
                  <button type="button" className="btn-secondary-sm" style={{ marginTop: "0.5rem", borderColor: "#fb7185", color: "#fb7185" }}>
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* DASHBOARD VIEW */
          <>
            {/* Stats Overview */}
            <section className="sheet" style={{ gridColumn: "1 / -1", marginBottom: "1.5rem" }}>
              <div className="sheet-label">Your Overview</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ background: "var(--navy-raised)", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{stats.totalReviews}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--fog)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>Total Reviews</div>
                </div>
                <div style={{ background: "var(--navy-raised)", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{stats.avgScore}/10</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--fog)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>Avg Score</div>
                </div>
                <div style={{ background: "var(--navy-raised)", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 600, fontFamily: "var(--font-display)" }}>{stats.topScholarship}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--fog)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>Top Scholarship</div>
                </div>
                <div style={{ background: "var(--navy-raised)", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 600, fontFamily: "var(--font-display)" }}>{stats.lastReviewDate || "—"}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--fog)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>Last Review</div>
                </div>
              </div>
            </section>

            {/* Review History */}
            <section className="sheet" style={{ flex: 2 }}>
              <div className="sheet-label">Review History</div>
              {historyLoading ? (
                <p style={{ color: "var(--fog)", fontStyle: "italic" }}>Loading history…</p>
              ) : history.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "var(--fog)" }}>No reviews yet. Start by submitting an essay!</p>
                  <button
                    type="button"
                    onClick={() => setView("reviewer")}
                    className="btn-primary-sm"
                    style={{ marginTop: "1rem" }}
                  >
                    Start New Review →
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ background: "var(--navy-raised)", border: "1px solid var(--rule-on-navy)", borderRadius: "4px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem" }}>
                          {SCHOLARSHIPS[h.scholarship_key || "chevening"]?.name || "Chevening"}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--fog)", marginTop: "0.25rem" }}>
                          {h.question_key || "Essay"} • {new Date(h.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem", color: h.overall_score >= 7 ? "#34d399" : h.overall_score >= 5 ? "#fbbf24" : "#fb7185" }}>
                        {h.overall_score}/10
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section className="sheet" style={{ flex: 1 }}>
              <div className="sheet-label">Quick Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setView("reviewer")}
                  className="btn-primary-sm"
                  style={{ textAlign: "left", padding: "1rem" }}
                >
                  <div style={{ fontWeight: 600 }}>New Essay Review</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Submit a new draft for evaluation</div>
                </button>
                <div style={{ background: "var(--navy-raised)", border: "1px solid var(--rule-on-navy)", borderRadius: "4px", padding: "1rem" }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Available Scholarships</div>
                  {scholarshipsList.map((s) => (
                    <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--rule-on-navy)", fontSize: "0.85rem" }}>
                      <span>{s.name}</span>
                      <span style={{ 
                        fontFamily: "var(--font-mono)", 
                        fontSize: "0.7rem", 
                        padding: "0.2rem 0.4rem", 
                        borderRadius: "3px",
                        background: s.status === "active" ? "rgba(34, 197, 94, 0.12)" : "rgba(251, 191, 36, 0.12)",
                        color: s.status === "active" ? "#22c55e" : "#fbbf24"
                      }}>
                        {s.status === "active" ? "ACTIVE" : "COMING SOON"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
