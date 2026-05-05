#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildObservatory } from "../scripts/observatory.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, "..");

const SERVER_INFO = {
  name: "conducty-codex",
  version: "0.1.0"
};

const KERNEL_STATES = ["observe", "shape", "plan", "trace", "execute", "verify", "diagnose", "review", "ship", "learn"];

const TOOLS = [
  {
    name: "resolve_vault",
    description: "Resolve the active Conducty vault path and report whether it exists.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string", description: "Optional explicit vault path." }
      }
    },
    handler: resolveVaultTool
  },
  {
    name: "bootstrap_vault",
    description: "Create Conducty vault folders, indexes, and accumulator notes.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string", description: "Optional explicit vault path." }
      }
    },
    handler: bootstrapVaultTool
  },
  {
    name: "get_cycle",
    description: "Return the Conducty operating cycle and phase routing.",
    inputSchema: {
      type: "object",
      properties: {
        terse: { type: "boolean", description: "Return a compact version." }
      }
    },
    handler: getCycleTool
  },
  {
    name: "get_kernel",
    description: "Return the Conducty closed-loop kernel architecture: state machine, router, contracts, risk model, invariants, evidence, and learning loop.",
    inputSchema: {
      type: "object",
      properties: {
        terse: { type: "boolean", description: "Return a compact version." }
      }
    },
    handler: getKernelTool
  },
  {
    name: "assess_kernel_state",
    description: "Assess a Conducty work item as a kernel state contract: infer phase, score risk, route the next skill, check invariants, and list required evidence.",
    inputSchema: {
      type: "object",
      properties: {
        goal: { type: "string" },
        topic: { type: "string" },
        prompt: { type: "string" },
        currentState: { type: "string", enum: KERNEL_STATES },
        hasActivePlan: { type: "boolean" },
        tracerRun: { type: "boolean" },
        shipReady: { type: "boolean" },
        acceptanceCriteria: { type: "array", items: { type: "string" } },
        noGoZones: { type: "array", items: { type: "string" } },
        context: { type: "array", items: { type: "string" } },
        verification: { type: "string" },
        evidence: { type: "array", items: { type: "string" } },
        changedFiles: { type: "array", items: { type: "string" } },
        failureSignals: { type: "array", items: { type: "string" } },
        rollbackNotes: { type: "string" },
        contextFreshness: { type: "string", enum: ["fresh", "stale", "unknown"] },
        parallelPrompts: { type: "number" },
        retries: { type: "number" }
      }
    },
    handler: assessKernelStateTool
  },
  {
    name: "create_kernel_contract",
    description: "Write a timestamped Conducty kernel contract note with inferred state, risk score, invariant gaps, evidence requirements, and next action.",
    inputSchema: {
      type: "object",
      required: ["goal"],
      properties: {
        vault: { type: "string" },
        goal: { type: "string" },
        topic: { type: "string" },
        prompt: { type: "string" },
        currentState: { type: "string", enum: KERNEL_STATES },
        hasActivePlan: { type: "boolean" },
        tracerRun: { type: "boolean" },
        shipReady: { type: "boolean" },
        acceptanceCriteria: { type: "array", items: { type: "string" } },
        noGoZones: { type: "array", items: { type: "string" } },
        context: { type: "array", items: { type: "string" } },
        verification: { type: "string" },
        evidence: { type: "array", items: { type: "string" } },
        changedFiles: { type: "array", items: { type: "string" } },
        failureSignals: { type: "array", items: { type: "string" } },
        rollbackNotes: { type: "string" },
        contextFreshness: { type: "string", enum: ["fresh", "stale", "unknown"] },
        parallelPrompts: { type: "number" },
        retries: { type: "number" }
      }
    },
    handler: createKernelContractTool
  },
  {
    name: "check_prompt_smells",
    description: "Check a Conducty prompt for missing acceptance criteria, context, verification, no-go zones, budget, or mixed concerns.",
    inputSchema: {
      type: "object",
      required: ["prompt"],
      properties: {
        prompt: { type: "string" },
        acceptanceCriteria: { type: "array", items: { type: "string" } },
        context: { type: "array", items: { type: "string" } },
        verification: { type: "string" },
        noGoZones: { type: "array", items: { type: "string" } },
        timeBudget: { type: "string" }
      }
    },
    handler: checkPromptSmellsTool
  },
  {
    name: "create_plan",
    description: "Write a timestamped Conducty plan note and prepend it to Plans Index.",
    inputSchema: {
      type: "object",
      required: ["goal"],
      properties: {
        vault: { type: "string" },
        topic: { type: "string" },
        goal: { type: "string" },
        appetite: { type: "string" },
        project: { type: "string" },
        acceptanceCriteria: { type: "array", items: { type: "string" } },
        noGoZones: { type: "array", items: { type: "string" } },
        verification: { type: "string" },
        prompts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              context: { type: "array", items: { type: "string" } },
              acceptanceCriteria: { type: "array", items: { type: "string" } },
              noGoZones: { type: "array", items: { type: "string" } },
              verification: { type: "string" },
              timeBudget: { type: "string" },
              reviewLevel: { type: "string", enum: ["verify-only", "spec-review", "full-review"] },
              tracer: { type: "boolean" },
              dependencies: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    },
    handler: createPlanTool
  },
  {
    name: "list_recent_notes",
    description: "List recent Conducty vault notes by type.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string" },
        type: {
          type: "string",
          enum: ["plans", "improvements", "code_reviews", "ship_reports", "kernel_contracts", "accumulators", "all"]
        },
        limit: { type: "number" }
      }
    },
    handler: listRecentNotesTool
  },
  {
    name: "log_prompt_outcome",
    description: "Prepend a terse prompt outcome entry to Accumulators/Prompt Log.md.",
    inputSchema: {
      type: "object",
      required: ["plan", "promptId", "status"],
      properties: {
        vault: { type: "string" },
        plan: { type: "string", description: "Plan title, wikilink basename, or path." },
        promptId: { type: "string" },
        status: { type: "string", enum: ["DONE", "DONE_WITH_CONCERNS", "NEEDS_CONTEXT", "BLOCKED", "FAILED"] },
        evidence: { type: "string" },
        attempts: { type: "number" },
        budget: { type: "string" },
        elapsed: { type: "string" },
        review: { type: "string" }
      }
    },
    handler: logPromptOutcomeTool
  },
  {
    name: "record_checkpoint",
    description: "Append a health-aware group checkpoint to the plan note's Checkpoint Notes section.",
    inputSchema: {
      type: "object",
      required: ["plan", "group", "completed", "total"],
      properties: {
        vault: { type: "string" },
        plan: { type: "string", description: "Plan title, wikilink basename, or path." },
        group: { type: "string" },
        completed: { type: "number" },
        total: { type: "number" },
        firstAttemptPassRate: { type: "number" },
        retries: { type: "number" },
        blocked: { type: "number" },
        systemicFailures: { type: "array", items: { type: "string" } },
        hillChart: { type: "array", items: { type: "string" } },
        verdict: { type: "string" }
      }
    },
    handler: recordCheckpointTool
  },
  {
    name: "record_improvement",
    description: "Write an improvement kata note and update Improvements Index.",
    inputSchema: {
      type: "object",
      required: ["target", "actual", "learned", "nextExperiment"],
      properties: {
        vault: { type: "string" },
        plan: { type: "string" },
        target: { type: "string" },
        actual: { type: "string" },
        learned: { type: "string" },
        nextExperiment: { type: "string" }
      }
    },
    handler: recordImprovementTool
  },
  {
    name: "record_token_savings",
    description: "Append a measured baseline-vs-Conducty token savings entry to Accumulators/Token Savings Ledger.md.",
    inputSchema: {
      type: "object",
      required: ["scenario", "baselineTokens", "conductyTokens", "method"],
      properties: {
        vault: { type: "string" },
        plan: { type: "string", description: "Optional plan title, wikilink basename, or path." },
        scenario: { type: "string", description: "Short name for the measured task or workflow." },
        baselineTokens: { type: "number", description: "Measured or estimated tokens for the comparable non-Conducty baseline." },
        conductyTokens: { type: "number", description: "Measured tokens for the Conducty-assisted run." },
        method: { type: "string", description: "How the measurement was collected." },
        evidence: { type: "array", items: { type: "string" } },
        notes: { type: "string" }
      }
    },
    handler: recordTokenSavingsTool
  },
  {
    name: "create_ship_report",
    description: "Write a pre-merge ship report with verdict, verification evidence, risks, and next steps.",
    inputSchema: {
      type: "object",
      required: ["plan", "verdict"],
      properties: {
        vault: { type: "string" },
        plan: { type: "string", description: "Plan title, wikilink basename, or path." },
        topic: { type: "string", description: "Optional short title for the ship report." },
        verdict: { type: "string", enum: ["green", "yellow", "red"] },
        summary: { type: "string" },
        verification: { type: "array", items: { type: "string" } },
        evidence: { type: "array", items: { type: "string" } },
        risks: { type: "array", items: { type: "string" } },
        changedFiles: { type: "array", items: { type: "string" } },
        nextSteps: { type: "array", items: { type: "string" } }
      }
    },
    handler: createShipReportTool
  },
  {
    name: "audit_vault_graph",
    description: "Read the Conducty vault and report broken wikilinks, duplicate basenames, orphan notes, and plans missing closure signals.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string" },
        limit: { type: "number", description: "Maximum examples to show per section. Defaults to 10." },
        maxNotes: { type: "number", description: "Maximum notes to scan. Defaults to 1000." },
        maxBytesPerNote: { type: "number", description: "Maximum bytes to read per note. Defaults to 1048576." }
      }
    },
    handler: auditVaultGraphTool
  },
  {
    name: "generate_observatory_report",
    description: "Generate a static HTML Conducty Observatory report for plans, ship reports, checkpoints, wikilinks, failures, and improvement velocity.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string" },
        output: { type: "string", description: "Optional output path. Relative paths are resolved inside the vault; absolute paths must remain inside the vault." },
        limit: { type: "number", description: "Maximum examples to show per section. Defaults to 10." },
        maxNotes: { type: "number", description: "Maximum notes to scan. Defaults to 1000." },
        maxBytesPerNote: { type: "number", description: "Maximum bytes to read per note. Defaults to 1048576." }
      }
    },
    handler: generateObservatoryReportTool
  }
];

