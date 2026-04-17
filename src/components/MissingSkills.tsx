import type { MissingSkill } from "../types";

interface Props {
  skills: MissingSkill[];
}

const IMPORTANCE_META: Record<
  MissingSkill["importance"],
  { label: string; cls: string }
> = {
  critical: { label: "Critical", cls: "skill--critical" },
  recommended: { label: "Recommended", cls: "skill--recommended" },
  "nice-to-have": { label: "Nice to Have", cls: "skill--nice" },
};

export default function MissingSkills({ skills }: Props) {
  return (
    <div className="missing-skills">
      <h3 className="section-title">Skills Gap</h3>
      <div className="row g-3">
        {skills.map((s, i) => {
          const meta = IMPORTANCE_META[s.importance];
          return (
            <div key={i} className="col-md-4">
              <div className={`skill-card ${meta.cls}`}>
                <div className="skill-name">{s.skill}</div>
                <div className={`skill-badge`}>{meta.label}</div>
                <div className="skill-reason">{s.reason}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
