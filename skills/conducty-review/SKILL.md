---
name: conducty-review
description: End-of-day review sweep of executed prompts. Audits changes, records verdicts with evidence, extracts failure patterns, computes velocity metrics, and prepares carry-forward intelligence. Use when the user says "review", "audit", "review today's work", or at end of day.
---

# Conducty Review — End-of-Day Audit

Systematically review all executed prompts from today's plan, verify results with evidence, extract failure patterns for the learning system, and prepare intelligent carry-forward for tomorrow.

## Workflow

### Step 1: Load Today's Plan

Read `~/.conducty/plans/YYYY-MM-DD.md`. If no plan exists, tell the user and ask if they want to review a different date.

Parse the prompt queue to identify all prompts and their current status.

### Step 2: Identify What Needs Review

- **Completed (from checkpoint)**: Already verified — confirm the checkpoint evidence is in the notes
- **Needs-fix with pending fixes**: Check if the fix was applied
- **Unchecked**: Not executed — skip, note as carry-forward
- **Already reviewed**: Skip unless user requests re-review

Focus on prompts that completed since the last checkpoint or were fixed after checkpoint feedback.

### Step 3: Review Each Prompt

For each prompt needing review:

1. **Check checkpoint evidence** — if the prompt passed checkpoint, confirm the evidence is recorded
2. **If no checkpoint evidence**: Run `conducty-verify` at the prompt's review level
3. **Check for unintended changes** — `git diff`/`git status` in the prompt's directory. Any files changed that weren't in the expected outcome?
4. **Confirm intent was met** — does the actual change match the goal's design, not just the prompt's letter?

### Step 4: Record Verdicts

For each prompt, record a verdict:
- **completed** — changes verified, intent met, no issues
- **needs-fix** — issues found, can be retried (increment Retries)
- **partial** — some parts done, rest needs follow-up
- **failed** — didn't produce useful results, needs rethinking
- **blocked** — exceeded retries or needs manual intervention

**Retry handling for needs-fix:**
1. Check Retries count
2. If Retries < 3: invoke `conducty-debug` to determine leverage point, generate fix prompt
3. If Retries >= 3: set to `blocked` with full history of attempts

Update each prompt's Status in the plan.

### Step 5: Extract Failure Patterns

For every non-completed prompt, analyze the failure and append to `~/.conducty/history/failure-patterns.md`:

```markdown
### {date} — P{N}: {description}
- **Leverage point**: plan / prompt / code
- **Symptom**: {what the failure looked like}
- **Root cause**: {what was actually wrong}
- **Prompt smells present**: {which smells were visible in retrospect}
- **Prevention**: {what would prevent this in future prompts}
```

Look for patterns across failures:
- Same prompt smell appearing in multiple failures? → template problem
- Same project failing repeatedly? → context is stale or incomplete
- Same complexity level failing? → calibration is off

### Step 6: Compute Velocity Metrics

Calculate and record in the plan's `## End-of-Day Summary`:

```markdown
## End-of-Day Summary

- **Total prompts**: N
- **Completed**: N ({%})
- **First-attempt passes**: N ({%})
- **Needs fix**: N
- **Partial**: N
- **Failed**: N
- **Blocked**: N
- **Total retries**: N
- **Average retries per fix**: N
- **Appetite used**: {actual time} / {budgeted time}
- **Carry forward**: {prompt IDs with context}
```

Also append to `~/.conducty/history/metrics.md`:

```markdown
### {date}
- Prompts: {total} | Completed: {n} | Pass rate: {%} | Retries: {n}
- Appetite: {used}/{budget}
- Blocked: {n}
- Top failure pattern: {brief}
```

### Step 7: Prepare Carry-Forward

For items carrying forward to tomorrow, include **carry-forward intelligence** — not just "needs fix" but actionable context:

```markdown
## Carry Forward

- **P{N}**: {description}
  - **Status**: needs-fix / partial / blocked
  - **What happened**: {brief history of attempts}
  - **Root cause**: {if identified}
  - **Recommended approach**: {what to try differently}
  - **Leverage point**: {plan / prompt / code}
```

This is what `conducty-plan` reads tomorrow in Step 1. Make it useful.

### Step 8: Hand Off to Improvement

After the review is complete, invoke `conducty-improve` for the daily learning loop. The review provides the data; the improvement kata extracts the lessons.

## Principles

- **Evidence-based verdicts** — every verdict references verification output, not impressions
- **Failure patterns are the most valuable output** — they prevent future failures
- **Carry-forward intelligence saves tomorrow** — "needs fix" with context is 10x more useful than "needs fix" alone
- **Metrics track system health** — pass rate trend tells you if the process is improving
- **Review feeds improvement** — this step produces data, `conducty-improve` produces change
