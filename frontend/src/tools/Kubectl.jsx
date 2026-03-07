import { Container, Search, RefreshCw, Trash2, FileText, Terminal, ArrowRight, Scale, Eye } from 'lucide-react'
import RecipeTool from '../components/RecipeTool'

const RECIPES = [
  {
    group: 'Pods',
    items: [
      {
        id: 'get-pods', label: 'List pods', icon: Search,
        fields: [
          { id: 'ns', label: 'Namespace (blank = default)', placeholder: 'production' },
          { id: 'selector', label: 'Label selector (optional)', placeholder: 'app=nginx' },
          { id: 'wide', label: 'Output', type: 'select', options: ['normal', 'wide', 'watch (-w)'] },
        ],
        build: ({ ns, selector, wide }) => {
          let cmd = 'kubectl get pods'
          if (ns) cmd += ` -n ${ns}`
          if (selector) cmd += ` -l ${selector}`
          if (wide === 'wide') cmd += ' -o wide'
          if (wide === 'watch (-w)') cmd += ' -w'
          return cmd
        },
      },
      {
        id: 'exec', label: 'Exec into pod', icon: Terminal,
        fields: [
          { id: 'pod', label: 'Pod name', placeholder: 'nginx-7d4b9c8f6-xk2lp' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
          { id: 'container', label: 'Container (optional)', placeholder: 'nginx' },
          { id: 'shell', label: 'Shell', type: 'select', options: ['/bin/sh', '/bin/bash', 'sh', 'bash'] },
        ],
        build: ({ pod, ns, container, shell }) => {
          let cmd = `kubectl exec -it ${pod || '<pod-name>'}`
          if (ns) cmd += ` -n ${ns}`
          if (container) cmd += ` -c ${container}`
          cmd += ` -- ${shell || '/bin/sh'}`
          return cmd
        },
      },
      {
        id: 'logs', label: 'View logs', icon: FileText,
        fields: [
          { id: 'pod', label: 'Pod name', placeholder: 'nginx-7d4b9c8f6-xk2lp' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
          { id: 'container', label: 'Container (optional)', placeholder: 'nginx' },
          { id: 'tail', label: 'Last N lines', placeholder: '100' },
          { id: 'follow', label: 'Follow?', type: 'select', options: ['No', 'Yes (-f)'] },
          { id: 'prev', label: 'Previous container?', type: 'select', options: ['No', 'Yes (-p)'] },
        ],
        build: ({ pod, ns, container, tail, follow, prev }) => {
          let cmd = `kubectl logs ${pod || '<pod-name>'}`
          if (ns) cmd += ` -n ${ns}`
          if (container) cmd += ` -c ${container}`
          if (tail) cmd += ` --tail=${tail}`
          if (follow === 'Yes (-f)') cmd += ' -f'
          if (prev === 'Yes (-p)') cmd += ' -p'
          return cmd
        },
      },
      {
        id: 'delete-pod', label: 'Delete / restart pod', icon: Trash2,
        fields: [
          { id: 'pod', label: 'Pod name', placeholder: 'nginx-7d4b9c8f6-xk2lp' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
          { id: 'force', label: 'Force?', type: 'select', options: ['No', 'Yes (--force)'] },
        ],
        build: ({ pod, ns, force }) => {
          let cmd = `kubectl delete pod ${pod || '<pod-name>'}`
          if (ns) cmd += ` -n ${ns}`
          if (force === 'Yes (--force)') cmd += ' --force --grace-period=0'
          return cmd
        },
      },
    ],
  },
  {
    group: 'Deployments',
    items: [
      {
        id: 'rollout-restart', label: 'Rollout restart', icon: RefreshCw,
        fields: [
          { id: 'name', label: 'Deployment name', placeholder: 'nginx-deployment' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
        ],
        build: ({ name, ns }) => {
          let cmd = `kubectl rollout restart deployment/${name || '<name>'}`
          if (ns) cmd += ` -n ${ns}`
          return cmd
        },
      },
      {
        id: 'scale', label: 'Scale deployment', icon: Scale,
        fields: [
          { id: 'name', label: 'Deployment name', placeholder: 'nginx-deployment' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
          { id: 'replicas', label: 'Replicas', placeholder: '3' },
        ],
        build: ({ name, ns, replicas }) => {
          let cmd = `kubectl scale deployment/${name || '<name>'} --replicas=${replicas || '1'}`
          if (ns) cmd += ` -n ${ns}`
          return cmd
        },
      },
      {
        id: 'set-image', label: 'Update image', icon: ArrowRight,
        fields: [
          { id: 'deploy', label: 'Deployment', placeholder: 'nginx-deployment' },
          { id: 'container', label: 'Container name', placeholder: 'nginx' },
          { id: 'image', label: 'New image', placeholder: 'nginx:1.25.3' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
        ],
        build: ({ deploy, container, image, ns }) => {
          let cmd = `kubectl set image deployment/${deploy || '<deploy>'} ${container || '<container>'}=${image || '<image>'}`
          if (ns) cmd += ` -n ${ns}`
          return cmd
        },
      },
      {
        id: 'rollback', label: 'Rollback', icon: RefreshCw,
        fields: [
          { id: 'name', label: 'Deployment name', placeholder: 'nginx-deployment' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
          { id: 'revision', label: 'To revision (blank = previous)', placeholder: '2' },
        ],
        build: ({ name, ns, revision }) => {
          let cmd = `kubectl rollout undo deployment/${name || '<name>'}`
          if (revision) cmd += ` --to-revision=${revision}`
          if (ns) cmd += ` -n ${ns}`
          return cmd
        },
      },
    ],
  },
  {
    group: 'Context & Config',
    items: [
      {
        id: 'ctx-list', label: 'List / switch context', icon: Eye,
        fields: [
          { id: 'action', label: 'Action', type: 'select', options: ['list contexts', 'current context', 'switch context'] },
          { id: 'ctx', label: 'Context name (for switch)', placeholder: 'prod-cluster' },
        ],
        build: ({ action, ctx }) => {
          if (action === 'list contexts') return 'kubectl config get-contexts'
          if (action === 'current context') return 'kubectl config current-context'
          return `kubectl config use-context ${ctx || '<context-name>'}`
        },
      },
      {
        id: 'port-forward', label: 'Port forward', icon: ArrowRight,
        fields: [
          { id: 'resource', label: 'Resource type', type: 'select', options: ['pod', 'service', 'deployment'] },
          { id: 'name', label: 'Resource name', placeholder: 'nginx-7d4b9c8f6-xk2lp' },
          { id: 'local', label: 'Local port', placeholder: '8080' },
          { id: 'remote', label: 'Remote port', placeholder: '80' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
        ],
        build: ({ resource, name, local: l, remote: r, ns }) => {
          let cmd = `kubectl port-forward ${resource || 'pod'}/${name || '<name>'} ${l || '8080'}:${r || '80'}`
          if (ns) cmd += ` -n ${ns}`
          return cmd
        },
      },
      {
        id: 'describe', label: 'Describe resource', icon: Search,
        fields: [
          { id: 'kind', label: 'Kind', type: 'select', options: ['pod', 'deployment', 'service', 'ingress', 'node', 'pvc', 'configmap', 'secret'] },
          { id: 'name', label: 'Name', placeholder: 'my-resource' },
          { id: 'ns', label: 'Namespace', placeholder: 'default' },
        ],
        build: ({ kind, name, ns }) => {
          let cmd = `kubectl describe ${kind || 'pod'} ${name || '<name>'}`
          if (ns && kind !== 'node') cmd += ` -n ${ns}`
          return cmd
        },
      },
    ],
  },
]

export default function KubectlTool() {
  return <RecipeTool title="Kubectl Helper" recipes={RECIPES} />
}
