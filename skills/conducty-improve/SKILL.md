---
name: conducty-improve
description: End-of-plan improvement kata. Extracts lessons from the just-finished plan, identifies experiments, and shapes the next plan's approach. Use after [[conducty-review]] completes, or when the user says "what did we learn", "improve the process", "retrospective", "wrap up this plan".
aliases:
  - conducty-improve
  - improve
tags:
  - conducty/skill
  - conducty/improve
---

# Conducty Improve — The Learning Loop

The improvement kata transforms execution data into process improvements. Without this step, Conducty is an execution pipeline that repeats the same mistakes. With it, Conducty is a learning system that gets better with every plan.

This is the step that closes the feedback loop: Shape → Plan → Execute → Verify → **Improve** → Shape (next plan).

## The Improvement Kata

*Adapted from Toyota Kata (Mike Rother) — four questions applied to agentic work.*

### Question 1: What Was the Target Condition?

Read the just-finished plan note from the vault (`Plan YYYY-MM-DD HHmm [Topic].md` — see [[conducty-obsidian]]):
- What goals were set?
- What was the appetite?
- What was the expected pass rate and velocity?
- What improvement experiments from the prior plan were being tested?

### Question 2: What Is the Current Condition?

Read the plan's review results (the `## End-of-Plan Summary` and `## Checkpoint Notes`):
- What actually happened? How many prompts completed vs. failed?
- What was the first-attempt pass rate?
- How did actual time compare to appetite?
- Did the improvement experiments from the prior plan show results?

### Question 3: What Obstacles Did We Encounter?

Read recent entries from `[[Failure Patterns]]` (the accumulating note in the vault):
- What patterns caused failures?
- At which leverage level were most failures? (plan / prompt / code)
- Which prompt smells were most common?
- Were there systemic issues?
- What surprised us?

Categorize obstacles:

| Category | Example | Fix Level |
|----------|---------|-----------|
| **Stale context** | Agent used outdated architecture info | Refresh [[conducty-context]] |
| **Prompt smell** | Vague acceptance criteria led to wrong implementation | Improve prompt template |
| **Design gap** | Shaping missed a key constraint | Improve [[conducty-shape]] process |
| **Calibration error** | Low complexity prompt turned out to be Medium | Adjust complexity estimation |
| **Template weakness** | Bug fix template didn't include characterization step | Fix the template |
| **Tool limitation** | Agent model couldn't handle the task complexity | Adjust model selection |

### Question 4: What Is Our Next Experiment?

Propose 1-3 specific, testable experiments for the next plan:

Each experiment should be:
- **Specific**: "Add characterization step to ALL refactor prompts" not "improve prompts"
- **Testable**: You can tell next plan whether it worked
- **Small**: Changes one thing at a time
- **Targeted**: Addresses a specific obstacle from Question 3

Examples:
- "Last plan, 3 prompts failed because of missing context. Next: include the module dependency graph in context for prompts touching shared modules."
- "Last plan's pass rate was 60%. The main smell was vague acceptance criteria. Next: every acceptance criterion must include a specific number or behavior, no qualitative criteria."
- "Last plan's refactor prompts all needed extra retries. Next: add mandatory characterization step to every refactor prompt before any changes begin."

## Recording Improvements

Write a new note to the vault: `Improvement YYYY-MM-DD HHmm.md` (timestamp = when the kata is run, typically right after [[conducty-review]]).

```markdown
---
type: improvement
date: YYYY-MM-DD
time: HHmm
tags: [conducty, conducty/improvement]
---

# Improvement YYYY-MM-DD HHmm

**Target condition**: {what we planned}
**Current condition**: {what happened — pass rate, velocity, appetite usage}

## Obstacles
- {obstacle 1} — leverage: {plan/prompt/code}
- {obstacle 2} — leverage: {plan/prompt/code}

## Experiments for Next Plan
1. {specific experiment} — testing whether {hypothesis}
2. {specific experiment} — testing whether {hypothesis}

## Prior Experiments Evaluated
- {prior experiment 1}: {worked / didn't work / inconclusive} — {evidence}

## Related

- Index: [[Improvements Index]]
- Reflects on: [[Plan YYYY-MM-DD HHmm Topic]]
- Patterns: [[Failure Patterns]]
- Trends: [[Metrics]]
- Prior: [[Improvement YYYY-MM-DD HHmm]]
```

Then prepend the new note's wikilink to `[[Improvements Index]]`.

## What Makes This Different from Logging

Logging records what happened. Improvement changes what happens next.

The difference is in Question 4. If you finish the kata without specific experiments that will change the next plan, you've just logged — you haven't improved. Every kata must produce at least one concrete experiment.

**The test:** Can [[conducty-plan]] read the latest improvement note and produce a measurably different plan? If yes, the kata worked. If no, you just wrote a diary entry.

## Integration

- **Input from [[conducty-review]]**: End-of-plan summary, failure patterns, velocity metrics, carry-forward items
- **Input from [[conducty-checkpoint]]**: Health metrics, hill chart positions, systemic issues
- **Output to [[conducty-plan]]**: The next plan reads the latest `Improvement YYYY-MM-DD HHmm` note in Step 1 and applies the experiments
- **Output to prompt templates**: If a template weakness is identified, edit the template file directly (Edit tool)
- **Output to [[conducty-context]]**: If stale context was an obstacle, trigger a context refresh

## Frequency

- **Per plan** (primary): After [[conducty-review]], before starting the next plan
- **Weekly** (optional): Skim the week of improvement notes via [[Improvements Index]] for larger patterns
- **After major failures**: When a goal is blocked or pass rate drops below 50%
