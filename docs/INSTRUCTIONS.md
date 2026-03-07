# Gizmos — Agent Development Instructions

You are contributing to **Gizmos**, a cross-platform developer utilities app delivered as both a desktop app (Wails + Go) and a web app (Vite + React). The goal is to be the best open-source alternative to DevToys and DevUtils.

Read this entire document before writing a single line of code.

---

## 1. Project structure

```
gizmos/
├── main.go                    # Wails entry point — do not modify
├── app.go                     # Go App struct — minimal, all logic is in frontend
├── wails.json                 # Wails config
├── go.mod / go.sum
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx           # React root — do not modify
        ├── App.jsx            # Sidebar, search, routing, theme switching
        ├── lib.js             # Pure utility functions — no React, no side effects
        ├── themes.js          # Theme definitions + applyTheme / saveTheme helpers
        ├── styles.css         # All styles — single file, CSS custom properties
        ├── components/
        │   ├── ui.jsx         # Shared UI primitives (see §4)
        │   └── RecipeTool.jsx # Command-builder shared by Git and Kubectl
        └── tools/             # One file per tool or logical group
            ├── Encoder.jsx    # Base64Tool + URLTool (shared EncoderTool)
            ├── JWT.jsx
            ├── Formatter.jsx  # JsonFormatterTool + HtmlFormatterTool + …
            ├── Timestamp.jsx
            ├── Calculator.jsx
            ├── Color.jsx
            ├── Hash.jsx
            ├── Text.jsx
            ├── Regexp.jsx
            ├── Diff.jsx
            ├── Git.jsx
            └── Kubectl.jsx
```

---

## 2. Architecture rules

### Go backend
- `app.go` holds only the Wails `App` struct and lifecycle methods (`startup`, `domReady`, `shutdown`).
- **All tool logic lives in the frontend.** Do not add Go functions for encoding, hashing, formatting, or any computation. The frontend uses browser-native APIs (`crypto.subtle`, `TextEncoder`, `URL`, etc.) and npm libraries.
- Only add Go backend methods if the feature is genuinely impossible in the browser (e.g., native file system dialogs, OS clipboard access on platforms where the Web API is blocked).

### Frontend
- **React 18 + Vite.** Functional components and hooks only. No class components.
- **No global state** (no Redux, no Zustand, no Context for tool data). Each tool manages its own local state with `useState`/`useMemo`/`useCallback`.
- **No router.** Tool switching is a simple `active` state in `App.jsx`. Adding a router is not needed and not wanted.
- All utility functions go in `lib.js` as **pure functions** (input → output, no side effects, no imports from React). This keeps them easy to test and reuse.

---

## 3. Registering a new tool

**Step 1** — Create `frontend/src/tools/MyTool.jsx`:
```jsx
import { ToolShell } from '../components/ui'

export default function MyTool() {
  return (
    <ToolShell title="My Tool">
      {/* content */}
    </ToolShell>
  )
}
```

**Step 2** — Add one row to the `TOOLS` array in `App.jsx`:
```js
{ id: 'mytool', label: 'My Tool', icon: SomeIcon, component: MyTool, group: 'Converters' }
```

Groups are: `Encoders`, `Formatters`, `Converters`, `Generators`, `DevOps`. Add a new group only when nothing existing fits.

**Step 3** — Add the import to `App.jsx`.

That's it. No routing config, no index file, no context registration.

---

## 4. UI component library — `components/ui.jsx`

Always use these. Never create one-off button or layout components inline.

| Component | Props | Purpose |
|-----------|-------|---------|
| `ToolShell` | `title: string` | Outer wrapper for every tool. Provides the header bar and scrollable body. Always the root element of a tool. |
| `Field` | `label: string, action?: ReactNode, grow?: bool` | Labelled input/output area. `grow` makes it fill remaining vertical space. Put `CopyButton` or `IconButton` in `action`. |
| `Toggle` | `options: string[], value: string, onChange: fn` | Button-group tab/mode switcher. Use for 2–5 mutually exclusive options. |
| `CopyButton` | `text: string` | Copy-to-clipboard button. Always disabled (not hidden) when `text` is empty. |
| `IconButton` | `icon: LucideIcon, label: string, onClick: fn, disabled?: bool, title?: string` | Any action button (Clear, Minify, Generate, Verify, etc.). Same visual weight as `CopyButton`. |
| `KVGrid` | `rows: {key: string, value: string}[]` | Key-value result table with per-row copy buttons. Use for multi-field results (hashes, timestamp formats, color values). |
| `StatusBadge` | `ok: boolean, text: string` | Inline success/error indicator. |

**Never use:**
- Raw `<button className="btn-icon">` inside tools — use `IconButton` or `CopyButton`
- `<button className="btn-ghost">` or `<button className="btn-primary">` — these classes are deleted
- Inline `style={{}}` for layout — use CSS classes
- Conditional rendering to hide output areas — show them always with placeholder text/values (see §6)

---

## 5. CSS rules — `styles.css`

**Single file.** All styles live in `styles.css`. Do not create `.module.css` files or use CSS-in-JS.

