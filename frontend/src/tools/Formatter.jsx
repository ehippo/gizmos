import { useCallback } from 'react'
import { html_beautify, css_beautify } from 'js-beautify'
import useTransformer from '../hooks/useTransformer'
import { ToolLayout, InputOutputPane } from '../components/ui'

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
  const transform = useCallback((value) => runFormatter(lang, value), [lang])
  const { input, output, error, setInputAndRun, clear } = useTransformer(transform)

  return (
    <ToolLayout title={`${lang} Formatter`} status={error ? { ok: false, text: error } : null}>
      <InputOutputPane
        inputLabel={`${lang} Input`}
        inputValue={input}
        onInputChange={setInputAndRun}
        onInputClear={clear}
        inputPlaceholder={`Paste ${lang} here...`}
        outputLabel="Formatted Output"
        outputValue={output}
        outputPlaceholder="Formatted output..."
      />
    </ToolLayout>
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
