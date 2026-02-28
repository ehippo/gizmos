import React from 'react';
import {
    ShieldCheck, Braces, Database, FileCode, Palette, Timer,
    Hash, Clock, Lock, Binary, Link2, CaseSensitive,
    ArrowLeftRight, Regex, Key, Type, FileDiff, Box,
    GitPullRequest
} from 'lucide-react';

import Base64Tool from './tools/Base64Tool';
import JSONTool from './tools/JSONTool';
import SQLTool from './tools/SQLTool';
import XMLTool from './tools/XMLTool';
import CSSTool from './tools/CSSTool';
import HTMLTool from './tools/HTMLTool';
import UnixTimeTool from './tools/UnixTimeTool';
import CronTool from './tools/CronTool';
import PasswordTool from './tools/PasswordTool';
import UUIDTool from './tools/UUIDTool';
import URLTool from './tools/URLTool';
import ColorTool from './tools/ColorTool';
import NumberBaseTool from './tools/NumberBaseTool';
import TextTool from './tools/TextTool';
import DiffTool from './tools/DiffTool';
import JWTTool from './tools/JWTTool';
import RegexTool from './tools/RegexTool';
import HashTool from './tools/HashTool';
import GitTool from './tools/GitTool';

// Version injected by Vite from package.json (see vite.config.js)
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.2.0';

export const THEMES = [
    { id: 'dark', label: 'Dark', swatch: '#7c6af7' },
    { id: 'light', label: 'Light', swatch: '#6254e8' },
    { id: 'midnight', label: 'Midnight', swatch: '#5b8ef7' },
    { id: 'solarized', label: 'Solarized', swatch: '#2aa198' },
    { id: 'mocha', label: 'Mocha', swatch: '#d4976a' },
];

