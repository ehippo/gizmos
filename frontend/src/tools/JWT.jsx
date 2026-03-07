import { useState } from 'react'
import { SignJWT, jwtVerify as joseVerify } from 'jose'
import { jwtDecode } from '../lib'
import { CopyButton, IconButton, Toggle, Field, StatusBadge, ToolShell } from '../components/ui'
import { RefreshCw } from 'lucide-react'

// ── Decode ────────────────────────────────────────────────────────────────────
function DecodeTab() {
  const [token, setToken]   = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [signature, setSignature] = useState('')
  const [error, setError]   = useState('')
  const [expInfo, setExpInfo] = useState(null)

  const decode = val => {
    setToken(val)
    setError(''); setHeader(''); setPayload(''); setSignature(''); setExpInfo(null)
    if (!val.trim()) return
    try {
      const r = jwtDecode(val)
      setHeader(r.header); setPayload(r.payload); setSignature(r.signature)
      try {
        const pay = JSON.parse(r.payload)
        if (pay.exp) {
          const diff = pay.exp * 1000 - Date.now()
          setExpInfo(diff > 0
            ? { ok: true,  text: `Expires in ${Math.round(diff / 60000)} min` }
            : { ok: false, text: `Expired ${Math.round(-diff / 60000)} min ago` }
          )
        }
      } catch { /* no exp field */ }
    } catch (e) { setError(e.message) }
  }

  return (
    <>
      <Field label="JWT Token" action={<CopyButton text={token} />}>
        <textarea
          className="flex-textarea"
          placeholder="Paste JWT token…"
          value={token}
          onChange={e => decode(e.target.value)}
          spellCheck={false}
          style={{ wordBreak: 'break-all', minHeight: 72 }}
        />
      </Field>

      <div className="row">
        {error   && <StatusBadge ok={false} text={error} />}
        {!error && token && <StatusBadge ok text="Valid JWT structure ✓" />}
        {expInfo  && <StatusBadge ok={expInfo.ok} text={expInfo.text} />}
      </div>

      {/* Always-visible decoded panels */}
      <div className="split-row">
        <Field label="Header" action={<CopyButton text={header} />} grow>
          <textarea className="flex-textarea output-blue" readOnly value={header} spellCheck={false} placeholder="Header will appear here…" />
        </Field>
        <Field label="Payload" action={<CopyButton text={payload} />} grow>
          <textarea className="flex-textarea output-blue" readOnly value={payload} spellCheck={false} placeholder="Payload will appear here…" />
        </Field>
      </div>

      <Field label="Signature" action={<CopyButton text={signature} />}>
        <input readOnly value={signature} className="output-orange" spellCheck={false} placeholder="Signature will appear here…" />
      </Field>
    </>
  )
}

// ── Create ────────────────────────────────────────────────────────────────────
const DEFAULT_PAYLOAD = JSON.stringify(
  { sub: '1234567890', name: 'John Doe', iat: Math.floor(Date.now() / 1000) },
  null, 2
)

function CreateTab() {
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD)
  const [secret, setSecret]           = useState('your-secret-key')
  const [algorithm, setAlgorithm]     = useState('HS256')
  const [token, setToken]             = useState('')
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  const generate = async () => {
    setError(''); setLoading(true)
    try {
      const obj       = JSON.parse(payloadText)
      const secretKey = new TextEncoder().encode(secret)
      setToken(await new SignJWT(obj).setProtectedHeader({ alg: algorithm }).sign(secretKey))
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="row">
        <Toggle options={['HS256', 'HS384', 'HS512']} value={algorithm} onChange={setAlgorithm} />
        <IconButton icon={RefreshCw} label={loading ? 'Generating…' : 'Generate'} onClick={generate} disabled={loading} />
      </div>

      <div className="split-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
          <Field label="Payload (JSON)">
            <textarea
              className="flex-textarea"
              value={payloadText}
              onChange={e => setPayloadText(e.target.value)}
              spellCheck={false}
            />
          </Field>
          <Field label="Secret key">
            <input
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="your-secret-key"
              spellCheck={false}
            />
          </Field>
          {error && <StatusBadge ok={false} text={error} />}
        </div>

        <Field label="Generated Token" action={<CopyButton text={token} />} grow>
          <textarea
            className="flex-textarea output-text"
            readOnly value={token}
            placeholder="Generated JWT will appear here…"
            spellCheck={false}
            style={{ wordBreak: 'break-all' }}
          />
        </Field>
      </div>
    </>
  )
}

// ── Verify ────────────────────────────────────────────────────────────────────
function VerifyTab() {
  const [token, setToken]     = useState('')
  const [secret, setSecret]   = useState('')
  const [status, setStatus]   = useState(null)
  const [info, setInfo]       = useState('')
  const [loading, setLoading] = useState(false)

  const verify = async () => {
    setStatus(null); setInfo(''); setLoading(true)
    try {
      const secretKey     = new TextEncoder().encode(secret)
      const { payload }   = await joseVerify(token.trim(), secretKey)
      let suffix = ''
      if (payload.exp) {
        const diff = payload.exp * 1000 - Date.now()
        suffix = diff > 0
          ? ` · Expires in ${Math.round(diff / 60000)} min`
          : ` · Expired ${Math.round(-diff / 60000)} min ago`
      }
      setStatus({ ok: true, text: '✓ Signature valid' + suffix })
      setInfo(JSON.stringify(payload, null, 2))
    } catch (e) {
      setStatus({ ok: false, text: `✗ ${e.message}` })
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="split-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
          <Field label="JWT Token">
            <textarea
              className="flex-textarea"
              placeholder="Paste JWT token…"
              value={token}
              onChange={e => { setToken(e.target.value); setStatus(null) }}
              spellCheck={false}
              style={{ wordBreak: 'break-all' }}
            />
          </Field>
          <Field label="Secret key">
            <input
              value={secret}
              onChange={e => { setSecret(e.target.value); setStatus(null) }}
              placeholder="your-secret-key"
              spellCheck={false}
            />
          </Field>
          <div className="row">
            <IconButton icon={RefreshCw} label={loading ? 'Verifying…' : 'Verify'} onClick={verify} disabled={loading || !token || !secret} />
            {status && <StatusBadge ok={status.ok} text={status.text} />}
          </div>
        </div>

        <Field label="Decoded Payload" action={<CopyButton text={info} />} grow>
          <textarea
            className="flex-textarea output-blue"
            readOnly value={info}
            placeholder="Decoded payload will appear here…"
            spellCheck={false}
          />
        </Field>
      </div>
    </>
  )
}

export default function JWTTool() {
  const [tab, setTab] = useState('Decode')
  return (
    <ToolShell title="JWT — Decode · Create · Verify">
      <Toggle options={['Decode', 'Create', 'Verify']} value={tab} onChange={setTab} />
      {tab === 'Decode' && <DecodeTab />}
      {tab === 'Create' && <CreateTab />}
      {tab === 'Verify' && <VerifyTab />}
    </ToolShell>
  )
}
