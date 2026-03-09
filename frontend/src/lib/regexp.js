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
