import { useState } from 'react';
import ApiKeyInput from './ApiKeyInput';

interface Props {
  onAnalyze: (text: string, apiKey: string) => void;
  loading: boolean;
}

const PLACEHOLDER = `Paste your CV, resume, or portfolio description here...

Example:
John Doe — Frontend Developer
3 years experience with React, TypeScript, and Node.js.
Built an e-commerce platform serving 10k users. 
Led a team of 2 junior developers...`;

export default function InputPanel({ onAnalyze, loading }: Props) {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50) return;
    onAnalyze(text.trim(), apiKey);
  };

  const charCount = text.length;
  const ready = charCount >= 50;

  return (
    <div className="pa-input-panel">
      <div className="pa-panel-header">
        <h2 className="pa-panel-title">Drop your portfolio</h2>
        <p className="pa-panel-desc">
          Paste your CV, bio, or any career text. The AI analyzes structure,
          skills, and impact — then tells you exactly what to fix.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <ApiKeyInput onKey={setApiKey} />

        <div className="mb-3">
          <label className="pa-field-label mb-1">
            CV / Portfolio Text <span className="pa-required">*</span>
          </label>
          <textarea
            className="pa-textarea"
            rows={12}
            placeholder={PLACEHOLDER}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="pa-char-count">
            <span className={ready ? 'text-success' : ''}>
              {charCount} chars {ready ? '✓' : `(min 50)`}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="pa-btn-analyze"
          disabled={!ready || loading}
        >
          {loading ? (
            <>
              <span className="pa-spinner" />
              Analyzing…
            </>
          ) : (
            <>
              <span className="pa-btn-icon">◈</span>
              Analyze Portfolio
            </>
          )}
        </button>

        {!apiKey && (
          <p className="pa-mock-note mt-2">
            No API key? We'll run a demo analysis so you can see the output.
          </p>
        )}
      </form>
    </div>
  );
}
