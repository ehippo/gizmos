export function base64Encode(input) {
  const bytes = new TextEncoder().encode(input)
  return btoa(String.fromCharCode(...bytes))
}

function decodeBase64Url(input) {
  const std = input.trim().replace(/-/g, '+').replace(/_/g, '/')
  const padded = std + '=='.slice((2 - std.length * 3) & 3 & 3)
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
  return bytes
}

export function base64Decode(input) {
  try {
    return new TextDecoder().decode(decodeBase64Url(input))
  } catch {
    throw new Error('Invalid Base64 string')
  }
}

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
