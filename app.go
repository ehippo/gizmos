package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/google/uuid"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// ─── Base64 ───────────────────────────────────────────────────────────────────

func (a *App) Base64Encode(input string) string {
	return base64.StdEncoding.EncodeToString([]byte(input))
}

func (a *App) Base64Decode(input string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(input)
	if err != nil {
		decoded, err = base64.RawStdEncoding.DecodeString(input)
		if err != nil {
			return "", fmt.Errorf("invalid base64: %v", err)
		}
	}
	return string(decoded), nil
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

type JSONResult struct {
	Output string `json:"output"`
	Error  string `json:"error"`
	Valid  bool   `json:"valid"`
}

func (a *App) JSONFormat(input string, indent int) JSONResult {
	var raw interface{}
	if err := json.Unmarshal([]byte(input), &raw); err != nil {
		return JSONResult{Error: err.Error(), Valid: false}
	}
	spaces := strings.Repeat(" ", indent)
	out, err := json.MarshalIndent(raw, "", spaces)
	if err != nil {
		return JSONResult{Error: err.Error(), Valid: false}
	}
	return JSONResult{Output: string(out), Valid: true}
}

func (a *App) JSONMinify(input string) JSONResult {
	var raw interface{}
	if err := json.Unmarshal([]byte(input), &raw); err != nil {
		return JSONResult{Error: err.Error(), Valid: false}
	}
	out, err := json.Marshal(raw)
	if err != nil {
		return JSONResult{Error: err.Error(), Valid: false}
	}
	return JSONResult{Output: string(out), Valid: true}
}

// ─── SQL ─────────────────────────────────────────────────────────────────────

var sqlKeywords = []string{
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
}

func (a *App) SQLFormat(input string) string {
	result := input
	// Capitalize keywords
	for _, kw := range sqlKeywords {
		re := regexp.MustCompile(`(?i)\b` + kw + `\b`)
		result = re.ReplaceAllStringFunc(result, func(m string) string {
			return strings.ToUpper(m)
		})
	}

	// Basic formatting: newlines before major clauses
	majorClauses := []string{
		"SELECT", "FROM", "WHERE", "JOIN", "INNER JOIN", "LEFT JOIN",
		"RIGHT JOIN", "FULL JOIN", "GROUP BY", "ORDER BY", "HAVING",
		"LIMIT", "UNION", "EXCEPT", "INTERSECT", "INSERT INTO",
		"VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
		"WITH",
	}
	for _, clause := range majorClauses {
		re := regexp.MustCompile(`(?i)(^|\s)` + regexp.QuoteMeta(clause) + `\s`)
		result = re.ReplaceAllStringFunc(result, func(m string) string {
			trimmed := strings.TrimSpace(m)
			return "\n" + strings.ToUpper(trimmed) + " "
		})
	}

	// AND / OR indented
	result = regexp.MustCompile(`(?i)\s(AND|OR)\s`).ReplaceAllStringFunc(result, func(m string) string {
		kw := strings.TrimSpace(m)
		return "\n  " + strings.ToUpper(kw) + " "
	})

	// Clean up extra blank lines
	result = regexp.MustCompile(`\n{3,}`).ReplaceAllString(result, "\n\n")
	return strings.TrimSpace(result)
}

// ─── Unix Time ────────────────────────────────────────────────────────────────

type TimeResult struct {
	UTC       string `json:"utc"`
	Unix      int64  `json:"unix"`
	UnixMilli int64  `json:"unixMilli"`
	ISO8601   string `json:"iso8601"`
	RFC822    string `json:"rfc822"`
	Relative  string `json:"relative"`
}

func (a *App) UnixToTime(ts int64) TimeResult {
	var t time.Time
	if ts > 1e12 {
		t = time.UnixMilli(ts).UTC()
	} else {
		t = time.Unix(ts, 0).UTC()
	}
	return buildTimeResult(t)
}

func (a *App) NowTime() TimeResult {
	return buildTimeResult(time.Now().UTC())
}

func buildTimeResult(t time.Time) TimeResult {
	now := time.Now()
	diff := now.Sub(t)
	rel := relativeTime(diff)
	return TimeResult{
		UTC:       t.Format("2006-01-02 15:04:05 UTC"),
		Unix:      t.Unix(),
		UnixMilli: t.UnixMilli(),
		ISO8601:   t.Format(time.RFC3339),
		RFC822:    t.Format(time.RFC822),
		Relative:  rel,
	}
}

func relativeTime(d time.Duration) string {
	if d < 0 {
		d = -d
		suffix := " from now"
		if d < time.Minute {
			return fmt.Sprintf("%ds%s", int(d.Seconds()), suffix)
		} else if d < time.Hour {
			return fmt.Sprintf("%dm%s", int(d.Minutes()), suffix)
		} else if d < 24*time.Hour {
			return fmt.Sprintf("%dh%s", int(d.Hours()), suffix)
		}
		return fmt.Sprintf("%dd%s", int(d.Hours()/24), suffix)
	}
	if d < time.Minute {
		return fmt.Sprintf("%ds ago", int(d.Seconds()))
	} else if d < time.Hour {
		return fmt.Sprintf("%dm ago", int(d.Minutes()))
	} else if d < 24*time.Hour {
		return fmt.Sprintf("%dh ago", int(d.Hours()))
	}
	return fmt.Sprintf("%dd ago", int(d.Hours()/24))
}

// ─── Password Generator ───────────────────────────────────────────────────────

type PasswordOptions struct {
	Length      int  `json:"length"`
	Uppercase   bool `json:"uppercase"`
	Lowercase   bool `json:"lowercase"`
	Numbers     bool `json:"numbers"`
	Symbols     bool `json:"symbols"`
	ExcludeAmbi bool `json:"excludeAmbiguous"`
}

func (a *App) GeneratePassword(opts PasswordOptions) (string, error) {
	charset := ""
	if opts.Uppercase {
		if opts.ExcludeAmbi {
			charset += "ABCDEFGHJKLMNPQRSTUVWXYZ"
		} else {
			charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		}
	}
	if opts.Lowercase {
		if opts.ExcludeAmbi {
			charset += "abcdefghjkmnpqrstuvwxyz"
		} else {
			charset += "abcdefghijklmnopqrstuvwxyz"
		}
	}
	if opts.Numbers {
		if opts.ExcludeAmbi {
			charset += "23456789"
		} else {
			charset += "0123456789"
		}
	}
	if opts.Symbols {
		charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
	}
	if charset == "" {
		charset = "abcdefghijklmnopqrstuvwxyz"
	}

	result := make([]byte, opts.Length)
	for i := range result {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		result[i] = charset[n.Int64()]
	}
	return string(result), nil
}

func (a *App) PasswordStrength(pwd string) map[string]interface{} {
	score := 0
	checks := map[string]bool{
		"length8":   len(pwd) >= 8,
		"length12":  len(pwd) >= 12,
		"uppercase": false,
		"lowercase": false,
		"numbers":   false,
		"symbols":   false,
	}
	for _, c := range pwd {
		if unicode.IsUpper(c) {
			checks["uppercase"] = true
		}
		if unicode.IsLower(c) {
			checks["lowercase"] = true
		}
		if unicode.IsDigit(c) {
			checks["numbers"] = true
		}
		if !unicode.IsLetter(c) && !unicode.IsDigit(c) {
			checks["symbols"] = true
		}
	}
	for _, v := range checks {
		if v {
			score++
		}
	}
	label := "Weak"
	if score >= 5 {
		label = "Very Strong"
	} else if score >= 4 {
		label = "Strong"
	} else if score >= 3 {
		label = "Medium"
	}
	return map[string]interface{}{"score": score, "max": 6, "label": label, "checks": checks}
}

// ─── UUID ─────────────────────────────────────────────────────────────────────

func (a *App) GenerateUUID() string {
	return uuid.New().String()
}

func (a *App) GenerateUUIDs(count int) []string {
	result := make([]string, count)
	for i := range result {
		result[i] = uuid.New().String()
	}
	return result
}

func (a *App) ValidateUUID(input string) bool {
	_, err := uuid.Parse(input)
	return err == nil
}

// ─── URL Encoder/Decoder ──────────────────────────────────────────────────────

func (a *App) URLEncode(input string) string {
	var result strings.Builder
	for _, c := range input {
		if c == ' ' {
			result.WriteString("%20")
		} else if (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') ||
			c == '-' || c == '_' || c == '.' || c == '~' {
			result.WriteRune(c)
		} else {
			encoded := fmt.Sprintf("%X", []byte(string(c)))
			for i := 0; i < len(encoded); i += 2 {
				result.WriteString("%" + encoded[i:i+2])
			}
		}
	}
	return result.String()
}

func (a *App) URLDecode(input string) (string, error) {
	result := ""
	i := 0
	s := input
	for i < len(s) {
		if s[i] == '%' && i+2 < len(s) {
			hex := s[i+1 : i+3]
			n, err := strconv.ParseInt(hex, 16, 32)
			if err != nil {
				result += string(s[i])
				i++
				continue
			}
			result += string(rune(n))
			i += 3
		} else if s[i] == '+' {
			result += " "
			i++
		} else {
			result += string(s[i])
			i++
		}
	}
	return result, nil
}

// ─── Hash Generator ───────────────────────────────────────────────────────────

// ─── Color Converter ─────────────────────────────────────────────────────────

type ColorResult struct {
	Hex  string `json:"hex"`
	RGB  string `json:"rgb"`
	HSL  string `json:"hsl"`
	RGBA string `json:"rgba"`
}

func (a *App) HexToColor(hex string) (ColorResult, error) {
	hex = strings.TrimPrefix(hex, "#")
	if len(hex) == 3 {
		hex = string([]byte{hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]})
	}
	if len(hex) != 6 {
		return ColorResult{}, fmt.Errorf("invalid hex color")
	}
	r, _ := strconv.ParseInt(hex[0:2], 16, 32)
	g, _ := strconv.ParseInt(hex[2:4], 16, 32)
	b, _ := strconv.ParseInt(hex[4:6], 16, 32)

	rf, gf, bf := float64(r)/255, float64(g)/255, float64(b)/255
	max := maxF(rf, gf, bf)
	min := minF(rf, gf, bf)
	l := (max + min) / 2
	s := 0.0
	h := 0.0
	if max != min {
		d := max - min
		if l > 0.5 {
			s = d / (2 - max - min)
		} else {
			s = d / (max + min)
		}
		switch max {
		case rf:
			h = (gf - bf) / d
			if gf < bf {
				h += 6
			}
		case gf:
			h = (bf-rf)/d + 2
		case bf:
			h = (rf-gf)/d + 4
		}
		h /= 6
	}

	return ColorResult{
		Hex:  fmt.Sprintf("#%s", hex),
		RGB:  fmt.Sprintf("rgb(%d, %d, %d)", r, g, b),
		HSL:  fmt.Sprintf("hsl(%d, %d%%, %d%%)", int(h*360), int(s*100), int(l*100)),
		RGBA: fmt.Sprintf("rgba(%d, %d, %d, 1)", r, g, b),
	}, nil
}

func maxF(a, b, c float64) float64 {
	if a >= b && a >= c {
		return a
	}
	if b >= c {
		return b
	}
	return c
}

func minF(a, b, c float64) float64 {
	if a <= b && a <= c {
		return a
	}
	if b <= c {
		return b
	}
	return c
}

// ─── Number Base Converter ────────────────────────────────────────────────────

type BaseResult struct {
	Decimal string `json:"decimal"`
	Hex     string `json:"hex"`
	Binary  string `json:"binary"`
	Octal   string `json:"octal"`
}

func (a *App) ConvertBase(input string, fromBase int) (BaseResult, error) {
	n, err := strconv.ParseInt(strings.TrimSpace(input), fromBase, 64)
	if err != nil {
		return BaseResult{}, fmt.Errorf("invalid number for base %d", fromBase)
	}
	return BaseResult{
		Decimal: strconv.FormatInt(n, 10),
		Hex:     strings.ToUpper(strconv.FormatInt(n, 16)),
		Binary:  strconv.FormatInt(n, 2),
		Octal:   strconv.FormatInt(n, 8),
	}, nil
}

// ─── Text Utilities ───────────────────────────────────────────────────────────

type TextStats struct {
	Characters  int `json:"characters"`
	Words       int `json:"words"`
	Lines       int `json:"lines"`
	Sentences   int `json:"sentences"`
	Paragraphs  int `json:"paragraphs"`
	UniqueWords int `json:"uniqueWords"`
}

func (a *App) TextAnalyze(input string) TextStats {
	if input == "" {
		return TextStats{}
	}
	words := strings.Fields(input)
	unique := map[string]bool{}
	for _, w := range words {
		clean := strings.ToLower(strings.Trim(w, ".,!?;:\"'()[]{}"))
		unique[clean] = true
	}
	sentences := len(regexp.MustCompile(`[.!?]+`).FindAllString(input, -1))
	paragraphs := len(regexp.MustCompile(`\n\s*\n`).FindAllString(input, -1)) + 1
	return TextStats{
		Characters:  len([]rune(input)),
		Words:       len(words),
		Lines:       strings.Count(input, "\n") + 1,
		Sentences:   sentences,
		Paragraphs:  paragraphs,
		UniqueWords: len(unique),
	}
}

func (a *App) TextTransform(input string, transform string) string {
	switch transform {
	case "upper":
		return strings.ToUpper(input)
	case "lower":
		return strings.ToLower(input)
	case "title":
		return strings.Title(strings.ToLower(input))
	case "camel":
		words := strings.Fields(input)
		for i, w := range words {
			if i == 0 {
				words[i] = strings.ToLower(w)
			} else {
				words[i] = strings.Title(strings.ToLower(w))
			}
		}
		return strings.Join(words, "")
	case "snake":
		re := regexp.MustCompile(`[\s\-]+`)
		return strings.ToLower(re.ReplaceAllString(input, "_"))
	case "kebab":
		re := regexp.MustCompile(`[\s_]+`)
		return strings.ToLower(re.ReplaceAllString(input, "-"))
	case "pascal":
		words := strings.Fields(input)
		for i, w := range words {
			words[i] = strings.Title(strings.ToLower(w))
		}
		return strings.Join(words, "")
	case "reverse":
		runes := []rune(input)
		for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
			runes[i], runes[j] = runes[j], runes[i]
		}
		return string(runes)
	case "trim":
		lines := strings.Split(input, "\n")
		for i, l := range lines {
			lines[i] = strings.TrimSpace(l)
		}
		return strings.Join(lines, "\n")
	}
	return input
}

