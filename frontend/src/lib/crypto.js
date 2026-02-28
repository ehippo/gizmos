/**
 * MD5 implementation (Pure JS)
 */
function md5(input) {
    function md5cycle(x, k) {
        let a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    function md5blk(s) {
        const md5blks = [];
        for (let i = 0; i < 64; i += 4)
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        return md5blks;
    }
    let n = input.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(input.substring(i - 64, i)));
    input = input.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < input.length; i++) tail[i >> 2] |= input.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
    tail[14] = n * 8;
    md5cycle(state, tail);
    const hex_chr = '0123456789abcdef';
    let s = '';
    for (i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            s += hex_chr.charAt((state[i] >> (j * 8 + 4)) & 0x0f) + hex_chr.charAt((state[i] >> (j * 8)) & 0x0f);
    return s;
}

function hmacMD5(key, message) {
    const blockSize = 64;
    if (key.length > blockSize) key = md5(key);
    while (key.length < blockSize) key += '\0';
    let oKeyPad = '', iKeyPad = '';
    for (let i = 0; i < blockSize; i++) {
        oKeyPad += String.fromCharCode(key.charCodeAt(i) ^ 0x5c);
        iKeyPad += String.fromCharCode(key.charCodeAt(i) ^ 0x36);
    }
    return md5(oKeyPad + hexToRaw(md5(iKeyPad + message)));
}

function hexToRaw(hex) {
    let raw = '';
    for (let i = 0; i < hex.length; i += 2)
        raw += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return raw;
}

function bufToHex(buf) {
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatHash(hex, fmt) {
    if (fmt === 'upper-hex') return hex.toUpperCase();
    if (fmt === 'base64') {
        let raw = '';
        for (let i = 0; i < hex.length; i += 2)
            raw += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return btoa(raw);
    }
    return hex;
}

/**
 * Consolidate all hashes (MD5 + SHA via Web Crypto)
 */
export async function hashAll(input, hmacKey, format) {
    try {
        const enc = new TextEncoder();
        const data = input instanceof ArrayBuffer ? new Uint8Array(input) : enc.encode(input);
        const strForMd5 = input instanceof ArrayBuffer
            ? Array.from(new Uint8Array(input)).map(b => String.fromCharCode(b)).join('')
            : input;

        const hashes = {};

        // MD5
        if (hmacKey) hashes.md5 = formatHash(hmacMD5(hmacKey, strForMd5), format);
        else hashes.md5 = formatHash(md5(strForMd5), format);

        // SHA
        const shaAlgos = [
            { id: 'sha1', name: 'SHA-1' },
            { id: 'sha256', name: 'SHA-256' },
            { id: 'sha384', name: 'SHA-384' },
            { id: 'sha512', name: 'SHA-512' },
        ];

        for (const algo of shaAlgos) {
            if (hmacKey) {
                const cryptoKey = await crypto.subtle.importKey(
                    'raw', enc.encode(hmacKey), { name: 'HMAC', hash: algo.name }, false, ['sign']
                );
                const sig = await crypto.subtle.sign('HMAC', cryptoKey, data);
                hashes[algo.id] = formatHash(bufToHex(sig), format);
            } else {
                const hash = await crypto.subtle.digest(algo.name, data);
                hashes[algo.id] = formatHash(bufToHex(hash), format);
            }
        }
        return { hashes, error: '' };
    } catch (e) {
        return { hashes: {}, error: e.message };
    }
}

/**
 * Password and UUID Generators
 */
export async function generatePassword(opts) {
    let charset = '';
    if (opts.uppercase) charset += opts.excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.lowercase) charset += opts.excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (opts.numbers) charset += opts.excludeAmbiguous ? '23456789' : '0123456789';
    if (opts.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
    const arr = new Uint32Array(opts.length);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(n => charset[n % charset.length]).join('');
}

export async function passwordStrength(pwd) {
    const checks = {
        length8: pwd.length >= 8, length12: pwd.length >= 12,
        uppercase: /[A-Z]/.test(pwd), lowercase: /[a-z]/.test(pwd),
        numbers: /[0-9]/.test(pwd), symbols: /[^A-Za-z0-9]/.test(pwd)
    };
    const score = Object.values(checks).filter(Boolean).length;
    const label = score >= 5 ? 'Very Strong' : score >= 4 ? 'Strong' : score >= 3 ? 'Medium' : 'Weak';
    return { score, max: 6, label, checks };
}

export async function generateUUID() { return crypto.randomUUID(); }
export async function generateUUIDs(count) { return Array.from({ length: count }, () => crypto.randomUUID()); }
export async function validateUUID(input) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input); }

/**
 * JWT Encoding and Decoding
 */
export async function jwtEncode(header, payload, secret) {
    const b64url = (buf) => {
        const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new TextEncoder().encode(JSON.stringify(buf));
        let bin = '';
        bytes.forEach(b => bin += String.fromCharCode(b));
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };
    try {
        const headerObj = JSON.parse(header);
        const payloadObj = JSON.parse(payload);
        const alg = (headerObj.alg || 'HS256').toUpperCase();
        if (!alg.startsWith('HS')) throw new Error(`Only HMAC algorithms (HS256/HS384/HS512) are supported in-browser. Got: ${alg}`);
        const hashMap = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };
        const hashAlg = hashMap[alg] || 'SHA-256';

        const enc = new TextEncoder();
        const unsigned = b64url(headerObj) + '.' + b64url(payloadObj);
        const keyData = enc.encode(secret);
        const cryptoKey = await crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: hashAlg }, false, ['sign']
        );
        const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(unsigned));
        const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return unsigned + '.' + sig;
    } catch (e) { throw e.message || String(e); }
}

export async function jwtDecode(token) {
    token = token.trim();
    const parts = token.split('.');
    if (parts.length !== 3) return { error: 'invalid JWT: expected 3 parts', valid: false };
    const decode = (s) => {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        try { return JSON.stringify(JSON.parse(atob(s)), null, 2); } catch { return atob(s); }
    };
    try {
        const header = decode(parts[0]);
        const payload = decode(parts[1]);
        const hObj = JSON.parse(header);
        const pObj = JSON.parse(payload);
        const alg = hObj.alg || '';
        let isExpired = false, expiresAt = '', issuedAt = '';
        if (pObj.exp) {
            const d = new Date(pObj.exp * 1000);
            expiresAt = d.toISOString().replace('T', ' ').replace('.000Z', ' UTC');
            isExpired = Date.now() > pObj.exp * 1000;
        }
        if (pObj.iat) {
            const d = new Date(pObj.iat * 1000);
            issuedAt = d.toISOString().replace('T', ' ').replace('.000Z', ' UTC');
        }
        return { header, payload, signature: parts[2], valid: true, error: '', algorithm: alg, isExpired, expiresAt, issuedAt };
    } catch (e) { return { error: e.message, valid: false }; }
}
