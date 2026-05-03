# Conducty Kernel State Machine

The kernel state machine prevents phase-skipping. A phase transition is legal only when the exit evidence exists.

| State | Purpose | Required inputs | Required outputs | Legal next states |
|---|---|---|---|---|
| `observe` | Gather enough project/vault reality to avoid guessing | user goal, repo path or vault path | context freshness, relevant notes/files, uncertainty list | `shape`, `diagnose` |
| `shape` | Convert desire into a bounded hypothesis | goal, appetite, context | acceptance criteria, no-go zones, scope, decision points | `plan`, `observe`, `diagnose` |
| `plan` | Compile the hypothesis into executable work | shaped goal, context, constraints | prompt graph, tracer, dependencies, review levels, verification | `trace`, `shape`, `diagnose` |
| `trace` | Test the riskiest plan assumption cheaply | plan, tracer prompt, verification | tracer validity, revised plan if invalid | `execute`, `plan`, `diagnose` |
| `execute` | Run work under the accepted plan | valid tracer, prompt contract | changed files, prompt outcomes, local evidence | `verify`, `diagnose`, `review` |
| `verify` | Convert claims into evidence | changed files, verification command | evidence object, pass/fail verdict, residual risk | `review`, `diagnose`, `execute` |
| `diagnose` | Find the highest-leverage failure level | failure signal, attempts, logs/output | classification: plan, prompt, context, code, tool, or environment | `shape`, `plan`, `execute`, `verify`, `learn` |
| `review` | Audit cumulative behavior and maintainability | evidence object, diff, plan intent | findings, verdict, risk notes, missing tests | `ship`, `execute`, `learn` |
| `ship` | Decide whether merge/deploy is responsible | review verdict, verification, risks | green/yellow/red verdict, rollback notes, next steps | `learn`, `execute` |
| `learn` | Update future behavior | review/ship/diagnosis outputs | policy update, template update, context refresh, failure pattern | `plan`, `observe` |

## Transition Rules

- `observe -> shape`: context is fresh enough for the risk level.
- `shape -> plan`: acceptance criteria and no-go zones are concrete.
- `plan -> trace`: at least one tracer is selected and its verification is known.
- `trace -> execute`: tracer validity is positive or the plan was revised.
- `execute -> verify`: changed files or prompt outcomes exist.
- `verify -> review`: evidence was read and judged, not merely run.
- `review -> ship`: critical findings are absent or consciously accepted.
- `ship -> learn`: ship verdict and residual risk are recorded.
- Any state -> `diagnose`: repeated failure, invariant violation, or tool/environment breakage.

## State Smells

- Planning while context is stale.
- Executing when no tracer is identified.
- Verifying without reading output.
- Reviewing without plan intent.
- Shipping without rollback/recovery notes.
- Learning without changing a future policy, template, context note, or risk prior.
