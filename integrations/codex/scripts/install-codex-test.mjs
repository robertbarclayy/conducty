#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");
const installer = path.join(pluginRoot, "scripts", "install-codex.mjs");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-codex-install-test-"));
const home = path.join(tempRoot, "home");
const codexHome = path.join(home, ".codex_new");
const vault = path.join(home, "Obsidian", "Conducty");
const configPath = path.join(codexHome, "config.toml");

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function runInstaller(extraArgs = []) {
  const result = spawnSync(process.execPath, [
    installer,
    "--home", home,
    "--codex-home", codexHome,
    "--vault", vault,
    ...extraArgs
  ], {
    cwd: pluginRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error([
      `installer exited ${result.status}`,
      result.stdout.trim(),
      result.stderr.trim()
    ].filter(Boolean).join("\n"));
  }
}

function countOccurrences(text, pattern) {
  return text.split(pattern).length - 1;
}

try {
  fs.mkdirSync(codexHome, { recursive: true });
  fs.writeFileSync(configPath, [
    '[plugins."other@aura-local"]',
    "enabled = false",
    "",
    "[tools]",
    'mode = "keep"',
    ""
  ].join("\n"), "utf8");

  runInstaller();
  runInstaller(["--skip-doctor"]);

  const config = fs.readFileSync(configPath, "utf8");
  assert(config.includes('[plugins."other@aura-local"]'), "existing plugin table preserved");
  assert(config.includes("[tools]"), "following TOML table preserved");
  assert(config.includes('mode = "keep"'), "following TOML table body preserved");
  assert(config.includes('[plugins."conducty-codex@aura-local"]'), "conducty plugin table written");
  assert(config.includes("[marketplaces.aura-local]"), "marketplace table written");
  assert(
    countOccurrences(config, '[plugins."conducty-codex@aura-local"]') === 1,
    "conducty plugin table remains idempotent"
  );
  assert(
    countOccurrences(config, "[marketplaces.aura-local]") === 1,
    "marketplace table remains idempotent"
  );

  console.log("conducty-codex installer test passed");
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
