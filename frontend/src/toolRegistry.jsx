import { lazy } from 'react'
import {
  Binary,
  KeyRound,
  Clock,
  Hash,
  Link2,
  Type,
  Calculator,
  Palette,
  GitBranch,
  Container,
  Regex,
  GitCompare,
  Code2,
  Database,
  FileCode2,
  Paintbrush,
  Braces,
} from 'lucide-react'

const Base64Tool = lazy(() => import('./tools/Encoder').then((m) => ({ default: m.Base64Tool })))
const URLTool = lazy(() => import('./tools/Encoder').then((m) => ({ default: m.URLTool })))
const JWTTool = lazy(() => import('./tools/JWT'))
const TimestampTool = lazy(() => import('./tools/Timestamp'))
const JSONTool = lazy(() => import('./tools/JSON'))
const SQLTool = lazy(() => import('./tools/SQL'))
const HashTool = lazy(() => import('./tools/Hash'))
const TextTool = lazy(() => import('./tools/Text'))
const ColorTool = lazy(() => import('./tools/Color'))
const CalculatorTool = lazy(() => import('./tools/Calculator'))
const GitTool = lazy(() => import('./tools/Git'))
const KubectlTool = lazy(() => import('./tools/Kubectl'))
const RegexpTool = lazy(() => import('./tools/Regexp'))
const DiffTool = lazy(() => import('./tools/Diff'))
const HtmlFormatterTool = lazy(() =>
  import('./tools/Formatter').then((m) => ({ default: m.HtmlFormatterTool }))
)
const XmlFormatterTool = lazy(() =>
  import('./tools/Formatter').then((m) => ({ default: m.XmlFormatterTool }))
)
const CssFormatterTool = lazy(() =>
  import('./tools/Formatter').then((m) => ({ default: m.CssFormatterTool }))
)

export const TOOLS = [
  { id: 'base64', label: 'Base64', icon: Binary, component: Base64Tool, group: 'Encoders' },
  { id: 'url', label: 'URL', icon: Link2, component: URLTool, group: 'Encoders' },
  { id: 'jwt', label: 'JWT', icon: KeyRound, component: JWTTool, group: 'Encoders' },
  { id: 'json', label: 'JSON', icon: Braces, component: JSONTool, group: 'Formatters' },
  { id: 'html', label: 'HTML', icon: Code2, component: HtmlFormatterTool, group: 'Formatters' },
  { id: 'xml', label: 'XML', icon: FileCode2, component: XmlFormatterTool, group: 'Formatters' },
  { id: 'css', label: 'CSS', icon: Paintbrush, component: CssFormatterTool, group: 'Formatters' },
  { id: 'sql', label: 'SQL', icon: Database, component: SQLTool, group: 'Formatters' },
  {
    id: 'timestamp',
    label: 'Timestamp',
    icon: Clock,
    component: TimestampTool,
    group: 'Converters',
  },
  {
    id: 'calc',
    label: 'Calculator',
    icon: Calculator,
    component: CalculatorTool,
    group: 'Converters',
  },
  { id: 'color', label: 'Color', icon: Palette, component: ColorTool, group: 'Converters' },
  { id: 'hash', label: 'Hash', icon: Hash, component: HashTool, group: 'Generators' },
  { id: 'text', label: 'Text Analyzer', icon: Type, component: TextTool, group: 'Generators' },
  { id: 'regexp', label: 'Regexp', icon: Regex, component: RegexpTool, group: 'Generators' },
  { id: 'diff', label: 'Diff', icon: GitCompare, component: DiffTool, group: 'Generators' },
  { id: 'git', label: 'Git Helper', icon: GitBranch, component: GitTool, group: 'DevOps' },
  {
    id: 'kubectl',
    label: 'Kubectl Helper',
    icon: Container,
    component: KubectlTool,
    group: 'DevOps',
  },
]

export const TOOLS_BY_GROUP = TOOLS.reduce((acc, tool) => {
  if (!acc[tool.group]) acc[tool.group] = []
  acc[tool.group].push(tool)
  return acc
}, {})

export const TOOLS_BY_ID = Object.fromEntries(TOOLS.map((tool) => [tool.id, tool]))
export const GROUPS = Object.keys(TOOLS_BY_GROUP)
