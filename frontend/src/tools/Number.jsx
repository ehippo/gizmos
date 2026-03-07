import { useState } from 'react'
import { convertNumber } from '../lib'
import { KVGrid, Toggle, Field, StatusBadge, ToolShell } from '../components/ui'

const BASES = { Decimal: 10, Binary: 2, Octal: 8, Hex: 16 }

export default function NumberTool() {
  const [fromBase, setFromBase] = useState('Decimal')
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const convert = (val, base) => {
    setInput(val)
    setError('')
    setResult(null)
    if (!val.trim()) return
    try {
      setResult(convertNumber(val, BASES[base]))
    } catch (e) {
      setError(e.message)
    }
  }

  const handleBase = (b) => {
    setFromBase(b)
    convert(input, b)
  }

  const rows = result
    ? [
        { key: 'Decimal', value: result.decimal },
        { key: 'Binary', value: result.binary },
        { key: 'Octal', value: result.octal },
        { key: 'Hex', value: result.hex },
        { key: 'Hex (0x)', value: result.hex0x },
      ]
    : []

  const placeholders = { Decimal: '255', Binary: '11111111', Octal: '377', Hex: 'FF' }

  return (
    <ToolShell title="Number Base Converter">
      <div className="row">
        <span className="label" style={{ marginBottom: 0 }}>
          Input base
        </span>
        <Toggle options={Object.keys(BASES)} value={fromBase} onChange={handleBase} />
      </div>
      <Field label={`${fromBase} Input`}>
        <input
          value={input}
          onChange={(e) => convert(e.target.value, fromBase)}
          placeholder={placeholders[fromBase]}
          spellCheck={false}
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </Field>
      {error && <StatusBadge ok={false} text={error} />}
      {rows.length > 0 && <KVGrid rows={rows} />}
    </ToolShell>
  )
}
