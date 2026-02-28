import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Panel, Btn, CopyBtn, Toggle, CodeArea, ToolHeader, Tabs, Alert, Select, ToolLayout, TextInput
} from '../components/ui';
import { API } from '../lib';
import { Hash, Trash2, Upload, Zap, FileText, ShieldCheck, Lock } from 'lucide-react';

const ALGORITHMS = [
    { id: 'md5', label: 'MD5', bits: 128 },
    { id: 'sha1', label: 'SHA-1', bits: 160 },
    { id: 'sha256', label: 'SHA-256', bits: 256 },
    { id: 'sha384', label: 'SHA-384', bits: 384 },
    { id: 'sha512', label: 'SHA-512', bits: 512 },
];

const OUTPUT_FORMATS = [
    { value: 'hex', label: 'Hexadecimal' },
    { value: 'base64', label: 'Base64' },
    { value: 'upper-hex', label: 'Uppercase Hex' },
];

export default function HashTool() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState({});
    const [hmacMode, setHmacMode] = useState(false);
    const [hmacKey, setHmacKey] = useState('');
    const [format, setFormat] = useState('hex');
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('text');
    const fileInputRef = useRef(null);

    const computeHashes = useCallback(async (val, key, isHmac, fmt, isFileData) => {
        if (!val && !isFileData) {
            setHashes({});
            setError('');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await API.hashAll(val, isHmac ? key : '', fmt);
            if (result.error) {
                setError(result.error);
                setHashes({});
            } else {
                setHashes(result.hashes || {});
                setError('');
            }
        } catch (err) {
            setError(String(err));
            setHashes({});
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleInput = (val) => {
        setInput(val);
        computeHashes(val, hmacKey, hmacMode, format, false);
    };

    const handleHmacKeyChange = (val) => {
        setHmacKey(val);
        if (input) computeHashes(input, val, hmacMode, format, false);
    };

    const handleFormatChange = (val) => {
        setFormat(val);
        if (input) computeHashes(input, hmacKey, hmacMode, val, false);
    };

    const handleHmacToggle = (val) => {
        setHmacMode(val);
        if (input) computeHashes(input, hmacKey, val, format, false);
    };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setIsProcessing(true);
        try {
            // Use arrayBuffer() so binary files (zip, png, etc.) are hashed
            // correctly — file.text() would corrupt non-UTF-8 bytes.
            const buf = await file.arrayBuffer();
            // Store a human-readable label in input state for display purposes
            setInput(`[Binary file: ${file.name}, ${file.size} bytes]`);
            computeHashes(buf, hmacKey, hmacMode, format, true);
        } catch (err) {
            setError('Failed to read file: ' + err.message);
        }
    };

    const handleClear = () => {
        setInput('');
        setHashes({});
        setError('');
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSample = (text) => {
        setInput(text);
        setActiveTab('text');
        computeHashes(text, hmacKey, hmacMode, format, false);
    };

    // Drag & drop
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setFileName(file.name);
            setActiveTab('file');
            try {
                const buf = await file.arrayBuffer();
                setInput(`[Binary file: ${file.name}, ${file.size} bytes]`);
                computeHashes(buf, hmacKey, hmacMode, format, true);
            } catch (err) {
                setError('Failed to read file: ' + err.message);
            }
        }
    };

    const hasOutput = Object.keys(hashes).length > 0;

    return (
        <ToolLayout
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            {/* Drag overlay */}
            {isDragOver && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        padding: '32px 48px',
                        border: '2px dashed var(--accent)',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent)', fontSize: 14, fontWeight: 600,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
                    }}>
                        <Upload size={36} />
                        Drop file to hash
                    </div>
                </div>
            )}

            <ToolHeader>
                <Tabs
                    tabs={[
                        { id: 'text', label: 'Text Input' },
                        { id: 'file', label: 'File Input' },
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                />

                <Toggle
                    label="HMAC"
                    checked={hmacMode}
                    onChange={handleHmacToggle}
                />

                <Select
                    value={format}
                    onChange={handleFormatChange}
                    options={OUTPUT_FORMATS}
                />

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    <Btn variant="ghost" size="sm" onClick={handleClear} title="Clear all">
                        <Trash2 size={14} />
                        <span>Clear</span>
                    </Btn>
                </div>
            </ToolHeader>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12, flex: 1, minHeight: 0 }}>
                {/* Left: Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* HMAC Key */}
                    {hmacMode && (
                        <Panel title="HMAC Secret Key" accent>
                            <TextInput
                                value={hmacKey}
                                onChange={handleHmacKeyChange}
                                placeholder="Enter secret key..."
                            />
                        </Panel>
                    )}

                    {activeTab === 'text' ? (
                        <Panel
                            title="Input"
                            badge={input ? `${input.length} chars` : null}
                            actions={<CopyBtn text={input} />}
                            style={{ flex: 1 }}
                        >
                            <CodeArea
                                value={input}
                                onChange={handleInput}
                                placeholder="Enter text to hash..."
                            />
                        </Panel>
                    ) : (
                        <Panel title="File" style={{ flex: 1 }}>
                            <div style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', gap: 12, padding: 24,
                                border: '2px dashed var(--border)',
                                background: 'var(--bg-input)',
                                transition: 'all 0.15s ease',
                                cursor: 'pointer'
                            }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFile}
                                    style={{ display: 'none' }}
                                />
                                {fileName ? (
                                    <>
                                        <FileText size={36} style={{ color: 'var(--accent)', opacity: 0.7 }} />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{fileName}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                                            {input.length.toLocaleString()} characters loaded
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={36} style={{ color: 'var(--text-4)', opacity: 0.3 }} />
                                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
                                            Click to select or drag & drop a file
                                        </span>
                                        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                                            Supports any text file
                                        </span>
                                    </>
                                )}
                            </div>
                        </Panel>
                    )}
                </div>

                {/* Right: Hash Output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Panel
                        title="Hash Results"
                        badge={hasOutput ? `${Object.keys(hashes).length} algorithms` : null}
                        success={hasOutput && !error}
                        style={{ flex: 1 }}
                    >
                        {hasOutput ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {ALGORITHMS.map(algo => {
                                    const hashValue = hashes[algo.id] || '';
                                    if (!hashValue) return null;
                                    return (
                                        <div
                                            key={algo.id}
                                            style={{
                                                padding: '10px 12px',
                                                background: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                marginBottom: 4,
                                                transition: 'border-color 0.1s ease',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--accent)40';
                                                e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent)15';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                marginBottom: 6
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <ShieldCheck size={12} style={{ color: 'var(--accent)', opacity: 0.7 }} />
                                                    <span style={{
                                                        fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
                                                        textTransform: 'uppercase', letterSpacing: '0.05em'
                                                    }}>
                                                        {algo.label}
                                                    </span>
                                                    <span style={{
                                                        fontSize: 9, padding: '1px 6px',
                                                        background: 'var(--bg-active)',
                                                        color: 'var(--text-4)', fontFamily: 'var(--font-mono)'
                                                    }}>
                                                        {algo.bits}-bit
                                                    </span>
                                                </div>
                                                <CopyBtn text={hashValue} size="sm" />
                                            </div>
                                            <code style={{
                                                fontSize: 12, color: 'var(--text-1)',
                                                fontFamily: 'var(--font-mono)',
                                                wordBreak: 'break-all', lineHeight: 1.6,
                                                letterSpacing: '0.02em'
                                            }}>
                                                {hashValue}
                                            </code>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', gap: 16, padding: 40, color: 'var(--text-4)'
                            }}>
                                <Hash size={44} opacity={0.1} />
                                <span style={{ fontSize: 13 }}>
                                    {isProcessing ? 'Computing hashes...' : 'Hash results will appear here'}
                                </span>
                            </div>
                        )}
                    </Panel>

                    {/* Hash comparison */}
                    {hasOutput && (
                        <Panel title="Verify Hash">
                            <HashVerifier hashes={hashes} />
                        </Panel>
                    )}
                </div>
            </div>

            {error && <Alert type="error" message={error} />}

            <Panel title="Quick Samples" style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Hello, World!', value: 'Hello, World!' },
                        { label: 'Empty string', value: '' },
                        { label: 'JSON snippet', value: '{"key":"value","num":42}' },
                        { label: 'Lorem ipsum', value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
                        { label: 'Password check', value: 'P@ssw0rd123!' },
                    ].map(sample => (
                        <Btn
                            key={sample.label}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSample(sample.value)}
                        >
                            <Zap size={12} style={{ color: 'var(--accent)' }} />
                            <span>{sample.label}</span>
                        </Btn>
                    ))}
                </div>
            </Panel>
        </ToolLayout>
    );
}

