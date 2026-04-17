import type { Suggestion } from "../types";

interface Props {
  suggestions: Suggestion[];
  strengths: string[];
}

const PRIORITY_META: Record<
  Suggestion["priority"],
  { label: string; cls: string }
> = {
  high: { label: "High Priority", cls: "badge--high" },
  medium: { label: "Medium Priority", cls: "badge--medium" },
  low: { label: "Low Priority", cls: "badge--low" },
};

export default function SuggestionsList({ suggestions, strengths }: Props) {
  return (
    <div className="row g-4">
      <div className="col-md-5">
        <h3 className="section-title">What's Working</h3>
        <ul className="strength-list">
          {strengths.map((s, i) => (
            <li key={i} className="strength-item">
              <span className="strength-icon">✦</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-md-7">
        <h3 className="section-title">Improvements</h3>
        <div className="suggestions">
          {suggestions.map((s, i) => {
            const meta = PRIORITY_META[s.priority];
            return (
              <div key={i} className="suggestion-card">
                <div className="d-flex align-items-start gap-3">
                  <span className={`badge ${meta.cls}`}>{meta.label}</span>
                  <div>
                    <div className="suggestion-title">{s.title}</div>
                    <div className="suggestion-detail">{s.detail}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
