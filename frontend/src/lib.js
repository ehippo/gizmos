// ─── Base64 ──────────────────────────────────────────────────────────────────

export function base64Encode(input) {
  const bytes = new TextEncoder().encode(input)
  return btoa(String.fromCharCode(...bytes))
}

export function base64Decode(input) {
  try {
    const std = input.trim().replace(/-/g, '+').replace(/_/g, '/')
    const padded = std + '=='.slice((2 - std.length * 3) & 3 & 3)
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    throw new Error('Invalid Base64 string')
  }
}

// ─── JWT (decode only — create/verify handled by jose in JWT.jsx) ─────────────

export function jwtDecode(token) {
  token = token.trim()
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error("Expected 3 parts separated by '.'")
  const decodeSegment = (seg) => {
    const pad = seg + '=='.slice((2 - seg.length * 3) & 3 & 3)
    const raw = atob(pad.replace(/-/g, '+').replace(/_/g, '/'))
    try {
      return JSON.stringify(JSON.parse(raw), null, 2)
    } catch {
      return raw
    }
  }
  return {
    header: decodeSegment(parts[0]),
    payload: decodeSegment(parts[1]),
    signature: parts[2],
  }
}

// ─── Timestamp ───────────────────────────────────────────────────────────────

export function timestampNow() {
  return formatTime(new Date())
}

export function timestampConvert(input) {
  input = input.trim()
  const n = Number(input)
  const d =
    input !== '' && !isNaN(n) ? (n > 1e11 ? new Date(n) : new Date(n * 1000)) : new Date(input)
  if (isNaN(d)) throw new Error(`Cannot parse: "${input}"`)
  return formatTime(d)
}

function formatTime(d) {
  const diffMs = Date.now() - d.getTime()
  const abs = Math.abs(diffMs),
    future = diffMs < 0
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

// ─── Hash ────────────────────────────────────────────────────────────────────

export async function hashAllAlgorithms(input) {
  const enc = new TextEncoder()
  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
  const results = await Promise.all(
    algorithms.map(async (a) => {
      const buf = await crypto.subtle.digest(a, enc.encode(input))
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    })
  )
  return Object.fromEntries(algorithms.map((a, i) => [a, results[i]]))
}

// ─── URL ─────────────────────────────────────────────────────────────────────

export function urlEncode(input) {
  return encodeURIComponent(input)
}
export function urlDecode(input) {
  try {
    return decodeURIComponent(input)
  } catch {
    throw new Error('Invalid URL-encoded string')
  }
}

// ─── JSON ────────────────────────────────────────────────────────────────────

export function jsonFormat(input, indent = 2) {
  return JSON.stringify(JSON.parse(input), null, indent)
}
export function jsonMinify(input) {
  return JSON.stringify(JSON.parse(input))
}

// ─── Text stats ──────────────────────────────────────────────────────────────

export function textStats(input) {
  return {
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    words: input.trim() === '' ? 0 : input.trim().split(/\s+/).length,
    lines: input.split('\n').length,
    sentences: (input.match(/[.!?]+/g) || []).length,
    paragraphs: input.split(/\n\s*\n/).filter((p) => p.trim()).length,
    bytes: new TextEncoder().encode(input).length,
  }
}

// ─── Number base ─────────────────────────────────────────────────────────────

export function convertNumber(input, fromBase) {
  const n = parseInt(input.trim(), fromBase)
  if (isNaN(n)) throw new Error(`Invalid number for base ${fromBase}`)
  return {
    decimal: n.toString(10),
    binary: n.toString(2),
    octal: n.toString(8),
    hex: n.toString(16).toUpperCase(),
    hex0x: '0x' + n.toString(16).toUpperCase(),
  }
}

// ─── Color ───────────────────────────────────────────────────────────────────

export function parseColor(input) {
  input = input.trim()
  let r,
    g,
    b,
    a = 1

  const hex = input.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    const h = hex[1]
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16)
      g = parseInt(h[1] + h[1], 16)
      b = parseInt(h[2] + h[2], 16)
    } else if (h.length >= 6) {
      r = parseInt(h.slice(0, 2), 16)
      g = parseInt(h.slice(2, 4), 16)
      b = parseInt(h.slice(4, 6), 16)
      if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255
    }
  }

  const rgb = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i)
  if (rgb) {
    r = +rgb[1]
    g = +rgb[2]
    b = +rgb[3]
    a = rgb[4] !== undefined ? +rgb[4] : 1
  }

  const hsl = input.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/i
  )
  if (hsl) {
    const [hv, sv, lv] = [+hsl[1], +hsl[2] / 100, +hsl[3] / 100]
    a = hsl[4] !== undefined ? +hsl[4] : 1
    ;({ r, g, b } = hslToRgb(hv, sv, lv))
  }

  if (r === undefined) throw new Error('Unrecognized color format')
  r = Math.round(Math.min(255, Math.max(0, r)))
  g = Math.round(Math.min(255, Math.max(0, g)))
  b = Math.round(Math.min(255, Math.max(0, b)))

  const toHex2 = (n) => n.toString(16).padStart(2, '0')
  const hexStr = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`
  const { h, s, l } = rgbToHsl(r, g, b)
  return {
    hex: hexStr.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
    hsl: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    r,
    g,
    b,
    a,
    preview: `rgba(${r},${g},${b},${a})`,
  }
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2
  let r = 0,
    g = 0,
    b = 0
  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
    h *= 360
  }
  return { h, s, l }
}

// ─── Regexp tester ───────────────────────────────────────────────────────────

export function regexpTest(pattern, flags, input) {
  const re = new RegExp(pattern, flags)
  const matches = []
  if (flags.includes('g')) {
    let m
    while ((m = re.exec(input)) !== null) {
      matches.push({ index: m.index, text: m[0], groups: m.slice(1) })
      if (m[0].length === 0) re.lastIndex++
    }
  } else {
    const m = re.exec(input)
    if (m) matches.push({ index: m.index, text: m[0], groups: m.slice(1) })
  }
  return matches
}
