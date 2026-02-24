# AxelGizmos

> A lightweight, open-source developer toolkit built with **Wails + Go + React**.

## ✨ Features

### 🔐 Encoders / Decoders
- **Base64** — Encode & decode with URL-safe mode support
- **URL** — URL encode/decode with special character handling

### 🎨 Formatters
- **JSON** — Format with syntax validation, minify, error highlighting
- **SQL** — Keyword capitalization, clause formatting with indentation

### 🔄 Converters
- **Unix Time** — Live clock, timestamp ↔ human time, relative time, multiple formats
- **Color** — HEX → RGB, HSL, RGBA with visual color picker
- **Number Base** — DEC ↔ HEX ↔ BIN ↔ OCT conversion

### ⚡ Generators
- **Cron** — Visual cron expression builder with templates & next-run preview
- **Password** — Configurable generator with strength meter & bulk generation
- **UUID** — v4 generator with structure breakdown, validator, bulk generation

### 📝 Text Tools
- **Text Utils** — Transform, analyze (word/char/line stats), sort, deduplicate
- **Diff** — Side-by-side text comparison with diff highlighting

## 🚀 Getting Started

### Prerequisites

- [Go 1.25+](https://go.dev/dl/)
- [Node.js 24+](https://nodejs.org/)
- [Wails CLI v2](https://wails.io/docs/gettingstarted/installation)

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Development

```bash
# Install frontend dependencies
cd frontend && npm install && cd ..

# Run in development mode (hot reload)
wails dev
```

### Build

```bash
# Build production binary
wails build

# Output: ./build/bin/AxelGizmos (or AxelGizmos.exe on Windows)
```

### Build for specific platforms

```bash
# macOS
wails build -platform darwin/amd64

# Linux
wails build -platform linux/amd64

# Windows
wails build -platform windows/amd64
```

## 🗂 Project Structure

```
gizmos/
├── main.go              # Wails entry point
├── app.go               # All Go backend tool implementations
├── wails.json           # Wails configuration
├── go.mod               # Go module
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx         # React entry
        ├── App.jsx          # Main layout + sidebar navigation
        ├── wailsbridge.js   # Wails/Go bridge + dev-mode fallbacks
        ├── components/
        │   └── ui.jsx       # Shared UI components
        ├── styles/
        │   ├── globals.css  # Design system / CSS variables
        │   └── App.module.css
        └── tools/
            ├── Base64Tool.jsx
            ├── JSONTool.jsx
            ├── SQLTool.jsx
            ├── UnixTimeTool.jsx
            ├── CronTool.jsx
            ├── PasswordTool.jsx
            ├── UUIDTool.jsx
            ├── URLTool.jsx
            ├── ColorTool.jsx
            ├── BaseTool.jsx
            ├── TextTool.jsx
            └── DiffTool.jsx
```

## 🏗 Architecture

- **Backend (Go)**: All tool logic runs natively in Go for maximum performance and correctness. Exposed to frontend via Wails bindings.
- **Frontend (React + Vite)**: Dark-themed UI with a collapsible sidebar. Each tool is a self-contained React component.
- **Bridge**: `wailsbridge.js` provides JavaScript fallbacks for browser dev mode, so you can develop the UI with just `npm run dev` without the full Wails runtime.

## 🎨 Design System

The UI uses a custom dark design system defined in `globals.css`:
- **Colors**: Deep navy base (`#0d0d12`) with violet accent (`#7c6af7`)
- **Typography**: Space Grotesk (UI) + JetBrains Mono (code)
- **Components**: All shared UI in `components/ui.jsx` — Panel, Btn, CodeArea, Toggle, Slider, etc.

## 🤝 Contributing

PRs welcome! To add a new tool:

1. Add Go method(s) to `app.go`
2. Add JS fallback to `wailsbridge.js`
3. Create `frontend/src/tools/YourTool.jsx`
4. Register in `App.jsx` TOOLS array

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
