import { useState, useCallback } from 'react'
import { html_beautify, css_beautify } from 'js-beautify'
import { format as sqlFmt } from 'sql-formatter'
import { jsonFormat, jsonMinify } from '../lib'
import { CopyButton, IconButton, Toggle, Field, StatusBadge, ToolShell } from '../components/ui'
import { X, Minimize2 } from 'lucide-react'

const SQL_DIALECTS = ['sql', 'mysql', 'postgresql', 'sqlite', 'tsql', 'bigquery']

function runFormatter(lang, value, opts = {}) {
  switch (lang) {
    case 'JSON': return opts.minify ? jsonMinify(value) : jsonFormat(value, opts.indent ?? 2)
    case 'HTML': return html_beautify(value, { indent_size: 2, wrap_line_length: 0, end_with_newline: false, preserve_newlines: false })
    case 'XML':  return html_beautify(value, { indent_size: 2, wrap_line_length: 0, end_with_newline: false, preserve_newlines: false })
    case 'CSS':  return css_beautify(value, { indent_size: 2, end_with_newline: false })
    case 'SQL':  return sqlFmt(value, { language: opts.dialect ?? 'sql', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 })
    default: return value
  }
}

function FormatterTool({ lang }) {
  const [input, setInput]     = useState('')
  const [output, setOutput]   = useState('')
  const [error, setError]     = useState('')
  const [indent, setIndent]   = useState('2')   // JSON only
  const [dialect, setDialect] = useState('sql') // SQL only

  const format = useCallback((value, opts = {}) => {
    setError('')
    if (!value.trim()) { setOutput(''); return }
    try {
      setOutput(runFormatter(lang, value, { indent: Number(indent), dialect, ...opts }))
    } catch (e) {
      setError(e.message); setOutput('')
    }
  }, [lang, indent, dialect])

  const handleInput   = v => { setInput(v); format(v) }
  const handleIndent  = v => { setIndent(v); format(input, { indent: Number(v) }) }
  const handleDialect = d => { setDialect(d); format(input, { dialect: d }) }
  const minify = () => {
    setError('')
    if (!input.trim()) return
    try { setOutput(jsonMinify(input)) } catch (e) { setError(e.message) }
  }

  return (
    <ToolShell title={`${lang} Formatter`}>
      {/* Lang-specific controls row */}
      <div className="row">
        {lang === 'JSON' && <Toggle options={['2', '4']} value={indent} onChange={handleIndent} />}
        {lang === 'JSON' && <IconButton icon={Minimize2} label="Minify" onClick={minify} />}
        {lang === 'SQL'  && (
          <select
            className="recipe-select"
            style={{ width: 'auto' }}
            value={dialect}
            onChange={e => handleDialect(e.target.value)}
          >
            {SQL_DIALECTS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
          </select>
        )}
      </div>

      {error && <StatusBadge ok={false} text={error} />}

      {/* Split panes — each has its own action buttons in the field header */}
      <div className="split-row">
        <Field
          label={`${lang} Input`}
          action={<IconButton icon={X} label="Clear" onClick={() => { setInput(''); setOutput(''); setError('') }} />}
          grow
        >
          <textarea
            className="flex-textarea"
            placeholder={`Paste ${lang} here…`}
            value={input}
            onChange={e => handleInput(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field
          label="Formatted Output"
          action={<CopyButton text={output} />}
          grow
        >
          <textarea
            className="flex-textarea output-text"
            readOnly value={output}
            placeholder="Formatted output…"
            spellCheck={false}
          />
        </Field>
      </div>
    </ToolShell>
  )
}

export function JsonFormatterTool() { return <FormatterTool lang="JSON" /> }
export function HtmlFormatterTool() { return <FormatterTool lang="HTML" /> }
export function XmlFormatterTool()  { return <FormatterTool lang="XML"  /> }
export function CssFormatterTool()  { return <FormatterTool lang="CSS"  /> }
export function SqlFormatterTool()  { return <FormatterTool lang="SQL"  /> }