export const TOOLS = [
    {
        group: 'Encoders',
        color: 'var(--cat-encoders)',
        items: [
            {
                id: 'base64', label: 'Base64', icon: <ArrowLeftRight size={18} />, desc: 'Encode & decode', component: Base64Tool, layout: 'full',
                help: 'Encodes text or binary data to Base64, and decodes it back. Useful for embedding data in JSON, URLs, or HTTP headers. Supports standard and URL-safe Base64 variants.'
            },
            {
                id: 'url', label: 'URL', icon: <Link2 size={18} />, desc: 'Encode & decode', component: URLTool, layout: 'full',
                help: 'Percent-encodes special characters for safe use in URLs (encodeURIComponent), and decodes them back to human-readable form.'
            },
            {
                id: 'jwt', label: 'JWT', icon: <Key size={18} />, desc: 'Decode & inspect', component: JWTTool, layout: 'full',
                help: 'Decodes JWT tokens to inspect header, payload, and signature. Also encodes new tokens using HS256/HS384/HS512 via the Web Crypto API — producing real, verifiable signatures.'
            },
            {
                id: 'hash', label: 'Hash', icon: <Hash size={18} />, desc: 'MD5 · SHA · HMAC', component: HashTool, layout: 'full',
                help: 'Computes MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes. Supports HMAC mode with a secret key, and multiple output formats. Handles both text and binary files correctly.'
            },
        ]
    },
    {
        group: 'Formatters',
        color: 'var(--cat-formatters)',
        items: [
            {
                id: 'json', label: 'JSON', icon: <Braces size={18} />, desc: 'Format & validate', component: JSONTool, layout: 'full',
                help: 'Parses and pretty-prints JSON, reports validation errors, and can minify output for compact storage or transmission.'
            },
            {
                id: 'sql', label: 'SQL', icon: <Database size={18} />, desc: 'Format & beautify', component: SQLTool, layout: 'full',
                help: 'Formats raw SQL by normalising keywords to uppercase and adding line breaks at major clauses (SELECT, FROM, WHERE, JOIN …).'
            },
            {
                id: 'xml', label: 'XML', icon: <FileCode size={18} />, desc: 'Format & validate', component: XMLTool, layout: 'full',
                help: 'Indents and pretty-prints XML documents. Highlights structural errors when the document cannot be parsed.'
            },
            {
                id: 'css', label: 'CSS', icon: <Palette size={18} />, desc: 'Format & minify', component: CSSTool, layout: 'full',
                help: 'Expands minified CSS into readable form with consistent indentation, or minifies it by stripping whitespace and comments.'
            },
            {
                id: 'html', label: 'HTML', icon: <FileCode size={18} />, desc: 'Format & prettify', component: HTMLTool, layout: 'full',
                help: 'Indents and pretty-prints HTML markup, making nested structures readable. Self-closing tags are handled correctly.'
            },
        ]
    },
    {
        group: 'Converters',
        color: 'var(--cat-converters)',
        items: [
            {
                id: 'unix', label: 'Unix Time', icon: <Clock size={18} />, desc: 'Timestamp converter', component: UnixTimeTool, layout: 'compact',
                help: 'Converts Unix timestamps (seconds or milliseconds) to UTC, ISO 8601, RFC 822, and relative time. Includes a live clock and common presets.'
            },
            {
                id: 'color', label: 'Color', icon: <Palette size={18} />, desc: 'HEX · RGB · HSL', component: ColorTool, layout: 'compact',
                help: 'Converts hex colour codes to RGB, RGBA, and HSL. Includes a native colour picker, a luminance readout, and a quick-access palette.'
            },
            {
                id: 'base', label: 'Number Base', icon: <Binary size={18} />, desc: 'DEC · HEX · BIN · OCT', component: NumberBaseTool, layout: 'compact',
                help: 'Converts numbers between decimal, hexadecimal, binary, and octal bases. Supports any integer value that fits in a JavaScript Number.'
            },
        ]
    },
    {
        group: 'Generators',
        color: 'var(--cat-generators)',
        items: [
            {
                id: 'cron', label: 'Cron', icon: <Timer size={18} />, desc: 'Visual builder', component: CronTool, layout: 'compact',
                help: 'Visual cron expression builder. Edit individual fields (minute, hour, day, month, weekday) or pick from common templates. Shows the next 5 scheduled run times.'
            },
            {
                id: 'password', label: 'Password', icon: <Lock size={18} />, desc: 'Secure generator', component: PasswordTool, layout: 'compact',
                help: 'Generates cryptographically-secure random passwords via the Web Crypto API. Configurable length, character sets, and ambiguous-character exclusion.'
            },
            {
                id: 'uuid', label: 'UUID', icon: <Box size={18} />, desc: 'v4 generator', component: UUIDTool, layout: 'compact',
                help: 'Generates RFC 4122 UUID v4 identifiers using the browser\'s built-in crypto.randomUUID(). Supports bulk generation and UUID validation.'
            },
        ]
    },
    {
        group: 'Text',
        color: 'var(--cat-text)',
        items: [
            {
                id: 'text', label: 'Text Utils', icon: <Type size={18} />, desc: 'Transform & analyze', component: TextTool, layout: 'full',
                help: 'Analyses text (word count, character count, sentences, paragraphs) and transforms it (uppercase, lowercase, title case, camelCase, snake_case, kebab-case, reverse, trim lines).'
            },
            {
                id: 'diff', label: 'Diff', icon: <FileDiff size={18} />, desc: 'Side-by-side compare', component: DiffTool, layout: 'full',
                help: 'Performs a line-level diff between two text inputs using LCS, highlighting added and removed lines in a side-by-side view.'
            },
            {
                id: 'regex', label: 'Regex', icon: <Regex size={18} />, desc: 'Test & explain', component: RegexTool, layout: 'full',
                help: 'Tests regular expressions against sample text with live match highlighting. Supports g, i, m, s flags. Shows match groups and a plain-English explanation of common constructs.'
            },
        ]
    },
    {
        group: 'DevOps',
        color: 'var(--cat-devops)',
        items: [
            {
                id: 'git', label: 'Git Helper', icon: <GitPullRequest size={18} />, desc: 'Command builder', component: GitTool, layout: 'full',
                help: 'Builds common Git commands like undoing commits, squashing history, branch management, and cleanup. Reduces the need to memorize complex flag combinations.'
            },
        ]
    },
];

export const ALL_TOOLS = TOOLS.flatMap(g => g.items.map(i => ({ ...i, color: g.color })));
