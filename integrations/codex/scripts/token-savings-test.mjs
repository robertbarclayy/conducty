#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");
const serverPath = path.join(pluginRoot, "mcp", "server.mjs");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-token-savings-test-"));
const repoRoot = path.join(tempRoot, "fixture-repo");
const vault = path.join(tempRoot, "vault");

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function writeFile(relativePath, content) {
  const filePath = path.join(repoRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function repeatLines(prefix, count) {
  return Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}: product state, UI copy, generated fixture detail, and irrelevant implementation context.`).join("\n");
}

function buildFixtureRepo() {
  writeFile("README.md", [
    "# Fixture Commerce App",
    "",
    "Synthetic full-stack app used to prove Conducty token-savings measurement.",
    repeatLines("README context", 120)
  ].join("\n"));
  writeFile("pubspec.yaml", [
    "name: fixture_commerce_app",
    "dependencies:",
    "  flutter:",
    "    sdk: flutter",
    "  flutter_bloc: ^8.1.3",
    ""
  ].join("\n"));
  writeFile("server/package.json", JSON.stringify({
    name: "fixture-server",
    version: "1.0.0",
    scripts: {
      check: "node --check routes/auth.js"
    },
    dependencies: {
      express: "^4.18.2",
      jsonwebtoken: "^9.0.2"
    }
  }, null, 2));
  writeFile("server/routes/auth.js", [
    'const jwt = require("jsonwebtoken");',
    'const auth = require("../middlewares/auth");',
    "",
    "function signUser(user) {",
    '  return jwt.sign({ id: user.id }, "passwordKey");',
    "}",
    "",
    "function isTokenValid(token) {",
    '  return Boolean(jwt.verify(token, "passwordKey"));',
    "}",
    "",
    "module.exports = { signUser, isTokenValid, auth };",
    ""
  ].join("\n"));
  writeFile("server/middlewares/auth.js", [
    'const jwt = require("jsonwebtoken");',
    "",
    "function auth(req, res, next) {",
    '  const token = req.header("x-auth-token");',
    '  req.user = jwt.verify(token, "passwordKey").id;',
    "  next();",
    "}",
    "",
    "module.exports = auth;",
    ""
  ].join("\n"));
  writeFile("server/middlewares/admin.js", [
    'const jwt = require("jsonwebtoken");',
    'const User = require("../model/user");',
    "",
    "async function admin(req, res, next) {",
    '  const token = req.header("x-auth-token");',
    '  const decoded = jwt.verify(token, "passwordKey");',
    "  const user = await User.findById(decoded.id);",
    '  if (user.type !== "admin") return res.status(401).json({ msg: "not admin" });',
    "  next();",
    "}",
    "",
    "module.exports = admin;",
    ""
  ].join("\n"));
  writeFile("server/model/user.js", [
    "module.exports = {",
    "  findById(id) {",
    '    return Promise.resolve({ id, type: "admin" });',
    "  }",
    "};",
    ""
  ].join("\n"));
  writeFile("server/config/auth.js", [
    'const jwtSecret = process.env.JWT_SECRET || "passwordKey";',
    "module.exports = { jwtSecret };",
    ""
  ].join("\n"));
  writeFile("server/scripts/auth-config-test.js", [
    'const assert = require("node:assert");',
    'const { jwtSecret } = require("../config/auth");',
    'assert.strictEqual(typeof jwtSecret, "string");',
    'console.log("auth config fixture test passed");',
    ""
  ].join("\n"));

  for (let feature = 1; feature <= 48; feature += 1) {
    writeFile(`lib/src/features/feature_${feature}/screen.dart`, [
      `class Feature${feature}Screen {`,
      `  final title = 'Feature ${feature}';`,
      repeatLines(`feature ${feature} screen`, 90),
      "}",
      ""
    ].join("\n"));
    writeFile(`lib/src/features/feature_${feature}/bloc.dart`, [
      `class Feature${feature}Bloc {`,
      repeatLines(`feature ${feature} bloc`, 80),
      "}",
      ""
    ].join("\n"));
    writeFile(`lib/src/features/feature_${feature}/repository.dart`, [
      `class Feature${feature}Repository {`,
      repeatLines(`feature ${feature} repository`, 80),
      "}",
      ""
    ].join("\n"));
  }
}

function listReadableFiles(root) {
  const textExt = new Set([".dart", ".js", ".json", ".yaml", ".yml", ".md"]);
  const excluded = new Set([".git", "build", ".dart_tool", "node_modules"]);
  const files = [];

  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") && entry.name !== ".metadata") continue;
      if (excluded.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && textExt.has(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  visit(root);
  return files.sort((a, b) => a.localeCompare(b));
}

function measureApproxTokens(files) {
  let chars = 0;
  for (const file of files) {
    chars += fs.readFileSync(file, "utf8").length;
  }
  return {
    files: files.length,
    chars,
    tokens: Math.ceil(chars / 4)
  };
}

function makeClient(env = {}) {
  const child = spawn(process.execPath, [serverPath], {
    cwd: pluginRoot,
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, ...env }
  });

  let nextId = 1;
  let outputBuffer = "";
  let stderr = "";
  const pending = new Map();

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString("utf8");
  });

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    outputBuffer += chunk;
    let newlineIndex;
    while ((newlineIndex = outputBuffer.indexOf("\n")) !== -1) {
      const line = outputBuffer.slice(0, newlineIndex);
      outputBuffer = outputBuffer.slice(newlineIndex + 1);
      if (!line) continue;
      const message = JSON.parse(line);
      if (message.id != null && pending.has(message.id)) {
        const waiter = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) waiter.reject(new Error(message.error.message));
        else waiter.resolve(message.result);
      }
    }
  });

  function writeMessage(message) {
    child.stdin.write(JSON.stringify(message) + "\n");
  }

  function request(method, params = {}) {
    const id = nextId;
    nextId += 1;
    writeMessage({ jsonrpc: "2.0", id, method, params });
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timed out waiting for ${method}`));
      }, 5000);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });
    });
  }

  async function close() {
    child.kill();
    try {
      await once(child, "exit");
    } catch {
      // ignore
    }
  }

  return { request, writeMessage, close, getStderr: () => stderr };
}