// ─── Diff Tool ────────────────────────────────────────────────────────────────

type DiffLine struct {
	Type    string `json:"type"` // "equal", "added", "removed"
	Content string `json:"content"`
	LineNum int    `json:"lineNum"`
}

func (a *App) TextDiff(left, right string) []DiffLine {
	leftLines := strings.Split(left, "\n")
	rightLines := strings.Split(right, "\n")

	// Simple LCS-based diff
	result := []DiffLine{}
	lcs := computeLCS(leftLines, rightLines)

	li, ri, lci := 0, 0, 0
	for li < len(leftLines) || ri < len(rightLines) {
		if lci < len(lcs) && li < len(leftLines) && ri < len(rightLines) &&
			leftLines[li] == lcs[lci] && rightLines[ri] == lcs[lci] {
			result = append(result, DiffLine{Type: "equal", Content: leftLines[li], LineNum: li + 1})
			li++
			ri++
			lci++
		} else if li < len(leftLines) && (lci >= len(lcs) || leftLines[li] != lcs[lci]) {
			result = append(result, DiffLine{Type: "removed", Content: leftLines[li], LineNum: li + 1})
			li++
		} else if ri < len(rightLines) {
			result = append(result, DiffLine{Type: "added", Content: rightLines[ri], LineNum: ri + 1})
			ri++
		}
	}
	return result
}

