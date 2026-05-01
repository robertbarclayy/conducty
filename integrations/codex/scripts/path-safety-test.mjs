#!/usr/bin/env node
// path-safety-test.mjs — H2 regression tests for symlink/realpath escape.
//
// === Pre-fix failure note (for future maintainers) ===
//
// Before this fix, `safeVaultPath` and `findPlanPath` used only
// `path.resolve` followed by a string-prefix check (`startsWith(base + sep)`).
// `path.resolve` performs purely lexical resolution — it normalizes `.`,
// `..`, and joins segments, but it never reads the filesystem. It does NOT
// follow symlinks.
//
// So if `<vault>/Plans/Plan 2099-01-01 0000 Escape.md` is a symlink whose
// target is `/tmp/<unique>/outside-target.txt` (outside the vault), then:
//
//   path.resolve(vault, "Plans/Plan 2099-... .md")
//     === "<vault>/Plans/Plan 2099-... .md"
//
// — which trivially starts with `<vault>` and passes the old containment
// check. The subsequent `fs.writeFileSync` / `appendFileSync` then dereferences
// the symlink at the OS level and writes to `/tmp/<unique>/outside-target.txt`.
// That's the symlink-escape vulnerability (H2).
//
// The fix: `assertInsideVault` calls `fs.lstatSync` on the candidate (refusing
// it outright if it's a symlink) and `fs.realpathSync.native` on the nearest
// existing ancestor (so a candidate inside the vault that resolves through
// any symlinked ancestor outside the vault is also rejected). The vault root
// is realpathed once so that legal callers using a symlinked vault root keep
// working.
//
// This test spawns the MCP server fresh per scenario over NDJSON framing
// (one JSON message per `\n`-terminated line).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");
const serverPath = path.join(pluginRoot, "mcp", "server.mjs");

// === Tiny NDJSON RPC client wrapper around a spawned server. ===

