import React from 'react';
import {
    GitBranch, RotateCcw, Trash2, Download, Save, History, Zap, BookOpen
} from 'lucide-react';

export const CATEGORIES = [
    { id: 'workflow', label: 'Daily Workflow', icon: <Save size={16} /> },
    { id: 'branches', label: 'Branches', icon: <GitBranch size={16} /> },
    { id: 'commits', label: 'Commits', icon: <RotateCcw size={16} /> },
    { id: 'history', label: 'History & Diff', icon: <History size={16} /> },
    { id: 'cleanup', label: 'Cleanup', icon: <Trash2 size={16} /> },
    { id: 'misc', label: 'Misc', icon: <Zap size={16} /> },
];

export const RECIPES = [
    // SETUP
    {
        category: 'workflow',
        id: 'clone',
        label: 'Clone Repository',
        desc: 'Clone a remote repository to your local machine. Use depth for a shallow clone (faster).',
        fields: [
            { id: 'url', label: 'Remote Repo Link', placeholder: 'https://github.com/user/repo.git' },
            { id: 'depth', label: 'Depth (Optional)', placeholder: '1', type: 'number' }
        ],
        command: (f) => `git clone ${f.depth ? `--depth ${f.depth} ` : ''}${f.url || '<remote_repository_link>'}`
    },

    // DAILY WORKFLOW
    {
        category: 'workflow',
        id: 'status',
        label: 'Check Branch Status',
        desc: 'Assess the status of your local branch relative to its upstream.',
        command: () => 'git status'
    },
    {
        category: 'workflow',
        id: 'pull',
        label: 'Pull Latest Changes',
        desc: 'Pull the latest changes from the remote repository to keep your workspace fresh.',
        fields: [
            { id: 'remote', label: 'Remote Name', defaultValue: 'origin', placeholder: 'origin' },
            { id: 'branch', label: 'Remote Head Branch', placeholder: 'main' },
            { id: 'rebase', label: 'Use Rebase', type: 'toggle', desc: 'Replay your commits on top of incoming changes' },
            { id: 'prune', label: 'Prune Branches', type: 'toggle', desc: 'Remove remote-tracking references that no longer exist' }
        ],
        command: (f) => `git pull ${f.rebase ? '--rebase ' : ''}${f.prune ? '--prune ' : ''}${f.remote || 'origin'} ${f.branch || '<remote_head_branch>'}`
    },
    {
        category: 'workflow',
        id: 'add',
        label: 'Stage Changes',
        desc: 'Add modified files to the staging area. Leave empty to stage all changes.',
        fields: [
            { id: 'files', label: 'Specific Files (Optional)', placeholder: 'src/App.js "file 2.txt"' },
            { id: 'all', label: 'Stage All', type: 'toggle', desc: 'Equivalent to git add -A' }
        ],
        command: (f) => f.all ? 'git add -A' : `git add ${f.files || '.'}`
    },
    {
        category: 'workflow',
        id: 'commit',
        label: 'Commit Changes',
        desc: 'Wrap up your work with a descriptive commit message.',
        fields: [
            { id: 'msg', label: 'Commit Message', placeholder: 'feat: add login validation' },
            { id: 'all', label: 'Stage All First', type: 'toggle', desc: 'Stage modified and deleted files automatically (-a)' },
            { id: 'amend', label: 'Amend Previous', type: 'toggle', desc: 'Overwrite the previous commit' }
        ],
        command: (f) => {
            let flags = '';
            if (f.all) flags += '-a ';
            if (f.amend) flags += '--amend ';
            return `git commit ${flags}-m "${f.msg || '__commit__msg__'}"`;
        }
    },
    {
        category: 'workflow',
        id: 'push',
        label: 'Push to Remote',
        desc: 'Push your commits to the remote repository. Often returns a PR link.',
        fields: [
            { id: 'remote', label: 'Remote Name', defaultValue: 'origin', placeholder: 'origin' },
            { id: 'branch', label: 'Working Branch Name', placeholder: 'feature/login' },
            { id: 'force', label: 'Force Push', type: 'toggle', desc: 'Overwrite remote history (Use with caution!)' },
            { id: 'setUpstream', label: 'Set Upstream', type: 'toggle', desc: 'Link local branch to remote (-u)' }
        ],
        command: (f) => {
            let flags = '';
            if (f.force) flags += '--force ';
            if (f.setUpstream) flags += '-u ';
            return `git push ${flags}${f.remote || 'origin'} ${f.branch || '<working_branchname>'}`;
        }
    },

    // BRANCHES
    {
        category: 'branches',
        id: 'new-branch',
        label: 'Create & Switch Branch',
        desc: 'Create a new local branch that tracks a specific upstream head.',
        fields: [
            { id: 'name', label: 'New Branch Name', placeholder: 'feature/new-one' },
            { id: 'upstream', label: 'Upstream Head Branch', placeholder: 'origin/main' }
        ],
        command: (f) => `git checkout -b ${f.name || '<new_local_branch>'} ${f.upstream || '<upstream/remote_head_branch>'}`
    },
    {
        category: 'branches',
        id: 'checkout',
        label: 'Switch to Branch',
        desc: 'Quickly switch between existing local branches.',
        fields: [
            { id: 'name', label: 'Branch Name', placeholder: 'main' },
            { id: 'force', label: 'Force Switch', type: 'toggle', desc: 'Discard local changes during switch' }
        ],
        command: (f) => `git checkout ${f.force ? '-f ' : ''}${f.name || '<branch_name>'}`
    },
    {
        category: 'branches',
        id: 'list-branches',
        label: 'List All Branches',
        desc: 'View available local branches in your repository.',
        command: () => 'git branch'
    },
    {
        category: 'branches',
        id: 'delete-branch',
        label: 'Delete Local Branch',
        desc: 'Remove a local branch that is no longer needed.',
        fields: [{ id: 'name', label: 'Branch Name', placeholder: 'feature/old-one' }],
        command: (f) => `git branch -D ${f.name || '<branchname>'}`
    },
    {
        category: 'branches',
        id: 'merge',
        label: 'Merge Branch',
        desc: 'Merge another branch into your current branch.',
        fields: [
            { id: 'branch', label: 'Source Branch', placeholder: 'feature/login' },
            { id: 'noFf', label: 'No Fast-Forward', type: 'toggle', desc: 'Always create a merge commit' },
            { id: 'squash', label: 'Squash Merge', type: 'toggle', desc: 'Combine all source commits into one' }
        ],
        command: (f) => {
            let flags = '';
            if (f.noFf) flags += '--no-ff ';
            if (f.squash) flags += '--squash ';
            return `git merge ${flags}${f.branch || '<branch>'}`;
        }
    },
    {
        category: 'branches',
        id: 'orphan',
        label: 'Create Orphan Branch',
        desc: 'Create a branch with no history (e.g., for gh-pages).',
        fields: [{ id: 'name', label: 'New Branch Name', placeholder: 'gh-pages' }],
        command: (f) => `git checkout --orphan ${f.name || '<name>'}`
    },
    {
        category: 'branches',
        id: 'rename-local',
        label: 'Rename Current Branch',
        desc: 'Rename the branch you are currently on.',
        fields: [{ id: 'name', label: 'New Branch Name', placeholder: 'feature/shiny-new' }],
        command: (f) => `git branch -m ${f.name || '<name>'}`
    },
    {
        category: 'branches',
        id: 'delete-remote',
        label: 'Delete Remote Branch',
        desc: 'Permanently remove a branch from the remote server.',
        fields: [
            { id: 'remote', label: 'Remote Name', placeholder: 'origin', defaultValue: 'origin' },
            { id: 'branch', label: 'Branch Name', placeholder: 'feature/old-stuff' }
        ],
        command: (f) => `git push ${f.remote || 'origin'} --delete ${f.branch || '<branch>'}`
    },

    // COMMITS (Advanced)
    {
        category: 'commits',
        id: 'undo',
        label: 'Undo Last Commit(s)',
        desc: 'Revert history using Mixed (keep code), Soft (keep staged), or Hard (delete) reset.',
        fields: [
            {
                id: 'mode', label: 'Reset Mode', type: 'select', defaultValue: 'mixed',
                options: [
                    { value: 'mixed', label: 'Mixed (Unstage, keep changes)' },
                    { value: 'soft', label: 'Soft (Keep changes staged)' },
                    { value: 'hard', label: 'Hard (Discard all changes!)' }
                ]
            },
            { id: 'n', label: 'Commits Back (N)', defaultValue: '1', type: 'number' }
        ],
        command: (f) => {
            const flag = f.mode === 'soft' ? '--soft ' : (f.mode === 'hard' ? '--hard ' : '');
            return `git reset ${flag}HEAD~${f.n || '1'}`;
        }
    },
    {
        category: 'commits',
        id: 'cherry-pick',
        label: 'Cherry-pick Commit',
        desc: 'Copy a single commit from another branch to your current one.',
        fields: [{ id: 'hash', label: 'Commit Hash', placeholder: 'abc1234' }],
        command: (f) => `git cherry-pick ${f.hash || '<hash>'}`
    },
    {
        category: 'commits',
        id: 'amend',
        label: 'Amend Last Commit',
        desc: 'Add staged changes to the previous commit or edit its message.',
        command: () => 'git commit --amend'
    },
    {
        category: 'commits',
        id: 'revert',
        label: 'Revert Commit',
        desc: 'Create a new commit that undoes the changes of a specific commit.',
        fields: [{ id: 'hash', label: 'Commit Hash', placeholder: 'abc1234' }],
        command: (f) => `git revert ${f.hash || '<hash>'}`
    },

    // HISTORY & DIFF
    {
        category: 'history',
        id: 'diff',
        label: 'Compare Changes',
        desc: 'Compare workspace changes, specific files, or references.',
        fields: [
            {
                id: 'type', label: 'Comparison Type', type: 'select', defaultValue: 'workspace',
                options: [
                    { value: 'workspace', label: 'Workspace vs Head' },
                    { value: 'file', label: 'Specific File' },
                    { value: 'refs', label: 'Between Branches/Commits' }
                ]
            },
            { id: 'path', label: 'File Path', placeholder: 'src/main.js', showIf: (f) => f.type === 'file' },
            { id: 'h1', label: 'Reference 1', placeholder: 'main', showIf: (f) => f.type === 'refs' },
            { id: 'h2', label: 'Reference 2', placeholder: 'feature/login', showIf: (f) => f.type === 'refs' }
        ],
        command: (f) => {
            if (f.type === 'file') return `git diff -- ${f.path || '<file>'}`;
            if (f.type === 'refs') return `git diff ${f.h1 || '<ref1>'} ${f.h2 || '<ref2>'}`;
            return 'git diff';
        }
    },
    {
        category: 'history',
        id: 'log',
        label: 'View History',
        desc: 'Browse logical timeline or visual graph of recent commits.',
        fields: [
            {
                id: 'mode', label: 'Log Mode', type: 'select', defaultValue: 'standard',
                options: [
                    { value: 'standard', label: 'Standard Log' },
                    { value: 'graph', label: 'Visual Graph (All branches)' }
                ]
            }
        ],
        command: (f) => f.mode === 'graph' ? 'git log --oneline --graph --decorate --all' : 'git log'
    },
    {
        category: 'history',
        id: 'squash',
        label: 'Squash Commits',
        desc: 'Combine the last N commits into one using interactive rebase.',
        fields: [{ id: 'n', label: 'Number of commits', placeholder: '3', type: 'number' }],
        command: (f) => `git rebase -i HEAD~${f.n || 'N'}`
    },

    // CLEANUP & MISC
    {
        category: 'cleanup',
        id: 'cleanup-branches',
        label: 'Purge Merged Branches',
        desc: 'Remove local branches that have already been merged into current head.',
        command: () => 'git branch --merged | grep -v "*" | xargs -n 1 git branch -d'
    },
    {
        category: 'cleanup',
        id: 'untrack',
        label: 'Untrack File (Keep Local)',
        desc: 'Remove from Git tracking without deleting the actual file.',
        fields: [{ id: 'path', label: 'File Path', placeholder: 'config/secrets.json' }],
        command: (f) => `git rm --cached ${f.path || '<path>'}`
    },
    {
        category: 'misc',
        id: 'tag',
        label: 'Create Release Tag',
        desc: 'Create an annotated tag for deployment or versioning.',
        fields: [
            { id: 'name', label: 'Tag Name', placeholder: 'v1.0.0' },
            { id: 'msg', label: 'Message', placeholder: 'Production Release' }
        ],
        command: (f) => `git tag -a ${f.name || '<name>'} -m "${f.msg || 'Release'}"`
    },
    {
        category: 'misc',
        id: 'stash',
        label: 'Stash Work',
        desc: 'Safely save uncommitted changes or apply the latest stash.',
        fields: [
            {
                id: 'action', label: 'Action', type: 'select', defaultValue: 'push',
                options: [
                    { value: 'push', label: 'Stash Changes' },
                    { value: 'pop', label: 'Pop Latest (Apply & Delete)' },
                    { value: 'apply', label: 'Apply Latest (Keep Stash)' }
                ]
            },
            { id: 'msg', label: 'Note', placeholder: 'work in progress', showIf: (f) => f.action === 'push' }
        ],
        command: (f) => {
            if (f.action === 'pop') return 'git stash pop';
            if (f.action === 'apply') return 'git stash apply';
            return `git stash push ${f.msg ? `-m "${f.msg}"` : ''}`;
        }
    },
    {
        category: 'misc',
        id: 'blame',
        label: 'Blame',
        desc: 'Inspect file to see who last modified each line.',
        fields: [{ id: 'path', label: 'File Path', placeholder: 'src/App.js' }],
        command: (f) => `git blame ${f.path || '<path>'}`
    },
];

