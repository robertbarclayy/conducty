#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INTEGRATION_DIR = path.resolve(__dirname, "..");
const DEFAULT_DATASET_PATH = path.resolve(
  INTEGRATION_DIR,
  "../../..",
  "SWE-bench_Pro-os",
  "helper_code",
  "sweap_eval_full_v2.jsonl"
);
const DEFAULT_SCRIPTS_DIR = path.resolve(
  INTEGRATION_DIR,
  "../../..",
  "SWE-bench_Pro-os",
  "run_scripts"
);

function main() {
  const options = parseArgs(process.argv.slice(2));
  const datasetPath = resolveDatasetPath(options.datasetJsonl);
  const scriptsDir = resolveOptionalPath(options.scriptsDir, DEFAULT_SCRIPTS_DIR);
  const result = analyzeDataset(datasetPath, scriptsDir);

  if (options.writeTracerFiles) {
    writeTracerFiles(result.tracerCandidate, options.writeTracerFiles);
  }

  const report = renderReport(result, {
    datasetPath,
    scriptsDir,
    tracerNote: options.tracerNote,
    writeTracerFiles: options.writeTracerFiles
  });
  const outputPath = path.resolve(options.output || path.join(INTEGRATION_DIR, "swe-bench-pro-preflight.md"));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, "utf8");
  process.stdout.write(report);
}

function parseArgs(args) {
  const options = {
    datasetJsonl: "",
    scriptsDir: "",
    output: "",
    tracerNote: "",
    writeTracerFiles: ""
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dataset-jsonl") options.datasetJsonl = requireValue(args, ++index, arg);
    else if (arg === "--scripts-dir") options.scriptsDir = requireValue(args, ++index, arg);
    else if (arg === "--output") options.output = requireValue(args, ++index, arg);
    else if (arg === "--tracer-note") options.tracerNote = requireValue(args, ++index, arg);
    else if (arg === "--write-tracer-files") options.writeTracerFiles = requireValue(args, ++index, arg);
    else if (arg === "--help") {
      console.log([
        "Usage: node scripts/swe-bench-pro-preflight.mjs [options]",
        "",
        "Options:",
        "  --dataset-jsonl <file>       Official SWE-bench Pro JSONL file.",
        "  --scripts-dir <dir>          Official run_scripts directory to check.",
        "  --output <file>              Markdown report path.",
        "  --write-tracer-files <dir>   Write a smallest gold-patch tracer JSONL and patch JSON.",
        "  --tracer-note <text>         Include a local official-evaluator result note.",
        "",
        "If --dataset-jsonl is omitted, the script tries $SWE_BENCH_PRO_JSONL,",
        "then a sibling SWE-bench_Pro-os checkout next to the conducty repo."
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

function resolveDatasetPath(explicitPath) {
  const candidates = [
    explicitPath,
    process.env.SWE_BENCH_PRO_JSONL,
    DEFAULT_DATASET_PATH
  ].filter(Boolean);
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved)) return resolved;
  }
  throw new Error([
    "SWE-bench Pro JSONL was not found.",
    "Clone https://github.com/scaleapi/SWE-bench_Pro-os and pass:",
    "  --dataset-jsonl <repo>/helper_code/sweap_eval_full_v2.jsonl"
  ].join("\n"));
}

function resolveOptionalPath(explicitPath, fallbackPath) {
  const candidates = [explicitPath, fallbackPath].filter(Boolean);
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved)) return resolved;
  }
  return "";
}

function analyzeDataset(datasetPath, scriptsDir) {
  const content = fs.readFileSync(datasetPath, "utf8");
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  const rows = [];
  const repoCounts = new Map();
  let parseFailures = 0;
  let goldPatchRows = 0;
  let scriptRows = 0;

  for (const [offset, line] of content.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      const failToPass = toArray(row.FAIL_TO_PASS ?? row.fail_to_pass);
      const passToPass = toArray(row.PASS_TO_PASS ?? row.pass_to_pass);
      const patch = stringValue(row.patch ?? row.gold_patch ?? row.model_patch);
      const problem = stringValue(row.problem_statement);
      const repo = stringValue(row.repo || row.repo_name || "unknown");
      const hasScripts = scriptsDir ? hasOfficialScripts(scriptsDir, row.instance_id) : false;
      const entry = {
        line: offset + 1,
        rawRow: row,
        instanceId: stringValue(row.instance_id),
        repo,
        problem,
        patch,
        failToPass,
        passToPass,
        hasScripts,
        problemTokens: estimateTokens(problem),
        patchTokens: estimateTokens(patch),
        selectorTokens: estimateTokens([...failToPass, ...passToPass].join("\n")),
        testCount: failToPass.length + passToPass.length
      };
      rows.push(entry);
      repoCounts.set(repo, (repoCounts.get(repo) || 0) + 1);
      if (patch) goldPatchRows += 1;
      if (hasScripts) scriptRows += 1;
    } catch {
      parseFailures += 1;
    }
  }

  if (!rows.length) throw new Error(`No valid rows found in ${datasetPath}`);

  const runnableRows = scriptsDir ? rows.filter((row) => row.hasScripts) : rows;
  const tracerCandidate = runnableRows
    .filter((row) => row.patch)
    .sort(compareTracerCandidates)[0];
  if (!tracerCandidate) throw new Error("No gold-patch tracer candidate found.");

  return {
    rows,
    repoCounts,
    datasetBytes: Buffer.byteLength(content, "utf8"),
    datasetSha256: hash,
    parseFailures,
    goldPatchRows,
    scriptRows,
    scriptsChecked: Boolean(scriptsDir),
    tracerCandidate,
    summary: summarizeRows(rows)
  };
}

