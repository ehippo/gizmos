import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    ToolHeader, Panel, SplitPane, CodeArea, Btn, CopyBtn, Tabs, Alert, cn, ToolLayout
} from './ui';
import { RefreshCw, Trash2, Zap } from 'lucide-react';

/**
 * BaseTool provides a standard I/O interface for most tools.
 *
 * Fixes applied:
 *  - Debounced processing (200ms) prevents race conditions on fast input.
 *  - handleProcess is NOT memoised with useCallback so it always closes
 *    over the latest input / activeTab.
 *  - Initial-process effect passes the stable initial values directly,
 *    avoiding a stale-closure dependency on state.
 *  - Tab-switch correctly passes the new tab before calling process.
 */
export default function BaseTool({
    title,
    inputLabel = 'Input',
    outputLabel = 'Output',
    inputPlaceholder = 'Enter input here...',
    outputPlaceholder = 'Output will appear here...',
    process, // (input, options) => Promise<string | {output, error, success}>
    initialInput = '',
    tabs = [], // [{id, label}]
    initialTab = '',
    options = null, // React elements for the header
    samples = [], // [{label, value, tab}]
    allowSwap = false,
    onClear,
}) {
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id);
    const [input, setInput] = useState(initialInput);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Debounce timer ref — cancels any in-flight scheduled call.
    const debounceRef = useRef(null);
    // Monotonically-increasing call counter — lets us discard stale results.
    const callIdRef = useRef(0);

    /**
     * Schedule a process call with debounce. Any previously-pending call for
     * the same BaseTool instance is cancelled first.
     */
    const scheduleProcess = useCallback((val, tab, immediate = false) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const run = async () => {
            if (!val.trim()) {
                setOutput('');
                setError('');
                return;
            }
            // Grab a snapshot id before the await.
            const thisId = ++callIdRef.current;
            setIsProcessing(true);
            try {
                const result = await process(val, tab);
                // Discard result if a newer call has already been dispatched.
                if (thisId !== callIdRef.current) return;
                if (typeof result === 'string') {
                    setOutput(result);
                    setError('');
                } else {
                    setOutput(result.output || '');
                    setError(result.error || '');
                }
            } catch (err) {
                if (thisId !== callIdRef.current) return;
                setError(String(err));
                setOutput('');
            } finally {
                if (thisId === callIdRef.current) setIsProcessing(false);
            }
        };

        debounceRef.current = setTimeout(run, 0);
    }, [process]);

    // Clean up any pending debounce on unmount.
    useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

    // Re-process when tab changes — pass the new tab explicitly.
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        scheduleProcess(input, newTab, true);
    };

    const handleInput = (val) => {
        setInput(val);
        scheduleProcess(val, activeTab);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError('');
        onClear?.();
    };

    const handleSwap = () => {
        if (!allowSwap) return;
        const newTab = tabs.find(t => t.id !== activeTab)?.id || activeTab;
        const newInput = output;
        setActiveTab(newTab);
        setInput(newInput);
        scheduleProcess(newInput, newTab, true);
    };

    // Initial process — pass stable initial values directly, no state dependency.
    useEffect(() => {
        if (initialInput) {
            const tab = initialTab || tabs[0]?.id;
            scheduleProcess(initialInput, tab, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally run once on mount only

    return (
        <ToolLayout>
            <ToolHeader>
                {tabs.length > 0 && (
                    <Tabs tabs={tabs} active={activeTab} onChange={handleTabChange} />
                )}

                {options}

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    {allowSwap && (
                        <Btn variant="ghost" size="sm" onClick={handleSwap} title="Swap input and output">
                            <RefreshCw size={14} />
                            <span>Swap</span>
                        </Btn>
                    )}
                    <Btn variant="ghost" size="sm" onClick={handleClear} title="Clear all">
                        <Trash2 size={14} />
                        <span>Clear</span>
                    </Btn>
                </div>
            </ToolHeader>

            <SplitPane
                left={
                    <Panel
                        title={inputLabel}
                        actions={<CopyBtn text={input} />}
                        error={!!error && !output}
                        style={{ flex: 1 }}
                    >
                        <CodeArea
                            value={input}
                            onChange={handleInput}
                            placeholder={inputPlaceholder}
                            error={!!error && !output}
                            style={{ flex: 1 }}
                        />
                    </Panel>
                }
                right={
                    <Panel
                        title={outputLabel}
                        badge={output ? `${output.length} characters` : null}
                        actions={<CopyBtn text={output} />}
                        success={!!output && !error}
                        error={!!error}
                        style={{ flex: 1 }}
                    >
                        <CodeArea
                            value={output}
                            readOnly
                            placeholder={outputPlaceholder}
                            error={!!error}
                            style={{ flex: 1 }}
                        />
                    </Panel>
                }
            />

            {error && <Alert type="error" message={error} />}

            {samples.length > 0 && (
                <Panel title="Quick Samples" style={{ flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {samples.map(sample => (
                            <Btn
                                key={sample.label}
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    if (sample.tab) setActiveTab(sample.tab);
                                    handleInput(sample.value);
                                }}
                            >
                                <Zap size={12} style={{ color: 'var(--accent)' }} />
                                <span>{sample.label}</span>
                            </Btn>
                        ))}
                    </div>
                </Panel>
            )}
        </ToolLayout>
    );
}
