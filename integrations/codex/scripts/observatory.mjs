#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const DEFAULT_ROOTS = [
  "Conducty Index.md",
  "Indexes",
  "Accumulators",
  "Plans",
  "Designs",
  "Improvements",
  "Code Reviews",
  "Ship Reports",
  "Context"
];

const DEFAULT_LIMIT = 10;
const DEFAULT_MAX_NOTES = 1000;
const DEFAULT_MAX_BYTES_PER_NOTE = 1024 * 1024;
const DAY_MS = 24 * 60 * 60 * 1000;

export function resolveVaultPath(explicitVault) {
  if (typeof explicitVault === "string" && explicitVault.trim()) {
    return path.resolve(explicitVault);
  }

  if (process.env.CONDUCTY_VAULT && process.env.CONDUCTY_VAULT.trim()) {
    return path.resolve(process.env.CONDUCTY_VAULT);
  }

  return path.join(os.homedir(), "Obsidian", "Conducty");
}

export function defaultObservatoryPath(vaultPath) {
  return path.join(vaultPath, "Conducty Observatory.html");
}

export function buildObservatory(options = {}) {
  const vaultPath = resolveVaultPath(options.vaultPath || options.vault);
  const outputPath = path.resolve(options.outputPath || options.output || defaultObservatoryPath(vaultPath));
  const analysis = analyzeVault(vaultPath, options);
  const html = renderObservatory(analysis);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");

  return {
    outputPath,
    analysis,
    summary: summarizeAnalysis(analysis, outputPath)
  };
}

