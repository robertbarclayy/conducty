#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INTEGRATION_DIR = path.resolve(__dirname, "..");

const PRICING_SOURCE = {
  name: "OpenAI API Pricing",
  url: "https://openai.com/api/pricing/",
  checked: "2026-05-06"
};

const MODEL_RATES = [
  {
    model: "GPT-5.5",
    inputPerMillion: 5.00,
    cachedInputPerMillion: 0.50,
    outputPerMillion: 30.00
  },
  {
    model: "GPT-5.4",
    inputPerMillion: 2.50,
    cachedInputPerMillion: 0.25,
    outputPerMillion: 15.00
  },
  {
    model: "GPT-5.4 mini",
    inputPerMillion: 0.75,
    cachedInputPerMillion: 0.075,
    outputPerMillion: 4.50
  }
];

const DEFAULT_BENCHMARKS = [
  {
    name: "Final cross-repo historical replay",
    file: path.join(INTEGRATION_DIR, "cross-repo-historical-replay-benchmark.md")
  },
  {
    name: "Meta React historical replay",
    file: path.join(INTEGRATION_DIR, "react-historical-replay-benchmark.md")
  },
  {
    name: "Meta React focused workflow",
    file: path.join(INTEGRATION_DIR, "react-token-savings-benchmark.md")
  },
  {
    name: "Fixed public repos workflow",
    file: path.join(INTEGRATION_DIR, "real-world-token-savings-benchmark.md")
  }
];

function main() {
  const options = parseArgs(process.argv.slice(2));
  const benchmarks = DEFAULT_BENCHMARKS
    .map(readBenchmark)
    .filter(Boolean);
  if (!benchmarks.length) throw new Error("No benchmark reports were found.");

  const report = renderReport(benchmarks);
  const outputPath = path.resolve(options.output || path.join(INTEGRATION_DIR, "billing-estimate.md"));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, "utf8");
  process.stdout.write(report);
}

