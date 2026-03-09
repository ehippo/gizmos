import { useState, useEffect, useRef, Suspense } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { THEMES, applyTheme, saveTheme, getInitialTheme } from './themes'
import { TOOLS, GROUPS, TOOLS_BY_GROUP, TOOLS_BY_ID } from './toolRegistry'

export default function App() {
  const [active, setActive] = useState(() => localStorage.getItem('gizmos-tool') || TOOLS[0].id)
  const [theme, setTheme] = useState(() => {
    const k = getInitialTheme()
    applyTheme(k)
    return k
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef(null)

  useEffect(() => {
    const fn = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
    }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (!sidebarOpen) setSidebarOpen(true)
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setQuery('')
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [sidebarOpen])

  const selectTheme = (key) => {
    setTheme(key)
    applyTheme(key)
    saveTheme(key)
  }

  const selectTool = (id) => {
    setActive(id)
    localStorage.setItem('gizmos-tool', id)
    if (isMobile) setSidebarOpen(false)
  }

  const normalizedQuery = query.trim().toLowerCase()
  const filteredGroups = GROUPS.map((group) => {
    const tools = TOOLS_BY_GROUP[group].filter(
      (tool) =>
        !normalizedQuery ||
        tool.label.toLowerCase().includes(normalizedQuery) ||
        tool.group.toLowerCase().includes(normalizedQuery)
    )
    return { group, tools }
  }).filter(({ tools }) => tools.length > 0)

  const ActiveTool = TOOLS_BY_ID[active]?.component

  return (
    <div className="app-shell">
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <nav className={'sidebar' + (sidebarOpen ? '' : ' sidebar-hidden')}>
        <div className="sidebar-top">
          <div className="sidebar-search-wrap">
            <Search size={13} className="sidebar-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="sidebar-search-input"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
            />
          </div>
          {isMobile && (
            <button className="btn-icon" onClick={() => setSidebarOpen(false)}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sidebar-list">
          {filteredGroups.map(({ group, tools }) => (
            <div key={group}>
              <div className="group-label">{group}</div>
              {tools.map((tool) => {
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
          {filteredGroups.length === 0 && <div className="sidebar-empty">No tools match "{query}"</div>}
        </div>

        <div className="theme-selector" style={{ padding: '0 10px 10px' }}>
          <div className="group-label" style={{ padding: '8px 0 4px' }}>
            Theme
          </div>
          <select
            className="theme-select"
            value={theme}
            onChange={(e) => selectTheme(e.target.value)}
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.label}
              </option>
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
        {ActiveTool && (
          <Suspense
            fallback={
              <div className="tool-shell">
                <div className="tool-header">Loading...</div>
                <div className="tool-body" />
              </div>
            }
          >
            <ActiveTool />
          </Suspense>
        )}
      </main>
    </div>
  )
}