export function analyzeVault(vaultPath, options = {}) {
  const resolvedVault = path.resolve(vaultPath);
  if (!fs.existsSync(resolvedVault)) {
    throw new Error(`Conducty vault not found: ${resolvedVault}`);
  }

  const generatedAt = options.now instanceof Date ? options.now : new Date();
  const limit = normalizePositiveInteger(options.limit, DEFAULT_LIMIT);
  const scan = listMarkdownNotes(resolvedVault, {
    maxNotes: options.maxNotes,
    maxBytesPerNote: options.maxBytesPerNote
  });
  const notes = scan.notes;
  const basenameGroups = groupNotesByBasename(notes);
  const availableBasenames = new Set(basenameGroups.keys());
  const wikilinks = collectWikilinks(notes);
  const brokenWikilinks = wikilinks
    .filter((link) => !availableBasenames.has(link.target))
    .sort(compareBySourceThenTarget);
  const duplicateBasenames = [...basenameGroups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([basename, group]) => ({
      basename,
      paths: group.map((note) => displayPath(note.relPath)).sort()
    }))
    .sort((a, b) => a.basename.localeCompare(b.basename));
  const inboundCounts = countInboundLinks(wikilinks, availableBasenames);
  const unlinkedUserNotes = notes
    .filter((note) => isUserFacingNote(note.relPath))
    .filter((note) => (inboundCounts.get(note.basename) || 0) === 0)
    .map((note) => displayPath(note.relPath))
    .sort();

  const plans = notes.filter((note) => note.relPath.startsWith(`Plans${path.sep}`));
  const shipReports = notes.filter((note) => note.relPath.startsWith(`Ship Reports${path.sep}`));
  const shipReportsByPlan = mapShipReportsToPlans(shipReports);
  const planSummaries = plans
    .map((note) => summarizePlan(note, shipReportsByPlan.get(note.basename) || []))
    .sort((a, b) => b.mtimeMs - a.mtimeMs || a.name.localeCompare(b.name));
  const openPlans = planSummaries.filter((plan) => !plan.shipReports.length);
  const shippedPlans = planSummaries.filter((plan) => plan.shipReports.length > 0);
  const plansWithoutCheckpoints = planSummaries.filter((plan) => !plan.hasCheckpoint);
  const plansWithoutShipReports = openPlans;

  const promptLog = notes.find((note) => displayPath(note.relPath) === "Accumulators/Prompt Log.md");
  const promptOutcomes = summarizePromptOutcomes(promptLog?.text || "");
  const failurePatterns = extractRecentBullets(
    notes.find((note) => displayPath(note.relPath) === "Accumulators/Failure Patterns.md")?.text || "",
    limit
  );
  const improvements = notes.filter((note) => note.relPath.startsWith(`Improvements${path.sep}`));
  const improvementVelocity = summarizeImprovementVelocity(improvements, generatedAt);
  const recentImprovements = improvements
    .map((note) => ({
      name: note.basename,
      path: displayPath(note.relPath),
      date: noteDate(note),
      mtimeMs: note.mtimeMs
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs || a.name.localeCompare(b.name))
    .slice(0, limit);
  const shipReportSummaries = shipReports
    .map(summarizeShipReport)
    .sort((a, b) => b.mtimeMs - a.mtimeMs || a.name.localeCompare(b.name));
  const shipVerdicts = countBy(shipReportSummaries.map((report) => report.verdict || "unknown"));

  return {
    vaultPath: resolvedVault,
    generatedAt,
    limit,
    scan,
    notes,
    duplicateBasenames,
    brokenWikilinks,
    unlinkedUserNotes,
    plans: planSummaries,
    openPlans,
    shippedPlans,
    plansWithoutCheckpoints,
    plansWithoutShipReports,
    promptOutcomes,
    failurePatterns,
    improvementVelocity,
    recentImprovements,
    shipReports: shipReportSummaries,
    shipVerdicts
  };
}

export function summarizeAnalysis(analysis, outputPath) {
  return {
    vaultPath: analysis.vaultPath,
    outputPath: outputPath ? path.resolve(outputPath) : undefined,
    generatedAt: analysis.generatedAt.toISOString(),
    notesScanned: analysis.scan.notes.length,
    scanLimitReached: analysis.scan.truncated,
    largeNotesSkipped: analysis.scan.skippedLargeNotes,
    plans: {
      total: analysis.plans.length,
      open: analysis.openPlans.length,
      shipped: analysis.shippedPlans.length,
      missingCheckpoints: analysis.plansWithoutCheckpoints.length,
      missingShipReports: analysis.plansWithoutShipReports.length
    },
    wikilinks: {
      broken: analysis.brokenWikilinks.length,
      duplicateBasenames: analysis.duplicateBasenames.length,
      unlinkedUserNotes: analysis.unlinkedUserNotes.length
    },
    learning: {
      improvementsTotal: analysis.improvementVelocity.total,
      improvementsLast7Days: analysis.improvementVelocity.last7Days,
      improvementsLast30Days: analysis.improvementVelocity.last30Days,
      promptOutcomes: analysis.promptOutcomes,
      recentFailurePatterns: analysis.failurePatterns.length
    },
    shipReports: {
      total: analysis.shipReports.length,
      verdicts: analysis.shipVerdicts
    }
  };
}

export function renderObservatory(analysis) {
  const attentionItems = [
    ...analysis.openPlans.slice(0, analysis.limit).map((plan) => ({
      label: "Open plan",
      title: plan.name,
      detail: "No ship report linked yet."
    })),
    ...analysis.plansWithoutCheckpoints.slice(0, analysis.limit).map((plan) => ({
      label: "Missing checkpoint",
      title: plan.name,
      detail: "No group checkpoint recorded."
    })),
    ...analysis.brokenWikilinks.slice(0, analysis.limit).map((link) => ({
      label: "Broken wikilink",
      title: link.source,
      detail: `Missing [[${link.target}]].`
    }))
  ].slice(0, analysis.limit * 2);

  const kpis = [
    ["Plans", analysis.plans.length],
    ["Shipped", analysis.shippedPlans.length],
    ["Open", analysis.openPlans.length],
    ["Missing checkpoints", analysis.plansWithoutCheckpoints.length],
    ["Broken links", analysis.brokenWikilinks.length],
    ["Duplicate names", analysis.duplicateBasenames.length],
    ["Improvements", analysis.improvementVelocity.total]
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Conducty Observatory</title>
  <style>
    :root {
      color-scheme: dark light;
      --bg: #0f1115;
      --panel: #171a21;
      --panel-2: #1f2430;
      --line: #2f3542;
      --text: #f4f6fb;
      --muted: #a9b0bf;
      --accent: #7dd3fc;
      --good: #8bd17c;
      --warn: #ffd166;
      --bad: #ff7a90;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 32px 0 56px;
    }
    header {
      display: grid;
      gap: 10px;
      padding-bottom: 22px;
      border-bottom: 1px solid var(--line);
    }
    h1, h2, h3, p { margin: 0; }
    h1 { font-size: clamp(30px, 5vw, 56px); line-height: 1; letter-spacing: 0; }
    h2 { font-size: 18px; margin: 0 0 14px; }
    h3 { font-size: 14px; }
    .muted { color: var(--muted); }
    .path {
      color: var(--accent);
      overflow-wrap: anywhere;
    }
    .grid {
      display: grid;
      gap: 16px;
    }
    .kpis {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      margin: 22px 0;
    }
    .kpi, .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .kpi {
      padding: 16px;
      min-height: 98px;
      display: grid;
      align-content: space-between;
    }
    .kpi strong {
      display: block;
      font-size: 30px;
      line-height: 1.1;
    }
    .panel {
      padding: 18px;
    }
    .two {
      grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
    }
    .three {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px 8px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
    }
    th {
      color: var(--muted);
      font-weight: 600;
    }
    tr:last-child td { border-bottom: 0; }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 2px 8px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--panel-2);
      color: var(--muted);
      white-space: nowrap;
    }
    .good { color: var(--good); }
    .warn { color: var(--warn); }
    .bad { color: var(--bad); }
    ul {
      margin: 0;
      padding-left: 18px;
    }
    li + li { margin-top: 8px; }
    .stack { display: grid; gap: 14px; }
    .attention {
      display: grid;
      gap: 10px;
    }
    .attention-item {
      display: grid;
      gap: 4px;
      padding: 12px;
      background: var(--panel-2);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .footer {
      margin-top: 22px;
      color: var(--muted);
      font-size: 12px;
    }
    @media (max-width: 860px) {
      main { width: min(100% - 20px, 1180px); padding-top: 20px; }
      .two, .three { grid-template-columns: 1fr; }
      th:nth-child(3), td:nth-child(3) { display: none; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="muted">Conducty local vault report</p>
      <h1>Conducty Observatory</h1>
      <p>Generated ${escapeHtml(formatDateTime(analysis.generatedAt))} from <span class="path">${escapeHtml(analysis.vaultPath)}</span></p>
    </header>

    <section class="grid kpis">
      ${kpis.map(([label, value]) => `<article class="kpi"><span class="muted">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("\n      ")}
    </section>

    <section class="grid two">
      <article class="panel">
        <h2>Attention Queue</h2>
        ${attentionItems.length ? `<div class="attention">${attentionItems.map(renderAttentionItem).join("\n")}</div>` : `<p class="muted">No open closure gaps or broken links found in the scanned notes.</p>`}
      </article>

      <article class="panel stack">
        <div>
          <h2>Learning Loop</h2>
          <table>
            <tbody>
              <tr><td>Improvements total</td><td>${analysis.improvementVelocity.total}</td></tr>
              <tr><td>Last 7 days</td><td>${analysis.improvementVelocity.last7Days}</td></tr>
              <tr><td>Last 30 days</td><td>${analysis.improvementVelocity.last30Days}</td></tr>
              <tr><td>Prompt outcomes</td><td>${renderPromptOutcomes(analysis.promptOutcomes)}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3>Recent failure patterns</h3>
          ${renderList(analysis.failurePatterns, "No failure pattern bullets found yet.")}
        </div>
      </article>
    </section>

    <section class="grid three" style="margin-top: 16px;">
      <article class="panel">
        <h2>Open Plans</h2>
        ${renderPlanList(analysis.openPlans, "Every scanned plan has at least one ship report.")}
      </article>
      <article class="panel">
        <h2>Missing Checkpoints</h2>
        ${renderPlanList(analysis.plansWithoutCheckpoints, "Every scanned plan has a group checkpoint.")}
      </article>
      <article class="panel">
        <h2>Ship Readiness</h2>
        ${renderVerdicts(analysis.shipVerdicts)}
      </article>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2>Vault Graph</h2>
      <table>
        <thead>
          <tr><th>Signal</th><th>Count</th><th>Examples</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Broken wikilinks</td>
            <td>${analysis.brokenWikilinks.length}</td>
            <td>${renderBrokenLinks(analysis.brokenWikilinks)}</td>
          </tr>
          <tr>
            <td>Duplicate basenames</td>
            <td>${analysis.duplicateBasenames.length}</td>
            <td>${renderDuplicates(analysis.duplicateBasenames)}</td>
          </tr>
          <tr>
            <td>Unlinked user notes</td>
            <td>${analysis.unlinkedUserNotes.length}</td>
            <td>${renderList(analysis.unlinkedUserNotes.slice(0, analysis.limit), "none")}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="grid two" style="margin-top: 16px;">
      <article class="panel">
        <h2>Recent Improvements</h2>
        ${renderImprovementTable(analysis.recentImprovements)}
      </article>
      <article class="panel">
        <h2>Scan Limits</h2>
        <table>
          <tbody>
            <tr><td>Notes scanned</td><td>${analysis.scan.notes.length}</td></tr>
            <tr><td>Scan limit reached</td><td>${analysis.scan.truncated ? "yes" : "no"}</td></tr>
            <tr><td>Large notes skipped</td><td>${analysis.scan.skippedLargeNotes}</td></tr>
          </tbody>
        </table>
      </article>
    </section>

    <p class="footer">Generated by the dependency-free Conducty Codex Observatory. This file is static and safe to open offline.</p>
  </main>
</body>
</html>`;
}

function listMarkdownNotes(vaultPath, options = {}) {
  const maxNotes = normalizePositiveInteger(options.maxNotes, DEFAULT_MAX_NOTES);
  const maxBytesPerNote = normalizePositiveInteger(options.maxBytesPerNote, DEFAULT_MAX_BYTES_PER_NOTE);
  const notes = [];
  let truncated = false;
  let skippedLargeNotes = 0;

  const addNote = (fullPath) => {
    if (notes.length >= maxNotes) {
      truncated = true;
      return;
    }
    const stat = fs.statSync(fullPath);
    if (stat.size > maxBytesPerNote) {
      skippedLargeNotes += 1;
      return;
    }
    notes.push({
      fullPath,
      relPath: path.relative(vaultPath, fullPath),
      basename: path.basename(fullPath, ".md"),
      text: fs.readFileSync(fullPath, "utf8"),
      mtimeMs: stat.mtimeMs
    });
  };

  const visit = (dir) => {
    if (notes.length >= maxNotes) {
      truncated = true;
      return;
    }

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (notes.length >= maxNotes) {
        truncated = true;
        return;
      }
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      const lstat = fs.lstatSync(fullPath);
      if (lstat.isSymbolicLink()) continue;
      if (lstat.isDirectory()) {
        visit(fullPath);
      } else if (lstat.isFile() && entry.name.endsWith(".md")) {
        addNote(fullPath);
      }
    }
  };

  for (const root of DEFAULT_ROOTS) {
    const fullPath = path.join(vaultPath, root);
    if (!fs.existsSync(fullPath)) continue;
    const lstat = fs.lstatSync(fullPath);
    if (lstat.isSymbolicLink()) continue;
    if (lstat.isDirectory()) {
      visit(fullPath);
    } else if (lstat.isFile() && fullPath.endsWith(".md")) {
      addNote(fullPath);
    }
  }

  notes.sort((a, b) => displayPath(a.relPath).localeCompare(displayPath(b.relPath)));
  return { notes, truncated, skippedLargeNotes };
}

function groupNotesByBasename(notes) {
  const groups = new Map();
  for (const note of notes) {
    const group = groups.get(note.basename) || [];
    group.push(note);
    groups.set(note.basename, group);
  }
  return groups;
}

function collectWikilinks(notes) {
  return notes.flatMap((note) => parseWikiLinks(note.text).map((target) => ({
    source: displayPath(note.relPath),
    target
  })));
}

function parseWikiLinks(text) {
  const links = [];
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  let match;
  while ((match = pattern.exec(text))) {
    const target = path.basename(match[1].trim(), ".md");
    if (target) links.push(target);
  }
  return links;
}

function countInboundLinks(wikilinks, availableBasenames) {
  const counts = new Map();
  for (const link of wikilinks) {
    if (!availableBasenames.has(link.target)) continue;
    counts.set(link.target, (counts.get(link.target) || 0) + 1);
  }
  return counts;
}

function mapShipReportsToPlans(shipReports) {
  const reportsByPlan = new Map();
  for (const report of shipReports) {
    const frontmatter = parseFrontmatter(report.text);
    const targets = new Set(parseWikiLinks(report.text));
    if (frontmatter.plan) targets.add(stripQuotes(frontmatter.plan));

    for (const target of targets) {
      const cleanTarget = path.basename(stripQuotes(target), ".md");
      if (!cleanTarget) continue;
      const reports = reportsByPlan.get(cleanTarget) || [];
      reports.push(report);
      reportsByPlan.set(cleanTarget, reports);
    }
  }
  return reportsByPlan;
}

function summarizePlan(note, shipReports) {
  return {
    name: note.basename,
    path: displayPath(note.relPath),
    hasCheckpoint: /###\s+Group\s+.+?\s+Checkpoint\b/i.test(note.text),
    shipReports: shipReports.map((report) => report.basename).sort(),
    mtimeMs: note.mtimeMs
  };
}

function summarizeShipReport(note) {
  const frontmatter = parseFrontmatter(note.text);
  const verdict = (frontmatter.verdict || extractSectionValue(note.text, "Verdict") || "unknown").toLowerCase();
  return {
    name: note.basename,
    path: displayPath(note.relPath),
    verdict: ["green", "yellow", "red"].includes(verdict) ? verdict : "unknown",
    plan: frontmatter.plan ? stripQuotes(frontmatter.plan) : "",
    mtimeMs: note.mtimeMs
  };
}

function summarizePromptOutcomes(text) {
  const statuses = ["DONE_WITH_CONCERNS", "NEEDS_CONTEXT", "BLOCKED", "FAILED", "DONE"];
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  const pattern = /\|\s*(DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED|FAILED|DONE)\s*(?=\||$)/g;
  let match;
  while ((match = pattern.exec(text))) {
    counts[match[1]] += 1;
  }
  return counts;
}

function extractRecentBullets(text, limit) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
    .slice(0, limit);
}

function summarizeImprovementVelocity(improvements, now) {
  const cutoff7 = now.getTime() - 7 * DAY_MS;
  const cutoff30 = now.getTime() - 30 * DAY_MS;
  const dates = improvements.map((note) => noteDate(note));
  return {
    total: improvements.length,
    last7Days: dates.filter((date) => date && date.getTime() >= cutoff7).length,
    last30Days: dates.filter((date) => date && date.getTime() >= cutoff30).length
  };
}

function noteDate(note) {
  const frontmatter = parseFrontmatter(note.text);
  const raw = frontmatter.date || /(\d{4}-\d{2}-\d{2})/.exec(note.basename)?.[1];
  if (raw) {
    const date = new Date(`${raw}T00:00:00`);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date(note.mtimeMs);
}

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const frontmatter = text.slice(3, end).trim();
  const data = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line.trim());
    if (match) data[match[1]] = stripQuotes(match[2].trim());
  }
  return data;
}

function extractSectionValue(text, section) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$\\n+([^\\n]+)`, "im");
  const match = pattern.exec(text);
  return match?.[1]?.trim() || "";
}

function isUserFacingNote(relativePath) {
  const rel = displayPath(relativePath);
  return !(
    rel === "Conducty Index.md" ||
    rel.startsWith("Indexes/") ||
    rel.startsWith("Accumulators/")
  );
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function renderAttentionItem(item) {
  return `<div class="attention-item"><span class="pill">${escapeHtml(item.label)}</span><h3>${escapeHtml(item.title)}</h3><p class="muted">${escapeHtml(item.detail)}</p></div>`;
}

function renderPlanList(plans, emptyText) {
  if (!plans.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `<ul>${plans.slice(0, 10).map((plan) => `<li><strong>${escapeHtml(plan.name)}</strong><br><span class="muted">${escapeHtml(plan.path)}</span></li>`).join("")}</ul>`;
}

function renderPromptOutcomes(outcomes) {
  const entries = Object.entries(outcomes).filter(([, count]) => count > 0);
  if (!entries.length) return `<span class="muted">none logged</span>`;
  return entries.map(([status, count]) => `<span class="pill">${escapeHtml(status)} ${count}</span>`).join(" ");
}

function renderVerdicts(verdicts) {
  const entries = ["green", "yellow", "red", "unknown"].map((name) => [name, verdicts[name] || 0]);
  return `<table><tbody>${entries.map(([name, count]) => `<tr><td><span class="${verdictClass(name)}">${escapeHtml(name)}</span></td><td>${count}</td></tr>`).join("")}</tbody></table>`;
}

function renderBrokenLinks(links) {
  if (!links.length) return `<span class="muted">none</span>`;
  return `<ul>${links.slice(0, 10).map((link) => `<li><strong>${escapeHtml(link.source)}</strong><br><span class="muted">missing [[${escapeHtml(link.target)}]]</span></li>`).join("")}</ul>`;
}

function renderDuplicates(duplicates) {
  if (!duplicates.length) return `<span class="muted">none</span>`;
  return `<ul>${duplicates.slice(0, 10).map((dup) => `<li><strong>${escapeHtml(dup.basename)}</strong><br><span class="muted">${dup.paths.map(escapeHtml).join("<br>")}</span></li>`).join("")}</ul>`;
}

function renderImprovementTable(improvements) {
  if (!improvements.length) return `<p class="muted">No improvement notes found yet.</p>`;
  return `<table><thead><tr><th>Improvement</th><th>Date</th></tr></thead><tbody>${improvements.map((item) => `<tr><td>${escapeHtml(item.name)}<br><span class="muted">${escapeHtml(item.path)}</span></td><td>${escapeHtml(formatDate(item.date))}</td></tr>`).join("")}</tbody></table>`;
}

function renderList(items, emptyText) {
  if (!items.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function verdictClass(verdict) {
  if (verdict === "green") return "good";
  if (verdict === "yellow") return "warn";
  if (verdict === "red") return "bad";
  return "muted";
}

function compareBySourceThenTarget(a, b) {
  return a.source.localeCompare(b.source) || a.target.localeCompare(b.target);
}

function displayPath(value) {
  return String(value).split(path.sep).join("/");
}

function formatDateTime(date) {
  return `${formatDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "unknown";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function normalizePositiveInteger(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.floor(number);
}

function stripQuotes(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]/, "")
    .replace(/['"]$/, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--vault") {
      options.vaultPath = requireValue(argv, index, arg);
      index += 1;
    } else if (arg === "--output") {
      options.outputPath = requireValue(argv, index, arg);
      index += 1;
    } else if (arg === "--limit") {
      options.limit = Number(requireValue(argv, index, arg));
      index += 1;
    } else if (arg === "--max-notes") {
      options.maxNotes = Number(requireValue(argv, index, arg));
      index += 1;
    } else if (arg === "--max-bytes-per-note") {
      options.maxBytesPerNote = Number(requireValue(argv, index, arg));
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function requireValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function usage() {
  return [
    "Conducty Observatory",
    "",
    "Generate a static HTML report for a Conducty vault.",
    "",
    "Usage:",
    "  node scripts/observatory.mjs [--vault <path>] [--output <path>] [--json]",
    "",
    "Options:",
    "  --vault <path>              Conducty vault path. Defaults to CONDUCTY_VAULT or ~/Obsidian/Conducty.",
    "  --output <path>             HTML output path. Defaults to <vault>/Conducty Observatory.html.",
    "  --limit <n>                 Examples to show per section. Defaults to 10.",
    "  --max-notes <n>             Maximum Markdown notes to scan. Defaults to 1000.",
    "  --max-bytes-per-note <n>    Skip notes larger than this many bytes. Defaults to 1048576.",
    "  --json                      Print the summary JSON after writing HTML.",
    "  --help                      Show this help."
  ].join("\n");
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(usage());
      return;
    }

    const result = buildObservatory(options);
    if (options.json) {
      console.log(JSON.stringify(result.summary, null, 2));
    } else {
      console.log(`Conducty Observatory written to ${result.outputPath}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  await main();
}
