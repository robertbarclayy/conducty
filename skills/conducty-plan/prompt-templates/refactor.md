---
aliases:
  - refactor
  - refactor-template
tags:
  - conducty/template
  - conducty/prompt-template
  - conducty/plan
---

# Refactor Prompt Template

Use when generating a prompt for code refactoring.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Refactor: {short description}
  - **Type**: refactor
  - **Prompt**:
    Refactor {what} in {project}.

    **Appetite**: {time budget for this prompt}

    **Before** (current architecture): {describe what exists now}

    **After** (target architecture): {describe what it should look like}

    **Constraints**:
    - No behavior changes — all existing tests must continue to pass
    - {additional constraints}

    **Characterization** (MANDATORY first step):
    Before making ANY changes:
    1. Run `{full test suite command}` and record the results
    2. Read and understand the code you're about to modify
    3. If any tests fail BEFORE your changes, STOP and report
    4. Confirm you understand the purpose of each function/module being refactored

    This establishes the baseline. Your refactor must produce identical test results.

    **Files to modify**:
    - {path/to/file} — {what changes}

    **No-go zones** (do NOT do these):
    - Do not change behavior — this is a structural change only
    - Do not refactor files outside the listed scope
    - Do not add new features or "improvements" while refactoring
    - {additional boundaries}

    See [[Context {Project Title Case}]] in the vault for architecture overview.

    **Before you begin**: Read the existing code thoroughly. If the refactor
    scope is larger than described, or if you discover that the current
    architecture has reasons you don't understand — ask. Do not refactor code
    whose purpose you don't fully grasp. If you exceed the appetite
    ({time budget}), stop and report.

    **Escalation**: A partial refactor that breaks things is worse than no
    refactor. Report BLOCKED if you find unexpected dependencies.
    Report DONE_WITH_CONCERNS if the target architecture needs adjustment.

    **Before reporting — self-review**:
    - Do ALL existing tests still pass? (Full suite, not targeted)
    - Did I introduce any behavior changes? (Must be zero)
    - Does the code match the "After" description?
    - Did I only touch listed files?
    - Did I avoid scope creep?
    - Are there any public API surfaces I may have broken?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - Characterization results (test suite before vs. after — must match)
    - What was refactored and how it maps to Before/After
    - Files changed
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {specific files/dirs relevant}
  - **No-go zones**: No behavior changes, no unrelated refactoring
  - **Verification**: `{full test suite}` → identical results as before refactor
  - **Expected outcome**: Code restructured, all tests pass, no behavior changes
  - **Complexity**: Low / Medium / High
  - **Review level**: spec-review / full-review (never verify-only for refactors)
  - **Time budget**: {minutes}
```

## Guidelines

- Characterization is MANDATORY and comes FIRST — this is the core differentiator from naive refactoring
- The agent must record baseline test results before touching anything
- Refactors are never verify-only — at minimum spec-review to confirm no behavior change
- Before/After description is the contract — deviations are spec failures
- No-go zones explicitly forbid the most common refactor failure: scope creep

## Related

- [[conducty-plan]], [[conducty-tdd]]
- [[feature]], [[bugfix]], [[test]], [[decision]] — sibling templates
