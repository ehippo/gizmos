/**
 * Base64 Encoding/Decoding
 */
export const base64 = {
    encode: (s) => btoa(unescape(encodeURIComponent(s))),
    decode: (s) => {
        try {
            return decodeURIComponent(escape(atob(s)));
        } catch {
            throw new Error('Invalid base64');
        }
    }
};

/**
 * Unix Timestamp Converters
 */
export async function unixToTime(ts) {
    const d = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
    const now = new Date();
    const diff = (now - d) / 1000;
    let rel = '';
    const absDiff = Math.abs(diff);
    const suffix = diff > 0 ? ' ago' : ' from now';

    if (absDiff < 60) rel = `${Math.floor(absDiff)}s${suffix}`;
    else if (absDiff < 3600) rel = `${Math.floor(absDiff / 60)}m${suffix}`;
    else if (absDiff < 86400) rel = `${Math.floor(absDiff / 3600)}h${suffix}`;
    else rel = `${Math.floor(absDiff / 86400)}d${suffix}`;

    return {
        utc: d.toISOString().replace('T', ' ').split('.')[0] + ' UTC',
        unix: Math.floor(d.getTime() / 1000),
        unixMilli: d.getTime(),
        iso8601: d.toISOString(),
        rfc822: d.toUTCString(),
        relative: rel
    };
}

export async function nowTime() {
    const d = new Date();
    return {
        utc: d.toISOString().replace('T', ' ').split('.')[0] + ' UTC',
        unix: Math.floor(d.getTime() / 1000),
        unixMilli: d.getTime(),
        iso8601: d.toISOString(),
        rfc822: d.toUTCString(),
        relative: 'just now'
    };
}

/**
 * Color Conversions
 */
export async function hexToColor(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    const rf = r / 255, gf = g / 255, bf = b / 255;
    const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rf: h = (gf - bf) / d + (gf < bf ? 6 : 0); break;
            case gf: h = (bf - rf) / d + 2; break;
            case bf: h = (rf - gf) / d + 4; break;
        }
        h /= 6;
    }
    return {
        hex: `#${hex}`,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
        rgba: `rgba(${r}, ${g}, ${b}, 1)`
    };
}

/**
 * Number Base Conversion
 */
export async function convertBase(input, fromBase) {
    const n = parseInt(input.trim(), fromBase);
    if (isNaN(n)) throw new Error(`Invalid number for base ${fromBase}`);
    return {
        decimal: n.toString(10),
        hex: n.toString(16).toUpperCase(),
        binary: n.toString(2),
        octal: n.toString(8)
    };
}