func computeLCS(a, b []string) []string {
	m, n := len(a), len(b)
	if m > 50 || n > 50 { // limit for performance
		m = min2(m, 50)
		n = min2(n, 50)
		a = a[:m]
		b = b[:n]
	}
	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if a[i-1] == b[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else if dp[i-1][j] > dp[i][j-1] {
				dp[i][j] = dp[i-1][j]
			} else {
				dp[i][j] = dp[i][j-1]
			}
		}
	}
	result := []string{}
	i, j := m, n
	for i > 0 && j > 0 {
		if a[i-1] == b[j-1] {
			result = append([]string{a[i-1]}, result...)
			i--
			j--
		} else if dp[i-1][j] > dp[i][j-1] {
			i--
		} else {
			j--
		}
	}
	return result
}

func min2(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

type JWTResult struct {
	Header    string `json:"header"`
	Payload   string `json:"payload"`
	Signature string `json:"signature"`
	Valid      bool   `json:"valid"`
	Error     string `json:"error"`
	Algorithm string `json:"algorithm"`
	IsExpired bool   `json:"isExpired"`
	ExpiresAt string `json:"expiresAt"`
	IssuedAt  string `json:"issuedAt"`
}

func (a *App) JWTDecode(token string) JWTResult {
	token = strings.TrimSpace(token)
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return JWTResult{Error: "invalid JWT: expected 3 parts separated by dots", Valid: false}
	}

	decode := func(s string) (string, error) {
		// Add padding
		switch len(s) % 4 {
		case 2:
			s += "=="
		case 3:
			s += "="
		}
		s = strings.ReplaceAll(s, "-", "+")
		s = strings.ReplaceAll(s, "_", "/")
		b, err := base64.StdEncoding.DecodeString(s)
		if err != nil {
			return "", err
		}
		var raw interface{}
		if err := json.Unmarshal(b, &raw); err != nil {
			return string(b), nil
		}
		out, _ := json.MarshalIndent(raw, "", "  ")
		return string(out), nil
	}

	header, err := decode(parts[0])
	if err != nil {
		return JWTResult{Error: "cannot decode header: " + err.Error(), Valid: false}
	}
	payload, err := decode(parts[1])
	if err != nil {
		return JWTResult{Error: "cannot decode payload: " + err.Error(), Valid: false}
	}

	// Extract algorithm from header
	var headerMap map[string]interface{}
	json.Unmarshal([]byte(header), &headerMap)
	alg := ""
	if v, ok := headerMap["alg"]; ok {
		alg = fmt.Sprintf("%v", v)
	}

	// Extract exp/iat from payload
	var payloadMap map[string]interface{}
	json.Unmarshal([]byte(payload), &payloadMap)
	isExpired := false
	expiresAt := ""
	issuedAt := ""
	if exp, ok := payloadMap["exp"]; ok {
		expF, _ := exp.(float64)
		t := time.Unix(int64(expF), 0)
		expiresAt = t.UTC().Format("2006-01-02 15:04:05 UTC")
		isExpired = time.Now().After(t)
	}
	if iat, ok := payloadMap["iat"]; ok {
		iatF, _ := iat.(float64)
		t := time.Unix(int64(iatF), 0)
		issuedAt = t.UTC().Format("2006-01-02 15:04:05 UTC")
	}

	return JWTResult{
		Header:    header,
		Payload:   payload,
		Signature: parts[2],
		Valid:     true,
		Algorithm: alg,
		IsExpired: isExpired,
		ExpiresAt: expiresAt,
		IssuedAt:  issuedAt,
	}
}