const TOOL_MAP = new Map(TOOLS.map((tool) => [tool.name, tool]));

function resolveVault(args = {}) {
  if (typeof args.vault === "string" && args.vault.trim()) {
    return { path: path.resolve(args.vault), source: "argument" };
  }

  if (process.env.CONDUCTY_VAULT && process.env.CONDUCTY_VAULT.trim()) {
    return { path: path.resolve(process.env.CONDUCTY_VAULT), source: "CONDUCTY_VAULT" };
  }

  return { path: path.join(os.homedir(), "Obsidian", "Conducty"), source: "home-default" };
}

function resolveVaultTool(args) {
  const vault = resolveVault(args);
  return [
    "# Conducty Vault",
    "",
    `Path: ${vault.path}`,
    `Source: ${vault.source}`,
    `Exists: ${fs.existsSync(vault.path) ? "yes" : "no"}`
  ].join("\n");
}

function bootstrapVaultTool(args) {
  const vault = resolveVault(args);
  bootstrapVault(vault.path);
  return [
    "# Conducty Vault Bootstrapped",
    "",
    `Path: ${vault.path}`,
    "Created/verified:",
    "- Conducty Index.md",
    "- Indexes/Plans Index.md",
    "- Indexes/Designs Index.md",
    "- Indexes/Context Index.md",
    "- Indexes/Improvements Index.md",
    "- Indexes/Ship Reports Index.md",
    "- Accumulators/Failure Patterns.md",
    "- Accumulators/Metrics.md",
    "- Accumulators/Prompt Log.md",
    "- Accumulators/Token Savings Ledger.md"
  ].join("\n");
}

function getCycleTool(args) {
  if (args?.terse) {
    return "Shape -> Plan -> Trace -> Execute -> Verify -> Improve -> Code Review -> Ship\nTracer first. Evidence before claims. Learn or repeat.";
  }

  return [
    "# Conducty Cycle",
    "",
    "Shape: appetite, goal, no-go zones, acceptance criteria.",
    "Plan: time-budgeted prompts, grouped by independence, tracer marked.",
    "Trace: run one risky prompt first to validate plan assumptions.",
    "Execute: run remaining prompts only after tracer signal.",
    "Verify: run focused checks and record evidence.",
    "Improve: capture target vs actual, failure patterns, next experiment.",
    "Code Review: inspect whole diff for correctness, security, coupling, tests.",
    "Ship: run final gates; verdict is advisory, user owns merge/deploy.",
    "",
    "Codex boundary: delegate only when the user explicitly asks for subagents, delegation, or parallel agent work."
  ].join("\n");
}

function getKernelTool(args) {
  if (args?.terse) {
    return "Observe -> Shape -> Plan -> Trace -> Execute -> Verify -> Diagnose -> Review -> Ship -> Learn. Kernel owns state, routing, contracts, risk, invariants, evidence, and policy updates.";
  }

  return [
    "# Conducty Kernel",
    "",
    "Conducty-system explains the philosophy. Conducty-kernel operationalizes it as a closed-loop control layer.",
    "",
    "## Loop",
    "",
    "Observe -> Shape Hypothesis -> Plan Experiment -> Execute Safely -> Verify Evidence -> Diagnose Failure -> Learn -> Update Policy -> Next Better Plan",
    "",
    "## Responsibilities",
    "",
    "- State machine: know the current phase and legal transitions.",
    "- Skill router: choose the next Conducty skill from state, risk, and missing inputs.",
    "- Contracts: require goals, appetite, acceptance, no-go zones, context, verification, and evidence before advancing.",
    "- Risk model: scale rigor by blast radius, uncertainty, parallelism, failure history, and test weakness.",
    "- Invariants: block claims, ship gates, or parallel execution when the required evidence is absent.",
    "- Evidence objects: preserve commands, outputs, changed files, verdicts, and residual risks.",
    "- Policy updates: turn recurring failures into sharper templates, routing, and context refresh rules.",
    "",
    "## Vocabulary",
    "",
    "- system state",
    "- kernel contract",
    "- evidence object",
    "- risk score",
    "- plan hypothesis",
    "- tracer validity",
    "- context freshness",
    "- reconciliation gate",
    "- learning delta",
    "- policy update"
  ].join("\n");
}

function assessKernelStateTool(args) {
  return renderKernelAssessment(assessKernel(args));
}

function createKernelContractTool(args) {
  requireString(args.goal, "goal");
  const vault = resolveVault(args);
  bootstrapVault(vault.path);
  const assessment = assessKernel(args);
  const now = timestamp();
  const topic = safeTitle(args.topic || summarizeGoal(args.goal));
  const { filePath: contractPath, linkName } = uniqueVaultNote(vault.path, "Kernel Contracts", `Kernel Contract ${now.date} ${now.time} ${topic}`);
  const content = renderKernelContractNote({
    now,
    linkName,
    goal: args.goal.trim(),
    topic,
    assessment
  });

  fs.writeFileSync(contractPath, content, "utf8");
  prependIndexLink(safeVaultPath(vault.path, path.join("Indexes", "Kernel Contracts Index.md")), `- [[${linkName}]]`);

  return [
    "# Kernel Contract Created",
    "",
    `Contract: [[${linkName}]]`,
    `Path: ${contractPath}`,
    `Vault: ${vault.path}`,
    `State: ${assessment.state}`,
    `Risk: ${assessment.riskScore}/100 (${assessment.riskBand})`,
    `Next skill: ${assessment.nextSkill}`
  ].join("\n");
}

