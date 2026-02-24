import React, { useState, useEffect } from 'react';
import styles from './styles/App.module.css';


import Base64Tool from './tools/Base64Tool';
import JSONTool from './tools/JSONTool';
import SQLTool from './tools/SQLTool';
import XMLTool from './tools/XMLTool';
import CSSTool from './tools/CSSTool';
import HTMLTool from './tools/HTMLTool';
import UnixTimeTool from './tools/UnixTimeTool';
import CronTool from './tools/CronTool';
import PasswordTool from './tools/PasswordTool';
import UUIDTool from './tools/UUIDTool';
import URLTool from './tools/URLTool';
import ColorTool from './tools/ColorTool';
import NumberBaseTool from './tools/NumberBaseTool';
import TextTool from './tools/TextTool';
import DiffTool from './tools/DiffTool';
import JWTTool from './tools/JWTTool';
import RegexTool from './tools/RegexTool';

import {
  ShieldCheck, Braces, Database, FileCode, Palette, Timer,
  Hash, Clock, Lock, Binary, Link2, CaseSensitive,
  ArrowLeftRight, Regex, Key, Type, FileDiff, Box,
  Search, ChevronDown, Info
} from 'lucide-react';

import { Btn, Tooltip, DropdownMenu } from './components/ui';

const TOOLS = [
  {
    group: 'Encoders',
    items: [
      { id: 'base64', label: 'Base64', icon: <ArrowLeftRight size={18} />, desc: 'Encode & decode', component: Base64Tool, layout: 'full' },
      { id: 'url', label: 'URL', icon: <Link2 size={18} />, desc: 'Encode & decode', component: URLTool, layout: 'full' },
      { id: 'jwt', label: 'JWT', icon: <Key size={18} />, desc: 'Decode & inspect', component: JWTTool, layout: 'full' },
    ]
  },
  {
    group: 'Formatters',
    items: [
      { id: 'json', label: 'JSON', icon: <Braces size={18} />, desc: 'Format & validate', component: JSONTool, layout: 'full' },
      { id: 'sql', label: 'SQL', icon: <Database size={18} />, desc: 'Format & beautify', component: SQLTool, layout: 'full' },
      { id: 'xml', label: 'XML', icon: <FileCode size={18} />, desc: 'Format & validate', component: XMLTool, layout: 'full' },
      { id: 'css', label: 'CSS', icon: <Palette size={18} />, desc: 'Format & minify', component: CSSTool, layout: 'full' },
      { id: 'html', label: 'HTML', icon: <FileCode size={18} />, desc: 'Format & prettify', component: HTMLTool, layout: 'full' },
    ]
  },
  {
    group: 'Converters',
    items: [
      { id: 'unix', label: 'Unix Time', icon: <Clock size={18} />, desc: 'Timestamp converter', component: UnixTimeTool, layout: 'compact' },
      { id: 'color', label: 'Color', icon: <Palette size={18} />, desc: 'HEX · RGB · HSL', component: ColorTool, layout: 'compact' },
      { id: 'base', label: 'Number Base', icon: <Binary size={18} />, desc: 'DEC · HEX · BIN · OCT', component: NumberBaseTool, layout: 'compact' },
    ]
  },
  {
    group: 'Generators',
    items: [
      { id: 'cron', label: 'Cron', icon: <Timer size={18} />, desc: 'Visual builder', component: CronTool, layout: 'compact' },
      { id: 'password', label: 'Password', icon: <Lock size={18} />, desc: 'Secure generator', component: PasswordTool, layout: 'compact' },
      { id: 'uuid', label: 'UUID', icon: <Box size={18} />, desc: 'v4 generator', component: UUIDTool, layout: 'compact' },
    ]
  },
  {
    group: 'Text',
    items: [
      { id: 'text', label: 'Text Utils', icon: <Type size={18} />, desc: 'Transform & analyze', component: TextTool, layout: 'full' },
      { id: 'diff', label: 'Diff', icon: <FileDiff size={18} />, desc: 'Side-by-side compare', component: DiffTool, layout: 'full' },
      { id: 'regex', label: 'Regex', icon: <Regex size={18} />, desc: 'Test & explain', component: RegexTool, layout: 'full' },
    ]
  },
];

