import React, { useState, useEffect, useCallback } from 'react';
import {
  Panel, Btn, CopyBtn, Toggle, Slider, Alert,
  ToolHeader, SplitPane, ToolGrid, Select
} from '../components/ui';
import { API } from '../lib';
import { ShieldCheck, RefreshCw, KeyRound, ListFilter } from 'lucide-react';

export default function PasswordTool() {
  const [opts, setOpts] = useState({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [strength, setStrength] = useState(null);
  const [count, setCount] = useState(10);

  const generate = useCallback(async (o = opts) => {
    try {
      const p = await API.generatePassword(o);
      setPassword(p);
      const s = await API.passwordStrength(p);
      setStrength(s);
    } catch (e) { }
  }, [opts]);

  const generateBulk = async () => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const p = await API.generatePassword(opts);
      results.push(p);
    }
    setPasswords(results);
  };

  useEffect(() => { generate(); }, []);

  const setOpt = (key, val) => {
    const next = { ...opts, [key]: val };
    setOpts(next);
    generate(next);
  };

  const STRENGTH_COLORS = {
    5: 'var(--success)',
    4: 'var(--accent2)',
    3: 'var(--warning)',
    2: 'var(--danger)',
    1: 'var(--danger)',
  };

  const strengthColor = strength ? STRENGTH_COLORS[strength.score] || 'var(--text-4)' : 'var(--border)';
  const strengthPct = strength ? (strength.score / strength.max) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <ToolHeader>
        <div style={{ component: 'div', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontWeight: 700 }}>
          <ShieldCheck size={18} />
          <span>Security Generator</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="ghost" size="sm" onClick={() => { setPasswords([]); }}>Clear History</Btn>
        </div>
      </ToolHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) 2fr', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Settings Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Configuration" accent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 0' }}>
              <Slider
                label="Password Length"
                value={opts.length}
                min={4} max={128}
                onChange={v => setOpt('length', v)}
              />

              <ToolGrid cols={1} gap={10}>
                <Toggle label="Uppercase (A-Z)" checked={opts.uppercase} onChange={v => setOpt('uppercase', v)} />
                <Toggle label="Lowercase (a-z)" checked={opts.lowercase} onChange={v => setOpt('lowercase', v)} />
                <Toggle label="Numbers (0-9)" checked={opts.numbers} onChange={v => setOpt('numbers', v)} />
                <Toggle label="Symbols (!@#$%^&*)" checked={opts.symbols} onChange={v => setOpt('symbols', v)} />
                <Toggle
                  label="Strict Avoidance"
                  desc="Exclude ambiguous chars (I, l, O, 0)"
                  checked={opts.excludeAmbiguous}
                  onChange={v => setOpt('excludeAmbiguous', v)}
                />
              </ToolGrid>
            </div>
          </Panel>

          {strength && (
            <Panel title="Strength Analysis" success={strength.score >= 4} error={strength.score <= 2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{strength.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{strength.score} / {strength.max}</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{
                  height: '100%', width: `${strengthPct}%`,
                  background: strengthColor, borderRadius: 10,
                  transition: 'all 0.3s ease', boxShadow: `0 0 10px ${strengthColor}40`
                }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(strength.checks).map(([k, v]) => (
                  <div key={k} style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 6,
                    background: v ? 'var(--bg-active)' : 'transparent',
                    border: `1px solid ${v ? 'var(--border-hi)' : 'var(--border)'}`,
                    color: v ? 'var(--text-1)' : 'var(--text-4)',
                    fontWeight: v ? 600 : 400,
                    opacity: v ? 1 : 0.5
                  }}>
                    {v && '✓ '}{k.replace('length', 'len ')}
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>

        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Primary Password" accent>
            <div style={{
              padding: '24px 20px', background: 'var(--bg-input)', borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 20
            }}>
              <code style={{
                fontSize: 24, fontWeight: 700, color: 'var(--text-1)',
                textAlign: 'center', wordBreak: 'break-all', fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em'
              }}>
                {password}
              </code>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn variant="primary" style={{ flex: 1 }} onClick={() => generate()}>
                  <RefreshCw size={14} />
                  <span>Regenerate</span>
                </Btn>
                <CopyBtn text={password} variant="secondary" />
              </div>
            </div>
          </Panel>

          <Panel title="Bulk Generator" style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Select
                value={count}
                onChange={v => setCount(Number(v))}
                options={[
                  { value: 5, label: '5 items' },
                  { value: 10, label: '10 items' },
                  { value: 20, label: '20 items' },
                  { value: 50, label: '50 items' },
                ]}
              />
              <Btn variant="accent" onClick={generateBulk}>
                <ListFilter size={14} />
                <span>Create Bulk</span>
              </Btn>
              {passwords.length > 0 && (
                <Btn variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(passwords.join('\n'))}>
                  Copy All
                </Btn>
              )}
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column' }}>
              {passwords.length > 0 ? (
                passwords.map((p, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', borderBottom: '1px solid var(--border)08',
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: i % 2 === 0 ? 'transparent' : 'var(--bg-input)40'
                  }}>
                    <span style={{ fontSize: 10, color: 'var(--text-4)', width: 24, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                    <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{p}</code>
                    <CopyBtn text={p} size="sm" variant="ghost" />
                  </div>
                ))
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', flexDirection: 'column', gap: 16, padding: 40 }}>
                  <KeyRound size={40} opacity={0.1} />
                  <span style={{ fontSize: 13 }}>Bulk generated passwords will appear here</span>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
