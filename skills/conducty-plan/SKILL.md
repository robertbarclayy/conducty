---
name: conducty-plan
description: Batch planning of AI prompts. Loads vault context (latest plan, latest improvement, project context, failure patterns, metrics), sets appetite, generates time-budgeted prompts with tracer markers and calibrated review levels. Use when the user says "plan", "plan this work", "batch plan", "create a plan", or wants to organize prompts. Multiple plans per day are expected — each plan is timestamped.
aliases:
  - conducty-plan
  - plan
tags:
  - conducty/skill
  - conducty/plan
---

# Conducty Plan — Batch Planning

Generate a structured plan of time-budgeted prompts organized into parallel groups with tracer markers, calibrated review levels, prompt quality checks, and a pre-execution plan gate.

A plan is a unit of work, not a calendar boundary. Run a fresh plan whenever you start a new orchestration cycle — multiple plans per day are normal. Each plan note is named `Plans/Plan YYYY-MM-DD HHmm [Topic].md` and lives in the Obsidian vault.

> [!important] Read [[conducty-obsidian]] first
> Vault location, naming, frontmatter, indexes, and link conventions are defined there. Every read/write below assumes those conventions.

## Workflow

### Step 1: Load the Past From the Vault

Read these from the vault (resolve `$CONDUCTY_VAULT`, default `~/Obsidian/Conducty/`):

- **Latest plan**: `Glob Plans/Plan *.md`, sort by `date` then `time` frontmatter, pick the newest. Inspect:
  - Carry-forward items (status: needs-fix, partial, blocked)
  - Hill chart positions
  - End-of-plan summary
- **Latest improvement**: `Glob Improvements/Improvement *.md`, pick newest — what experiments to apply now
- **`[[Failure Patterns]]`** — recurring patterns to avoid
- **`[[Metrics]]`** — last 7-14 rows for trend data (pass rate, retries, appetite accuracy)

If the vault is empty, note it's a fresh start and proceed.

### Step 2: Load Context

Read all context hub notes in the vault (use Glob `Context/**/Context *.md`). Each is a project summary from [[conducty-context]] with bounded contexts, recent changes, characterization data.

If no context notes exist, ask which projects the user is working on and offer to run [[conducty-context]].

### Step 3: Gather Goals and Set Appetite

Ask the user what they want to accomplish, then ask for the **plan's appetite**:

> "What are your goals for this plan? And how much time should it consume — an hour? Half a day? Full day?"

The appetite constrains the total plan. If goals exceed appetite, cut scope — don't overcommit. This is the most important planning decision.

Accept freeform input. Reference carried-forward items from the prior plan.

### Step 4: Shape Gate — Design Non-Trivial Goals

For each goal, estimate complexity:
- **Low**: Clear requirements, 1-2 files, obvious implementation
- **Medium**: Some design decisions, 3-5 files, acceptance criteria need defining
- **High**: Multiple subsystems, architectural decisions, unclear requirements

**Medium and High goals:** Invoke [[conducty-shape]] before writing prompts. The shaping skill produces a `Design YYYY-MM-DD HHmm {Topic}.md` note in the vault with appetite, acceptance criteria, no-go zones, and component breakdown.

**Low goals:** Proceed directly to Step 5.

The user can skip shaping for a specific goal — note it as `(design skipped by user)`.

### Step 5: Generate the Plan

Resolve current date and time. Pick a topic suffix if more than one plan is expected today (recommended for clarity even when only one plan runs).

Create `Plans/Plan YYYY-MM-DD HHmm [Topic].md` in the vault. Use the [[plan-template]] (despite the name, the template is per-plan, not per-day).

Frontmatter must include:

```yaml
---
type: plan
date: YYYY-MM-DD
time: HHmm
topic: {topic title case}        # optional
appetite: {e.g., 4h}
project: {project-name}          # if scoped to one
tags: [conducty, conducty/plan]
---
```

Then prepend a wikilink to `[[Plans Index]]`.

#### 5a: Map File Structure Per Goal

Before writing prompts, map which files will be created or modified:
- Design units with clear boundaries and one responsibility per file
- Follow established patterns in existing codebases (use Glob/Grep to verify)
- Identify characterization needs for files that will be modified

#### 5b: Decompose Into Prompts

For each goal, select and fill a prompt template from `prompt-templates/`:
- [[feature]] — new feature with acceptance criteria and TDD
- [[bugfix]] — bug fix with reproduction, root cause hypothesis, regression test
- [[refactor]] — restructuring with characterization-first approach
- [[test]] — writing or improving test coverage
- [[decision]] — architectural decision using [[conducty-dialectic]]
- [[security]] — auth, input validation, secrets, hardening (full-review always)
- [[migration]] — schema/version/data migration with expand-contract steps
- [[performance]] — latency/throughput/memory work, measurement-driven

For each prompt:
1. Write the full prompt text using the template — be specific with file paths, code, and behavior
2. Assign a **project** and **directory**
3. Scope the **context** — only files and directories this prompt needs
4. Set a **time budget** — derived from the goal's appetite, divided across its prompts
5. Add a **verification step** — a single command with expected output
6. Estimate **complexity** (Low / Medium / High)
7. Assign a **review level** based on complexity (see below)
8. Note **dependencies** — does this prompt depend on another finishing first?
9. Reference the **design note** wikilink if one was created in Step 4
10. Include **no-go zones** from the design to prevent scope creep

