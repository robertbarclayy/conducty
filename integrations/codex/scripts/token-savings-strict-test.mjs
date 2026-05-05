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
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "conducty-token-savings-strict-test-"));
const vault = path.join(tempRoot, "vault");

const savingsRow = {
  baselineTokens: 1000000,
  conductyTokens: 123456
};
const regressionRow = {
  baselineTokens: 1000,
  conductyTokens: 1500
};
const expected = {
  entries: 2,
  baselineTokens: savingsRow.baselineTokens + regressionRow.baselineTokens,
  conductyTokens: savingsRow.conductyTokens + regressionRow.conductyTokens,
  savedTokens: (savingsRow.baselineTokens - savingsRow.conductyTokens) +
    (regressionRow.baselineTokens - regressionRow.conductyTokens),
  regressions: 1
};
expected.savingsRate = (expected.savedTokens / expected.baselineTokens) * 100;

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
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
        reject(new Error(`Timed out waiting for ${method}. stderr:\n${stderr}`));
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

  return { request, writeMessage, close };
}

function extractWikilink(text) {
  const match = /\[\[([^\]]+)\]\]/.exec(text);
  if (!match) throw new Error(`Expected wikilink in text:\n${text}`);
  return match[1];
}

function dataRows(markdownTable) {
  return markdownTable
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|"))
    .filter((line) => !/^\|\s*-+/.test(line))
    .filter((line) => !/^\|\s*Date\s*\|/i.test(line));
}

try {
  const client = makeClient({ CONDUCTY_VAULT: vault });
  try {
    const init = await client.request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "conducty-token-savings-strict-test", version: "0.1.0" }
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
        topic: "Strict Token Ledger Trap",
        goal: "Prove token-savings rows survive hostile Markdown and regression accounting.",
        appetite: "15m",
        acceptanceCriteria: [
          "Table cells with pipes stay one row",
          "Evidence containing Baseline Tokens is not mistaken for a header",
          "Negative savings is counted as a regression"
        ],
        noGoZones: ["No network calls", "No generated fixture repo", "No parser rewrite"],
        verification: "node scripts/token-savings-strict-test.mjs"
      }
    });
    const planLink = extractWikilink(plan.content?.[0]?.text || "");
    const aliasedPlanLink = `[[${planLink}|Strict Alias With | Pipe]]`;

    const first = await client.request("tools/call", {
      name: "record_token_savings",
      arguments: {
        vault,
        plan: aliasedPlanLink,
        scenario: "Strict | hostile table row\nBaseline Tokens decoy",
        baselineTokens: savingsRow.baselineTokens,
        conductyTokens: savingsRow.conductyTokens,
        method: "Approx count | adversarial ledger input\n|---| injected delimiter",
        evidence: [
          "Baseline Tokens: this phrase belongs in evidence and must not skip the row",
          "pipe | inside evidence",
          "[[Evidence Note|Alias]] plus multiline\nsecond line"
        ],
        notes: "Regression row follows. A delimiter decoy |---| should remain plain text."
      }
    });
    const firstText = first.content?.[0]?.text || "";
    assert(firstText.includes("Token Savings Recorded"), "first savings row did not record");

    const second = await client.request("tools/call", {
      name: "record_token_savings",
      arguments: {
        vault,
        plan: aliasedPlanLink,
        scenario: "Regression sentinel | Conducty context is larger",
        baselineTokens: regressionRow.baselineTokens,
        conductyTokens: regressionRow.conductyTokens,
        method: "Adversarial negative-savings row; should increment regressions",
        evidence: ["Focused run intentionally uses more tokens than baseline"],
        notes: "This row proves bad measurements are visible instead of hidden."
      }
    });
    const secondText = second.content?.[0]?.text || "";
    assert(secondText.includes("Tokens saved: -500"), "regression row did not preserve negative savings");
    assert(secondText.includes("Savings rate: -50.0%"), "regression row did not preserve negative rate");

    const ledgerPath = path.join(vault, "Accumulators", "Token Savings Ledger.md");
    const ledger = fs.readFileSync(ledgerPath, "utf8");
    const rows = dataRows(ledger);
    assert(rows.length === expected.entries, `expected ${expected.entries} data rows, got ${rows.length}\n${ledger}`);
    for (const row of rows) {
      const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
      assert(cells.length === 10, `expected 10 cells after sanitizing hostile Markdown, got ${cells.length}\n${row}`);
    }
    assert(ledger.includes("Strict / hostile table row Baseline Tokens decoy"), "scenario pipes/newlines were not sanitized");
    assert(ledger.includes(`[[${planLink}]]`), "ledger did not preserve the plan target when a pipe alias was provided");
    assert(ledger.includes("Baseline Tokens: this phrase belongs in evidence"), "evidence header decoy was lost");
    assert(ledger.includes("delimiter decoy /---/ should remain plain text"), "delimiter decoy was not kept as text");

    const report = await client.request("tools/call", {
      name: "generate_observatory_report",
      arguments: {
        vault,
        output: "Strict Observatory.html",
        limit: 5
      }
    });
    const reportText = report.content?.[0]?.text || "";
    assert(reportText.includes(`Token savings entries: ${expected.entries}`), `Observatory missed strict rows:\n${reportText}\n${ledger}`);
    assert(reportText.includes(`Measured tokens saved: ${expected.savedTokens}`), `Observatory saved-token total was wrong:\n${reportText}`);
    assert(reportText.includes(`Measured savings rate: ${expected.savingsRate.toFixed(1)}%`), `Observatory savings rate was wrong:\n${reportText}`);
    assert(reportText.includes(`Savings regressions: ${expected.regressions}`), `Observatory regression count was missing:\n${reportText}`);

    const html = fs.readFileSync(path.join(vault, "Strict Observatory.html"), "utf8");
    assert(html.includes("Savings regressions"), "Observatory HTML missing regression label");
    assert(html.includes(expected.savedTokens.toLocaleString("en-US")), "Observatory HTML missing formatted saved token total");
  } finally {
    await client.close();
  }

  console.log([
    "conducty-codex strict token savings test passed",
    `adversarial rows=${expected.entries}`,
    `baseline=${expected.baselineTokens} conducty=${expected.conductyTokens}`,
    `saved=${expected.savedTokens} (${expected.savingsRate.toFixed(1)}%)`,
    `regressions=${expected.regressions}`
  ].join("\n"));
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
