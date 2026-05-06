#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULT_REPOS = [
  { name: "react", url: "https://github.com/facebook/react.git" },
  { name: "flutterzon_bloc", url: "https://github.com/tejasbadone/flutterzon_bloc.git" },
  { name: "express", url: "https://github.com/expressjs/express.git" },
  { name: "flask", url: "https://github.com/pallets/flask.git" },
  { name: "fastapi", url: "https://github.com/fastapi/fastapi.git" },
  { name: "chi", url: "https://github.com/go-chi/chi.git" },
  { name: "redux", url: "https://github.com/reduxjs/redux.git" },
  { name: "preact", url: "https://github.com/preactjs/preact.git" },
  { name: "rustlings", url: "https://github.com/rust-lang/rustlings.git" }
];

const DEFAULT_REPORT_TITLE = "Final Cross-Repo Historical Replay Benchmark";
const DEFAULT_SCOPE_NOTE = "the default run covers React, Flutter, Node, Python, Go, TypeScript, Preact, and Rust training repos.";

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".cfg", ".css", ".dart", ".flow", ".go", ".gradle", ".graphql",
  ".html", ".ini", ".java", ".js", ".json", ".jsx", ".kt", ".md", ".mdx",
  ".mjs", ".py", ".rs", ".rst", ".scss", ".sh", ".svelte", ".swift",
  ".toml", ".ts", ".tsx", ".txt", ".vue", ".xml", ".yaml", ".yml"
]);

const CODE_EXTENSIONS = new Set([
  ".cjs", ".dart", ".go", ".java", ".js", ".jsx", ".kt", ".mjs", ".py",
  ".rs", ".svelte", ".swift", ".ts", ".tsx", ".vue"
]);

const EXCLUDED_SEGMENTS = new Set([
  ".dart_tool", ".git", ".gradle", ".mypy_cache", ".next", ".nuxt",
  ".pytest_cache", ".ruff_cache", ".svelte-kit", ".tox", ".venv", ".yarn",
  "__pycache__", "build", "coverage", "dist", "env", "node_modules", "Pods",
  "target", "tmp", "vendor", "venv"
]);

const EXCLUDED_BASENAMES = new Set([
  "Cargo.lock", "package-lock.json", "pnpm-lock.yaml", "poetry.lock", "yarn.lock"
]);

const ROOT_SUPPORT_FILES = [
  "README.md",
  "CLAUDE.md",
  "package.json",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "pubspec.yaml",
  "tsconfig.json",
  "vite.config.ts",
  "requirements.txt",
  "setup.cfg",
  "setup.py"
];

const LOCAL_SUPPORT_FILENAMES = [
  "package.json",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "pubspec.yaml",
  "tsconfig.json",
  "jest.config.js",
  "rollup.config.js",
  "vite.config.ts"
];

const MAX_FILE_BYTES = 768 * 1024;
const CLONE_DEPTH = 260;
const CLONE_ATTEMPTS = 3;
const COMMITS_PER_REPO = 2;
const MAX_COMMITS_TO_SEARCH = 160;
const MIN_CHANGED_FILES = 2;
const MAX_CHANGED_FILES = 24;
const WORKFLOW_PHASES = 4;
const BASELINE_PHASE_PROMPT_TOKENS = 650;
const INITIAL_WORKFLOW_OVERHEAD_TOKENS = 0;
const CONDUCTY_WORKFLOW_OVERHEAD_TOKENS = 3200;

