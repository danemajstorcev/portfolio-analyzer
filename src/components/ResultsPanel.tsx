import type { AnalysisResult } from "../types";
import ScoreGauge from "./ScoreGauge";
import SkillsChart from "./SkillsChart";
import SuggestionsList from "./SuggestionsList";
import MissingSkills from "./MissingSkills";

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsPanel({ result, onReset }: Props) {
  return (
    <div className="results">
      <div className="results-hero">
        <div className="row g-4 align-items-start">
          <div className="col-auto">
            <ScoreGauge
              score={result.overallScore}
              seniority={result.seniority}
            />
          </div>
          <div className="col">
            <div className="summary-block">
              <div className="summary-label">AI Assessment</div>
              <p className="summary-text">{result.summary}</p>
            </div>
            <SkillsChart scores={result.categoryScores} />
          </div>
        </div>
      </div>

      <hr className="divider" />

      <SuggestionsList
        suggestions={result.suggestions}
        strengths={result.strengths}
      />

      <hr className="divider" />

      <MissingSkills skills={result.missingSkills} />

      <div className="text-center mt-5">
        <button className="btn-reset" onClick={onReset}>
          ↩ Analyze another portfolio
        </button>
      </div>
    </div>
  );
}
