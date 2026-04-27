---
name: conducty-execute
description: Dispatches Claude Code Task subagents to run prompts from a vault plan note. Tracer-first execution, time-budgeted work, calibrated review rigor. Use when the user says "execute the plan", "run group A", "dispatch", or is ready to run prompts from a `Plan YYYY-MM-DD HHmm` note in the vault.
aliases:
  - conducty-execute
  - execute
tags:
  - conducty/skill
  - conducty/execute
---

# Conducty Execute — Tracer-First Subagent Execution

Execute prompts from the active plan note (in the Obsidian vault — see [[conducty-obsidian]]) by dispatching fresh Claude Code subagents (via the Task tool) with context curation, time budgets, and review rigor that scales with risk. The first prompt in each group runs as a tracer to validate plan assumptions before the rest execute.

## Core Concepts

**Tracer-first:** The prompt marked `★ TRACER` in each group runs alone. If it succeeds, the plan's assumptions hold and the remaining prompts execute. If it fails, stop — the plan needs revision, not just a fix prompt. Tracers catch bad assumptions before they multiply across an entire group.

**Time-budgeted:** Each prompt has a time budget from the plan. If a subagent exceeds it, that's a signal — either the prompt is underscoped, the complexity was misjudged, or the agent is stuck. Treat it as a circuit breaker, not a hard kill.

**Calibrated review:** Not every prompt needs the same oversight. The plan assigns a review level based on complexity:

| Review Level | When | What Happens After Implementation |
|-------------|------|----------------------------------|
| `verify-only` | Low complexity | Run verification command. Pass? Done. |
| `spec-review` | Medium complexity | Run verification + dispatch spec reviewer. |
| `full-review` | High complexity | Run verification + spec reviewer + quality reviewer. |

**Context curation:** The orchestrator (you) constructs exactly what each subagent needs. Not your session history, not the entire project — precisely the prompt text, relevant context files, and scene-setting for where this work fits. This is the surgical team model: the surgeon thinks, the team executes with curated information.

## The Process

### Phase 1: Tracer Execution

```
1. Read the plan note from the vault, extract the tracer prompt for the target group
2. Dispatch tracer as a single implementer subagent (Task tool)
3. Handle the result:
   - DONE → Run verification via [[conducty-verify]] → Pass? Proceed to Phase 2
   - DONE → Verification fails → STOP. This is a plan problem, not a prompt problem.
     Analyze: is the verification wrong, or is the plan's approach wrong?
   - BLOCKED/NEEDS_CONTEXT → STOP. The plan's assumptions are wrong.
     Don't execute the remaining prompts. Revise the plan.
4. Report tracer result to user before proceeding
```

The tracer is your early warning system. Respect its signal.

### Phase 2: Group Execution

```
For each remaining prompt in the group:
  1. Dispatch implementer subagent (see [[implementer-prompt]])
  2. Handle implementer status (see below)
  3. Apply review level from the plan:
     - verify-only → Run verification. Pass? Mark complete.
     - spec-review → Run verification + dispatch spec reviewer ([[spec-reviewer-prompt]])
     - full-review → Run verification + spec reviewer + quality reviewer ([[quality-reviewer-prompt]])
  4. If review fails → implementer fixes → re-review (same level)
  5. Mark prompt complete with evidence
After all prompts → run [[conducty-checkpoint]] for the group
Gate: user confirms before next group
```

### Dispatching Subagents

Use Claude Code's Task tool. The default `subagent_type` is `general-purpose` (always available). If the harness exposes specialized subagents (e.g. `Explore` for read-only codebase analysis, `Plan` for architecture work), use them where their description fits — they don't replace the implementer model selection below.

Choose **model** by the prompt's complexity:

| Complexity | Model | Why |
|------------|-------|-----|
| **Low** (isolated function, clear spec, 1-2 files) | `haiku` | Fast and cheap; sufficient for narrow work |
| **Medium** (multi-file, integration, pattern matching) | `sonnet` | Default for most implementation work |
| **High** (design judgment, broad codebase understanding) | `opus` | Reserve for genuinely hard problems |

For **read-only review subagents** (spec reviewer, quality reviewer, code-review lens subagents), use the `Explore` subagent type if available; otherwise `general-purpose`. Run them at `haiku` or `sonnet` — review is pattern matching, not generation.

**Context curation checklist** — provide exactly:
1. The full prompt text (pasted, not a file reference — subagents don't read plan files)
2. Scene-setting: which project, where this fits in the broader plan, what came before
3. Relevant architecture from the project context file
4. Dependencies on prior prompt outputs (if any)
5. The no-go zones from the prompt
6. The time budget

**Do not provide:** Your session history, unrelated plan context, the entire project tree.

## Handling Implementer Status

**DONE:** Apply the prompt's review level.

**DONE_WITH_CONCERNS:** Read the concerns. Correctness/scope concerns → address before review. Observational concerns (file getting large, questionable existing patterns) → note for future planning, proceed to review.

**NEEDS_CONTEXT:** The prompt was underspecified. Provide the missing context and re-dispatch. Check the project context file first. If the context doesn't exist, this is a prompt quality issue — note it for [[conducty-improve]].

**BLOCKED:** Assess the blocker:
1. Context problem → provide more context, re-dispatch
2. Task exceeds agent capability → re-dispatch with a more capable model (`opus`)
3. Task too large → split into sub-prompts, dispatch sequentially
4. Plan assumption is wrong → stop and revise the plan for this prompt

Never force-retry without changing something. If the agent said it's stuck, something about the prompt, the context, or the model needs to change.

## Time Budget Enforcement

When a subagent has been running significantly longer than the prompt's time budget:

1. Check if it's making progress (producing output, committing) or stuck (silent, looping)
2. If stuck: interrupt and treat as BLOCKED
3. If progressing but slow: let it finish, but flag the time overrun in checkpoint notes
4. Either way: this means the complexity estimate was wrong. Note it for [[conducty-improve]] so future plans calibrate better.

## Subagent Prompt Templates

- [[implementer-prompt]] — Dispatch an implementer subagent
- [[spec-reviewer-prompt]] — Dispatch spec compliance reviewer (for spec-review and full-review)
- [[quality-reviewer-prompt]] — Dispatch code quality reviewer (for full-review only)

## Principles

- **Tracer result is a plan signal** — a tracer failure means "revise the plan," not "fix the prompt"
- **Context is curated, not dumped** — give subagents exactly what they need, nothing more
- **Review rigor matches risk** — ceremony for high-risk work, speed for low-risk work
- **Time budgets are circuit breakers** — they surface misestimates, not punish slow agents
- **Every completion claim needs evidence** — use [[conducty-verify]] before marking anything done
- **Failures are learning data** — every BLOCKED, every NEEDS_CONTEXT, every time overrun feeds back to [[conducty-improve]]
- **The orchestrator doesn't implement** — you coordinate, curate context, and maintain conceptual integrity. The subagents implement.
