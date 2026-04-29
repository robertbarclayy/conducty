#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");
const serverPath = path.join(pluginRoot, "mcp", "server.mjs");
const tempVault = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-codex-"));

const child = spawn(process.execPath, [serverPath], {
  cwd: pluginRoot,
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, CONDUCTY_VAULT: tempVault }
});

let nextId = 1;
let outputBuffer = Buffer.alloc(0);
let stderr = "";
const pending = new Map();

child.stderr.on("data", (chunk) => {
  stderr += chunk.toString("utf8");
});

child.stdout.on("data", (chunk) => {
  outputBuffer = Buffer.concat([outputBuffer, chunk]);
  drainOutput();
});

function drainOutput() {
  while (outputBuffer.length > 0) {
    const headerEnd = outputBuffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) return;

    const header = outputBuffer.slice(0, headerEnd).toString("utf8");
    const lengthMatch = /Content-Length:\s*(\d+)/i.exec(header);
    if (!lengthMatch) throw new Error(`Missing Content-Length: ${header}`);

    const length = Number(lengthMatch[1]);
    const bodyStart = headerEnd + 4;
    const bodyEnd = bodyStart + length;
    if (outputBuffer.length < bodyEnd) return;

    const body = outputBuffer.slice(bodyStart, bodyEnd).toString("utf8");
    outputBuffer = outputBuffer.slice(bodyEnd);
    const message = JSON.parse(body);
    const waiter = pending.get(message.id);
    if (waiter) {
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
    }
  }
}

function writeMessage(message) {
  const json = JSON.stringify(message);
  child.stdin.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`);
}

function request(method, params = {}) {
  const id = nextId++;
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

try {
  const init = await request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "conducty-codex-smoke-test", version: "0.1.0" }
  });

  if (init.serverInfo?.name !== "conducty-codex") {
    throw new Error("initialize returned wrong server name");
  }

  writeMessage({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });

  const tools = await request("tools/list");
  const toolNames = new Set(tools.tools.map((tool) => tool.name));
  for (const required of ["bootstrap_vault", "create_plan", "check_prompt_smells", "log_prompt_outcome", "record_checkpoint", "record_improvement", "create_ship_report", "audit_vault_graph"]) {
    if (!toolNames.has(required)) throw new Error(`Missing tool: ${required}`);
  }

  await request("tools/call", {
    name: "bootstrap_vault",
    arguments: { vault: tempVault }
  });

  if (!fs.existsSync(path.join(tempVault, "Conducty Index.md"))) {
    throw new Error("bootstrap_vault did not create Conducty Index.md");
  }

  const plan = await request("tools/call", {
    name: "create_plan",
    arguments: {
      vault: tempVault,
      topic: "Smoke Test",
      goal: "Verify Conducty Codex MCP server writes a plan.",
      appetite: "20m",
      acceptanceCriteria: ["Plan note exists", "Plans Index links it"],
      noGoZones: ["No global config changes"],
      verification: "node scripts/smoke-test.mjs"
    }
  });

  const planText = plan.content?.[0]?.text || "";
  if (!planText.includes("Conducty Plan Created")) {
    throw new Error("create_plan did not report success");
  }

  const plans = fs.readdirSync(path.join(tempVault, "Plans")).filter((file) => file.endsWith(".md"));
  if (plans.length !== 1) {
    throw new Error("create_plan did not create exactly one plan");
  }

  const earlyAudit = await request("tools/call", {
    name: "audit_vault_graph",
    arguments: {
      vault: tempVault,
      limit: 5
    }
  });
  const earlyAuditText = earlyAudit.content?.[0]?.text || "";
  if (
    !earlyAuditText.includes("Verdict: needs attention") ||
    !earlyAuditText.includes("Plans without ship reports: 1") ||
    !earlyAuditText.includes("Plans without checkpoints: 1")
  ) {
    throw new Error(`audit_vault_graph did not catch open plan closure gaps:\n${earlyAuditText}`);
  }

  const smells = await request("tools/call", {
    name: "check_prompt_smells",
    arguments: { prompt: "Make it better and also clean up stuff" }
  });
  const smellText = smells.content?.[0]?.text || "";
  if (!smellText.includes("fix before execution")) {
    throw new Error("check_prompt_smells missed obvious smells");
  }

  await request("tools/call", {
    name: "log_prompt_outcome",
    arguments: {
      vault: tempVault,
      plan: plans[0],
      promptId: "P1",
      status: "DONE",
      evidence: "smoke test evidence",
      attempts: 1,
      budget: "20m",
      elapsed: "1m",
      review: "verify-only"
    }
  });

  await request("tools/call", {
    name: "record_checkpoint",
    arguments: {
      vault: tempVault,
      plan: plans[0],
      group: "A",
      completed: 1,
      total: 1,
      firstAttemptPassRate: 100,
      retries: 0,
      blocked: 0,
      verdict: "proceed"
    }
  });

  const planAfterCheckpoint = fs.readFileSync(path.join(tempVault, "Plans", plans[0]), "utf8");
  const checkpointIndex = planAfterCheckpoint.indexOf("### Group A Checkpoint");
  const hillChartIndex = planAfterCheckpoint.indexOf("## Hill Chart");
  if (checkpointIndex === -1 || hillChartIndex === -1 || checkpointIndex > hillChartIndex) {
    throw new Error("record_checkpoint did not append inside Checkpoint Notes");
  }

  await request("tools/call", {
    name: "record_improvement",
    arguments: {
      vault: tempVault,
      plan: plans[0],
      target: "Exercise MCP flow",
      actual: "Flow passed",
      learned: "Server can write vault notes",
      nextExperiment: "Use it on a real plan"
    }
  });

  const ship = await request("tools/call", {
    name: "create_ship_report",
    arguments: {
      vault: tempVault,
      plan: plans[0],
      verdict: "green",
      summary: "Smoke test completed the Conducty Codex loop.",
      verification: ["node scripts/smoke-test.mjs"],
      evidence: ["MCP tools created plan, checkpoint, improvement, and ship report notes"],
      changedFiles: ["integrations/codex/mcp/server.mjs"],
      nextSteps: ["Use the integration on a real branch"]
    }
  });
  const shipText = ship.content?.[0]?.text || "";
  if (!shipText.includes("Ship Report Created")) {
    throw new Error("create_ship_report did not report success");
  }

  const shipReports = fs.readdirSync(path.join(tempVault, "Ship Reports")).filter((file) => file.endsWith(".md"));
  if (shipReports.length !== 1) {
    throw new Error("create_ship_report did not create exactly one ship report");
  }
  const shipIndex = fs.readFileSync(path.join(tempVault, "Indexes", "Ship Reports Index.md"), "utf8");
  if (!shipIndex.includes(path.basename(shipReports[0], ".md"))) {
    throw new Error("create_ship_report did not update Ship Reports Index");
  }

  const audit = await request("tools/call", {
    name: "audit_vault_graph",
    arguments: {
      vault: tempVault,
      limit: 5
    }
  });
  const auditText = audit.content?.[0]?.text || "";
  if (!auditText.includes("Verdict: clean")) {
    throw new Error(`audit_vault_graph expected a clean vault, got:\n${auditText}`);
  }

  child.kill();
  fs.rmSync(tempVault, { recursive: true, force: true });
  console.log("conducty-codex MCP smoke test passed");
} catch (error) {
  child.kill();
  fs.rmSync(tempVault, { recursive: true, force: true });
  console.error(error instanceof Error ? error.message : String(error));
  if (stderr.trim()) console.error(stderr.trim());
  process.exitCode = 1;
}
