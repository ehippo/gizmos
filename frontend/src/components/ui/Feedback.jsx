import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Info } from 'lucide-react';
import { Btn } from './Button';
import { cn } from './utils';

export function Tooltip({ children, content, side = 'top' }) {
    return (
        <TooltipPrimitive.Provider delayDuration={400}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        sideOffset={5}
                        style={{
                            background: 'var(--bg-panel)',
                            color: 'var(--text-1)',
                            padding: '6px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 500,
                            border: '1px solid var(--border-hi)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            zIndex: 1000,
                            animation: 'fadeIn 0.15s ease'
                        }}
                    >
                        {content}
                        <TooltipPrimitive.Arrow style={{ fill: 'var(--border-hi)' }} />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}

export function Dialog({ trigger, title, children, actions }) {
    return (
        <DialogPrimitive.Root>
            <DialogPrimitive.Trigger asChild>
                {trigger}
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)', zIndex: 1100,
                    animation: 'fadeIn 0.2s ease'
                }} />
                <DialogPrimitive.Content
                    style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '90%', maxWidth: 500, background: 'var(--bg-card)',
                        border: '1px solid var(--border-hi)', borderRadius: 'var(--r-lg)',
                        padding: '24px', boxShadow: 'var(--shadow-xl)', zIndex: 1200,
                        animation: 'fadeIn 0.2s ease', outline: 'none'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <DialogPrimitive.Title style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>
                            {title}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                            <Btn variant="ghost" size="sm">✕</Btn>
                        </DialogPrimitive.Close>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        {children}
                    </div>
                    {actions && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            {actions}
                        </div>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export function Alert({ type = 'error', message, icon }) {
    if (!message) return null;
    const colors = {
        error: { bg: 'var(--danger-bg)', border: 'var(--danger-border)', color: 'var(--danger)' },
        success: { bg: 'var(--success-bg)', border: 'var(--success-border)', color: 'var(--success)' },
        warning: { bg: 'var(--warning-bg)', border: 'var(--warning-border)', color: 'var(--warning)' },
        info: { bg: 'var(--info-bg)', border: 'var(--info-border)', color: 'var(--accent)' },
    };
    const c = colors[type];
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 0,
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderLeft: `3px solid ${c.color}`,
            color: c.color,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            lineHeight: 1.4
        }}>
            {icon || (type === 'error' ? '!' : type === 'info' ? <Info size={14} /> : '•')}
            <div style={{ flex: 1 }}>{message}</div>
        </div>
    );
}
