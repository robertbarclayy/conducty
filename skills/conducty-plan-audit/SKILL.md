---
name: conducty-plan-audit
description: Pre-execution plan quality gate. Audits a Conducty plan before tracer or parallel execution for appetite fit, acceptance clarity, prompt independence, tracer coverage, verification, no-go zones, review calibration, context, and carry-forward from recent failure patterns. Use when the user says "audit this plan", "quality gate", "is this plan ready", "before execution", "ready to execute", or after creating/editing a plan note.
aliases:
  - conducty-plan-audit
  - plan-audit
  - quality-gate
  - readiness-gate
tags:
  - conducty/skill
  - conducty/plan
  - conducty/quality-gate
---

# Conducty Plan Audit - Pre-Execution Quality Gate

Run this skill after [[conducty-plan]] creates or revises a plan and before [[conducty-execute]] runs a tracer. It answers one question:

> Is this plan safe and specific enough to spend agent execution on?

The audit catches plan-level failure while fixes are still cheap. A weak prompt wastes one slot. A weak plan wastes the whole group.

> [!important] Read [[conducty-obsidian]] first
> This skill reads and edits `Plans/Plan YYYY-MM-DD HHmm [Topic].md` notes in the Conducty vault. It writes the gate result into the plan note, not a separate file.

## When to Use

- After a new plan is drafted and before execution handoff
- After any manual edit to a plan's prompt queue
- Before running [[conducty-execute]] if the plan does not already have a fresh green gate
- When a tracer fails and you need to decide whether the failure was prompt-level or plan-level
- When first-attempt pass rate is drifting down and you need to tighten upstream quality

## Verdicts

| Verdict | Meaning | Execution rule |
|---------|---------|----------------|
| **green** | The plan is ready to run. Remaining issues are informational. | Execute tracer. |
| **yellow** | The plan is close, but has fixable gaps that will likely cause rework. | Revise first unless the user explicitly accepts the risk. |
| **red** | The plan is not execution-ready. A tracer would test confusion, not implementation. | Stop. Reshape or rebuild the plan. |

Use the strictest applicable verdict. One red blocker makes the whole gate red.

## Inputs

Resolve the active plan unless the user names a specific plan:

1. Find `Plans/Plan *.md` in the vault.
2. Sort newest first by frontmatter `date` + `time`, falling back to file modified time.
3. Pick the newest plan whose `## End-of-Plan Summary` is not filled, or the newest plan if none are clearly active.
4. Read related context linked from the plan only when the audit needs to verify context claims.

Also read:

- Latest `Improvements/Improvement *.md`
- Recent entries from `Accumulators/Failure Patterns.md`
- Last 7-14 rows from `Accumulators/Metrics.md`
- `Accumulators/Prompt Log.md` if the user is re-auditing after failed execution

## Audit Dimensions

Use [[readiness-rubric]] for scoring. The summary score is useful, but blockers decide the verdict.

| Dimension | Weight | What good looks like |
|-----------|-------:|----------------------|
| Appetite and scope fit | 10 | Goals fit the declared appetite; no hidden "and also" work. |
| Goal and acceptance clarity | 15 | Outcomes are observable; success is not subjective. |
| Prompt atomicity and independence | 10 | Each prompt has one concern; parallel groups are truly independent. |
| Context and file targeting | 15 | Prompts name exact directories/files and needed context notes. |
| Verification strength | 15 | Every prompt has a concrete command or observable check with expected signal. |
| Tracer strategy | 15 | Every group has exactly one tracer that tests the riskiest assumption first. |
| Risk and review calibration | 10 | High-risk work gets full-review; medium work gets spec-review; low work stays light. |
| Learning carry-forward | 10 | Recent failure patterns and improvement experiments visibly change this plan. |

## Red Blockers

Stop execution if any are present:

- No explicit appetite for the plan
- No prompt queue
- Any non-empty group lacks a tracer
- A group has more than one tracer without an explanation
- Any prompt lacks verification
- Any prompt lacks a directory or scoped context
- A prompt is broad enough to touch unrelated subsystems
- Medium/high complexity work skipped shaping without a user-approved reason
- High-risk work is not assigned `full-review`
- Security, auth, data migration, billing, or production behavior lacks no-go zones
- The plan asks agents to run in parallel against overlapping write scopes without [[conducty-worktrees]] or sequencing

