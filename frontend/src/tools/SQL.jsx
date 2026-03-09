import { useState } from 'react'
import { format as sqlFmt } from 'sql-formatter'
import useTransformer from '../hooks/useTransformer'
import { ToolLayout, InputOutputPane } from '../components/ui'

const SQL_DIALECTS = ['sql', 'mysql', 'postgresql', 'sqlite', 'tsql', 'bigquery']

export default function SQLTool() {
  const [dialect, setDialect] = useState('sql')

  const { input, output, error, setInputAndRun, run, clear } = useTransformer((value) =>
    sqlFmt(value, {
      language: dialect,
      tabWidth: 2,
      keywordCase: 'upper',
      linesBetweenQueries: 2,
    })
  )

  const handleDialect = (nextDialect) => {
    setDialect(nextDialect)
    run(input, (value) =>
      sqlFmt(value, {
        language: nextDialect,
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
      })
    )
  }

  return (
    <ToolLayout title="SQL Formatter" status={error ? { ok: false, text: error } : null}>
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
      </div>

      <InputOutputPane
        inputLabel="SQL Input"
        inputValue={input}
        onInputChange={setInputAndRun}
        onInputClear={clear}
        inputPlaceholder="Paste SQL here..."
        outputLabel="Formatted SQL"
        outputValue={output}
        outputPlaceholder="Formatted SQL output..."
      />
    </ToolLayout>
  )
}
