import React from 'react';
import styles from '../styles/App.module.css';

export default function NavItem({ tool, active, onClick }) {
    return (
        <button
            className={styles.navItem}
            data-active={active}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            title={tool.desc}
            style={{ '--item-accent': tool.color }}
        >
            <span className={styles.navIcon} style={{ color: active ? 'white' : tool.color }}>{tool.icon}</span>
            <div className={styles.navText}>
                <span className={styles.navLabel}>{tool.label}</span>
                <span className={styles.navDesc}>{tool.desc}</span>
            </div>
            {active && <div className={styles.navIndicator} style={{ background: tool.color, boxShadow: `0 0 10px ${tool.color}` }} />}
        </button>
    );
}
