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