### Design tokens (CSS custom properties)
All colours, spacing, and typography come from CSS custom properties set on `:root` and overridden per-theme. Never hard-code hex colours in components. Use only:

```
Backgrounds:  --bg0 (darkest) → --bg4 (lightest)
Borders:      --border, --border-light
Text:         --text0 (brightest) → --text3 (dimmest)
Accent:       --accent, --accent-hover, --accent-light, --accent-text
Semantic:     --green, --blue, --yellow, --orange, --red
Typography:   --font-mono, --font-ui
Layout:       --radius, --hdr, --sidebar-w
```

### Class naming
- Tool-specific classes are prefixed with the tool name: `.diff-view`, `.regexp-mark`, `.calc-history`, `.hash-dropzone`
- Shared layout classes: `.row`, `.split-row`, `.gap-sm`, `.field-grow`, `.flex-textarea`
- Output colour overrides: `.output-text` (green), `.output-blue`, `.output-orange`

### Adding CSS for a new tool
Append a clearly commented section at the bottom of `styles.css`:
```css
/* ── My Tool ─────────────────────────────────────────────────────────────── */
.mytool-xyz { … }
```

### Cleanup rule
**When you delete a component or tool, immediately delete its CSS classes.** Search for the tool's prefix in `styles.css` and remove all matching blocks. Orphaned CSS is not acceptable.

---

## 6. UX standards — every tool must follow these

### Always-visible output areas
Output textareas, KVGrids, and result panels are **always rendered** — never conditionally mounted. Show placeholder values when empty:
- Textareas: `placeholder="Result will appear here…"` (CSS placeholder, textarea stays in DOM)
- `KVGrid`: pass rows with `value: '—'` when no result yet
- Decoded panels (JWT, Color): render with empty string, use `placeholder` attribute

Rationale: avoids layout shift, gives users a clear sense of where output will appear.

### Copy buttons are always visible, never hidden
`CopyButton` is always rendered. It is automatically disabled (not hidden) when `text` is falsy — the `CopyButton` component handles this internally. Never write `{output && <CopyButton text={output} />}`.

### Button style consistency
All action buttons in tool UIs use `IconButton` or `CopyButton`. They share the `.btn-icon` style. No tool should have a button that looks heavier or more prominent than others in the toolbar.

### Error display
Errors always use `<StatusBadge ok={false} text={...} />`. Errors appear between the toolbar row and the output area — never inside the output textarea itself.

### Split pane layout
Tools with input + output use `<div className="split-row">` with `<Field ... grow>` on both sides. This gives equal 50/50 split that fills available height. The pattern:
```jsx
<div className="split-row">
  <Field label="Input" action={<CopyButton text={input} />} grow>
    <textarea className="flex-textarea" ... />
  </Field>
  <Field label="Output" action={<CopyButton text={output} />} grow>
    <textarea className="flex-textarea output-text" readOnly ... />
  </Field>
</div>
```

### Toolbar row
Controls above the content (mode toggles, dialect selectors, action buttons) go in:
```jsx
<div className="row">
  <Toggle ... />
  <IconButton ... />
  <CopyButton ... />
</div>
```

---

## 7. Shared component patterns

### EncoderTool — for encode/decode tools
`Encoder.jsx` exports `Base64Tool` and `URLTool`. Both use a shared `EncoderTool(encode, decode)` internal component. **When adding a new encode/decode tool** (hex, binary, HTML entities, etc.), add it to `Encoder.jsx` as another named export using the same pattern. Do not create a new file.

### FormatterTool — for language formatters
`Formatter.jsx` exports `JsonFormatterTool`, `HtmlFormatterTool`, etc. All share a single `FormatterTool({ lang })` component and a `runFormatter(lang, value, opts)` dispatcher. **When adding a new formatter** (YAML, TOML, etc.), add a case to `runFormatter` and export a new `YamlFormatterTool` named export. Add it to the `TOOLS` array and register the library in `package.json`.

### RecipeTool — for command builders
`RecipeTool.jsx` is the shared component for Git and Kubectl. **When adding a new command-builder tool** (Docker, AWS CLI, etc.), create a new tool file that imports `RecipeTool` and passes a `recipes` data structure. Do not modify `RecipeTool.jsx` itself unless fixing a bug.

---

## 8. Library policy

### Use a library when
- The domain is genuinely complex: JWT signing (`jose`), SQL formatting (`sql-formatter`), HTML/CSS beautifying (`js-beautify`), diffing (`diff`)
- Implementing correctly from scratch would be 50+ lines of brittle code

### Do not add a library when
- The browser already does it: `btoa`/`atob` for Base64, `encodeURIComponent` for URL encoding, `JSON.parse`/`JSON.stringify` for JSON, `crypto.subtle` for hashing, `TextEncoder`/`TextDecoder`
- It's a minor formatting helper (a few lines in `lib.js` is fine)
- It solves only one small part of one tool