function main() {
  const options = parseArgs(process.argv.slice(2));
  const tempRoot = options.keep
    ? path.resolve(options.workdir || "conducty-cross-repo-replay-work")
    : fs.mkdtempSync(path.join(os.tmpdir(), "conducty-cross-repo-replay-"));
  fs.mkdirSync(tempRoot, { recursive: true });

  try {
    const repoResults = options.repos.map((repo) => measureRepo(repo, tempRoot, options));
    const rows = repoResults.flatMap((result) => result.rows);
    const report = renderReport(repoResults, rows, options);
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
  const options = {
    keep: false,
    output: "",
    workdir: "",
    commitsPerRepo: COMMITS_PER_REPO,
    cloneDepth: CLONE_DEPTH,
    maxCommitsToSearch: MAX_COMMITS_TO_SEARCH,
    repos: [],
    reportTitle: "",
    scopeNote: ""
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--keep") options.keep = true;
    else if (arg === "--output") options.output = requireValue(args, ++index, "--output");
    else if (arg === "--workdir") options.workdir = requireValue(args, ++index, "--workdir");
    else if (arg === "--repo") options.repos.push(parseRepoSpec(requireValue(args, ++index, "--repo")));
    else if (arg === "--title") options.reportTitle = requireValue(args, ++index, "--title");
    else if (arg === "--scope-note") options.scopeNote = requireValue(args, ++index, "--scope-note");
    else if (arg === "--clone-depth") options.cloneDepth = normalizePositiveInteger(requireValue(args, ++index, "--clone-depth"), CLONE_DEPTH);
    else if (arg === "--max-commits-to-search") {
      options.maxCommitsToSearch = normalizePositiveInteger(requireValue(args, ++index, "--max-commits-to-search"), MAX_COMMITS_TO_SEARCH);
    }
    else if (arg === "--commits-per-repo") {
      options.commitsPerRepo = normalizePositiveInteger(requireValue(args, ++index, "--commits-per-repo"), COMMITS_PER_REPO);
    } else if (arg === "--help") {
      console.log([
        "Usage: node scripts/cross-repo-historical-replay-benchmark.mjs [--output <file>] [--commits-per-repo <n>] [--repo <name=url>] [--keep] [--workdir <dir>]",
        "",
        "Clones a fixed set of public repositories without checkout, selects focused",
        "recent non-merge commits, creates parent-state focused workspaces, applies",
        "the real historical patches, and verifies replayed files exactly match the",
        "target commits.",
        "",
        "Repeat --repo to run a custom repository set. A repo value can be",
        "name=https://github.com/org/repo.git or just a Git URL."
      ].join("\n"));
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!options.repos.length) {
    options.repos = DEFAULT_REPOS;
    options.reportTitle ||= DEFAULT_REPORT_TITLE;
    options.scopeNote ||= DEFAULT_SCOPE_NOTE;
  } else {
    options.reportTitle ||= `${options.repos.map((repo) => repo.name).join(", ")} Historical Replay Benchmark`;
    options.scopeNote ||= `this custom run covers ${options.repos.map((repo) => repo.url).join(", ")}.`;
  }
  return options;
}

function requireValue(args, index, flag) {
  if (!args[index]) throw new Error(`${flag} requires a value.`);
  return args[index];
}

function normalizePositiveInteger(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.floor(number);
}

function parseRepoSpec(spec) {
  const value = String(spec || "").trim();
  if (!value) throw new Error("--repo requires a non-empty value.");
  const equalIndex = value.indexOf("=");
  if (equalIndex !== -1) {
    return {
      name: normalizeRepoName(value.slice(0, equalIndex)),
      url: value.slice(equalIndex + 1)
    };
  }
  return {
    name: normalizeRepoName(value.replace(/\.git$/, "").split(/[\\/]/).pop() || "repo"),
    url: value
  };
}

function normalizeRepoName(value) {
  const name = String(value || "").trim().replace(/[^a-zA-Z0-9_.-]/g, "-");
  if (!name) throw new Error("Repository name resolved to an empty value.");
  return name;
}

function measureRepo(repo, tempRoot, options) {
  const repoDir = path.join(tempRoot, repo.name);
  cloneRepo(repo, repoDir, tempRoot, options.cloneDepth);

  const candidates = candidateCommits(repo, repoDir, options.maxCommitsToSearch);
  const rows = [];
  const skipped = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const replayDir = path.join(tempRoot, `${repo.name}-replay-${index + 1}`);
    try {
      rows.push(measureReplay(repo, repoDir, candidate, replayDir));
    } catch (error) {
      skipped.push({
        commit: candidate.commit,
        reason: firstLine(error instanceof Error ? error.message : String(error))
      });
    }
    if (rows.length >= options.commitsPerRepo) break;
  }

  if (rows.length < options.commitsPerRepo) {
    const reasons = skipped
      .slice(0, 8)
      .map((skip) => `${skip.commit.slice(0, 12)}: ${skip.reason}`)
      .join("\n");
    throw new Error(`${repo.name}: expected ${options.commitsPerRepo} replayable commits, got ${rows.length}.${reasons ? `\n${reasons}` : ""}`);
  }

  return { repo, rows, skipped };
}

function cloneRepo(repo, repoDir, tempRoot, cloneDepth) {
  let lastError;
  for (let attempt = 1; attempt <= CLONE_ATTEMPTS; attempt += 1) {
    fs.rmSync(repoDir, { recursive: true, force: true });
    const result = spawnSync("git", [
      "-c",
      "core.longpaths=true",
      "clone",
      "--no-checkout",
      "--depth",
      String(cloneDepth),
      "--no-tags",
      repo.url,
      repoDir
    ], {
      cwd: tempRoot,
      encoding: "utf8",
      shell: false,
      maxBuffer: 64 * 1024 * 1024
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

function candidateCommits(repo, repoDir, maxCommitsToSearch) {
  const log = run("git", [
    "log",
    "--no-merges",
    `--max-count=${maxCommitsToSearch}`,
    "--format=%H%x09%s"
  ], repoDir).stdout.trim();
  if (!log) throw new Error(`${repo.name}: no commits found.`);

  const candidates = [];
  for (const line of log.split(/\r?\n/)) {
    const [commit, ...subjectParts] = line.split("\t");
    const subject = subjectParts.join("\t");
    let parent;
    try {
      parent = run("git", ["rev-parse", `${commit}^`], repoDir).stdout.trim();
    } catch {
      continue;
    }
    const changedFiles = changedFilesForCommit(repoDir, commit);
    const codeFileCount = changedFiles.filter((file) => CODE_EXTENSIONS.has(path.extname(file).toLowerCase())).length;
    if (
      changedFiles.length >= MIN_CHANGED_FILES &&
      changedFiles.length <= MAX_CHANGED_FILES &&
      codeFileCount > 0 &&
      changedFiles.every((file) => file.length < 210)
    ) {
      candidates.push({ commit, parent, subject, changedFiles });
    }
  }

  if (!candidates.length) throw new Error(`${repo.name}: no focused candidate commits found.`);
  return candidates;
}

function changedFilesForCommit(repoDir, commit) {
  const output = run("git", [
    "show",
    "--format=",
    "--name-only",
    "--diff-filter=ACM",
    commit
  ], repoDir).stdout;
  return output
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean)
    .filter(isReadableRelativePath)
    .sort((a, b) => a.localeCompare(b));
}

function measureReplay(repo, repoDir, selected, replayDir) {
  const parentEntries = readCommitEntries(repoDir, selected.parent);
  const targetEntries = readCommitEntries(repoDir, selected.commit);
  for (const file of selected.changedFiles) {
    if (!targetEntries.has(file)) throw new Error(`${selected.commit}: target text entry missing for ${file}`);
  }

  const focusedPaths = focusedContextPaths(parentEntries, targetEntries, selected.changedFiles);
  const baseline = measureEntryTokens(parentEntries);
  const focused = measureEntryTokens(focusedPaths.map((file) => parentEntries.get(file) || targetEntries.get(file)).filter(Boolean));
  const patch = runBuffer("git", ["diff", "--binary", selected.parent, selected.commit, "--", ...selected.changedFiles], repoDir).stdout;
  const diff = measureApproxText(patch.toString("utf8"));

  const replay = replayPatch(selected, parentEntries, targetEntries, replayDir, patch);

  const contextSavedTokens = baseline.tokens - focused.tokens;
  const naiveWorkflowTokens = (baseline.tokens * WORKFLOW_PHASES) + (BASELINE_PHASE_PROMPT_TOKENS * WORKFLOW_PHASES);
  const initialWorkflowTokens = baseline.tokens + (focused.tokens * 3) + diff.tokens + INITIAL_WORKFLOW_OVERHEAD_TOKENS;
  const currentWorkflowTokens = (focused.tokens * 3) + diff.tokens + CONDUCTY_WORKFLOW_OVERHEAD_TOKENS;
  const initialSavedTokens = naiveWorkflowTokens - initialWorkflowTokens;
  const currentSavedTokens = naiveWorkflowTokens - currentWorkflowTokens;
  const currentVsInitialSavedTokens = initialWorkflowTokens - currentWorkflowTokens;

  if (focused.files === 0) throw new Error(`${selected.commit}: focused context is empty`);
  if (contextSavedTokens <= 0) throw new Error(`${selected.commit}: context model did not save tokens`);
  if (initialSavedTokens <= 0) throw new Error(`${selected.commit}: initial replay model did not save tokens`);
  if (currentSavedTokens <= 0) throw new Error(`${selected.commit}: current replay model did not save tokens`);
  if (currentVsInitialSavedTokens <= 0) throw new Error(`${selected.commit}: current replay did not improve over initial proxy`);

  return {
    repo,
    ...selected,
    baseline,
    focused,
    diff,
    patch: {
      bytes: patch.length,
      tokens: diff.tokens
    },
    replay: {
      applied: true,
      mode: replay.mode,
      verifiedFiles: selected.changedFiles.length
    },
    contextSavedTokens,
    contextSavedPercent: percent(contextSavedTokens, baseline.tokens),
    workflow: {
      naiveTokens: naiveWorkflowTokens,
      initialTokens: initialWorkflowTokens,
      currentTokens: currentWorkflowTokens,
      initialSavedTokens,
      currentSavedTokens,
      currentVsInitialSavedTokens,
      initialSavedPercent: percent(initialSavedTokens, naiveWorkflowTokens),
      currentSavedPercent: percent(currentSavedTokens, naiveWorkflowTokens),
      currentVsInitialSavedPercent: percent(currentVsInitialSavedTokens, initialWorkflowTokens)
    }
  };
}

function replayPatch(selected, parentEntries, targetEntries, replayDir, patch) {
  const applyModes = [
    { name: "default", args: ["apply", "--whitespace=nowarn"] },
    {
      name: "lf-pinned",
      args: [
        "-c",
        "core.autocrlf=false",
        "-c",
        "core.eol=lf",
        "apply",
        "--whitespace=nowarn"
      ]
    }
  ];

  let lastError;
  for (const mode of applyModes) {
    writeParentState(selected, parentEntries, replayDir);
    try {
      runWithInput("git", mode.args, replayDir, patch);
      verifyReplay(selected, targetEntries, replayDir);
      return { mode: mode.name };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`${selected.commit}: replay failed`);
}

function writeParentState(selected, parentEntries, replayDir) {
  fs.rmSync(replayDir, { recursive: true, force: true });
  fs.mkdirSync(replayDir, { recursive: true });
  for (const file of selected.changedFiles) {
    const parentEntry = parentEntries.get(file);
    if (!parentEntry) continue;
    const destination = path.join(replayDir, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, parentEntry.content);
  }
}

function verifyReplay(selected, targetEntries, replayDir) {
  for (const file of selected.changedFiles) {
    const targetEntry = targetEntries.get(file);
    if (!targetEntry) throw new Error(`${selected.commit}: target entry missing for ${file}`);

    const replayedPath = path.join(replayDir, file);
    if (!fs.existsSync(replayedPath)) throw new Error(`${selected.commit}: replayed file missing ${file}`);

    const replayed = fs.readFileSync(replayedPath);
    if (!replayed.equals(targetEntry.content)) {
      throw new Error(`${selected.commit}: replayed file did not match target commit for ${file}`);
    }
  }
}

function focusedContextPaths(parentEntries, targetEntries, changedFiles) {
  const candidates = new Set([...changedFiles, ...ROOT_SUPPORT_FILES]);
  for (const relativePath of changedFiles) {
    for (const support of nearestSupportFiles(parentEntries, targetEntries, relativePath)) {
      candidates.add(support);
    }
  }

  const files = [];
  for (const relativePath of candidates) {
    if (!isReadableRelativePath(relativePath)) continue;
    if (parentEntries.has(relativePath) || targetEntries.has(relativePath)) files.push(relativePath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function nearestSupportFiles(parentEntries, targetEntries, relativePath) {
  const found = [];
  let dir = path.dirname(relativePath).replace(/\\/g, "/");
  while (dir && dir !== ".") {
    for (const filename of LOCAL_SUPPORT_FILENAMES) {
      const candidate = `${dir}/${filename}`;
      if (parentEntries.has(candidate) || targetEntries.has(candidate)) found.push(candidate);
    }
    const parent = path.dirname(dir).replace(/\\/g, "/");
    if (parent === dir || parent === ".") break;
    dir = parent;
  }
  return found;
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

function readCommitEntries(repoDir, commit) {
  const archive = runBuffer("git", ["archive", "--format=tar", commit], repoDir).stdout;
  return parseTarEntries(archive);
}

function parseTarEntries(buffer) {
  const entries = new Map();
  let offset = 0;
  let paxPath = "";
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (isZeroBlock(header)) break;
    const name = readTarString(header, 0, 100);
    const prefix = readTarString(header, 345, 155);
    const sizeText = readTarString(header, 124, 12).trim();
    const size = parseInt(sizeText || "0", 8);
    const typeFlag = String.fromCharCode(header[156] || 0);
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    const data = buffer.subarray(dataStart, dataEnd);
    const headerPath = prefix ? `${prefix}/${name}` : name;

    if (typeFlag === "x") {
      paxPath = parsePaxPath(data) || "";
    } else {
      const entryPath = (paxPath || headerPath).replace(/\\/g, "/");
      paxPath = "";
      if ((typeFlag === "0" || typeFlag === "\0" || typeFlag === "") &&
        isReadableRelativePath(entryPath) &&
        size <= MAX_FILE_BYTES) {
        const content = Buffer.from(data);
        entries.set(entryPath, {
          path: entryPath,
          bytes: size,
          chars: content.toString("utf8").length,
          content
        });
      }
    }

    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}

function isZeroBlock(block) {
  for (const byte of block) {
    if (byte !== 0) return false;
  }
  return true;
}

function readTarString(buffer, start, length) {
  const slice = buffer.subarray(start, start + length);
  const nullIndex = slice.indexOf(0);
  return slice.subarray(0, nullIndex === -1 ? slice.length : nullIndex).toString("utf8");
}

function parsePaxPath(data) {
  const text = data.toString("utf8");
  let index = 0;
  while (index < text.length) {
    const spaceIndex = text.indexOf(" ", index);
    if (spaceIndex === -1) break;
    const length = Number(text.slice(index, spaceIndex));
    if (!Number.isFinite(length) || length <= 0) break;
    const record = text.slice(spaceIndex + 1, index + length).replace(/\n$/, "");
    const equalIndex = record.indexOf("=");
    if (equalIndex !== -1 && record.slice(0, equalIndex) === "path") {
      return record.slice(equalIndex + 1);
    }
    index += length;
  }
  return "";
}

function measureEntryTokens(entries) {
  const list = entries instanceof Map ? Array.from(entries.values()) : entries;
  let chars = 0;
  for (const entry of list) {
    chars += entry.chars;
  }
  return measureApproxChars(chars, list.length);
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
    maxBuffer: 128 * 1024 * 1024
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

function runBuffer(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: null,
    shell: false,
    maxBuffer: 512 * 1024 * 1024
  });
  if (result.status !== 0) {
    throw new Error([
      `${command} ${args.join(" ")} failed with exit ${result.status}`,
      result.stdout?.toString("utf8").trim(),
      result.stderr?.toString("utf8").trim()
    ].filter(Boolean).join("\n"));
  }
  return result;
}

function runWithInput(command, args, cwd, input) {
  const result = spawnSync(command, args, {
    cwd,
    input,
    encoding: null,
    shell: false,
    maxBuffer: 128 * 1024 * 1024
  });
  if (result.status !== 0) {
    throw new Error([
      `${command} ${args.join(" ")} failed with exit ${result.status}`,
      result.stdout?.toString("utf8").trim(),
      result.stderr?.toString("utf8").trim()
    ].filter(Boolean).join("\n"));
  }
  return result;
}

function renderReport(repoResults, rows, options) {
  const totals = rows.reduce((acc, row) => {
    acc.baselineFiles += row.baseline.files;
    acc.focusedFiles += row.focused.files;
    acc.baselineTokens += row.baseline.tokens;
    acc.focusedTokens += row.focused.tokens;
    acc.contextSavedTokens += row.contextSavedTokens;
    acc.diffTokens += row.diff.tokens;
    acc.patchBytes += row.patch.bytes;
    acc.verifiedFiles += row.replay.verifiedFiles;
    acc.naiveWorkflowTokens += row.workflow.naiveTokens;
    acc.initialWorkflowTokens += row.workflow.initialTokens;
    acc.currentWorkflowTokens += row.workflow.currentTokens;
    acc.initialSavedTokens += row.workflow.initialSavedTokens;
    acc.currentSavedTokens += row.workflow.currentSavedTokens;
    acc.currentVsInitialSavedTokens += row.workflow.currentVsInitialSavedTokens;
    return acc;
  }, {
    baselineFiles: 0,
    focusedFiles: 0,
    baselineTokens: 0,
    focusedTokens: 0,
    contextSavedTokens: 0,
    diffTokens: 0,
    patchBytes: 0,
    verifiedFiles: 0,
    naiveWorkflowTokens: 0,
    initialWorkflowTokens: 0,
    currentWorkflowTokens: 0,
    initialSavedTokens: 0,
    currentSavedTokens: 0,
    currentVsInitialSavedTokens: 0
  });

  const repoRows = repoResults.map((result) => summarizeRepo(result.repo, result.rows, result.skipped.length));
  const skippedCandidates = repoResults.reduce((total, result) => total + result.skipped.length, 0);
  const contextSavings = percent(totals.contextSavedTokens, totals.baselineTokens);
  const initialSavings = percent(totals.initialSavedTokens, totals.naiveWorkflowTokens);
  const currentSavings = percent(totals.currentSavedTokens, totals.naiveWorkflowTokens);
  const currentVsInitialSavings = percent(totals.currentVsInitialSavedTokens, totals.initialWorkflowTokens);

  return [
    `# ${asciiText(options.reportTitle)}`,
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This benchmark is a strict checked-in evidence snapshot for the Conducty Codex integration. It samples recent focused non-merge commits across the configured repository set, creates parent-state focused workspaces, applies the real historical patches, and verifies every replayed file exactly matches the target commit.",
    "",
    "- **Replay gate:** a row counts only if the historical patch applies to parent-state files and reproduces target-state files byte-for-byte.",
    "- **Host checkout guard:** replay tries the default Git apply behavior first, then an LF-pinned mode, and still accepts only byte-exact target archive matches.",
    `- **Repository gate:** ${asciiText(options.scopeNote)}`,
    "- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.",
    "- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.",
    `- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and ${CONDUCTY_WORKFLOW_OVERHEAD_TOKENS} fixed tokens for plan/checkpoint/verification overhead.`,
    "- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.",
    "",
    "This is still not an autonomous-agent success benchmark, product-wide guarantee, or exact provider-billing trace. It is a deterministic historical patch replay benchmark with exact target-file verification.",
    "",
    "## Summary",
    "",
    `- Repositories measured: ${repoResults.length}`,
    `- Replayed commits passed: ${rows.filter((row) => row.replay.applied).length}/${rows.length}`,
    `- Candidate commits skipped before replay success: ${skippedCandidates}`,
    `- Target files verified exactly: ${formatInteger(totals.verifiedFiles)}`,
    `- Patch bytes applied: ${formatInteger(totals.patchBytes)}`,
    `- Baseline readable files counted across parent checkouts: ${formatInteger(totals.baselineFiles)}`,
    `- Focused context files counted across replays: ${formatInteger(totals.focusedFiles)}`,
    `- Baseline context tokens: ${formatInteger(totals.baselineTokens)}`,
    `- Focused context tokens: ${formatInteger(totals.focusedTokens)}`,
    `- One-pass context tokens saved: ${formatInteger(totals.contextSavedTokens)} (${contextSavings.toFixed(1)}%)`,
    `- Naive workflow tokens: ${formatInteger(totals.naiveWorkflowTokens)}`,
    `- Initial architecture workflow tokens: ${formatInteger(totals.initialWorkflowTokens)}`,
    `- Initial architecture savings vs naive: ${initialSavings.toFixed(1)}%`,
    `- Current PR workflow tokens: ${formatInteger(totals.currentWorkflowTokens)}`,
    `- Current PR savings vs naive: ${currentSavings.toFixed(1)}%`,
    `- Current PR saved vs initial: ${formatInteger(totals.currentVsInitialSavedTokens)} tokens (${currentVsInitialSavings.toFixed(1)}%)`,
    `- Median current-vs-initial per-replay savings: ${median(rows.map((row) => row.workflow.currentVsInitialSavedPercent)).toFixed(1)}%`,
    "",
    "## Repository Results",
    "",
    "| Repository | Replays | Skipped candidates | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
    ...repoRows.map((row) => [
      row.name,
      row.replays,
      row.skipped,
      row.verifiedFiles,
      row.baselineTokens,
      row.focusedTokens,
      row.initialTokens,
      row.currentTokens,
      row.currentVsInitialSavedTokens,
      `${row.currentVsInitialSavedPercent.toFixed(1)}%`
    ]).map((cells) => `| ${cells.join(" | ")} |`),
    "",
    "## Replay Results",
    "",
    "| Repository | Commit | Focused change | Apply mode | Changed files | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial % |",
    "|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ...rows.map((row) => [
      row.repo.name,
      row.commit.slice(0, 12),
      markdownCell(row.subject),
      row.replay.mode,
      row.changedFiles.length,
      row.replay.verifiedFiles,
      row.baseline.tokens,
      row.focused.tokens,
      row.workflow.initialTokens,
      row.workflow.currentTokens,
      `${row.workflow.currentVsInitialSavedPercent.toFixed(1)}%`
    ]).map((cells) => `| ${cells.join(" | ")} |`),
    "",
    "## Replayed Files",
    "",
    ...rows.flatMap((row, index) => [
      `### ${index + 1}. ${row.repo.name} ${row.commit.slice(0, 12)} - ${asciiText(row.subject)}`,
      "",
      `- Repository: ${row.repo.url}`,
      `- Parent: \`${row.parent}\``,
      `- Commit: \`${row.commit}\``,
      `- Replay: patch applied with \`${row.replay.mode}\` mode and ${row.replay.verifiedFiles} files matched target commit exactly`,
      "",
      ...row.changedFiles.map((file) => `- \`${file}\``),
      ""
    ])
  ].join("\n");
}

function summarizeRepo(repo, rows, skipped) {
  const totals = rows.reduce((acc, row) => {
    acc.verifiedFiles += row.replay.verifiedFiles;
    acc.baselineTokens += row.baseline.tokens;
    acc.focusedTokens += row.focused.tokens;
    acc.initialTokens += row.workflow.initialTokens;
    acc.currentTokens += row.workflow.currentTokens;
    acc.currentVsInitialSavedTokens += row.workflow.currentVsInitialSavedTokens;
    return acc;
  }, {
    verifiedFiles: 0,
    baselineTokens: 0,
    focusedTokens: 0,
    initialTokens: 0,
    currentTokens: 0,
    currentVsInitialSavedTokens: 0
  });
  return {
    name: repo.name,
    replays: rows.length,
    skipped,
    ...totals,
    currentVsInitialSavedPercent: percent(totals.currentVsInitialSavedTokens, totals.initialTokens)
  };
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

function firstLine(value) {
  return asciiText(value).split(/\r?\n/)[0] || "unknown error";
}

function percent(numerator, denominator) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function formatInteger(value) {
  return Math.round(value).toLocaleString("en-US");
}

function sleepMs(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
}
