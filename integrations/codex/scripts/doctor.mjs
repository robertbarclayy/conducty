#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");

const REQUIRED_VAULT_PATHS = [
  "Conducty Index.md",
  path.join("Indexes", "Plans Index.md"),
  path.join("Indexes", "Designs Index.md"),
  path.join("Indexes", "Context Index.md"),
  path.join("Indexes", "Improvements Index.md"),
  path.join("Indexes", "Ship Reports Index.md"),
  path.join("Indexes", "Kernel Contracts Index.md"),
  path.join("Accumulators", "Failure Patterns.md"),
  path.join("Accumulators", "Metrics.md"),
  path.join("Accumulators", "Prompt Log.md"),
  path.join("Accumulators", "Token Savings Ledger.md"),
  "Plans",
  "Designs",
  "Improvements",
  "Code Reviews",
  "Ship Reports",
  "Kernel Contracts",
  "Context"
];

const REQUIRED_PLUGIN_PATHS = [
  ".codex-plugin/plugin.json",
  ".mcp.json",
  "mcp/server.mjs",
  "scripts/smoke-test.mjs",
  "skills/conducty-codex/SKILL.md"
];

const args = parseArgs(process.argv.slice(2));
const results = [];

if (args.help) {
  printHelp();
  process.exit(0);
}

checkNode();
checkPluginFiles();
checkPluginManifest();
checkMcpConfig();
checkSkill();
checkVault();
checkLocalMarketplace();
checkCodexConfig();
if (!args.skipSmoke) checkSmokeTest();

printResults();

const failed = results.some((result) => result.status === "fail");
process.exitCode = failed ? 1 : 0;

function parseArgs(argv) {
  const parsed = {
    json: false,
    fix: false,
    skipSmoke: false,
    vault: "",
    codexHome: "",
    marketplace: "aura-local",
    home: os.homedir(),
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") parsed.json = true;
    else if (arg === "--fix") parsed.fix = true;
    else if (arg === "--skip-smoke") parsed.skipSmoke = true;
    else if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--vault") parsed.vault = requireValue(argv, ++i, arg);
    else if (arg === "--codex-home") parsed.codexHome = requireValue(argv, ++i, arg);
    else if (arg === "--marketplace") parsed.marketplace = requireValue(argv, ++i, arg);
    else if (arg === "--home") parsed.home = requireValue(argv, ++i, arg);
    else failFast(`Unknown argument: ${arg}`);
  }

  parsed.home = path.resolve(parsed.home);
  return parsed;
}

function printHelp() {
  console.log(`Conducty Codex Doctor

Usage:
  node scripts/doctor.mjs [options]

Options:
  --fix                Bootstrap missing vault notes and remove JSON BOMs where safe.
  --vault <path>       Check this Conducty vault. Defaults to CONDUCTY_VAULT or ~/Obsidian/Conducty.
  --codex-home <path>  Check this Codex home. Defaults to CODEX_HOME, ~/.codex, or ~/.codex_new.
  --marketplace <id>   Marketplace id to check. Defaults to aura-local.
  --home <path>        Home directory used for ~/.agents and ~/plugins checks.
  --skip-smoke         Skip the MCP smoke test.
  --json               Print machine-readable JSON.
`);
}

function checkNode() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major >= 18) {
    pass("Node runtime", `node ${process.version}`);
  } else {
    fail("Node runtime", `node ${process.version} is too old`, "Install Node 18 or newer.");
  }
}

function checkPluginFiles() {
  for (const relativePath of REQUIRED_PLUGIN_PATHS) {
    const fullPath = path.join(pluginRoot, relativePath);
    if (fs.existsSync(fullPath)) pass(`Required file: ${relativePath}`);
    else fail(`Required file: ${relativePath}`, "missing", "Restore the file from integrations/codex.");
  }
}

function checkPluginManifest() {
  const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
  const manifest = readJsonCheck(manifestPath, "Plugin manifest");
  if (!manifest) return;

  expectEqual("Plugin manifest name", manifest.name, "conducty-codex");
  expectString("Plugin manifest version", manifest.version);
  expectString("Plugin manifest description", manifest.description);
  expectEqual("Plugin manifest skills path", manifest.skills, "./skills/");
  expectEqual("Plugin manifest MCP path", manifest.mcpServers, "./.mcp.json");

  const ui = manifest.interface || {};
  expectEqual("Plugin display name", ui.displayName, "Conducty Codex");
  expectEqual("Plugin category", ui.category, "Productivity");
  expectString("Plugin short description", ui.shortDescription);
  expectPath("Plugin composer icon", ui.composerIcon);
  expectPath("Plugin logo", ui.logo);

  if (Array.isArray(ui.defaultPrompt) && ui.defaultPrompt.length <= 3) {
    pass("Default prompts", `${ui.defaultPrompt.length} starter prompts`);
  } else {
    fail("Default prompts", "must be an array with at most 3 entries", "Trim interface.defaultPrompt to 3 short strings.");
  }
}