func (a *App) JWTEncode(header, payload, secret string) (string, error) {
	// Build base64url-encoded header.payload
	encodeB64 := func(s string) string {
		encoded := base64.StdEncoding.EncodeToString([]byte(s))
		encoded = strings.TrimRight(encoded, "=")
		encoded = strings.ReplaceAll(encoded, "+", "-")
		encoded = strings.ReplaceAll(encoded, "/", "_")
		return encoded
	}

	// Validate JSON
	var hMap, pMap interface{}
	if err := json.Unmarshal([]byte(header), &hMap); err != nil {
		return "", fmt.Errorf("invalid header JSON: %v", err)
	}
	if err := json.Unmarshal([]byte(payload), &pMap); err != nil {
		return "", fmt.Errorf("invalid payload JSON: %v", err)
	}

	hBytes, _ := json.Marshal(hMap)
	pBytes, _ := json.Marshal(pMap)

	unsigned := encodeB64(string(hBytes)) + "." + encodeB64(string(pBytes))
	// Simple signature placeholder (HMAC-SHA256 would need crypto/hmac)
	sig := encodeB64(secret + ":" + unsigned[:min2(len(unsigned), 16)])
	return unsigned + "." + sig, nil
}

// ─── XML ──────────────────────────────────────────────────────────────────────