function assessKernel(args = {}) {
  const goal = stringOr(args.goal, "");
  const prompt = stringOr(args.prompt, "");
  const acceptance = toList(args.acceptanceCriteria);
  const noGo = toList(args.noGoZones);
  const context = toList(args.context);
  const evidence = toList(args.evidence);
  const changedFiles = toList(args.changedFiles);
  const failureSignals = toList(args.failureSignals);
  const verification = stringOr(args.verification, "");
  const rollbackNotes = stringOr(args.rollbackNotes, "");
  const contextFreshness = ["fresh", "stale", "unknown"].includes(args.contextFreshness) ? args.contextFreshness : "unknown";
  const currentState = normalizeKernelState(args.currentState);
  const hasActivePlan = Boolean(args.hasActivePlan);
  const tracerRun = Boolean(args.tracerRun);
  const shipReady = Boolean(args.shipReady);
  const parallelPrompts = numberOr(args.parallelPrompts, 1);
  const retries = numberOr(args.retries, 0);
  const text = [goal, prompt, context.join(" "), changedFiles.join(" "), failureSignals.join(" ")].join(" ").toLowerCase();

  const contractGaps = [];
  if (!goal && !prompt) contractGaps.push("missing goal or prompt");
  if (!acceptance.length) contractGaps.push("missing acceptance criteria");
  if (!noGo.length) contractGaps.push("missing no-go zones");
  if (!verification) contractGaps.push("missing verification command");
  if (!context.length) contractGaps.push("missing scoped context");
  if (contextFreshness !== "fresh") contractGaps.push(`context freshness is ${contextFreshness}`);
  if (changedFiles.length && !evidence.length) contractGaps.push("changed files without evidence object");

  const risk = scoreKernelRisk({
    text,
    acceptance,
    noGo,
    context,
    verification,
    evidence,
    changedFiles,
    failureSignals,
    contextFreshness,
    parallelPrompts,
    retries
  });

  const state = currentState || inferKernelState({
    goal,
    prompt,
    acceptance,
    noGo,
    hasActivePlan,
    tracerRun,
    shipReady,
    evidence,
    changedFiles,
    failureSignals,
    retries
  });

  const invariantViolations = [];
  if (["trace", "execute", "verify", "review", "ship"].includes(state) && !hasActivePlan) {
    invariantViolations.push("cannot advance beyond planning without an active plan contract");
  }
  if (state === "execute" && parallelPrompts > 1 && !tracerRun) {
    invariantViolations.push("cannot start parallel execution before tracer validity is known");
  }
  if (state === "ship" && !evidence.length) {
    invariantViolations.push("cannot ship without verification evidence");
  }
  if (state === "ship" && risk.score >= 65 && !rollbackNotes) {
    invariantViolations.push("high-risk ship needs rollback or recovery notes");
  }
  if (retries >= 3 && state !== "diagnose") {
    invariantViolations.push("three retries triggers diagnose/debug circuit breaker");
  }

  const nextSkill = skillForState(state, invariantViolations, contractGaps);
  const nextAction = nextActionForState(state, nextSkill, invariantViolations, contractGaps);
  const evidenceRequired = requiredEvidence({
    text,
    state,
    riskScore: risk.score,
    changedFiles,
    failureSignals,
    parallelPrompts,
    shipReady
  });

  return {
    state,
    nextSkill,
    nextAction,
    riskScore: risk.score,
    riskBand: riskBand(risk.score),
    reviewLevel: reviewLevelForRisk(risk.score),
    riskFactors: risk.factors,
    contractGaps,
    invariantViolations,
    evidenceRequired,
    contextFreshness,
    tracerValidity: tracerRun ? "valid or already attempted" : "unknown",
    inputs: {
      goal,
      prompt,
      acceptanceCriteria: acceptance,
      noGoZones: noGo,
      context,
      verification,
      evidence,
      changedFiles,
      failureSignals,
      hasActivePlan,
      tracerRun,
      shipReady,
      parallelPrompts,
      retries
    }
  };
}

function renderKernelAssessment(assessment) {
  return [
    "# Conducty Kernel State",
    "",
    `State: ${assessment.state}`,
    `Next skill: ${assessment.nextSkill}`,
    `Next action: ${assessment.nextAction}`,
    `Risk: ${assessment.riskScore}/100 (${assessment.riskBand})`,
    `Review level: ${assessment.reviewLevel}`,
    `Context freshness: ${assessment.contextFreshness}`,
    `Tracer validity: ${assessment.tracerValidity}`,
    "",
    "## Risk Factors",
    "",
    ...bulletList(assessment.riskFactors.length ? assessment.riskFactors : ["none detected"]),
    "",
    "## Contract Gaps",
    "",
    ...bulletList(assessment.contractGaps.length ? assessment.contractGaps : ["none"]),
    "",
    "## Invariant Violations",
    "",
    ...bulletList(assessment.invariantViolations.length ? assessment.invariantViolations : ["none"]),
    "",
    "## Required Evidence",
    "",
    ...bulletList(assessment.evidenceRequired),
    "",
    "## Kernel Contract JSON",
    "",
    "```json",
    JSON.stringify({
      state: assessment.state,
      nextSkill: assessment.nextSkill,
      nextAction: assessment.nextAction,
      riskScore: assessment.riskScore,
      riskBand: assessment.riskBand,
      reviewLevel: assessment.reviewLevel,
      contractGaps: assessment.contractGaps,
      invariantViolations: assessment.invariantViolations,
      evidenceRequired: assessment.evidenceRequired
    }, null, 2),
    "```"
  ].join("\n");
}

function renderKernelContractNote({ now, linkName, goal, topic, assessment }) {
  return [
    "---",
    "type: kernel-contract",
    `date: ${now.date}`,
    `time: ${now.time}`,
    `topic: "${escapeYaml(topic)}"`,
    `state: ${assessment.state}`,
    `risk_score: ${assessment.riskScore}`,
    `risk_band: ${assessment.riskBand}`,
    `review_level: ${assessment.reviewLevel}`,
    "tags: [conducty, conducty/kernel, conducty/contract]",
    "---",
    "",
    `# ${linkName}`,
    "",
    "## Goal",
    "",
    goal,
    "",
    "## Kernel Verdict",
    "",
    `- State: ${assessment.state}`,
    `- Next skill: ${plainWikilinks(assessment.nextSkill)}`,
    `- Next action: ${plainWikilinks(assessment.nextAction)}`,
    `- Risk: ${assessment.riskScore}/100 (${assessment.riskBand})`,
    `- Review level: ${assessment.reviewLevel}`,
    `- Context freshness: ${assessment.contextFreshness}`,
    `- Tracer validity: ${assessment.tracerValidity}`,
    "",
    "## Contract Gaps",
    "",
    ...bulletList(assessment.contractGaps.length ? assessment.contractGaps : ["none"]),
    "",
    "## Invariant Violations",
    "",
    ...bulletList(assessment.invariantViolations.length ? assessment.invariantViolations : ["none"]),
    "",
    "## Risk Factors",
    "",
    ...bulletList(assessment.riskFactors.length ? assessment.riskFactors : ["none detected"]),
    "",
    "## Required Evidence",
    "",
    ...bulletList(assessment.evidenceRequired),
    "",
    "## Inputs",
    "",
    "```json",
    JSON.stringify(assessment.inputs, null, 2),
    "```",
    "",
    "## Related",
    "",
    "- Index: [[Kernel Contracts Index]]",
    "- System: [[Conducty Index]]",
    "- Feeds: [[Plans Index]], [[Failure Patterns]], [[Metrics]], [[Prompt Log]]",
    ""
  ].join("\n");
}

function normalizeKernelState(value) {
  const state = typeof value === "string" ? value.trim().toLowerCase() : "";
  return KERNEL_STATES.includes(state) ? state : "";
}

function inferKernelState(input) {
  if (input.failureSignals.length || input.retries >= 3) return "diagnose";
  if (!input.goal && !input.prompt) return "observe";
  if (!input.acceptance.length || !input.noGo.length) return "shape";
  if (!input.hasActivePlan) return "plan";
  if (!input.tracerRun) return "trace";
  if (input.changedFiles.length && !input.evidence.length) return "verify";
  if (input.shipReady) return "ship";
  if (input.evidence.length) return "review";
  return "execute";
}

function scoreKernelRisk(input) {
  let score = 10;
  const factors = [];
  const add = (points, factor) => {
    score += points;
    factors.push(factor);
  };

  if (/\b(auth|permission|security|secret|credential|token|payment|billing|invoice|database|migration|schema|production|deploy|release|rollback|encryption|privacy|pii|admin)\b/i.test(input.text)) {
    add(25, "high-blast-radius domain language");
  }
  if (input.changedFiles.length >= 8) add(15, "wide file surface");
  else if (input.changedFiles.length >= 3) add(8, "multi-file change");
  if (input.parallelPrompts > 1) add(Math.min(20, (input.parallelPrompts - 1) * 6), "parallel execution requires reconciliation");
  if (!input.verification) add(12, "missing verification command");
  if (!input.acceptance.length) add(8, "missing acceptance criteria");
  if (!input.noGo.length) add(6, "missing no-go zones");
  if (!input.context.length) add(8, "missing scoped context");
  if (input.contextFreshness === "stale") add(12, "stale context");
  else if (input.contextFreshness === "unknown") add(5, "unknown context freshness");
  if (input.failureSignals.length) add(15, "active failure signals");
  if (input.retries > 0) add(Math.min(24, input.retries * 8), "retry history");
  if (input.changedFiles.length && !input.evidence.length) add(10, "changed files lack evidence object");

  return { score: Math.max(0, Math.min(100, Math.round(score))), factors };
}

