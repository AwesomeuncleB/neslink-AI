"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";
import { SCHOLARSHIPS } from "@/lib/rubrics";
import { HistoryRow, Scholarship } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<HistoryRow | null>(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    topScholarship: "—",
    lastReviewDate: "—",
  });

  const scholarshipsList = Object.values(SCHOLARSHIPS);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/history?user_id=${user.id}`);
      const data = await res.json();
      if (res.ok) {
        const evaluations: HistoryRow[] = Array.isArray(data) ? data : (data.evaluations || []);
        setHistory(evaluations);
        calculateStats(evaluations);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (evaluations: HistoryRow[]) => {
    const total = evaluations.length;
    if (total === 0) {
      setStats({
        totalReviews: 0,
        averageScore: 0,
        topScholarship: "—",
        lastReviewDate: "—",
      });
      return;
    }

    const avgScore = evaluations.reduce((sum, e) => sum + (e.overall_score || 0), 0) / total;

    const scholarshipCounts: Record<string, number> = {};
    evaluations.forEach((e) => {
      const key = e.scholarship_key || "chevening";
      scholarshipCounts[key] = (scholarshipCounts[key] || 0) + 1;
    });

    const topKey = Object.entries(scholarshipCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const topScholarship = topKey ? (SCHOLARSHIPS[topKey]?.name || topKey) : "—";

    const lastReview = evaluations[0];
    const lastReviewDate = lastReview
      ? new Date(lastReview.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

    setStats({
      totalReviews: total,
      averageScore: Math.round(avgScore * 10) / 10,
      topScholarship,
      lastReviewDate,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.3)" };
    if (score >= 6) return { bg: "rgba(251, 191, 36, 0.15)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.3)" };
    return { bg: "rgba(244, 63, 94, 0.15)", text: "#fb7185", border: "rgba(244, 63, 94, 0.3)" };
  };

  const getQuestionLabel = (scholarshipKey: string, questionKey: string) => {
    const s = SCHOLARSHIPS[scholarshipKey] || SCHOLARSHIPS.chevening;
    return s?.questions?.[questionKey]?.label || questionKey;
  };

  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name?.trim();
    if (fullName) {
      const first = fullName.split(/\s+/)[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    const emailName = user?.email?.split("@")[0]?.trim();
    if (emailName) return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    return "Scholar";
  };

  const firstName = getFirstName();

  if (!authLoading && !user) {
    return (
      <div className="dashboard-wrapper">
        <Navbar />
        <main className="auth-wrapper">
          <div className="auth-card" style={{ textAlign: "center" }}>
            <div className="auth-header">
              <h1>Sign In Required</h1>
              <p>You must be signed in to access your personal dashboard and review history.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <Link href="/login" className="btn-primary-hero">
                Sign In →
              </Link>
              <Link href="/signup" className="btn-secondary-hero">
                Create Account
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <main className="dashboard-container">
        {/* HERO WELCOME BANNER */}
        <section className="dash-hero">
          <div>
            <h1 className="dash-hero-title">
              Welcome back, {firstName}
            </h1>
            <p className="dash-hero-subtitle">
              Track your essay evaluations, review panel feedback scores, and rubric alignment over time.
            </p>
          </div>
          <div className="dash-hero-actions">
            <Link href="/app" className="btn-primary-hero" style={{ whiteSpace: "nowrap" }}>
              Start New Essay Review →
            </Link>
          </div>
        </section>

        {/* METRICS GRID */}
        <section className="dash-metrics-grid">
          {/* Card 1: Total Reviews */}
          <div className="dash-metric-card">
            <div className="dash-metric-label">Total Essay Reviews</div>
            <div className="dash-metric-value highlight">{stats.totalReviews}</div>
            <div className="dash-metric-meta">Submitted assessments</div>
          </div>

          {/* Card 2: Average Score */}
          <div className="dash-metric-card">
            <div className="dash-metric-label">Average Score</div>
            <div className="dash-metric-value">
              {stats.totalReviews > 0 ? `${stats.averageScore} / 10` : "—"}
            </div>
            <div className="dash-metric-meta">
              {stats.totalReviews > 0 ? "Overall rubric benchmark" : "No evaluations recorded"}
            </div>
          </div>

          {/* Card 3: Top Scholarship Focus */}
          <div className="dash-metric-card">
            <div className="dash-metric-label">Top Scholarship Focus</div>
            <div className="dash-metric-value" style={{ fontSize: "1.5rem" }}>
              {stats.topScholarship}
            </div>
            <div className="dash-metric-meta">Most practiced program</div>
          </div>

          {/* Card 4: Last Review Date */}
          <div className="dash-metric-card">
            <div className="dash-metric-label">Last Evaluation</div>
            <div className="dash-metric-value" style={{ fontSize: "1.4rem" }}>
              {stats.lastReviewDate}
            </div>
            <div className="dash-metric-meta">Recent activity timestamp</div>
          </div>
        </section>

        {/* 2-COLUMN COMMAND CENTER */}
        <section className="dash-content-grid">
          {/* LEFT COLUMN: Recent Reviews Feed */}
          <div className="dash-panel">
            <div className="dash-panel-header">
              <div>
                <h2 className="dash-panel-title">Evaluation History</h2>
                <p className="dash-panel-subtitle">Your calibrated reading panel reports and scorecards</p>
              </div>
              {history.length > 0 && (
                <Link href="/app" className="btn-secondary-sm" style={{ fontSize: "0.82rem" }}>
                  + New Review
                </Link>
              )}
            </div>

            {loading ? (
              <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--fog)" }}>
                <p>Loading your evaluation records…</p>
              </div>
            ) : history.length === 0 ? (
              <div className="dash-empty-state">
                <div className="dash-empty-icon">📝</div>
                <h3 className="dash-empty-title">No essay evaluations yet</h3>
                <p className="dash-empty-text">
                  Submit your draft essay to the reviewer desk to receive instant rubric scoring, criteria breakdowns, and line notes.
                </p>
                <Link href="/app" className="btn-primary-sm" style={{ display: "inline-block", padding: "0.75rem 1.5rem" }}>
                  Submit Your First Essay →
                </Link>
              </div>
            ) : (
              <div className="eval-list">
                {history.map((item) => {
                  const sKey = item.scholarship_key || "chevening";
                  const sName = SCHOLARSHIPS[sKey]?.name || "Chevening";
                  const qLabel = getQuestionLabel(sKey, item.question_key);
                  const scoreStyle = getScoreColor(item.overall_score);

                  return (
                    <div
                      key={item.id}
                      className="eval-card-item"
                      onClick={() => setSelectedEvaluation(item)}
                      title="Click to view full assessment report"
                    >
                      <div className="eval-item-info">
                        <div className="eval-item-title">{sName} • {qLabel}</div>
                        <div className="eval-item-meta">
                          <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>📊 {item.word_count} / {item.word_limit} words</span>
                          <span>•</span>
                          <span style={{ color: "var(--gold-bright)" }}>Click to view details →</span>
                        </div>
                      </div>
                      <div
                        className="eval-score-badge"
                        style={{
                          background: scoreStyle.bg,
                          color: scoreStyle.text,
                          border: `1px solid ${scoreStyle.border}`,
                        }}
                      >
                        {item.overall_score}/10
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Programs & Reviewer Advice */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Available Scholarships */}
            <div className="dash-panel">
              <div className="dash-panel-header">
                <div>
                  <h3 className="dash-panel-title" style={{ fontSize: "1.1rem" }}>Scholarship Programs</h3>
                  <p className="dash-panel-subtitle">Multi-scholarship rubric catalog</p>
                </div>
              </div>

              <div className="scholarship-quick-list">
                {scholarshipsList.map((s) => (
                  <div key={s.key} className="scholarship-quick-item">
                    <span className="scholarship-quick-name">{s.name}</span>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      background: s.status === "active" ? "rgba(34, 197, 94, 0.15)" : "rgba(251, 191, 36, 0.15)",
                      color: s.status === "active" ? "#4ade80" : "#fbbf24",
                      border: `1px solid ${s.status === "active" ? "rgba(34, 197, 94, 0.3)" : "rgba(251, 191, 36, 0.3)"}`
                    }}>
                      {s.status === "active" ? "ACTIVE" : "CALIBRATING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Panel Guidance Card */}
            <div className="dash-panel">
              <h3 className="dash-panel-title" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                Review Panel Insights
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--fog)", lineHeight: 1.5, margin: "0 0 1rem" }}>
                Key principles evaluated across official reading committees:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--body-text)", lineHeight: 1.6 }}>
                <li><strong>Individual Agency</strong>: Highlight your direct actions ("I led", "I created"), not vague collective efforts.</li>
                <li><strong>Measurable Impact</strong>: Anchor leadership examples in quantifiable metrics and beneficiary outcomes.</li>
                <li><strong>Specific Modules</strong>: Name exact course modules, professors, and field initiatives for Course Choice.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* FULL ASSESSMENT DETAIL MODAL */}
      {selectedEvaluation && (
        <div className="modal-overlay" onClick={() => setSelectedEvaluation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedEvaluation(null)} aria-label="Close modal">
              ✕
            </button>

            <div style={{ borderBottom: "1px solid var(--rule-on-navy)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-bright)", letterSpacing: "0.08em" }}>
                {SCHOLARSHIPS[selectedEvaluation.scholarship_key || "chevening"]?.name || "Chevening"}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", margin: "0.25rem 0 0.5rem", color: "var(--body-text)" }}>
                {getQuestionLabel(selectedEvaluation.scholarship_key || "chevening", selectedEvaluation.question_key)}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--fog)", fontFamily: "var(--font-mono)" }}>
                Evaluated on {new Date(selectedEvaluation.created_at).toLocaleDateString()} • {selectedEvaluation.word_count} words
              </div>
            </div>

            {/* Score Stamp Banner */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", background: "var(--stat-box-bg)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--card-border)", marginBottom: "1.5rem" }}>
              <div style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: selectedEvaluation.overall_score >= 7 ? "#4ade80" : selectedEvaluation.overall_score >= 5 ? "#fbbf24" : "#fb7185",
                lineHeight: 1
              }}>
                {selectedEvaluation.overall_score}/10
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
                  {selectedEvaluation.overall_score >= 8 ? "Strong Candidate" : selectedEvaluation.overall_score >= 6 ? "Competitive Draft" : "Developing Draft"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--fog)" }}>
                  {selectedEvaluation.within_word_limit ? "✓ Compliant with official word limit" : "⚠ Exceeds official word limit"}
                </div>
              </div>
            </div>

            {/* Criteria Breakdown */}
            {selectedEvaluation.criteria && selectedEvaluation.criteria.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--stamp-red)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                  Criteria Breakdown
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {selectedEvaluation.criteria.map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0.75rem", background: "var(--stat-box-bg)", borderRadius: "4px", border: "1px solid var(--card-border)", gap: "1rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--body-text)" }}>{c.name}</div>
                        <div style={{ fontSize: "0.84rem", color: "var(--ink-soft)", marginTop: "0.2rem" }}>{c.note}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gold-bright)", fontSize: "1rem", whiteSpace: "nowrap" }}>
                        {c.score}/5
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Fixes */}
            {selectedEvaluation.top_suggestions && selectedEvaluation.top_suggestions.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--stamp-red)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                  Priority Fixes
                </h4>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--body-text)", lineHeight: 1.6 }}>
                  {selectedEvaluation.top_suggestions.map((s, i) => (
                    <li key={i} style={{ marginBottom: "0.4rem" }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Line Notes */}
            {selectedEvaluation.line_notes && selectedEvaluation.line_notes.length > 0 && (
              <div>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--stamp-red)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                  Margin Notes
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {selectedEvaluation.line_notes.map((n, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "var(--stat-box-bg)", borderRadius: "4px", border: "1px solid var(--card-border)" }}>
                      <div style={{ fontStyle: "italic", color: "var(--gold-bright)", fontSize: "0.92rem", marginBottom: "0.3rem" }}>
                        &ldquo;{n.quote}&rdquo;
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                        {n.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
