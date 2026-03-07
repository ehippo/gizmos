import { GitBranch, GitMerge, GitCommit, RotateCcw, Search, Upload, Download, Trash2, Tag, History } from 'lucide-react'
import RecipeTool from '../components/RecipeTool'

const RECIPES = [
  {
    group: 'Branches',
    items: [
      {
        id: 'checkout-new', label: 'Create & checkout branch', icon: GitBranch,
        description: 'Create a new branch and switch to it immediately.',
        fields: [{ id: 'branch', label: 'Branch name', placeholder: 'feature/my-feature' }],
        build: ({ branch }) => `git checkout -b ${branch || '<branch-name>'}`,
      },
      {
        id: 'merge', label: 'Merge branch', icon: GitMerge,
        description: 'Merge another branch into the specified target branch.',
        fields: [
          { id: 'target', label: 'Merge into (current)', placeholder: 'main' },
          { id: 'source', label: 'Branch to merge', placeholder: 'feature/my-feature' },
          { id: 'strategy', label: 'Strategy', type: 'select', options: ['--no-ff', '--ff-only', '--squash', '(default)'] },
        ],
        build: ({ target, source, strategy }) => {
          const s = strategy && strategy !== '(default)' ? ` ${strategy}` : ''
          return `git checkout ${target || 'main'} && git merge${s} ${source || '<branch>'}`
        },
      },
      {
        id: 'delete-branch', label: 'Delete branch', icon: Trash2,
        description: 'Remove a local branch and optionally its remote counterpart.',
        fields: [
          { id: 'branch', label: 'Branch name', placeholder: 'feature/old-feature' },
          { id: 'remote', label: 'Also delete remote?', type: 'select', options: ['No', 'Yes'] },
        ],
        build: ({ branch, remote }) => {
          const b = branch || '<branch>'
          const base = `git branch -d ${b}`
          return remote === 'Yes' ? `${base} && git push origin --delete ${b}` : base
        },
      },
      {
        id: 'rename-branch', label: 'Rename branch', icon: GitBranch,
        description: 'Change the name of an existing local branch.',
        fields: [
          { id: 'old', label: 'Old name', placeholder: 'old-name' },
          { id: 'newb', label: 'New name', placeholder: 'new-name' },
        ],
        build: ({ old, newb }) => `git branch -m ${old || '<old>'} ${newb || '<new>'}`,
      },
    ],
  },
  {
    group: 'Commits',
    items: [
      {
        id: 'commit', label: 'Stage & commit', icon: GitCommit,
        description: 'Stage all or specific files and create a new commit.',
        fields: [
          { id: 'files', label: 'Files (blank = all)', placeholder: 'src/app.js (or leave blank)' },
          { id: 'msg', label: 'Commit message', placeholder: 'feat: add login page' },
        ],
        build: ({ files, msg }) => {
          const add = files ? `git add ${files}` : 'git add .'
          return `${add} && git commit -m "${msg || '<message>'}"`
        },
      },
      {
        id: 'amend', label: 'Amend last commit', icon: GitCommit,
        description: 'Update the last commit with new changes or message.',
        fields: [{ id: 'msg', label: 'New message (blank = keep)', placeholder: 'fix: correct typo' }],
        build: ({ msg }) => msg ? `git commit --amend -m "${msg}"` : 'git commit --amend --no-edit',
      },
      {
        id: 'revert', label: 'Revert commit', icon: RotateCcw,
        description: 'Create a new commit that undoes a specific commit.',
        fields: [{ id: 'hash', label: 'Commit hash', placeholder: 'a1b2c3d' }],
        build: ({ hash }) => `git revert ${hash || '<commit-hash>'} --no-edit`,
      },
      {
        id: 'squash', label: 'Squash last N commits', icon: GitCommit,
        description: 'Combine the last N commits into a single commit.',
        fields: [
          { id: 'n', label: 'Number of commits', placeholder: '3' },
          { id: 'msg', label: 'New message', placeholder: 'feat: consolidated updates' },
        ],
        build: ({ n, msg }) => {
          const num = n || '2'
          const m = msg || `squash: last ${num} commits`
          return `git reset --soft HEAD~${num} && git commit -m "${m}"`
        },
      },
      {
        id: 'revert-n', label: 'Revert last N commits', icon: RotateCcw,
        description: 'Revert a range of the last N commits.',
        fields: [{ id: 'n', label: 'Number of commits', placeholder: '3' }],
        build: ({ n }) => `git revert --no-edit HEAD~${n || '1'}..HEAD`,
      },
    ],
  },
  {
    group: 'Remote',
    items: [
      {
        id: 'pull', label: 'Pull with rebase', icon: Download,
        description: 'Fetch changes and rebase your branch on top of them.',
        fields: [
          { id: 'remote', label: 'Remote', placeholder: 'origin' },
          { id: 'branch', label: 'Branch', placeholder: 'main' },
        ],
        build: ({ remote, branch }) => `git pull --rebase ${remote || 'origin'} ${branch || 'main'}`,
      },
      {
        id: 'push', label: 'Push branch', icon: Upload,
        description: 'Upload your local branch changes to the remote.',
        fields: [
          { id: 'remote', label: 'Remote', placeholder: 'origin' },
          { id: 'branch', label: 'Branch', placeholder: 'feature/my-feature' },
          { id: 'force', label: 'Force push?', type: 'select', options: ['No', 'Yes (--force-with-lease)', 'Yes (--force)'] },
        ],
        build: ({ remote, branch, force }) => {
          const r = remote || 'origin', b = branch || 'HEAD'
          if (force === 'Yes (--force-with-lease)') return `git push --force-with-lease ${r} ${b}`
          if (force === 'Yes (--force)') return `git push --force ${r} ${b}`
          return `git push ${r} ${b}`
        },
      },
      {
        id: 'clone', label: 'Clone repository', icon: Download,
        description: 'Download a full copy of a remote repository.',
        fields: [
          { id: 'url', label: 'Repository URL', placeholder: 'https://github.com/user/repo.git' },
          { id: 'depth', label: 'Shallow depth (blank = full)', placeholder: '1' },
          { id: 'dir', label: 'Target directory (optional)', placeholder: 'my-repo' },
        ],
        build: ({ url, depth, dir }) => {
          let cmd = `git clone ${url || '<url>'}`
          if (depth) cmd += ` --depth ${depth}`
          if (dir) cmd += ` ${dir}`
          return cmd
        },
      },
    ],
  },
  {
    group: 'History & Diff',
    items: [
      {
        id: 'log', label: 'Pretty log', icon: History,
        description: 'View a simplified, graphical commit history.',
        fields: [{ id: 'n', label: 'Last N commits', placeholder: '20' }],
        build: ({ n }) => `git log --oneline --graph --decorate -${n || '20'}`,
      },
      {
        id: 'diff', label: 'Diff branches', icon: Search,
        description: 'Compare the differences between two branches.',
        fields: [
          { id: 'from', label: 'From', placeholder: 'main' },
          { id: 'to', label: 'To', placeholder: 'feature/my-feature' },
        ],
        build: ({ from, to }) => `git diff ${from || 'main'}..${to || '<branch>'}`,
      },
      {
        id: 'stash', label: 'Stash & restore', icon: Tag,
        description: 'Temporarily save uncommitted changes.',
        fields: [
          { id: 'action', label: 'Action', type: 'select', options: ['stash', 'stash pop', 'stash list', 'stash drop'] },
          { id: 'msg', label: 'Message (for stash)', placeholder: 'wip: half-done feature' },
        ],
        build: ({ action, msg }) => {
          if (action === 'stash' && msg) return `git stash push -m "${msg}"`
          return `git ${action || 'stash'}`
        },
      },
    ],
  },
]

export default function GitTool() {
  return <RecipeTool title="Git Helper" recipes={RECIPES} />
}
