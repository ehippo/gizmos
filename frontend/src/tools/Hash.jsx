import { useState, useEffect, useRef } from 'react'
import { hashAllAlgorithms } from '../lib'
import { KVGrid, Field, Toggle, ToolShell, StatusBadge } from '../components/ui'
import { Upload } from 'lucide-react'

async function hashFile(file) {
  const buf = await file.arrayBuffer()
  const results = {}
  for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
    const digest = await crypto.subtle.digest(algo, buf)
    results[algo] = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return results
}

export default function HashTool() {
  const [mode, setMode] = useState('Text')
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  // Text mode: hash as-you-type
  useEffect(() => {
    if (mode !== 'Text') return
    if (!input) {
      setHashes({})
      return
    }
    hashAllAlgorithms(input).then(setHashes)
  }, [input, mode])

  const processFile = async (file) => {
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')
    setHashes({})
    const h = await hashFile(file)
    setHashes(h)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setMode('File')
      processFile(file)
    }
  }

  const rows = Object.entries(hashes).map(([k, v]) => ({ key: k, value: v }))

  return (
    <ToolShell title="Hash Generator">
      <Toggle
        options={['Text', 'File']}
        value={mode}
        onChange={(m) => {
          setMode(m)
          setHashes({})
        }}
      />

      {mode === 'Text' ? (
        <Field label="Input text">
          <textarea
            className="flex-textarea"
            placeholder="Enter text to hash…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </Field>
      ) : (
        <div
          className={'hash-dropzone' + (dragging ? ' dragging' : '')}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current.click()}
        >
          <Upload size={20} style={{ color: 'var(--text3)' }} />
          {fileName ? (
            <>
              <span className="hash-filename">{fileName}</span>
              <span className="hash-filesize">{fileSize}</span>
            </>
          ) : (
            <span className="hash-drop-hint">Drop a file here or click to browse</span>
          )}
          <input
            ref={fileRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files[0]) processFile(e.target.files[0])
            }}
          />
        </div>
      )}

      {rows.length > 0 ? (
        <KVGrid rows={rows} />
      ) : (
        <KVGrid
          rows={[
            { key: 'SHA-1', value: '—' },
            { key: 'SHA-256', value: '—' },
            { key: 'SHA-384', value: '—' },
            { key: 'SHA-512', value: '—' },
          ]}
        />
      )}
    </ToolShell>
  )
}
