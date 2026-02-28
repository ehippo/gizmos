import React, { useState, useEffect } from 'react';
import {
  Panel, CodeArea, Btn, CopyBtn, StatBadge, ToolHeader, ToolGrid
} from '../components/ui';
import { API } from '../lib';
import { Type, History, Trash2, ArrowRightLeft, Layers } from 'lucide-react';

const TRANSFORMS = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'reverse', label: 'esreveR' },
  { id: 'trim', label: 'Trim Lines' },
];

export default function TextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState(null);
  const [activeTransform, setActiveTransform] = useState(null);

  useEffect(() => {
    const analyze = async () => {
      if (!input) { setStats(null); return; }
      const s = await API.textAnalyze(input);
      setStats(s);
    };
    const t = setTimeout(analyze, 200);
    return () => clearTimeout(t);
  }, [input]);

  const transform = async (id) => {
    setActiveTransform(id);
    if (!input) return;
    const result = await API.textTransform(input, id);
    setOutput(result);
  };

  const swap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {/* Header with Stats */}
      <ToolHeader>
        {stats ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <StatBadge label="Chars" value={stats.characters} accent />
            <StatBadge label="Words" value={stats.words} />
            <StatBadge label="Lines" value={stats.lines} />
            <StatBadge label="Sentences" value={stats.sentences} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-4)', fontSize: 12 }}>
            <Type size={14} />
            <span>Analysis will appear here</span>
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" onClick={swap} title="Swap input and output">
            <ArrowRightLeft size={14} />
            <span>Swap</span>
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); setStats(null); setActiveTransform(null); }}>
            <Trash2 size={14} />
            <span>Clear All</span>
          </Btn>
        </div>
      </ToolHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Left column: Input & Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Input Text" actions={<CopyBtn text={input} />}>
            <CodeArea value={input} onChange={setInput} placeholder="Type or paste text here..." />
          </Panel>
          <Panel title="Processed Output" actions={<CopyBtn text={output} />} success={!!output}>
            <CodeArea value={output} readOnly placeholder="Transformed output..." />
          </Panel>
        </div>

        {/* Right column: Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Text Transforms" accent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TRANSFORMS.map(t => (
                <Btn
                  key={t.id}
                  variant={activeTransform === t.id ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => transform(t.id)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 11, justifyContent: 'flex-start' }}
                >
                  <History size={12} opacity={0.5} />
                  {t.label}
                </Btn>
              ))}
            </div>
          </Panel>

          <Panel title="List Operations">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'sort-az', label: 'Sort Lines A→Z', fn: (t) => t.split('\n').filter(l => l).sort((a, b) => a.localeCompare(b)).join('\n') },
                { id: 'sort-za', label: 'Sort Lines Z→A', fn: (t) => t.split('\n').filter(l => l).sort((a, b) => b.localeCompare(a)).join('\n') },
                { id: 'dedupe', label: 'Deduplicate Lines', fn: (t) => [...new Set(t.split('\n'))].join('\n') },
                { id: 'compact', label: 'Remove Empty Lines', fn: (t) => t.split('\n').filter(l => l.trim()).join('\n') },
                { id: 'number', label: 'Line Numbering', fn: (t) => t.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n') },
              ].map(op => (
                <Btn
                  key={op.id}
                  variant={activeTransform === op.id ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    if (!input) return;
                    const res = op.fn(input);
                    setOutput(res);
                    setActiveTransform(op.id);
                  }}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Layers size={12} opacity={0.5} />
                  {op.label}
                </Btn>
              ))}
            </div>
          </Panel>

          {stats && stats.uniqueWords > 0 && (
            <Panel title="Advanced Info">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-3)' }}>Unique Words</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{stats.uniqueWords}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-3)' }}>Avg. Word Length</span>
                  <span style={{ fontWeight: 700 }}>{(stats.characters / stats.words || 0).toFixed(1)}</span>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
