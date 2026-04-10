import type { CategoryScore } from '../types';

interface Props {
  scores: CategoryScore[];
}

export default function SkillsChart({ scores }: Props) {
  return (
    <div className="pa-skills-chart">
      <h3 className="pa-section-title">Category Breakdown</h3>
      <div className="pa-bars">
        {scores.map((cat, i) => (
          <div key={cat.label} className="pa-bar-row">
            <div className="pa-bar-label">{cat.label}</div>
            <div className="pa-bar-track">
              <div
                className="pa-bar-fill"
                style={{
                  width: `${cat.score}%`,
                  background: cat.color,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </div>
            <div className="pa-bar-score" style={{ color: cat.color }}>
              {cat.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
