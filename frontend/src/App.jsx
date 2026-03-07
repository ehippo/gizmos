import { useState, useEffect, useRef } from 'react'
import {
  Binary, KeyRound, Clock, Hash, Link2,
  Type, Calculator, Palette, Menu, X, GitBranch, Container,
  Regex, GitCompare, Code2, Database, FileCode2, Paintbrush, Braces, Search
} from 'lucide-react'
import { THEMES, applyTheme, saveTheme, getInitialTheme } from './themes'
import { Base64Tool, URLTool } from './tools/Encoder'
import JWTTool          from './tools/JWT'
import TimestampTool    from './tools/Timestamp'
import HashTool         from './tools/Hash'
import TextTool         from './tools/Text'
import ColorTool        from './tools/Color'
import CalculatorTool   from './tools/Calculator'
import GitTool          from './tools/Git'
import KubectlTool      from './tools/Kubectl'
import RegexpTool       from './tools/Regexp'
import DiffTool         from './tools/Diff'
import {
  JsonFormatterTool, HtmlFormatterTool, XmlFormatterTool,
  CssFormatterTool,  SqlFormatterTool,
} from './tools/Formatter'

const TOOLS = [
  { id: 'base64',    label: 'Base64',          icon: Binary,      component: Base64Tool,        group: 'Encoders'   },
  { id: 'url',       label: 'URL',             icon: Link2,       component: URLTool,           group: 'Encoders'   },
  { id: 'jwt',       label: 'JWT',             icon: KeyRound,    component: JWTTool,           group: 'Encoders'   },
  { id: 'json',      label: 'JSON',            icon: Braces,      component: JsonFormatterTool, group: 'Formatters' },
  { id: 'html',      label: 'HTML',            icon: Code2,       component: HtmlFormatterTool, group: 'Formatters' },
  { id: 'xml',       label: 'XML',             icon: FileCode2,   component: XmlFormatterTool,  group: 'Formatters' },
  { id: 'css',       label: 'CSS',             icon: Paintbrush,  component: CssFormatterTool,  group: 'Formatters' },
  { id: 'sql',       label: 'SQL',             icon: Database,    component: SqlFormatterTool,  group: 'Formatters' },
  { id: 'timestamp', label: 'Timestamp',       icon: Clock,       component: TimestampTool,     group: 'Converters' },
  { id: 'calc',      label: 'Calculator',      icon: Calculator,  component: CalculatorTool,    group: 'Converters' },
  { id: 'color',     label: 'Color',           icon: Palette,     component: ColorTool,         group: 'Converters' },
  { id: 'hash',      label: 'Hash',            icon: Hash,        component: HashTool,          group: 'Generators' },
  { id: 'text',      label: 'Text Analyzer',   icon: Type,        component: TextTool,          group: 'Generators' },
  { id: 'regexp',    label: 'Regexp',          icon: Regex,       component: RegexpTool,        group: 'Generators' },
  { id: 'diff',      label: 'Diff',            icon: GitCompare,  component: DiffTool,          group: 'Generators' },
  { id: 'git',       label: 'Git Helper',      icon: GitBranch,   component: GitTool,           group: 'DevOps'     },
  { id: 'kubectl',   label: 'Kubectl Helper',  icon: Container,   component: KubectlTool,       group: 'DevOps'     },
]

const GROUPS = [...new Set(TOOLS.map(t => t.group))]

// ── Command palette ───────────────────────────────────────────────────────────
function CommandPalette({ onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef          = useRef()
  const listRef           = useRef()
  const [cursor, setCursor] = useState(0)

  const filtered = query.trim()
    ? TOOLS.filter(t =>
        t.label.toLowerCase().includes(query.toLowerCase()) ||
        t.group.toLowerCase().includes(query.toLowerCase())
      )
    : TOOLS

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { setCursor(0) }, [query])

  const pick = tool => { onSelect(tool.id); onClose() }

  const onKeyDown = e => {
    if (e.key === 'Escape')    { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    if (e.key === 'Enter')     { if (filtered[cursor]) pick(filtered[cursor]) }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[cursor]
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette" onClick={e => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="palette-search">
          <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Go to tool…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            spellCheck={false}
          />
          <kbd className="palette-esc" onClick={onClose}>esc</kbd>
        </div>
        <div className="palette-list" ref={listRef}>
          {filtered.map((tool, i) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                className={'palette-item' + (i === cursor ? ' active' : '')}
                onClick={() => pick(tool)}
                onMouseEnter={() => setCursor(i)}
              >
                <Icon size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />
                <span className="palette-item-label">{tool.label}</span>
                <span className="palette-item-group">{tool.group}</span>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div className="palette-empty">No tools match "{query}"</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]       = useState(() => localStorage.getItem('gizmos-tool') || TOOLS[0].id)
  const [theme, setTheme]         = useState(() => { const k = getInitialTheme(); applyTheme(k); return k })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 640)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const fn = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
    }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Cmd/Ctrl+K opens palette
  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const selectTheme = key => { setTheme(key); applyTheme(key); saveTheme(key) }
  const selectTool  = id  => {
    setActive(id)
    localStorage.setItem('gizmos-tool', id)
    if (isMobile) setSidebarOpen(false)
  }

  const ActiveTool = TOOLS.find(t => t.id === active)?.component

  return (
    <div className="app-shell">
      {paletteOpen && (
        <CommandPalette onSelect={selectTool} onClose={() => setPaletteOpen(false)} />
      )}

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <nav className={'sidebar' + (sidebarOpen ? '' : ' sidebar-hidden')}>
        <div className="sidebar-top">
          <span className="app-name">Gizmos</span>
          <button
            className="btn-icon"
            onClick={() => setPaletteOpen(true)}
            title="Search tools (⌘K)"
            style={{ marginLeft: 'auto' }}
          >
            <Search size={13} />
          </button>
          {isMobile && (
            <button className="btn-icon" onClick={() => setSidebarOpen(false)}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sidebar-list">
          {GROUPS.map(group => (
            <div key={group}>
              <div className="group-label">{group}</div>
              {TOOLS.filter(t => t.group === group).map(tool => {
                const Icon = tool.icon
                const isActive = tool.id === active
                return (
                  <button
                    key={tool.id}
                    className={'nav-item' + (isActive ? ' active' : '')}
                    onClick={() => selectTool(tool.id)}
                  >
                    {isActive && <div className="active-bar" />}
                    <Icon size={14} className="nav-icon" />
                    <span>{tool.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="theme-selector" style={{ padding: '0 10px 10px' }}>
          <div className="group-label" style={{ padding: '8px 0 4px' }}>Theme</div>
          <select
            className="theme-select"
            value={theme}
            onChange={e => selectTheme(e.target.value)}
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </div>
      </nav>

      <main className="content">
        {isMobile && !sidebarOpen && (
          <button className="mobile-menu-btn btn-icon" onClick={() => setSidebarOpen(true)}>
            <Menu size={16} />
          </button>
        )}
        {ActiveTool && <ActiveTool />}
      </main>
    </div>
  )
}
