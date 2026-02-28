import React from 'react';
import { CopyBtn } from './Button';
import { cn } from './utils';

export function StatBadge({ label, value, accent }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', padding: '10px 16px', gap: 2, flex: '1 1 0',
            minWidth: 80
        }}>
            <span style={{
                fontSize: 18,
                fontWeight: 700,
                color: accent ? 'var(--accent)' : 'var(--text-1)',
                fontFamily: 'var(--font-mono)'
            }}>
                {value}
            </span>
            <span style={{
                fontSize: 9,
                color: 'var(--text-4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700
            }}>
                {label}
            </span>
        </div>
    );
}

export function PropertyTable({ children, className }) {
    return (
        <div
            className={cn('ui-property-table', className)}
            style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--border)' }}
        >
            {children}
        </div>
    );
}

/**
 * PropertyRow
 * @param {boolean} [copyable=true] — set to false to suppress the copy button
 */
export function PropertyRow({ label, value, mono = true, accent, danger, success, copyable = true }) {
    const displayValue = value ?? '—';
    const isCopyable = copyable && value != null && value !== '' && value !== '—';
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderBottom: '1px solid var(--border)',
            background: 'var(--bg-card)'
        }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: 120 }}>
                {label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{
                    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
                    fontSize: 13,
                    color: danger ? 'var(--danger)' : success ? 'var(--success)' : accent ? 'var(--accent)' : 'var(--text-1)',
                    fontWeight: (accent || danger || success) ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {displayValue}
                </span>
                {isCopyable && <CopyBtn text={String(value)} size="sm" variant="ghost" />}
            </div>
        </div>
    );
}
