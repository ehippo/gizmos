import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    CodeArea, Btn, CopyBtn, Tabs, Alert, cn, ToolLayout, ToolHeader
} from './ui';
import { RefreshCw } from 'lucide-react';

export default function BaseTool({
    title,
    inputLabel = 'input',
    outputLabel = 'output',
    inputPlaceholder = 'Enter input here...',
    outputPlaceholder = 'Output will appear here...',
    process,
    initialInput = '',
    tabs = [],
    initialTab = '',
    options = null,
    samples = [],
    allowSwap = false,
    onClear,
}) {
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id);
    const [input, setInput] = useState(initialInput);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const debounceRef = useRef(null);
    const callIdRef = useRef(0);

    const scheduleProcess = useCallback((val, tab) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const run = async () => {
            if (!val.trim()) { setOutput(''); setError(''); return; }
            const thisId = ++callIdRef.current;
            setIsProcessing(true);
            try {
                const result = await process(val, tab);
                if (thisId !== callIdRef.current) return;
                if (typeof result === 'string') {
                    setOutput(result); setError('');
                } else {
                    setOutput(result.output || ''); setError(result.error || '');
                }
            } catch (err) {
                if (thisId !== callIdRef.current) return;
                setError(String(err)); setOutput('');
            } finally {
                if (thisId === callIdRef.current) setIsProcessing(false);
            }
        };
        debounceRef.current = setTimeout(run, 0);
    }, [process]);

    useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        scheduleProcess(input, newTab);
    };

    const handleInput = (val) => {
        setInput(val);
        scheduleProcess(val, activeTab);
    };

    const handleClear = () => {
        setInput(''); setOutput(''); setError(''); onClear?.();
    };

    const handleSwap = () => {
        if (!allowSwap) return;
        const newTab = tabs.find(t => t.id !== activeTab)?.id || activeTab;
        const newInput = output;
        setActiveTab(newTab);
        setInput(newInput);
        scheduleProcess(newInput, newTab);
    };

    useEffect(() => {
        if (initialInput) {
            const tab = initialTab || tabs[0]?.id;
            scheduleProcess(initialInput, tab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToolLayout>
            {/* ── Toolbar row ── */}
            <ToolHeader>
                {tabs.length > 0 && (
                    <Tabs tabs={tabs} active={activeTab} onChange={handleTabChange} />
                )}
                {options}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    {allowSwap && (
                        <Btn variant="ghost" size="sm" onClick={handleSwap} title="Swap input ↔ output">
                            <RefreshCw size={12} />
                            <span>Swap</span>
                        </Btn>
                    )}
                    <Btn variant="ghost" size="sm" onClick={handleClear} title="Clear">
                        Clear
                    </Btn>
                </div>
            </ToolHeader>

            {/* ── Input pane ── */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4
                }}>
                    <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
                        // {inputLabel}
                    </span>
                    <div style={{ marginLeft: 'auto' }}>
                        <CopyBtn text={input} />
                    </div>
                </div>
                <CodeArea
                    value={input}
                    onChange={handleInput}
                    placeholder={inputPlaceholder}
                    error={!!error && !output}
                    style={{ flex: 1, minHeight: 0 }}
                />
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: 'var(--border)', flexShrink: 0 }} />

            {/* ── Output pane ── */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4
                }}>
                    <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
                        // {outputLabel}
                    </span>
                    {output && !error && (
                        <span style={{
                            fontSize: 10, padding: '0px 5px',
                            color: 'var(--text-4)', border: '1px solid var(--border)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            {output.length} chars
                        </span>
                    )}
                    {error && (
                        <span style={{
                            fontSize: 10, padding: '0px 5px',
                            color: 'var(--danger)', border: '1px solid var(--danger-border)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            error
                        </span>
                    )}
                    <div style={{ marginLeft: 'auto' }}>
                        <CopyBtn text={output} />
                    </div>
                </div>
                <CodeArea
                    value={error || output}
                    readOnly
                    placeholder={outputPlaceholder}
                    error={!!error}
                    style={{
                        flex: 1, minHeight: 0,
                        color: error ? 'var(--danger)' : 'var(--output-text)',
                    }}
                />
            </div>

            {/* ── Samples ── */}
            {samples.length > 0 && (
                <div style={{
                    display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0,
                    paddingTop: 6, borderTop: '1px solid var(--border)',
                    alignItems: 'center',
                }}>
                    <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
                        samples:
                    </span>
                    {samples.map(sample => (
                        <Btn
                            key={sample.label}
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                if (sample.tab) handleTabChange(sample.tab);
                                handleInput(sample.value);
                            }}
                        >
                            {sample.label}
                        </Btn>
                    ))}
                </div>
            )}
        </ToolLayout>
    );
}