#### 5c: Assign Review Levels (Calibrated Rigor)

Not every prompt needs the same review overhead:

| Complexity | Review Level | What Happens |
|------------|-------------|-------------|
| **Low** | `verify-only` | Run verification command. If it passes, done. |
| **Medium** | `spec-review` | Run verification + dispatch spec compliance reviewer. |
| **High** | `full-review` | Run verification + spec compliance + code quality review. |

This is more efficient than blanket two-stage review for everything. Reserve ceremony for work that warrants it.

#### 5d: Mark Tracers

In each parallelization group, mark the first prompt as `Tracer: yes`. This prompt runs alone before the rest of the group. If it fails, the plan's assumptions for that group need revision — don't blindly execute the remaining prompts.

Choose the tracer wisely: pick the prompt most likely to expose bad assumptions (touches the most shared code, tests the most uncertain part of the design, or integrates with the least-understood system).

#### 5e: Prompt Quality Gate

Before finalizing, check each prompt for **prompt smells** (signs it will fail):

| Smell | Symptom | Fix |
|-------|---------|-----|
| **Vague acceptance** | "Make it work" / "Improve performance" | Add concrete criteria with numbers |
| **Missing context** | References files not listed in Context field | Add the missing file paths |
| **Mixed concerns** | One prompt does two unrelated things | Split into two prompts |
| **No verification** | No command to prove success | Add a test command with expected output |
| **Unbounded scope** | No no-go zones, open-ended "and anything else" | Add explicit boundaries |
| **Exceeds appetite** | Time budget > what's reasonable for complexity | Simplify or split |
| **Missing characterization** | Modifies existing code without verifying current behavior | Add characterization step |

Any prompt with a smell gets fixed before the plan is finalized. A smelly prompt is a wasted execution slot.

### Step 6: Group for Parallelization

Organize prompts into groups:
- **Group A**: Independent prompts that can all run in parallel
- **Group B**: Prompts that depend on Group A completing
- **Group C**: And so on

Within each group, all prompts are independent. The first prompt in each group is the tracer.

### Step 7: Hill Chart Positions

For each goal, mark its starting hill position:
- **Uphill** (figuring it out) — goal still has open design questions or uncertainty
- **Peak** — design is solid, execution is the remaining work
- **Downhill** (making it happen) — clear path, just needs implementation

Goals that are uphill after shaping may need more design work. Goals that are downhill should execute smoothly — if they don't, the design missed something.

### Step 8: Wire Wikilinks

In the plan note's `## Related` section, link:

- `[[Plans Index]]`
- The design notes consumed (e.g. `[[Design 2026-04-27 0930 Auth Cleanup]]`)
- The context notes loaded (e.g. `[[Context My App]]`)
- The improvement note whose experiments are being tested (e.g. `[[Improvement 2026-04-26 1830]]`)
- Any prior plan whose work carries forward
- Accumulating notes this plan will append to: `[[Failure Patterns]]`, `[[Metrics]]`, `[[Prompt Log]]`

Then **prepend the new plan's wikilink to `[[Plans Index]]`** (Edit, not Write).

### Step 9: Present and Refine

Show the user the generated plan. Ask:
- "Does this fit your appetite?"
- "Should I adjust any priorities, groupings, or review levels?"
- "Any prompts to add, remove, or split?"

Iterate until satisfied, then write the final version to the vault.

### Step 10: Plan Quality Gate

Run [[conducty-plan-audit]] against the finalized plan before execution handoff. The audit checks the whole plan, not just individual prompt smells:

- appetite and scope fit
- goal and acceptance clarity
- prompt independence inside groups
- tracer coverage and tracer quality
- concrete verification for every prompt
- no-go zones and scoped context
- review-level calibration
- visible carry-forward from recent `[[Failure Patterns]]`, `[[Metrics]]`, and `[[Improvement YYYY-MM-DD HHmm]]`

Write the gate result into the plan's `## Plan Quality Gate` section.

Gate handling:
- **green**: proceed to execution
- **yellow**: revise the plan unless the user explicitly accepts the risk
- **red**: stop and reshape or rebuild the plan before execution

### Step 11: Execution Handoff

After the plan is finalized:

- **[[conducty-execute]]** (recommended): Automated subagent execution with tracer-first approach and calibrated review
- **Manual execution**: User copies prompts into separate Claude Code sessions
- **Hybrid**: Use [[conducty-execute]] for Low/Medium, manual for High

## Guidelines

- **Appetite constrains everything** — if goals exceed the budget, cut scope, don't overcommit
- **Each prompt is self-contained** — enough context to execute without follow-up questions
- **Smaller prompts > fewer large ones** — smaller prompts have higher first-attempt success rates
- **Scope context per prompt** — only what it needs, not the entire project
- **Every prompt has verification** — no exceptions
- **Tracers validate the plan** — if a tracer fails, it's a plan problem
- **Review level matches risk** — don't waste ceremony on low-risk work
- **No-go zones in every prompt** — prevent the most common failure mode (agent scope creep)
- **Learn from the vault** — prior failure patterns and improvement experiments visibly shape this plan's prompts
- **Prompt smells get fixed before execution** — a smelly prompt is a wasted slot
- **Plan gate before execution** — [[conducty-plan-audit]] must be green, or deliberately revised/accepted, before tracer execution
- **Index discipline** — every new plan is prepended to `[[Plans Index]]` in the same action that creates it