function checkMcpConfig() {
  const config = readJsonCheck(path.join(pluginRoot, ".mcp.json"), "MCP config");
  if (!config) return;
  const server = config.mcpServers?.["conducty-codex"];
  if (!server) {
    fail("MCP server entry", "missing conducty-codex", "Add mcpServers.conducty-codex to .mcp.json.");
    return;
  }
  expectEqual("MCP server type", server.type, "stdio");
  expectString("MCP server command", server.command);
  if (Array.isArray(server.args) && server.args.includes("./mcp/server.mjs")) {
    pass("MCP server args", server.args.join(" "));
  } else {
    fail("MCP server args", "does not point at ./mcp/server.mjs", "Set args to [\"./mcp/server.mjs\"].");
  }
}

function checkSkill() {
  const skillPath = path.join(pluginRoot, "skills", "conducty-codex", "SKILL.md");
  if (!fs.existsSync(skillPath)) return;
  const text = fs.readFileSync(skillPath, "utf8");
  if (/^---\s*[\s\S]*?^name:\s*conducty-codex\s*$/m.test(text)) {
    pass("Skill frontmatter name", "conducty-codex");
  } else {
    fail("Skill frontmatter name", "missing conducty-codex", "Set the SKILL.md frontmatter name to conducty-codex.");
  }
  if (/^description:\s*.+/m.test(text)) {
    pass("Skill frontmatter description");
  } else {
    fail("Skill frontmatter description", "missing", "Add a trigger-focused description.");
  }
}

function checkVault() {
  const vaultPath = resolveVault();
  if (!fs.existsSync(vaultPath)) {
    if (args.fix) {
      bootstrapVault(vaultPath);
      pass("Conducty vault", `created ${vaultPath}`);
    } else {
      warn("Conducty vault", `${vaultPath} does not exist`, "Run doctor with --fix or call bootstrap_vault from the MCP server.");
      return;
    }
  } else {
    pass("Conducty vault", vaultPath);
  }

  const missing = REQUIRED_VAULT_PATHS.filter((relativePath) => !fs.existsSync(path.join(vaultPath, relativePath)));
  if (missing.length && args.fix) {
    bootstrapVault(vaultPath);
  }

  const stillMissing = REQUIRED_VAULT_PATHS.filter((relativePath) => !fs.existsSync(path.join(vaultPath, relativePath)));
  if (stillMissing.length) {
    warn("Vault skeleton", `missing ${stillMissing.join(", ")}`, "Run doctor with --fix to seed the vault skeleton.");
  } else {
    pass("Vault skeleton", "indexes, accumulators, and note directories exist");
  }
}

function checkLocalMarketplace() {
  const marketplacePath = path.join(args.home, ".agents", "plugins", "marketplace.json");
  if (!fs.existsSync(marketplacePath)) {
    warn("Local marketplace", `${marketplacePath} not found`, "Run scripts/install-codex.* to create the local marketplace entry.");
    return;
  }

  if (hasBom(marketplacePath)) {
    if (args.fix) {
      rewriteWithoutBom(marketplacePath);
      pass("Local marketplace encoding", "removed UTF-8 BOM");
    } else {
      fail("Local marketplace encoding", "UTF-8 BOM detected", "Rewrite marketplace.json as UTF-8 without BOM or run doctor with --fix.");
      return;
    }
  } else {
    pass("Local marketplace encoding", "UTF-8 without BOM");
  }

  const marketplace = readJsonCheck(marketplacePath, "Local marketplace");
  if (!marketplace) return;
  const entry = marketplace.plugins?.find((plugin) => plugin.name === "conducty-codex");
  if (!entry) {
    warn("Local marketplace entry", "conducty-codex not listed", "Run scripts/install-codex.* to add it.");
    return;
  }

  pass("Local marketplace entry", "conducty-codex listed");
  const sourcePath = path.resolve(path.dirname(path.dirname(path.dirname(marketplacePath))), entry.source?.path || "");
  if (fs.existsSync(sourcePath)) {
    pass("Local plugin source", sourcePath);
  } else {
    warn("Local plugin source", `${sourcePath} not found`, "Run scripts/install-codex.* to copy the plugin into ~/plugins/conducty-codex.");
  }
}

