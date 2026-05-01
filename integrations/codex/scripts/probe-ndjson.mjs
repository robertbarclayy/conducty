#!/usr/bin/env node
// Independent NDJSON-framing probe for the conducty-codex MCP server.
// Spawns the server, drives initialize -> tools/list -> tools/call get_cycle,
// and prints one result line per phase. Exits 0 on success, 1 on any
// unexpected response.
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
const tempVault = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-codex-probe-"));

const child = spawn(process.execPath, [serverPath], {
  cwd: pluginRoot,
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, CONDUCTY_VAULT: tempVault }
});

let nextId = 1;
let buffer = "";
let stderr = "";
const pending = new Map();

child.stderr.on("data", (chunk) => {
  stderr += chunk.toString("utf8");
});

child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 1);
    if (!line.length) continue;
    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      console.error(`probe: failed to parse line: ${line}`);
      process.exitCode = 1;
      continue;
    }
    if (message.id != null && pending.has(message.id)) {
      const waiter = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message || "rpc error"));
      else waiter.resolve(message.result);
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
      reject(new Error(`probe timeout waiting for ${method}`));
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

let exitCode = 0;
try {
  const init = await request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "conducty-codex-probe", version: "0.1.0" }
  });
  if (!init || typeof init !== "object" || !init.protocolVersion) {
    throw new Error(`initialize: unexpected result ${JSON.stringify(init)}`);
  }
  console.log(`initialize: ok protocolVersion=${init.protocolVersion}`);

  send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });

  const list = await request("tools/list");
  if (!list || !Array.isArray(list.tools)) {
    throw new Error(`tools/list: unexpected result ${JSON.stringify(list)}`);
  }
  console.log(`tools/list: ${list.tools.length} tools`);

  const cycle = await request("tools/call", {
    name: "get_cycle",
    arguments: { terse: true }
  });
  const text = cycle?.content?.[0]?.text;
  if (typeof text !== "string" || text.length === 0) {
    throw new Error(`get_cycle: unexpected result ${JSON.stringify(cycle)}`);
  }
  const snippet = text.slice(0, 80).replace(/\n/g, " ");
  console.log(`get_cycle: ${snippet}`);
} catch (error) {
  console.error(`probe error: ${error instanceof Error ? error.message : String(error)}`);
  if (stderr.trim()) console.error(stderr.trim());
  exitCode = 1;
} finally {
  child.kill();
  try {
    await once(child, "exit");
  } catch {
    // ignore
  }
  fs.rmSync(tempVault, { recursive: true, force: true });
  process.exit(exitCode);
}
