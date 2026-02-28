import React, { useState, useMemo } from 'react';
import {
  Panel, Btn, CopyBtn, ToolHeader, SplitPane, ToolGrid, PropertyTable, PropertyRow, TextInput, ToolLayout
} from '../components/ui';
import { Timer, Wand2, CalendarDays, History, Info } from 'lucide-react';

const TEMPLATES = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every 6 hours', cron: '0 */6 * * *' },
  { label: 'Daily at midnight', cron: '0 0 * * *' },
  { label: 'Weekly (Mon 0:00)', cron: '0 0 * * 1' },
  { label: 'Monthly (1st 0:00)', cron: '0 0 1 * *' },
  { label: 'Weekdays 9:00', cron: '0 9 * * 1-5' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parsePart(part, max) {
  if (part === '*') return new Set(Array.from({ length: max + 1 }, (_, i) => i));
  const result = new Set();
  for (const chunk of part.split(',')) {
    if (chunk.includes('/')) {
      const [range, step] = chunk.split('/');
      const s = parseInt(step);
      const start = range === '*' ? 0 : parseInt(range.split('-')[0]);
      const end = range === '*' ? max : parseInt(range.split('-')[1] || max);
      for (let i = start; i <= end; i += s) result.add(i);
    } else if (chunk.includes('-')) {
      const [a, b] = chunk.split('-').map(Number);
      if (!isNaN(a) && !isNaN(b)) for (let i = a; i <= b; i++) result.add(i);
    } else {
      const n = parseInt(chunk);
      if (!isNaN(n)) result.add(n);
    }
  }
  return result;
}

function cronDescription(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression';
  const [min, hour, dom, month, dow] = parts;

  let desc = 'Runs ';
  if (expr === '* * * * *') return 'Runs every minute';
  if (min.startsWith('*/')) desc += `every ${min.slice(2)} min`;
  else if (min === '*') desc += 'every min';
  else desc += `at min ${min}`;

  if (hour.startsWith('*/')) desc += `, every ${hour.slice(2)} hrs`;
  else if (hour !== '*') desc += `, hour ${hour}`;

  if (dom !== '*') desc += `, day ${dom}`;
  if (month !== '*') {
    const mIdx = parseInt(month) - 1;
    desc += `, in ${MONTHS[mIdx] || month}`;
  }
  if (dow !== '*') {
    const days = dow.split(',').map(d => DAYS[parseInt(d)] || d);
    desc += `, on ${days.join(', ')}`;
  }
  return desc;
}

function getNextRuns(expr, count = 5) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  try {
    const [min, hour, dom, month, dow] = parts;
    const mins = parsePart(min, 59);
    const hours = parsePart(hour, 23);
    const doms = parsePart(dom, 31);
    const months = parsePart(month, 12);
    const dows = parsePart(dow, 6);

    const results = [];
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);

    for (let i = 0; i < 2000 && results.length < count; i++) {
      const m = d.getMonth() + 1;
      const wd = d.getDay();
      if (months.has(m) && doms.has(d.getDate()) && dows.has(wd) && hours.has(d.getHours()) && mins.has(d.getMinutes())) {
        results.push(new Date(d));
      }
      d.setMinutes(d.getMinutes() + 1);
    }
    return results;
  } catch { return []; }
}

export default function CronTool() {
  const [expr, setExpr] = useState('0 9 * * 1-5');

  const desc = useMemo(() => cronDescription(expr), [expr]);
  const nextRuns = useMemo(() => getNextRuns(expr), [expr]);
  const parts = expr.split(' ');

  const updatePart = (idx, val) => {
    const p = [...parts];
    p[idx] = val || '*';
    setExpr(p.join(' '));
  };

  const PartInput = ({ idx, label, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <TextInput
        label={label}
        value={parts[idx] || '*'}
        onChange={val => updatePart(idx, val)}
        style={{ textAlign: 'center' }}
        className="cron-part-input"
      />
      <span style={{ fontSize: 9, color: 'var(--text-4)', textAlign: 'center' }}>{hint}</span>
    </div>
  );

  return (
    <ToolLayout>
      <ToolHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', fontSize: 13, fontWeight: 700 }}>
          <Timer size={18} />
          <span>Cron Schedule Builder</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="ghost" size="sm" onClick={() => setExpr('* * * * *')}>Reset to Default</Btn>
        </div>
      </ToolHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Main Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Visual Editor" accent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
              <PartInput idx={0} label="Minute" hint="0-59" />
              <PartInput idx={1} label="Hour" hint="0-23" />
              <PartInput idx={2} label="Day" hint="1-31" />
              <PartInput idx={3} label="Month" hint="1-12" />
              <PartInput idx={4} label="Weekday" hint="0-6" />
            </div>

            <div style={{
              background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12
            }}>
              <code style={{ flex: 1, fontSize: 24, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                {expr}
              </code>
              <CopyBtn text={expr} />
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', background: 'var(--bg-panel)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Info size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{desc}</span>
            </div>
          </Panel>

          <Panel title="Common Templates" style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => setExpr(t.cron)}
                  className="template-btn"
                  style={{
                    padding: '12px', textAlign: 'left', borderRadius: 10, border: expr === t.cron ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: expr === t.cron ? 'var(--accent-glow)' : 'var(--bg-card)', transition: 'all 0.15s', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>{t.label}</div>
                  <code style={{ fontSize: 13, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{t.cron}</code>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* Sidebar: Next Executions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Schedule Preview" accent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {nextRuns.length > 0 ? (
                nextRuns.map((d, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', background: i === 0 ? 'var(--bg-active)' : 'transparent',
                    border: '1px solid var(--border)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center'
                  }}>
                    <CalendarDays size={12} style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-4)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? 'var(--text-1)' : 'var(--text-2)' }}>
                        {d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}
                      </span>
                      <span style={{ fontSize: 11, color: i === 0 ? 'var(--accent)' : 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                        {d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-4)', fontSize: 12 }}>Invalid expression or no upcoming runs</div>
              )}
            </div>
          </Panel>

          <Panel title="Cron Syntax Tips">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { sym: '*', desc: 'Wildcard (any value)' },
                { sym: ',', desc: 'Value list (1,3,5)' },
                { sym: '-', desc: 'Range (1-5)' },
                { sym: '/', desc: 'Step values (*/15)' }
              ].map(tip => (
                <div key={tip.sym} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <code style={{ minWidth: 24, fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>{tip.sym}</code>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{tip.desc}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </ToolLayout>
  );
}

