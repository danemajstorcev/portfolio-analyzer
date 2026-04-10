import { useState } from 'react';
import type { AnalysisResult, AppState } from './types';
import { analyzePortfolio, getMockResult } from './services/analyzerService';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult]     = useState<AnalysisResult | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const handleAnalyze = async (text: string, apiKey: string) => {
    setAppState('loading');
    setError(null);

    try {
      const data = apiKey
        ? await analyzePortfolio(text, apiKey)
        : await simulateMock();
      setResult(data);
      setAppState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Header />

      <main className="pa-main">
        <div className="container-xl">

          {(appState === 'idle' || appState === 'loading' || appState === 'error') && (
            <div className="row justify-content-center">
              <div className="col-lg-7 col-xl-6">

                {appState === 'idle' && (
                  <div className="pa-hero-text mb-5">
                    <h1 className="pa-hero-title">
                      Know exactly what your portfolio is missing.
                    </h1>
                    <p className="pa-hero-sub">
                      Paste your CV or portfolio text. The AI returns a strength score,
                      actionable suggestions, and a full skills gap analysis in seconds.
                    </p>
                  </div>
                )}

                <InputPanel
                  onAnalyze={handleAnalyze}
                  loading={appState === 'loading'}
                />

                {appState === 'error' && (
                  <div className="pa-error-banner mt-3">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {appState === 'result' && result && (
            <ResultsPanel result={result} onReset={handleReset} />
          )}

        </div>
      </main>
    </>
  );
}

function simulateMock(): Promise<AnalysisResult> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(getMockResult()), 1800)
  );
}
