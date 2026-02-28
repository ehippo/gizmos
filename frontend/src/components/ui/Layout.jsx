import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from './utils';

export function ToolGrid({ children, cols = 2, gap = 12 }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
                gap,
                flex: 1,
                minHeight: 0
            }}
        >
            {children}
        </div>
    );
}

export function ToolLayout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
            {children}
        </div>
    );
}

export function ToolHeader({ children }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            minHeight: 32,
            flexShrink: 0
        }}>
            {children}
        </div>
    );
}

/**
 * SplitPane — a horizontally resizable two-panel layout.
 * Drag the handle between panels to adjust the split.
 */
export function SplitPane({ left, right, initialRatio = 0.5 }) {
    const containerRef = useRef(null);
    const [ratio, setRatio] = useState(initialRatio);
    const dragging = useRef(false);

    const onMouseDown = useCallback((e) => {
        e.preventDefault();
        dragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newRatio = Math.min(0.85, Math.max(0.15, (e.clientX - rect.left) / rect.width));
            setRatio(newRatio);
        };
        const onMouseUp = () => {
            dragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="ui-split-pane"
            style={{ display: 'flex', flex: 1, minHeight: 0, gap: 0 }}
        >
            <div className="ui-split-left" style={{ flex: `0 0 calc(${ratio * 100}% - 4px)`, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {left}
            </div>
            <div
                className="split-handle"
                onMouseDown={onMouseDown}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize panels"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') setRatio(r => Math.max(0.15, r - 0.02));
                    if (e.key === 'ArrowRight') setRatio(r => Math.min(0.85, r + 0.02));
                }}
            />
            <div className="ui-split-right" style={{ flex: `0 0 calc(${(1 - ratio) * 100}% - 4px)`, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {right}
            </div>
        </div>
    );
}

export function ScrollArea({ children, className, style = {} }) {
    return (
        <ScrollAreaPrimitive.Root className={cn('ui-scroll-area', className)} style={{ display: 'flex', flexDirection: 'column', ...style }}>
            <ScrollAreaPrimitive.Viewport style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}>
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar
                orientation="vertical"
                style={{
                    display: 'flex',
                    userSelect: 'none',
                    touchAction: 'none',
                    padding: '2px',
                    background: 'transparent',
                    transition: 'background 160ms ease-out',
                    width: '10px'
                }}
            >
                <ScrollAreaPrimitive.Thumb
                    style={{
                        flex: 1,
                        background: 'var(--scrollbar-thumb)',
                        borderRadius: '10px',
                        position: 'relative'
                    }}
                />
            </ScrollAreaPrimitive.Scrollbar>
            <ScrollAreaPrimitive.Corner style={{ background: 'transparent' }} />
        </ScrollAreaPrimitive.Root>
    );
}