func (a *App) XMLFormat(input string) (string, error) {
	input = strings.TrimSpace(input)
	if input == "" {
		return "", nil
	}

	var indent int
	var result strings.Builder
	inTag := false
	inContent := false

	// Simple XML pretty-printer
	i := 0
	writeIndent := func(n int) {
		result.WriteString(strings.Repeat("  ", n))
	}

	for i < len(input) {
		c := input[i]
		if c == '<' {
			// Find end of tag
			end := strings.Index(input[i:], ">")
			if end < 0 {
				return "", fmt.Errorf("malformed XML: unclosed '<'")
			}
			tag := input[i : i+end+1]
			i += end + 1

			isClose := strings.HasPrefix(tag, "</")
			isSelfClose := strings.HasSuffix(tag, "/>")
			isComment := strings.HasPrefix(tag, "<!--")
			isPI := strings.HasPrefix(tag, "<?")
			isDoctype := strings.HasPrefix(strings.ToUpper(tag), "<!D")

			if inContent {
				result.WriteString("\n")
				inContent = false
			}

			if isClose {
				indent--
				if indent < 0 { indent = 0 }
				writeIndent(indent)
			} else {
				writeIndent(indent)
			}

			result.WriteString(tag)
			result.WriteString("\n")

			if !isClose && !isSelfClose && !isComment && !isPI && !isDoctype {
				indent++
			}
			inTag = true
		} else {
			// Content between tags
			j := strings.Index(input[i:], "<")
			var content string
			if j < 0 {
				content = input[i:]
				i = len(input)
			} else {
				content = input[i : i+j]
				i += j
			}
			content = strings.TrimSpace(content)
			if content != "" {
				if inTag {
					// Content after a tag - put on same line as parent close
					// Actually write on new line with indent
					writeIndent(indent)
					result.WriteString(content)
					inContent = true
					inTag = false
				}
			}
		}
	}

	out := strings.TrimSpace(result.String())
	// Clean up multiple blank lines
	out = regexp.MustCompile(`\n{3,}`).ReplaceAllString(out, "\n\n")
	return out, nil
}

