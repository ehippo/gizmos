import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from './utils';

export function Tabs({ tabs, active, onChange, className }) {
    return (
        <TabsPrimitive.Root
            value={active}
            onValueChange={onChange}
            className={cn('ui-tabs', className)}
        >
            <TabsPrimitive.List style={{
                display: 'flex',
                gap: 0,
                background: 'var(--bg-card)',
                borderRadius: 0,
                width: 'fit-content',
                border: '1px solid var(--border)',
                overflow: 'hidden',
            }}>
                {tabs.map((tab, i) => (
                    <TabsPrimitive.Trigger
                        key={tab.id}
                        value={tab.id}
                        className="ui-tabs-trigger"
                        style={{
                            padding: '3px 14px',
                            borderRadius: 0,
                            fontSize: 12,
                            fontWeight: 400,
                            cursor: 'pointer',
                            border: 'none',
                            borderRight: i < tabs.length - 1 ? '1px solid var(--border)' : 'none',
                            background: active === tab.id ? 'var(--accent)' : 'transparent',
                            color: active === tab.id ? '#ffffff' : 'var(--text-2)',
                            transition: 'all 0.08s ease',
                            outline: 'none',
                            fontFamily: 'var(--font-sans)',
                            lineHeight: '20px',
                        }}
                    >
                        {tab.label.toLowerCase()}
                    </TabsPrimitive.Trigger>
                ))}
            </TabsPrimitive.List>
        </TabsPrimitive.Root>
    );
}

export function DropdownMenu({ trigger, items }) {
    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
                {trigger}
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    style={{
                        minWidth: 150,
                        background: 'var(--bg-card)',
                        borderRadius: 0,
                        padding: '3px',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-hi)',
                        zIndex: 1000,
                        animation: 'fadeIn 0.08s ease',
                    }}
                    sideOffset={3}
                >
                    {items.map((item, idx) => (
                        <DropdownMenuPrimitive.Item
                            key={item.id || idx}
                            onClick={item.onClick}
                            className="ui-dropdown-item"
                            style={{
                                fontSize: 12,
                                color: 'var(--text-2)',
                                borderRadius: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                padding: '5px 8px',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'background 0.06s',
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </DropdownMenuPrimitive.Item>
                    ))}
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
}