## Yellow Findings

Revise before execution unless appetite or user constraints justify the tradeoff:

- Acceptance criteria are present but hard to observe
- No-go zones exist at the goal level but are missing from individual prompts
- Verification is too broad for one prompt, or too narrow for the stated outcome
- Prompt time budgets do not add up to the plan appetite
- The tracer is easy, not risky
- A prompt depends on another prompt but appears in the same parallel group
- Recent failure patterns are read but not reflected in prompt structure
- Review levels are over-applied, adding ceremony without risk
- Plan does not state what to do if the tracer fails

## Workflow

### Step 1: Parse the Plan

Extract:

- Frontmatter: `date`, `time`, `topic`, `appetite`, `project`
- Goals table and hill positions
- Carried-forward items
- Improvement experiments
- Context loaded
- Prompt groups
- Prompt fields: id, type, prompt, directory, context, design, no-go zones, verification, expected outcome, complexity, review level, time budget, dependencies, status

If fields are missing because the plan uses an older template, audit the content that exists and flag template drift as yellow.

### Step 2: Run Mechanical Checks

Mechanical checks are cheap and should happen before judgment:

- Count groups and prompts
- Count tracers per group
- Check every prompt has directory, context, no-go zones, verification, complexity, review level, and time budget
- Check dependencies do not point forward into the same parallel group
- Check complexity matches review level
- Check prompt IDs are unique
- Check time budgets roughly fit the appetite

### Step 3: Run Judgment Checks

Use LLM judgment only after the mechanical checks:

- Is the plan trying to prove too many things at once?
- Does each prompt contain enough context to execute without a follow-up?
- Does the tracer test the riskiest assumption?
- Are acceptance criteria observable by tests, builds, screenshots, logs, or explicit user inspection?
- Did the latest improvement note change anything in this plan?
- Did recurring failure patterns get structural prevention, not just a mention?

### Step 4: Score and Decide

Assign a score out of 100 using [[readiness-rubric]]. Then apply blockers:

- `90-100`: green unless a blocker exists
- `75-89`: green only if there are no yellow findings that affect the first group; otherwise yellow
- `60-74`: yellow
- `<60`: red
- Any red blocker: red

### Step 5: Write the Gate Result Into the Plan

Update the plan note's `## Plan Quality Gate` section. If the section is missing, insert it before `## Checkpoint Notes`. Use [[audit-template]].

Required fields:

- Verdict
- Score
- Audited at
- Execution decision
- Must fix before execute
- Should improve
- Carry-forward checked
- Tracer assessment
- Verification assessment
- Review calibration

Do not create a separate audit note by default. The gate belongs in the plan because it decides whether that plan can execute.

### Step 6: Apply the Gate

- **Green**: tell the user the plan is execution-ready and hand off to [[conducty-execute]].
- **Yellow**: propose a minimal patch to the plan. Edit the plan if the user agrees or if the fix is obviously mechanical and within the plan's intent.
- **Red**: stop. Route back to [[conducty-shape]] for design gaps or [[conducty-plan]] for prompt decomposition gaps.

## Fix Patterns

| Finding | Preferred fix |
|---------|---------------|
| Missing verification | Add the smallest command that proves the prompt's outcome. |
| Weak tracer | Move the riskiest integration prompt to first position and mark it tracer. |
| Mixed concerns | Split prompt into separate prompts and sequence if needed. |
| Overlapping write scopes | Move prompts into sequential groups or use [[conducty-worktrees]]. |
| Missing no-go zones | Add explicit "do not touch" boundaries to each prompt. |
| Ignored failure pattern | Add one structural prevention step to the relevant prompt. |
| High risk with light review | Raise review level to `full-review` and name why. |
| Appetite mismatch | Cut scope, shrink acceptance, or split into a later plan. |

## Principles

- **Gate before spend**: validate the plan before using agent time.
- **Blockers beat score**: a 92 with no verification is red.
- **Structural prevention over warnings**: change prompts so failure becomes less likely.
- **Tracer quality matters more than tracer existence**: the tracer should test the riskiest assumption.
- **Learning must alter behavior**: failure patterns and improvements should visibly change this plan.
- **Keep the gate lightweight**: green plans should move quickly into execution.