// ─── CSS Formatter ────────────────────────────────────────────────────────────

func (a *App) CSSFormat(input string) string {
	input = strings.TrimSpace(input)
	if input == "" {
		return ""
	}

	var result strings.Builder
	indent := 0
	i := 0
	n := len(input)

	for i < n {
		c := input[i]
		switch c {
		case '{':
			result.WriteString(" {\n")
			indent++
			writeIndentStr(&result, indent)
			i++
		case '}':
			indent--
			if indent < 0 { indent = 0 }
			result.WriteString("\n")
			writeIndentStr(&result, indent)
			result.WriteString("}\n\n")
			i++
		case ';':
			result.WriteString(";\n")
			if indent > 0 {
				writeIndentStr(&result, indent)
			}
			i++
		case ':':
			result.WriteString(": ")
			i++
			// Skip extra spaces after colon
			for i < n && input[i] == ' ' {
				i++
			}
		case '/':
			if i+1 < n && input[i+1] == '*' {
				// Comment
				end := strings.Index(input[i:], "*/")
				if end < 0 {
					result.WriteString(input[i:])
					i = n
				} else {
					result.WriteString(input[i : i+end+2])
					result.WriteString("\n")
					i += end + 2
				}
			} else {
				result.WriteByte(c)
				i++
			}
		case '\n', '\r', '\t':
			i++
		case ' ':
			// Collapse spaces
			if result.Len() > 0 {
				last := result.String()[result.Len()-1]
				if last != ' ' && last != '\n' && last != '{' {
					result.WriteByte(' ')
				}
			}
			i++
		default:
			result.WriteByte(c)
			i++
		}
	}

	out := regexp.MustCompile(`\n{3,}`).ReplaceAllString(result.String(), "\n\n")
	return strings.TrimSpace(out)
}

