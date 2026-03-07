import { useState } from 'react'
import { ToolShell, CopyButton, Field } from './ui'

export default function RecipeTool({ title, recipes }) {
  const [recipeId, setRecipeId] = useState(recipes[0].items[0].id)
  const [values, setValues] = useState({})

  const allItems = recipes.flatMap((g) => g.items)
  const recipe = allItems.find((r) => r.id === recipeId)
  const command = recipe?.build(values) || ''

  const select = (id) => {
    setRecipeId(id)
    setValues({})
  }
  const set = (id, val) => setValues((v) => ({ ...v, [id]: val }))

  return (
    <ToolShell title={title}>
      <div className="recipe-layout">
        {/* Recipe list */}
        <div className="recipe-sidebar">
          {recipes.map((group) => (
            <div key={group.group}>
              <div className="group-label recipe-group-label">{group.group}</div>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={'nav-item recipe-nav-item' + (recipeId === item.id ? ' active' : '')}
                    onClick={() => select(item.id)}
                  >
                    {recipeId === item.id && <div className="active-bar" />}
                    <Icon size={12} className="nav-icon" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Builder */}
        <div className="recipe-builder">
          {recipe?.description && <div className="recipe-description">{recipe.description}</div>}
          {recipe?.fields.map((f) => (
            <Field key={f.id} label={f.label}>
              {f.type === 'select' ? (
                <select
                  className="recipe-select"
                  value={values[f.id] || f.options[0]}
                  onChange={(e) => set(f.id, e.target.value)}
                >
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={values[f.id] || ''}
                  onChange={(e) => set(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  spellCheck={false}
                />
              )}
            </Field>
          ))}

          {/* Output */}
          <div className="recipe-output-wrap">
            <div className="field-header" style={{ marginBottom: 4 }}>
              <span className="label">Generated command</span>
              <div className="field-action">
                <CopyButton text={command} />
              </div>
            </div>
            <div className="recipe-output">
              <span className="recipe-prompt">$</span>
              {command}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  )
}
