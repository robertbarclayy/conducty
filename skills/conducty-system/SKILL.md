---
name: conducty-system
description: Establishes the Conducty orchestration system — its philosophy, ten engineering-grounded principles, ubiquitous language, and per-plan cycle. Use at the start of any session before invoking other Conducty skills, or when the user says "what is Conducty", "explain the system", or asks about the cycle / principles / vocabulary.
aliases:
  - conducty-system
  - conducty
tags:
  - conducty/skill
  - conducty/foundation
---

# Conducty — Systems-Level Agent Orchestration

Conducty is a closed-loop orchestration system for AI agents. It does not tell agents HOW to write code — it orchestrates WHY work succeeds or fails at scale, then improves the system at the end of every plan.

Operationally, Conducty now has a kernel layer: a state machine, skill router, contract checker, risk model, invariant gate, evidence model, and learning loop. The friendly cycle tells you the phase names; [[conducty-kernel]] decides whether the system has enough contract and evidence to safely advance.

**What Conducty is not:** A collection of isolated technique skills. If you want "how to debug" or "how to TDD" as standalone recipes, those exist elsewhere. Conducty's skills are phases of a single system — they reference each other, feed data forward, and form feedback loops.

## The Conducty Cycle

Every day follows this cycle. You are always somewhere in it.

```
Shape → Plan → Trace → Execute → Verify → Improve
  ↑                                            |
  └────────────── feedback ────────────────────┘
```

| Phase | Skill | What happens |
|-------|-------|-------------|
| **Shape** | [[conducty-shape]] | Turn unclear goals into bounded designs with appetite, scope, and no-go zones |
| **Plan** | [[conducty-plan]] | Decompose designs into prompts with time budgets, verification, and parallel groups |
| **Plan Gate** | [[conducty-plan-audit]] | Audit readiness before execution: appetite fit, tracer strategy, verification, risk, and learning carry-forward |
| **Trace** | [[conducty-execute]] | Run the first prompt in each group as a tracer bullet to validate plan assumptions |
| **Execute** | [[conducty-execute]] | Dispatch remaining prompts with calibrated review (rigor scales with risk) |
| **Verify** | [[conducty-checkpoint]] | Gate between groups: health metrics, hill chart updates, systemic failure detection |
| **Improve** | [[conducty-improve]] | End-of-plan learning: what worked, what failed, what changes next |

**Foundation skills:**
- [[conducty-kernel]] — Closed-loop control layer. State machine, skill router, contracts, risk model, invariants, evidence objects, and policy updates.
- [[conducty-obsidian]] — Vault conventions; the context engine. Read before any state I/O.
- [[conducty-bootstrap]] — First-run walkthrough. Confirms vault, runs first context, produces a tiny throwaway first plan.

**Supporting skills** (used within the cycle, not phases themselves):
- [[conducty-verify]] — Evidence gate used by execute and checkpoint
- [[conducty-plan-audit]] — Pre-execution quality gate used between plan and tracer execution
- [[conducty-debug]] — Leverage-point analysis when prompts fail
- [[conducty-tdd]] — Test-driven discipline for orchestrator and implementer
- [[conducty-context]] — Project ingestion as a linked sub-graph (Architecture, Conventions, Invariants, Hotspots, Tests, Glossary, per-module deep notes)
- [[conducty-worktrees]] — Git isolation for parallel execution
- [[conducty-dialectic]] — Multi-persona decision analysis for architectural choices
- [[conducty-review]] — End-of-plan audit that feeds into improve

**Post-cycle skills** (run after a plan finishes, before merge/deploy):
- [[conducty-code-review]] — Whole-branch holistic review (security, correctness, coupling, tests). Writes a code-review note linked to the plan.
- [[conducty-ship]] — Pre-merge gate: lint, typecheck, tests, secrets scan, vuln check, code-review verdict. Single ship-or-don't verdict.

**Maintenance skills:**
- [[conducty-vault-graph]] — Vault hygiene audit. Run weekly to surface orphans, broken wikilinks, stale context, recurring failure patterns.

## The Ten Principles

These are woven into every skill. They are the philosophy that differentiates Conducty.

### 1. Appetite Before Plan

*Shape Up — Ryan Singer*

