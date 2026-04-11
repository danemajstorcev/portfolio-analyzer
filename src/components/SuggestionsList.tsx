import type { Suggestion } from '../types';

interface Props {
  suggestions: Suggestion[];
  strengths: string[];
}

const PRIORITY_META: Record<Suggestion['priority'], { label: string; cls: string }> = {
  high:   { label: 'High Priority',   cls: 'pa-badge--high'   },
  medium: { label: 'Medium Priority', cls: 'pa-badge--medium' },
  low:    { label: 'Low Priority',    cls: 'pa-badge--low'    },
};

export default function SuggestionsList({ suggestions, strengths }: Props) {
  return (
    <div className="row g-4">
      <div className="col-md-5">
        <h3 className="pa-section-title">What's Working</h3>
        <ul className="pa-strength-list">
          {strengths.map((s, i) => (
            <li key={i} className="pa-strength-item">
              <span className="pa-strength-icon">✦</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-md-7">
        <h3 className="pa-section-title">Improvements</h3>
        <div className="pa-suggestions">
          {suggestions.map((s, i) => {
            const meta = PRIORITY_META[s.priority];
            return (
              <div key={i} className="pa-suggestion-card">
                <div className="d-flex align-items-start gap-3">
                  <span className={`pa-badge ${meta.cls}`}>{meta.label}</span>
                  <div>
                    <div className="pa-suggestion-title">{s.title}</div>
                    <div className="pa-suggestion-detail">{s.detail}</div>
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
