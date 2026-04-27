---
name: conducty-bootstrap
description: First-run walkthrough for Conducty. Confirms vault location, seeds indexes if missing, ingests the user's primary project via [[conducty-context]], and produces a tiny scoped first plan so the user sees the cycle end-to-end. Use when the user says "set up Conducty", "first time", "get started", "bootstrap", "I just installed Conducty", or when no plans yet exist in the vault.
aliases:
  - conducty-bootstrap
  - bootstrap
tags:
  - conducty/skill
  - conducty/onboarding
---

# Conducty Bootstrap — First-Run Walkthrough

The fastest path from "just installed" to "first finished plan." Bootstrap is opinionated: it picks a small first goal so the user sees the entire cycle (Plan → Execute → Verify → Improve) without committing to anything ambitious.

> [!important] One-shot skill
> Bootstrap is meant to run once per machine. After it completes, the cycle is self-sustaining via [[conducty-plan]].

## When to Use

- The user just ran `install-claude-code.sh` and is starting their first session
- The user says "set up Conducty", "first time", "get started", "bootstrap"
- A `Glob Plans/Plan *.md` against the vault returns zero results — auto-trigger this skill

## Workflow

### Step 1: Confirm the Vault

Resolve `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`). Confirm with the user:

> "Conducty vault is at `<resolved path>`. Open this directory in Obsidian to navigate the graph as we build it. OK to proceed?"

If the user wants a different path, ask them to set `$CONDUCTY_VAULT` in their shell profile and re-run. Do not silently move the vault.

### Step 2: Seed Missing Indexes + Accumulators

Use [[conducty-obsidian]]'s bootstrap section. Create any missing:

- Indexes: `Conducty Index`, `Plans Index`, `Designs Index`, `Context Index`, `Improvements Index`
- Accumulators: `Failure Patterns`, `Metrics`, `Prompt Log`

If the installer already seeded them, this is a no-op.

### Step 3: First Project — Ingest Context

Ask:

> "Which project would you like Conducty to start with? Give me the path."

Run [[conducty-context]] on that path. The output is the project sub-graph: hub, Architecture, Conventions, Invariants, Hotspots, Tests, Glossary.

Briefly summarize for the user: bounded contexts found, test command resolved, any concerns flagged.

### Step 4: Pick a Tiny First Goal

Suggest a Low-complexity goal — something the user will see succeed inside 30 minutes. Examples:

- "Add a small utility function with TDD" (writes one function + tests)
- "Improve a single error message in module X"
- "Write a test for a previously-untested branch"

Refuse to bootstrap with a Medium/High goal — the point is to walk the cycle, not ship a feature.

### Step 5: Generate the First Plan (Reduced Ceremony)

Run [[conducty-plan]] with the chosen goal and an appetite of 30 minutes. Produce a single-prompt plan in Group A (no parallelization, no tracer needed because there's only one). Review level: `verify-only`.

### Step 6: Execute Manually

**Do not** auto-dispatch via [[conducty-execute]] on the first plan. Walk the user through manual execution:

1. Open a fresh Claude Code session in the project directory
2. Paste the prompt
3. Watch the implementer work
4. Run the verification command yourself

The point is for the user to feel the prompt's structure (acceptance criteria, no-go zones, escalation) before delegating it.

### Step 7: Run Checkpoint

Use [[conducty-checkpoint]] on the single-prompt group. Verify result via [[conducty-verify]].

### Step 8: Run Review + Improve

Run [[conducty-review]] to update `Metrics`, `Prompt Log`. Then run [[conducty-improve]] to write the first `Improvement YYYY-MM-DD HHmm.md`. Encourage the user to read both — they're the feedback loop.

### Step 9: Tour the Vault

Have the user open Obsidian on the vault. Walk them through:

- `Conducty Index` (the root hub)
- The new plan note
- The context sub-graph for the project
- The accumulating notes (`Failure Patterns`, `Metrics`, `Prompt Log`)
- The graph view — show how the plan, design (if any), context, and improvement are linked

### Step 10: Hand Off to Plan

Tell the user:

> "From here, every working session starts with [[conducty-plan]]. The vault now has a baseline. Future plans will read this graph and get sharper."

Bootstrap is complete. Do not run again on this machine unless the vault is wiped.

## What Bootstrap Skips

- No shaping (`conducty-shape`) — first goal must be Low complexity, design is overkill
- No worktrees — single prompt, no parallelism
- No code review or ship — first plan is intentionally throwaway / educational
- No `conducty-dialectic` — we're not making architectural decisions on bootstrap

## Failure Modes

- **Vault path inaccessible**: report the error, suggest creating the parent directory, and abort.
- **Project has no test command discoverable**: ask the user; record in `Context {Project} Tests`. Do not invent one.
- **Project is not a git repo**: warn but proceed. [[conducty-debug]] won't have `git diff` access; flag for the user.
- **User picks a Medium/High goal**: politely refuse and ask for something smaller. "Bootstrap is for cycle-feel. We'll do real work after."

## Principles

- **Throwaway first plan** — the goal is muscle memory, not feature delivery
- **Manual execution on bootstrap** — feel the prompt before delegating
- **Vault tour is part of onboarding** — the user must see the graph come alive
- **One-shot skill** — bootstrap doesn't run twice; subsequent plans go through [[conducty-plan]]
