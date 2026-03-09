export function jsonFormat(input, indent = 2) {
  return JSON.stringify(JSON.parse(input), null, indent)
}

export function jsonMinify(input) {
  return JSON.stringify(JSON.parse(input))
}
