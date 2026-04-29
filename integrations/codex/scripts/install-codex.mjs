#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");
const pluginName = "conducty-codex";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const major = Number(process.versions.node.split(".")[0]);
if (major < 18) {
  console.error(`Node 18 or newer is required. Found ${process.version}.`);
  process.exit(1);
}

const home = path.resolve(args.home || os.homedir());
const codexHome = path.resolve(args.codexHome || process.env.CODEX_HOME || defaultCodexHome(home));
const marketplaceName = args.marketplace || "aura-local";
const pluginDestination = path.join(home, "plugins", pluginName);
const marketplacePath = path.join(home, ".agents", "plugins", "marketplace.json");
const vaultPath = path.resolve(args.vault || process.env.CONDUCTY_VAULT || path.join(home, "Obsidian", "Conducty"));

log(`Source: ${pluginRoot}`);
log(`Plugin destination: ${pluginDestination}`);
log(`Marketplace: ${marketplacePath}`);
log(`Codex home: ${codexHome}`);
log(`Vault: ${vaultPath}`);

if (args.dryRun) {
  log("Dry run complete; no files written.");
  process.exit(0);
}

copyPlugin(pluginRoot, pluginDestination);
updateMarketplace(marketplacePath, marketplaceName);
updateCodexConfig(path.join(codexHome, "config.toml"), marketplaceName, home);

if (!args.skipDoctor) {
  const doctorArgs = [
    path.join(pluginDestination, "scripts", "doctor.mjs"),
    "--vault", vaultPath,
    "--codex-home", codexHome,
    "--marketplace", marketplaceName,
    "--home", home,
    "--fix"
  ];
  const result = spawnSync(process.execPath, doctorArgs, {
    cwd: pluginDestination,
    stdio: "inherit"
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

log("Conducty Codex install complete.");
log("Restart Codex Desktop or the Codex CLI session so the plugin catalog is refreshed.");

function parseArgs(argv) {
  const parsed = {
    home: "",
    codexHome: "",
    vault: "",
    marketplace: "aura-local",
    dryRun: false,
    skipDoctor: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--home") parsed.home = requireValue(argv, ++i, arg);
    else if (arg === "--codex-home") parsed.codexHome = requireValue(argv, ++i, arg);
    else if (arg === "--vault") parsed.vault = requireValue(argv, ++i, arg);
    else if (arg === "--marketplace") parsed.marketplace = requireValue(argv, ++i, arg);
    else if (arg === "--dry-run") parsed.dryRun = true;
    else if (arg === "--skip-doctor") parsed.skipDoctor = true;
    else if (arg === "--help" || arg === "-h") parsed.help = true;
    else failFast(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Install Conducty Codex

Usage:
  node scripts/install-codex.mjs [options]

Options:
  --home <path>        Home directory for ~/.agents and ~/plugins.
  --codex-home <path>  Codex home containing config.toml.
  --vault <path>       Conducty vault to bootstrap/check.
  --marketplace <id>   Marketplace id. Defaults to aura-local.
  --dry-run            Print paths without writing.
  --skip-doctor        Do not run doctor after install.
`);
}

function defaultCodexHome(home) {
  const codex = path.join(home, ".codex");
  const codexNew = path.join(home, ".codex_new");
  if (fs.existsSync(path.join(codexNew, "config.toml")) && !fs.existsSync(path.join(codex, "config.toml"))) {
    return codexNew;
  }
  return codex;
}

function copyPlugin(source, destination) {
  if (path.resolve(source) === path.resolve(destination)) {
    log("Source already matches destination; skipping copy.");
    return;
  }

  const expectedParent = path.join(home, "plugins");
  if (path.resolve(destination) !== path.resolve(path.join(expectedParent, pluginName))) {
    throw new Error(`Refusing to copy outside expected plugin destination: ${destination}`);
  }

  if (fs.existsSync(destination)) {
    const existingManifest = path.join(destination, ".codex-plugin", "plugin.json");
    const existingName = fs.existsSync(existingManifest)
      ? JSON.parse(stripBom(fs.readFileSync(existingManifest, "utf8"))).name
      : "";
    if (existingName !== pluginName) {
      throw new Error(`Refusing to overwrite non-${pluginName} directory: ${destination}`);
    }
    fs.rmSync(destination, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  copyDir(source, destination);
  log("Plugin files copied.");
}

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function updateMarketplace(filePath, name) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const marketplace = fs.existsSync(filePath)
    ? JSON.parse(stripBom(fs.readFileSync(filePath, "utf8")))
    : { name, interface: { displayName: "Aura Local Plugins" }, plugins: [] };

  marketplace.name = marketplace.name || name;
  marketplace.interface = marketplace.interface || { displayName: "Aura Local Plugins" };
  marketplace.plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];

  const entry = {
    name: pluginName,
    source: { source: "local", path: `./plugins/${pluginName}` },
    policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
    category: "Productivity"
  };

  const index = marketplace.plugins.findIndex((plugin) => plugin.name === pluginName);
  if (index === -1) marketplace.plugins.push(entry);
  else marketplace.plugins[index] = entry;

  writeJsonNoBom(filePath, marketplace);
  log("Local marketplace updated.");
}

function updateCodexConfig(filePath, marketplace, marketplaceRoot) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let config = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const pluginHeader = `[plugins."${pluginName}@${marketplace}"]`;
  config = upsertTomlTable(config, pluginHeader, "enabled = true\n");

  const sourcePath = process.platform === "win32"
    ? `\\\\?\\${path.resolve(marketplaceRoot)}`
    : path.resolve(marketplaceRoot);
  const marketplaceHeader = `[marketplaces.${marketplace}]`;
  const marketplaceBody = [
    `last_updated = "${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}"`,
    'source_type = "local"',
    `source = '${sourcePath.replace(/'/g, "''")}'`,
    ""
  ].join("\n");
  config = upsertTomlTable(config, marketplaceHeader, marketplaceBody);

  fs.writeFileSync(filePath, config.trimEnd() + "\n", "utf8");
  log("Codex config updated.");
}

function upsertTomlTable(config, header, body) {
  const block = `${header}\n${body.trimEnd()}\n`;
  const escaped = escapeRegExp(header);
  const pattern = new RegExp(`${escaped}\\n[\\s\\S]*?(?=\\n\\[|$)`);
  if (pattern.test(config)) {
    return config.replace(pattern, block.trimEnd());
  }
  return `${config.trimEnd()}\n\n${block}`;
}

function writeJsonNoBom(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function stripBom(value) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function requireValue(argv, index, flag) {
  if (index >= argv.length || argv[index].startsWith("--")) failFast(`${flag} requires a value`);
  return argv[index];
}

function failFast(message) {
  console.error(message);
  process.exit(2);
}

function log(message) {
  console.log(`[conducty-codex] ${message}`);
}
