import React, { useState } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Copy, Check, Info } from 'lucide-react';

/**
 * Utility for joining class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Layout Components ─────────────────────────────────────────────────────────

export function ToolGrid({ children, cols = 2, gap = 12 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
        gap,
        flex: 1,
        minHeight: 0
      }}
    >
      {children}
    </div>
  );
}

// ── UI Primitives ────────────────────────────────────────────────────────────

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
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {(title || actions || badge) && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-panel)',
          gap: 8,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-3)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {title}
            </span>
            {badge && (
              <span style={{
                fontSize: 10, padding: '1px 8px',
                background: error ? 'rgba(247,106,106,0.1)' : success ? 'rgba(62,207,176,0.1)' : 'var(--bg-active)',
                color: error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--text-3)',
                borderRadius: 4,
                border: `1px solid ${error ? 'var(--danger)20' : success ? 'var(--success)20' : 'var(--border)'}`,
                fontFamily: 'var(--font-mono)',
              }}>
                {badge}
              </span>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: 6 }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding: 12, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

export function Btn({ children, onClick, variant = 'secondary', size = 'md', disabled, className, style = {}, title }) {
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
    secondary: { background: 'var(--bg-input)', color: 'var(--text-2)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-3)', border: '1px solid transparent' },
    danger: { background: 'rgba(247,106,106,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)30' },
    success: { background: 'rgba(62,207,176,0.1)', color: 'var(--success)', border: '1px solid var(--success)30' },
    accent: { background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)30' },
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
      className={cn('ui-btn', className)}
      style={{
        ...variants[variant], ...sizes[size],
        fontFamily: 'var(--font-sans)', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.filter = 'brightness(1.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'ghost') e.currentTarget.style.background = 'var(--bg-hover)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.filter = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
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

export function CodeArea({ value, onChange, placeholder, readOnly, height, error, className }) {
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
      className={cn('ui-codearea', className)}
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
        transition: 'all 0.15s ease',
      }}
      onFocus={e => {
        if (!readOnly) {
          e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
          e.target.style.boxShadow = `0 0 0 3px ${error ? 'var(--danger)20' : 'var(--accent-glow)'}`;
        }
      }}
      onBlur={e => {
        e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

// ── Radix-backed Components ───────────────────────────────────────────────────

export function Tabs({ tabs, active, onChange, className }) {
  return (
    <TabsPrimitive.Root
      value={active}
      onValueChange={onChange}
      className={cn('ui-tabs', className)}
    >
      <TabsPrimitive.List style={{
        display: 'flex',
        gap: 2,
        padding: '3px',
        background: 'var(--bg-input)',
        borderRadius: 'var(--r-md)',
        width: 'fit-content',
        border: '1px solid var(--border)'
      }}>
        {tabs.map(tab => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className="ui-tabs-trigger"
            style={{
              padding: '5px 14px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: active === tab.id ? 'var(--bg-card)' : 'transparent',
              color: active === tab.id ? 'var(--text-1)' : 'var(--text-3)',
              boxShadow: active === tab.id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
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

export function DropdownMenu({ trigger, items }) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          style={{
            minWidth: 160,
            background: 'var(--bg-card)',
            borderRadius: 'var(--r-md)',
            padding: '5px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-hi)',
            zIndex: 1000,
            animation: 'fadeIn 0.12s ease'
          }}
          sideOffset={5}
        >
          {items.map((item, idx) => (
            <DropdownMenuPrimitive.Item
              key={item.id || idx}
              onClick={item.onClick}
              style={{
                fontSize: 12,
                color: 'var(--text-2)',
                borderRadius: 'var(--r-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 0.1s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-2)';
              }}
            >
              {item.icon}
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export function ScrollArea({ children, className, style = {} }) {
  return (
    <ScrollAreaPrimitive.Root className={cn('ui-scroll-area', className)} style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <ScrollAreaPrimitive.Viewport style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        style={{
          display: 'flex',
          userSelect: 'none',
          touchAction: 'none',
          padding: '2px',
          background: 'transparent',
          transition: 'background 160ms ease-out',
          width: '10px'
        }}
      >
        <ScrollAreaPrimitive.Thumb
          style={{
            flex: 1,
            background: 'var(--scrollbar-thumb)',
            borderRadius: '10px',
            position: 'relative'
          }}
        />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner style={{ background: 'transparent' }} />
    </ScrollAreaPrimitive.Root>
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

export function Alert({ type = 'error', message, icon }) {
  if (!message) return null;
  const colors = {
    error: { bg: 'rgba(247,106,106,0.1)', border: 'var(--danger)', color: 'var(--danger)' },
    success: { bg: 'rgba(62,207,176,0.1)', border: 'var(--success)', color: 'var(--success)' },
    warning: { bg: 'rgba(247,194,106,0.1)', border: 'var(--warning)', color: 'var(--warning)' },
    info: { bg: 'rgba(124,106,247,0.1)', border: 'var(--accent)', color: 'var(--accent)' },
  };
  const c = colors[type];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 'var(--r-md)',
      background: c.bg,
      border: `1px solid ${c.border}40`,
      color: c.color,
      fontSize: 12,
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      lineHeight: 1.4
    }}>
      {icon || (type === 'error' ? '!' : type === 'info' ? <Info size={14} /> : '•')}
      <div style={{ flex: 1 }}>{message}</div>
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

// ── Higher Level Tool Components ─────────────────────────────────────────────

export function ToolLayout({ children, title, description, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {children}
    </div>
  );
}

export function ToolHeader({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      minHeight: 36,
      flexShrink: 0
    }}>
      {children}
    </div>
  );
}

export function SplitPane({ left, right, ratio = '1fr 1fr' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: ratio, gap: 12, flex: 1, minHeight: 0 }}>
      {left}
      {right}
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

export function PropertyRow({ label, value, mono = true, accent, danger, success }) {
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
          {value}
        </span>
        <CopyBtn text={String(value)} size="sm" variant="ghost" />
      </div>
    </div>
  );
}
