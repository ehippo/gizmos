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
                fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6,
                background: 'var(--bg-input)',
                border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 'var(--r-md)',
                color: 'var(--text-1)',
                padding: '14px',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                ...style
            }}
        />
    );
}

export function Toggle({ label, checked, onChange, desc }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none' }}>
            <SwitchPrimitive.Root
                checked={checked}
                onCheckedChange={onChange}
                style={{
                    width: 38,
                    height: 20,
                    backgroundColor: checked ? 'var(--accent)' : 'var(--bg-active)',
                    borderRadius: 20,
                    position: 'relative',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background-color 0.2s'
                }}
            >
                <SwitchPrimitive.Thumb style={{
                    display: 'block',
                    width: 14,
                    height: 14,
                    backgroundColor: '#fff',
                    borderRadius: 14,
                    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: checked ? 'translateX(20px)' : 'translateX(3px)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }} />
            </SwitchPrimitive.Root>
            <div onClick={() => onChange(!checked)}>
                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 600 }}>{label}</div>
                {desc && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{desc}</div>}
            </div>
        </div>
    );
}

export function Select({ value, onChange, options, style = {}, label }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {label && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase' }}>{label}</span>}
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    borderRadius: 'var(--r-sm)',
                    padding: '5px 28px 5px 10px',
                    fontSize: 12,
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--text-3) 50%), linear-gradient(135deg, var(--text-3) 50%, transparent 50%)',
                    backgroundPosition: 'calc(100% - 15px) calc(1em + 2px), calc(100% - 10px) calc(1em + 2px)',
                    backgroundSize: '5px 5px, 5px 5px',
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
            {label && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>}
            <input
                type={type}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                spellCheck="false"
                className={cn('ui-input', error && 'ui-input--error')}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'var(--bg-input)',
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--text-1)',
                    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
            />
        </div>
    );
}

export function Slider({ label, value, onChange, min = 1, max = 100, step = 1 }) {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{value}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    width: '100%', height: 4, appearance: 'none',
                    background: `linear-gradient(to right, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--bg-active) 0)`,
                    borderRadius: 2, outline: 'none', cursor: 'pointer',
                }}
            />
        </div>
    );
}
