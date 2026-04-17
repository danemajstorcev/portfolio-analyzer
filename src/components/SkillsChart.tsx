import type { CategoryScore } from "../types";

interface Props {
  scores: CategoryScore[];
}

export default function SkillsChart({ scores }: Props) {
  return (
    <div className="skills-chart">
      <h3 className="section-title">Category Breakdown</h3>
      <div className="bars">
        {scores.map((cat, i) => (
          <div key={cat.label} className="bar-row">
            <div className="bar-label">{cat.label}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${cat.score}%`,
                  background: cat.color,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </div>
            <div className="bar-score" style={{ color: cat.color }}>
              {cat.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
