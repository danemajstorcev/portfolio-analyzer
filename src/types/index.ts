export interface AnalysisResult {
  overallScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  suggestions: Suggestion[];
  missingSkills: MissingSkill[];
  summary: string;
  seniority: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead';
}

export interface CategoryScore {
  label: string;
  score: number;
  color: string;
}

export interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

export interface MissingSkill {
  skill: string;
  importance: 'critical' | 'recommended' | 'nice-to-have';
  reason: string;
}

export type AppState = 'idle' | 'loading' | 'result' | 'error';
