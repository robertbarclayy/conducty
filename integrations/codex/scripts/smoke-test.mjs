#!/usr/bin/env node
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
const tempVault = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-codex-"));

const child = spawn(process.execPath, [serverPath], {
  cwd: pluginRoot,
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, CONDUCTY_VAULT: tempVault }
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
  drainOutput();
});

function drainOutput() {
  let newlineIndex;
  while ((newlineIndex = outputBuffer.indexOf("\n")) !== -1) {
    const line = outputBuffer.slice(0, newlineIndex);
    outputBuffer = outputBuffer.slice(newlineIndex + 1);
    if (line.length === 0) continue;

    const message = JSON.parse(line);
    const waiter = pending.get(message.id);
    if (waiter) {
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
    }
  }
}

function writeMessage(message) {
  child.stdin.write(JSON.stringify(message) + "\n");
}

function request(method, params = {}) {
  const id = nextId++;
  writeMessage({ jsonrpc: "2.0", id, method, params });
  return waitFor(id, method);
}

function waitFor(id, label) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${label}`));
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

function extractWikilink(text, label) {
  const match = /\[\[([^\]]+)\]\]/.exec(text);
  if (!match) throw new Error(`${label} did not include a wikilink: ${text}`);
  return match[1];
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

  const collisionPlanA = await request("tools/call", {
    name: "create_plan",
    arguments: {
      vault: tempVault,
      topic: "Collision Test",
      goal: "Verify duplicate plan names are not overwritten."
    }
  });
  const collisionPlanB = await request("tools/call", {
    name: "create_plan",
    arguments: {
      vault: tempVault,
      topic: "Collision Test",
      goal: "Verify duplicate plan names are not overwritten."
    }
  });
  const collisionPlanLinkA = extractWikilink(collisionPlanA.content?.[0]?.text || "", "first collision plan");
  const collisionPlanLinkB = extractWikilink(collisionPlanB.content?.[0]?.text || "", "second collision plan");
  if (collisionPlanLinkA === collisionPlanLinkB) {
    throw new Error(`create_plan reused a note name: ${collisionPlanLinkA}`);
  }

  const collisionImprovementA = await request("tools/call", {
    name: "record_improvement",
    arguments: {
      vault: tempVault,
      target: "Avoid improvement filename collisions",
      actual: "First duplicate-minute improvement",
      learned: "Unique names preserve both notes",
      nextExperiment: "Write another improvement immediately"
    }
  });
  const collisionImprovementB = await request("tools/call", {
    name: "record_improvement",
    arguments: {
      vault: tempVault,
      target: "Avoid improvement filename collisions",
      actual: "Second duplicate-minute improvement",
      learned: "Unique names preserve both notes",
      nextExperiment: "Keep the suffix stable"
    }
  });
  const collisionImprovementLinkA = extractWikilink(collisionImprovementA.content?.[0]?.text || "", "first collision improvement");
  const collisionImprovementLinkB = extractWikilink(collisionImprovementB.content?.[0]?.text || "", "second collision improvement");
  if (collisionImprovementLinkA === collisionImprovementLinkB) {
    throw new Error(`record_improvement reused a note name: ${collisionImprovementLinkA}`);
  }

  const collisionShipA = await request("tools/call", {
    name: "create_ship_report",
    arguments: {
      vault: tempVault,
      plan: plans[0],
      topic: "Collision Ship",
      verdict: "green"
    }
  });
  const collisionShipB = await request("tools/call", {
    name: "create_ship_report",
    arguments: {
      vault: tempVault,
      plan: plans[0],
      topic: "Collision Ship",
      verdict: "green"
    }
  });
  const collisionShipLinkA = extractWikilink(collisionShipA.content?.[0]?.text || "", "first collision ship report");
  const collisionShipLinkB = extractWikilink(collisionShipB.content?.[0]?.text || "", "second collision ship report");
  if (collisionShipLinkA === collisionShipLinkB) {
    throw new Error(`create_ship_report reused a note name: ${collisionShipLinkA}`);
  }

  const cappedAudit = await request("tools/call", {
    name: "audit_vault_graph",
    arguments: {
      vault: tempVault,
      maxNotes: 1
    }
  });
  const cappedAuditText = cappedAudit.content?.[0]?.text || "";
  if (!cappedAuditText.includes("Scan limit reached: yes")) {
    throw new Error(`audit_vault_graph did not report maxNotes truncation:\n${cappedAuditText}`);
  }

  fs.mkdirSync(path.join(tempVault, "Context"), { recursive: true });
  fs.writeFileSync(path.join(tempVault, "Context", "Large Note.md"), "x".repeat(2048), "utf8");
  const largeNoteAudit = await request("tools/call", {
    name: "audit_vault_graph",
    arguments: {
      vault: tempVault,
      maxBytesPerNote: 1024
    }
  });
  const largeNoteAuditText = largeNoteAudit.content?.[0]?.text || "";
  const largeSkippedMatch = /Large notes skipped: (\d+)/.exec(largeNoteAuditText);
  if (!largeSkippedMatch || Number(largeSkippedMatch[1]) < 1) {
    throw new Error(`audit_vault_graph did not report large-note skipping:\n${largeNoteAuditText}`);
  }

  // Coalesced-write regression: send two requests in a single stdin.write, prove the
  // line-splitter handles them as separate messages and matches responses by id, in
  // the order they were issued.
  const coalescedOrder = [];
  const onCoalescedData = (chunk) => {
    const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
    for (const line of text.split("\n")) {
      if (!line.length) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed && typeof parsed === "object" && "id" in parsed) {
          coalescedOrder.push(parsed.id);
        }
      } catch {
        // ignore — main drainOutput owns parse-error reporting
      }
    }
  };
  child.stdout.on("data", onCoalescedData);

  const idA = nextId++;
  const idB = nextId++;
  const reqA = { jsonrpc: "2.0", id: idA, method: "ping", params: {} };
  const reqB = { jsonrpc: "2.0", id: idB, method: "ping", params: {} };
  const promiseA = waitFor(idA, "ping#A");
  const promiseB = waitFor(idB, "ping#B");
  child.stdin.write(JSON.stringify(reqA) + "\n" + JSON.stringify(reqB) + "\n");
  await Promise.all([promiseA, promiseB]);
  child.stdout.off("data", onCoalescedData);

  const observed = coalescedOrder.filter((id) => id === idA || id === idB);
  if (observed.length !== 2 || observed[0] !== idA || observed[1] !== idB) {
    throw new Error(`Coalesced write: expected response order [${idA}, ${idB}], got [${observed.join(", ")}]`);
  }

  console.log("conducty-codex MCP smoke test passed");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  if (stderr.trim()) console.error(stderr.trim());
  process.exitCode = 1;
} finally {
  child.kill();
  try {
    await once(child, "exit");
  } catch {
    // ignore — we just want the handles released
  }
  fs.rmSync(tempVault, { recursive: true, force: true });
}
