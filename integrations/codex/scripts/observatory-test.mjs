#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildObservatory } from "./observatory.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const observatoryScript = path.join(__dirname, "observatory.mjs");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-observatory-test-"));
const vault = path.join(tempRoot, "vault");

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function writeNote(relativePath, content) {
  const fullPath = path.join(vault, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
}

try {
  writeNote("Conducty Index.md", [
    "---",
    "type: index",
    "---",
    "",
    "# Conducty Index",
    "",
    "- [[Plans Index]]",
    "- [[Missing Root Link]]",
    ""
  ].join("\n"));

  writeNote("Indexes/Plans Index.md", [
    "# Plans Index",
    "",
    "- [[Plan 2026-05-01 1000 Open Feature]]",
    "- [[Plan 2026-05-02 1100 Shipped Feature]]",
    ""
  ].join("\n"));

  writeNote("Plans/Plan 2026-05-01 1000 Open Feature.md", [
    "---",
    "type: plan",
    "date: 2026-05-01",
    "---",
    "",
    "# Plan 2026-05-01 1000 Open Feature",
    "",
    "## Goal",
    "",
    "Keep this plan open for Observatory coverage.",
    "",
    "## Related",
    "",
    "- [[Missing Context Note]]",
    ""
  ].join("\n"));

  writeNote("Plans/Plan 2026-05-02 1100 Shipped Feature.md", [
    "---",
    "type: plan",
    "date: 2026-05-02",
    "---",
    "",
    "# Plan 2026-05-02 1100 Shipped Feature",
    "",
    "## Checkpoint Notes",
    "",
    "### Group A Checkpoint - 2026-05-02 1130",
    "",
    "- Completed: 1/1",
    ""
  ].join("\n"));

  writeNote("Ship Reports/Ship Report 2026-05-02 1200 Shipped Feature.md", [
    "---",
    "type: ship-report",
    "date: 2026-05-02",
    "verdict: green",
    'plan: "Plan 2026-05-02 1100 Shipped Feature"',
    "---",
    "",
    "# Ship Report 2026-05-02 1200 Shipped Feature",
    "",
    "## Plan",
    "",
    "- [[Plan 2026-05-02 1100 Shipped Feature]]",
    ""
  ].join("\n"));

  writeNote("Accumulators/Prompt Log.md", [
    "# Prompt Log",
    "",
    "- 2026-05-03 1200 | P1 | [[Plan 2026-05-02 1100 Shipped Feature]] | DONE | evidence",
    "- 2026-05-03 1210 | P2 | [[Plan 2026-05-01 1000 Open Feature]] | FAILED | failed evidence",
    ""
  ].join("\n"));

  writeNote("Accumulators/Failure Patterns.md", [
    "# Failure Patterns",
    "",
    "- Missing checkpoint before broad execution",
    "- Broken wikilink stayed invisible until review",
    ""
  ].join("\n"));

  writeNote("Accumulators/Token Savings Ledger.md", [
    "# Token Savings Ledger",
    "",
    "| Date | Plan | Scenario | Baseline Tokens | Conducty Tokens | Saved Tokens | Saved % | Method | Evidence | Notes |",
    "|---|---|---|---:|---:|---:|---:|---|---|---|",
    "| 2026-05-03 | [[Plan 2026-05-02 1100 Shipped Feature]] | Repeat context baseline | 10000 | 6500 | 3500 | 35.0% | manual transcript count | baseline and Conducty transcript totals | measured smoke fixture |",
    ""
  ].join("\n"));

  writeNote("Improvements/Improvement 2026-05-03 1230.md", [
    "---",
    "type: improvement",
    "date: 2026-05-03",
    "---",
    "",
    "# Improvement 2026-05-03 1230",
    "",
    "## Learned",
    "",
    "Visible reports change behavior.",
    ""
  ].join("\n"));

  writeNote("Context/Shared Note.md", "# Shared Note\n");
  writeNote("Designs/Shared Note.md", "# Shared Note\n");

  const output = path.join(tempRoot, "observatory.html");
  const result = buildObservatory({
    vaultPath: vault,
    outputPath: output,
    now: new Date("2026-05-03T12:45:00")
  });

  assert(fs.existsSync(output), "HTML report was written");
  const html = fs.readFileSync(output, "utf8");
  assert(html.includes("Conducty Observatory"), "HTML includes report title");
  assert(html.includes("Attention Queue"), "HTML includes attention queue");
  assert(html.includes("Missing checkpoint"), "HTML includes missing checkpoint signal");
  assert(html.includes("Missing Context Note"), "HTML includes broken wikilink target");
  assert(html.includes("Measured tokens saved"), "HTML includes token savings signal");

  const summary = result.summary;
  assert(summary.plans.total === 2, `expected 2 plans, got ${summary.plans.total}`);
  assert(summary.plans.open === 1, `expected 1 open plan, got ${summary.plans.open}`);
  assert(summary.plans.shipped === 1, `expected 1 shipped plan, got ${summary.plans.shipped}`);
  assert(summary.plans.missingCheckpoints === 1, `expected 1 missing checkpoint, got ${summary.plans.missingCheckpoints}`);
  assert(summary.wikilinks.broken === 2, `expected 2 broken links, got ${summary.wikilinks.broken}`);
  assert(summary.wikilinks.duplicateBasenames === 1, `expected 1 duplicate basename, got ${summary.wikilinks.duplicateBasenames}`);
  assert(summary.learning.improvementsLast7Days === 1, `expected 1 recent improvement, got ${summary.learning.improvementsLast7Days}`);
  assert(summary.learning.promptOutcomes.DONE === 1, "expected DONE prompt outcome");
  assert(summary.learning.promptOutcomes.FAILED === 1, "expected FAILED prompt outcome");
  assert(summary.learning.tokenSavings.entries === 1, "expected one token savings entry");
  assert(summary.learning.tokenSavings.savedTokens === 3500, "expected 3500 saved tokens");
  assert(summary.learning.tokenSavings.savingsRate === 35, "expected 35% savings rate");
  assert(summary.shipReports.verdicts.green === 1, "expected one green ship report");

  const cliOutput = path.join(tempRoot, "cli-observatory.html");
  const cli = spawnSync(process.execPath, [
    observatoryScript,
    "--vault", vault,
    "--output", cliOutput,
    "--json",
    "--limit", "3"
  ], {
    cwd: path.dirname(observatoryScript),
    encoding: "utf8"
  });
  if (cli.status !== 0) {
    throw new Error([
      `CLI exited ${cli.status}`,
      cli.stdout.trim(),
      cli.stderr.trim()
    ].filter(Boolean).join("\n"));
  }
  const cliSummary = JSON.parse(cli.stdout);
  assert(fs.existsSync(cliOutput), "CLI wrote HTML report");
  assert(cliSummary.plans.open === 1, "CLI summary preserved open-plan count");
  assert(cliSummary.wikilinks.duplicateBasenames === 1, "CLI summary preserved duplicate count");

  console.log("conducty-codex Observatory test passed");
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
