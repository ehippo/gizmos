import { useState, useCallback } from 'react'
import { base64Encode, base64Decode, urlEncode, urlDecode } from '../lib'
import useTransformer from '../hooks/useTransformer'
import { Toggle, ToolLayout, InputOutputPane } from '../components/ui'

function EncoderTool({ title, encode, decode }) {
  const [mode, setMode] = useState('Encode')

  const transform = useCallback(
    (value) => (mode === 'Encode' ? encode(value) : decode(value)),
    [mode, encode, decode]
  )

  const { input, output, error, setInputAndRun, run } = useTransformer(transform, {
    treatWhitespaceAsEmpty: false,
  })

  const handleMode = (nextMode) => {
    setMode(nextMode)
    run(input, (value) => (nextMode === 'Encode' ? encode(value) : decode(value)))
  }

  return (
    <ToolLayout title={title} status={error ? { ok: false, text: error } : null}>
      <Toggle options={['Encode', 'Decode']} value={mode} onChange={handleMode} />
      <InputOutputPane
        inputLabel="Input"
        inputValue={input}
        onInputChange={setInputAndRun}
        inputPlaceholder={mode === 'Encode' ? 'Text to encode...' : 'Encoded string to decode...'}
        outputLabel="Output"
        outputValue={output}
      />
    </ToolLayout>
  )
}

export function Base64Tool() {
  return (
    <EncoderTool title="Base64 Encoder / Decoder" encode={base64Encode} decode={base64Decode} />
  )
}

export function URLTool() {
  return <EncoderTool title="URL Encoder / Decoder" encode={urlEncode} decode={urlDecode} />
}