function makeClient(env) {
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
      if (line.length === 0) continue;
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        continue;
      }
      if (message.id != null && pending.has(message.id)) {
        const waiter = pending.get(message.id);
        pending.delete(message.id);
        // Resolve with the full envelope so callers can distinguish
        // result vs error responses.
        waiter.resolve(message);
      }
    }
  });

  function send(message) {
    child.stdin.write(JSON.stringify(message) + "\n");
  }

  function request(method, params = {}) {
    const id = nextId++;
    send({ jsonrpc: "2.0", id, method, params });
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timed out waiting for ${method}`));
      }, 5000);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
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

  function notify(method, params = {}) {
    send({ jsonrpc: "2.0", method, params });
  }

  return { request, notify, close, getStderr: () => stderr };
}

async function initialize(client) {
  const init = await client.request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "conducty-codex-path-safety", version: "0.1.0" }
  });
  if (init.error) throw new Error(`initialize failed: ${init.error.message}`);
  client.notify("notifications/initialized", {});
}

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

function tryCreateSymlink(target, linkPath, type, scenario) {
  try {
    fs.symlinkSync(target, linkPath, type);
    return true;
  } catch (error) {
    if (isSymlinkPrivilegeError(error)) {
      console.log(`${scenario} skipped: symlink creation not permitted (${error.code})`);
      return false;
    }
    throw error;
  }
}

function isSymlinkPrivilegeError(error) {
  return ["EPERM", "EACCES", "ENOSYS"].includes(error?.code);
}

// === Scenario 1: preexisting symlink inside vault must NOT be written. ===

async function scenarioSymlinkReject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-h2-"));
  const vault = path.join(root, "vault");
  const outsideTarget = path.join(root, "outside-target.txt");
  fs.mkdirSync(vault, { recursive: true });

  const client = makeClient({ CONDUCTY_VAULT: vault });
  try {
    await initialize(client);
    const boot = await client.request("tools/call", {
      name: "bootstrap_vault",
      arguments: { vault }
    });
    assert(!boot.error, `bootstrap_vault errored: ${boot.error?.message}`);

    // Plant the malicious symlink. Target intentionally does NOT exist yet —
    // we want to prove the write would create it (pre-fix behavior) but the
    // post-fix server refuses.
    const symlinkPath = path.join(vault, "Plans", "Plan 2099-01-01 0000 Escape.md");
    if (!tryCreateSymlink(outsideTarget, symlinkPath, "file", "path-safety scenario 1")) return;
    assert(!fs.existsSync(outsideTarget), "precondition: outside target must not exist yet");

    // record_checkpoint walks through findPlanPath -> writeFileSync. With the
    // fix, findPlanPath returns null because the lstat detects the symlink,
    // and the handler throws "Plan not found".
    const ck = await client.request("tools/call", {
      name: "record_checkpoint",
      arguments: {
        vault,
        plan: "Plan 2099-01-01 0000 Escape",
        group: "A",
        completed: 1,
        total: 1
      }
    });
    assert(ck.error, `expected JSON-RPC error, got result: ${JSON.stringify(ck)}`);
    assert(
      /symlink|escape|not found/i.test(ck.error.message),
      `error message did not mention symlink/escape/not found: ${ck.error.message}`
    );

    // The critical assertion: the symlink target file must NOT have been
    // created. Pre-fix code would have written through the symlink and
    // created `outsideTarget` at the OS level.
    assert(
      !fs.existsSync(outsideTarget),
      `symlink target was written to ${outsideTarget} — fix did not hold`
    );

    console.log("path-safety scenario 1 passed: preexisting symlink rejected, outside target untouched");
  } finally {
    await client.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// === Scenario 2: symlinked vault root is OK — legal flow must succeed. ===

async function scenarioSymlinkedVaultRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-h2-"));
  const realVault = path.join(root, "real-vault");
  const linkedVault = path.join(root, "linked-vault");
  fs.mkdirSync(realVault, { recursive: true });
  const linkType = process.platform === "win32" ? "junction" : "dir";
  if (!tryCreateSymlink(realVault, linkedVault, linkType, "path-safety scenario 2")) {
    fs.rmSync(root, { recursive: true, force: true });
    return;
  }

  const client = makeClient({ CONDUCTY_VAULT: linkedVault });
  try {
    await initialize(client);
    const plan = await client.request("tools/call", {
      name: "create_plan",
      arguments: {
        vault: linkedVault,
        topic: "Symlinked Root",
        goal: "Verify a symlinked vault root works.",
        appetite: "10m"
      }
    });
    assert(!plan.error, `create_plan errored on symlinked root: ${plan.error?.message}`);

    // Plan must exist inside the REAL vault on disk.
    const realPlans = fs.readdirSync(path.join(realVault, "Plans")).filter((f) => f.endsWith(".md"));
    assert(realPlans.length === 1, `expected 1 plan in real vault, got ${realPlans.length}`);

    console.log("path-safety scenario 2 passed: symlinked vault root works");
  } finally {
    await client.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// === Scenario 3: traversal in topic must not write outside vault. ===

async function scenarioTraversalReject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-h2-"));
  const vault = path.join(root, "vault");
  fs.mkdirSync(vault, { recursive: true });

  const client = makeClient({ CONDUCTY_VAULT: vault });
  try {
    await initialize(client);
    const plan = await client.request("tools/call", {
      name: "create_plan",
      arguments: {
        vault,
        topic: "../../etc/passwd",
        goal: "Try to escape via topic.",
        appetite: "10m"
      }
    });

    // Either branch is acceptable per the spec:
    //   (a) call errors with /escape|invalid|path/i
    //   (b) safeTitle stripped path separators and the file lives inside Plans/
    if (plan.error) {
      assert(
        /escape|invalid|path/i.test(plan.error.message),
        `traversal error message unexpected: ${plan.error.message}`
      );
    } else {
      const plansDir = path.join(vault, "Plans");
      const planFiles = fs.readdirSync(plansDir).filter((f) => f.endsWith(".md"));
      assert(planFiles.length === 1, `expected 1 plan written to Plans/, got ${planFiles.length}`);
      const fname = planFiles[0];
      // The filename may contain the literal characters "..", but it must NOT
      // contain a path separator (which would mean safeTitle let through a
      // traversal segment). The real safety property is "no path components
      // beyond Plans/<single basename>", which we check by re-resolving and
      // confirming the file lives directly inside plansDir.
      assert(!fname.includes("/") && !fname.includes("\\"), `plan filename contains separators: ${fname}`);
      const resolvedFile = path.resolve(plansDir, fname);
      assert(
        path.dirname(resolvedFile) === path.resolve(plansDir),
        `plan file landed outside Plans/: ${resolvedFile}`
      );
    }

    // Threat-model assertions: nothing was written outside the vault tree as
    // a result of this call. The /etc/passwd assertion is documentary — we
    // never had write access there anyway, but stating it pins the intent.
    assert(
      !fs.existsSync(path.join(root, "etc")),
      `traversal created /tmp/<root>/etc tree`
    );
    // Re-check /etc/passwd is its normal state (not zeroed/touched). We
    // can't verify it wasn't touched by a different process — only that the
    // file's mtime didn't change in a way we caused. Skip strict mtime
    // comparison (flaky); just assert the OS still has /etc/passwd as a
    // regular file (i.e. we didn't corrupt it).
    if (fs.existsSync("/etc/passwd")) {
      const stat = fs.lstatSync("/etc/passwd");
      assert(stat.isFile(), "/etc/passwd is no longer a regular file");
    }

    console.log("path-safety scenario 3 passed: traversal-in-topic stayed inside vault");
  } finally {
    await client.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
}

(async () => {
  try {
    await scenarioSymlinkReject();
    await scenarioSymlinkedVaultRoot();
    await scenarioTraversalReject();
    console.log("conducty-codex MCP path-safety test passed");
  } catch (err) {
    console.error(err instanceof Error ? err.stack || err.message : String(err));
    process.exitCode = 1;
  }
})();
