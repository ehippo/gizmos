import React from 'react';
import { cn } from './utils';

export function Panel({ title, children, actions, badge, error, success, className, style = {} }) {
    return (
        <div
            className={cn('ui-panel', className)}
            style={{
                background: 'var(--bg-base)',
                border: `1px solid ${error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                transition: 'border-color 0.15s ease',
                ...style
            }}
        >
            {(title || actions || badge) && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '3px 8px',
                    borderBottom: `1px solid ${error ? 'var(--danger-border)' : success ? 'var(--success-border)' : 'var(--border)'}`,
                    background: 'var(--bg-panel)',
                    gap: 6,
                    flexShrink: 0,
                    height: 26,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                            fontSize: 11,
                            fontWeight: 400,
                            color: 'var(--text-4)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            // {title?.toLowerCase()}
                        </span>
                        {badge && (
                            <span style={{
                                fontSize: 10, padding: '0px 5px',
                                background: 'transparent',
                                color: error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--text-4)',
                                border: `1px solid ${error ? 'var(--danger-border)' : success ? 'var(--success-border)' : 'var(--border)'}`,
                                fontFamily: 'var(--font-mono)',
                            }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    {actions && <div style={{ display: 'flex', gap: 4 }}>{actions}</div>}
                </div>
            )}
            <div style={{ padding: '6px 8px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </div>
    );
}
