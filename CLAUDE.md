---
aliases:
  - Conducty
  - conducty
tags:
  - conducty
  - conducty/index
---

# Conducty

AI Workflow Orchestrator for Claude Code — systems-level orchestration of agents with per-plan cycles, tracer-first execution, calibrated review, and continuous improvement. **The context engine is an Obsidian vault.**

Conducty also has a kernel layer: a state machine, skill router, contract checker, risk model, invariant gate, evidence model, and policy-update loop. Use [[conducty-kernel]] when you need to know the current state, next skill, risk score, contract gaps, or evidence required before advancing.

## The Context Engine

Conducty's plans, designs, project context, kernel contracts, improvements, failure patterns, metrics, and prompt logs all live in an **Obsidian vault** at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`). Every note is wikilinked to its peers — designs link to the plans that consume them, plans link to the context they loaded and the improvements they're testing, kernel contracts capture state/risk/evidence decisions, and failure patterns link to the prompts that surfaced them. Future plans navigate this graph rather than re-grepping a flat history.

**Read [[conducty-obsidian]] before reading or writing any state.** It defines the vault location, naming, frontmatter, link conventions, and indexes.

> [!important] Per plan, not per day
> Conducty runs **per plan**, not per day. Multiple plans per day are normal. Plan notes are timestamped: `Plan YYYY-MM-DD HHmm [Topic].md`. The same applies to designs and improvements. Accumulating notes (`Failure Patterns`, `Metrics`, `Prompt Log`) are singular files appended to over time.

## Skills

Claude Code discovers Conducty skills from `~/.claude/skills/` after running `./install-claude-code.sh`. Each skill is a folder with a `SKILL.md` file that Claude loads on demand based on its `description` trigger.

| Skill | Phase | Trigger |
|-------|-------|---------|
| [[conducty-system]] | foundation | session start, "what is Conducty" |
| [[conducty-kernel]] | foundation | state/risk assessment, next skill routing, contracts, invariant checks |
| [[conducty-obsidian]] | context engine | before any state I/O — vault conventions |
| [[conducty-bootstrap]] | onboarding | first run, "set up Conducty", empty vault |
| [[conducty-shape]] | shape | "shape", "design", "brainstorm" |
| [[conducty-plan]] | plan | "plan", "batch plan", "create a plan" |
| [[conducty-plan-audit]] | plan gate | "audit this plan", "quality gate", "ready to execute" |
| [[conducty-tdd]] | discipline | "TDD", "red-green-refactor" |
| [[conducty-terse]] | discipline | "terse mode", "compress prompts", "tight prompts" |
| [[conducty-execute]] | execute | "execute the plan", "run group A" |
| [[conducty-verify]] | verify | before any "done" / "passed" claim |
| [[conducty-debug]] | debug | "why did this fail", "investigate" |
| [[conducty-checkpoint]] | checkpoint | "checkpoint", group boundary |
| [[conducty-review]] | review | "review this plan" |
| [[conducty-improve]] | improve | "what did we learn", "retrospective" |
| [[conducty-code-review]] | post-plan | "review my changes", "review this PR", whole-branch holistic review |
| [[conducty-ship]] | ship gate | "ship it", "ready to merge", pre-merge battery |
| [[conducty-context]] | support | "load context", "refresh context", "ingest project" |
| [[conducty-worktrees]] | support | parallel prompts, same repo |
| [[conducty-dialectic]] | decision | "analyze this decision", "debate this" |
| [[conducty-vault-graph]] | maintenance | "vault audit", "vault health", weekly hygiene |

## Vault Layout (recap)

Vault is **nested by category** — per-instance notes get a directory, per-project context lives under `Context/{Project}/`, accumulators live under `Accumulators/`. Wikilinks resolve by basename across all subfolders, so directory placement is purely organizational. See [[conducty-obsidian]] for the full layout reference.

Per-instance notes (timestamped) — directory + filename pattern:

- `Plans/Plan YYYY-MM-DD HHmm [Topic].md`
- `Designs/Design YYYY-MM-DD HHmm {Topic}.md`
- `Improvements/Improvement YYYY-MM-DD HHmm.md`
- `Code Reviews/Code Review YYYY-MM-DD HHmm.md`
- `Ship Reports/Ship Report YYYY-MM-DD HHmm.md`
- `Kernel Contracts/Kernel Contract YYYY-MM-DD HHmm {Topic}.md`

Project context is a **sub-graph** under `Context/{Project}/` — one hub plus several slices (see [[conducty-context]]):

- `Context/{Project}/Context {Project}.md` (hub)
- `Context/{Project}/Context {Project} Architecture.md`, `... Conventions.md`, `... Invariants.md`, `... Hotspots.md`, `... Tests.md`, `... Glossary.md`
- `Context/{Project}/Modules/Context {Project} {Module}.md` (per bounded-context, optional)
- `Context/{Project}/Refreshes/Context Refresh {Project} YYYY-MM-DD HHmm.md` (per refresh)

Indexes:

- `Conducty Index.md` (vault root)
- `Indexes/Plans Index.md`, `Indexes/Designs Index.md`, `Indexes/Context Index.md`, `Indexes/Improvements Index.md`, `Indexes/Ship Reports Index.md`, `Indexes/Kernel Contracts Index.md`

Accumulating notes (singular files, prepend new entries):

- `Accumulators/Failure Patterns.md`
- `Accumulators/Metrics.md`
- `Accumulators/Prompt Log.md`