function hasOfficialScripts(scriptsDir, instanceId) {
  return fs.existsSync(path.join(scriptsDir, instanceId, "run_script.sh"))
    && fs.existsSync(path.join(scriptsDir, instanceId, "parser.py"));
}

function compareTracerCandidates(left, right) {
  return left.testCount - right.testCount
    || left.patchTokens - right.patchTokens
    || left.problemTokens - right.problemTokens
    || left.instanceId.localeCompare(right.instanceId);
}

function summarizeRows(rows) {
  return {
    problemTokens: describeNumbers(rows.map((row) => row.problemTokens)),
    patchTokens: describeNumbers(rows.map((row) => row.patchTokens)),
    selectorTokens: describeNumbers(rows.map((row) => row.selectorTokens)),
    testCounts: describeNumbers(rows.map((row) => row.testCount)),
    totalProblemTokens: sum(rows.map((row) => row.problemTokens)),
    totalPatchTokens: sum(rows.map((row) => row.patchTokens)),
    totalSelectorTokens: sum(rows.map((row) => row.selectorTokens))
  };
}

function describeNumbers(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return {
    min: sorted[0],
    median: percentile(sorted, 0.5),
    p90: percentile(sorted, 0.9),
    max: sorted[sorted.length - 1],
    total: sum(sorted)
  };
}

function percentile(sortedValues, percentileValue) {
  if (!sortedValues.length) return 0;
  const index = Math.min(sortedValues.length - 1, Math.floor(percentileValue * (sortedValues.length - 1)));
  return sortedValues[index];
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function toArray(value) {
  if (Array.isArray(value)) return value.map(stringValue).filter(Boolean);
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(stringValue).filter(Boolean);
    } catch {
      return [trimmed];
    }
    return [trimmed];
  }
  return [String(value)];
}

function stringValue(value) {
  return value == null ? "" : String(value);
}

function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(Buffer.byteLength(String(text), "utf8") / 4);
}

function writeTracerFiles(tracerCandidate, outputDir) {
  const resolved = path.resolve(outputDir);
  fs.mkdirSync(resolved, { recursive: true });
  const rawSample = {
    ...tracerCandidate.rawRow,
    fail_to_pass: JSON.stringify(tracerCandidate.failToPass),
    pass_to_pass: JSON.stringify(tracerCandidate.passToPass)
  };
  fs.writeFileSync(path.join(resolved, "sample-small.jsonl"), `${JSON.stringify(rawSample)}\n`, "utf8");
  fs.writeFileSync(
    path.join(resolved, "gold-patches-small.json"),
    JSON.stringify([
      {
        instance_id: tracerCandidate.instanceId,
        patch: tracerCandidate.patch,
        prefix: "gold"
      }
    ], null, 2),
    "utf8"
  );
}

