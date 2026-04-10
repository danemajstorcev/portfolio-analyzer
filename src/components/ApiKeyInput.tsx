import { useState, useEffect } from 'react';

interface Props {
  onKey: (key: string) => void;
}

export default function ApiKeyInput({ onKey }: Props) {
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('pa_api_key');
    if (saved) { setKey(saved); onKey(saved); }
  }, []);

  const handleChange = (val: string) => {
    setKey(val);
    sessionStorage.setItem('pa_api_key', val);
    onKey(val);
  };

  return (
    <div className="pa-apikey-wrap mb-4">
      <label className="pa-field-label mb-1">
        Claude API Key <span className="pa-required">*</span>
      </label>
      <div className="pa-apikey-input-wrap">
        <input
          type={visible ? 'text' : 'password'}
          className="pa-input"
          placeholder="sk-ant-..."
          value={key}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button
          type="button"
          className="pa-eye-btn"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? '●' : '○'}
        </button>
      </div>
      <p className="pa-field-hint mt-1">
        Stored in <code>sessionStorage</code> only — never sent anywhere except Anthropic.
        Use a demo key or leave blank to run with mock data.
      </p>
    </div>
  );
}