## Claude Code Tooling

Conducty skills assume Claude Code's native tools:

- **Task tool** — dispatch implementer/reviewer subagents (used by [[conducty-execute]]). Pass `isolation: "worktree"` for automatic worktree handling, or use [[conducty-worktrees]] for explicit named worktrees.
- **Read / Write / Edit** — file operations (prefer Edit on existing notes; Write only for new ones)
- **Bash** — verification commands, git, test runners, `mkdir`/`ls` against the vault
- **Grep / Glob** — codebase exploration during [[conducty-context]] and [[conducty-debug]], vault navigation in [[conducty-plan]]
- **TaskCreate / TaskUpdate** — in-session progress tracking (separate from vault plan notes)

## Configuration

The vault path is resolved from `$CONDUCTY_VAULT`, falling back to `~/Obsidian/Conducty/`. Set the env var in your shell profile if you keep your vault elsewhere:

```bash
export CONDUCTY_VAULT="$HOME/Documents/Obsidian Vault/Conducty"
```

The installer (`install-claude-code.sh`) seeds the vault and indexes on first run. If the vault doesn't exist yet, [[conducty-obsidian]] will lazily create it and the seed indexes on first write.

## Rules

The following rules apply to all Conducty workflows. They are appended to `~/.claude/CLAUDE.md` by `install-claude-code.sh`.


# Conducty Quality Principles

**Appetite before plan.** Define the time budget before planning. The plan fits the appetite. A prompt that exceeds its time budget triggers a circuit breaker — stop and re-evaluate, don't spiral.

**Tracer before volley.** Run one prompt end-to-end before parallel execution. If the tracer fails, fix the plan — not just the prompt. Plan assumptions are hypotheses until a tracer validates them.

**Prompt quality is leverage.** Everything downstream compensates for bad prompts. Invest upstream: clear acceptance criteria, scoped context, concrete verification. Check for prompt smells before finalizing any plan.

**Plan gate before execution.** Use [[conducty-plan-audit]] before tracer execution. A red gate stops the plan; a yellow gate gets revised or explicitly accepted; a green gate spends agent time.

**Evidence before claims.** No completion claims without fresh verification output. Use [[conducty-verify]]. Rigor scales with risk: verify-only for low, spec review for medium, full two-stage for high.

**Root cause before fixes.** When a prompt fails, ask WHERE the leverage point is: prompt quality, plan quality, or code quality. Fix at the highest level. Use [[conducty-debug]]. Three failures on the same prompt = circuit breaker — escalate.

**Design before implementation.** For non-trivial goals, use [[conducty-shape]] to define appetite, boundaries, and no-go zones before writing prompts. Skipping design wastes parallel execution slots.

**Characterize before changing.** Before modifying existing code, verify current behavior first. Every refactor starts with characterization, not transformation.

**Learn or repeat.** End every plan with [[conducty-improve]]: target vs. actual, failure patterns, experiments for the next plan. History that doesn't change behavior is just a log.



**Red flags — STOP if you catch yourself thinking:** "should work", "probably fine", "just this once", "too simple to verify", "I'll check later", "the agent said it passed". Run the verification.


# Conducty Workflow

Conducty follows a per-plan cycle: **Shape → Plan → Trace → Execute → Verify → Improve**. Each phase has a dedicated skill. You are always somewhere in this cycle. Multiple plans per day are normal — each plan note is timestamped (`Plan YYYY-MM-DD HHmm [Topic].md`).

Use [[conducty-kernel]] when state, risk, next-skill routing, contract gaps, invariant violations, or required evidence are unclear. The kernel owns the state machine, skill router, contracts, risk score, invariant gate, evidence object, and policy-update loop.

All Conducty state — plans, designs, context, kernel contracts, improvements, failure patterns, metrics, prompt logs — lives in an **Obsidian vault** at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`). Read [[conducty-obsidian]] before any state I/O.

Before starting work, list the vault for the latest `Plans/Plan *.md` note (sort by `date` then `time` frontmatter). If one is active, reference it to understand the current prompt, its scoped context, time budget, and verification step.

**Shape:** For non-trivial goals, use [[conducty-shape]] to define appetite, scope, no-go zones, and design before planning. For architectural decisions, use [[conducty-dialectic]].

**Plan:** Use [[conducty-plan]] to decompose goals into time-budgeted prompts with parallel groups, tracer markers, and calibrated review levels.

**Plan Gate:** Use [[conducty-plan-audit]] before execution. A green gate proceeds to tracer execution; a yellow gate revises or requires explicit risk acceptance; a red gate stops and routes back to [[conducty-shape]] or [[conducty-plan]].

**Trace + Execute:** Use [[conducty-execute]] to run prompts. The first prompt in each group is a tracer — if it fails, re-evaluate the plan before running the rest. Review rigor scales with risk: verify-only for low, spec review for medium, full two-stage for high.

**Verify:** Use [[conducty-checkpoint]] between groups. It measures health metrics (first-attempt pass rate, retries, blocked count) and updates hill chart positions — not just pass/fail.

**Improve:** At the end of every plan, use [[conducty-review]] then [[conducty-improve]] to extract failure patterns, update `[[Metrics]]`, and shape the next plan's approach. History feeds forward — learn or repeat.

When finishing a task: (1) run the prompt's verification command via [[conducty-verify]], (2) mark the prompt complete in the plan note, (3) run [[conducty-checkpoint]] when the group is finished. Log outcomes to `[[Prompt Log]]` in the vault.
