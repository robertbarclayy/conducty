---
name: conducty-improve
description: Use at the end of each day after conducty-review completes — runs the improvement kata to extract lessons, identify experiments, and shape tomorrow's approach. Also use when the user says "what did we learn", "improve the process", or "retrospective".
---

# Conducty Improve — The Learning Loop

The improvement kata transforms daily execution data into process improvements. Without this step, Conducty is an execution pipeline that repeats the same mistakes. With it, Conducty is a learning system that gets better each day.

This is the step that closes the feedback loop: Shape → Plan → Execute → Verify → **Improve** → Shape (tomorrow).

## The Improvement Kata

*Adapted from Toyota Kata (Mike Rother) — four questions applied to agentic work.*

### Question 1: What Was the Target Condition?

Read today's plan (`~/.conducty/plans/YYYY-MM-DD.md`):
- What goals were set?
- What was the appetite?
- What was the expected pass rate and velocity?
- What improvement experiments from yesterday were being tested?

### Question 2: What Is the Current Condition?

Read today's review results (the `## End-of-Day Summary` and `## Checkpoint Notes`):
- What actually happened? How many prompts completed vs. failed?
- What was the first-attempt pass rate?
- How did actual time compare to appetite?
- Did the improvement experiments from yesterday show results?

### Question 3: What Obstacles Did We Encounter?

Read `~/.conducty/history/failure-patterns.md` (today's entries):
- What patterns caused failures?
- At which leverage level were most failures? (plan / prompt / code)
- Which prompt smells were most common?
- Were there systemic issues?
- What surprised us?

Categorize obstacles:

| Category | Example | Fix Level |
|----------|---------|-----------|
| **Stale context** | Agent used outdated architecture info | Refresh `conducty-context` |
| **Prompt smell** | Vague acceptance criteria led to wrong implementation | Improve prompt template |
| **Design gap** | Shaping missed a key constraint | Improve `conducty-shape` process |
| **Calibration error** | Low complexity prompt turned out to be Medium | Adjust complexity estimation |
| **Template weakness** | Bug fix template didn't include characterization step | Fix the template |
| **Tool limitation** | Agent model couldn't handle the task complexity | Adjust model selection |

### Question 4: What Is Our Next Experiment?

Propose 1-3 specific, testable experiments for tomorrow:

Each experiment should be:
- **Specific**: "Add characterization step to ALL refactor prompts" not "improve prompts"
- **Testable**: You can tell tomorrow whether it worked
- **Small**: Changes one thing at a time
- **Targeted**: Addresses a specific obstacle from Question 3

Examples:
- "Yesterday 3 prompts failed because of missing context. Tomorrow: include the module dependency graph in context for prompts touching shared modules."
- "Yesterday's pass rate was 60%. The main smell was vague acceptance criteria. Tomorrow: every acceptance criterion must include a specific number or behavior, no qualitative criteria."
- "Yesterday's refactor prompts all needed extra retries. Tomorrow: add mandatory characterization step to every refactor prompt before any changes begin."

## Recording Improvements

Append to `~/.conducty/history/improvements.md`:

```markdown
### {date}

**Target condition**: {what we planned}
**Current condition**: {what happened — pass rate, velocity, appetite usage}

**Obstacles**:
- {obstacle 1} — leverage: {plan/prompt/code}
- {obstacle 2} — leverage: {plan/prompt/code}

**Experiments for tomorrow**:
1. {specific experiment} — testing whether {hypothesis}
2. {specific experiment} — testing whether {hypothesis}

**Prior experiments evaluated**:
- {yesterday's experiment 1}: {worked / didn't work / inconclusive} — {evidence}
```

## What Makes This Different from Logging

Logging records what happened. Improvement changes what happens next.

The difference is in Question 4. If you finish the kata without specific experiments that will change tomorrow's plan, you've just logged — you haven't improved. Every session must produce at least one concrete experiment.

**The test:** Can `conducty-plan` read tomorrow's improvement notes and produce a measurably different plan? If yes, the kata worked. If no, you just wrote a diary entry.

## Integration

- **Input from `conducty-review`**: End-of-day summary, failure patterns, velocity metrics, carry-forward items
- **Input from `conducty-checkpoint`**: Health metrics, hill chart positions, systemic issues
- **Output to `conducty-plan`**: Tomorrow reads `improvements.md` in Step 1 and applies the experiments
- **Output to prompt templates**: If a template weakness is identified, fix the template file directly
- **Output to `conducty-context`**: If stale context was an obstacle, trigger a context refresh

## Frequency

- **Daily** (primary): After `conducty-review`, before ending the session
- **Weekly** (optional): Review the week's improvement notes for larger patterns
- **After major failures**: When a goal is blocked or the daily pass rate drops below 50%
