---
name: conducty-checkpoint
description: Quality gate between parallelization groups — measures health metrics, updates hill charts, detects systemic failures, and gates advancement. Use when a group finishes, the user says "checkpoint" or "verify group", or between groups in a daily plan.
---

# Conducty Checkpoint — Health-Aware Group Gate

Gate between parallelization groups. Verifies every prompt using calibrated review, computes health metrics, detects systemic failures, updates hill charts, and generates leverage-appropriate fix prompts before the next group begins.

## The Iron Law

```
NO GROUP ADVANCEMENT WITHOUT INDEPENDENT VERIFICATION OF EVERY PROMPT
```

Do not trust self-reports. Verify independently using `conducty-verify` at the prompt's assigned review level.

## Workflow

### Step 1: Load the Plan

Read `~/.conducty/plans/YYYY-MM-DD.md`. Identify the just-completed group.

### Step 2: Systemic Failure Check

Before reviewing individual prompts, scan for systemic issues:

- How many prompts in the group completed vs. failed/blocked?
- Do failures share common symptoms (same error, same module, same missing context)?
- Did the tracer succeed but other prompts fail? (Suggests the tracer wasn't representative)

**If 2+ prompts failed with related symptoms:** Flag as potential systemic issue. Investigate at the plan/design level (via `conducty-debug` leverage analysis) BEFORE generating individual fix prompts. Individual fixes for a systemic problem waste retry slots.

### Step 3: Verify Each Prompt (Calibrated)

For each completed prompt, apply its assigned review level:

**verify-only prompts:**
1. Run the verification command via `conducty-verify`
2. Pass? → mark `completed`
3. Fail? → mark `needs-fix`

**spec-review prompts:**
1. Run the verification command
2. If verification passes, dispatch spec compliance reviewer
3. Both pass? → mark `completed`
4. Either fails? → mark `needs-fix`, note which stage failed

**full-review prompts:**
1. Run the verification command
2. If verification passes, dispatch spec reviewer
3. If spec passes, dispatch quality reviewer
4. All three pass? → mark `completed`
5. Any fails? → mark `needs-fix`, note which stage failed

**For every prompt**, record the result in the evidence format from `conducty-verify`.

### Step 4: Compute Health Metrics

After reviewing all prompts, calculate:

```markdown
### Group {X} Health — {timestamp}

| Metric | Value |
|--------|-------|
| Total prompts | N |
| First-attempt passes | N |
| Needs fix | N |
| Blocked | N |
| First-attempt pass rate | N% |
| Tracer result | pass/fail |
```

**Interpret the metrics:**
- **Pass rate > 80%**: Healthy. Plan and prompts are well-calibrated.
- **Pass rate 50-80%**: Concerning. Prompt quality or context may need improvement. Note patterns.
- **Pass rate < 50%**: Unhealthy. Likely a plan-level or design-level issue. Investigate systemically before generating fixes.
- **Tracer failed but others passed**: The tracer wasn't representative — note this for future planning.
- **Tracer passed but others failed**: The group had hidden dependencies or context gaps.

Update the running health metrics in the plan's `## Health Metrics (Running)` section.

### Step 5: Update Hill Chart

For each goal that had prompts in this group:
- Did all its prompts pass? → Move toward **downhill** (making it happen)
- Did prompts fail with design issues? → Move toward **uphill** (still figuring it out)
- Was progress made but work remains? → Note position

Update the plan's `## Hill Chart Update` section.

### Step 6: Generate Fix Prompts

For each prompt marked `needs-fix`:

1. **Invoke `conducty-debug`** to determine the leverage point (plan / prompt / code)
2. **Increment the prompt's Retries count**
3. **If Retries < 3**, generate a fix at the appropriate leverage level:
   - Plan-level: revise the plan, don't generate a code fix
   - Prompt-level: rewrite the prompt with better context/criteria
   - Code-level: generate a root-cause-informed fix prompt
   - Insert fix prompts at the start of the next group
4. **If Retries >= 3**, set Status to `blocked`:
   - Include summary of all attempts and the pattern across them
   - Identify which leverage level was missed
   - This needs human intervention or design revision

### Step 7: Record Checkpoint Results

Update the plan's `## Checkpoint Notes` section:

```markdown
### Group {X} Checkpoint — {timestamp}

**Health:** {pass rate}% first-attempt pass rate ({N}/{total})
**Systemic issues:** {none / description}

**Per-prompt results:**
- **P{N}**: {review-level} → {pass/needs-fix/blocked} — {brief note with evidence}

**Hill chart movement:**
- Goal 1: {position change}

**Fix prompts generated:** {count, leverage levels}
```

### Step 8: Gate the Next Group

Present the checkpoint to the user:

- **All passed:** "Group {X} passed checkpoint ({N}% pass rate). Ready for Group {Y}."
- **Fixes generated:** "Group {X}: {N}/{total} passed. {M} fix prompts generated (leverage: {levels}). Review and proceed?"
- **Blocked prompts:** "Group {X} has {N} blocked prompts (3+ failures). Pattern: {description}. Needs design review."
- **Systemic issue:** "Group {X} shows a systemic failure pattern: {description}. Recommend revising the plan before continuing."

Do not proceed until the user confirms.

## Principles

- **Health metrics are the primary signal** — pass rate tells you about plan quality, not just code quality
- **Systemic detection before individual fixes** — don't waste retries on symptoms of a shared cause
- **Hill charts track progress at the goal level** — a goal that stalls uphill needs design work, not more prompts
- **Review level from the plan** — don't over-review low-risk or under-review high-risk
- **3-strike circuit breaker** — three failures means the fix is at the wrong leverage level
- **Every checkpoint is learning data** — health metrics and patterns feed into `conducty-improve`