function riskBand(score) {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function reviewLevelForRisk(score) {
  if (score >= 65) return "full-review";
  if (score >= 35) return "spec-review";
  return "verify-only";
}

function skillForState(state, invariantViolations, contractGaps) {
  if (invariantViolations.length) return "[[conducty-debug]]";
  if (contractGaps.some((gap) => /acceptance|no-go|goal/.test(gap))) return "[[conducty-shape]]";
  switch (state) {
    case "observe": return "[[conducty-context]]";
    case "shape": return "[[conducty-shape]]";
    case "plan": return "[[conducty-plan]]";
    case "trace":
    case "execute": return "[[conducty-execute]]";
    case "verify": return "[[conducty-verify]]";
    case "diagnose": return "[[conducty-debug]]";
    case "review": return "[[conducty-review]]";
    case "ship": return "[[conducty-ship]]";
    case "learn": return "[[conducty-improve]]";
    default: return "[[conducty-system]]";
  }
}

function nextActionForState(state, nextSkill, invariantViolations, contractGaps) {
  if (invariantViolations.length) return `Stop and clear kernel invariant violations with ${nextSkill}.`;
  if (contractGaps.some((gap) => /acceptance|no-go|goal/.test(gap))) return `Shape the contract before planning with ${nextSkill}.`;
  switch (state) {
    case "observe": return "Load or refresh project/vault context before shaping.";
    case "shape": return "Define appetite, scope, no-go zones, acceptance criteria, and decision points.";
    case "plan": return "Compile a time-budgeted plan with tracer, dependencies, review level, and verification.";
    case "trace": return "Run the tracer prompt first and record whether the plan hypothesis survives contact.";
    case "execute": return "Execute only after tracer validity; isolate parallel work and keep evidence objects.";
    case "verify": return "Run the smallest meaningful verification and record exact evidence.";
    case "diagnose": return "Classify the failure as plan, prompt, context, code, tool, or environment before fixing.";
    case "review": return "Review the cumulative diff and feed findings into failure patterns and metrics.";
    case "ship": return "Run the ship gate with verification evidence, residual risk, and rollback notes.";
    case "learn": return "Record the learning delta and update the next plan policy.";
    default: return "Route through conducty-system to choose the next phase.";
  }
}

function requiredEvidence(input) {
  const required = ["goal, appetite, acceptance criteria, no-go zones, and scoped context"];
  if (input.changedFiles.length) required.push("changed file list or diff summary");
  required.push("fresh verification command output");
  if (input.riskScore >= 65) required.push("risk-calibrated review verdict and regression evidence");
  if (/\b(auth|permission|security|secret|credential|token|payment|billing|pii|privacy)\b/i.test(input.text)) {
    required.push("security/privacy review evidence");
  }
  if (input.parallelPrompts > 1) required.push("reconciliation gate notes for parallel branches or worktrees");
  if (input.failureSignals.length) required.push("failure classification and prevention note");
  if (input.shipReady) required.push("ship report with green/yellow/red verdict and rollback notes");
  return [...new Set(required)];
}

function checkPromptSmellsTool(args) {
  requireString(args.prompt, "prompt");
  const prompt = args.prompt.trim();
  const acceptance = toList(args.acceptanceCriteria);
  const context = toList(args.context);
  const noGo = toList(args.noGoZones);
  const verification = typeof args.verification === "string" ? args.verification.trim() : "";
  const timeBudget = typeof args.timeBudget === "string" ? args.timeBudget.trim() : "";
  const findings = [];

  if (!acceptance.length || /\b(make it work|improve|better|clean up|handle everything|as needed|etc\.?)\b/i.test(prompt)) {
    findings.push(["vague acceptance", "Add concrete acceptance criteria with observable behavior."]);
  }

  if (!context.length && !/([A-Za-z]:\\|\.{0,2}\/|[\w.-]+\/[\w./-]+|\w+\.(ts|tsx|js|jsx|py|go|rs|java|cs|md|json|yaml|yml))/i.test(prompt)) {
    findings.push(["missing context", "List exact files, dirs, or notes needed for the prompt."]);
  }

  if (/\b(and also|also add|while you are there|at the same time|plus update)\b/i.test(prompt)) {
    findings.push(["mixed concerns", "Split unrelated actions into separate prompts."]);
  }

  if (!verification) {
    findings.push(["no verification", "Add one command or observable check with expected signal."]);
  }

  if (!noGo.length) {
    findings.push(["unbounded scope", "Add no-go zones to prevent scope creep."]);
  }

  if (!timeBudget) {
    findings.push(["no time budget", "Add an appetite-derived budget such as 20m or 1h."]);
  }

  if (!findings.length) {
    return [
      "# Prompt Smell Check",
      "",
      "Verdict: clean",
      "No obvious Conducty prompt smells found."
    ].join("\n");
  }

  return [
    "# Prompt Smell Check",
    "",
    "Verdict: fix before execution",
    "",
    ...findings.flatMap(([name, fix]) => [`- ${name}: ${fix}`])
  ].join("\n");
}

function createPlanTool(args) {
  requireString(args.goal, "goal");
  const vault = resolveVault(args);
  bootstrapVault(vault.path);

  const now = timestamp();
  const topic = safeTitle(args.topic || summarizeGoal(args.goal));
  const appetite = stringOr(args.appetite, "30m");
  const project = stringOr(args.project, path.basename(process.cwd()));
  const acceptance = toList(args.acceptanceCriteria);
  const noGo = toList(args.noGoZones);
  const verification = stringOr(args.verification, "");
  const prompts = normalizePrompts(args.prompts, {
    topic,
    acceptance,
    noGo,
    verification,
    appetite
  });

  const { filePath: planPath, linkName } = uniqueVaultNote(vault.path, "Plans", `Plan ${now.date} ${now.time} ${topic}`);
  const content = renderPlan({
    date: now.date,
    time: now.time,
    topic,
    appetite,
    project,
    goal: args.goal.trim(),
    acceptance,
    noGo,
    verification,
    prompts,
    linkName
  });

  fs.writeFileSync(planPath, content, "utf8");
  prependIndexLink(safeVaultPath(vault.path, path.join("Indexes", "Plans Index.md")), `- [[${linkName}]]`);

  return [
    "# Conducty Plan Created",
    "",
    `Plan: [[${linkName}]]`,
    `Path: ${planPath}`,
    `Vault: ${vault.path}`,
    `Prompts: ${prompts.length}`,
    `Tracer: ${prompts.find((prompt) => prompt.tracer)?.id || "none"}`
  ].join("\n");
}

function listRecentNotesTool(args) {
  const vault = resolveVault(args);
  const type = stringOr(args?.type, "plans");
  const limit = Math.max(1, Math.min(50, Number(args?.limit) || 10));
  const dirs = noteDirsForType(type);
  const files = [];

  for (const dir of dirs) {
    const fullDir = safeVaultPath(vault.path, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const file of fs.readdirSync(fullDir, { withFileTypes: true })) {
      if (file.isFile() && file.name.endsWith(".md")) {
        const fullPath = path.join(fullDir, file.name);
        files.push({
          fullPath,
          relPath: path.relative(vault.path, fullPath),
          mtimeMs: fs.statSync(fullPath).mtimeMs
        });
      }
    }
  }

  files.sort((a, b) => b.mtimeMs - a.mtimeMs || a.relPath.localeCompare(b.relPath));

  return [
    "# Recent Conducty Notes",
    "",
    `Vault: ${vault.path}`,
    `Type: ${type}`,
    "",
    ...(files.slice(0, limit).map((file) => `- ${file.relPath}`)),
    ...(files.length ? [] : ["No matching notes found."])
  ].join("\n");
}

function logPromptOutcomeTool(args) {
  requireString(args.plan, "plan");
  requireString(args.promptId, "promptId");
  requireString(args.status, "status");
  const vault = resolveVault(args);
  bootstrapVault(vault.path);
  const logPath = safeVaultPath(vault.path, path.join("Accumulators", "Prompt Log.md"));
  const now = timestamp();
  const planLink = wikilink(args.plan);
  const details = [
    `${now.date} ${now.time}`,
    args.promptId.trim(),
    planLink,
    args.status.trim(),
    args.attempts ? `${args.attempts} attempt${Number(args.attempts) === 1 ? "" : "s"}` : "",
    stringOr(args.review, ""),
    stringOr(args.elapsed, "") && stringOr(args.budget, "") ? `${args.elapsed} / ${args.budget}` : stringOr(args.elapsed, "") || stringOr(args.budget, ""),
    stringOr(args.evidence, "")
  ].filter(Boolean).join(" | ");

  prependAfterHeading(logPath, `- ${details}`);
  return [
    "# Prompt Outcome Logged",
    "",
    `Prompt: ${args.promptId.trim()}`,
    `Plan: ${planLink}`,
    `Status: ${args.status.trim()}`,
    `Log: ${logPath}`
  ].join("\n");
}

function recordCheckpointTool(args) {
  requireString(args.plan, "plan");
  requireString(args.group, "group");
  const vault = resolveVault(args);
  const planPath = findPlanPath(vault.path, args.plan);
  if (!planPath) {
    throw new Error(`Plan not found: ${args.plan}`);
  }

  const now = timestamp();
  const completed = Number(args.completed);
  const total = Number(args.total);
  if (!Number.isFinite(completed) || !Number.isFinite(total) || completed < 0 || total < 0 || completed > total) {
    throw new Error("Checkpoint requires numeric completed/total values with 0 <= completed <= total.");
  }
  const passRate = Number.isFinite(Number(args.firstAttemptPassRate))
    ? Number(args.firstAttemptPassRate)
    : total > 0 ? Math.round((completed / total) * 100) : 0;
  const retries = Number.isFinite(Number(args.retries)) ? Number(args.retries) : 0;
  const blocked = Number.isFinite(Number(args.blocked)) ? Number(args.blocked) : 0;
  const systemicFailures = toList(args.systemicFailures);
  const hillChart = toList(args.hillChart);
  const verdict = stringOr(args.verdict, blocked > 0 || systemicFailures.length ? "revise before next group" : "proceed");

  const entry = [
    `### Group ${args.group.trim()} Checkpoint - ${now.date} ${now.time}`,
    "",
    `- Completed: ${completed}/${total}`,
    `- First-attempt pass rate: ${passRate}%`,
    `- Retries: ${retries}`,
    `- Blocked: ${blocked}`,
    `- Verdict: ${verdict}`,
    "- Systemic failures:",
    ...bulletList(systemicFailures.length ? systemicFailures : ["none"]),
    "- Hill chart:",
    ...bulletList(hillChart.length ? hillChart : ["unchanged"]),
    ""
  ].join("\n");

  ensureSectionAndAppend(planPath, "## Checkpoint Notes", entry);

  return [
    "# Checkpoint Recorded",
    "",
    `Plan: ${wikilink(args.plan)}`,
    `Path: ${planPath}`,
    `Group: ${args.group.trim()}`,
    `Verdict: ${verdict}`
  ].join("\n");
}

function recordImprovementTool(args) {
  for (const field of ["target", "actual", "learned", "nextExperiment"]) {
    requireString(args[field], field);
  }

  const vault = resolveVault(args);
  bootstrapVault(vault.path);
  const now = timestamp();
  const { filePath: improvementPath, linkName } = uniqueVaultNote(vault.path, "Improvements", `Improvement ${now.date} ${now.time}`);
  const planLink = args.plan ? wikilink(args.plan) : "none";
  const content = [
    "---",
    "type: improvement",
    `date: ${now.date}`,
    `time: ${now.time}`,
    "tags: [conducty, conducty/improvement]",
    "---",
    "",
    `# ${linkName}`,
    "",
    "## Target",
    "",
    args.target.trim(),
    "",
    "## Actual",
    "",
    args.actual.trim(),
    "",
    "## Learned",
    "",
    args.learned.trim(),
    "",
    "## Next Experiment",
    "",
    args.nextExperiment.trim(),
    "",
    "## Related",
    "",
    "- Index: [[Improvements Index]]",
    `- Plan: ${planLink}`,
    "- Accumulates from: [[Failure Patterns]], [[Metrics]], [[Prompt Log]]",
    ""
  ].join("\n");

  fs.writeFileSync(improvementPath, content, "utf8");
  prependIndexLink(safeVaultPath(vault.path, path.join("Indexes", "Improvements Index.md")), `- [[${linkName}]]`);

  return [
    "# Improvement Recorded",
    "",
    `Improvement: [[${linkName}]]`,
    `Path: ${improvementPath}`,
    `Plan: ${planLink}`
  ].join("\n");
}

function recordTokenSavingsTool(args) {
  requireString(args.scenario, "scenario");
  requireString(args.method, "method");
  const baselineTokens = Number(args.baselineTokens);
  const conductyTokens = Number(args.conductyTokens);
  if (!Number.isFinite(baselineTokens) || baselineTokens <= 0) {
    throw new Error("baselineTokens must be a positive number.");
  }
  if (!Number.isFinite(conductyTokens) || conductyTokens < 0) {
    throw new Error("conductyTokens must be a non-negative number.");
  }

  const vault = resolveVault(args);
  bootstrapVault(vault.path);
  const ledgerPath = safeVaultPath(vault.path, path.join("Accumulators", "Token Savings Ledger.md"));
  const now = timestamp();
  const savedTokens = baselineTokens - conductyTokens;
  const savedPercent = (savedTokens / baselineTokens) * 100;
  const planLink = args.plan ? wikilink(args.plan) : "none";
  const evidence = toList(args.evidence);
  const row = [
    now.date,
    planLink,
    markdownTableCell(args.scenario),
    formatTokenCount(baselineTokens),
    formatTokenCount(conductyTokens),
    formatTokenCount(savedTokens),
    `${savedPercent.toFixed(1)}%`,
    markdownTableCell(args.method),
    markdownTableCell(evidence.join("; ") || "not recorded"),
    markdownTableCell(stringOr(args.notes, ""))
  ].join(" | ");

  prependTableRow(ledgerPath, `| ${row} |`);

  return [
    "# Token Savings Recorded",
    "",
    `Scenario: ${args.scenario.trim()}`,
    `Plan: ${planLink}`,
    `Baseline tokens: ${formatTokenCount(baselineTokens)}`,
    `Conducty tokens: ${formatTokenCount(conductyTokens)}`,
    `Tokens saved: ${formatTokenCount(savedTokens)}`,
    `Savings rate: ${savedPercent.toFixed(1)}%`,
    `Ledger: ${ledgerPath}`
  ].join("\n");
}

function createShipReportTool(args) {
  requireString(args.plan, "plan");
  requireString(args.verdict, "verdict");
  const verdict = args.verdict.trim().toLowerCase();
  if (!["green", "yellow", "red"].includes(verdict)) {
    throw new Error("Ship report verdict must be one of: green, yellow, red.");
  }

  const vault = resolveVault(args);
  bootstrapVault(vault.path);
  const planPath = findPlanPath(vault.path, args.plan);
  if (!planPath) {
    throw new Error(`Plan not found: ${args.plan}`);
  }

  const now = timestamp();
  const planName = path.basename(planPath, ".md");
  const topic = safeTitle(args.topic || planName.replace(/^Plan \d{4}-\d{2}-\d{2} \d{4}\s*/, "") || "Ship Report");
  const { filePath: reportPath, linkName } = uniqueVaultNote(vault.path, "Ship Reports", `Ship Report ${now.date} ${now.time} ${topic}`);
  const summary = stringOr(args.summary, `Ship verdict for ${planName}.`);
  const verification = toList(args.verification);
  const evidence = toList(args.evidence);
  const risks = toList(args.risks);
  const changedFiles = toList(args.changedFiles);
  const nextSteps = toList(args.nextSteps);

  const content = [
    "---",
    "type: ship-report",
    `date: ${now.date}`,
    `time: ${now.time}`,
    `verdict: ${verdict}`,
    `plan: "${escapeYaml(planName)}"`,
    "tags: [conducty, conducty/ship]",
    "---",
    "",
    `# ${linkName}`,
    "",
    "## Verdict",
    "",
    verdict,
    "",
    "## Summary",
    "",
    summary,
    "",
    "## Plan",
    "",
    `- [[${planName}]]`,
    "",
    "## Verification",
    "",
    ...bulletList(verification.length ? verification : ["not recorded"]),
    "",
    "## Evidence",
    "",
    ...bulletList(evidence.length ? evidence : ["not recorded"]),
    "",
    "## Risks",
    "",
    ...bulletList(risks.length ? risks : ["none"]),
    "",
    "## Changed Files",
    "",
    ...bulletList(changedFiles.length ? changedFiles : ["not recorded"]),
    "",
    "## Next Steps",
    "",
    ...bulletList(nextSteps.length ? nextSteps : ["none"]),
    "",
    "## Related",
    "",
    "- Index: [[Ship Reports Index]]",
    `- Plan: [[${planName}]]`,
    "- Accumulates from: [[Metrics]], [[Prompt Log]]",
    ""
  ].join("\n");

  fs.writeFileSync(reportPath, content, "utf8");
  prependIndexLink(safeVaultPath(vault.path, path.join("Indexes", "Ship Reports Index.md")), `- [[${linkName}]]`);

  return [
    "# Ship Report Created",
    "",
    `Report: [[${linkName}]]`,
    `Path: ${reportPath}`,
    `Plan: [[${planName}]]`,
    `Verdict: ${verdict}`
  ].join("\n");
}

function auditVaultGraphTool(args) {
  const vault = resolveVault(args);
  const limit = Math.max(1, Math.min(100, Number(args?.limit) || 10));
  const maxNotes = Math.max(1, Math.min(10000, Number(args?.maxNotes) || 1000));
  const maxBytesPerNote = Math.max(1024, Math.min(10 * 1024 * 1024, Number(args?.maxBytesPerNote) || 1024 * 1024));
  if (!fs.existsSync(vault.path)) {
    return [
      "# Conducty Vault Audit",
      "",
      `Vault: ${vault.path}`,
      "Verdict: missing vault",
      "",
      "Run `bootstrap_vault` before auditing the graph."
    ].join("\n");
  }

  const { notes, truncated, skippedLargeNotes } = listMarkdownNotes(vault.path, { maxNotes, maxBytesPerNote });
  const basenameGroups = groupNotesByBasename(notes);
  const byBasename = new Map([...basenameGroups].map(([basename, group]) => [basename, group[0]]));
  const inbound = new Map(notes.map((note) => [path.basename(note.fullPath, ".md"), 0]));
  const duplicateBasenames = [...basenameGroups]
    .filter(([, group]) => group.length > 1)
    .map(([basename, group]) => `${basename}: ${group.map((note) => note.relPath).join(", ")}`);
  const brokenLinks = [];

  for (const note of notes) {
    for (const target of parseWikiLinks(note.text)) {
      if (byBasename.has(target)) {
        inbound.set(target, (inbound.get(target) || 0) + 1);
      } else {
        brokenLinks.push({ source: note.relPath, target });
      }
    }
  }

  const orphanNotes = notes
    .filter((note) => isUserFacingNote(note.relPath))
    .filter((note) => (inbound.get(path.basename(note.fullPath, ".md")) || 0) === 0)
    .map((note) => note.relPath);

  const shipReportTexts = notes
    .filter((note) => note.relPath.startsWith(`Ship Reports${path.sep}`))
    .map((note) => note.text);
  const planNotes = notes.filter((note) => note.relPath.startsWith(`Plans${path.sep}`));
  const plansWithoutShipReport = planNotes
    .filter((note) => !shipReportTexts.some((text) => text.includes(`[[${path.basename(note.fullPath, ".md")}]]`)))
    .map((note) => note.relPath);
  const plansWithoutCheckpoint = planNotes
    .filter((note) => !/### Group .+ Checkpoint/.test(note.text))
    .map((note) => note.relPath);

  const problemCount = brokenLinks.length + duplicateBasenames.length + orphanNotes.length + plansWithoutShipReport.length + plansWithoutCheckpoint.length;
  const verdict = problemCount === 0 ? "clean" : "needs attention";

  return [
    "# Conducty Vault Audit",
    "",
    `Vault: ${vault.path}`,
    `Verdict: ${verdict}`,
    "",
    "## Summary",
    "",
    `- Notes: ${notes.length}`,
    `- Scan limit reached: ${truncated ? "yes" : "no"}`,
    `- Large notes skipped: ${skippedLargeNotes}`,
    `- Broken wikilinks: ${brokenLinks.length}`,
    `- Duplicate basenames: ${duplicateBasenames.length}`,
    `- Orphan user notes: ${orphanNotes.length}`,
    `- Plans without ship reports: ${plansWithoutShipReport.length}`,
    `- Plans without checkpoints: ${plansWithoutCheckpoint.length}`,
    "",
    "## Broken Wikilinks",
    "",
    ...exampleLines(brokenLinks.map((link) => `${link.source} -> [[${link.target}]]`), limit),
    "",
    "## Duplicate Basenames",
    "",
    ...exampleLines(duplicateBasenames, limit),
    "",
    "## Orphan User Notes",
    "",
    ...exampleLines(orphanNotes, limit),
    "",
    "## Plans Without Ship Reports",
    "",
    ...exampleLines(plansWithoutShipReport, limit),
    "",
    "## Plans Without Checkpoints",
    "",
    ...exampleLines(plansWithoutCheckpoint, limit)
  ].join("\n");
}

function generateObservatoryReportTool(args) {
  const vault = resolveVault(args);
  const limit = Math.max(1, Math.min(100, Number(args?.limit) || 10));
  const maxNotes = Math.max(1, Math.min(10000, Number(args?.maxNotes) || 1000));
  const maxBytesPerNote = Math.max(1024, Math.min(10 * 1024 * 1024, Number(args?.maxBytesPerNote) || 1024 * 1024));
  if (!fs.existsSync(vault.path)) {
    return [
      "# Conducty Observatory",
      "",
      `Vault: ${vault.path}`,
      "Verdict: missing vault",
      "",
      "Run `bootstrap_vault` before generating the Observatory report."
    ].join("\n");
  }

  const outputPath = resolveObservatoryOutputPath(vault.path, args?.output);
  const { summary } = buildObservatory({
    vaultPath: vault.path,
    outputPath,
    limit,
    maxNotes,
    maxBytesPerNote
  });

  return [
    "# Conducty Observatory Generated",
    "",
    `Vault: ${summary.vaultPath}`,
    `Report: ${summary.outputPath}`,
    "",
    "## Summary",
    "",
    `- Notes scanned: ${summary.notesScanned}`,
    `- Scan limit reached: ${summary.scanLimitReached ? "yes" : "no"}`,
    `- Large notes skipped: ${summary.largeNotesSkipped}`,
    `- Plans: ${summary.plans.total}`,
    `- Open plans: ${summary.plans.open}`,
    `- Shipped plans: ${summary.plans.shipped}`,
    `- Plans missing checkpoints: ${summary.plans.missingCheckpoints}`,
    `- Plans missing ship reports: ${summary.plans.missingShipReports}`,
    `- Broken wikilinks: ${summary.wikilinks.broken}`,
    `- Duplicate basenames: ${summary.wikilinks.duplicateBasenames}`,
    `- Improvements last 7 days: ${summary.learning.improvementsLast7Days}`,
    `- Improvements last 30 days: ${summary.learning.improvementsLast30Days}`,
    `- Token savings entries: ${summary.learning.tokenSavings.entries}`,
    `- Measured tokens saved: ${summary.learning.tokenSavings.savedTokens}`,
    `- Measured savings rate: ${summary.learning.tokenSavings.savingsRate.toFixed(1)}%`
  ].join("\n");
}

function resolveObservatoryOutputPath(vaultPath, output) {
  if (typeof output !== "string" || !output.trim()) {
    return safeVaultPath(vaultPath, "Conducty Observatory.html");
  }

  const candidate = path.isAbsolute(output)
    ? path.resolve(output)
    : path.resolve(vaultPath, output);
  assertInsideVault(vaultPath, candidate);
  return candidate;
}

function bootstrapVault(vaultPath) {
  for (const dir of ["", "Indexes", "Accumulators", "Plans", "Designs", "Improvements", "Code Reviews", "Ship Reports", "Kernel Contracts", "Context"]) {
    fs.mkdirSync(path.join(vaultPath, dir), { recursive: true });
  }

  seedNote(path.join(vaultPath, "Conducty Index.md"), [
    "---",
    "type: index",
    "tags: [conducty, conducty/index, conducty/root]",
    "---",
    "",
    "# Conducty Index",
    "",
    "Cycle: Shape -> Plan -> Trace -> Execute -> Verify -> Improve -> Code Review -> Ship.",
    "",
    "## Indexes",
    "",
    "- [[Plans Index]]",
    "- [[Designs Index]]",
    "- [[Context Index]]",
    "- [[Improvements Index]]",
    "- [[Ship Reports Index]]",
    "- [[Kernel Contracts Index]]",
    "",
    "## Accumulating",
    "",
    "- [[Failure Patterns]]",
    "- [[Metrics]]",
    "- [[Prompt Log]]",
    "- [[Token Savings Ledger]]",
    ""
  ].join("\n"));

  seedNote(path.join(vaultPath, "Indexes", "Plans Index.md"), indexNote("Plans Index", "Conducty plans. Newest first."));
  seedNote(path.join(vaultPath, "Indexes", "Designs Index.md"), indexNote("Designs Index", "Conducty design notes. Newest first."));
  seedNote(path.join(vaultPath, "Indexes", "Context Index.md"), indexNote("Context Index", "Per-project context summaries."));
  seedNote(path.join(vaultPath, "Indexes", "Improvements Index.md"), indexNote("Improvements Index", "Improvement kata entries. Newest first."));
  seedNote(path.join(vaultPath, "Indexes", "Ship Reports Index.md"), indexNote("Ship Reports Index", "Pre-merge ship reports. Newest first."));
  seedNote(path.join(vaultPath, "Indexes", "Kernel Contracts Index.md"), indexNote("Kernel Contracts Index", "Kernel state contracts. Newest first."));
  seedNote(path.join(vaultPath, "Accumulators", "Failure Patterns.md"), accumulatorNote("failure-patterns", "Failure Patterns", "Newest first."));
  seedNote(path.join(vaultPath, "Accumulators", "Metrics.md"), [
    "---",
    "type: metrics",
    "tags: [conducty, conducty/metrics]",
    "---",
    "",
    "# Metrics",
    "",
    "Newest first.",
    "",
    "| Date | Plan | Prompts | Done | Pass Rate | Retries | Appetite | Note |",
    "|---|---|---:|---:|---:|---:|---|---|",
    ""
  ].join("\n"));
  seedNote(path.join(vaultPath, "Accumulators", "Prompt Log.md"), accumulatorNote("prompt-log", "Prompt Log", "Newest first."));
  seedNote(path.join(vaultPath, "Accumulators", "Token Savings Ledger.md"), [
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

function seedNote(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function normalizePrompts(inputPrompts, defaults) {
  const rawPrompts = Array.isArray(inputPrompts) && inputPrompts.length
    ? inputPrompts
    : [{
        id: "P1",
        title: defaults.topic,
        acceptanceCriteria: defaults.acceptance,
        noGoZones: defaults.noGo,
        verification: defaults.verification,
        timeBudget: defaults.appetite,
        reviewLevel: "verify-only",
        tracer: true,
        dependencies: []
      }];

  let hasTracer = rawPrompts.some((prompt) => prompt?.tracer);
  return rawPrompts.map((prompt, index) => {
    const normalized = {
      id: stringOr(prompt?.id, `P${index + 1}`),
      title: stringOr(prompt?.title, index === 0 ? defaults.topic : `Prompt ${index + 1}`),
      context: toList(prompt?.context),
      acceptanceCriteria: toList(prompt?.acceptanceCriteria).length ? toList(prompt?.acceptanceCriteria) : defaults.acceptance,
      noGoZones: toList(prompt?.noGoZones).length ? toList(prompt?.noGoZones) : defaults.noGo,
      verification: stringOr(prompt?.verification, defaults.verification),
      timeBudget: stringOr(prompt?.timeBudget, defaults.appetite),
      reviewLevel: ["verify-only", "spec-review", "full-review"].includes(prompt?.reviewLevel) ? prompt.reviewLevel : "verify-only",
      tracer: hasTracer ? Boolean(prompt?.tracer) : index === 0,
      dependencies: toList(prompt?.dependencies)
    };
    if (!hasTracer && index === 0) hasTracer = true;
    return normalized;
  });
}

function renderPlan(plan) {
  const promptSections = plan.prompts.map((prompt) => [
    `### ${prompt.id} - ${prompt.title}`,
    "",
    `Tracer: ${prompt.tracer ? "yes" : "no"}`,
    `Review: ${prompt.reviewLevel}`,
    `Budget: ${prompt.timeBudget}`,
    `Dependencies: ${prompt.dependencies.length ? prompt.dependencies.join(", ") : "none"}`,
    "",
    "Context:",
    ...bulletList(prompt.context.length ? prompt.context : ["TBD"]),
    "",
    "Acceptance criteria:",
    ...bulletList(prompt.acceptanceCriteria.length ? prompt.acceptanceCriteria : ["TBD"]),
    "",
    "No-go zones:",
    ...bulletList(prompt.noGoZones.length ? prompt.noGoZones : ["TBD"]),
    "",
    `Verify: ${prompt.verification || "TBD"}`,
    ""
  ].join("\n")).join("\n");

  return [
    "---",
    "type: plan",
    `date: ${plan.date}`,
    `time: ${plan.time}`,
    `topic: "${escapeYaml(plan.topic)}"`,
    `appetite: "${escapeYaml(plan.appetite)}"`,
    `project: "${escapeYaml(plan.project)}"`,
    "tags: [conducty, conducty/plan]",
    "---",
    "",
    `# ${plan.linkName}`,
    "",
    "## Goal",
    "",
    plan.goal,
    "",
    "## Appetite",
    "",
    plan.appetite,
    "",
    "## Acceptance Criteria",
    "",
    ...bulletList(plan.acceptance.length ? plan.acceptance : ["TBD"]),
    "",
    "## No-Go Zones",
    "",
    ...bulletList(plan.noGo.length ? plan.noGo : ["TBD"]),
    "",
    "## Verification",
    "",
    plan.verification || "TBD",
    "",
    "## Prompt Groups",
    "",
    "### Group A",
    "",
    promptSections,
    "## Checkpoint Notes",
    "",
    "No checkpoints yet.",
    "",
    "## Hill Chart",
    "",
    "- Goal: uphill",
    "",
    "## Related",
    "",
    "- Index: [[Plans Index]]",
    "- Accumulates into: [[Failure Patterns]], [[Metrics]], [[Prompt Log]]",
    ""
  ].join("\n");
}

function prependIndexLink(indexPath, linkLine) {
  const existing = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
  if (existing.includes(linkLine)) return;
  const lines = existing.split(/\r?\n/);
  const insertAt = lines.findIndex((line) => line.startsWith("- [["));
  if (insertAt === -1) {
    fs.writeFileSync(indexPath, `${existing.trimEnd()}\n\n${linkLine}\n`, "utf8");
    return;
  }
  lines.splice(insertAt, 0, linkLine);
  fs.writeFileSync(indexPath, lines.join("\n"), "utf8");
}

function prependAfterHeading(filePath, line) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (!existing.trim()) {
    fs.writeFileSync(filePath, `${line}\n`, "utf8");
    return;
  }
  const lines = existing.split(/\r?\n/);
  let insertAt = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("- ")) {
      insertAt = i;
      break;
    }
  }
  if (insertAt === lines.length) {
    lines.push("", line);
  } else {
    lines.splice(insertAt, 0, line);
  }
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

function prependTableRow(filePath, row) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (!existing.trim()) {
    fs.writeFileSync(filePath, `${row}\n`, "utf8");
    return;
  }
  const lines = existing.split(/\r?\n/);
  const delimiterIndex = lines.findIndex((line) => /^\|\s*-+/.test(line));
  if (delimiterIndex === -1) {
    lines.push("", row);
  } else {
    lines.splice(delimiterIndex + 1, 0, row);
  }
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

function ensureSectionAndAppend(filePath, heading, entry) {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(heading)) {
    content = `${content.trimEnd()}\n\n${heading}\n\n`;
  }

  const headingIndex = content.indexOf(heading);
  const sectionStart = headingIndex + heading.length;
  const nextHeadingIndex = content.indexOf("\n## ", sectionStart);
  const beforeSection = content.slice(0, sectionStart);
  const sectionBody = content
    .slice(sectionStart, nextHeadingIndex === -1 ? content.length : nextHeadingIndex)
    .replace(/\n\nNo checkpoints yet\.\s*/m, "\n\n")
    .trimEnd();
  const afterSection = nextHeadingIndex === -1 ? "" : content.slice(nextHeadingIndex);

  content = `${beforeSection}${sectionBody}\n\n${entry}\n${afterSection}`;
  fs.writeFileSync(filePath, content, "utf8");
}

function noteDirsForType(type) {
  switch (type) {
    case "plans": return ["Plans"];
    case "improvements": return ["Improvements"];
    case "code_reviews": return ["Code Reviews"];
    case "ship_reports": return ["Ship Reports"];
    case "kernel_contracts": return ["Kernel Contracts"];
    case "accumulators": return ["Accumulators"];
    case "all": return ["Plans", "Designs", "Improvements", "Code Reviews", "Ship Reports", "Kernel Contracts", "Accumulators"];
    default: return ["Plans"];
  }
}

function findPlanPath(vaultPath, plan) {
  const raw = String(plan || "").trim().replace(/^\[\[/, "").replace(/\]\]$/, "");
  if (!raw) return null;

  // Soft-null for both symlink-reject and escape-reject — findPlanPath callers
  // treat a missing plan as a normal "not found" condition rather than an
  // error, and we never want to hand a symlinked path to a write site.
  const checkContainment = (candidate) => {
    try {
      assertInsideVault(vaultPath, candidate);
      return true;
    } catch {
      return false;
    }
  };

  if (fs.existsSync(raw) && fs.statSync(raw).isFile()) {
    const resolved = path.resolve(raw);
    if (!checkContainment(resolved)) return null;
    return resolved;
  }

  const basename = path.basename(raw, path.extname(raw));
  const plansDir = safeVaultPath(vaultPath, "Plans");
  if (!fs.existsSync(plansDir)) return null;

  for (const file of fs.readdirSync(plansDir)) {
    if (!file.endsWith(".md")) continue;
    if (path.basename(file, ".md") === basename || file === raw || file === `${raw}.md`) {
      const candidate = path.join(plansDir, file);
      if (!checkContainment(candidate)) return null;
      return candidate;
    }
  }

  return null;
}

function listMarkdownNotes(vaultPath, options = {}) {
  const maxNotes = Math.max(1, Number(options.maxNotes) || 1000);
  const maxBytesPerNote = Math.max(1024, Number(options.maxBytesPerNote) || 1024 * 1024);
  const notes = [];
  let truncated = false;
  let skippedLargeNotes = 0;
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (notes.length >= maxNotes) {
        truncated = true;
        return;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith(".")) continue;
        visit(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const stat = fs.statSync(fullPath);
        if (stat.size > maxBytesPerNote) {
          skippedLargeNotes += 1;
          continue;
        }
        notes.push({
          fullPath,
          relPath: path.relative(vaultPath, fullPath),
          text: fs.readFileSync(fullPath, "utf8")
        });
      }
    }
  };

  for (const root of ["Conducty Index.md", "Indexes", "Accumulators", "Plans", "Designs", "Improvements", "Code Reviews", "Ship Reports", "Kernel Contracts", "Context"]) {
    const fullPath = path.join(vaultPath, root);
    if (!fs.existsSync(fullPath)) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      visit(fullPath);
    } else if (stat.isFile() && fullPath.endsWith(".md")) {
      if (notes.length >= maxNotes) {
        truncated = true;
        continue;
      }
      if (stat.size > maxBytesPerNote) {
        skippedLargeNotes += 1;
        continue;
      }
      notes.push({
        fullPath,
        relPath: path.relative(vaultPath, fullPath),
        text: fs.readFileSync(fullPath, "utf8")
      });
    }
  }
  notes.sort((a, b) => a.relPath.localeCompare(b.relPath));
  return { notes, truncated, skippedLargeNotes };
}

