import React from 'react';
import { Menu, X, Info } from 'lucide-react';
import styles from '../styles/App.module.css';
import { Btn, Tooltip } from './ui';
import HelpPanel from './HelpPanel';

export default function MainContent({
    sidebarOpen,
    setSidebarOpen,
    active,
    activeId,
    helpOpen,
    setHelpOpen,
    ActiveComponent
}) {
    return (
        <main className={styles.main}>
            <header className={styles.topbar}>
                <button
                    className={styles.menuBtn}
                    onClick={() => setSidebarOpen(v => !v)}
                    aria-label="Toggle navigation"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className={styles.breadcrumb}>
                    <div className={styles.breadIcon} style={{ color: active?.color }}>{active?.icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.breadLabel}>{active?.label}</span>
                    </div>
                    <div className={styles.breadDesc}>{active?.desc}</div>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <Tooltip content="About this tool">
                        <Btn
                            variant="ghost"
                            size="icon"
                            onClick={() => setHelpOpen(v => !v)}
                            aria-label="Show tool documentation"
                            aria-expanded={helpOpen}
                        >
                            <Info size={18} />
                        </Btn>
                    </Tooltip>
                </div>
            </header>

            {helpOpen && <HelpPanel active={active} setHelpOpen={setHelpOpen} />}

            <div
                className={active?.layout === 'compact' ? styles.toolCompact : styles.toolArea}
                key={activeId}
            >
                {ActiveComponent && <ActiveComponent />}
            </div>
        </main>
    );
}