export const getGuideContent = (id) => {
    const guides = {
        'clone': "Cloning creates a local copy of a remote repository. You can use HTTPS (username/password) or SSH (keys). Depth limits the history pulled.",
        'pull': "Always pull before you start work! This ensures your local branch is synchronized with the latest changes from the team.",
        'commit': "Best practice: Commit early and often. Small, focused commits are much easier to review and revert if something goes wrong.",
        'push': "Once you push, your changes are available on the remote. This command usually returns a link to initiate a Pull Request (PR).",
        'undo': "Undo commit is your 'Time Machine'. Mixed keeps files as-is, Soft keeps them staged for a quick fix, and Hard deletes them entirely.",
        'diff': "Use diff to double-check your work. You can compare your workspace, a specific file, or even two different branches.",
        'status': "Status is your best friend. It tells you exactly what's staged, what's modified, and which branch you're on.",
        'cherry-pick': "Cherry-picking is like copy-pasting a commit. It's incredibly useful for moving bug fixes between branches without merging everything.",
        'stash': "Stash is a temporary shelf for your code. Use it when you need to switch branches but aren't ready to commit yet."
    };
    return guides[id] || "This Git command follows standard Unix conventions. Mastering these basics forms the backbone of modern software development workflow.";
};

export const getHabitContent = (cat) => {
    const habits = {
        'workflow': "Professional developers pull every morning and commit every evening. It's more than a command; it's a rhythm for success.",
        'setup': "Setting up a clean environment is 50% of the work. Use SSH protocol for a hands-free developer experience.",
        'branches': "Branches are free! Use them for every new feature or experiment. It keeps your 'main' branch deployable at all times.",
        'commits': "Your commit messages are a letter to your future self. Make them descriptive and meaningful.",
        'history': "Reviewing history helps you understand the 'why' behind the code. Use the visual graph for complex merge trees."
    };
    return habits[cat] || "Keep your Git workspace clean by deleting old branches and stashing unused changes regularly.";
};
