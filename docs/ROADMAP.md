## Roadmap

### Phase 1 — Polish the core (1–2 sprints)

- **Command palette** (`Cmd+K`): fuzzy search across all tool names. Single most-requested feature in every comparable app (DevToys, DevUtils, etc.)
- **Proper README** — screenshot, tool list, architecture notes, contribution guide
- **File drop support** for Hash, Base64, Diff — drag a file onto the tool, it reads and processes it
- **URL parser tool** — break a URL into scheme/host/path/query params table, edit and reconstruct. Separate from URL encode/decode which is for percent-encoding

### Phase 2 — Essential missing tools

These are the gaps between current Gizmos and DevToys/DevUtils:

| Tool | Why it matters |
|---|---|
| **YAML ↔ JSON** | Constant daily need; surprisingly few offline tools handle it well |
| **Cron expression** | Parse + describe cron strings in plain English, show next N run times |
| **UUID generator** | v1/v4/v7, bulk generate, validate |
| **Lorem ipsum** | Words/sentences/paragraphs, customisable, plain or `<p>` wrapped |
| **String case converter** | camelCase ↔ snake_case ↔ PascalCase ↔ kebab-case ↔ SCREAMING_SNAKE |
| **Markdown preview** | Live render with copy-as-HTML; devs write markdown constantly |
| **Image tools** | Resize, convert format (PNG↔JPEG↔WebP), base64 encode/decode — all offline |
| **Certificate decoder** | Paste PEM, see issuer/subject/SAN/expiry — huge for ops work |
| **Docker helper** | Same RecipeTool pattern as Git/Kubectl |
| **Ip/CIDR calculator** | Subnet mask, broadcast addr, host range |

### Phase 3 — Architecture for scale

- **Plugin system**: a tool is just `{ id, label, icon, component, group }`. Document that contract, add a `CONTRIBUTING.md` with a template. The architecture already supports this — just needs to be made explicit and tested.
- **Persistent state per tool**: currently all tool state is lost on tool switch. Store last input per tool in `localStorage` so switching back restores where you left off.
- **Settings panel**: font size, monospace font choice, default indent size, default SQL dialect — things users change once and forget.
- **Import/export tool sessions**: save current inputs as a JSON file, reload later. Useful when you have a JWT or SQL query you keep coming back to.
- **Custom themes**: the theme system is already CSS vars — expose a theme editor or let users paste a theme JSON.

### Phase 4 — Advanced features

- **Tool chaining**: pipe output of one tool as input to another. E.g. Base64-decode → JSON format → copy. A visual pipeline builder or even just a "send to →" button in each tool's output.
- **History across all tools**: global session log of every transformation you've done, searchable, with one-click restore.
- **Keyboard-first navigation**: every field, button, and action reachable without a mouse. Tab order, shortcuts per tool (e.g. `Ctrl+Enter` = format, `Ctrl+Shift+C` = copy output).
- **Web version alongside desktop**: the app is already 100% frontend (Go backend does nothing). A web build at `gizmos.dev` or similar would massively increase reach and discoverability.
- **AI-assisted tool**: since this is a Wails app, a local "explain this" action — paste a JWT payload or SQL query and get a plain-English explanation — would be uniquely useful and differentiated from every other dev tools app.