function checkCodexConfig() {
  const codexHome = resolveCodexHome();
  if (!codexHome) {
    warn("Codex config", "no Codex home found", "Start Codex once, or pass --codex-home.");
    return;
  }
  const configPath = path.join(codexHome, "config.toml");
  if (!fs.existsSync(configPath)) {
    warn("Codex config", `${configPath} not found`, "Start Codex once, or pass --codex-home.");
    return;
  }

  const config = fs.readFileSync(configPath, "utf8");
  const pluginId = `conducty-codex@${args.marketplace}`;
  if (config.includes(`[plugins."${pluginId}"]`) && /enabled\s*=\s*true/.test(sectionFor(config, `[plugins."${pluginId}"]`))) {
    pass("Codex plugin enabled", pluginId);
  } else {
    warn("Codex plugin enabled", `${pluginId} not enabled`, "Run scripts/install-codex.* to update config.toml.");
  }

  if (config.includes(`[marketplaces.${args.marketplace}]`)) {
    pass("Codex marketplace source", args.marketplace);
  } else {
    warn("Codex marketplace source", `${args.marketplace} missing`, "Run scripts/install-codex.* to add the marketplace source.");
  }
}

function checkSmokeTest() {
  const result = spawnSync(process.execPath, [path.join(pluginRoot, "scripts", "smoke-test.mjs")], {
    cwd: pluginRoot,
    encoding: "utf8"
  });

  if (result.status === 0) {
    pass("MCP smoke test", result.stdout.trim() || "passed");
  } else {
    fail("MCP smoke test", (result.stderr || result.stdout || "failed").trim(), "Run node scripts/smoke-test.mjs for details.");
  }
}

function readJsonCheck(filePath, title) {
  if (!fs.existsSync(filePath)) {
    fail(title, `${filePath} missing`);
    return null;
  }
  if (hasBom(filePath)) {
    fail(title, "UTF-8 BOM detected", "Rewrite JSON as UTF-8 without BOM.");
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    pass(title, "valid JSON");
    return parsed;
  } catch (error) {
    fail(title, error instanceof Error ? error.message : String(error));
    return null;
  }
}

function resolveVault() {
  if (args.vault) return path.resolve(args.vault);
  if (process.env.CONDUCTY_VAULT) return path.resolve(process.env.CONDUCTY_VAULT);
  return path.join(args.home, "Obsidian", "Conducty");
}

function resolveCodexHome() {
  if (args.codexHome) return path.resolve(args.codexHome);
  if (process.env.CODEX_HOME) return path.resolve(process.env.CODEX_HOME);
  for (const candidate of [path.join(args.home, ".codex"), path.join(args.home, ".codex_new")]) {
    if (fs.existsSync(path.join(candidate, "config.toml"))) return candidate;
  }
  return null;
}

function bootstrapVault(vaultPath) {
  for (const dir of ["", "Indexes", "Accumulators", "Plans", "Designs", "Improvements", "Code Reviews", "Ship Reports", "Kernel Contracts", "Context"]) {
    fs.mkdirSync(path.join(vaultPath, dir), { recursive: true });
  }
  seed(path.join(vaultPath, "Conducty Index.md"), [
    "---",
    "type: index",
    "tags: [conducty, conducty/index, conducty/root]",
    "---",
    "",
    "# Conducty Index",
    "",
    "- [[Plans Index]]",
    "- [[Designs Index]]",
    "- [[Context Index]]",
    "- [[Improvements Index]]",
    "- [[Ship Reports Index]]",
    "- [[Kernel Contracts Index]]",
    "- [[Failure Patterns]]",
    "- [[Metrics]]",
    "- [[Prompt Log]]",
    "- [[Token Savings Ledger]]",
    ""
  ].join("\n"));
  seed(path.join(vaultPath, "Indexes", "Plans Index.md"), indexNote("Plans Index", "Conducty plans. Newest first."));
  seed(path.join(vaultPath, "Indexes", "Designs Index.md"), indexNote("Designs Index", "Conducty design notes. Newest first."));
  seed(path.join(vaultPath, "Indexes", "Context Index.md"), indexNote("Context Index", "Per-project context summaries."));
  seed(path.join(vaultPath, "Indexes", "Improvements Index.md"), indexNote("Improvements Index", "Improvement kata entries. Newest first."));
  seed(path.join(vaultPath, "Indexes", "Ship Reports Index.md"), indexNote("Ship Reports Index", "Pre-merge ship reports. Newest first."));
  seed(path.join(vaultPath, "Indexes", "Kernel Contracts Index.md"), indexNote("Kernel Contracts Index", "Kernel state contracts. Newest first."));
  seed(path.join(vaultPath, "Accumulators", "Failure Patterns.md"), accumulatorNote("failure-patterns", "Failure Patterns", "Newest first."));
  seed(path.join(vaultPath, "Accumulators", "Prompt Log.md"), accumulatorNote("prompt-log", "Prompt Log", "Newest first."));
  seed(path.join(vaultPath, "Accumulators", "Metrics.md"), [
    "---",
    "type: metrics",
    "tags: [conducty, conducty/metrics]",
    "---",
    "",
    "# Metrics",
    "",
    "| Date | Plan | Prompts | Done | Pass Rate | Retries | Appetite | Note |",
    "|---|---|---:|---:|---:|---:|---|---|",
    ""
  ].join("\n"));
  seed(path.join(vaultPath, "Accumulators", "Token Savings Ledger.md"), [
    "---",
    "type: token-savings-ledger",
    "tags: [conducty, conducty/token-savings]",
    "---",
    "",
    "# Token Savings Ledger",
    "",
    "Measured baseline-vs-Conducty token usage. Newest first.",
    "",
    "| Date | Plan | Scenario | Baseline Tokens | Conducty Tokens | Saved Tokens | Saved % | Method | Evidence | Notes |",
    "|---|---|---|---:|---:|---:|---:|---|---|---|",
    ""
  ].join("\n"));
}

