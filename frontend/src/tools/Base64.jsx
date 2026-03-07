import { useState, useCallback } from 'react'
import { base64Encode, base64Decode } from '../lib'
import { CopyButton, Toggle, Field, StatusBadge, ToolShell } from '../components/ui'

export default function Base64Tool() {
  const [mode, setMode] = useState('Encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const run = useCallback((value, m) => {
    setError('')
    if (!value) {
      setOutput('')
      return
    }
    try {
      setOutput(m === 'Encode' ? base64Encode(value) : base64Decode(value))
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }, [])

  const handleInput = (v) => {
    setInput(v)
    run(v, mode)
  }
  const handleMode = (m) => {
    setMode(m)
    run(input, m)
  }

  return (
    <ToolShell title="Base64 Encoder / Decoder">
      <Toggle options={['Encode', 'Decode']} value={mode} onChange={handleMode} />
      <div className="split-row">
        <Field label="Input" action={<CopyButton text={input} />} grow>
          <textarea
            className="flex-textarea"
            placeholder={mode === 'Encode' ? 'Text to encode…' : 'Base64 to decode…'}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="Output" action={<CopyButton text={output} />} grow>
          <textarea
            className="flex-textarea output-text"
            readOnly
            value={output}
            placeholder="Result…"
            spellCheck={false}
          />
        </Field>
      </div>
      {error && <StatusBadge ok={false} text={error} />}
    </ToolShell>
  )
}
