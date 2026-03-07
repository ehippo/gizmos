import { useState, useCallback } from 'react'
import { urlEncode, urlDecode } from '../lib'
import { CopyButton, Toggle, Field, StatusBadge, ToolShell } from '../components/ui'

export default function URLTool() {
  const [mode, setMode] = useState('Encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const run = useCallback((value, m) => {
    setError('')
    if (!value) { setOutput(''); return }
    try {
      setOutput(m === 'Encode' ? urlEncode(value) : urlDecode(value))
    } catch (e) {
      setError(e.message); setOutput('')
    }
  }, [])

  const handleInput = v => { setInput(v); run(v, mode) }
  const handleMode = m => { setMode(m); run(input, m) }

  return (
    <ToolShell title="URL Encoder / Decoder">
      <Toggle options={['Encode', 'Decode']} value={mode} onChange={handleMode} />
      <Field label="Input" action={input && <CopyButton text={input} />}>
        <textarea
          className="flex-textarea"
          placeholder={mode === 'Encode' ? 'Text to URL-encode…' : 'URL-encoded string to decode…'}
          value={input}
          onChange={e => handleInput(e.target.value)}
          spellCheck={false}
        />
      </Field>
      {error && <StatusBadge ok={false} text={error} />}
      <Field label="Output" action={output && <CopyButton text={output} />}>
        <textarea
          className="flex-textarea output-text"
          readOnly value={output}
          placeholder="Result…"
          spellCheck={false}
        />
      </Field>
    </ToolShell>
  )
}
