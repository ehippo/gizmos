import { useState, useMemo } from 'react'
import { diffLines, diffWords } from 'diff'
import { Field, ToolLayout, Toggle } from '../components/ui'

export default function DiffTool() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [mode, setMode] = useState('Line')

  const { hunks, stats } = useMemo(() => {
    if (!left && !right) return { hunks: [], stats: null }

    const changes = mode === 'Line' ? diffLines(left, right) : diffWords(left, right)

    const hunks =
      mode === 'Line'
        ? changes.flatMap((c) =>
            c.value
              .replace(/\n$/, '')
              .split('\n')
              .map((line) => ({
                type: c.added ? 'add' : c.removed ? 'del' : 'same',
                text: line,
              }))
          )
        : changes.map((c) => ({
            type: c.added ? 'add' : c.removed ? 'del' : 'same',
            text: c.value,
          }))

    const stats = {
      added: changes.filter((c) => c.added).length,
      removed: changes.filter((c) => c.removed).length,
    }

    return { hunks, stats }
  }, [left, right, mode])

  const numberedHunks = useMemo(() => {
    if (mode !== 'Line') return hunks
    let leftN = 1
    let rightN = 1
    return hunks.map((h) => {
      const ln = { ...h }
      if (h.type === 'del') {
        ln.leftN = leftN++
        ln.rightN = null
      }
      if (h.type === 'add') {
        ln.leftN = null
        ln.rightN = rightN++
      }
      if (h.type === 'same') {
        ln.leftN = leftN++
        ln.rightN = rightN++
      }
      return ln
    })
  }, [hunks, mode])

  return (
    <ToolLayout title="Diff">
      <div className="row">
        <Toggle options={['Line', 'Word']} value={mode} onChange={setMode} />
        {stats && (
          <div className="diff-stats">
            <span className="diff-stat-add">+{stats.added}</span>
            <span className="diff-stat-del">-{stats.removed}</span>
          </div>
        )}
      </div>

      <div className="split-row">
        <Field label="Original (A)" grow>
          <textarea
            className="flex-textarea"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text..."
            spellCheck={false}
          />
        </Field>
        <Field label="Modified (B)" grow>
          <textarea
            className="flex-textarea"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified text..."
            spellCheck={false}
          />
        </Field>
      </div>

      {hunks.length > 0 && (
        <Field label="Diff" grow>
          {mode === 'Line' ? (
            <div className="diff-view">
              {numberedHunks.map((h, i) => (
                <div key={i} className={`diff-line diff-${h.type}`}>
                  <span className="diff-ln">{h.leftN ?? ' '}</span>
                  <span className="diff-ln">{h.rightN ?? ' '}</span>
                  <span className="diff-gutter">
                    {h.type === 'add' ? '+' : h.type === 'del' ? '-' : ' '}
                  </span>
                  <span className="diff-text">{h.text || '\u00a0'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="diff-word-view">
              {hunks.map((h, i) =>
                h.type === 'add' ? (
                  <ins key={i} className="diff-word-add">
                    {h.text}
                  </ins>
                ) : h.type === 'del' ? (
                  <del key={i} className="diff-word-del">
                    {h.text}
                  </del>
                ) : (
                  <span key={i}>{h.text}</span>
                )
              )}
            </div>
          )}
        </Field>
      )}
    </ToolLayout>
  )
}
