import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles/App.module.css';

import {
  Search, ChevronDown, Info, X, Menu, Download, Globe
} from 'lucide-react';

import { Btn, Tooltip, DropdownMenu } from './components/ui';
import NavItem from './components/NavItem';
import { TOOLS, ALL_TOOLS, THEMES, APP_VERSION } from './config.jsx';
import logo from './assets/logo.png';

export default function App() {
  const [activeId, setActiveId] = useState(() => localStorage.getItem('ag-active') || 'base64');
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('ag-theme') || 'dark');
  const [helpOpen, setHelpOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);
  const isWails = window.go !== undefined;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ag-theme', theme);
  }, [theme]);

  // Persist active tool
  useEffect(() => {
    localStorage.setItem('ag-active', activeId);
  }, [activeId]);

  // Cmd/Ctrl+K focuses the search input
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const active = ALL_TOOLS.find(t => t.id === activeId);
  const activeGroup = TOOLS.find(g => g.items.some(t => t.id === activeId));
  const ActiveComponent = active?.component;

  const filtered = search
    ? ALL_TOOLS.filter(t =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()))
    : null;

  const currentTheme = THEMES.find(t => t.id === theme);

  const selectTool = useCallback((id) => {
    setActiveId(id);
    setSearch('');
    setHelpOpen(false);
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.window} data-mobile-menu={sidebarOpen}>
      <div className={styles.shell}>
        {/* Mobile Overlay */}
        {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={styles.sidebar} data-open={sidebarOpen}>
          <div className={styles.logoArea}>
            <div className={styles.logo}>
              <div style={{
                width: 20, height: 20, overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span className={styles.logoText}>EXPLORER</span>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              ref={searchRef}
              className={styles.searchInput}
              type="text"
              placeholder="Filter tools… (⌘K)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Filter tools"
            />
            {search && <button className={styles.searchClear} onClick={() => setSearch('')} aria-label="Clear search">×</button>}
          </div>

          {/* Navigation — keyboard-accessible */}
          <nav className={styles.nav} aria-label="Tool navigation">
            {filtered ? (
              <div className={styles.navGroup}>
                <div className={styles.navGroupLabel}>Search Results</div>
                {filtered.map(tool => (
                  <NavItem
                    key={tool.id}
                    tool={tool}
                    active={activeId === tool.id}
                    onClick={() => selectTool(tool.id)}
                  />
                ))}
                {filtered.length === 0 && <div className={styles.noResults}>No matches found</div>}
              </div>
            ) : (
              TOOLS.map(group => (
                <div key={group.group} className={styles.navGroup}>
                  <div className={styles.navGroupLabel}>{group.group}</div>
                  {group.items.map(tool => (
                    <NavItem
                      key={tool.id}
                      tool={{ ...tool, color: group.color }}
                      active={activeId === tool.id}
                      onClick={() => selectTool(tool.id)}
                    />
                  ))}
                </div>
              ))
            )}
          </nav>

          <div className={styles.sidebarFooter}>
            {!isWails ? (
              <a
                href="https://github.com/ehippo/gizmos/releases"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadBtn}
              >
                <Download size={12} />
                <span>Download Desktop App</span>
              </a>
            ) : (
              <a
                href="https://ehippo.github.io/gizmos/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadBtn}
                style={{ background: 'var(--accent2)' }}
              >
                <Globe size={12} />
                <span>Open In Browser</span>
              </a>
            )}

            <DropdownMenu
              trigger={
                <button className={styles.themeBtn} aria-label="Choose theme">
                  <span className={styles.themeSwatch} style={{ background: currentTheme?.swatch }} />
                  <span>{currentTheme?.label} Theme</span>
                  <ChevronDown size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </button>
              }
              items={THEMES.map(t => ({
                id: t.id,
                label: t.label,
                icon: <div style={{ width: 9, height: 9, borderRadius: '50%', background: t.swatch }} />,
                onClick: () => setTheme(t.id)
              }))}
            />
            <span className={styles.footerVersion}>Axel Gizmos v{APP_VERSION}</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.topbar}>
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* VS Code-style active tab */}
            <div className={styles.activeTab}>
              <span className={styles.breadIcon} style={{ color: activeGroup?.color }}>{active?.icon}</span>
              <span className={styles.breadLabel}>{active?.label?.toLowerCase()}.tool</span>
            </div>

            {/* Path breadcrumb */}
            <div className={styles.topbarPath}>
              <span style={{ color: 'var(--text-4)' }}>{activeGroup?.group?.toUpperCase()}</span>
              <span style={{ color: 'var(--text-4)', margin: '0 4px' }}>›</span>
              <span style={{ color: 'var(--text-3)' }}>{active?.desc}</span>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center', paddingRight: 10 }}>
              <Tooltip content="About this tool">
                <Btn
                  variant="ghost"
                  size="icon"
                  onClick={() => setHelpOpen(v => !v)}
                  aria-label="Show tool documentation"
                  aria-expanded={helpOpen}
                >
                  <Info size={15} />
                </Btn>
              </Tooltip>
            </div>
          </header>

          {/* Tool help panel — slides in below topbar */}
          {helpOpen && active?.help && (
            <div style={{
              padding: '10px 20px',
              background: 'var(--info-bg)',
              borderBottom: '1px solid var(--info-border)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              animation: 'fadeIn 0.15s ease',
            }}>
              <Info size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, flex: 1 }}>
                {active.help}
              </p>
              <button
                onClick={() => setHelpOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 2, lineHeight: 1 }}
                aria-label="Close help"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div
            className={active?.layout === 'compact' ? styles.toolCompact : styles.toolArea}
            key={activeId}
          >
            {ActiveComponent && <ActiveComponent />}
          </div>
        </main>
      </div>
    </div>
  );
}
