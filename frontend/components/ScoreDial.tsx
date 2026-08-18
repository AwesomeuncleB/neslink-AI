"use client";

interface ScoreDialProps {
  score: number; // 1 to 10
  wordCount: number;
  wordLimit: number;
  withinLimit: boolean;
}

export default function ScoreDial({
  score,
  wordCount,
  wordLimit,
  withinLimit,
}: ScoreDialProps) {
  const getRating = (s: number) => {
    if (s >= 9) return { label: "Shortlist Standard", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
    if (s >= 7) return { label: "Competitive Applicant", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/30" };
    if (s >= 5) return { label: "Developing Draft", color: "text-blue-300", bg: "bg-blue-500/10 border-blue-500/30" };
    return { label: "Needs Substantial Revision", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" };
  };

  const rating = getRating(score);

  return (
    <div className="score-summary-card">
      <div className="score-dial-wrap">
        <div className="score-number-display">
          <span className="score-big">{score}</span>
          <span className="score-denom">/10</span>
        </div>
        <div className={`rating-pill ${rating.color}`}>
          {rating.label}
        </div>
      </div>

      <div className="score-meta-metrics">
        <div className="meta-metric-item">
          <span className="metric-label">Word Count</span>
          <span className={`metric-value ${withinLimit ? "text-emerald-400" : "text-rose-400"}`}>
            {wordCount} / {wordLimit} words
          </span>
        </div>
        <div className="meta-metric-item">
          <span className="metric-label">Status</span>
          <span className={`metric-value ${withinLimit ? "text-emerald-400" : "text-rose-400"}`}>
            {withinLimit ? "✓ Within Limit" : "⚠️ Exceeds Limit"}
          </span>
        </div>
      </div>
    </div>
  );
}
