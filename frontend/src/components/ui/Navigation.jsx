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
                gap: 2,
                padding: '3px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--r-md)',
                width: 'fit-content',
                border: '1px solid var(--border)'
            }}>
                {tabs.map(tab => (
                    <TabsPrimitive.Trigger
                        key={tab.id}
                        value={tab.id}
                        className="ui-tabs-trigger"
                        style={{
                            padding: '5px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            background: active === tab.id ? 'var(--bg-card)' : 'transparent',
                            color: active === tab.id ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: active === tab.id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                        }}
                    >
                        {tab.label}
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
                        minWidth: 160,
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--r-md)',
                        padding: '5px',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-hi)',
                        zIndex: 1000,
                        animation: 'fadeIn 0.12s ease'
                    }}
                    sideOffset={5}
                >
                    {items.map((item, idx) => (
                        <DropdownMenuPrimitive.Item
                            key={item.id || idx}
                            onClick={item.onClick}
                            className="ui-dropdown-item"
                            style={{
                                fontSize: 12,
                                color: 'var(--text-2)',
                                borderRadius: 'var(--r-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 10px',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'background 0.1s',
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
