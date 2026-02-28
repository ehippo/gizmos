import React, { useState, useMemo } from 'react';
import { Panel, Btn, CopyBtn, ToolHeader, SplitPane, Alert, CodeArea, ToolLayout } from '../components/ui';
import { FileDiff, Trash2, ArrowRightLeft } from 'lucide-react';

// Word-level diff helper
function wordDiff(a, b) {
  const aWords = a.split(/(\s+)/);
  const bWords = b.split(/(\s+)/);
  const m = aWords.length, n = bWords.length;
  const cap = Math.min(m, n, 40);
  const dp = Array.from({ length: cap + 1 }, () => new Array(cap + 1).fill(0));
  const aSlice = aWords.slice(0, cap);
  const bSlice = bWords.slice(0, cap);
  for (let i = 1; i <= cap; i++)
    for (let j = 1; j <= cap; j++)
      dp[i][j] = aSlice[i - 1] === bSlice[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const aResult = [], bResult = [];
  let i = Math.min(m, cap), j = Math.min(n, cap);
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aSlice[i - 1] === bSlice[j - 1]) {
      aResult.unshift({ text: aSlice[i - 1], changed: false });
      bResult.unshift({ text: bSlice[j - 1], changed: false });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      bResult.unshift({ text: bSlice[j - 1], changed: true });
      j--;
    } else {
      aResult.unshift({ text: aSlice[i - 1], changed: true });
      i--;
    }
  }
  if (m > cap) aResult.push({ text: aWords.slice(cap).join(''), changed: true });
  if (n > cap) bResult.push({ text: bWords.slice(cap).join(''), changed: true });
  return { aResult, bResult };
}

function lineDiff(leftLines, rightLines) {
  const m = Math.min(leftLines.length, 500);
  const n = Math.min(rightLines.length, 500);
  const a = leftLines.slice(0, m);
  const b = rightLines.slice(0, n);
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: 'equal', left: a[i - 1], right: b[j - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'added', left: null, right: b[j - 1] });
      j--;
    } else {
      ops.unshift({ type: 'removed', left: a[i - 1], right: null });
      i--;
    }
  }
  const result = [];
  let k = 0;
  while (k < ops.length) {
    const op = ops[k];
    if (op.type === 'removed' && k + 1 < ops.length && ops[k + 1].type === 'added') {
      result.push({ type: 'modified', left: op.left, right: ops[k + 1].right });
      k += 2;
    } else {
      result.push(op);
      k++;
    }
  }
  return result;
}

const InlineSpans = ({ parts, highlight }) => (
  <span>
    {parts.map((p, i) =>
      p.changed ? (
        <mark key={i} style={{ background: highlight, borderRadius: 2, color: 'inherit', padding: '0 1px' }}>{p.text}</mark>
      ) : <span key={i}>{p.text}</span>
    )}
  </span>
);

const LineNum = ({ n, color }) => (
  <span style={{
    minWidth: 42, textAlign: 'right', padding: '2px 10px', fontSize: 11,
    color: color || 'var(--text-4)', background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)', userSelect: 'none', flexShrink: 0,
    fontFamily: 'var(--font-mono)'
  }}>
    {n ?? ''}
  </span>
);

export default function DiffTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = useMemo(() => {
    if (!left && !right) return [];
    return lineDiff(left.split('\n'), right.split('\n'));
  }, [left, right]);

  const stats = useMemo(() => diff.reduce((acc, d) => {
    if (d.type === 'added') acc.added++;
    else if (d.type === 'removed') acc.removed++;
    else if (d.type === 'modified') acc.modified++;
    else acc.equal++;
    return acc;
  }, { added: 0, removed: 0, modified: 0, equal: 0 }), [diff]);

  const lNums = useMemo(() => { let n = 0; return diff.map(d => d.type === 'added' ? null : ++n); }, [diff]);
  const rNums = useMemo(() => { let n = 0; return diff.map(d => d.type === 'removed' ? null : ++n); }, [diff]);

  return (
    <ToolLayout>
      <ToolHeader>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {stats.added > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>+{stats.added} added</span>}
          {stats.removed > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)' }}>−{stats.removed} removed</span>}
          {stats.modified > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--warning)' }}>~{stats.modified} modified</span>}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Btn variant="ghost" size="sm" onClick={() => { const t = left; setLeft(right); setRight(t); }} title="Swap sides">
            <ArrowRightLeft size={14} />
            <span>Swap</span>
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setLeft(''); setRight(''); }}>
            <Trash2 size={14} />
            <span>Clear</span>
          </Btn>
        </div>
      </ToolHeader>

      <SplitPane
        left={
          <Panel title="Original" actions={<CopyBtn text={left} />}>
            <CodeArea
              value={left} onChange={setLeft} placeholder="Paste original text..."
              style={{ flex: 1 }}
            />
          </Panel>
        }
        right={
          <Panel title="Modified" actions={<CopyBtn text={right} />}>
            <CodeArea
              value={right} onChange={setRight} placeholder="Paste modified text..."
              style={{ flex: 1 }}
            />
          </Panel>
        }
      />

      {diff.length > 0 && (
        <Panel title="Difference Viewer" style={{ flex: 2 }}>
          <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-4)' }}>
              <div style={{ padding: '6px 48px', borderRight: '1px solid var(--border)' }}>Original Side</div>
              <div style={{ padding: '6px 48px' }}>Modified Side</div>
            </div>
            {/* Content */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}>
              {diff.map((d, i) => {
                const ln = lNums[i], rn = rNums[i];
                const bgL = d.type === 'removed' || d.type === 'modified' ? 'rgba(247,106,106,0.1)' : undefined;
                const bgR = d.type === 'added' || d.type === 'modified' ? 'rgba(62,207,176,0.1)' : undefined;

                if (d.type === 'modified') {
                  const { aResult, bResult } = wordDiff(d.left, d.right);
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)10' }}>
                      <div style={{ display: 'flex', background: bgL, borderRight: '1px solid var(--border)' }}>
                        <LineNum n={ln} color="var(--danger)" />
                        <span style={{ padding: '2px 10px', whiteSpace: 'pre-wrap', color: 'var(--text-1)' }}><InlineSpans parts={aResult} highlight="rgba(247,106,106,0.3)" /></span>
                      </div>
                      <div style={{ display: 'flex', background: bgR }}>
                        <LineNum n={rn} color="var(--success)" />
                        <span style={{ padding: '2px 10px', whiteSpace: 'pre-wrap', color: 'var(--text-1)' }}><InlineSpans parts={bResult} highlight="rgba(62,207,176,0.3)" /></span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)10' }}>
                    <div style={{ display: 'flex', background: bgL, borderRight: '1px solid var(--border)', opacity: d.type === 'added' ? 0.3 : 1 }}>
                      <LineNum n={ln} color={d.type === 'removed' ? 'var(--danger)' : undefined} />
                      <span style={{ padding: '2px 10px', whiteSpace: 'pre-wrap', color: 'var(--text-1)' }}>{d.left || ' '}</span>
                    </div>
                    <div style={{ display: 'flex', background: bgR, opacity: d.type === 'removed' ? 0.3 : 1 }}>
                      <LineNum n={rn} color={d.type === 'added' ? 'var(--success)' : undefined} />
                      <span style={{ padding: '2px 10px', whiteSpace: 'pre-wrap', color: 'var(--text-1)' }}>{d.right || ' '}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      )}
    </ToolLayout>
  );
}
