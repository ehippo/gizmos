import { useState, useCallback, useMemo } from 'react'
import { jsonrepair } from 'jsonrepair'
import { jsonFormat, jsonMinify } from '../lib'
import { CopyButton, Toggle, Checkbox, Field, StatusBadge, ToolShell } from '../components/ui'
import JsonTree from '../components/JsonTree'

export default function JSONTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState('2')
  const [view, setView] = useState('viewer')
  const [repair, setRepair] = useState(false)

  const run = useCallback((value, ind, rep) => {
    setError('')
    if (!value.trim()) {
      setOutput('')
      return
    }
    try {
      const v = rep ? jsonrepair(value) : value
      if (ind === 'minify') {
        setOutput(jsonMinify(v))
      } else {
        setOutput(jsonFormat(v, Number(ind)))
      }
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }, [])

  const handleInput = (v) => {
    setInput(v)
    run(v, indent, repair)
  }
  const handleIndent = (v) => {
    setIndent(v)
    run(input, v, repair)
  }
  const handleRepair = (v) => {
    setRepair(v)
    run(input, indent, v)
  }

  const parsedData = useMemo(() => {
    if (!output) return null
    try {
      return JSON.parse(output)
    } catch {
      return null
    }
  }, [output])

  return (
    <ToolShell title="JSON Formatter">
      <div className="row gap-sm">
        <Toggle
          options={['Viewer', 'Formatted JSON']}
          value={view === 'viewer' ? 'Viewer' : 'Formatted JSON'}
          onChange={(v) => setView(v === 'Viewer' ? 'viewer' : 'text')}
        />

        <select
          className="recipe-select"
          style={{ width: 'auto', padding: '2px 24px 2px 8px', fontSize: '11px' }}
          value={indent}
          onChange={(e) => handleIndent(e.target.value)}
        >
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="minify">Minify</option>
        </select>

        <div style={{ flex: 1 }} />
        <Checkbox label="Fix JSON" checked={repair} onChange={handleRepair} />
      </div>

      <div className="split-row">
        <Field label="Input JSON" action={<CopyButton text={input} />} grow>
          <textarea
            className="flex-textarea"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
          />
        </Field>

        <Field
          label={view === 'viewer' ? 'Viewer' : 'Formatted JSON'}
          action={<CopyButton text={output} />}
          grow
        >
          {view === 'viewer' && parsedData ? (
            <JsonTree data={parsedData} />
          ) : (
            <textarea
              className="flex-textarea output-text"
              readOnly
              value={output}
              placeholder="Formatted JSON will appear here…"
              spellCheck={false}
            />
          )}
        </Field>
      </div>

      {error && (
        <div style={{ marginTop: 4, width: '100%' }}>
          <StatusBadge ok={false} text={error} />
        </div>
      )}
    </ToolShell>
  )
}