function extractWikilink(text) {
  const match = /\[\[([^\]]+)\]\]/.exec(text);
  if (!match) throw new Error(`Expected wikilink in text:\n${text}`);
  return match[1];
}

try {
  buildFixtureRepo();

  const allFiles = listReadableFiles(repoRoot);
  const focusedFiles = [
    "server/package.json",
    "server/routes/auth.js",
    "server/middlewares/auth.js",
    "server/middlewares/admin.js",
    "server/model/user.js",
    "server/config/auth.js",
    "server/scripts/auth-config-test.js"
  ].map((relativePath) => path.join(repoRoot, relativePath));

  for (const file of focusedFiles.filter((focusedFile) => focusedFile.endsWith(".js"))) {
    const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (check.status !== 0) {
      throw new Error([`Syntax check failed for ${file}`, check.stdout, check.stderr].filter(Boolean).join("\n"));
    }
  }

  const baseline = measureApproxTokens(allFiles);
  const focused = measureApproxTokens(focusedFiles);
  const savedTokens = baseline.tokens - focused.tokens;
  const savedPercent = (savedTokens / baseline.tokens) * 100;

  assert(baseline.files >= 150, `expected broad fixture repo, got ${baseline.files} readable files`);
  assert(focused.files === 7, `expected 7 focused files, got ${focused.files}`);
  assert(savedPercent >= 95, `expected at least 95% context savings, got ${savedPercent.toFixed(1)}%`);

  const client = makeClient({ CONDUCTY_VAULT: vault });
  try {
    const init = await client.request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "conducty-token-savings-test", version: "0.1.0" }
    });
    assert(init.serverInfo?.name === "conducty-codex", "initialize returned wrong server name");
    client.writeMessage({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });

    await client.request("tools/call", {
      name: "bootstrap_vault",
      arguments: { vault }
    });

    const plan = await client.request("tools/call", {
      name: "create_plan",
      arguments: {
        vault,
        topic: "JWT Secret Context Savings",
        goal: "Move repeated JWT secret use into an env-backed auth config.",
        appetite: "20m",
        acceptanceCriteria: [
          "JWT sign and verify call sites use one config value",
          "Existing fallback behavior remains compatible",
          "Focused backend syntax checks pass"
        ],
        noGoZones: ["No database connection", "No framework rewrite", "No Flutter runtime required"],
        verification: "node --check focused backend auth files"
      }
    });
    const planLink = extractWikilink(plan.content?.[0]?.text || "");

    const savings = await client.request("tools/call", {
      name: "record_token_savings",
      arguments: {
        vault,
        plan: planLink,
        scenario: "Synthetic full-stack JWT secret backend fix",
        baselineTokens: baseline.tokens,
        conductyTokens: focused.tokens,
        method: "Approx tokens = readable fixture text characters / 4. Baseline scanned all readable project files; Conducty focused context used only task-relevant backend auth/config/test files.",
        evidence: [
          `baseline files=${baseline.files}`,
          `focused files=${focused.files}`,
          `baseline tokens=${baseline.tokens}`,
          `focused tokens=${focused.tokens}`,
          "focused backend syntax checks passed"
        ],
        notes: "Deterministic offline regression test for task-context measurement, not a universal savings guarantee."
      }
    });
    const savingsText = savings.content?.[0]?.text || "";
    assert(savingsText.includes("Token Savings Recorded"), "record_token_savings did not report success");
    assert(savingsText.includes(`Tokens saved: ${savedTokens}`), "record_token_savings reported unexpected saved token count");
    assert(savingsText.includes(`Savings rate: ${savedPercent.toFixed(1)}%`), "record_token_savings reported unexpected savings rate");

    const ledger = fs.readFileSync(path.join(vault, "Accumulators", "Token Savings Ledger.md"), "utf8");
    assert(ledger.includes("Synthetic full-stack JWT secret backend fix"), "ledger missing savings scenario");
    assert(ledger.includes(`| ${baseline.tokens} | ${focused.tokens} | ${savedTokens} | ${savedPercent.toFixed(1)}% |`), "ledger missing computed savings row");

    const report = await client.request("tools/call", {
      name: "generate_observatory_report",
      arguments: {
        vault,
        output: "Observatory.html",
        limit: 5
      }
    });
    const reportText = report.content?.[0]?.text || "";
    assert(reportText.includes("Token savings entries: 1"), `Observatory summary did not include token savings entry:\n${reportText}\n\nLedger:\n${ledger}`);
    assert(reportText.includes(`Measured tokens saved: ${savedTokens}`), `Observatory summary did not include measured token savings:\n${reportText}`);
    assert(reportText.includes(`Measured savings rate: ${savedPercent.toFixed(1)}%`), `Observatory summary did not include measured savings rate:\n${reportText}`);

    const html = fs.readFileSync(path.join(vault, "Observatory.html"), "utf8");
    assert(html.includes("Measured tokens saved"), "Observatory HTML missing token savings label");
    assert(html.includes(savedTokens.toLocaleString("en-US")), "Observatory HTML missing formatted saved token count");
  } finally {
    await client.close();
  }

  console.log([
    "conducty-codex token savings test passed",
    `baseline=${baseline.tokens} tokens across ${baseline.files} files`,
    `focused=${focused.tokens} tokens across ${focused.files} files`,
    `saved=${savedTokens} tokens (${savedPercent.toFixed(1)}%)`
  ].join("\n"));
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
