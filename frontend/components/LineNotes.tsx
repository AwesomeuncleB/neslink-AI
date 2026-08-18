"use client";

import { LineNote } from "@/lib/types";

interface LineNotesProps {
  lineNotes: LineNote[];
}

export default function LineNotes({ lineNotes }: LineNotesProps) {
  if (!lineNotes || lineNotes.length === 0) return null;

  return (
    <div className="line-notes-section">
      <h3 className="section-title">Marginalia & Line Notes</h3>
      <p className="section-subtitle">
        Specific diagnostic observations tied directly to phrases in your essay.
      </p>

      <div className="line-notes-list">
        {lineNotes.map((item, idx) => (
          <div key={idx} className="line-note-card">
            <div className="line-note-quote">
              <span className="quote-mark">“</span>
              <span className="quote-text">{item.quote}</span>
              <span className="quote-mark">”</span>
            </div>
            <div className="line-note-comment">
              <span className="margin-indicator">✎</span>
              <p className="note-text">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