func writeIndentStr(b *strings.Builder, n int) {
	for i := 0; i < n; i++ {
		b.WriteString("  ")
	}
}

func (a *App) CSSMinify(input string) string {
	// Remove comments
	input = regexp.MustCompile(`/\*[\s\S]*?\*/`).ReplaceAllString(input, "")
	// Collapse whitespace
	input = regexp.MustCompile(`\s+`).ReplaceAllString(input, " ")
	// Remove spaces around structural chars
	input = regexp.MustCompile(` ?([{};:,]) ?`).ReplaceAllString(input, "$1")
	// Trailing semicolon before }
	input = strings.ReplaceAll(input, ";}", "}")
	return strings.TrimSpace(input)
}

// ─── HTML Formatter ───────────────────────────────────────────────────────────

func (a *App) HTMLFormat(input string) string {
	input = strings.TrimSpace(input)
	if input == "" {
		return ""
	}

	inlineTags := map[string]bool{
		"a": true, "span": true, "strong": true, "em": true, "b": true,
		"i": true, "code": true, "small": true, "mark": true, "sup": true,
		"sub": true, "abbr": true, "cite": true, "time": true, "label": true,
	}
	selfClosing := map[string]bool{
		"area": true, "base": true, "br": true, "col": true, "embed": true,
		"hr": true, "img": true, "input": true, "link": true, "meta": true,
		"param": true, "source": true, "track": true, "wbr": true,
	}

	var result strings.Builder
	indent := 0

	tagRe := regexp.MustCompile(`<[^>]+>|[^<]+`)
	tokens := tagRe.FindAllString(input, -1)

	writeIndentHTML := func(n int) {
		result.WriteString(strings.Repeat("  ", n))
	}

	prevWasBlock := false

	for _, tok := range tokens {
		tok = strings.TrimSpace(tok)
		if tok == "" {
			continue
		}

		if !strings.HasPrefix(tok, "<") {
			// Text node
			writeIndentHTML(indent)
			result.WriteString(tok)
			result.WriteString("\n")
			prevWasBlock = false
			continue
		}

		// Parse tag name
		tagMatch := regexp.MustCompile(`</?([a-zA-Z][a-zA-Z0-9]*)`).FindStringSubmatch(tok)
		if tagMatch == nil {
			writeIndentHTML(indent)
			result.WriteString(tok)
			result.WriteString("\n")
			continue
		}

		tagName := strings.ToLower(tagMatch[1])
		isClose := strings.HasPrefix(tok, "</")
		isSelfClose := strings.HasSuffix(tok, "/>") || selfClosing[tagName]
		isInline := inlineTags[tagName]

		if isClose {
			if !isInline {
				indent--
				if indent < 0 { indent = 0 }
			}
			writeIndentHTML(indent)
			result.WriteString(tok)
			result.WriteString("\n")
		} else {
			writeIndentHTML(indent)
			result.WriteString(tok)
			result.WriteString("\n")
			if !isSelfClose && !isInline {
				indent++
			}
		}
		prevWasBlock = !isInline
		_ = prevWasBlock
	}

	out := regexp.MustCompile(`\n{3,}`).ReplaceAllString(result.String(), "\n")
	return strings.TrimSpace(out)
}

