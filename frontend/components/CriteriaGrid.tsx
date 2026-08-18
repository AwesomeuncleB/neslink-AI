"use client";

import { Criterion } from "@/lib/types";

interface CriteriaGridProps {
  criteria: Criterion[];
}

export default function CriteriaGrid({ criteria }: CriteriaGridProps) {
  if (!criteria || criteria.length === 0) return null;

  return (
    <div className="criteria-section">
      <h3 className="section-title">Criteria Evaluation</h3>
      <div className="criteria-grid">
        {criteria.map((c, idx) => (
          <div key={idx} className="criterion-card">
            <div className="criterion-header">
              <span className="criterion-name">{c.name}</span>
              <div className="criterion-score-badge">
                <span className="score-val">{c.score}</span>
                <span className="score-max">/5</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="criterion-bar-bg">
              <div
                className="criterion-bar-fill"
                style={{ width: `${(c.score / 5) * 100}%` }}
              />
            </div>

            <p className="criterion-note">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
