import type { AnalysisResult } from '../types';
import ScoreGauge from './ScoreGauge';
import SkillsChart from './SkillsChart';
import SuggestionsList from './SuggestionsList';
import MissingSkills from './MissingSkills';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsPanel({ result, onReset }: Props) {
  return (
    <div className="pa-results">

      {/* Top row: gauge + summary + bars */}
      <div className="pa-results-hero">
        <div className="row g-4 align-items-start">
          <div className="col-auto">
            <ScoreGauge score={result.overallScore} seniority={result.seniority} />
          </div>
          <div className="col">
            <div className="pa-summary-block">
              <div className="pa-summary-label">AI Assessment</div>
              <p className="pa-summary-text">{result.summary}</p>
            </div>
            <SkillsChart scores={result.categoryScores} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="pa-divider" />

      {/* Strengths + Suggestions */}
      <SuggestionsList suggestions={result.suggestions} strengths={result.strengths} />

      {/* Divider */}
      <hr className="pa-divider" />

      {/* Missing skills */}
      <MissingSkills skills={result.missingSkills} />

      {/* Re-analyze */}
      <div className="text-center mt-5">
        <button className="pa-btn-reset" onClick={onReset}>
          ↩ Analyze another portfolio
        </button>
      </div>
    </div>
  );
}
