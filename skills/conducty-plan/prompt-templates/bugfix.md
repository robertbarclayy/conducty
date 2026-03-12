# Bugfix Prompt Template

Use when generating a prompt for bug fixes.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Fix: {short description of the bug}
  - **Type**: bugfix
  - **Prompt**:
    Fix {bug description} in {project}.

    **Appetite**: {time budget for this prompt}

    **Reproduction steps**:
    1. {step 1}
    2. {step 2}
    3. Observe: {what goes wrong}

    **Root cause hypothesis**: {best guess at what's causing it, based on context}

    **Leverage point analysis**: Is this likely a code bug, a design gap, or
    an environment issue? {your assessment and why}

    **Fix scope**:
    - {path/to/file} — {what needs to change}

    **No-go zones** (do NOT do these):
    - Do not refactor unrelated code
    - Do not fix other bugs you happen to notice
    - {additional boundaries}

    **Regression test**:
    - Write a failing test that reproduces the bug FIRST
    - Verify the test fails for the right reason (bug present)
    - Implement the fix
    - Verify the test passes
    - Run broader test suite to check for regressions

    See ~/.conducty/context/{project}.md for architecture overview.

    **Before you begin**: If the reproduction steps don't reproduce the bug, or
    if the root cause hypothesis seems wrong — STOP and report back. Do not
    guess at fixes. Investigate the actual root cause: read error messages,
    trace data flow, check recent changes. If you exceed the appetite
    ({time budget}), stop and report.

    **Escalation**: If you've tried 2+ approaches without success, STOP — this
    may be an architectural problem. Report BLOCKED with what you've investigated
    and what you think is actually wrong.

    **Before reporting — self-review**:
    - Did I find the actual root cause, or fix a symptom?
    - Does my regression test fail without the fix and pass with it?
    - Did I run the broader test suite?
    - Did I make the SMALLEST change to fix the issue?
    - Did I respect the no-go zones?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - Root cause found (what was actually wrong)
    - Leverage point: was it a code bug, design gap, or environment issue?
    - What was fixed and how
    - Regression test results (red-green cycle)
    - Files changed
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {specific files/dirs relevant}
  - **No-go zones**: No unrelated changes
  - **Verification**: `{test command}` → expect {result}; `{broader suite}` → no new failures
  - **Expected outcome**: Bug resolved, regression test passes, no regressions
  - **Complexity**: Low / Medium / High
  - **Review level**: verify-only / spec-review / full-review
  - **Time budget**: {minutes}
```

## Guidelines

- Leverage point analysis helps the orchestrator decide whether to fix the prompt, the plan, or the code
- Root cause hypothesis anchors the agent — prevents symptom-fixing
- The 2-attempt escalation prevents infinite retry loops at the agent level
- No-go zones prevent "while I'm here" improvements that introduce risk
- Regression test must show the red-green cycle (fail → fix → pass)