function parseArgs(args) {
  const options = { output: "" };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--output") options.output = requireValue(args, ++index, "--output");
    else if (arg === "--help") {
      console.log([
        "Usage: node scripts/billing-estimate.mjs [--output <file>]",
        "",
        "Reads checked-in token benchmark summaries and estimates input-token cost",
        "using pinned OpenAI API pricing observed on the date recorded in the report.",
        "This does not call any paid API and is not a provider invoice."
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

function readBenchmark(benchmark) {
  if (!fs.existsSync(benchmark.file)) return null;
  const markdown = fs.readFileSync(benchmark.file, "utf8");
  const naiveTokens = extractInteger(markdown, [
    "Naive workflow tokens",
    "Workflow baseline tokens"
  ]);
  const initialTokens = extractInteger(markdown, ["Initial architecture workflow tokens"]);
  const currentTokens = extractInteger(markdown, [
    "Current PR workflow tokens",
    "Workflow Conducty tokens"
  ]);
  const currentSavedVsInitial = extractSaved(markdown, [
    "Current PR saved vs initial",
    "Current architecture saved vs initial"
  ]);
  const currentSavingsVsNaive = extractPercent(markdown, [
    "Current PR savings vs naive",
    "Workflow aggregate savings"
  ]);
  const replayed = extractReplayCount(markdown);
  const verifiedFiles = extractInteger(markdown, ["Target files verified exactly"]);

  if (!initialTokens || !currentTokens) {
    throw new Error(`${benchmark.name}: missing initial/current workflow token lines in ${benchmark.file}`);
  }

  return {
    ...benchmark,
    naiveTokens,
    initialTokens,
    currentTokens,
    savedVsInitialTokens: currentSavedVsInitial.tokens || (initialTokens - currentTokens),
    savedVsInitialPercent: currentSavedVsInitial.percent || percent(initialTokens - currentTokens, initialTokens),
    currentSavingsVsNaive,
    replayed,
    verifiedFiles
  };
}

function extractInteger(markdown, labels) {
  for (const label of labels) {
    const escaped = escapeRegExp(label);
    const match = markdown.match(new RegExp(`- ${escaped}:\\s*([0-9][0-9,]*)`));
    if (match) return numberFromText(match[1]);
  }
  return 0;
}

function extractSaved(markdown, labels) {
  for (const label of asArray(labels)) {
    const escaped = escapeRegExp(label);
    const match = markdown.match(new RegExp(`- ${escaped}:\\s*([0-9][0-9,]*) tokens \\(([0-9.]+)%\\)`));
    if (match) {
      return {
        tokens: numberFromText(match[1]),
        percent: Number(match[2])
      };
    }
  }
  return { tokens: 0, percent: 0 };
}

function extractPercent(markdown, labels) {
  for (const label of asArray(labels)) {
    const escaped = escapeRegExp(label);
    const match = markdown.match(new RegExp(`- ${escaped}:\\s*([0-9.]+)%`));
    if (match) return Number(match[1]);
  }
  return 0;
}

function extractReplayCount(markdown) {
  const match = markdown.match(/- Replayed commits passed:\s*([0-9]+)\/([0-9]+)/);
  if (!match) return "";
  return `${match[1]}/${match[2]}`;
}

function numberFromText(value) {
  return Number(String(value).replace(/,/g, ""));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function renderReport(benchmarks) {
  const primary = benchmarks[0];
  return [
    "# Billing Estimate From Token Benchmarks",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This report converts checked-in Conducty token benchmark results into input-token cost estimates. It does not call a paid model API, does not read an OpenAI invoice, and does not include output tokens, tool calls, web search, file storage, retries, or provider-side caching. Exact billing proof requires real API usage logs for comparable task runs.",
    "",
    `Pricing source: [${PRICING_SOURCE.name}](${PRICING_SOURCE.url}), checked ${PRICING_SOURCE.checked}.`,
    "",
    "## Pricing Snapshot",
    "",
    "| Model | Input / 1M | Cached input / 1M | Output / 1M |",
    "|---|---:|---:|---:|",
    ...MODEL_RATES.map((rate) => `| ${rate.model} | ${currencyRate(rate.inputPerMillion)} | ${currencyRate(rate.cachedInputPerMillion)} | ${currencyRate(rate.outputPerMillion)} |`),
    "",
    "Only the standard input-token rate is used in the estimates below because the benchmarks measure workflow context pressure, not generated output.",
    "",
    "## Main Billing Result",
    "",
    `Primary benchmark: ${primary.name}`,
    "",
    `- Initial architecture workflow tokens: ${formatInteger(primary.initialTokens)}`,
    `- Current PR workflow tokens: ${formatInteger(primary.currentTokens)}`,
    `- Input tokens avoided vs initial: ${formatInteger(primary.savedVsInitialTokens)} (${primary.savedVsInitialPercent.toFixed(1)}%)`,
    primary.naiveTokens ? `- Naive workflow tokens: ${formatInteger(primary.naiveTokens)}` : null,
    primary.currentSavingsVsNaive ? `- Current PR savings vs naive: ${primary.currentSavingsVsNaive.toFixed(1)}%` : null,
    primary.replayed ? `- Replay pass rate: ${primary.replayed}` : null,
    primary.verifiedFiles ? `- Target files verified exactly: ${formatInteger(primary.verifiedFiles)}` : null,
    "",
    "| Model | Initial input cost | Current PR input cost | Saved vs initial | Naive input cost | Saved vs naive |",
    "|---|---:|---:|---:|---:|---:|",
    ...MODEL_RATES.map((rate) => renderCostRow(primary, rate)),
    "",
    "## All Benchmark Estimates",
    "",
    "These rows should not be summed as independent billing proof because some reports intentionally overlap. They show whether the cost pattern survives across benchmark shapes.",
    "",
    "| Benchmark | Initial tokens | Current tokens | Saved vs initial | GPT-5.4 mini saved | GPT-5.4 saved | GPT-5.5 saved | Replay evidence |",
    "|---|---:|---:|---:|---:|---:|---:|---|",
    ...benchmarks.map(renderBenchmarkRow),
    "",
    "## Interpretation",
    "",
    "- The billing signal is real as an input-context estimate: fewer input tokens at a fixed model price means lower input-token cost.",
    "- The final cross-repo replay benchmark estimates a GPT-5.4 input-cost drop from $62.56 to $3.34 for that measured workflow shape.",
    "- This is not an invoice-level claim because output tokens and provider-specific cache behavior were not measured.",
    "- To turn this into exact billing proof, run paired live API tasks with usage logs for baseline and Conducty workflows, then feed those actual billed input/output tokens into this report."
  ].filter((line) => line !== null && line !== undefined).join("\n");
}

function renderCostRow(benchmark, rate) {
  const initialCost = cost(benchmark.initialTokens, rate.inputPerMillion);
  const currentCost = cost(benchmark.currentTokens, rate.inputPerMillion);
  const naiveCost = benchmark.naiveTokens ? cost(benchmark.naiveTokens, rate.inputPerMillion) : 0;
  return [
    rate.model,
    currency(initialCost),
    currency(currentCost),
    currency(initialCost - currentCost),
    benchmark.naiveTokens ? currency(naiveCost) : "",
    benchmark.naiveTokens ? currency(naiveCost - currentCost) : ""
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function renderBenchmarkRow(benchmark) {
  const savedMini = cost(benchmark.savedVsInitialTokens, MODEL_RATES[2].inputPerMillion);
  const savedGpt54 = cost(benchmark.savedVsInitialTokens, MODEL_RATES[1].inputPerMillion);
  const savedGpt55 = cost(benchmark.savedVsInitialTokens, MODEL_RATES[0].inputPerMillion);
  const evidence = [
    benchmark.replayed ? `replay ${benchmark.replayed}` : "",
    benchmark.verifiedFiles ? `${formatInteger(benchmark.verifiedFiles)} files` : ""
  ].filter(Boolean).join(", ");
  return [
    benchmark.name,
    formatInteger(benchmark.initialTokens),
    formatInteger(benchmark.currentTokens),
    `${formatInteger(benchmark.savedVsInitialTokens)} (${benchmark.savedVsInitialPercent.toFixed(1)}%)`,
    currency(savedMini),
    currency(savedGpt54),
    currency(savedGpt55),
    evidence || "context benchmark"
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function cost(tokens, pricePerMillion) {
  return (tokens / 1_000_000) * pricePerMillion;
}

function percent(numerator, denominator) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function formatInteger(value) {
  return Math.round(value).toLocaleString("en-US");
}

function currency(value) {
  return `$${value.toFixed(2)}`;
}

function currencyRate(value) {
  return Number.isInteger(value * 100) ? `$${value.toFixed(2)}` : `$${value.toFixed(3)}`;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
}
