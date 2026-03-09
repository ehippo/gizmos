function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

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

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h
  let s

  if (max === min) {
    h = 0
    s = 0
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
      default:
        h = ((r - g) / d + 4) / 6
        break
    }

    h *= 360
  }

  return { h, s, l }
}

export function parseColor(input) {
  const value = input.trim()
  let r
  let g
  let b
  let a = 1

  const hex = value.match(/^#([0-9a-f]{3,8})$/i)
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

  const rgb = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i)
  if (rgb) {
    r = +rgb[1]
    g = +rgb[2]
    b = +rgb[3]
    a = rgb[4] !== undefined ? +rgb[4] : 1
  }

  const hsl = value.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/i
  )
  if (hsl) {
    const hv = +hsl[1]
    const sv = +hsl[2] / 100
    const lv = +hsl[3] / 100
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
