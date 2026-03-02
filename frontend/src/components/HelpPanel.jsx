import React from 'react';
import { Info, X } from 'lucide-react';

export default function HelpPanel({ active, setHelpOpen }) {
    if (!active?.help) return null;

    return (
        <div style={{
            padding: '10px 20px',
            background: 'var(--info-bg)',
            borderBottom: '1px solid var(--info-border)',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            animation: 'fadeIn 0.15s ease',
        }}>
            <Info size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, flex: 1 }}>
                {active.help}
            </p>
            <button
                onClick={() => setHelpOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 2, lineHeight: 1 }}
                aria-label="Close help"
            >
                <X size={14} />
            </button>
        </div>
    );
}
