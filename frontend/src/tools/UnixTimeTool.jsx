import React, { useState, useEffect } from 'react';
import {
  Panel, Btn, Alert, StatBadge, ToolHeader, SplitPane,
  PropertyTable, PropertyRow, Toggle, ToolGrid
} from '../components/ui';
import { API } from '../wailsbridge';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <ToolHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Toggle
            label="Live Updates"
            checked={liveTick}
            onChange={setLiveTick}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
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
                  marginTop: 16,
                  padding: 16,
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>UTC Date</div>
                  <div style={{ fontSize: 24, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
                    {now.utc}
                  </div>
                </div>
                <Btn variant="accent" size="md" onClick={useNow} style={{ marginTop: 12, width: '100%' }}>
                  <Zap size={14} />
                  <span>Use Current Timestamp</span>
                </Btn>
              </Panel>
            )}

            {/* Input Panel */}
            <Panel title="Convert Timestamp">
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="ui-input"
                  value={input}
                  onChange={e => { setInput(e.target.value); convert(e.target.value); }}
                  placeholder="Enter Unix (sec or ms)..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <Btn variant="primary" onClick={() => convert(input)}>Convert</Btn>
              </div>
              {error && <Alert type="error" message={error} style={{ marginTop: 12 }} />}
            </Panel>

            <Panel title="Common Presets" style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
    </div>
  );
}
