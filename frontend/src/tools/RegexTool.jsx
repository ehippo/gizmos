import React, { useState, useCallback, useMemo } from 'react';
import { Panel, Btn, CopyBtn, Alert, ToolHeader, ToolGrid, PropertyRow } from '../components/ui';
import { API } from '../lib';
import { Search, Info, Settings2, History, Wand2 } from 'lucide-react';

const PRESETS = [
  { label: 'Email Address', pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'Hyperlinks (URL)', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)', flags: 'gi' },
  { label: 'IPv4 Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' },
  { label: 'Phone (US)', pattern: '(\\+1)?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}', flags: 'g' },
  { label: 'HEX Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b', flags: 'g' },
  { label: 'UUID / GUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}', flags: 'gi' },
  { label: 'ISO 8601 Date', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
];

const SAMPLE_TEXT = `Contact us at support@example.com or sales@company.org
Visit https://www.example.com/products?id=123 for more info
Server IP: 192.168.1.100 and 10.0.0.1
Phone: (555) 123-4567 or +1 800-555-0199
Color codes: #ff6600 #3ecfb0 #abc
UUID: 550e8400-e29b-41d4-a716-446655440000
Date: 2024-01-15 and 2023-12-31`;

export default function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

  const test = useCallback(async (p, f, t) => {
    setError('');
    if (!p) { setResult(null); setExplanation(''); return; }
    try {
      const r = await API.regexTest(p, f, t);
      if (!r.valid) { setError(r.error); setResult(null); return; }
      setResult(r);
      const exp = await API.regexExplain(p);
      setExplanation(exp);
    } catch (e) { setError(String(e)); }
  }, []);

  const handlePattern = (v) => { setPattern(v); test(v, flags, testText); };
  const handleFlags = (v) => { setFlags(v); test(pattern, v, testText); };
  const handleText = (v) => { setTestText(v); test(pattern, flags, v); };

  const segments = useMemo(() => {
    if (!result || !result.matches) return [{ text: testText, highlighted: false }];
    const res = [];
    let lastIdx = 0;
    for (const m of result.matches) {
      if (m.index > lastIdx) res.push({ text: testText.slice(lastIdx, m.index), highlighted: false });
      res.push({ text: m.match, highlighted: true });
      lastIdx = m.index + m.match.length;
    }
    if (lastIdx < testText.length) res.push({ text: testText.slice(lastIdx), highlighted: false });
    return res;
  }, [testText, result]);

  const toggleFlag = (f) => {
    const next = flags.includes(f) ? flags.replace(f, '') : flags + f;
    handleFlags(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <ToolHeader>
        <div style={{ display: 'flex', gap: 6 }}>
          {['g', 'i', 'm', 's'].map(f => (
            <Btn
              key={f}
              variant={flags.includes(f) ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => toggleFlag(f)}
              style={{ padding: '4px 12px', minWidth: 40 }}
              title={f === 'g' ? 'Global' : f === 'i' ? 'Ignore Case' : f === 'm' ? 'Multiline' : 'DotAll'}
            >
              {f}
            </Btn>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" onClick={() => handleText('')}>Clear Text</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setPattern(''); setResult(null); setError(''); setExplanation(''); }}>Clear Regex</Btn>
        </div>
      </ToolHeader>

      {/* Regex Input Bar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-card)', border: `1px solid ${error ? 'var(--danger)' : result && result.count > 0 ? 'var(--success)' : pattern ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 48, flexShrink: 0,
        boxShadow: error ? '0 0 0 3px rgba(247,106,106,0.1)' : pattern ? '0 0 20px var(--accent-glow)' : 'none',
      }}>
        <div style={{ padding: '0 16px', fontSize: 24, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', userSelect: 'none' }}>/</div>
        <input
          type="text"
          value={pattern}
          onChange={e => handlePattern(e.target.value)}
          placeholder="Enter regular expression..."
          style={{ flex: 1, height: '100%', background: 'transparent', border: 'none', color: 'var(--text-1)', fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 600, outline: 'none' }}
        />
        <div style={{ padding: '0 16px', fontSize: 24, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', userSelect: 'none' }}>/</div>
        <div style={{ padding: '0 16px', background: 'var(--bg-input)', height: '100%', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--border)', fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)' }}>
          {flags}
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Editor Layer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel
            title="Test String"
            badge={result ? `${result.count} matches` : null}
            success={result && result.count > 0}
          >
            <div style={{ flex: 1, position: 'relative', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
              {/* Highlight Layer */}
              <div style={{
                position: 'absolute', inset: 0, padding: 14, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', pointerEvents: 'none', color: 'transparent', overflowY: 'auto'
              }}>
                {segments.map((seg, i) => (
                  <span key={i} style={{
                    background: seg.highlighted ? 'var(--accent)' : 'transparent',
                    color: seg.highlighted ? '#fff' : 'transparent',
                    borderRadius: 2, boxShadow: seg.highlighted ? '0 0 0 1px var(--accent)' : 'none'
                  }}>
                    {seg.text}
                  </span>
                ))}
              </div>
              {/* Interaction Layer */}
              <textarea
                value={testText}
                onChange={e => handleText(e.target.value)}
                spellCheck="false"
                style={{
                  width: '100%', height: '100%', background: 'transparent', border: 'none',
                  color: result ? 'rgba(232,232,245,0.4)' : 'var(--text-1)',
                  padding: 14, fontSize: 13, fontFamily: 'var(--font-mono)', lineHeight: 1.7,
                  outline: 'none', resize: 'none', caretColor: 'var(--text-1)'
                }}
              />
            </div>
          </Panel>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {explanation && (
            <Panel title="Explanation" accent>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {explanation}
              </div>
            </Panel>
          )}

          {result && result.matches.length > 0 && (
            <Panel title="Match Groups">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {result.matches.slice(0, 20).map((m, i) => (
                  <div key={i} style={{
                    padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border)',
                    borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <span style={{ fontSize: 10, variant: 'mono', color: 'var(--text-4)' }}>{i + 1}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{m.match}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5 }}>@{m.index}</span>
                  </div>
                ))}
                {result.matches.length > 20 && <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-4)', marginTop: 4 }}>... + {result.matches.length - 20} more</div>}
              </div>
            </Panel>
          )}

          <Panel title="Common Patterns">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setPattern(p.pattern); setFlags(p.flags); test(p.pattern, p.flags, testText); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid var(--border)',
                    borderRadius: 8, background: pattern === p.pattern ? 'var(--accent-glow)' : 'var(--bg-card)',
                    color: pattern === p.pattern ? 'var(--accent)' : 'var(--text-2)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { if (pattern !== p.pattern) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (pattern !== p.pattern) e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <Wand2 size={12} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
