import { useState, useEffect } from 'react'
import { timestampNow, timestampConvert } from '../lib'
import { KVGrid, Field, IconButton, ToolLayout } from '../components/ui'
import { RefreshCw } from 'lucide-react'

export default function TimestampTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const loadNow = () => {
    const r = timestampNow()
    setResult(r)
    setInput(String(r.unix))
    setError('')
  }
  useEffect(loadNow, [])

  const convert = (val) => {
    setInput(val)
    setError('')
    setResult(null)
    if (!val.trim()) return
    try {
      setResult(timestampConvert(val))
    } catch (e) {
      setError(e.message)
    }
  }

  const rows = result
    ? [
        { key: 'Unix (s)', value: result.unix },
        { key: 'Unix (ms)', value: result.unixMs },
        { key: 'ISO 8601', value: result.iso8601 },
        { key: 'UTC', value: result.utc },
        { key: 'Local', value: result.local },
        { key: 'Weekday', value: result.weekday },
        { key: 'Relative', value: result.relative },
      ]
    : []

  return (
    <ToolLayout title="Timestamp Converter" status={error ? { ok: false, text: error } : null}>
      <Field
        label="Input - Unix (s/ms), ISO 8601, or any date string"
        action={<IconButton icon={RefreshCw} label="Now" onClick={loadNow} />}
      >
        <input
          value={input}
          onChange={(e) => convert(e.target.value)}
          placeholder="1700000000 - 2024-01-15T10:30:00Z - Jan 15 2024"
          spellCheck={false}
        />
      </Field>
      {result && <KVGrid rows={rows} />}
    </ToolLayout>
  )
}
