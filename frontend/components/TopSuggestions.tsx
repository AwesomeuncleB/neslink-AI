"use client";

interface TopSuggestionsProps {
  suggestions: string[];
}

export default function TopSuggestions({ suggestions }: TopSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestions-section">
      <h3 className="section-title">Key Strategic Suggestions</h3>
      <div className="suggestions-list">
        {suggestions.map((s, idx) => (
          <div key={idx} className="suggestion-item">
            <span className="suggestion-bullet">✦</span>
            <p className="suggestion-text">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
