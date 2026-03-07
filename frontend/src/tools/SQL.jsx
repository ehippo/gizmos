import { useState, useCallback } from 'react'
import { format as sqlFmt } from 'sql-formatter'
import { CopyButton, Field, StatusBadge, ToolShell } from '../components/ui'
import { X } from 'lucide-react'

const SQL_DIALECTS = ['sql', 'mysql', 'postgresql', 'sqlite', 'tsql', 'bigquery']

export default function SQLTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [dialect, setDialect] = useState('sql')

  const format = useCallback(
    (value, d) => {
      setError('')
      if (!value.trim()) {
        setOutput('')
        return
      }
      try {
        setOutput(
          sqlFmt(value, {
            language: d || dialect,
            tabWidth: 2,
            keywordCase: 'upper',
            linesBetweenQueries: 2,
          })
        )
      } catch (e) {
        setError(e.message)
        setOutput('')
      }
    },
    [dialect]
  )

  const handleInput = (v) => {
    setInput(v)
    format(v)
  }
  const handleDialect = (d) => {
    setDialect(d)
    format(input, d)
  }

  return (
    <ToolShell title="SQL Formatter">
      <div className="row">
        <select
          className="recipe-select"
          style={{ width: 'auto' }}
          value={dialect}
          onChange={(e) => handleDialect(e.target.value)}
        >
          {SQL_DIALECTS.map((d) => (
            <option key={d} value={d}>
              {d.toUpperCase()}
            </option>
          ))}
        </select>
        {output && <CopyButton text={output} />}
      </div>

      {error && <StatusBadge ok={false} text={error} />}

      <div className="split-row">
        <Field
          label="SQL Input"
          action={
            <button
              className="btn-icon"
              onClick={() => {
                setInput('')
                setOutput('')
                setError('')
              }}
            >
              <X size={14} />
            </button>
          }
          grow
        >
          <textarea
            className="flex-textarea"
            placeholder="Paste SQL here…"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="Formatted SQL" grow>
          <textarea
            className="flex-textarea output-text"
            readOnly
            value={output}
            placeholder="Formatted SQL output…"
            spellCheck={false}
          />
        </Field>
      </div>
    </ToolShell>
  )
}
