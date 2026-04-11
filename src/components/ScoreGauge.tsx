interface Props {
  score: number;
  seniority: string;
}

export default function ScoreGauge({ score, seniority }: Props) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';

  const label =
    score >= 80 ? 'Excellent' :
    score >= 65 ? 'Strong' :
    score >= 50 ? 'Average' : 'Needs Work';

  return (
    <div className="pa-gauge-wrap">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="#e8edf4"
          strokeWidth="10"
        />
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
        <text x="90" y="82" textAnchor="middle" className="pa-gauge-number" fill="#0a0f1e">
          {score}
        </text>
        <text x="90" y="102" textAnchor="middle" className="pa-gauge-label-sm" fill="#6b7280">
          {label}
        </text>
      </svg>
      <div className="pa-seniority-badge">{seniority}</div>
    </div>
  );
}
