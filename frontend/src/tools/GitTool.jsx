import React, { useState, useMemo, useEffect } from 'react';
import {
    Panel, Btn, CopyBtn, ToolHeader, TextInput, ToolLayout, Select, Toggle
} from '../components/ui';
import {
    GitPullRequest, Terminal, Info, Zap, CheckCircle, BookOpen
} from 'lucide-react';
import { CATEGORIES, RECIPES, getGuideContent, getHabitContent } from './GitTool.data.jsx';

export default function GitTool() {
    const [activeCat, setActiveCat] = useState('workflow');
    const [activeRecipeId, setActiveRecipeId] = useState('clone');
    const [fields, setFields] = useState({});

    const activeRecipe = useMemo(() =>
        RECIPES.find(r => r.id === activeRecipeId) || RECIPES[0]
        , [activeRecipeId]);

    const generatedCommand = useMemo(() => {
        return activeRecipe.command(fields);
    }, [activeRecipe, fields]);

    useEffect(() => {
        const firstInCat = RECIPES.find(r => r.category === activeCat);
        if (firstInCat && firstInCat.id !== activeRecipeId) {
            handleRecipeSelect(firstInCat);
        }
    }, [activeCat]);

    const handleFieldChange = (id, val) => {
        setFields(prev => ({ ...prev, [id]: val }));
    };

    const handleRecipeSelect = (recipe) => {
        setActiveRecipeId(recipe.id);
        const newFields = {};
        if (recipe.fields) {
            recipe.fields.forEach(f => {
                if (f.defaultValue) newFields[f.id] = f.defaultValue;
            });
        }
        setFields(newFields);
    };

    return (
        <ToolLayout>


            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr', gap: 12, flex: 1, minHeight: 0 }}>
                {/* Sidebar: Categories & Recipes */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                    <Panel title="Categories" style={{ flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCat(cat.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                                        borderRadius: 8, border: 'none', cursor: 'pointer',
                                        background: activeCat === cat.id ? 'var(--bg-active)' : 'transparent',
                                        color: activeCat === cat.id ? 'var(--accent)' : 'var(--text-2)',
                                        fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all 0.15s'
                                    }}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Recipes" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {RECIPES.filter(r => r.category === activeCat).map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => handleRecipeSelect(recipe)}
                                    style={{
                                        padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                                        background: activeRecipeId === recipe.id ? 'var(--accent-glow)' : 'var(--bg-card)',
                                        textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s'
                                    }}
                                >
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeRecipeId === recipe.id ? 'var(--accent)' : 'var(--text-1)' }}>
                                        {recipe.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Panel>
                </aside>

                {/* Builder Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                    <Panel title="Interactive Command Builder" style={{ flex: 1 }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, background: 'var(--accent-glow)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
                                }}>
                                    {CATEGORIES.find(c => c.id === activeCat)?.icon}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                                        {activeRecipe.label}
                                    </h3>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {activeCat} / {activeRecipe.id}
                                    </div>
                                </div>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 600 }}>
                                {activeRecipe.desc}
                            </p>
                        </div>

                        {activeRecipe.fields ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460 }}>
                                {activeRecipe.fields.map(f => {
                                    if (f.showIf && !f.showIf(fields)) return null;

                                    if (f.type === 'select') {
                                        return (
                                            <Select
                                                key={f.id}
                                                label={f.label}
                                                value={fields[f.id] || f.defaultValue}
                                                options={f.options}
                                                onChange={val => handleFieldChange(f.id, val)}
                                            />
                                        );
                                    }

                                    if (f.type === 'toggle') {
                                        return (
                                            <div key={f.id} style={{ margin: '4px 0' }}>
                                                <Toggle
                                                    label={f.label}
                                                    checked={!!fields[f.id]}
                                                    onChange={val => handleFieldChange(f.id, val)}
                                                    desc={f.desc}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <TextInput
                                            key={f.id}
                                            label={f.label}
                                            placeholder={f.placeholder}
                                            type={f.type || 'text'}
                                            value={fields[f.id] || ''}
                                            onChange={val => handleFieldChange(f.id, val)}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-active)', borderRadius: 12, border: '1px dashed var(--border)' }}>
                                <CheckCircle size={20} style={{ color: 'var(--accent)', marginBottom: 8 }} />
                                <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600 }}>Ready to use!</div>
                                <div style={{ fontSize: 12, color: 'var(--text-4)' }}>This command uses standard defaults with no extra fields.</div>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>
                                    Generated CLI Command
                                </label>
                            </div>
                            <div style={{
                                background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                                padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <Terminal size={18} style={{ color: 'var(--text-4)' }} />
                                <code style={{
                                    flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--accent)',
                                    fontFamily: 'var(--font-mono)', overflowX: 'auto', whiteSpace: 'nowrap'
                                }}>
                                    {generatedCommand}
                                </code>
                                <CopyBtn text={generatedCommand} />
                            </div>

                            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                                <Btn variant="primary" size="sm">
                                    <Terminal size={14} />
                                    <span style={{ fontWeight: 700 }}>Execute Command</span>
                                </Btn>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--bg-active)', borderRadius: 8, border: '1px solid var(--border)' }}>
                                    <Info size={12} style={{ color: 'var(--accent)' }} />
                                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>Terminal integration active</span>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <Panel title="Git Guide & Pro Tips">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>
                                    <BookOpen size={14} />
                                    Context
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
                                    {getGuideContent(activeRecipe.id)}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 20, borderLeft: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>
                                    <Zap size={14} style={{ color: '#fbbf24' }} />
                                    Developer Habit
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 1.7, fontStyle: 'italic' }}>
                                    {getHabitContent(activeCat)}
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        </ToolLayout>
    );
}
