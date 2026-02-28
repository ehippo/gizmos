# Axel Gizmos — Code Review

## Overview

**Axel Gizmos** is a well-structured Wails (Go + React) desktop developer toolkit with 18 tools across five categories. The codebase is clean and clearly the work of someone who cares about UI polish. This review covers what can be improved now, followed by a list of further recommendations.

---

## Issues & Improvements

### 1. Architecture: The Wails bridge is unused on the Go side

`app.go` is essentially empty — it only holds a `context.Context`. All 18 tools run entirely via the JS mock in `wailsbridge.js`. This means:

- The desktop build **never calls Go** — the `window.go` bindings are never populated with real methods.
- The `wailsbridge.js` always uses `mockGo`, even in production. The bridge's `isBrowser` guard checks for `window.go`, which Wails never injects unless the Go methods are actually bound.

**Fix:** Either implement the methods in `app.go` and bind them properly, or make it clear this is an intentional web-only app and remove the Go scaffolding. Right now it's misleading.

---

### 2. The JWT encoder produces a fake token

In `wailsbridge.js`, `JWTEncode` creates a placeholder signature using a string concatenation — not a real HMAC. The generated token will fail verification in any real JWT library.

```js
// Current — fake signature
const sig = b64(secret + ':' + unsigned.slice(0, 16));
```

**Fix:** Use the Web Crypto API (`crypto.subtle.importKey` + `crypto.subtle.sign` with `HMAC`) to generate a real HS256 signature, exactly as the `HashAll` function already does for HMAC hashing.

---

### 3. Stale input on tab switch in `BaseTool`

In `BaseTool.jsx`, `handleTabChange` re-processes using the current `input` state. But `handleProcess` is a `useCallback` with `[process]` as its dep — it has no closure over `input`. This means if `input` changed after the callback was memoized, the re-process gets stale data.

```js
// handleTabChange calls handleProcess(input, newTab) 
// but handleProcess is useCallback([process]) — no dependency on input
```

**Fix:** Either add `input` to the `useCallback` deps, or pass `input` as an argument (it already does, but the closure issue means it should not be memoized at all, or use `useRef` for input).

---

### 4. Race condition on fast input

`handleInput` calls `handleProcess` directly on every keystroke without debouncing. For tools that do async work (JWT decode, regex, hash), rapid typing will fire overlapping async calls. The results may arrive out of order and set stale output.

**Fix:** Add a simple debounce (~200ms) to `handleProcess`, or use a `useRef` to cancel stale in-flight results (abort controller or an incrementing ID check).

---

### 5. `useEffect` with empty deps fires `handleProcess` that references a stale `activeTab`

In `BaseTool.jsx`:

```js
useEffect(() => {
  if (initialInput) handleProcess(initialInput, activeTab);
}, []); // eslint will warn: activeTab and handleProcess missing from deps
```

This captures the initial `activeTab` value only. It works by accident today since `activeTab` is initialized before the effect fires, but it's a latent bug.

**Fix:** Add `handleProcess` to deps, or just call `handleProcess(initialInput, initialTab || tabs[0]?.id)` directly and avoid the dependency issue.

---

### 6. Hover styles applied via inline JS event handlers instead of CSS

Both `Btn` and `DropdownMenu.Item` use `onMouseEnter`/`onMouseLeave` to mutate `style` directly:

```js
onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
```

This bypasses React's rendering model, doesn't work with keyboard focus, and duplicates logic that belongs in CSS.

**Fix:** Use CSS classes or Tailwind hover variants. The project already imports `clsx` and `tailwind-merge` — this approach is unused for hover states.

---

### 7. `PropertyRow` wraps every value in a `CopyBtn` unconditionally

In `ui.jsx`, `PropertyRow` always renders a copy button even when `value` is empty or semantically not copyable (e.g., "N/A", "—").

**Fix:** Accept an optional `copyable` prop (defaulting to `true`) and skip rendering `CopyBtn` when `false` or when `value` is falsy/placeholder.

---

### 8. File hashing only reads file as text

In `HashTool.jsx`, files are read via `file.text()` which decodes binary files as UTF-8. Hashing a `.zip` or `.png` this way produces incorrect results because binary content is mangled during text decoding.

```js
const text = await file.text(); // Wrong for binary files
```

**Fix:** Use `file.arrayBuffer()` and pass the raw bytes to the hash functions. The `HashAll` function already uses `TextEncoder` — it should accept either a string or `ArrayBuffer`.

---

### 9. The Info button in the topbar is a no-op

The `Info` button in `App.jsx` renders a `Btn` with an empty `onClick`:

```jsx
<Btn variant="ghost" size="icon" onClick={() => { }}>
  <Info size={18} />
</Btn>
```

**Fix:** Either link to tool-specific docs/help content, or remove the button until docs exist. Dead UI elements erode trust.

---

### 10. Inline styles throughout — no design token consistency enforcement

The codebase mixes `var(--accent)` CSS variables (good) with hardcoded color strings like `'rgba(247,106,106,0.1)'` and `'rgba(62,207,176,0.1)'` scattered across multiple files. When themes change, these hardcoded values don't update.

**Fix:** Promote these to CSS variables (e.g. `--danger-bg`, `--success-bg`) defined per theme in `globals.css`, and use them consistently.

---

### 11. `SplitPane` has no resize handle

The two-panel split layout is fixed at `1fr 1fr`. Users can't resize it.

**Fix:** Implement a draggable divider using `onMouseDown` + `onMouseMove` on a thin handle element, storing the split ratio in state.

---

### 12. No keyboard navigation for the sidebar

The sidebar nav uses `<button>` elements (good), but there's no `aria-label`, no `role="navigation"` on `<nav>`, and no indication of the active tool for screen readers.

**Fix:** Add `aria-current="page"` on the active nav item, and `aria-label="Tool navigation"` on the `<nav>` element.

---

## Further Recommendations

**Persistence & UX**
- Remember the last active tool between sessions (save `activeId` to `localStorage`).
- Store per-tool input in `sessionStorage` so content isn't lost on accidental navigation.
- Add a keyboard shortcut (e.g. `Cmd+K`) to focus the search input.

**New Tools**
- **TOML / YAML formatter** — increasingly common alongside JSON.
- **JWT verifier with public key** — allow users to paste a PEM/JWK to verify RS256/ES256 tokens.
- **QR Code generator** — encode any text/URL.
- **Lorem Ipsum generator** — trivial to add, commonly needed.
- **IP / CIDR calculator** — subnet mask, range, broadcast address.
- **String escaper** — escape/unescape JSON strings, regex, HTML entities, SQL strings.
- **HTTP status code reference** — quick lookup panel, fits the "developer utilities" theme well.

**Code Quality**
- Add ESLint with `eslint-plugin-react-hooks` to catch the stale-closure issues above automatically.
- Extract the `TOOLS` registry in `App.jsx` to a separate `tools/registry.js` file — it'll make adding tools cleaner.
- Add prop-types or switch to TypeScript for the UI component library; `BaseTool`'s props are complex enough that type safety would prevent bugs.

**Distribution**
- The desktop build has no auto-update mechanism. Consider `wails-update` or a simple GitHub Releases check on startup.
- Add a `wails.json` `"buildVersion"` field and display it dynamically instead of hardcoding `v1.2.0-stable`.

**Security Note**
- The `JWTEncode` fix above is the most important security item: shipping a tool that claims to generate JWTs but produces tokens with fake signatures is a correctness bug that could mislead users into thinking their signing implementation is working.