### Approved libraries (already in `package.json`)
```
jose          — JWT sign/verify
sql-formatter — SQL formatting with dialect support
js-beautify   — HTML, XML, CSS formatting
diff          — Line and word diffing
lucide-react  — Icons (use only from this library)
```

Before adding any new dependency, ask: does `lib.js` cover it in under 30 lines? If yes, write it there.

---

## 9. lib.js conventions

- Pure functions only. No `import` from React. No `useState`. No side effects.
- Each function is documented with a one-line comment stating input/output contract.
- Async functions (e.g., `hashAllAlgorithms`) are fine — they use `crypto.subtle` which returns Promises.
- Group functions by domain with a header comment: `// ─── Base64 ───`
- Do not put JSX, component code, or CSS class names here.

---

## 10. Themes

Five themes are defined in `themes.js`: VS Code Dark, Monokai, Nord, Light, Solarized Dark. Each is a flat object of CSS custom property overrides.

To add a new theme:
1. Add an entry to the `THEMES` object in `themes.js` with all required vars (copy an existing theme as template).
2. No other changes needed — the theme selector in `App.jsx` reads `THEMES` automatically.

To test a theme: all tool UIs must look correct in both a dark theme and the Light theme. Pay particular attention to `.output-text` (green), `.output-blue`, badge colours, and diff line colours — these use semantic vars, so they'll shift per theme.

---

## 11. Keyboard shortcuts

| Shortcut | Behaviour |
|----------|-----------|
| `Ctrl/Cmd + F` | Focus the sidebar search bar |
| `Escape` in search | Clear query and blur |
| `Enter` in search | Navigate to first result |

When adding keyboard shortcuts inside a tool, use a `useEffect` that adds/removes a `keydown` listener on the tool's mount. Scope the shortcut so it only fires when a relevant input inside that tool is focused (check `e.target`). Do not add global shortcuts that would conflict with browser or OS defaults.

---

## 12. Delivery targets

### Desktop (Wails)
- Built with `wails build` → native binary for macOS, Windows, Linux
- `main.go` and `app.go` must stay minimal — Wails only needs the struct and lifecycle methods
- The frontend is embedded in the binary at build time via Wails asset embedding

### Web
- Built with `cd frontend && npm run build` → static files in `frontend/dist/`
- Must work without a Go backend — all tool logic is browser-native
- `app.go` must not expose any Go methods that a standalone web build would depend on
- To verify web compatibility: `npm run build && npm run preview` in the `frontend/` directory

Both targets must always work. Any change that breaks one of them is not acceptable.

---

## 13. Before committing a change — checklist

Work through every item. Do not skip.

**Code**
- [ ] New tool is registered in `TOOLS` array in `App.jsx`
- [ ] Orphaned files deleted (old tool files no longer imported)
- [ ] No `btn-ghost`, `btn-primary`, or raw `<button className="btn-icon">` inside tools
- [ ] All output areas are always-rendered with placeholder (not conditionally mounted)
- [ ] `CopyButton` is always rendered, never conditionally (`{x && <CopyButton>}` is wrong)
- [ ] No hardcoded hex colours — CSS custom properties only
- [ ] No inline `style={{}}` for layout or colour
- [ ] New utility functions are in `lib.js`, not inlined in components
- [ ] No new global state or context added

**CSS**
- [ ] New CSS classes added to `styles.css` under a named section
- [ ] Deleted component's CSS classes removed from `styles.css`
- [ ] No orphaned CSS classes (search for the class name, verify it's still used)
- [ ] New classes use the tool-name prefix: `.mytool-xyz`

**Libraries**
- [ ] No new dependency added for something coverable by `lib.js` in < 30 lines
- [ ] If a library was added, it's in `package.json` and justified

**UX**
- [ ] Tool tested in VS Code Dark theme and Light theme
- [ ] Tool works correctly at narrow width (sidebar collapsed on mobile)
- [ ] Errors shown via `StatusBadge`, not via `alert()` or console

**Build**
- [ ] `cd frontend && npm run build` succeeds (web target)
- [ ] `wails build` succeeds (desktop target) — or confirm Go files were not touched

---

## 14. What good looks like — reference implementations

Study these before writing a new tool:

**Simple encode/decode:** `Encoder.jsx` — shared logic via props, split-row layout, always-visible output, consistent CopyButton placement.

**Multi-format tool:** `Formatter.jsx` — one internal component parameterised by `lang`, shared `runFormatter` dispatcher, lang-specific controls in a toolbar row, error above the panes.

**Multi-tab tool:** `JWT.jsx` — tabs via `Toggle`, each tab is a named function component, all output areas always visible with placeholders, `split-row` used in Create and Verify tabs.

**Key-value output:** `Timestamp.jsx`, `Color.jsx`, `Hash.jsx` — all use `KVGrid` with placeholder `'—'` rows when no result.

**Command builder:** `Git.jsx` / `Kubectl.jsx` — data-only files that import `RecipeTool` and pass a `RECIPES` structure. No layout code.

**Complex layout:** `Diff.jsx` — inputs side-by-side above, unified diff output below, line numbers in gutter, word-diff mode toggle.