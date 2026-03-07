# Gizmos

A professional-grade developer toolkit built for speed, privacy, and precision. Available as both a lightweight **web app** and a native **desktop application**.

[**Try the Web App**](https://ehippo.github.io/gizmos/) · [**Download Desktop Releases**](https://github.com/ehippo/gizmos/releases)

<p align="center">
  <img src="docs/app1.png" width="400" alt="Base64 Tool" />
  <img src="docs/app2.png" width="400" alt="Git Helper Tool" />
</p>
<p align="center">
  <img src="docs/app3.png" width="810" alt="Calculator Tool" />
</p>

## ✨ Features

- 🛠️ **20+ Tools**: Encoders, formatters, generators, and more.
- 🔍 **Command Palette**: `Cmd+K` (or `Ctrl+K`) to fuzzy search and switch tools instantly.
- 🎨 **VSCode Themes**: 5 built-in themes (Dark, Monokai, Nord, Light, Solarized).
- 📱 **Responsive Design**: Works great as a sidebar or a full-window app.
- 🔒 **Privacy First**: All processing is 100% local. No telemetry, no cloud.

## 🧰 Tools

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

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Go | ≥ 1.21 |
| Node.js | ≥ 18 |
| Wails CLI | v2 |

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Development

```bash
wails dev          # hot-reload dev server
```

### Build

```bash
wails build        # → ./build/bin/Gizmos
```