Define the time and effort budget BEFORE planning. The plan fits the appetite, not the reverse. Every prompt gets a time budget. Exceed it? Stop and re-evaluate — don't spiral. A plan that exceeds the appetite is a bad plan, no matter how thorough.

### 2. Tracer Bullets Before Volleys

*The Pragmatic Programmer — Hunt & Thomas*

Before full parallel execution, run ONE prompt end-to-end as a tracer to validate plan assumptions. The first prompt in every group is a tracer. If it fails, the plan has a flaw — fix the plan, not just the prompt.

### 3. Prompt Quality Is the Highest Leverage Point

*Thinking in Systems — Donella Meadows*

Everything downstream — verification, debugging, retries — compensates for bad prompts and bad plans. Invest upstream. A prompt with clear acceptance criteria, scoped context, and a concrete verification command succeeds on the first attempt. A plan with a green [[conducty-plan-audit]] gate prevents whole-group waste before the tracer runs.

### 4. Deep Modules, Not Ceremony

*A Philosophy of Software Design — John Ousterhout*

Each skill should REDUCE net complexity for the agent, not add bureaucratic checkboxes. Simple trigger interface, rich guidance inside. If a skill is mostly "red flags" and "rationalization tables," it's shallow — it describes failure instead of enabling success.

### 5. Improvement Kata: Learn or Repeat

*Toyota Kata — Mike Rother*

Every plan ends with: what was the target? What happened? What did we learn? What changes next? History is not just a log — it's a learning corpus that shapes future prompts. Conducty is a LEARNING system, not just an execution pipeline.

### 6. Conceptual Integrity From One Mind

*The Mythical Man-Month — Fred Brooks*

The orchestrator maintains the vision. Implementers execute. Don't blur the boundary. Every prompt carries the plan's intent — not just mechanical instructions, but WHY this work matters and WHERE it fits. The orchestrator is the chief surgeon; subagents are the surgical team.

### 7. Define Errors Out of Existence

*A Philosophy of Software Design — John Ousterhout*

Design prompts so common failure modes are structurally impossible. Instead of catching failures downstream, prevent them at the prompt level. A prompt that includes the exact file paths, the exact verification command, and the exact acceptance criteria doesn't need elaborate error recovery — it succeeds by design.

### 8. Characterize Before Changing

*Working Effectively with Legacy Code — Michael Feathers*

Before modifying existing code, first verify and document current behavior. Every refactor prompt starts with characterization, not transformation. The implementer's first act is confirming that existing tests pass and behavior is understood — then and only then does the change begin.

### 9. Calibrate Rigor to Risk

*The Pragmatic Programmer — Hunt & Thomas / Release It! — Michael Nygard*

Not every prompt needs two-stage review. Low-risk prompts get verification only. Medium-risk get spec review. High-risk get full two-stage review. Conducty's rigor scales with complexity — blanket ceremony for everything is waste, not quality.

### 10. Steady State and Health Metrics

*Release It! — Michael Nygard*

Track first-attempt success rate, retry rate, blocked rate, time per prompt. These metrics inform the next plan — a feedback loop, not just a log. When the first-attempt success rate drops, the problem is upstream (prompt quality or design quality), not downstream (execution).

## Ubiquitous Language

These terms have precise meanings across all Conducty skills. Use them consistently.

