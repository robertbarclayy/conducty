---
name: conducty-debug
description: Use when a prompt fails verification, a checkpoint catches an issue, or fix attempts aren't working — applies leverage point analysis and prompt forensics before generating fixes
---

# Conducty Debug — Leverage Point Analysis

When something fails, the first question is not "what's wrong with the code?" It's "where is the highest leverage point to fix this?" A failure might be a code bug, a prompt quality problem, a plan assumption error, or a systemic issue affecting multiple prompts. Fixing at the wrong level wastes retries.

## The Leverage Hierarchy

Fix at the highest level that applies:

```
Plan assumptions  →  fixes the most, prevents future failures
  ↓
Prompt quality    →  fixes this prompt and similar future prompts
  ↓
Code bug          →  fixes this specific failure only
```

**Plan-level fix:** The design was wrong, the acceptance criteria were incorrect, or the context was insufficient. A code fix won't help because the code was implementing the wrong thing correctly. Signal: the tracer failed, or multiple prompts in the same group fail for related reasons.

**Prompt-level fix:** The prompt was vague, missing context, had no no-go zones, or specified the wrong approach. The code did what the prompt said, but the prompt said the wrong thing. Signal: spec review passes but verification fails, or the implementer was BLOCKED/NEEDS_CONTEXT.

**Code-level fix:** The prompt was clear and correct, but the implementation had a bug. This is the only case where a traditional "fix the code" approach is appropriate. Signal: the failure is in specific logic, not in misunderstanding.

## The Four Phases

### Phase 1: Classify the Failure

**Before doing anything else**, determine the leverage point:

1. **Read the failure output carefully.** What exactly failed? Not "tests fail" but which test, which assertion, what value.

2. **Compare failure against the prompt.** Did the implementer build what the prompt asked for? If yes, the problem is the prompt or the plan, not the code. If no, it might be a code bug.

3. **Check if this is systemic.** Are other prompts in the same group failing? Do they share assumptions, context, or dependencies? If 2+ prompts fail in the same group, suspect a plan-level issue before investigating individual code bugs.

4. **Classify:**
   - **Plan-level**: Tracer failed, multiple related failures, design assumptions don't hold
   - **Prompt-level**: Agent was BLOCKED/NEEDS_CONTEXT, verification fails despite spec compliance, prompt smells visible in retrospect
   - **Code-level**: Clear implementation bug in otherwise well-specified work

### Phase 2: Investigate Root Cause

Investigation depends on the leverage level:

**For plan-level issues:**
- Re-read the design doc from `conducty-shape`. What assumption doesn't hold?
- Check the project context file — is it stale or incomplete?
- Was the complexity underestimated? Was the appetite realistic?
- Would a different decomposition avoid this failure?

**For prompt-level issues:**
- Check for prompt smells (see `conducty-tdd`): vague acceptance, missing context, mixed concerns, no verification, unbounded scope
- Was the no-go zone clear enough? Did the agent creep outside scope?
- Was the characterization step present for existing code modifications?
- Would a different prompt structure have prevented this?

**For code-level issues:**
- Read error messages and stack traces completely
- Check what the prompt actually changed (`git diff`)
- Trace data flow: where does the bad value originate?
- Find working examples of similar code in the same codebase
- Compare what's different between working and broken

### Phase 3: Hypothesis and Minimal Test

1. **Form a single hypothesis.** "The root cause is X because Y." Be specific.
2. **Design the minimal verification.** What's the smallest thing you can check to confirm or deny the hypothesis?
3. **Test it.** One variable at a time. Don't fix multiple things at once.
4. **If wrong:** Form a new hypothesis. Don't pile on fixes.

### Phase 4: Generate the Fix

The fix depends on the leverage level:

**Plan-level fix:**
- Revise the design or plan assumptions
- May require re-running `conducty-shape` for the affected goal
- May require restructuring the group
- Update the daily plan before generating new prompts

**Prompt-level fix:**
- Rewrite the prompt with the missing context, clearer criteria, or better approach
- Add the prompt smell that was missed to the improvement log
- The fix prompt should reference the original failure: "This prompt failed because [root cause]. The rewritten version addresses this by [specific change]."

**Code-level fix:**
Generate a root-cause-informed fix prompt:

```markdown
Fix P{N}: {original description}

**Root cause**: {what was actually wrong, with evidence}
**Leverage point**: Code — the prompt was correct, the implementation had a bug

**What went wrong**: {the specific failure}

**Fix required**:
- {path/to/file} — {exact change needed and why}

**Do NOT**:
- {wrong fix that addresses the symptom}
- {scope creep that goes beyond the fix}

**Verification**: `{original verification}` AND confirm {specific fix evidence}
```

## Circuit Breaker: 3 Retries

If a prompt has Retries >= 2 and this would be attempt #3:

**STOP.** Do not generate another fix.

This pattern indicates the fix is at the wrong leverage level. Three code-level fixes that don't work means the problem is at the prompt or plan level:
- Each fix reveals new issues in different places → design assumption is wrong
- Fixes require changes outside the prompt's scope → decomposition is wrong
- Each fix creates new symptoms → the approach itself is flawed

**Instead:**
1. Set Status to `blocked`
2. Summarize: what was tried, what happened each time, what pattern you see
3. Identify which higher leverage level the problem actually belongs to
4. Present to the user with a recommendation: revise the design, split the prompt, or take a different approach entirely

## Pattern Library

After resolving a failure, log the pattern to `~/.conducty/history/failure-patterns.md`:

```markdown
### {date} — {brief description}
- **Leverage point**: plan / prompt / code
- **Symptom**: {what the failure looked like}
- **Root cause**: {what was actually wrong}
- **Fix**: {what resolved it}
- **Prevention**: {what would prevent this in future prompts}
```

The pattern library is read by `conducty-plan` and `conducty-improve` to prevent repeat failures. A pattern that appears twice is a process gap, not bad luck.

## Systemic Failure Detection

When investigating a single failure, also check for systemic issues:

- **2+ failures in the same group** with related symptoms → likely a shared assumption problem
- **Failures across groups** in the same project → likely stale context or incorrect architecture understanding
- **Failures across projects** → likely a prompt template problem

Systemic issues get plan-level or template-level fixes, not individual prompt fixes. Flag them for `conducty-checkpoint` and `conducty-improve`.
