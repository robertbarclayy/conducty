---
name: conducty-execute
description: Use when ready to execute prompts from a daily plan — dispatches subagents with tracer-first execution, time-budgeted work, and review rigor calibrated to prompt complexity
---

# Conducty Execute — Tracer-First Subagent Execution

Execute prompts from the daily plan by dispatching fresh subagents with context curation, time budgets, and review rigor that scales with risk. The first prompt in each group runs as a tracer to validate plan assumptions before the rest execute.

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
1. Read plan, extract the tracer prompt for the target group
2. Dispatch tracer as a single implementer subagent
3. Handle the result:
   - DONE → Run verification via conducty-verify → Pass? Proceed to Phase 2
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
  1. Dispatch implementer subagent (./implementer-prompt.md)
  2. Handle implementer status (see below)
  3. Apply review level from the plan:
     - verify-only → Run verification. Pass? Mark complete.
     - spec-review → Run verification + dispatch spec reviewer (./spec-reviewer-prompt.md)
     - full-review → Run verification + spec reviewer + quality reviewer (./quality-reviewer-prompt.md)
  4. If review fails → implementer fixes → re-review (same level)
  5. Mark prompt complete with evidence
After all prompts → run conducty-checkpoint for the group
Gate: user confirms before next group
```

### Dispatching Subagents

**Use the prompt's Model field** from the plan:
- `fast`: Low complexity (isolated functions, clear specs, 1-2 files)
- `default`: Medium complexity (multi-file, integration, pattern matching)
- `capable`: High complexity (design judgment, broad codebase understanding)

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

**NEEDS_CONTEXT:** The prompt was underspecified. Provide the missing context and re-dispatch. Check the project context file first. If the context doesn't exist, this is a prompt quality issue — note it for `conducty-improve`.

**BLOCKED:** Assess the blocker:
1. Context problem → provide more context, re-dispatch
2. Task exceeds agent capability → re-dispatch with a more capable model
3. Task too large → split into sub-prompts, dispatch sequentially
4. Plan assumption is wrong → stop and revise the plan for this prompt

Never force-retry without changing something. If the agent said it's stuck, something about the prompt, the context, or the model needs to change.

## Time Budget Enforcement

When a subagent has been running significantly longer than the prompt's time budget:

1. Check if it's making progress (producing output, committing) or stuck (silent, looping)
2. If stuck: interrupt and treat as BLOCKED
3. If progressing but slow: let it finish, but flag the time overrun in checkpoint notes
4. Either way: this means the complexity estimate was wrong. Note it for `conducty-improve` so future plans calibrate better.

## Prompt Templates

- `./implementer-prompt.md` — Dispatch an implementer subagent
- `./spec-reviewer-prompt.md` — Dispatch spec compliance reviewer (for spec-review and full-review)
- `./quality-reviewer-prompt.md` — Dispatch code quality reviewer (for full-review only)

## Principles

- **Tracer result is a plan signal** — a tracer failure means "revise the plan," not "fix the prompt"
- **Context is curated, not dumped** — give subagents exactly what they need, nothing more
- **Review rigor matches risk** — ceremony for high-risk work, speed for low-risk work
- **Time budgets are circuit breakers** — they surface misestimates, not punish slow agents
- **Every completion claim needs evidence** — use `conducty-verify` before marking anything done
- **Failures are learning data** — every BLOCKED, every NEEDS_CONTEXT, every time overrun feeds back to `conducty-improve`
- **The orchestrator doesn't implement** — you coordinate, curate context, and maintain conceptual integrity. The subagents implement.
