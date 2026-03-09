import { useState } from 'react'
import { parseColor } from '../lib'
import { KVGrid, Field, ToolLayout } from '../components/ui'

export default function ColorTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const convert = (val) => {
    setInput(val)
    setError('')
    setResult(null)
    if (!val.trim()) return
    try {
      setResult(parseColor(val))
    } catch (e) {
      setError(e.message)
    }
  }

  const rows = result
    ? [
        { key: 'HEX', value: result.hex },
        { key: 'RGB', value: result.rgb },
        { key: 'RGBA', value: result.rgba },
        { key: 'HSL', value: result.hsl },
      ]
    : []

  return (
    <ToolLayout title="Color Converter" status={error ? { ok: false, text: error } : null}>
      <Field label="Color input - #hex, rgb(), rgba(), hsl()">
        <div className="row gap-sm" style={{ alignItems: 'stretch' }}>
          <input
            value={input}
            onChange={(e) => convert(e.target.value)}
            placeholder="#1e90ff - rgb(30,144,255) - hsl(210,100%,56%)"
            spellCheck={false}
            style={{ flex: 1 }}
          />
          <input
            type="color"
            value={result?.hex || '#000000'}
            onChange={(e) => convert(e.target.value)}
            style={{
              width: 36,
              height: 28,
              padding: 2,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--bg2)',
            }}
          />
        </div>
      </Field>

      <div className="color-swatch" style={{ background: result ? result.preview : 'var(--bg2)' }}>
        {!result && <span className="color-swatch-empty">Color preview</span>}
      </div>

      <KVGrid
        rows={
          rows.length > 0
            ? rows
            : [
                { key: 'HEX', value: '-' },
                { key: 'RGB', value: '-' },
                { key: 'RGBA', value: '-' },
                { key: 'HSL', value: '-' },
              ]
        }
      />
    </ToolLayout>
  )
}
