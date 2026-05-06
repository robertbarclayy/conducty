---
aliases:
  - readiness-rubric
tags:
  - conducty/template
  - conducty/plan-audit
---

# Plan Readiness Rubric

Use this rubric with [[conducty-plan-audit]]. Score honestly, then apply blockers. A high score cannot override a red blocker.

## Scorecard

| Dimension | Points | Full credit | Partial credit | Zero credit |
|-----------|-------:|-------------|----------------|-------------|
| Appetite and scope fit | 10 | Goals fit appetite; scope cuts are explicit. | Appetite exists but budgets are fuzzy. | No appetite or obvious overcommit. |
| Goal and acceptance clarity | 15 | Each goal has observable acceptance criteria. | Criteria exist but rely on subjective judgment. | "Make it better" style outcomes. |
| Prompt atomicity and independence | 10 | Each prompt has one concern; group parallelism is safe. | Minor coupling or sequencing ambiguity. | Mixed concerns or unsafe parallel write scopes. |
| Context and file targeting | 15 | Every prompt names exact directory, files, and context notes. | Some prompts need one extra path or note. | Prompts require discovery from scratch. |
| Verification strength | 15 | Every prompt has a focused command or concrete observable signal. | Verification exists but is broad or weak. | Missing verification. |
| Tracer strategy | 15 | One tracer per group tests the riskiest assumption first. | Tracer exists but is not the riskiest prompt. | Missing or duplicate tracer. |
| Risk and review calibration | 10 | Review level matches complexity and risk. | Slight over-review or under-review. | High-risk work gets light review. |
| Learning carry-forward | 10 | Recent failures/improvements change prompt structure. | Past learning is mentioned but weakly applied. | No carry-forward from vault learning. |

## Verdict Mapping

| Score | Default verdict |
|------:|-----------------|
| 90-100 | green |
| 75-89 | green if findings are informational; otherwise yellow |
| 60-74 | yellow |
| 0-59 | red |

## Blocker Overrides

| Blocker | Forced verdict | Reason |
|---------|----------------|--------|
| Missing plan appetite | red | Scope cannot be judged. |
| No prompt queue | red | Nothing can execute. |
| Missing tracer in any non-empty group | red | Plan assumptions are not tested before volley. |
| Duplicate tracers in one group without rationale | red | The group has no clear first-risk signal. |
| Missing verification in any prompt | red | Completion cannot be proven. |
| Missing directory or context in any prompt | red | The agent must rediscover the task. |
| Overlapping write scopes in parallel prompts | red | Merge conflicts and conceptual drift are likely. |
| High-risk prompt without full-review | red | Risk and review are miscalibrated. |
| Medium/high goal skipped shaping without reason | red | Design risk was moved into execution. |

## Review Calibration

| Work type | Minimum review level |
|-----------|----------------------|
| Low-risk isolated tests/docs/small helper | verify-only |
| Multi-file feature or behavior change | spec-review |
| Public API, auth, security, data migration, billing, production deploy, broad refactor | full-review |

## Learning Carry-Forward Test

Ask:

1. What was the latest improvement experiment?
2. What recurring failure pattern is most relevant?
3. Which prompt changed because of each one?
4. If no prompt changed, why did we load the vault?

If the answer to question 3 is "none," cap the learning carry-forward score at 4/10.
