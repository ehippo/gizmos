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
