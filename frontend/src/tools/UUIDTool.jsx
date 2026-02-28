import React, { useState, useEffect } from 'react';
import {
  Panel, Btn, CopyBtn, Alert, ToolHeader, ToolGrid, Select, PropertyTable, PropertyRow
} from '../components/ui';
import { API } from '../lib';
import { Box, RefreshCw, CheckCircle2, ListFilter, ClipboardList } from 'lucide-react';

export default function UUIDTool() {
  const [uuid, setUuid] = useState('');
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(10);
  const [validateInput, setValidateInput] = useState('');
  const [isValid, setIsValid] = useState(null);

  const gen = async () => {
    const u = await API.generateUUID();
    setUuid(u);
  };

  const genBulk = async () => {
    const list = await API.generateUUIDs(count);
    setUuids(list);
  };

  const validate = async (val) => {
    setValidateInput(val);
    if (!val.trim()) { setIsValid(null); return; }
    const v = await API.validateUUID(val.trim());
    setIsValid(v);
  };

  useEffect(() => { gen(); }, []);

  const parts = uuid ? uuid.split('-') : [];
  const partLabels = ['time_low', 'time_mid', 'time_hi', 'clock_seq', 'node'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <ToolHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', fontSize: 13, fontWeight: 600 }}>
          <Box size={16} />
          <span>UUID v4 Generator</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="ghost" size="sm" onClick={() => { setUuids([]); setValidateInput(''); setIsValid(null); }}>
            Clear Workspace
          </Btn>
        </div>
      </ToolHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Left column: Single & Validate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Single Generator" accent>
            <div style={{
              padding: '24px 16px', background: 'var(--bg-input)', borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
            }}>
              <code style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.02em', textAlign: 'center', wordBreak: 'break-all' }}>
                {uuid}
              </code>
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <Btn variant="primary" onClick={gen} style={{ flex: 1 }}>
                  <RefreshCw size={14} />
                  <span>Generate New</span>
                </Btn>
                <CopyBtn text={uuid} variant="secondary" />
              </div>
            </div>

            {/* Structure Breakdown */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', marginBottom: 8 }}>Internal Structure</div>
              <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {parts.map((p, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{
                      padding: '2px 8px', borderRadius: 4, background: 'var(--bg-active)',
                      border: '1px solid var(--border)', fontSize: 11, fontFamily: 'var(--font-mono)'
                    }}>
                      {p}
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--text-4)', textAlign: 'center' }}>{partLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Validator" error={isValid === false} success={isValid === true}>
            <input
              type="text"
              value={validateInput}
              onChange={e => validate(e.target.value)}
              placeholder="Paste UUID to validate..."
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14,
                fontFamily: 'var(--font-mono)', background: 'var(--bg-input)',
                border: `1px solid ${isValid === null ? 'var(--border)' : isValid ? 'var(--success)' : 'var(--danger)'}`,
                color: 'var(--text-1)', outline: 'none'
              }}
            />
            {isValid !== null && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: isValid ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                {isValid ? <CheckCircle2 size={14} /> : '✗'}
                {isValid ? 'This is a valid RFC-compliant UUID' : 'Invalid UUID format'}
              </div>
            )}
          </Panel>
        </div>

        {/* Right column: Bulk */}
        <Panel title="Bulk Generator" style={{ flex: 1 }}>
          <ToolHeader style={{ marginBottom: 12 }}>
            <Select
              value={count}
              onChange={v => setCount(Number(v))}
              options={[
                { value: 5, label: '5 items' },
                { value: 10, label: '10 items' },
                { value: 50, label: '50 items' },
                { value: 100, label: '100 items' },
              ]}
            />
            <Btn variant="accent" onClick={genBulk}>
              <ListFilter size={14} />
              <span>Generate Bulk</span>
            </Btn>
            {uuids.length > 0 && (
              <Btn variant="ghost" size="sm" onClick={() => {
                navigator.clipboard.writeText(uuids.join('\n'));
              }}>
                <ClipboardList size={14} />
                <span>Copy All</span>
              </Btn>
            )}
          </ToolHeader>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column' }}>
            {uuids.length > 0 ? (
              uuids.map((u, i) => (
                <div key={i} style={{
                  padding: '8px 12px', borderBottom: '1px solid var(--border)08',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: i % 2 === 0 ? 'transparent' : 'var(--bg-input)40'
                }}>
                  <span style={{ fontSize: 10, color: 'var(--text-4)', width: 24, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                  <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{u}</code>
                  <CopyBtn text={u} size="sm" variant="ghost" />
                </div>
              ))
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', flexDirection: 'column', gap: 12, padding: 40 }}>
                <Box size={40} opacity={0.1} />
                <span style={{ fontSize: 13 }}>Generate multiple UUIDs at once</span>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
