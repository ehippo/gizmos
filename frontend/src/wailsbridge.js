// Wails bridge - in production, window.go bindings are auto-injected.
// This provides fallback implementations for browser dev mode.

const isBrowser = typeof window !== 'undefined' && !window.go;

const base64 = {
  encode: (s) => btoa(unescape(encodeURIComponent(s))),
  decode: (s) => { try { return decodeURIComponent(escape(atob(s))); } catch { throw new Error('Invalid base64'); } }
};

const mockGo = {
  main: {
    App: {
      Base64Encode: async (s) => base64.encode(s),
      Base64Decode: async (s) => { try { return base64.decode(s); } catch(e) { throw e.message; } },

      JSONFormat: async (input, indent) => {
        try {
          const raw = JSON.parse(input);
          return { output: JSON.stringify(raw, null, indent), valid: true, error: '' };
        } catch(e) { return { output: '', valid: false, error: e.message }; }
      },
      JSONMinify: async (input) => {
        try {
          return { output: JSON.stringify(JSON.parse(input)), valid: true, error: '' };
        } catch(e) { return { output: '', valid: false, error: e.message }; }
      },

      SQLFormat: async (input) => {
        const kw = ['SELECT','FROM','WHERE','AND','OR','JOIN','INNER JOIN','LEFT JOIN','RIGHT JOIN',
          'GROUP BY','ORDER BY','HAVING','LIMIT','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM',
          'CREATE TABLE','WITH','UNION','ON','AS','DISTINCT','NOT','IN','EXISTS'];
        let r = input;
        kw.forEach(k => {
          r = r.replace(new RegExp('\\b'+k+'\\b', 'gi'), k);
        });
        kw.forEach(k => {
          r = r.replace(new RegExp('(^|\\s)'+k+'\\s', 'gm'), '\n'+k+' ');
        });
        r = r.replace(/\s(AND|OR)\s/gi, '\n  $1 ');
        return r.trim();
      },

      UnixToTime: async (ts) => {
        const d = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
        const now = new Date();
        const diff = (now - d) / 1000;
        let rel = '';
        if (Math.abs(diff) < 60) rel = `${Math.abs(diff)|0}s ${diff > 0 ? 'ago' : 'from now'}`;
        else if (Math.abs(diff) < 3600) rel = `${(Math.abs(diff)/60)|0}m ${diff > 0 ? 'ago' : 'from now'}`;
        else if (Math.abs(diff) < 86400) rel = `${(Math.abs(diff)/3600)|0}h ${diff > 0 ? 'ago' : 'from now'}`;
        else rel = `${(Math.abs(diff)/86400)|0}d ${diff > 0 ? 'ago' : 'from now'}`;
        return {
          utc: d.toISOString().replace('T',' ').replace('.000Z',' UTC'),
          unix: Math.floor(d.getTime()/1000),
          unixMilli: d.getTime(),
          iso8601: d.toISOString(),
          rfc822: d.toUTCString(),
          relative: rel
        };
      },
      NowTime: async () => {
        const d = new Date(); const ts = Math.floor(d.getTime()/1000);
        return {
          utc: d.toISOString().replace('T',' ').replace('.000Z',' UTC'),
          unix: ts, unixMilli: d.getTime(),
          iso8601: d.toISOString(), rfc822: d.toUTCString(), relative: 'just now'
        };
      },

      GeneratePassword: async (opts) => {
        let charset = '';
        if (opts.uppercase) charset += opts.excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (opts.lowercase) charset += opts.excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
        if (opts.numbers) charset += opts.excludeAmbiguous ? '23456789' : '0123456789';
        if (opts.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
        const arr = new Uint32Array(opts.length);
        crypto.getRandomValues(arr);
        return Array.from(arr).map(n => charset[n % charset.length]).join('');
      },
      PasswordStrength: async (pwd) => {
        const checks = {
          length8: pwd.length >= 8, length12: pwd.length >= 12,
          uppercase: /[A-Z]/.test(pwd), lowercase: /[a-z]/.test(pwd),
          numbers: /[0-9]/.test(pwd), symbols: /[^A-Za-z0-9]/.test(pwd)
        };
        const score = Object.values(checks).filter(Boolean).length;
        const label = score >= 5 ? 'Very Strong' : score >= 4 ? 'Strong' : score >= 3 ? 'Medium' : 'Weak';
        return { score, max: 6, label, checks };
      },

      GenerateUUID: async () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },
      GenerateUUIDs: async (count) => {
        return Array.from({length: count}, () =>
          'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          })
        );
      },
      ValidateUUID: async (input) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
      },

      URLEncode: async (s) => encodeURIComponent(s),
      URLDecode: async (s) => { try { return decodeURIComponent(s); } catch(e) { throw e.message; } },

      HexToColor: async (hex) => {
        hex = hex.replace('#','');
        if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        const rf=r/255, gf=g/255, bf=b/255;
        const max=Math.max(rf,gf,bf), min=Math.min(rf,gf,bf);
        let h=0, s=0, l=(max+min)/2;
        if (max!==min) {
          const d=max-min;
          s=l>0.5?d/(2-max-min):d/(max+min);
          switch(max){case rf:h=(gf-bf)/d+(gf<bf?6:0);break;case gf:h=(bf-rf)/d+2;break;case bf:h=(rf-gf)/d+4;}
          h/=6;
        }
        return {
          hex:`#${hex}`, rgb:`rgb(${r}, ${g}, ${b})`,
          hsl:`hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`,
          rgba:`rgba(${r}, ${g}, ${b}, 1)`
        };
      },

      ConvertBase: async (input, fromBase) => {
        const n = parseInt(input.trim(), fromBase);
        if (isNaN(n)) throw new Error(`Invalid number for base ${fromBase}`);
        return { decimal: n.toString(10), hex: n.toString(16).toUpperCase(), binary: n.toString(2), octal: n.toString(8) };
      },

      TextAnalyze: async (input) => {
        if (!input) return { characters:0, words:0, lines:0, sentences:0, paragraphs:0, uniqueWords:0 };
        const words = input.split(/\s+/).filter(Boolean);
        const unique = new Set(words.map(w => w.toLowerCase().replace(/[.,!?;:"'()\[\]{}]/g,'')));
        return {
          characters: input.length, words: words.length,
          lines: (input.match(/\n/g)||[]).length+1,
          sentences: (input.match(/[.!?]+/g)||[]).length,
          paragraphs: (input.match(/\n\s*\n/g)||[]).length+1,
          uniqueWords: unique.size
        };
      },
      TextTransform: async (input, transform) => {
        switch(transform) {
          case 'upper': return input.toUpperCase();
          case 'lower': return input.toLowerCase();
          case 'title': return input.toLowerCase().replace(/\b\w/g, c=>c.toUpperCase());
          case 'camel': return input.split(/\s+/).map((w,i)=>i===0?w.toLowerCase():w[0].toUpperCase()+w.slice(1).toLowerCase()).join('');
          case 'snake': return input.toLowerCase().replace(/[\s-]+/g,'_');
          case 'kebab': return input.toLowerCase().replace(/[\s_]+/g,'-');
          case 'pascal': return input.split(/\s+/).map(w=>w[0].toUpperCase()+w.slice(1).toLowerCase()).join('');
          case 'reverse': return input.split('').reverse().join('');
          case 'trim': return input.split('\n').map(l=>l.trim()).join('\n');
          default: return input;
        }
      },

      TextDiff: async (left, right) => {
        const leftLines = left.split('\n');
        const rightLines = right.split('\n');
        const result = [];
        // Simple diff
        const maxLen = Math.max(leftLines.length, rightLines.length);
        for (let i = 0; i < maxLen; i++) {
          if (i >= leftLines.length) {
            result.push({type:'added', content: rightLines[i], lineNum: i+1});
          } else if (i >= rightLines.length) {
            result.push({type:'removed', content: leftLines[i], lineNum: i+1});
          } else if (leftLines[i] === rightLines[i]) {
            result.push({type:'equal', content: leftLines[i], lineNum: i+1});
          } else {
            result.push({type:'removed', content: leftLines[i], lineNum: i+1});
            result.push({type:'added', content: rightLines[i], lineNum: i+1});
          }
        }
        return result;
      }
    }
  }
};

// Export the bridge
export const go = typeof window !== 'undefined' && window.go ? window.go : mockGo;

export const callGo = async (method, ...args) => {
  const parts = method.split('.');
  let fn = go;
  for (const p of parts) fn = fn[p];
  return fn(...args);
};

// Shorthand wrappers
export const API = {
  base64Encode: (s) => callGo('main.App.Base64Encode', s),
  base64Decode: (s) => callGo('main.App.Base64Decode', s),
  jsonFormat: (s, indent) => callGo('main.App.JSONFormat', s, indent),
  jsonMinify: (s) => callGo('main.App.JSONMinify', s),
  sqlFormat: (s) => callGo('main.App.SQLFormat', s),
  unixToTime: (ts) => callGo('main.App.UnixToTime', ts),
  nowTime: () => callGo('main.App.NowTime'),
  generatePassword: (opts) => callGo('main.App.GeneratePassword', opts),
  passwordStrength: (pwd) => callGo('main.App.PasswordStrength', pwd),
  generateUUID: () => callGo('main.App.GenerateUUID'),
  generateUUIDs: (n) => callGo('main.App.GenerateUUIDs', n),
  validateUUID: (s) => callGo('main.App.ValidateUUID', s),
  urlEncode: (s) => callGo('main.App.URLEncode', s),
  urlDecode: (s) => callGo('main.App.URLDecode', s),
  hexToColor: (s) => callGo('main.App.HexToColor', s),
  convertBase: (s, from) => callGo('main.App.ConvertBase', s, from),
  textAnalyze: (s) => callGo('main.App.TextAnalyze', s),
  textTransform: (s, t) => callGo('main.App.TextTransform', s, t),
  textDiff: (l, r) => callGo('main.App.TextDiff', l, r),
};

// ── New tool additions ────────────────────────────────────────────────────────

// JWT
mockGo.main.App.JWTDecode = async (token) => {
  token = token.trim();
  const parts = token.split('.');
  if (parts.length !== 3) return { error: 'invalid JWT: expected 3 parts', valid: false };
  const decode = (s) => {
    s = s.replace(/-/g,'+').replace(/_/g,'/');
    while (s.length % 4) s += '=';
    try {
      return JSON.stringify(JSON.parse(atob(s)), null, 2);
    } catch { return atob(s); }
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
      expiresAt = d.toISOString().replace('T',' ').replace('.000Z',' UTC');
      isExpired = Date.now() > pObj.exp * 1000;
    }
    if (pObj.iat) {
      const d = new Date(pObj.iat * 1000);
      issuedAt = d.toISOString().replace('T',' ').replace('.000Z',' UTC');
    }
    return { header, payload, signature: parts[2], valid: true, error: '', algorithm: alg, isExpired, expiresAt, issuedAt };
  } catch(e) { return { error: e.message, valid: false }; }
};

mockGo.main.App.XMLFormat = async (input) => {
  input = input.trim();
  if (!input) return ['', null];
  // Simple XML formatter
  let indent = 0;
  let result = '';
  const lines = input.replace(/>\s*</g, '>\n<').split('\n');
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.match(/^<\/\w/)) indent--;
    result += '  '.repeat(Math.max(0,indent)) + line + '\n';
    if (line.match(/^<\w[^>]*[^/]>$/) && !line.match(/^<!/)) indent++;
  }
  return result.trim();
};