function groupNotesByBasename(notes) {
  const groups = new Map();
  for (const note of notes) {
    const basename = path.basename(note.fullPath, ".md");
    const group = groups.get(basename) || [];
    group.push(note);
    groups.set(basename, group);
  }
  return groups;
}

function parseWikiLinks(text) {
  const links = [];
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  let match;
  while ((match = pattern.exec(text))) {
    const target = path.basename(match[1].trim(), ".md");
    if (target) links.push(target);
  }
  return links;
}

function isUserFacingNote(relativePath) {
  return !(
    relativePath === "Conducty Index.md" ||
    relativePath.startsWith(`Indexes${path.sep}`) ||
    relativePath.startsWith(`Accumulators${path.sep}`)
  );
}

function exampleLines(items, limit) {
  if (!items.length) return ["- none"];
  const visible = items.slice(0, limit).map((item) => `- ${item}`);
  const hidden = items.length - visible.length;
  return hidden > 0 ? [...visible, `- ...and ${hidden} more`] : visible;
}

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}${pad(now.getMinutes())}`
  };
}

function safeTitle(value) {
  const title = String(value || "Untitled")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return title || "Untitled";
}

function uniqueVaultNote(vaultPath, dir, basename) {
  const safeBasename = safeTitle(basename);
  for (let index = 1; index <= 1000; index += 1) {
    const suffix = index === 1 ? "" : ` ${index}`;
    const fileName = `${safeBasename}${suffix}.md`;
    let filePath;
    try {
      filePath = safeVaultPath(vaultPath, path.join(dir, fileName));
    } catch (error) {
      if (/symlink/i.test(error instanceof Error ? error.message : String(error))) {
        continue;
      }
      throw error;
    }
    if (!pathExistsOrSymlink(filePath)) {
      return {
        fileName,
        filePath,
        linkName: path.basename(fileName, ".md")
      };
    }
  }
  throw new Error(`Could not allocate unique note path for ${dir}/${safeBasename}.md`);
}

function summarizeGoal(goal) {
  return String(goal)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 6)
    .join(" ") || "Plan";
}

function safeVaultPath(vaultPath, relativePath) {
  const base = path.resolve(vaultPath);
  const target = path.resolve(base, relativePath);
  assertInsideVault(base, target);
  return target;
}

// Realpath-aware containment check. Resolves the vault root via
// fs.realpathSync.native, then walks up the candidate to its nearest existing
// ancestor (handling the case where we're about to create a new file/dir),
// realpaths that ancestor, re-joins the unresolved tail, and finally tests
// containment against the realpathed root. If the candidate itself exists and
// is a symlink, refuse — every write site would otherwise dereference the
// symlink and clobber whatever the target points at. Throws on escape; returns
// void on legal paths. Callers that want a soft-null on failure (e.g.
// findPlanPath) wrap in try/catch — the helper itself does not know.
function assertInsideVault(vaultRoot, candidate) {
  const resolvedRoot = path.resolve(vaultRoot);
  let realRoot;
  try {
    realRoot = fs.realpathSync.native(resolvedRoot);
  } catch {
    realRoot = resolvedRoot;
  }

  const resolvedCandidate = path.resolve(candidate);

  // Reject if the candidate itself is a symlink. Use lstat so we don't follow,
  // and do not gate with existsSync: broken symlinks return false there.
  let candidateStat = null;
  try {
    candidateStat = fs.lstatSync(resolvedCandidate);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (candidateStat?.isSymbolicLink()) {
    throw new Error(`Refusing to write through symlink: ${candidate}`);
  }

  // Walk up to the nearest existing ancestor so we can realpath it. The tail
  // (parts that don't yet exist) is re-joined as a literal path segment.
  let ancestor = resolvedCandidate;
  const tail = [];
  while (!fs.existsSync(ancestor)) {
    const parent = path.dirname(ancestor);
    if (parent === ancestor) break;
    tail.unshift(path.basename(ancestor));
    ancestor = parent;
  }

  let realAncestor;
  try {
    realAncestor = fs.realpathSync.native(ancestor);
  } catch {
    realAncestor = ancestor;
  }
  const realCandidate = tail.length ? path.join(realAncestor, ...tail) : realAncestor;

  const rel = path.relative(realRoot, realCandidate);
  if (rel === "") return;
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Path escapes vault: ${candidate}`);
  }
}

