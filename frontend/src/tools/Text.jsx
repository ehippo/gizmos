import { useState } from 'react'
import { textStats } from '../lib'
import { KVGrid, Field, ToolLayout } from '../components/ui'

export default function TextTool() {
  const [input, setInput] = useState('')

  const stats = input ? textStats(input) : null
  const rows = stats
    ? [
        { key: 'Characters', value: stats.characters },
        { key: 'No spaces', value: stats.charactersNoSpaces },
        { key: 'Words', value: stats.words },
        { key: 'Lines', value: stats.lines },
        { key: 'Sentences', value: stats.sentences },
        { key: 'Paragraphs', value: stats.paragraphs },
        { key: 'Bytes (UTF-8)', value: stats.bytes },
      ]
    : []

  return (
    <ToolLayout title="Text Analyzer">
      <Field label="Input text">
        <textarea
          className="flex-textarea"
          placeholder="Paste or type text to analyze..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </Field>
      {rows.length > 0 && <KVGrid rows={rows} />}
    </ToolLayout>
  )
}
