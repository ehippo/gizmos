import { useState, useMemo } from 'react'
import { regexpTest } from '../lib'
import { Field, ToolLayout, CopyButton } from '../components/ui'

const ALL_FLAGS = ['g', 'i', 'm', 's', 'u']

export default function RegexpTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState(['g', 'i'])
  const [input, setInput] = useState('')

  const toggleFlag = (f) =>
    setFlags((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern || !input) return { matches: [], error: null, highlighted: null }
    try {
      const ms = regexpTest(pattern, flags.join(''), input)
      const segs = []
      let cursor = 0
      for (const m of ms) {
        if (m.index > cursor) segs.push({ text: input.slice(cursor, m.index), match: false })
        segs.push({ text: m.text, match: true })
        cursor = m.index + m.text.length
      }
      if (cursor < input.length) segs.push({ text: input.slice(cursor), match: false })
      return { matches: ms, error: null, highlighted: segs }
    } catch (e) {
      return { matches: [], error: e.message, highlighted: null }
    }
  }, [pattern, flags, input])

  const status =
    error || (pattern && !error && matches.length === 0 && input)
      ? { ok: false, text: error || 'No matches' }
      : null

  return (
    <ToolLayout title="Regexp Tester" status={status}>
      <Field label="Regular expression">
        <div className="regexp-pattern-row">
          <span className="regexp-slash">/</span>
          <input
            className="regexp-input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="pattern"
            spellCheck={false}
          />
          <span className="regexp-slash">/</span>
          <div className="regexp-flags">
            {ALL_FLAGS.map((f) => (
              <button
                key={f}
                className={'toggle-btn' + (flags.includes(f) ? ' active' : '')}
                onClick={() => toggleFlag(f)}
                title={`Flag: ${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Field>

      <div className="split-row">
        <Field label="Test input" grow>
          <textarea
            className="flex-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text to test against..."
            spellCheck={false}
          />
        </Field>

        <Field label={matches.length > 0 ? `Matches (${matches.length})` : 'Matches'} grow>
          <div className="regexp-highlight">
            {highlighted ? (
              highlighted.map((seg, i) =>
                seg.match ? (
                  <mark key={i} className="regexp-mark">
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )
            ) : (
              <span style={{ color: 'var(--text3)' }}>Highlighted matches will appear here...</span>
            )}
          </div>
        </Field>
      </div>

      {matches.length > 0 && (
        <div className="regexp-match-list">
          {matches.map((m, i) => (
            <div key={i} className="regexp-match-row">
              <span className="regexp-match-idx">#{i + 1}</span>
              <span className="regexp-match-pos">@{m.index}</span>
              <code className="regexp-match-text">{m.text}</code>
              {m.groups.length > 0 && (
                <span className="regexp-match-groups">
                  groups:{' '}
                  {m.groups.map((g, j) => (
                    <code key={j} className="regexp-group">
                      {g ?? 'undefined'}
                    </code>
                  ))}
                </span>
              )}
              <CopyButton text={m.text} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  )
}
