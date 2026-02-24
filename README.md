# AxelGizmos

A professional-grade, locally hosted developer toolkit built for speed, privacy, and precision. Powered by **Wails**, **Go**, and **React**.

---

## Why AxelGizmos?

AxelGizmos provides a clean, native desktop app that respects your workflow and your data.

- **Privacy First**: All processing happens locally on your machine. No data ever leaves your system, making it safe for sensitive keys, logs, and internal data.
- **Native Performance**: Built with a Go back-end, AxelGizmos handles large payloads and complex computations instantly, bypassing the limitations of browser-based tools.
- **Unified Workflow**: Stop jumping between browser tabs. Access every utility—from JWT debugging to Cron scheduling—within a single, sleek interface.
- **Premium Aesthetics**: Featuring multiple curated themes (Midnight, Mocha, Solarized), AxelGizmos is designed to look as good as it performs.

---

## Technical Capabilities

### Encoding and Security
- **Base64**: Robust encoding and decoding with URL-safe support.
- **URL**: Precision handling of special characters and complex query strings.
- **JWT Debugger**: Header and payload breakdown with expiration validation.
- **Password Generator**: High-entropy generation with configurable complexity and bulk output.

### Data Formatting
- **JSON**: Logic-aware formatting with syntax validation, minification, and error highlighting.
- **SQL**: Clause-based formatting with indentation and keyword capitalization.
- **XML / HTML**: Clean structure restoration for nested markup.
- **CSS**: Minification and beautification for modern stylesheets.

### Conversion and Math
- **Unix Time**: Live synchronization with bi-directional human-time conversion and relative offsets.
- **Number Base**: Seamless switching between Decimal, Hexadecimal, Binary, and Octal formats.
- **Color**: Advanced conversion between HEX, RGB, HSL, and RGBA with a visual palette.

### Development Utilities
- **Regex Tester**: Real-time expression testing with match highlights and group capture.
- **UUID**: Version 4 generation with structure verification and bulk processing.
- **Cron**: Visual expression builder with template support and next-run scheduling previews.
- **Diff**: Side-by-side comparison with granular line and character highlighting.
- **Text Utils**: Comprehensive suite for sorting, deduplication, and statistical analysis.

---

## Interface

### Base64 encoder/decoder
![Base64 encoder/decoder](./docs/app1.png)


| JWT encoder/decoder | Timestamp converter |
| :---: | :---: |
| <img src="./docs/app2.png" width="400" /> | <img src="./docs/app3.png" width="400" /> |

---

## Getting Started

### Prerequisites
- Go 1.25+
- Node.js 24+
- Wails CLI v2

### Installation
```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Clone and Install Dependencies
git clone https://github.com/axel/gizmos.git
cd gizmos/frontend && npm install
```

### Build and Run
```bash
# Development Mode
wails dev

# Production Build
wails build
```

The resulting binary will be located in the `build/bin` directory.

---

## Contribution

AxelGizmos is built for developers, by developers. Pull requests for new tools or performance improvements are always welcome.

1.  Implement the back-end logic in `app.go`.
2.  Define the React interface in `frontend/src/tools/`.
3.  Register the new component in `App.jsx`.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
