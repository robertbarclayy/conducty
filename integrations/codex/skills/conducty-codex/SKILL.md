---
name: conducty-codex
description: Always-on Conducty orchestration for Codex. Use by default for coding, debugging, refactoring, review, CI, deployment, production-change, multi-step planning, substantial research, agent coordination, tracer-first execution, vault memory, prompt logging, checkpoints, ship gates, or improvement loops. Prefer the conducty-codex MCP tools when available.
---

# Conducty Codex

Use this skill to run Conducty's loop inside Codex: Shape -> Plan -> Trace -> Execute -> Verify -> Improve -> Code Review -> Ship.

For substantial or risky work, treat Conducty as a closed-loop kernel: assess state, route the next skill, score risk, check invariants, require evidence, and record learning that changes the next plan.

## Default Moves

1. Resolve the vault with `resolve_vault`; if it does not exist, call `bootstrap_vault`.
2. For serious work, call `assess_kernel_state`; for durable risk/state decisions, call `create_kernel_contract`.
3. Shape the request: goal, appetite, no-go zones, acceptance criteria, verification.
4. Check prompt quality with `check_prompt_smells` before writing or dispatching prompts.
5. Create a plan with `create_plan`. Every plan needs a tracer and a verification command.
6. Execute the tracer first. If it fails, revise the plan before broader execution.
7. Log each prompt result with `log_prompt_outcome`.
8. Record group health with `record_checkpoint`.
9. Record learning with `record_improvement` when the plan ends or a failure pattern appears.
10. Create a pre-merge ship report with `create_ship_report` when verification evidence and residual risks are known.
11. Audit the vault with `audit_vault_graph` when notes, links, or closure signals need a health check.

## Codex Boundaries

- Keep critical-path implementation local unless the user explicitly asks for subagents, delegation, or parallel agent work.
- Use parallel agents only for independent work with disjoint write scopes.
- Treat time budgets as circuit breakers: when work exceeds appetite, stop and reshape.
- Preserve exact commands, file paths, acceptance criteria, no-go zones, and error strings.
- Run the smallest meaningful verification before claiming completion.

## Prompt Shape

Use compact prompts:

```text
P1 - Add date helper
Context: src/date.ts, tests/date.test.ts
Accept: ISO input formats unchanged; invalid input returns null.
No-go: no timezone library swap; no API rename.
Verify: pnpm test tests/date.test.ts
Budget: 25m
Review: verify-only
Tracer: yes
```

## MCP Tools

- `resolve_vault`: show active vault path and whether it exists.
- `bootstrap_vault`: create Conducty vault indexes, accumulators, and note folders.
- `get_cycle`: return the operating loop and phase routing.
- `get_kernel`: return the closed-loop kernel architecture and vocabulary.
- `assess_kernel_state`: infer state, next skill, risk score, invariant violations, and evidence requirements.
- `create_kernel_contract`: write a durable kernel state/risk/evidence contract note.
- `check_prompt_smells`: find missing acceptance, context, verification, no-go zones, and mixed concerns.
- `create_plan`: write a timestamped plan note and update `Plans Index`.
- `list_recent_notes`: list recent plans, improvements, code reviews, ship reports, kernel contracts, or accumulator notes.
- `log_prompt_outcome`: prepend a terse entry to `Prompt Log`.
- `record_checkpoint`: append group health metrics to the plan note.
- `record_improvement`: write an improvement kata note and update `Improvements Index`.
- `create_ship_report`: write a green/yellow/red pre-merge verdict with verification evidence and residual risks.
- `audit_vault_graph`: report broken wikilinks, duplicate basenames, orphan user notes, plans without ship reports, and plans without checkpoints.

## Finish Criteria

Before final response, confirm:

- plan or vault state was written when needed
- tracer/verification result is known
- prompt outcomes or residual risk are recorded
- next Conducty move is obvious
