import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from './utils';

export function CodeArea({ value, onChange, placeholder, readOnly, height, error, className, style = {} }) {
    return (
        <textarea
            value={value}
            onChange={e => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={cn('ui-codearea', error && 'ui-codearea--error', className)}
            style={{
                width: '100%', height: height || '100%', flex: height ? undefined : 1, minHeight: 0,
                fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6,
                background: 'var(--bg-input)',
                border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 0,
                color: readOnly && !error ? 'var(--output-text)' : 'var(--text-1)',
                padding: '8px 10px',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.1s ease',
                ...style
            }}
        />
    );
}

export function Toggle({ label, checked, onChange, desc }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <SwitchPrimitive.Root
                checked={checked}
                onCheckedChange={onChange}
                style={{
                    width: 34,
                    height: 18,
                    backgroundColor: checked ? 'var(--accent)' : 'var(--bg-card)',
                    borderRadius: 2,
                    position: 'relative',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background-color 0.15s'
                }}
            >
                <SwitchPrimitive.Thumb style={{
                    display: 'block',
                    width: 12,
                    height: 12,
                    backgroundColor: checked ? '#fff' : 'var(--text-3)',
                    borderRadius: 1,
                    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: checked ? 'translateX(18px)' : 'translateX(2px)',
                }} />
            </SwitchPrimitive.Root>
            <div onClick={() => onChange(!checked)}>
                <div style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>{label}</div>
                {desc && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{desc}</div>}
            </div>
        </div>
    );
}

export function Select({ value, onChange, options, style = {}, label }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {label && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>{label}</span>}
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    borderRadius: 0,
                    padding: '4px 24px 4px 8px',
                    fontSize: 12,
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 400,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--text-3) 50%), linear-gradient(135deg, var(--text-3) 50%, transparent 50%)',
                    backgroundPosition: 'calc(100% - 12px) calc(1em + 0px), calc(100% - 8px) calc(1em + 0px)',
                    backgroundSize: '4px 4px, 4px 4px',
                    backgroundRepeat: 'no-repeat',
                    ...style
                }}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

export function TextInput({ value, onChange, placeholder, type = 'text', label, mono = true, error, style = {}, className }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }} className={className}>
            {label && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>// {label}</span>}
            <input
                type={type}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                spellCheck="false"
                className={cn('ui-input', error && 'ui-input--error')}
                style={{
                    width: '100%',
                    padding: '6px 10px',
                    background: 'var(--bg-input)',
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                    borderRadius: 0,
                    color: 'var(--text-1)',
                    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
                    fontSize: 12,
                    outline: 'none',
                    transition: 'border-color 0.1s ease',
                }}
            />
        </div>
    );
}

export function Slider({ label, value, onChange, min = 1, max = 100, step = 1 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</span>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{value}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    width: '100%', height: 3, appearance: 'none',
                    background: `linear-gradient(to right, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--bg-card) 0)`,
                    borderRadius: 0, outline: 'none', cursor: 'pointer',
                }}
            />
        </div>
    );
}
