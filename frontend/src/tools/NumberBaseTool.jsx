import React, { useState, useCallback } from 'react';
import { Panel, Btn, CopyBtn, Alert, Tabs, ToolHeader, ToolGrid } from '../components/ui';
import { API } from '../wailsbridge';
import { Hash, Zap } from 'lucide-react';

const BASES = [
  { id: '10', label: 'Decimal', code: 'DEC', placeholder: '42' },
  { id: '16', label: 'Hexadecimal', code: 'HEX', placeholder: '2A' },
  { id: '2', label: 'Binary', code: 'BIN', placeholder: '101010' },
  { id: '8', label: 'Octal', code: 'OCT', placeholder: '52' },
];

export default function NumberBaseTool() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const convert = useCallback(async (val, base) => {
    setError('');
    if (!val.trim()) { setResult(null); return; }
    try {
      const r = await API.convertBase(val, Number(base));
      setResult(r);
    } catch (e) { setError(String(e)); }
  }, []);

  const handleInput = (val) => { setInput(val); convert(val, fromBase); };
  const handleBase = (b) => { setFromBase(b); convert(input, b); };

  const ResultCard = ({ label, value, base, active }) => (
    <div style={{
      background: active ? 'var(--accent-glow)' : 'var(--bg-input)',
      border: `1px solid ${active ? 'var(--accent)40' : 'var(--border)'}`,
      borderRadius: 'var(--r-md)', padding: '16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: active ? 'var(--accent)' : 'var(--text-4)',
        }}>
          {label} (Base {base})
        </span>
        <CopyBtn text={value} size="sm" />
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700,
        color: active ? 'var(--accent)' : 'var(--text-1)',
        wordBreak: 'break-all', lineHeight: 1.2,
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <ToolHeader>
        <Tabs
          tabs={BASES.map(b => ({ id: b.id, label: b.code }))}
          active={fromBase}
          onChange={handleBase}
        />
        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="ghost" size="sm" onClick={() => { setInput(''); setResult(null); setError(''); }}>
            Clear
          </Btn>
        </div>
      </ToolHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Input Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title={`${BASES.find(b => b.id === fromBase)?.label} Input`}>
            <input
              type="text"
              value={input}
              onChange={e => handleInput(e.target.value)}
              placeholder={`Enter ${BASES.find(b => b.id === fromBase)?.label.toLowerCase()}...`}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 8, fontSize: 20,
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                background: 'var(--bg-input)', border: '1px solid var(--border)',
                color: 'var(--text-1)', outline: 'none',
              }}
            />
            {error && <Alert type="error" message={error} style={{ marginTop: 12 }} />}
          </Panel>

          <Panel title="Presets">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: '255', val: '255' },
                { label: '1024', val: '1024' },
                { label: '65535', val: '65535' },
                { label: 'Max Uint32', val: '4294967295' },
              ].map(s => (
                <Btn key={s.label} variant="secondary" size="sm" onClick={() => {
                  setFromBase('10'); setInput(s.val); convert(s.val, '10');
                }}>
                  <Zap size={12} style={{ color: 'var(--accent)' }} />
                  {s.label}
                </Btn>
              ))}
            </div>
          </Panel>
        </div>

        {/* Results Column */}
        <Panel title="Results" style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result ? (
              <>
                <ResultCard label="Decimal" value={result.decimal} base={10} active={fromBase === '10'} />
                <ResultCard label="Hexadecimal" value={result.hex} base={16} active={fromBase === '16'} />
                <ResultCard label="Binary" value={result.binary} base={2} active={fromBase === '2'} />
                <ResultCard label="Octal" value={result.octal} base={8} active={fromBase === '8'} />
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', flexDirection: 'column', gap: 16, marginTop: 40 }}>
                <Hash size={48} opacity={0.1} />
                <span>Enter a value to see conversions</span>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