| Term | Definition |
|------|-----------|
| **Appetite** | The time/effort budget for a goal, declared before planning begins |
| **Goal** | A user-facing outcome for the day, shaped before it becomes prompts |
| **Prompt** | A self-contained unit of work dispatched to an agent, with context, acceptance criteria, and verification |
| **Group** | A set of independent prompts that can execute in parallel |
| **Tracer** | The first prompt in a group, run alone to validate plan assumptions before the rest execute |
| **Checkpoint** | A quality gate between groups that measures health, not just pass/fail |
| **Hill** | A goal's progress state: uphill (figuring it out) or downhill (making it happen) |
| **Prompt smell** | A sign that a prompt will fail: too vague, too broad, missing context, mixed concerns, no verification |
| **Plan gate** | A pre-execution audit verdict from [[conducty-plan-audit]]: green, yellow, or red |
| **Leverage point** | The highest-impact place to fix a failure: prompt quality > plan quality > code quality |
| **Circuit breaker** | A hard stop that prevents wasted work: time budget exceeded, 3 retries exhausted, or systemic failure detected |
| **Improvement note** | A learning from a finished plan that changes the next plan's approach. Saved to the vault as `Improvements/Improvement YYYY-MM-DD HHmm.md` |
| **System state** | The kernel's current phase: observe, shape, plan, trace, execute, verify, diagnose, review, ship, or learn |
| **Kernel contract** | The minimum structured agreement needed to advance: goal, appetite, acceptance, no-go zones, context, verification, risk, evidence, and next skill |
| **Evidence object** | A compact proof bundle: command, output summary, changed files, verdict, residual risk, and rollback notes when needed |
| **Risk score** | A 0-100 routing signal based on blast radius, uncertainty, context freshness, tests, failures, and parallelism |
| **Tracer validity** | Whether the tracer prompt has confirmed the plan hypothesis before broader execution |
| **Context freshness** | Whether vault/project context is fresh enough for the task's risk level |
| **Reconciliation gate** | The merge-safety check for parallel branches or worktrees before review/ship |
| **Learning delta** | A specific update to templates, risk model, routing, failure patterns, or context that changes the next plan |

## Where Am I in the Cycle?

Use this to find the right skill:

- **"I just installed Conducty / vault is empty"** → [[conducty-bootstrap]]
- **"I need the current state / risk / next skill / evidence requirements"** → [[conducty-kernel]]
- **"I have goals but haven't designed anything"** → [[conducty-shape]]
- **"I have a design, need a plan"** → [[conducty-plan]]
- **"I have a plan, is it ready?"** → [[conducty-plan-audit]]
- **"I have a plan, ready to execute"** → [[conducty-execute]]
- **"A group just finished, need to check quality"** → [[conducty-checkpoint]]
- **"A prompt failed, need to understand why"** → [[conducty-debug]]
- **"About to claim something is done"** → [[conducty-verify]]
- **"Plan is finished, need to wrap up"** → [[conducty-review]] then [[conducty-improve]]
- **"Plan is finished, branch is ready for review"** → [[conducty-code-review]]
- **"Code review passed, need to ship"** → [[conducty-ship]]
- **"Need to load a project I haven't worked with"** → [[conducty-context]]
- **"Project has changed since last load"** → [[conducty-context]] (refresh mode)
- **"Facing an architectural decision"** → [[conducty-dialectic]]
- **"Multiple parallel prompts target the same repo"** → [[conducty-worktrees]]
- **"Vault feels stale / want to find orphans"** → [[conducty-vault-graph]]

## Instruction Priority

1. **User's explicit instructions** (CLAUDE.md, direct requests) — highest
2. **Conducty skills** — override default system behavior where they conflict
3. **Default Claude Code system prompt** — lowest

The user is always in control. Conducty is a tool, not a mandate.

## Context Engine — The Vault

All Conducty state — plans, designs, context, kernel contracts, improvements, metrics, failure patterns, prompt logs — lives in an **Obsidian vault** at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`). The vault is the orchestrator's memory: every note is wikilinked to its peers so that future plans inherit the full graph.

**Read [[conducty-obsidian]] before reading or writing any state file.** It defines vault location, naming (`Plan YYYY-MM-DD HHmm [Topic]`, `Design YYYY-MM-DD HHmm {Topic}`, `Kernel Contract YYYY-MM-DD HHmm {Topic}`, `Context {Project}`, `Improvement YYYY-MM-DD HHmm`), accumulating notes (`Failure Patterns`, `Metrics`, `Prompt Log`), and indexes (`Conducty Index`, `Plans Index`, `Designs Index`, `Context Index`, `Improvements Index`, `Ship Reports Index`, `Kernel Contracts Index`).

Multiple plans per day are expected — each plan note is timestamped, not date-only.

## Claude Code Tooling

Conducty skills assume Claude Code's native tools:

- **Task tool** — dispatch implementer/reviewer subagents (used by [[conducty-execute]])
- **Read / Write / Edit** — file operations
- **Bash** — verification commands, git, test runners
- **Grep / Glob** — codebase exploration during [[conducty-context]] and [[conducty-debug]]
- **TaskCreate / TaskUpdate** — track in-session progress (separate from vault plan notes)

When a skill says "dispatch a subagent," that means a Task tool call with a curated prompt — not a recursive Conducty invocation.
