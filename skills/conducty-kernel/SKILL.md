---
name: conducty-kernel
description: Closed-loop Conducty orchestration kernel. Use when deciding the current workflow state, next skill, required contract fields, risk score, invariants, evidence objects, policy updates, or whether work can safely advance to execution, review, or ship.
aliases:
  - conducty-kernel
  - kernel
  - conducty-router
  - conducty-contracts
  - conducty-risk
tags:
  - conducty/skill
  - conducty/foundation
  - conducty/kernel
---

# Conducty Kernel

`conducty-system` explains the philosophy and language. `conducty-kernel` operationalizes it as a closed-loop control layer.

Conducty is a closed-loop agent orchestration kernel for software work: it converts goals into bounded experiments, executes them with risk-calibrated rigor, verifies claims with evidence, and compiles every failure into better future behavior.

Use this skill when the workflow needs a hard answer to:

- What state are we in?
- What skill should run next?
- What contract fields are missing?
- How risky is this work?
- What evidence is required before moving on?
- Which invariant blocks execution, review, or ship?
- What should be learned or updated for the next plan?

## Kernel Loop

```
Observe -> Shape Hypothesis -> Plan Experiment -> Execute Safely
   -> Verify Evidence -> Diagnose Failure -> Learn -> Update Policy
   -> Next Better Plan
```

This loop is stricter than the friendly per-plan cycle. The cycle names the phases; the kernel decides whether the system is allowed to advance.

## Hard Responsibilities

| Responsibility | What it does | Output |
|---|---|---|
| State machine | Determines the current phase and legal next transition | `state`, `next_state` |
| Skill router | Maps state, gaps, and risk to the next Conducty skill | `next_skill` |
| Contracts | Requires inputs and outputs before phase transitions | kernel contract |
| Risk model | Scores blast radius, uncertainty, test weakness, failure history, and parallelism | `risk_score`, `review_level` |
| Invariants | Blocks unsafe advancement | invariant violations |
| Evidence objects | Captures commands, outputs, changed files, verdicts, and residual risk | evidence requirements |
| Policy updates | Converts recurring failure into new defaults | learning delta |

## Use MCP Tools When Available

If the Codex MCP server is available, prefer deterministic tools over hand-written assessment:

- `get_kernel`: returns the kernel architecture and vocabulary.
- `assess_kernel_state`: infers state, risk, next skill, contract gaps, invariant violations, and evidence requirements.
- `create_kernel_contract`: writes a timestamped vault note under `Kernel Contracts/` and updates `Kernel Contracts Index`.

Use `create_kernel_contract` for serious work, risky work, repeated failures, parallel execution, review gates, and ship decisions. Use `assess_kernel_state` for a lightweight preflight.

## State Machine

Read the full state table in [`state-machine.md`](state-machine.md).

| State | Enter when | Exit only when |
|---|---|---|
| `observe` | Goal, repo, or vault context is unclear | relevant context and freshness are known |
| `shape` | Goal lacks appetite, scope, acceptance, or no-go zones | a bounded hypothesis exists |
| `plan` | Shape exists but no executable plan exists | prompts, tracer, dependencies, review levels, and verification are defined |
| `trace` | Plan exists but assumptions are untested | tracer validity is known |
| `execute` | Tracer is valid and work can proceed | changed files and prompt outcomes are captured |
| `verify` | Claims or changed files need proof | evidence object is complete |
| `diagnose` | Tracer fails, retries repeat, or invariants are violated | failure is classified at the right leverage point |
| `review` | Work is complete enough for branch/plan audit | findings and residual risk are recorded |
| `ship` | Branch may be merged or deployed | ship verdict, evidence, and rollback notes exist |
| `learn` | Plan/ship/review is complete | templates, policy, context, or risk priors are updated |

## Kernel Contract

Before meaningful execution, the kernel wants a contract:

- Goal
- Appetite
- Current state
- Acceptance criteria
- No-go zones
- Scoped context
- Context freshness
- Plan hypothesis
- Tracer selection
- Risk score
- Review level
- Required evidence
- Invariant checks
- Next skill

Use [`contract-template.md`](contract-template.md) when writing one manually.

## Invariants

These are hard stops, not style preferences:

| Invariant | Stop condition | Recovery |
|---|---|---|
| No execution without contract | goal, acceptance, no-go zones, context, or verification are missing | run `[[conducty-shape]]` or `[[conducty-plan]]` |
| No parallel work before tracer | multiple prompts start before tracer validity is known | run tracer first with `[[conducty-execute]]` |
| No claim without evidence | "done", "passed", "fixed", or "ready" appears without fresh output | run `[[conducty-verify]]` |
| No ship without residual risk | branch is ready to merge but risks/rollback are absent | run `[[conducty-ship]]` |
| No repeat retries | same prompt fails 3 times or same error class repeats | run `[[conducty-debug]]` |
| No stale context on high-risk work | context freshness is stale/unknown and blast radius is high | refresh with `[[conducty-context]]` |

## Risk Model

Risk is not a vibe. It is a routing input.

Use [`risk-model.md`](risk-model.md) for the scoring rubric. The default bands are:

| Score | Band | Review level |
|---:|---|---|
| 0-34 | low | verify-only |
| 35-64 | medium | spec-review |
| 65-79 | high | full-review |
| 80-100 | critical | full-review plus explicit recovery notes |

Raise risk for security, auth, billing, migrations, production deploys, large diffs, missing tests, stale context, parallel branches, and repeated failures.

## Router

| Kernel signal | Route |
|---|---|
| Missing repo/vault context | `[[conducty-context]]` |
| Missing appetite, scope, no-go zones, or acceptance | `[[conducty-shape]]` |
| Shape exists but no prompt graph | `[[conducty-plan]]` |
| Plan exists but tracer is not run | `[[conducty-execute]]` |
| Changed files but no proof | `[[conducty-verify]]` |
| Repeated failure or invariant violation | `[[conducty-debug]]` |
| Parallel work needs merge safety | `[[conducty-worktrees]]` then reconciliation |
| Plan work complete | `[[conducty-review]]` |
| Branch ready to merge | `[[conducty-ship]]` |
| New learning should affect next work | `[[conducty-improve]]` |

## Token Economics

The kernel can use more tokens up front on serious work, but it should save tokens over the full task by preventing bad retries, stale context, unreviewable parallel changes, and unverifiable claims.

See [`token-economics.md`](token-economics.md) for the before/after estimate table.

## Principle

Conducty should feel lighter as risk gets lower and stricter as risk rises. The kernel is not extra ceremony. It is the circuit board that decides which ceremony is worth paying for.
