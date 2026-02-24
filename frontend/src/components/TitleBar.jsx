import React, { useState, useEffect } from 'react';
import styles from './TitleBar.module.css';
import { WindowMinimise, WindowToggleMaximise, Quit, EventsOn } from '../../wailsjs/runtime/runtime';

const TitleBar = () => {
    const [isMaximised, setIsMaximised] = useState(false);

    useEffect(() => {
        // We can listen to window resize events to check maximised state
        const handleResize = () => {
            // In Wails, we might need a better way to detect this, 
            // but WindowIsMaximised from runtime is async.
            // For now, let's use a simple approach or just assume Toggle works.
        };

        // Wails emits events for window state changes if configured
        // But for a simple implementation, Toggle is usually enough.
        // Let's refine the UI to be more reactive if possible.
    }, []);

    return (
        <div className={styles.titlebar} style={{ "--wails-draggable": "drag" }}>
            <div className={styles.left}>
                <div className={styles.logo}>
                    <svg width="18" height="18" viewBox="0 0 26 26" fill="none">
                        <path d="M13 2L24 8V18L13 24L2 18V8L13 2Z" fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="1.5" />
                        <path d="M13 7L19 10.5V17.5L13 21L7 17.5V10.5L13 7Z" fill="var(--accent)" fillOpacity="0.3" />
                        <circle cx="13" cy="14" r="3" fill="var(--accent)" />
                    </svg>
                    <span className={styles.title}>Axel Gizmos</span>
                </div>
            </div>
            <div className={styles.controls} style={{ "--wails-draggable": "no-drag" }}>
                <button className={styles.control} onClick={WindowMinimise} title="Minimize">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <rect x="2" y="5.5" width="8" height="1" fill="currentColor" />
                    </svg>
                </button>
                <button className={styles.control} onClick={WindowToggleMaximise} title="Maximize">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                </button>
                <button className={`${styles.control} ${styles.close}`} onClick={Quit} title="Close">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TitleBar;
