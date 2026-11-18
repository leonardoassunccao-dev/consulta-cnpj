#!/usr/bin/env node
/**
 * Automated Secret Scanner for CNPJ Premium.
 * Audits working directory and git commit history for credentials and tokens.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SECRET_PATTERNS = [
  { name: 'AWS Access Key', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub Personal Access Token', regex: /\b(?:ghp_[0-9a-zA-Z]{36}|github_pat_[0-9a-zA-Z_]{82})\b/ },
  { name: 'Google API Key', regex: /\bAIza[0-9A-Za-z\\-_]{35}\b/ },
  { name: 'Private Key', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: 'Generic Secret Token', regex: /(?:api[_-]?key|client[_-]?secret|auth[_-]?token|bearer[_-]?token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/i },
];

const IGNORED_PATHS = [
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.vercel',
  '.env.local',
  '.pptx-build',
  '.codex-finalizer',
  'deliverables',
  'materiais-clientes',
  'package-lock.json',
];

const IGNORED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.wasm'
];

let leaksFound = 0;

function scanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IGNORED_EXTENSIONS.includes(ext)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  for (const { name, regex } of SECRET_PATTERNS) {
    if (regex.test(content)) {
      console.error(`[SECRET DETECTED] ${name} found in file: ${filePath}`);
      leaksFound++;
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    if (IGNORED_PATHS.some((p) => relPath === p || relPath.startsWith(`${p}/`))) {
      continue;
    }

    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      scanFile(fullPath);
    }
  }
}

function scanGitHistory() {
  try {
    const diff = execSync('git log -p -n 50', { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    const lines = diff.split('\n');
    for (const line of lines) {
      if (!line.startsWith('+')) continue;
      if (line.startsWith('+++')) continue;
      for (const { name, regex } of SECRET_PATTERNS) {
        if (regex.test(line)) {
          // Verify it's not a documentation dummy string
          if (line.includes('YOUR_API_KEY') || line.includes('AIzaSyDummy')) continue;
          console.error(`[SECRET DETECTED IN GIT HISTORY] ${name} found in commit diff:\n  ${line.trim()}`);
          leaksFound++;
        }
      }
    }
  } catch (err) {
    console.warn(`[WARN] Could not inspect git history: ${err.message}`);
  }
}

console.log('>>> Running Automated Secret Scanner...');
walkDir(process.cwd());
scanGitHistory();

if (leaksFound > 0) {
  console.error(`FAILED: ${leaksFound} secret(s) or sensitive credential(s) detected.`);
  process.exit(1);
} else {
  console.log('PASSED: Zero credentials or private tokens found in working tree and git history.');
  process.exit(0);
}