function indexNote(title, description) {
  return [
    "---",
    "type: index",
    "tags: [conducty, conducty/index]",
    "---",
    "",
    `# ${title}`,
    "",
    description,
    ""
  ].join("\n");
}

function accumulatorNote(type, title, description) {
  return [
    "---",
    `type: ${type}`,
    `tags: [conducty, conducty/${type}]`,
    "---",
    "",
    `# ${title}`,
    "",
    description,
    ""
  ].join("\n");
}

function seed(filePath, content) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, content, "utf8");
}

function hasBom(filePath) {
  const bytes = fs.readFileSync(filePath);
  return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
}

function rewriteWithoutBom(filePath) {
  const bytes = fs.readFileSync(filePath);
  const withoutBom = hasBom(filePath) ? bytes.subarray(3) : bytes;
  fs.writeFileSync(filePath, withoutBom);
}

function expectEqual(title, actual, expected) {
  if (actual === expected) pass(title, String(actual));
  else fail(title, `expected ${expected}, got ${actual}`);
}

function expectString(title, actual) {
  if (typeof actual === "string" && actual.trim()) pass(title, actual.trim());
  else fail(title, "missing or empty");
}

function expectPath(title, relativePath) {
  if (typeof relativePath !== "string" || !relativePath.trim()) {
    fail(title, "missing");
    return;
  }
  const fullPath = path.resolve(pluginRoot, relativePath);
  if (fs.existsSync(fullPath)) pass(title, relativePath);
  else fail(title, `${relativePath} missing`);
}

function sectionFor(text, header) {
  const start = text.indexOf(header);
  if (start === -1) return "";
  const next = text.indexOf("\n[", start + header.length);
  return text.slice(start, next === -1 ? text.length : next);
}

function pass(title, detail = "") {
  results.push({ status: "pass", title, detail });
}

function warn(title, detail, fix = "") {
  results.push({ status: "warn", title, detail, fix });
}

function fail(title, detail, fix = "") {
  results.push({ status: "fail", title, detail, fix });
}

function printResults() {
  if (args.json) {
    console.log(JSON.stringify({ results, summary: summarizeResults() }, null, 2));
    return;
  }

  console.log("Conducty Codex Doctor\n");
  for (const result of results) {
    const label = result.status.toUpperCase().padEnd(4);
    console.log(`${label} ${result.title}${result.detail ? ` - ${result.detail}` : ""}`);
    if (result.fix) console.log(`     fix: ${result.fix}`);
  }
  const summary = summarizeResults();
  console.log(`\nSummary: ${summary.pass} passed, ${summary.warn} warnings, ${summary.fail} failed`);
}

function summarizeResults() {
  return {
    pass: results.filter((result) => result.status === "pass").length,
    warn: results.filter((result) => result.status === "warn").length,
    fail: results.filter((result) => result.status === "fail").length
  };
}

function requireValue(argv, index, flag) {
  if (index >= argv.length || argv[index].startsWith("--")) failFast(`${flag} requires a value`);
  return argv[index];
}

function failFast(message) {
  console.error(message);
  process.exit(2);
}
