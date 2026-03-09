import { useState, useRef, useEffect } from 'react'
import { Parser } from 'expr-eval-fork'
import { convertNumber } from '../lib'
import {
  Toggle,
  Field,
  KVGrid,
  StatusBadge,
  CopyButton,
  IconButton,
  ToolLayout,
} from '../components/ui'
import { RotateCcw } from 'lucide-react'

const parser = new Parser()

function evaluate(expr) {
  return parser.evaluate(expr)
}

function formatResult(n) {
  if (Number.isInteger(n)) return String(n)
  const s = parseFloat(n.toPrecision(12)).toString()
  return s
}

const EXAMPLES = [
  '10 - 100 * 5 + 5^5',
  'sqrt(144) + 2^10',
  'sin(pi/6) * 100',
  '(1 + 1/100)^365',
  'log(1000)',
  'floor(3.7) * ceil(2.1)',
]

function ExprCalc() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const run = (expr = input) => {
    const e = expr.trim()
    if (!e) return
    let entry
    try {
      const result = evaluate(e)
      entry = { expr: e, result: formatResult(result), error: null }
    } catch (err) {
      entry = { expr: e, result: null, error: err.message }
    }
    setHistory((h) => [entry, ...h])
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run()
    }
    if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault()
      setInput(history[0].expr)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div className="calc-history">
        {history.length === 0 && (
          <div
            style={{ color: 'var(--text3)', fontSize: 11, padding: '4px 0', textAlign: 'center' }}
          >
            Results will appear here
          </div>
        )}
        {history.map((h, i) => (
          <div key={i} className="calc-history-row">
            <span className="calc-history-expr">{h.expr}</span>
            {h.error ? (
              <span className="calc-history-error">{h.error}</span>
            ) : (
              <>
                <span className="calc-history-eq">=</span>
                <span className="calc-history-result">{h.result}</span>
                <CopyButton text={h.result} />
              </>
            )}
          </div>
        ))}
      </div>

      <Field label="Expression - press Enter to evaluate, Up to recall">
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. 10 - 100 * 5 + 5^5"
            spellCheck={false}
            style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
          />
          <IconButton
            icon={RotateCcw}
            label="Clear"
            onClick={() => setHistory([])}
            title="Clear history"
          />
        </div>
      </Field>

      <div className="row" style={{ flexWrap: 'wrap', gap: 4 }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="btn-icon"
            style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
            onClick={() => {
              setInput(ex)
              inputRef.current?.focus()
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

const BASES = { Decimal: 10, Binary: 2, Octal: 8, Hex: 16 }
const PLACEHOLDERS = { Decimal: '255', Binary: '11111111', Octal: '377', Hex: 'FF' }

function BaseConverter() {
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

  const rows = result
    ? [
        { key: 'Decimal', value: result.decimal },
        { key: 'Binary', value: result.binary },
        { key: 'Octal', value: result.octal },
        { key: 'Hex', value: result.hex },
        { key: 'Hex (0x)', value: result.hex0x },
      ]
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="row">
        <span className="label" style={{ marginBottom: 0 }}>
          Input base
        </span>
        <Toggle
          options={Object.keys(BASES)}
          value={fromBase}
          onChange={(b) => {
            setFromBase(b)
            convert(input, b)
          }}
        />
      </div>
      <Field label={`${fromBase} value`}>
        <input
          value={input}
          onChange={(e) => convert(e.target.value, fromBase)}
          placeholder={PLACEHOLDERS[fromBase]}
          spellCheck={false}
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </Field>
      {error && <StatusBadge ok={false} text={error} />}
      {rows.length > 0 && <KVGrid rows={rows} />}
    </div>
  )
}

export default function CalculatorTool() {
  const [tab, setTab] = useState('Calculator')
  return (
    <ToolLayout title="Calculator">
      <Toggle options={['Calculator', 'Base Converter']} value={tab} onChange={setTab} />
      {tab === 'Calculator' && <ExprCalc />}
      {tab === 'Base Converter' && <BaseConverter />}
    </ToolLayout>
  )
}
