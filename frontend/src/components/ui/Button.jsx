import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from './utils';

export function Btn({ children, onClick, variant = 'secondary', size = 'md', disabled, className, style = {}, title }) {
    const variants = {
        primary:   { background: 'var(--accent)',      color: '#ffffff',          border: '1px solid var(--accent)' },
        secondary: { background: 'var(--bg-card)',     color: 'var(--text-2)',    border: '1px solid var(--border)' },
        ghost:     { background: 'transparent',        color: 'var(--text-3)',    border: '1px solid transparent' },
        danger:    { background: 'var(--danger-bg)',   color: 'var(--danger)',    border: '1px solid var(--danger-border)' },
        success:   { background: 'var(--success-bg)',  color: 'var(--success)',   border: '1px solid var(--success-border)' },
        accent:    { background: 'var(--accent-glow)', color: 'var(--accent)',    border: '1px solid var(--info-border)' },
    };
    const sizes = {
        sm:   { padding: '2px 8px',   fontSize: 11, borderRadius: 'var(--r-sm)', height: 22 },
        md:   { padding: '4px 10px',  fontSize: 12, borderRadius: 'var(--r-sm)', height: 26 },
        lg:   { padding: '6px 14px',  fontSize: 13, borderRadius: 'var(--r-sm)', height: 30 },
        icon: { padding: '4px 5px',   borderRadius: 'var(--r-sm)' },
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
                opacity: disabled ? 0.45 : 1,
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
            setTimeout(() => setCopied(false), 1800);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };
    return (
        <Btn variant={copied ? 'success' : variant} size={size} onClick={copy} title="Copy to clipboard">
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span>{copied ? 'copied' : 'copy'}</span>
        </Btn>
    );
}
