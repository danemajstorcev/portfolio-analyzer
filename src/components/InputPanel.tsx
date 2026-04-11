import { useState, useRef, useCallback, useEffect } from 'react';
import { extractTextFromFile } from '../utils/fileReader';

interface Props {
  onAnalyze: (text: string, apiKey: string) => void;
  loading: boolean;
}

const PLACEHOLDER = `Paste your CV, resume, or portfolio description here…

Example:
Jane Smith — Frontend Developer
4 years of experience with React, TypeScript, and Node.js.
Built a logistics SaaS platform serving 15k users.
Led a team of 3 developers on a greenfield project…`;

export default function InputPanel({ onAnalyze, loading }: Props) {
  const [text,       setText]       = useState('');
  const [apiKey,     setApiKey]     = useState('');
  const [showKey,    setShowKey]    = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [fileInfo,   setFileInfo]   = useState<string | null>(null);
  const [fileError,  setFileError]  = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('pa_api_key');
    if (saved) setApiKey(saved);
  }, []);

  const saveKey = (val: string) => {
    setApiKey(val);
    sessionStorage.setItem('pa_api_key', val);
  };

  const handleFile = useCallback(async (file: File) => {
    setFileError(null);
    setFileInfo(null);
    if (file.size > 5 * 1024 * 1024) { setFileError('File too large — max 5MB.'); return; }

    setExtracting(true);
    try {
      const extracted = await extractTextFromFile(file);
      if (!extracted.trim()) { setFileError('Could not extract text from this file.'); return; }
      setText(extracted);
      setFileInfo(`${file.name} · ${(file.size / 1024).toFixed(0)} KB`);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setExtracting(false);
    }
  }, []);

  const onDrop      = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }, [handleFile]);
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };
  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50 || loading || extracting) return;
    onAnalyze(text.trim(), apiKey);
  };

  const charCount = text.length;
  const ready     = charCount >= 50;

  return (
    <div className="pa-input-panel">
      <div className="pa-panel-header">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div>
            <h2 className="pa-panel-title">Drop your portfolio</h2>
            <p className="pa-panel-desc">
              Upload a PDF, Word doc (.docx), or .txt — or paste your CV directly. The AI scores your profile and tells you exactly what to fix.
            </p>
          </div>
          <button type="button" className="pa-settings-btn" onClick={() => setShowKey(v => !v)} title="API Key">
            ⚙
          </button>
        </div>

        {showKey && (
          <div className="pa-apikey-wrap mt-3">
            <label className="pa-field-label mb-1">Claude API Key <span className="pa-field-optional">(optional)</span></label>
            <div className="pa-apikey-input-wrap">
              <input type={keyVisible ? 'text' : 'password'} className="pa-input" placeholder="sk-ant-..." value={apiKey} onChange={e => saveKey(e.target.value)} />
              <button type="button" className="pa-eye-btn" onClick={() => setKeyVisible(v => !v)}>{keyVisible ? '●' : '○'}</button>
            </div>
            <p className="pa-field-hint mt-1">Stored in <code>sessionStorage</code> only — never sent anywhere except Anthropic.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>

        <div
          className={`pa-dropzone${dragging ? ' pa-dropzone--active' : ''}${extracting ? ' pa-dropzone--loading' : ''}`}
          onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          onClick={() => !extracting && fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.txt,.docx,.doc,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword" onChange={onFileInput} style={{ display: 'none' }} />

          {extracting ? (
            <div className="pa-dropzone__content">
              <span className="pa-spinner pa-spinner--dark" />
              <span className="pa-dropzone__label">Extracting text…</span>
            </div>
          ) : fileInfo ? (
            <div className="pa-dropzone__content">
              <span className="pa-dropzone__icon">📄</span>
              <span className="pa-dropzone__filename">{fileInfo}</span>
              <span className="pa-dropzone__sub">Click to replace file</span>
            </div>
          ) : (
            <div className="pa-dropzone__content">
              <span className="pa-dropzone__icon">{dragging ? '📂' : '⬆'}</span>
              <span className="pa-dropzone__label">{dragging ? 'Release to upload' : 'Drop PDF, Word, or .txt here'}</span>
              <span className="pa-dropzone__sub">or click to browse · PDF, .docx, .txt · max 5MB</span>
            </div>
          )}
        </div>

        {fileError && <p className="pa-file-error mt-2">{fileError}</p>}

        <div className="pa-or-divider"><span>or paste text directly</span></div>

        <div className="mb-3">
          <textarea
            className="pa-textarea"
            rows={10}
            placeholder={PLACEHOLDER}
            value={text}
            onChange={e => { setText(e.target.value); setFileInfo(null); }}
          />
          <div className="pa-char-count">
            <span className={ready ? 'text-success' : ''}>{charCount} chars {ready ? '✓' : '(min 50)'}</span>
          </div>
        </div>

        <button type="submit" className="pa-btn-analyze" disabled={!ready || loading || extracting}>
          {loading ? <><span className="pa-spinner" /> Analyzing…</> : <><span className="pa-btn-icon">◈</span> Analyze Portfolio</>}
        </button>

        {!apiKey && <p className="pa-mock-note mt-2">No API key? We'll run a demo analysis so you can see the output.</p>}
      </form>
    </div>
  );
}
