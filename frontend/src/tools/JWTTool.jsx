import React, { useState, useCallback, useEffect } from 'react';
import {
  Panel, SplitPane, CodeArea, Btn, CopyBtn, Tabs, Alert,
  ToolHeader, PropertyTable, PropertyRow, StatBadge, ToolLayout, TextInput
} from '../components/ui';
import { API } from '../lib';
import { Key, ShieldCheck, FileJson, Lock, AlertCircle, Search } from 'lucide-react';

const DEFAULT_HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify({
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
}, null, 2);

const SAMPLE_TOKENS = [
  { label: 'HS256 Sample', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
  { label: 'Expired Token', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpleCIsImV4cCI6MTUwMDAwMDAwMH0.abc' },
];

export default function JWTTool() {
  const [mode, setMode] = useState('decode');
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Encode state
  const [encHeader, setEncHeader] = useState(DEFAULT_HEADER);
  const [encPayload, setEncPayload] = useState(DEFAULT_PAYLOAD);
  const [encSecret, setEncSecret] = useState('your-secret-key');
  const [encOutput, setEncOutput] = useState('');
  const [encError, setEncError] = useState('');

  const decode = useCallback(async (t) => {
    setError('');
    if (!t.trim()) { setResult(null); return; }
    try {
      const r = await API.jwtDecode(t);
      if (r.valid) setResult(r);
      else { setError(r.error); setResult(null); }
    } catch (e) { setError(String(e)); }
  }, []);

  const encode = async () => {
    setEncError('');
    try {
      const out = await API.jwtEncode(encHeader, encPayload, encSecret);
      setEncOutput(out);
    } catch (e) { setEncError(String(e)); }
  };

  return (
    <ToolLayout>
      <ToolHeader>
        <Tabs
          tabs={[{ id: 'decode', label: 'Decoder' }, { id: 'encode', label: 'Encoder' }]}
          active={mode}
          onChange={setMode}
        />
        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="ghost" size="sm" onClick={() => { setToken(''); setResult(null); setEncOutput(''); }}>Clear All</Btn>
        </div>
      </ToolHeader>

      {mode === 'decode' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
          {/* Input Layer */}
          <Panel title="Encoded Token" accent style={{ flex: 1 }}>
            <CodeArea
              value={token}
              onChange={val => { setToken(val); decode(val); }}
              placeholder="Paste your JWT token here (Header.Payload.Signature)..."
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {SAMPLE_TOKENS.map(s => (
                <Btn key={s.label} variant="secondary" size="sm" onClick={() => { setToken(s.token); decode(s.token); }}>
                  <Search size={12} />
                  {s.label}
                </Btn>
              ))}
            </div>
          </Panel>

          {error && <Alert type="error" message={error} />}

          {/* Result Layer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 12, flex: 1, minHeight: 0 }}>
            {/* Left: Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Panel title="Token Information" accent={!!result}>
                {result ? (
                  <PropertyTable>
                    <PropertyRow label="Algorithm" value={result.algorithm} accent />
                    <PropertyRow label="Status" value={result.isExpired ? 'Expired' : 'Live'} danger={result.isExpired} success={!result.isExpired} />
                    <PropertyRow label="Issued At" value={result.issuedAt || 'N/A'} />
                    <PropertyRow label="Expires" value={result.expiresAt || 'N/A'} />
                  </PropertyTable>
                ) : (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-4)' }}>
                    <Lock size={40} opacity={0.1} style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 13 }}>No token data</div>
                  </div>
                )}
              </Panel>
              <Panel title="Signature" icon={<ShieldCheck size={14} />}>
                {result ? (
                  <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', wordBreak: 'break-all' }}>
                    {result.signature}
                  </code>
                ) : <span style={{ color: 'var(--text-4)', fontSize: 12 }}>Waiting for token...</span>}
              </Panel>
            </div>

            {/* Right: Content */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12, minHeight: 0 }}>
              <Panel title="JOSE Header" icon={<FileJson size={14} />} actions={<CopyBtn text={result?.header} />}>
                <CodeArea value={result?.header || ''} readOnly placeholder="Header data..." />
              </Panel>
              <Panel title="Payload Claims" icon={<FileJson size={14} />} actions={<CopyBtn text={result?.payload} />}>
                <CodeArea value={result?.payload || ''} readOnly placeholder="Payload data..." />
              </Panel>
            </div>
          </div>
        </div>
      ) : (
        /* Encoder Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
            <Panel title="Header Configuration" style={{ flex: 1 }}>
              <CodeArea value={encHeader} onChange={setEncHeader} />
            </Panel>
            <Panel title="Payload Data" style={{ flex: 1 }}>
              <CodeArea value={encPayload} onChange={setEncPayload} />
            </Panel>
          </div>

          <Panel title="Signing Controls">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
              <TextInput
                label="Secret Key (HMAC)"
                value={encSecret}
                onChange={setEncSecret}
                placeholder="HMAC secret key..."
              />
              <Btn variant="primary" size="lg" onClick={encode} style={{ height: 44, marginTop: 14 }}>
                <ShieldCheck size={16} />
                <span>Generate Token</span>
              </Btn>
            </div>
          </Panel>

          {encError && <Alert type="error" message={encError} />}

          {encOutput && (
            <Panel title="Generated JWT" success>
              <div style={{
                padding: 16, background: 'var(--bg-input)', borderRadius: 'var(--r-md)',
                border: '1px solid var(--success)30', display: 'flex', gap: 12, alignItems: 'center'
              }}>
                <code style={{ flex: 1, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-1)', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {encOutput}
                </code>
                <CopyBtn text={encOutput} />
              </div>
            </Panel>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

