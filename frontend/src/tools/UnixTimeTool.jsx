import React, { useState, useEffect } from 'react';
import {
  Panel, Btn, Alert, StatBadge, ToolHeader, SplitPane, ToolLayout,
  PropertyTable, PropertyRow, Toggle, ToolGrid, TextInput
} from '../components/ui';
import { API } from '../lib';
import { Clock, Zap, History } from 'lucide-react';

export default function UnixTimeTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(null);
  const [liveTick, setLiveTick] = useState(true);

  useEffect(() => {
    let interval;
    const tick = async () => {
      const r = await API.nowTime();
      setNow(r);
    };
    if (liveTick) {
      tick();
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [liveTick]);

  const convert = async (val) => {
    setError('');
    if (!val.trim()) { setResult(null); return; }
    const n = Number(val.trim());
    if (isNaN(n)) {
      setError('Invalid timestamp — enter a numeric Unix timestamp');
      setResult(null);
      return;
    }
    try {
      const r = await API.unixToTime(n);
      setResult(r);
    } catch (e) { setError(String(e)); }
  };

  const useNow = () => {
    if (now) {
      setInput(String(now.unix));
      convert(String(now.unix));
    }
  };

  return (
    <ToolLayout>
      <ToolHeader>
        <Toggle
          label="Live Updates"
          checked={liveTick}
          onChange={setLiveTick}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Btn variant="ghost" size="sm" onClick={() => { setInput(''); setResult(null); setError(''); }}>
            Clear
          </Btn>
        </div>
      </ToolHeader>

      <SplitPane
        left={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Live Clock */}
            {now && (
              <Panel title="Current Time" accent>
                <ToolGrid cols={2}>
                  <StatBadge label="Unix Seconds" value={now.unix} accent />
                  <StatBadge label="Unix Millis" value={now.unixMilli} />
                </ToolGrid>
                <div style={{
                  marginTop: 10,
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>// utc date</div>
                  <div style={{ fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
                    {now.utc}
                  </div>
                </div>
                <Btn variant="accent" size="sm" onClick={useNow} style={{ marginTop: 8, width: '100%' }}>
                  <Zap size={12} />
                  <span>Use Current Timestamp</span>
                </Btn>
              </Panel>
            )}

            {/* Input Panel */}
            <Panel title="Convert Timestamp">
              <div style={{ display: 'flex', gap: 6 }}>
                <TextInput
                  value={input}
                  onChange={val => { setInput(val); convert(val); }}
                  placeholder="Enter Unix (sec or ms)..."
                  mono
                  style={{ flex: 1 }}
                />
                <Btn variant="primary" size="sm" onClick={() => convert(input)}>Convert</Btn>
              </div>
              {error && <Alert type="error" message={error} style={{ marginTop: 8 }} />}
            </Panel>

            <Panel title="Common Presets" style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'Unix Epoch', ts: 0 },
                  { label: 'Y2K', ts: 946684800 },
                  { label: 'Start of 2024', ts: 1704067200 },
                  { label: '+1 Hour', ts: Math.floor(Date.now() / 1000) + 3600 },
                  { label: '+1 Day', ts: Math.floor(Date.now() / 1000) + 86400 },
                ].map(({ label, ts }) => (
                  <Btn key={label} variant="secondary" size="sm" onClick={() => { setInput(String(ts)); convert(String(ts)); }}>
                    {label}
                  </Btn>
                ))}
              </div>
            </Panel>
          </div>
        }
        right={
          <Panel title="Result Analysis" success={!!result}>
            {result ? (
              <PropertyTable>
                <PropertyRow label="UTC" value={result.utc} accent />
                <PropertyRow label="Unix (s)" value={result.unix} />
                <PropertyRow label="Unix (ms)" value={result.unixMilli} />
                <PropertyRow label="ISO 8601" value={result.iso8601} />
                <PropertyRow label="RFC 822" value={result.rfc822} />
                <PropertyRow label="Relative" value={result.relative} success />
              </PropertyTable>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', flexDirection: 'column', gap: 12 }}>
                <Clock size={48} opacity={0.2} />
                <span>Enter a timestamp to see conversion results</span>
              </div>
            )}
          </Panel>
        }
      />
    </ToolLayout>
  );
}
