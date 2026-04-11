import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsPanel from '../components/ResultsPanel';
import type { AnalysisResult } from '../types';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('pa_result');
    if (!raw) { navigate('/'); return; }
    try { setResult(JSON.parse(raw)); }
    catch { navigate('/'); }
  }, [navigate]);

  if (!result) return null;

  return (
    <main className="pa-main">
      <div className="container-xl">
        <ResultsPanel
          result={result}
          onReset={() => { sessionStorage.removeItem('pa_result'); navigate('/'); }}
        />
      </div>
    </main>
  );
}
