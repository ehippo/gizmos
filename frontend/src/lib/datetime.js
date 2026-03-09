function formatTime(d) {
  const diffMs = Date.now() - d.getTime()
  const abs = Math.abs(diffMs)
  const future = diffMs < 0

  let relative
  if (abs < 5000) relative = 'just now'
  else if (abs < 60000) relative = `${Math.floor(abs / 1000)}s ${future ? 'from now' : 'ago'}`
  else if (abs < 3600000) relative = `${Math.floor(abs / 60000)}m ${future ? 'from now' : 'ago'}`
  else if (abs < 86400000) relative = `${Math.floor(abs / 3600000)}h ${future ? 'from now' : 'ago'}`
  else relative = `${Math.floor(abs / 86400000)}d ${future ? 'from now' : 'ago'}`

  return {
    unix: Math.floor(d / 1000),
    unixMs: d.getTime(),
    iso8601: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    weekday: d.toLocaleDateString(undefined, { weekday: 'long' }),
    relative,
  }
}

export function timestampNow() {
  return formatTime(new Date())
}

export function timestampConvert(input) {
  const value = input.trim()
  const n = Number(value)
  const d =
    value !== '' && !isNaN(n) ? (n > 1e11 ? new Date(n) : new Date(n * 1000)) : new Date(value)

  if (isNaN(d)) throw new Error(`Cannot parse: "${value}"`)
  return formatTime(d)
}
