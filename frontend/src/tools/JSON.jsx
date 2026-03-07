import { useState, useCallback } from 'react'
import { jsonFormat, jsonMinify } from '../lib'
import { CopyButton, Toggle, Field, StatusBadge, ToolShell } from '../components/ui'

export default function JSONTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState('2')

  const run = useCallback((value, ind) => {
    setError('')
    if (!value.trim()) { setOutput(''); return }
    try {
      setOutput(jsonFormat(value, Number(ind)))
    } catch (e) {
      setError(e.message); setOutput('')
    }
  }, [])

  const handleInput = v => { setInput(v); run(v, indent) }
  const handleIndent = v => { setIndent(v); run(input, v) }

  const minify = () => {
    setError('')
    if (!input.trim()) return
    try { setOutput(jsonMinify(input)) }
    catch (e) { setError(e.message) }
  }

  return (
    <ToolShell title="JSON Formatter">
      <div className="row gap-sm">
        <Toggle options={['2', '4']} value={indent} onChange={handleIndent} />
        <button className="btn-ghost" onClick={minify}>Minify</button>
        {output && <CopyButton text={output} />}
      </div>
      <Field label="Input JSON">
        <textarea
          className="flex-textarea"
          placeholder='{"key": "value"}'
          value={input}
          onChange={e => handleInput(e.target.value)}
          spellCheck={false}
        />
      </Field>
      {error && <StatusBadge ok={false} text={error} />}
      <Field label="Formatted Output" action={output && <CopyButton text={output} />}>
        <textarea
          className="flex-textarea output-text"
          readOnly value={output}
          placeholder="Formatted JSON…"
          spellCheck={false}
        />
      </Field>
    </ToolShell>
  )
}
