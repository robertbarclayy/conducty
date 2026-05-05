#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_REPOS = [
  { name: "flutterzon_bloc", url: "https://github.com/tejasbadone/flutterzon_bloc.git" },
  { name: "express", url: "https://github.com/expressjs/express.git" },
  { name: "flask", url: "https://github.com/pallets/flask.git" },
  { name: "fastapi", url: "https://github.com/fastapi/fastapi.git" },
  { name: "chi", url: "https://github.com/go-chi/chi.git" },
  { name: "redux", url: "https://github.com/reduxjs/redux.git" },
  { name: "preact", url: "https://github.com/preactjs/preact.git" },
  { name: "rustlings", url: "https://github.com/rust-lang/rustlings.git" }
];

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".cfg", ".css", ".dart", ".go", ".gradle", ".graphql", ".html",
  ".ini", ".java", ".js", ".json", ".jsx", ".kt", ".md", ".mjs", ".py",
  ".rs", ".rst", ".scss", ".sh", ".svelte", ".swift", ".toml", ".ts",
  ".tsx", ".txt", ".vue", ".xml", ".yaml", ".yml"
]);

const CODE_EXTENSIONS = new Set([
  ".cjs", ".dart", ".go", ".java", ".js", ".jsx", ".kt", ".mjs", ".py",
  ".rs", ".svelte", ".swift", ".ts", ".tsx", ".vue"
]);

const EXCLUDED_SEGMENTS = new Set([
  ".dart_tool", ".git", ".gradle", ".mypy_cache", ".next", ".nuxt", ".pytest_cache",
  ".ruff_cache", ".svelte-kit", ".tox", ".venv", "__pycache__", "build",
  "coverage", "dist", "env", "node_modules", "Pods", "target", "vendor", "venv"
]);

const EXCLUDED_BASENAMES = new Set([
  "Cargo.lock", "package-lock.json", "pnpm-lock.yaml", "poetry.lock", "yarn.lock"
]);

const SUPPORT_FILES = [
  "README.md", "package.json", "pyproject.toml", "Cargo.toml", "go.mod",
  "pubspec.yaml", "tsconfig.json", "vite.config.ts", "requirements.txt",
  "setup.cfg", "setup.py"
];

const MAX_FILE_BYTES = 512 * 1024;
const MAX_COMMITS_TO_SEARCH = 80;
const MIN_CHANGED_FILES = 2;
const MAX_CHANGED_FILES = 24;
const CLONE_ATTEMPTS = 3;
const WORKFLOW_PHASES = 4;
const BASELINE_PHASE_PROMPT_TOKENS = 650;
const CONDUCTY_WORKFLOW_OVERHEAD_TOKENS = 3200;

