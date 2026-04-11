import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputPanel from '../components/InputPanel';
import { analyzePortfolio, getMockResult } from '../services/analyzerService';
import type { AnalysisResult } from '../types';

export default function HomePage() {
  const navigate  = useNavigate();
  const [loading, setLoading]  = useState(false);
  const [error,   setError]    = useState<string | null>(null);

  const handleAnalyze = async (text: string, apiKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const result: AnalysisResult = apiKey
        ? await analyzePortfolio(text, apiKey)
        : await new Promise((res) => setTimeout(() => res(getMockResult(text)), 1800));

      sessionStorage.setItem('pa_result', JSON.stringify(result));
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pa-main">
      <div className="container-xl">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <div className="pa-hero-text mb-5">
              <h1 className="pa-hero-title">Know exactly what your portfolio is missing.</h1>
              <p className="pa-hero-sub">
                Upload your CV or paste it directly. The AI returns a strength score,
                actionable suggestions, and a full skills gap analysis in seconds.
              </p>
            </div>

            <InputPanel onAnalyze={handleAnalyze} loading={loading} />

            {error && (
              <div className="pa-error-banner mt-3">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
