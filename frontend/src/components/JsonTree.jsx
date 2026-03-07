import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

export default function JsonTree({ data, initialExpanded = false }) {
  if (data === undefined) return null

  // If not an object/array, just show as a primitive in a container
  if (typeof data !== 'object' || data === null) {
    return (
      <div className="json-tree-container">
        <span className={`json-value json-${data === null ? 'null' : typeof data}`}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    )
  }

  return (
    <div className="json-tree-container">
      <JsonNode value={data} depth={0} initialExpanded={initialExpanded} />
    </div>
  )
}

function JsonNode({ name, value, depth, initialExpanded }) {
  const isObject = typeof value === 'object' && value !== null
  const isArray = Array.isArray(value)
  const [expanded, setExpanded] = useState(initialExpanded || depth < 1)

  const toggle = (e) => {
    e.stopPropagation()
    if (isObject) setExpanded(!expanded)
  }

  if (!isObject) {
    return (
      <div className="json-row" style={{ paddingLeft: depth * 16 }}>
        <span className="json-icon" />
        {name && <span className="json-key">{name}: </span>}
        <span className={`json-value json-${typeof value}`}>
          {typeof value === 'string' ? `"${value}"` : String(value)}
        </span>
      </div>
    )
  }

  const keys = Object.keys(value)
  const label = isArray ? `Array[${keys.length}]` : `Object`
  const preview = !expanded ? (isArray ? ' [...]' : ' {...}') : ''

  return (
    <div className="json-node">
      <div className="json-row clickable" onClick={toggle} style={{ paddingLeft: depth * 16 }}>
        <span className="json-icon">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        {name && <span className="json-key">{name}: </span>}
        <span className="json-label">{label}</span>
        {preview && <span className="json-preview">{preview}</span>}
      </div>
      {expanded && (
        <div className="json-children">
          {keys.map((key) => (
            <JsonNode
              key={key}
              name={key}
              value={value[key]}
              depth={depth + 1}
              initialExpanded={initialExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