const ALL_TOOLS = TOOLS.flatMap(g => g.items);

export const THEMES = [
  { id: 'dark', label: 'Dark', swatch: '#7c6af7' },
  { id: 'light', label: 'Light', swatch: '#6254e8' },
  { id: 'midnight', label: 'Midnight', swatch: '#5b8ef7' },
  { id: 'solarized', label: 'Solarized', swatch: '#2aa198' },
  { id: 'mocha', label: 'Mocha', swatch: '#d4976a' },
];

export default function App() {
  const [activeId, setActiveId] = useState('base64');
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('ag-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ag-theme', theme);
  }, [theme]);

  const active = ALL_TOOLS.find(t => t.id === activeId);
  const ActiveComponent = active?.component;

  const filtered = search
    ? ALL_TOOLS.filter(t =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()))
    : null;

  const currentTheme = THEMES.find(t => t.id === theme);

  return (
    <div className={styles.window}>
      <div className={styles.shell}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.logoArea}>
            <div className={styles.logo}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: 'var(--accent-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent)30'
              }}>
                <ShieldCheck size={20} color="var(--accent)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.logoText}>Axel Gizmos</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Developer Suite</span>
              </div>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Filter tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className={styles.searchClear} onClick={() => setSearch('')}>×</button>}
          </div>

          <nav className={styles.nav}>
            {filtered ? (
              <div className={styles.navGroup}>
                <div className={styles.navGroupLabel}>Search Results</div>
                {filtered.map(tool => (
                  <NavItem key={tool.id} tool={tool} active={activeId === tool.id}
                    onClick={() => { setActiveId(tool.id); setSearch(''); }} />
                ))}
                {filtered.length === 0 && <div className={styles.noResults}>No matches found</div>}
              </div>
            ) : (
              TOOLS.map(group => (
                <div key={group.group} className={styles.navGroup}>
                  <div className={styles.navGroupLabel}>{group.group}</div>
                  {group.items.map(tool => (
                    <NavItem key={tool.id} tool={tool} active={activeId === tool.id}
                      onClick={() => setActiveId(tool.id)} />
                  ))}
                </div>
              ))
            )}
          </nav>

          <div className={styles.sidebarFooter}>
            <div style={{ padding: '0 4px', marginBottom: 8 }}>
              <a
                href="https://github.com/ehippo/gizmos/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadBtn}
              >
                <Box size={14} />
                <span>Download Desktop</span>
              </a>
            </div>

            <DropdownMenu
              trigger={
                <button className={styles.themeBtn}>
                  <span className={styles.themeSwatch} style={{ background: currentTheme?.swatch }} />
                  <span>{currentTheme?.label} Theme</span>
                  <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </button>
              }
              items={THEMES.map(t => ({
                id: t.id,
                label: t.label,
                icon: <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.swatch }} />,
                onClick: () => setTheme(t.id)
              }))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span className={styles.footerVersion}>v1.2.0-stable</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)' }}>SYSTEM LIVE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.breadcrumb}>
              <div className={styles.breadIcon}>{active?.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.breadLabel}>{active?.label}</span>
              </div>
              <div className={styles.breadDesc}>{active?.desc}</div>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
              <Tooltip content="Documentation">
                <Btn variant="ghost" size="icon" onClick={() => { }}>
                  <Info size={18} />
                </Btn>
              </Tooltip>
            </div>
          </header>

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

function NavItem({ tool, active, onClick }) {
  return (
    <button className={styles.navItem} data-active={active} onClick={onClick}>
      <span className={styles.navIcon}>{tool.icon}</span>
      <div className={styles.navText}>
        <span className={styles.navLabel}>{tool.label}</span>
        <span className={styles.navDesc}>{tool.desc}</span>
      </div>
      {active && <div className={styles.navIndicator} />}
    </button>
  );
}
