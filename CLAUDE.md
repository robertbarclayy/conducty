# Conducty

AI Workflow Orchestrator — systems-level orchestration of AI agents with daily-cadence planning, tracer-first execution, calibrated review, and continuous improvement.

## Skills

Conducty skills are installed alongside this file. Use your tool's native skill discovery to list and load them.

Available skills: `conducty-system`, `conducty-shape`, `conducty-plan`, `conducty-tdd`, `conducty-execute`, `conducty-verify`, `conducty-debug`, `conducty-checkpoint`, `conducty-review`, `conducty-improve`, `conducty-context`, `conducty-worktrees`, `conducty-dialectic`.

## State Directory

Conducty stores plans, history, context, and designs in `~/.conducty/`.

## Rules

The following rules apply to all Conducty workflows.


# Conducty Quality Principles

**Appetite before plan.** Define the time budget before planning. The plan fits the appetite. A prompt that exceeds its time budget triggers a circuit breaker — stop and re-evaluate, don't spiral.

**Tracer before volley.** Run one prompt end-to-end before parallel execution. If the tracer fails, fix the plan — not just the prompt. Plan assumptions are hypotheses until a tracer validates them.

**Prompt quality is leverage.** Everything downstream compensates for bad prompts. Invest upstream: clear acceptance criteria, scoped context, concrete verification. Check for prompt smells before finalizing any plan.

**Evidence before claims.** No completion claims without fresh verification output. Use `conducty-verify`. Rigor scales with risk: verify-only for low, spec review for medium, full two-stage for high.

**Root cause before fixes.** When a prompt fails, ask WHERE the leverage point is: prompt quality, plan quality, or code quality. Fix at the highest level. Use `conducty-debug`. Three failures on the same prompt = circuit breaker — escalate.

**Design before implementation.** For non-trivial goals, use `conducty-shape` to define appetite, boundaries, and no-go zones before writing prompts. Skipping design wastes parallel execution slots.

**Characterize before changing.** Before modifying existing code, verify current behavior first. Every refactor starts with characterization, not transformation.

**Learn or repeat.** End every day with `conducty-improve`: target vs. actual, failure patterns, experiments for tomorrow. History that doesn't change behavior is just a log.

**Red flags — STOP if you catch yourself thinking:** "should work", "probably fine", "just this once", "too simple to verify", "I'll check later", "the agent said it passed". Run the verification.


# Conducty Workflow

Conducty follows a daily cycle: **Shape → Plan → Trace → Execute → Verify → Improve**. Each phase has a dedicated skill. You are always somewhere in this cycle.

Before starting work, check if a daily plan exists at `~/.conducty/plans/` for today's date (YYYY-MM-DD.md). If it does, reference it to understand the current prompt, its scoped context, time budget, and verification step.

**Shape:** For non-trivial goals, use `conducty-shape` to define appetite, scope, no-go zones, and design before planning. For architectural decisions, use `conducty-dialectic`.

**Plan:** Use `conducty-plan` to decompose goals into time-budgeted prompts with parallel groups, tracer markers, and calibrated review levels.

**Trace + Execute:** Use `conducty-execute` to run prompts. The first prompt in each group is a tracer — if it fails, re-evaluate the plan before running the rest. Review rigor scales with risk: verify-only for low, spec review for medium, full two-stage for high.

**Verify:** Use `conducty-checkpoint` between groups. It measures health metrics (first-attempt pass rate, retries, blocked count) and updates hill chart positions — not just pass/fail.

**Improve:** At end-of-day, use `conducty-review` then `conducty-improve` to extract failure patterns, update metrics, and shape tomorrow's approach. History feeds forward — learn or repeat.

When finishing a task: (1) run the prompt's verification command via `conducty-verify`, (2) mark the prompt complete, (3) run `conducty-checkpoint` when the group is finished. Log outcomes to `~/.conducty/history/prompt-log.md`.