function pathExistsOrSymlink(filePath) {
  try {
    fs.lstatSync(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function wikilink(value) {
  const raw = String(value || "").trim();
  if (!raw) return "[[Unknown Plan]]";
  if (raw.startsWith("[[") && raw.endsWith("]]")) return raw;
  return `[[${path.basename(raw, path.extname(raw))}]]`;
}

function plainWikilinks(value) {
  return String(value || "").replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g, "$1");
}

function toList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function bulletList(items) {
  return items.map((item) => `- ${item}`);
}

function markdownTableCell(value) {
  return String(value || "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function formatTokenCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return String(Math.round(number));
}

function stringOr(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function requireString(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required string: ${name}`);
  }
}

function escapeYaml(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const inputState = {
  pending: ""
};

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  inputState.pending += chunk;
  drainInput();
});

process.stdin.on("error", (error) => {
  console.error(error instanceof Error ? error.message : String(error));
});

function drainInput() {
  let newlineIndex;
  while ((newlineIndex = inputState.pending.indexOf("\n")) !== -1) {
    const line = inputState.pending.slice(0, newlineIndex);
    inputState.pending = inputState.pending.slice(newlineIndex + 1);

    // Ignore empty lines (bare \n) — do not emit a parse error.
    if (line.length === 0) continue;

    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      sendError(null, -32700, `Parse error: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    try {
      handleMessage(message);
    } catch (error) {
      sendError(message.id ?? null, -32603, error instanceof Error ? error.message : String(error));
    }
  }
}

function handleMessage(message) {
  const id = message.id;
  const method = message.method;

  if (method === "initialize") {
    sendResult(id, {
      protocolVersion: message.params?.protocolVersion || "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: SERVER_INFO
    });
    return;
  }

  if (method === "notifications/initialized") {
    return;
  }

  if (method === "ping") {
    sendResult(id, {});
    return;
  }

  if (method === "tools/list") {
    sendResult(id, {
      tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
    });
    return;
  }

  if (method === "tools/call") {
    const name = message.params?.name;
    const tool = TOOL_MAP.get(name);
    if (!tool) {
      sendError(id, -32602, `Unknown tool: ${name}`);
      return;
    }

    const result = tool.handler(message.params?.arguments || {});
    sendResult(id, {
      content: [{ type: "text", text: String(result) }]
    });
    return;
  }

  if (id !== undefined) {
    sendError(id, -32601, `Method not found: ${method}`);
  }
}

function sendResult(id, result) {
  if (id === undefined || id === null) return;
  writeMessage({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  writeMessage({ jsonrpc: "2.0", id, error: { code, message } });
}

function writeMessage(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}
