/**
 * JSON Formatting and Minification
 */
export async function jsonFormat(input, indent) {
    try {
        const raw = JSON.parse(input);
        return { output: JSON.stringify(raw, null, indent), valid: true, error: '' };
    } catch (e) {
        return { output: '', valid: false, error: e.message };
    }
}

export async function jsonMinify(input) {
    try {
        return { output: JSON.stringify(JSON.parse(input)), valid: true, error: '' };
    } catch (e) {
        return { output: '', valid: false, error: e.message };
    }
}

/**
 * SQL Formatting
 */
export async function sqlFormat(input) {
    const keywords = [
        "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "EXISTS",
        "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
        "CREATE", "TABLE", "DROP", "ALTER", "ADD", "COLUMN",
        "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS",
        "ON", "AS", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET",
        "DISTINCT", "ALL", "UNION", "EXCEPT", "INTERSECT",
        "NULL", "IS", "LIKE", "BETWEEN", "CASE", "WHEN", "THEN", "ELSE", "END",
        "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "INDEX",
        "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION",
        "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "NULLIF",
        "CAST", "CONVERT", "VARCHAR", "INT", "INTEGER", "BIGINT", "TEXT",
        "BOOLEAN", "DATE", "TIMESTAMP", "FLOAT", "DECIMAL", "NUMERIC",
        "WITH", "RECURSIVE", "OVER", "PARTITION", "ROW_NUMBER", "RANK",
        "ASC", "DESC", "TRUE", "FALSE",
    ];
    const majorClauses = [
        "SELECT", "FROM", "WHERE", "JOIN", "INNER JOIN", "LEFT JOIN",
        "RIGHT JOIN", "FULL JOIN", "GROUP BY", "ORDER BY", "HAVING",
        "LIMIT", "UNION", "EXCEPT", "INTERSECT", "INSERT INTO",
        "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
        "WITH",
    ];
    let res = input;
    keywords.forEach(kw => {
        res = res.replace(new RegExp('\\b' + kw + '\\b', 'gi'), kw.toUpperCase());
    });
    majorClauses.forEach(clause => {
        res = res.replace(new RegExp('(^|\\s)' + clause + '\\s', 'gi'), (m) => '\n' + m.trim().toUpperCase() + ' ');
    });
    res = res.replace(/\s(AND|OR)\s/gi, (m) => '\n  ' + m.trim().toUpperCase() + ' ');
    return res.trim().replace(/\n{3,}/g, '\n\n');
}

/**
 * XML Formatting
 */
export async function xmlFormat(input) {
    input = input.trim();
    if (!input) return '';
    let indent = 0;
    let result = '';
    const lines = input.replace(/>\s*</g, '>\n<').split('\n');
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.match(/^<\/\w/)) indent--;
        result += '  '.repeat(Math.max(0, indent)) + line + '\n';
        if (line.match(/^<\w[^>]*[^/]>$/) && !line.match(/^<!/)) indent++;
    }
    return result.trim();
}

/**
 * CSS Formatting and Minification
 */
export async function cssFormat(input) {
    let r = input.replace(/\s+/g, ' ');
    r = r.replace(/\s*{\s*/g, ' {\n  ');
    r = r.replace(/\s*}\s*/g, '\n}\n\n');
    r = r.replace(/;\s*/g, ';\n  ');
    r = r.replace(/\s*:\s*/g, ': ');
    r = r.replace(/\n  \n/g, '\n');
    return r.trim();
}

export async function cssMinify(input) {
    let r = input.replace(/\/\*[\s\S]*?\*\//g, '');
    r = r.replace(/\s+/g, ' ');
    r = r.replace(/ ?([{};:,]) ?/g, '$1');
    r = r.replace(/;}/g, '}');
    return r.trim();
}

/**
 * HTML Formatting
 */
export async function htmlFormat(input) {
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
}