mockGo.main.App.CSSFormat = async (input) => {
  let r = input.replace(/\s+/g, ' ');
  r = r.replace(/\s*{\s*/g, ' {\n  ');
  r = r.replace(/\s*}\s*/g, '\n}\n\n');
  r = r.replace(/;\s*/g, ';\n  ');
  r = r.replace(/\s*:\s*/g, ': ');
  r = r.replace(/\n  \n/g, '\n');
  return r.trim();
};
mockGo.main.App.CSSMinify = async (input) => {
  let r = input.replace(/\/\*[\s\S]*?\*\//g, '');
  r = r.replace(/\s+/g, ' ');
  r = r.replace(/ ?([{};:,]) ?/g, '$1');
  r = r.replace(/;}/g, '}');
  return r.trim();
};

mockGo.main.App.HTMLFormat = async (input) => {
  let r = input.replace(/>\s*</g, '>\n<');
  let indent = 0;
  const lines = r.split('\n');
  const result = [];
  const selfClose = /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[\s>]/i;
  const closeTag = /^<\//;
  const openTag = /^<[^/!][^>]*[^/]>$/;
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (closeTag.test(line)) indent = Math.max(0, indent - 1);
    result.push('  '.repeat(indent) + line);
    if (openTag.test(line) && !selfClose.test(line)) indent++;
  }
  return result.join('\n');
};

