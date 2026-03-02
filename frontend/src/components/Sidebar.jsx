import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Globe, ChevronDown } from 'lucide-react';
import styles from '../styles/App.module.css';
import NavItem from './NavItem';
import { DropdownMenu } from './ui';
import { TOOLS, ALL_TOOLS, THEMES, APP_VERSION } from '../config.jsx';
import logo from '../assets/logo.png';

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    activeId,
    selectTool,
    isWails,
    theme,
    setTheme
}) {
    const [search, setSearch] = useState('');
    const searchRef = useRef(null);
    const currentTheme = THEMES.find(t => t.id === theme);

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

    const filtered = search
        ? ALL_TOOLS.filter(t =>
            t.label.toLowerCase().includes(search.toLowerCase()) ||
            t.desc.toLowerCase().includes(search.toLowerCase()))
        : null;

    const handleSelect = (id) => {
        selectTool(id);
        setSearch('');
    };

    return (
        <aside className={styles.sidebar} data-open={sidebarOpen}>
            <div className={styles.logoArea}>
                <div className={styles.logo}>
                    <div className={styles.logoContainer}>
                        <img src={logo} alt="Logo" className={styles.logoImg} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.logoText}>Axel Gizmos</span>
                        <span className={styles.logoSub}>Developer Suite</span>
                    </div>
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

            <nav className={styles.nav} aria-label="Tool navigation">
                {filtered ? (
                    <div className={styles.navGroup}>
                        <div className={styles.navGroupLabel}>Search Results</div>
                        {filtered.map(tool => (
                            <NavItem
                                key={tool.id}
                                tool={tool}
                                active={activeId === tool.id}
                                onClick={() => handleSelect(tool.id)}
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
                                    onClick={() => handleSelect(tool.id)}
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
                        <Download size={14} />
                        <span>Download Desktop</span>
                    </a>
                ) : (
                    <a
                        href="https://ehippo.github.io/gizmos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadBtn}
                        style={{ background: 'var(--accent2)', boxShadow: '0 4px 15px rgba(62, 207, 176, 0.2)' }}
                    >
                        <Globe size={14} />
                        <span>Open In Browser</span>
                    </a>
                )}

                <DropdownMenu
                    trigger={
                        <button className={styles.themeBtn} aria-label="Choose theme">
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
                    <span className={styles.footerVersion}>v{APP_VERSION}</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--success)' }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)' }}>SYSTEM LIVE</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
