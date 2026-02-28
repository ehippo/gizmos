import React from 'react';
import { cn } from './utils';

export function Panel({ title, children, actions, badge, error, success, className, style = {} }) {
    return (
        <div
            className={cn('ui-panel', className)}
            style={{
                background: 'var(--bg-card)',
                border: `1px solid ${error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                transition: 'border-color 0.2s ease',
                ...style
            }}
        >
            {(title || actions || badge) && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 12px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-panel)',
                    gap: 8,
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--text-3)',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            {title}
                        </span>
                        {badge && (
                            <span style={{
                                fontSize: 9, padding: '1px 6px',
                                background: error ? 'var(--danger-bg)' : success ? 'var(--success-bg)' : 'var(--bg-active)',
                                color: error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--text-3)',
                                borderRadius: 4,
                                border: `1px solid ${error ? 'var(--danger-border)' : success ? 'var(--success-border)' : 'var(--border)'}`,
                                fontFamily: 'var(--font-mono)',
                            }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    {actions && <div style={{ display: 'flex', gap: 6 }}>{actions}</div>}
                </div>
            )}
            <div style={{ padding: 8, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </div>
    );
}