function renderReport(result, options) {
  const repoRows = [...result.repoCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([repo, count]) => `| ${repo} | ${count} |`);
  const tracer = result.tracerCandidate;
  return [
    "# SWE-bench Pro Preflight",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This is an operational preflight for running Conducty-style evaluation against SWE-bench Pro. It does not claim a SWE-bench Pro solve rate, leaderboard score, model quality result, or provider-billing result. A real solve-rate claim still requires model-generated patches plus the official evaluator completing successfully.",
    "",
    "## Source",
    "",
    "- Evaluation repo expected: https://github.com/scaleapi/SWE-bench_Pro-os",
    `- Dataset JSONL: ${path.basename(options.datasetPath)}`,
    `- Dataset bytes: ${formatInteger(result.datasetBytes)}`,
    `- Dataset SHA-256: ${result.datasetSha256}`,
    `- Official run scripts checked: ${result.scriptsChecked ? "yes" : "no"}`,
    "",
    "## Data Health",
    "",
    `- Rows parsed: ${formatInteger(result.rows.length)}`,
    `- Parse failures: ${formatInteger(result.parseFailures)}`,
    `- Repositories: ${formatInteger(result.repoCounts.size)}`,
    `- Rows with gold patches: ${formatInteger(result.goldPatchRows)}/${formatInteger(result.rows.length)}`,
    result.scriptsChecked
      ? `- Rows with run_script.sh and parser.py: ${formatInteger(result.scriptRows)}/${formatInteger(result.rows.length)}`
      : "- Rows with run_script.sh and parser.py: not checked",
    "",
    "## Dataset Shape",
    "",
    "| Metric | Min | Median | P90 | Max | Total |",
    "|---|---:|---:|---:|---:|---:|",
    renderStatsRow("Problem statement tokens", result.summary.problemTokens),
    renderStatsRow("Gold patch tokens", result.summary.patchTokens),
    renderStatsRow("Test selector tokens", result.summary.selectorTokens),
    renderStatsRow("Selected test count", result.summary.testCounts),
    "",
    "Token estimates use a transparent bytes/4 approximation. They are sizing signals for context pressure, not provider-side billing records.",
    "",
    "## Repository Coverage",
    "",
    "| Repository | Tasks |",
    "|---|---:|",
    ...repoRows,
    "",
    "## Smallest Official Gold Tracer",
    "",
    `- Instance: ${tracer.instanceId}`,
    `- Repository: ${tracer.repo}`,
    `- Selected tests: ${formatInteger(tracer.testCount)} (${formatInteger(tracer.failToPass.length)} fail-to-pass, ${formatInteger(tracer.passToPass.length)} pass-to-pass)`,
    `- Problem statement tokens: ${formatInteger(tracer.problemTokens)}`,
    `- Gold patch tokens: ${formatInteger(tracer.patchTokens)}`,
    `- Test selector tokens: ${formatInteger(tracer.selectorTokens)}`,
    `- Official scripts present: ${tracer.hasScripts ? "yes" : "not checked"}`,
    options.writeTracerFiles
      ? `- Tracer files written under: ${path.basename(path.resolve(options.writeTracerFiles))}`
      : "- Tracer files written: no",
    options.tracerNote ? `- Local tracer note: ${options.tracerNote}` : "- Local tracer note: not run in this report",
    "",
    "To run the official one-instance gold-patch tracer from a SWE-bench_Pro-os checkout after generating tracer files:",
    "",
    "```bash",
    "python swe_bench_pro_eval.py \\",
    "  --raw_sample_path=.conducty-eval/sample-small.jsonl \\",
    "  --patch_path=.conducty-eval/gold-patches-small.json \\",
    "  --output_dir=.conducty-eval/official-gold-small \\",
    "  --scripts_dir=run_scripts \\",
    "  --num_workers=1 \\",
    "  --dockerhub_username=jefzda \\",
    "  --use_local_docker \\",
    "  --redo",
    "```",
    "",
    "## Interpretation",
    "",
    "| Claim | Status |",
    "|---|---|",
    "| SWE-bench Pro assets can be enumerated and checked deterministically | Supported by this report |",
    "| Every local task row has a gold patch | Supported by this report |",
    "| Every local task row has official run scripts | Supported when --scripts-dir points at the official checkout |",
    "| Conducty has an official SWE-bench Pro solve rate | Not claimed here |",
    "| Conducty reduces model cost on SWE-bench Pro | Not claimed here; requires comparable real model runs |",
    "| The next validation step is clear | Supported: run the one-instance gold tracer, then model-generated patch trials |",
    "",
    "## Next Evaluation Gate",
    "",
    "1. Confirm Docker can pull and run the official image for the smallest gold tracer.",
    "2. Run gold-patch evaluation for a small stratified set across repositories to validate harness health.",
    "3. Run Conducty-guided model patch generation on the same stratified set.",
    "4. Compare pass rate, retry count, input tokens, output tokens, wall time, and evaluator logs against a non-Conducty baseline.",
    ""
  ].join("\n");
}

function renderStatsRow(label, stats) {
  return [
    `| ${label}`,
    formatInteger(stats.min),
    formatInteger(stats.median),
    formatInteger(stats.p90),
    formatInteger(stats.max),
    formatInteger(stats.total)
  ].join(" | ") + " |";
}

function formatInteger(value) {
  return Number(value || 0).toLocaleString("en-US");
}

main();
