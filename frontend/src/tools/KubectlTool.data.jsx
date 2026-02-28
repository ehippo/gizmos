import React from 'react';
import {
    Settings, Eye, PlayCircle, Activity, Scaling, ShieldAlert,
    FileText, Database, Box, Terminal, Zap, Clock, Search,
    RefreshCw, Trash2, List, Info, Layout
} from 'lucide-react';

export const CATEGORIES = [
    { id: 'config', label: 'Config & Context', icon: <Settings size={16} /> },
    { id: 'view', label: 'View Resources', icon: <Eye size={16} /> },
    { id: 'workloads', label: 'Run Workloads', icon: <PlayCircle size={16} /> },
    { id: 'ops', label: 'Operations', icon: <RefreshCw size={16} /> },
    { id: 'debug', label: 'Troubleshoot', icon: <Activity size={16} /> },
    { id: 'cluster', label: 'Cluster/Nodes', icon: <Layout size={16} /> },
];

export const RECIPES = [
    // CONFIG & CONTEXT
    {
        category: 'config',
        id: 'view-config',
        label: 'View Current Config',
        desc: 'Display merged kubeconfig settings.',
        fields: [
            { id: 'raw', label: 'Raw mode', type: 'toggle', desc: 'Show raw certificate data and secrets' },
            { id: 'minify', label: 'Minify', type: 'toggle', desc: 'Only show information relevant to current context' }
        ],
        command: (f) => `kubectl config view ${f.raw ? '--raw ' : ''}${f.minify ? '--minify ' : ''}`
    },
    {
        category: 'config',
        id: 'get-contexts',
        label: 'List All Contexts',
        desc: 'Display list of available clusters/contexts.',
        command: () => 'kubectl config get-contexts'
    },
    {
        category: 'config',
        id: 'use-context',
        label: 'Switch Context',
        desc: 'Set the current active cluster context.',
        fields: [{ id: 'name', label: 'Context Name', placeholder: 'my-cluster-name' }],
        command: (f) => `kubectl config use-context ${f.name || '<context_name>'}`
    },
    {
        category: 'config',
        id: 'set-ns',
        label: 'Set Default Namespace',
        desc: 'Set the namespace for all subsequent commands in current context.',
        fields: [{ id: 'ns', label: 'Namespace', placeholder: 'my-namespace' }],
        command: (f) => `kubectl config set-context --current --namespace=${f.ns || '<namespace>'}`
    },

    // VIEWING RESOURCES
    {
        category: 'view',
        id: 'get-pods',
        label: 'List Pods',
        desc: 'View pods in the current or all namespaces.',
        fields: [
            { id: 'allNs', label: 'All Namespaces', type: 'toggle' },
            { id: 'wide', label: 'Wide Output', type: 'toggle', desc: 'Show more details like IP and Node' },
            { id: 'watch', label: 'Watch mode', type: 'toggle', desc: 'Stream status changes (-w)' }
        ],
        command: (f) => `kubectl get pods ${f.allNs ? '-A ' : ''}${f.wide ? '-o wide ' : ''}${f.watch ? '-w ' : ''}`
    },
    {
        category: 'view',
        id: 'get-any',
        label: 'List Any Resource',
        desc: 'Generic list command for any resource type.',
        fields: [
            {
                id: 'type', label: 'Resource Type', type: 'select', defaultValue: 'services',
                options: [
                    { value: 'services', label: 'Services' },
                    { value: 'deployments', label: 'Deployments' },
                    { value: 'ingresses', label: 'Ingresses' },
                    { value: 'configmaps', label: 'ConfigMaps' },
                    { value: 'secrets', label: 'Secrets' },
                    { value: 'pvc', label: 'PersistentVolumeClaims' },
                    { value: 'events', label: 'Events' }
                ]
            },
            { id: 'ns', label: 'Namespace (Optional)', placeholder: 'default' }
        ],
        command: (f) => `kubectl get ${f.type || 'services'} ${f.ns ? `-n ${f.ns}` : ''}`
    },
    {
        category: 'view',
        id: 'describe',
        label: 'Describe Resource',
        desc: 'Get detailed information about a specific resource.',
        fields: [
            {
                id: 'type', label: 'Type', type: 'select', defaultValue: 'pod',
                options: [
                    { value: 'pod', label: 'Pod' },
                    { value: 'service', label: 'Service' },
                    { value: 'deployment', label: 'Deployment' },
                    { value: 'node', label: 'Node' }
                ]
            },
            { id: 'name', label: 'Name', placeholder: 'my-resource-name' }
        ],
        command: (f) => `kubectl describe ${f.type} ${f.name || '<name>'}`
    },

    // RUN WORKLOADS
    {
        category: 'workloads',
        id: 'apply',
        label: 'Apply Manifest',
        desc: 'Create or update resources from a YAML/JSON file.',
        fields: [
            { id: 'file', label: 'File Path or URL', placeholder: './manifest.yaml' },
            { id: 'recursive', label: 'Recursive', type: 'toggle', desc: 'Process directories recursively' }
        ],
        command: (f) => `kubectl apply ${f.recursive ? '-R ' : ''}-f ${f.file || '<file_path>'}`
    },
    {
        category: 'workloads',
        id: 'run-nginx',
        label: 'Start Simple Nginx',
        desc: 'Run a single instance of nginx pod.',
        fields: [
            { id: 'name', label: 'Pod Name', defaultValue: 'nginx' },
            { id: 'dryRun', label: 'Dry Run (YAML)', type: 'toggle', desc: 'Generate YAML without creating' }
        ],
        command: (f) => `kubectl run ${f.name || 'nginx'} --image=nginx ${f.dryRun ? '--dry-run=client -o yaml' : ''}`
    },

    // OPERATIONS
    {
        category: 'ops',
        id: 'scale',
        label: 'Scale Deployment',
        desc: 'Change the number of replicas for a deployment or replicaset.',
        fields: [
            { id: 'name', label: 'Deployment Name', placeholder: 'my-app' },
            { id: 'replicas', label: 'Replicas', type: 'number', defaultValue: '3' }
        ],
        command: (f) => `kubectl scale deployment/${f.name || '<name>'} --replicas=${f.replicas || '1'}`
    },
    {
        category: 'ops',
        id: 'rollout-restart',
        label: 'Rolling Restart',
        desc: 'Trigger a rolling restart of a deployment.',
        fields: [{ id: 'name', label: 'Deployment Name', placeholder: 'my-app' }],
        command: (f) => `kubectl rollout restart deployment/${f.name || '<name>'}`
    },
    {
        category: 'ops',
        id: 'rollout-undo',
        label: 'Rollback Deployment',
        desc: 'Undo a previous rollout.',
        fields: [
            { id: 'name', label: 'Deployment Name', placeholder: 'my-app' },
            { id: 'revision', label: 'To Revision (Optional)', type: 'number' }
        ],
        command: (f) => `kubectl rollout undo deployment/${f.name || '<name>'} ${f.revision ? `--to-revision=${f.revision}` : ''}`
    },

    // TROUBLESHOOT
    {
        category: 'debug',
        id: 'logs',
        label: 'View Logs',
        desc: 'Print the logs for a container in a pod.',
        fields: [
            { id: 'pod', label: 'Pod Name', placeholder: 'my-pod' },
            { id: 'follow', label: 'Follow', type: 'toggle', desc: 'Stream logs (-f)' },
            { id: 'tail', label: 'Tail lines', type: 'number', placeholder: '100' },
            { id: 'prev', label: 'Previous', type: 'toggle', desc: 'Show logs for a crashed instance' }
        ],
        command: (f) => `kubectl logs ${f.follow ? '-f ' : ''}${f.pod || '<pod>'} ${f.tail ? `--tail=${f.tail} ` : ''}${f.prev ? '--previous' : ''}`
    },
    {
        category: 'debug',
        id: 'exec',
        label: 'Interactive Shell',
        desc: 'Execute an interactive shell inside a running pod.',
        fields: [
            { id: 'pod', label: 'Pod Name', placeholder: 'my-pod' },
            { id: 'shell', label: 'Shell type', type: 'select', defaultValue: '/bin/sh', options: [{ value: '/bin/sh', label: 'sh' }, { value: '/bin/bash', label: 'bash' }] }
        ],
        command: (f) => `kubectl exec -it ${f.pod || '<pod>'} -- ${f.shell || '/bin/sh'}`
    },
    {
        category: 'debug',
        id: 'pf',
        label: 'Port Forward',
        desc: 'Forward local ports to a pod or service.',
        fields: [
            { id: 'target', label: 'Target (pod/svc name)', placeholder: 'my-app' },
            { id: 'ports', label: 'Ports (Local:Remote)', placeholder: '8080:80' }
        ],
        command: (f) => `kubectl port-forward ${f.target || '<target>'} ${f.ports || '8080:80'}`
    },
    {
        category: 'debug',
        id: 'top',
        label: 'Show Metrics (Top)',
        desc: 'Show CPU and Memory usage for pods or nodes.',
        fields: [
            { id: 'type', label: 'metrics for', type: 'select', defaultValue: 'pod', options: [{ value: 'pod', label: 'Pods' }, { value: 'node', label: 'Nodes' }] },
            { id: 'allNs', label: 'All Namespaces', type: 'toggle', showIf: (f) => f.type === 'pod' }
        ],
        command: (f) => `kubectl top ${f.type} ${f.allNs ? '-A' : ''}`
    },

    // CLUSTER
    {
        category: 'cluster',
        id: 'get-nodes',
        label: 'List Nodes',
        desc: 'View state of nodes in the cluster.',
        command: () => 'kubectl get nodes'
    },
    {
        category: 'cluster',
        id: 'cordon',
        label: 'Cordon Node',
        desc: 'Mark node as unschedulable.',
        fields: [{ id: 'node', label: 'Node Name', placeholder: 'node-1' }],
        command: (f) => `kubectl cordon ${f.node || '<node_name>'}`
    },
];

