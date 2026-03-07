import { useState, useCallback } from 'react'
import { html_beautify, css_beautify } from 'js-beautify'
import { CopyButton, IconButton, Field, StatusBadge, ToolShell } from '../components/ui'
import { X } from 'lucide-react'

function runFormatter(lang, value) {
  switch (lang) {
    case 'HTML':
    case 'XML':
      return html_beautify(value, {
        indent_size: 2,
        wrap_line_length: 0,
        end_with_newline: false,
        preserve_newlines: false,
      })
    case 'CSS':
      return css_beautify(value, { indent_size: 2, end_with_newline: false })
    default:
      return value
  }
}

function FormatterTool({ lang }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const format = useCallback(
    (value) => {
      setError('')
      if (!value.trim()) {
        setOutput('')
        return
      }
      try {
        setOutput(runFormatter(lang, value))
      } catch (e) {
        setError(e.message)
        setOutput('')
      }
    },
    [lang]
  )

  const handleInput = (v) => {
    setInput(v)
    format(v)
  }

  return (
    <ToolShell title={`${lang} Formatter`}>
      <div className="row">{output && <CopyButton text={output} />}</div>

      {error && <StatusBadge ok={false} text={error} />}

      <div className="split-row">
        <Field
          label={`${lang} Input`}
          action={
            <IconButton
              icon={X}
              label="Clear"
              onClick={() => {
                setInput('')
                setOutput('')
                setError('')
              }}
            />
          }
          grow
        >
          <textarea
            className="flex-textarea"
            placeholder={`Paste ${lang} here…`}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="Formatted Output" grow>
          <textarea
            className="flex-textarea output-text"
            readOnly
            value={output}
            placeholder="Formatted output…"
            spellCheck={false}
          />
        </Field>
      </div>
    </ToolShell>
  )
}

export function HtmlFormatterTool() {
  return <FormatterTool lang="HTML" />
}
export function XmlFormatterTool() {
  return <FormatterTool lang="XML" />
}
export function CssFormatterTool() {
  return <FormatterTool lang="CSS" />
}