mockGo.main.App.RegexTest = async (pattern, flags, input) => {
  if (!pattern) return { matches: [], count: 0, valid: true, error: '' };
  try {
    const re = new RegExp(pattern, 'g' + flags.replace('g',''));
    const matches = [];
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(input)) !== null) {
      matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      if (!re.global) break;
      if (m[0].length === 0) re.lastIndex++;
    }
    return { matches, count: matches.length, valid: true, error: '' };
  } catch(e) {
    return { matches: [], count: 0, valid: false, error: e.message };
  }
};
mockGo.main.App.RegexExplain = async (pattern) => {
  const rules = [
    [/\^/, '^ = start of string/line'],
    [/\$/, '$ = end of string/line'],
    [/\\d/, '\\d = any digit [0-9]'],
    [/\\w/, '\\w = word character [a-zA-Z0-9_]'],
    [/\\s/, '\\s = whitespace'],
    [/\\D/, '\\D = non-digit'],
    [/\\./, '. = any character except newline'],
    [/\*/, '* = 0 or more of preceding'],
    [/\+/, '+ = 1 or more of preceding'],
    [/\?/, '? = 0 or 1 of preceding (optional)'],
    [/\{(\d+),(\d+)\}/, '{n,m} = between n and m repetitions'],
    [/\[([^\]]+)\]/, '[...] = character class'],
    [/\(([^)]+)\)/, '(...) = capture group'],
    [/\|/, '| = alternation (OR)'],
  ];
  return rules.filter(([re]) => re.test(pattern)).map(([,d]) => d).join('\n');
};

// Export new API methods
Object.assign(API, {
  jwtDecode: (t) => callGo('main.App.JWTDecode', t),
  jwtEncode: (h, p, s) => callGo('main.App.JWTEncode', h, p, s),
  xmlFormat: (s) => callGo('main.App.XMLFormat', s),
  cssFormat: (s) => callGo('main.App.CSSFormat', s),
  cssMinify: (s) => callGo('main.App.CSSMinify', s),
  htmlFormat: (s) => callGo('main.App.HTMLFormat', s),
  regexTest: (p, f, i) => callGo('main.App.RegexTest', p, f, i),
  regexExplain: (p) => callGo('main.App.RegexExplain', p),
});
