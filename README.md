# Gizmos

A VSCode-style developer toolbox desktop app built with [Wails](https://wails.io) (Go + React). All processing happens locally — no data leaves your machine.

![Gizmos screenshot](docs/screenshot.png)

## Tools

| Group | Tool | Description |
|-------|------|-------------|
| **Encoders** | Base64 | Encode / decode text to Base64 |
| | URL | Percent-encode / decode URL strings |
| | JWT | Decode, create (HS256/384/512), and verify JWT tokens |
| **Formatters** | JSON | Format + minify JSON with indent control |
| | HTML / XML | Beautify HTML and XML |
| | CSS | Beautify CSS |
| | SQL | Format SQL with dialect selector (MySQL, Postgres, SQLite…) |
| **Converters** | Timestamp | Convert Unix, ISO 8601, and human date strings |
| | Calculator | Expression evaluator (`sqrt`, `^`, `sin`, `pi`…) + base converter |
| | Color | Convert between HEX, RGB, RGBA, HSL with live picker |
| **Generators** | Hash | SHA-1/256/384/512 for text and files (drag & drop) |
| | Text Analyzer | Character, word, line, sentence, byte counts |
| | Regexp | Live pattern tester with highlighted matches and match list |
| | Diff | Line and word diff between two texts |
| **DevOps** | Git Helper | Command builder for common Git operations |
| | Kubectl Helper | Command builder for common kubectl operations |

## Prerequisites

| Tool | Version |
|------|---------|
| Go | ≥ 1.21 |
| Node.js | ≥ 18 |
| Wails CLI | v2 |

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

## Development

```bash
cd frontend && npm install && cd ..
wails dev          # hot-reload dev server
```

## Build

```bash
wails build        # → ./build/bin/Gizmos
```

## Project structure

```
gizmos/
├── main.go
├── app.go                    # Go app struct (minimal — all logic is frontend)
├── wails.json
├── go.mod
└── frontend/
    └── src/
        ├── App.jsx           # Sidebar nav, theme switching, tool routing
        ├── lib.js            # Pure utility functions (no React)
        ├── themes.js         # 5 CSS-var themes
        ├── styles.css        # Design tokens, layout, component styles
        ├── components/
        │   ├── ui.jsx        # CopyButton, IconButton, KVGrid, Toggle, Field, StatusBadge, ToolShell
        │   └── RecipeTool.jsx  # Shared command-builder for Git / Kubectl
        └── tools/            # One file per tool (or group)
            ├── Encoder.jsx   # Base64Tool + URLTool
            ├── JWT.jsx
            ├── Formatter.jsx # JsonFormatterTool + HtmlFormatterTool + …
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

## Adding a new tool

1. Create `frontend/src/tools/MyTool.jsx` — export a default React component with no required props.
2. Add a row to the `TOOLS` array in `App.jsx`:
   ```js
   { id: 'mytool', label: 'My Tool', icon: SomeIcon, component: MyTool, group: 'Converters' }
   ```
3. That's it. No routing config, no context boilerplate.

### Tool component contract

```jsx
// Minimal tool skeleton
import { ToolShell } from '../components/ui'

export default function MyTool() {
  return (
    <ToolShell title="My Tool">
      {/* your content */}
    </ToolShell>
  )
}
```

Available UI primitives from `components/ui.jsx`:

| Component | Props | Use for |
|-----------|-------|---------|
| `ToolShell` | `title` | Outer wrapper — always use this |
| `Field` | `label, action?, grow?` | Labelled input/output area |
| `Toggle` | `options, value, onChange` | Button-group selector |
| `CopyButton` | `text` | Copy to clipboard |
| `IconButton` | `icon, label, onClick, disabled?` | Any action button |
| `KVGrid` | `rows: {key,value}[]` | Key-value result table with copy buttons |
| `StatusBadge` | `ok, text` | Success / error inline badge |

## Themes

5 built-in themes (VSCode Dark, Monokai, Nord, Light, Solarized). All colours are CSS custom properties on `:root` — add a new theme by extending `themes.js`.

## Contributing

PRs welcome. Keep tools self-contained (all state local, no global store). Add pure functions to `lib.js` and import them — this keeps tools easy to test and reason about.
