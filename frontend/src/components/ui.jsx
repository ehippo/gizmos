import { useState } from 'react'
import { Copy, Check, X, Minimize2 } from 'lucide-react'

export function CopyButton({ text, size = 13 }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!text) return
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }
  return (
    <button className="btn-icon" onClick={copy} title="Copy" disabled={!text}>
      {copied ? <Check size={size} color="var(--green)" /> : <Copy size={size} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

// Generic icon button — same visual style as CopyButton
export function IconButton({ icon: Icon, label, onClick, disabled, size = 13, title }) {
  return (
    <button className="btn-icon" onClick={onClick} disabled={disabled} title={title ?? label}>
      {Icon && <Icon size={size} />}
      {label && <span>{label}</span>}
    </button>
  )
}

export function KVGrid({ rows }) {
  return (
    <div className="kv-grid">
      {rows.map(({ key, value }) => (
        <div key={key} className="kv-row">
          <div className="kv-key">{key}</div>
          <div className="kv-val">
            <span className="kv-text">{value}</span>
            <CopyButton text={String(value)} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Toggle({ options, value, onChange }) {
  return (
    <div className="toggle-row">
      {options.map((opt) => (
        <button
          key={opt}
          className={'toggle-btn' + (value === opt ? ' active' : '')}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, children, action, grow }) {
  return (
    <div className={grow ? 'field-grow' : 'field'}>
      <div className="field-header">
        <span className="label">{label}</span>
        {action && <div className="field-action">{action}</div>}
      </div>
      {children}
    </div>
  )
}

export function StatusBadge({ ok, text }) {
  return <span className={ok ? 'badge-ok' : 'badge-error'}>{text}</span>
}

export function ToolShell({ title, children }) {
  return (
    <div className="tool-shell">
      <div className="tool-header">{title}</div>
      <div className="tool-body">{children}</div>
    </div>
  )
}
