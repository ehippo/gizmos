import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from './utils';

export function Btn({ children, onClick, variant = 'secondary', size = 'md', disabled, className, style = {}, title }) {
    const variants = {
        primary: { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
        secondary: { background: 'var(--bg-input)', color: 'var(--text-2)', border: '1px solid var(--border)' },
        ghost: { background: 'transparent', color: 'var(--text-3)', border: '1px solid transparent' },
        danger: { background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger-border)' },
        success: { background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' },
        accent: { background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--info-border)' },
    };
    const sizes = {
        sm: { padding: '4px 10px', fontSize: 11, borderRadius: 6 },
        md: { padding: '6px 14px', fontSize: 12, borderRadius: 8 },
        lg: { padding: '10px 20px', fontSize: 13, borderRadius: 10 },
        icon: { padding: '6px', borderRadius: '50%' },
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn('ui-btn', variant === 'ghost' && 'ui-btn--ghost', className)}
            style={{
                ...variants[variant], ...sizes[size],
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                ...style
            }}
        >
            {children}
        </button>
    );
}

export function CopyBtn({ text, size = 'sm', variant = 'ghost' }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };
    return (
        <Btn variant={copied ? 'success' : variant} size={size} onClick={copy} title="Copy to clipboard">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span style={{ marginLeft: 2 }}>{copied ? 'Copied' : 'Copy'}</span>
        </Btn>
    );
}