export const getGuideContent = (id) => {
    const guides = {
        'view-config': "The kubeconfig file is used to organize information about clusters, users, namespaces, and authentication contexts. Use `view --raw` to see actual secrets.",
        'use-context': "Contexts group access parameters under a convenient name. Switching context changes which cluster you are talking to.",
        'apply': "The standard way to manage production objects. It is declarative: you describe what you want, and Kubernetes makes it happen.",
        'logs': "If a pod is crashing, check `--previous` logs to see the error message from the failed instance.",
        'pf': "Port forwarding is a quick way to access internal services without creating a public LoadBalancer or Ingress.",
        'scale': "Replicas provide redundancy. Kubernetes will automatically attempt to maintain the requested count if nodes fail.",
        'rollout-restart': "Use this to pick up changes in ConfigMaps or Secrets that are mounted as environment variables.",
    };
    return guides[id] || "This command uses the standard Kubernetes CLI. Most operations require cluster-admin or specific RBAC permissions.";
};

export const getHabitContent = (cat) => {
    const habits = {
        'config': "Double check `kubectl config current-context` before running any destructive commands. Production and Staging look very similar in a terminal!",
        'view': "Use `-o wide` to quickly see which node a pod is running on and its internal IP address.",
        'workloads': "Always keep your manifest files in Git. `kubectl apply` should ideally be triggered by a CI/CD pipeline, not manually.",
        'debug': "The `events` log (kubectl get events) is often more useful than pod logs for finding why a pod failed to start (e.g., ImagePullBackOff).",
    };
    return habits[cat] || "Always use namespaces to organize your resources and avoid naming collisions.";
};
