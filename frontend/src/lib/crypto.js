import { HASH_ALGORITHMS } from './constants'

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashBufferAllAlgorithms(buffer) {
  const results = await Promise.all(
    HASH_ALGORITHMS.map(async (algo) => {
      const digest = await crypto.subtle.digest(algo, buffer)
      return toHex(digest)
    })
  )

  return Object.fromEntries(HASH_ALGORITHMS.map((algo, i) => [algo, results[i]]))
}

export async function hashAllAlgorithms(input) {
  const enc = new TextEncoder()
  return hashBufferAllAlgorithms(enc.encode(input))
}
