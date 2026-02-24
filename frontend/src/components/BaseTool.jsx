import React, { useState, useCallback, useEffect } from 'react';
import {
    ToolHeader, Panel, SplitPane, CodeArea, Btn, CopyBtn, Tabs, Alert, cn
} from './ui';
import { RefreshCw, Trash2, Zap } from 'lucide-react';

/**
 * BaseTool provides a standard I/O interface for most tools.
 * It handles the input/output state, processing lifecycle, and common actions.
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
    const [activeTab, setActiveTab] = useState(initialTab || (tabs[0]?.id));
    const [input, setInput] = useState(initialInput);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcess = useCallback(async (val, tab) => {
        if (!val.trim()) {
            setOutput('');
            setError('');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await process(val, tab);
            if (typeof result === 'string') {
                setOutput(result);
                setError('');
            } else {
                setOutput(result.output || '');
                setError(result.error || '');
            }
        } catch (err) {
            setError(String(err));
            setOutput('');
        } finally {
            setIsProcessing(false);
        }
    }, [process]);

    // Re-process when tab changes
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        handleProcess(input, newTab);
    };

    const handleInput = (val) => {
        setInput(val);
        handleProcess(val, activeTab);
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
        handleProcess(newInput, newTab);
    };

    // Initial process if initialInput is provided
    useEffect(() => {
        if (initialInput) handleProcess(initialInput, activeTab);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
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
                    >
                        <CodeArea
                            value={input}
                            onChange={handleInput}
                            placeholder={inputPlaceholder}
                            error={!!error && !output}
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
                    >
                        <CodeArea
                            value={output}
                            readOnly
                            placeholder={outputPlaceholder}
                            error={!!error}
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
        </div>
    );
}
