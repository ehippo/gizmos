function decodeSegment(seg) {
  const pad = seg + '=='.slice((2 - seg.length * 3) & 3 & 3)
  const raw = atob(pad.replace(/-/g, '+').replace(/_/g, '/'))
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

export function jwtDecode(token) {
  const value = token.trim()
  const parts = value.split('.')
  if (parts.length !== 3) throw new Error("Expected 3 parts separated by '.'")

  return {
    header: decodeSegment(parts[0]),
    payload: decodeSegment(parts[1]),
    signature: parts[2],
  }
}