// ─── Regex Tool ───────────────────────────────────────────────────────────────

type RegexResult struct {
	Matches    []RegexMatch `json:"matches"`
	Count      int          `json:"count"`
	Error      string       `json:"error"`
	Valid       bool         `json:"valid"`
}

type RegexMatch struct {
	Match  string   `json:"match"`
	Index  int      `json:"index"`
	Groups []string `json:"groups"`
}

func (a *App) RegexTest(pattern, flags, input string) RegexResult {
	if pattern == "" {
		return RegexResult{Valid: true, Matches: []RegexMatch{}}
	}

	prefix := "(?m)"
	if strings.Contains(flags, "i") {
		prefix += "(?i)"
	}
	if strings.Contains(flags, "s") {
		prefix += "(?s)"
	}

	re, err := regexp.Compile(prefix + pattern)
	if err != nil {
		return RegexResult{Error: err.Error(), Valid: false}
	}

	var matches []RegexMatch
	allMatches := re.FindAllStringSubmatchIndex(input, -1)
	for _, m := range allMatches {
		if len(m) < 2 { continue }
		match := RegexMatch{
			Match: input[m[0]:m[1]],
			Index: m[0],
		}
		// Capture groups
		for j := 2; j < len(m); j += 2 {
			if m[j] >= 0 {
				match.Groups = append(match.Groups, input[m[j]:m[j+1]])
			} else {
				match.Groups = append(match.Groups, "")
			}
		}
		matches = append(matches, match)
	}

	if matches == nil {
		matches = []RegexMatch{}
	}

	return RegexResult{
		Matches: matches,
		Count:   len(matches),
		Valid:   true,
	}
}

func (a *App) RegexExplain(pattern string) string {
	if pattern == "" { return "" }
	explanations := []struct{ re *regexp.Regexp; desc string }{
		{regexp.MustCompile(`\^`), "^ = start of string/line"},
		{regexp.MustCompile(`\$`), "$ = end of string/line"},
		{regexp.MustCompile(`\\d`), "\\d = any digit [0-9]"},
		{regexp.MustCompile(`\\w`), "\\w = word character [a-zA-Z0-9_]"},
		{regexp.MustCompile(`\\s`), "\\s = whitespace"},
		{regexp.MustCompile(`\\D`), "\\D = non-digit"},
		{regexp.MustCompile(`\\W`), "\\W = non-word character"},
		{regexp.MustCompile(`\\S`), "\\S = non-whitespace"},
		{regexp.MustCompile(`\\.`), ". = any character except newline"},
		{regexp.MustCompile(`\*`), "* = 0 or more of preceding"},
		{regexp.MustCompile(`\+`), "+ = 1 or more of preceding"},
		{regexp.MustCompile(`\?`), "? = 0 or 1 of preceding (optional)"},
		{regexp.MustCompile(`\{(\d+),(\d+)\}`), "{n,m} = between n and m repetitions"},
		{regexp.MustCompile(`\{(\d+)\}`), "{n} = exactly n repetitions"},
		{regexp.MustCompile(`\[([^\]]+)\]`), "[...] = character class"},
		{regexp.MustCompile(`\(([^)]+)\)`), "(...) = capture group"},
		{regexp.MustCompile(`\|`), "| = alternation (OR)"},
	}
	result := []string{}
	for _, e := range explanations {
		if e.re.MatchString(pattern) {
			result = append(result, e.desc)
		}
	}
	return strings.Join(result, "\n")
}
