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
        >
            <span className={styles.navIcon} style={{
                color: active ? 'inherit' : tool.color,
                opacity: active ? 1 : 0.8,
            }}>
                {tool.icon}
            </span>
            <div className={styles.navText}>
                <span className={styles.navLabel}>{tool.label.toLowerCase()}.tool</span>
            </div>
        </button>
    );
}
