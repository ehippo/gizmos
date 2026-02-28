/**
 * Text Analysis
 */
export async function textAnalyze(input) {
    if (!input) return { characters: 0, words: 0, lines: 0, sentences: 0, paragraphs: 0, uniqueWords: 0 };
    const words = input.split(/\s+/).filter(Boolean);
    const unique = new Set(words.map(w => w.toLowerCase().replace(/[.,!?;:"'()\[\]{}]/g, '')));
    return {
        characters: input.length,
        words: words.length,
        lines: (input.match(/\n/g) || []).length + 1,
        sentences: (input.match(/[.!?]+/g) || []).length,
        paragraphs: (input.match(/\n\s*\n/g) || []).length + 1,
        uniqueWords: unique.size
    };
}

/**
 * Text Transformation
 */
export async function textTransform(input, transform) {
    switch (transform) {
        case 'upper': return input.toUpperCase();
        case 'lower': return input.toLowerCase();
        case 'title': return input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        case 'camel': return input.split(/\s+/).map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
        case 'snake': return input.toLowerCase().replace(/[\s-]+/g, '_');
        case 'kebab': return input.toLowerCase().replace(/[\s_]+/g, '-');
        case 'pascal': return input.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
        case 'reverse': return input.split('').reverse().join('');
        case 'trim': return input.split('\n').map(l => l.trim()).join('\n');
        default: return input;
    }
}

/**
 * Text Diff (LCS-based)
 */
export async function textDiff(left, right) {
    const leftLines = left.split('\n');
    const rightLines = right.split('\n');
    const m = leftLines.length, n = rightLines.length;
    const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (leftLines[i - 1] === rightLines[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    let i = m, j = n;
    const diff = [];
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
            diff.push({ type: 'equal', content: leftLines[i - 1], lineNum: i });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.push({ type: 'added', content: rightLines[j - 1], lineNum: j });
            j--;
        } else {
            diff.push({ type: 'removed', content: leftLines[i - 1], lineNum: i });
            i--;
        }
    }
    return diff.reverse();
}

/**
 * Regex Testing and Explanation
 */
export async function regexTest(pattern, flags, input) {
    if (!pattern) return { matches: [], count: 0, valid: true, error: '' };
    try {
        const re = new RegExp(pattern, 'g' + flags.replace('g', ''));
        const matches = [];
        let m;
        re.lastIndex = 0;
        while ((m = re.exec(input)) !== null) {
            matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
            if (!re.global) break;
            if (m[0].length === 0) re.lastIndex++;
        }
        return { matches, count: matches.length, valid: true, error: '' };
    } catch (e) {
        return { matches: [], count: 0, valid: false, error: e.message };
    }
}

export async function regexExplain(pattern) {
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
    return rules.filter(([re]) => re.test(pattern)).map(([, d]) => d).join('\n');
}