function HashVerifier({ hashes }) {
    const [verifyInput, setVerifyInput] = useState('');
    const trimmed = verifyInput.trim().toLowerCase();

    const allValues = Object.values(hashes).map(h => h.toLowerCase());
    const matched = trimmed && allValues.includes(trimmed);
    const matchedAlgo = trimmed
        ? Object.entries(hashes).find(([, v]) => v.toLowerCase() === trimmed)?.[0]
        : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextInput
                value={verifyInput}
                onChange={setVerifyInput}
                placeholder="Paste a hash to verify..."
                error={trimmed && !matched}
                className={matched ? 'verify-success' : ''}
            />
            {trimmed && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 'var(--r-sm)',
                    background: matched ? 'rgba(62,207,176,0.1)' : 'rgba(247,106,106,0.08)',
                    border: `1px solid ${matched ? 'var(--success)30' : 'var(--danger)30'}`,
                    fontSize: 12, fontWeight: 600,
                    color: matched ? 'var(--success)' : 'var(--danger)'
                }}>
                    {matched ? (
                        <><ShieldCheck size={14} /> Match found — {ALGORITHMS.find(a => a.id === matchedAlgo)?.label || matchedAlgo}</>
                    ) : (
                        <><span style={{ fontWeight: 700 }}>✕</span> No match found</>
                    )}
                </div>
            )}
        </div>
    );
}

