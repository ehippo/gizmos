import { useState, useRef } from 'react'
import { Copy, Check, AlertCircle, ClipboardPaste, Upload, Eraser } from 'lucide-react'

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

export function IconButton({ icon: Icon, label, onClick, disabled, size = 13, title }) {
  return (
    <button className="btn-icon" onClick={onClick} disabled={disabled} title={title ?? label}>
      {Icon && <Icon size={size} />}
      {label && <span>{label}</span>}
    </button>
  )
}

export function InputActions({ onPaste, onLoad, onClear, accept = '.txt,text/*' }) {
  const fileRef = useRef(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard?.readText()
      if (typeof text === 'string') onPaste?.(text)
    } catch {
      // ignore clipboard permission errors
    }
  }

  return (
    <div className="row gap-sm">
      <button className="btn-icon" onClick={handlePaste} title="Paste from clipboard">
        <ClipboardPaste size={13} />
        <span>Paste</span>
      </button>
      <button className="btn-icon" onClick={() => fileRef.current?.click()} title="Load from file">
        <Upload size={13} />
        <span>Load</span>
      </button>
      <button className="btn-icon" onClick={onClear} title="Clear input">
        <Eraser size={13} />
        <span>Clear</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const text = await file.text()
          onLoad?.(text)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function InputArea({
  label,
  value,
  onChange,
  placeholder,
  grow,
  accept = '.txt,text/*',
  onPaste,
  onLoad,
  onClear,
}) {
  const applyValue = (next) => onChange?.(next)
  const handlePaste = onPaste ?? applyValue
  const handleLoad = onLoad ?? applyValue
  const handleClear = onClear ?? (() => applyValue(''))

  return (
    <Field
      label={label}
      action={<InputActions onPaste={handlePaste} onLoad={handleLoad} onClear={handleClear} accept={accept} />}
      grow={grow}
    >
      <textarea
        className="flex-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => applyValue(e.target.value)}
        spellCheck={false}
      />
    </Field>
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

export function Checkbox({ label, checked, onChange }) {
  return (
    <label
      className="checkbox-label"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        userSelect: 'none',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ margin: 0 }}
      />
      <span>{label}</span>
    </label>
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
  const Icon = ok ? Check : AlertCircle

  return (
    <div className={ok ? 'badge-ok' : 'badge-error'} style={{ gap: 8 }}>
      <Icon size={14} style={{ flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  )
}

export function ToolLayout({ title, status, children }) {
  return (
    <div className="tool-shell">
      <div className="tool-header">{title}</div>
      <div className="tool-body">
        <div className="tool-layout">
          <div className="tool-layout-content">{children}</div>
          {status ? (
            <div className="tool-layout-footer">
              <StatusBadge ok={status.ok} text={status.text} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}




export function InputOutputPane({
  inputLabel,
  inputValue,
  onInputChange,
  inputPlaceholder,
  inputAccept,
  onInputPaste,
  onInputLoad,
  onInputClear,
  outputLabel,
  outputValue,
  outputPlaceholder = 'Result...',
  outputClassName = 'flex-textarea output-text',
  renderOutput,
}) {
  return (
    <div className="split-row">
      <InputArea
        label={inputLabel}
        value={inputValue}
        onChange={onInputChange}
        placeholder={inputPlaceholder}
        accept={inputAccept}
        onPaste={onInputPaste}
        onLoad={onInputLoad}
        onClear={onInputClear}
        grow
      />
      <Field label={outputLabel} action={<CopyButton text={outputValue} />} grow>
        {renderOutput ? (
          renderOutput()
        ) : (
          <textarea
            className={outputClassName}
            readOnly
            value={outputValue}
            placeholder={outputPlaceholder}
            spellCheck={false}
          />
        )}
      </Field>
    </div>
  )
}