function main() {
  const options = parseArgs(process.argv.slice(2));
  const tempRoot = options.keep
    ? path.resolve(options.workdir || "conducty-real-world-benchmark-work")
    : fs.mkdtempSync(path.join(os.tmpdir(), "conducty-real-world-benchmark-"));
  fs.mkdirSync(tempRoot, { recursive: true });

  const rows = [];
  try {
    for (const repo of DEFAULT_REPOS) {
      rows.push(measureRepo(repo, tempRoot));
    }
    const report = renderReport(rows);
    if (options.output) {
      const outputPath = path.resolve(options.output);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, report, "utf8");
    }
    process.stdout.write(report);
  } finally {
    if (!options.keep) fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function parseArgs(args) {
  const options = { keep: false, output: "", workdir: "" };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--keep") options.keep = true;
    else if (arg === "--output") options.output = requireValue(args, ++index, "--output");
    else if (arg === "--workdir") options.workdir = requireValue(args, ++index, "--workdir");
    else if (arg === "--help") {
      console.log([
        "Usage: node scripts/real-world-token-savings-benchmark.mjs [--output <file>] [--keep] [--workdir <dir>]",
        "",
        "Clones a fixed set of public repos, selects a recent focused non-merge commit from each,",
        "and compares whole-repo readable context against changed files plus root manifests."
      ].join("\n"));
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function requireValue(args, index, flag) {
  if (!args[index]) throw new Error(`${flag} requires a value.`);
  return args[index];
}

function measureRepo(repo, tempRoot) {
  const repoDir = path.join(tempRoot, repo.name);
  cloneRepo(repo, repoDir, tempRoot);
  const selected = selectCommit(repoDir);
  run("git", ["checkout", "--detach", selected.commit], repoDir);

  const allFiles = listReadableFiles(repoDir);
  const focusedFiles = focusedContextFiles(repoDir, selected.changedFiles);
  const baseline = measureApproxTokens(allFiles);
  const focused = measureApproxTokens(focusedFiles);
  const diff = measureApproxText(run("git", ["show", "--format=", "--unified=3", selected.commit], repoDir).stdout);
  const savedTokens = baseline.tokens - focused.tokens;
  const savedPercent = baseline.tokens > 0 ? (savedTokens / baseline.tokens) * 100 : 0;
  const workflowBaselineTokens = (baseline.tokens * WORKFLOW_PHASES) + (BASELINE_PHASE_PROMPT_TOKENS * WORKFLOW_PHASES);
  const workflowConductyTokens = (focused.tokens * 3) + diff.tokens + CONDUCTY_WORKFLOW_OVERHEAD_TOKENS;
  const workflowSavedTokens = workflowBaselineTokens - workflowConductyTokens;
  const workflowSavedPercent = workflowBaselineTokens > 0
    ? (workflowSavedTokens / workflowBaselineTokens) * 100
    : 0;

  if (focused.files === 0) throw new Error(`${repo.name}: focused context is empty`);
  if (savedTokens <= 0) throw new Error(`${repo.name}: focused context did not save tokens`);
  if (workflowSavedTokens <= 0) throw new Error(`${repo.name}: workflow model did not save tokens`);

  return {
    ...repo,
    commit: selected.commit,
    subject: selected.subject,
    changedFiles: selected.changedFiles,
    baseline,
    focused,
    diff,
    savedTokens,
    savedPercent,
    workflow: {
      baselineTokens: workflowBaselineTokens,
      conductyTokens: workflowConductyTokens,
      savedTokens: workflowSavedTokens,
      savedPercent: workflowSavedPercent
    }
  };
}

function cloneRepo(repo, repoDir, tempRoot) {
  let lastError;
  for (let attempt = 1; attempt <= CLONE_ATTEMPTS; attempt += 1) {
    fs.rmSync(repoDir, { recursive: true, force: true });
    const result = spawnSync("git", [
      "clone",
      "--depth",
      String(MAX_COMMITS_TO_SEARCH),
      "--no-tags",
      repo.url,
      repoDir
    ], {
      cwd: tempRoot,
      encoding: "utf8",
      shell: false,
      maxBuffer: 32 * 1024 * 1024
    });
    if (result.status === 0) return;
    lastError = [
      `git clone ${repo.url} failed on attempt ${attempt}/${CLONE_ATTEMPTS}`,
      result.stdout.trim(),
      result.stderr.trim()
    ].filter(Boolean).join("\n");
    if (attempt < CLONE_ATTEMPTS) sleepMs(1000 * attempt);
  }
  throw new Error(lastError || `git clone ${repo.url} failed`);
}

function sleepMs(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function selectCommit(repoDir) {
  const log = run("git", [
    "log",
    "--no-merges",
    `--max-count=${MAX_COMMITS_TO_SEARCH}`,
    "--format=%H%x09%s"
  ], repoDir).stdout.trim();
  if (!log) throw new Error(`No commits found in ${repoDir}`);

  for (const line of log.split(/\r?\n/)) {
    const [commit, ...subjectParts] = line.split("\t");
    const subject = subjectParts.join("\t");
    const changedFiles = changedFilesForCommit(repoDir, commit);
    const codeFileCount = changedFiles.filter((file) => CODE_EXTENSIONS.has(path.extname(file).toLowerCase())).length;
    if (
      changedFiles.length >= MIN_CHANGED_FILES &&
      changedFiles.length <= MAX_CHANGED_FILES &&
      codeFileCount > 0
    ) {
      return { commit, subject, changedFiles };
    }
  }

  throw new Error(`No suitable focused commit found in ${repoDir}`);
}

function changedFilesForCommit(repoDir, commit) {
  const output = run("git", [
    "show",
    "--format=",
    "--name-only",
    "--diff-filter=ACMRT",
    commit
  ], repoDir).stdout;
  return output
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean)
    .filter(isReadableRelativePath)
    .sort((a, b) => a.localeCompare(b));
}

function focusedContextFiles(repoDir, changedFiles) {
  const candidates = new Set([...changedFiles, ...SUPPORT_FILES]);
  const files = [];
  for (const relativePath of candidates) {
    if (!isReadableRelativePath(relativePath)) continue;
    const fullPath = path.join(repoDir, relativePath);
    if (!isInside(repoDir, fullPath)) continue;
    if (!fs.existsSync(fullPath)) continue;
    const stats = fs.statSync(fullPath);
    if (!stats.isFile() || stats.size > MAX_FILE_BYTES) continue;
    files.push(fullPath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function listReadableFiles(root) {
  const files = [];

  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(root, fullPath).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        if (shouldSkipRelativePath(relativePath)) continue;
        visit(fullPath);
      } else if (entry.isFile() && isReadableRelativePath(relativePath)) {
        const stats = fs.statSync(fullPath);
        if (stats.size <= MAX_FILE_BYTES) files.push(fullPath);
      }
    }
  }

  visit(root);
  return files.sort((a, b) => a.localeCompare(b));
}

function isReadableRelativePath(relativePath) {
  const normalized = String(relativePath || "").replace(/\\/g, "/");
  if (!normalized || normalized.startsWith("../") || path.isAbsolute(normalized)) return false;
  if (shouldSkipRelativePath(normalized)) return false;
  const basename = path.basename(normalized);
  if (EXCLUDED_BASENAMES.has(basename)) return false;
  if (/\.min\.(js|css)$/i.test(basename)) return false;
  return TEXT_EXTENSIONS.has(path.extname(basename).toLowerCase());
}

function shouldSkipRelativePath(relativePath) {
  return relativePath
    .split("/")
    .filter(Boolean)
    .some((segment) => EXCLUDED_SEGMENTS.has(segment));
}

function isInside(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function measureApproxTokens(files) {
  let chars = 0;
  for (const file of files) {
    chars += fs.readFileSync(file, "utf8").length;
  }
  return measureApproxChars(chars, files.length);
}

function measureApproxText(text) {
  return measureApproxChars(String(text || "").length, 1);
}

function measureApproxChars(chars, files) {
  return {
    files,
    chars,
    tokens: Math.ceil(chars / 4)
  };
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
    maxBuffer: 32 * 1024 * 1024
  });
  if (result.status !== 0) {
    throw new Error([
      `${command} ${args.join(" ")} failed with exit ${result.status}`,
      result.stdout.trim(),
      result.stderr.trim()
    ].filter(Boolean).join("\n"));
  }
  return result;
}

function renderReport(rows) {
  const totals = rows.reduce((acc, row) => {
    acc.baselineTokens += row.baseline.tokens;
    acc.focusedTokens += row.focused.tokens;
    acc.savedTokens += row.savedTokens;
    acc.baselineFiles += row.baseline.files;
    acc.focusedFiles += row.focused.files;
    acc.workflowBaselineTokens += row.workflow.baselineTokens;
    acc.workflowConductyTokens += row.workflow.conductyTokens;
    acc.workflowSavedTokens += row.workflow.savedTokens;
    return acc;
  }, {
    baselineTokens: 0,
    focusedTokens: 0,
    savedTokens: 0,
    baselineFiles: 0,
    focusedFiles: 0,
    workflowBaselineTokens: 0,
    workflowConductyTokens: 0,
    workflowSavedTokens: 0
  });
  const aggregateSavings = totals.baselineTokens > 0
    ? (totals.savedTokens / totals.baselineTokens) * 100
    : 0;
  const medianSavings = median(rows.map((row) => row.savedPercent));
  const workflowAggregateSavings = totals.workflowBaselineTokens > 0
    ? (totals.workflowSavedTokens / totals.workflowBaselineTokens) * 100
    : 0;
  const workflowMedianSavings = median(rows.map((row) => row.workflow.savedPercent));

  return [
    "# Real-World Token Savings Benchmark",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This optional benchmark clones public repositories, selects one recent non-merge commit with a focused code change from each repo, and compares:",
    "",
    "- **Baseline context:** every readable project text file in that checkout, excluding dependency, build, generated, binary/media, and lockfile surfaces.",
    "- **Conducty focused context:** the changed readable files for the selected commit plus root manifests such as `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pubspec.yaml`, and `README.md` when present.",
    "- **Workflow model:** a four-phase plan/execute/verify/review estimate. The naive baseline reloads whole-repo readable context in each phase; the Conducty path uses focused context for plan/execute/verify plus commit diff evidence for review, and is charged extra fixed overhead for plan, checkpoint, and verification notes.",
    "- **Token estimate:** `ceil(total UTF-8 characters / 4)` for a deterministic offline approximation.",
    "",
    "This measures context-loading and workflow-context reduction for realistic focused tasks. It does not claim exact provider billing, universal savings for every task, or that an agent never needs more context during debugging.",
    "",
    "## Summary",
    "",
    `- Repositories measured: ${rows.length}`,
    `- Baseline readable files: ${formatInteger(totals.baselineFiles)}`,
    `- Focused context files: ${formatInteger(totals.focusedFiles)}`,
    `- Baseline tokens: ${formatInteger(totals.baselineTokens)}`,
    `- Focused tokens: ${formatInteger(totals.focusedTokens)}`,
    `- Tokens saved: ${formatInteger(totals.savedTokens)}`,
    `- Aggregate savings: ${aggregateSavings.toFixed(1)}%`,
    `- Median per-repo savings: ${medianSavings.toFixed(1)}%`,
    `- Workflow baseline tokens: ${formatInteger(totals.workflowBaselineTokens)}`,
    `- Workflow Conducty tokens: ${formatInteger(totals.workflowConductyTokens)}`,
    `- Workflow tokens saved: ${formatInteger(totals.workflowSavedTokens)}`,
    `- Workflow aggregate savings: ${workflowAggregateSavings.toFixed(1)}%`,
    `- Workflow median per-repo savings: ${workflowMedianSavings.toFixed(1)}%`,
    "",
    "## Context Results",
    "",
    "| Repo | Commit | Focused change | Baseline files | Focused files | Baseline tokens | Focused tokens | Saved tokens | Saved % |",
    "|---|---|---|---:|---:|---:|---:|---:|---:|",
    ...rows.map((row) => [
      row.name,
      row.commit.slice(0, 12),
      markdownCell(row.subject),
      row.baseline.files,
      row.focused.files,
      row.baseline.tokens,
      row.focused.tokens,
      row.savedTokens,
      `${row.savedPercent.toFixed(1)}%`
    ]).map((cells) => `| ${cells.join(" | ")} |`),
    "",
    "## Workflow Results",
    "",
    `Formula: baseline = ${WORKFLOW_PHASES} * whole-repo tokens + ${BASELINE_PHASE_PROMPT_TOKENS} prompt tokens per phase. Conducty = 3 * focused tokens + commit diff tokens + ${CONDUCTY_WORKFLOW_OVERHEAD_TOKENS} plan/checkpoint/verification overhead tokens.`,
    "",
    "| Repo | Baseline workflow tokens | Conducty workflow tokens | Diff evidence tokens | Saved tokens | Saved % |",
    "|---|---:|---:|---:|---:|---:|",
    ...rows.map((row) => [
      row.name,
      row.workflow.baselineTokens,
      row.workflow.conductyTokens,
      row.diff.tokens,
      row.workflow.savedTokens,
      `${row.workflow.savedPercent.toFixed(1)}%`
    ]).map((cells) => `| ${cells.join(" | ")} |`),
    "",
    "## Selected Focus Files",
    "",
    ...rows.flatMap((row) => [
      `### ${row.name}`,
      "",
      `- URL: ${row.url}`,
      `- Commit: \`${row.commit}\``,
      `- Subject: ${asciiText(row.subject)}`,
      `- Changed readable files selected: ${row.changedFiles.length}`,
      "",
      ...row.changedFiles.map((file) => `- \`${file}\``),
      ""
    ])
  ].join("\n");
}

function markdownCell(value) {
  return asciiText(value)
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function asciiText(value) {
  return String(value || "")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatInteger(value) {
  return Math.round(value).toLocaleString("en-US");
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
}
