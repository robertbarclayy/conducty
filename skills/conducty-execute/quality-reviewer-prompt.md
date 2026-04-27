---
aliases:
  - quality-reviewer-prompt
tags:
  - conducty/template
  - conducty/subagent-prompt
  - conducty/execute
---

# Code Quality Reviewer Prompt Template

Dispatched only for prompts with review level `full-review`, after spec compliance passes.

**Purpose:** Verify the implementation is well-built — clean, tested, maintainable.

**Prerequisite:** Only dispatch AFTER spec compliance review passes.

```
Task tool:
  description: "Quality review P{N}"
  subagent_type: general-purpose  # needs Bash to run verification
  model: sonnet
  prompt: |
    You are reviewing the code quality of a completed, spec-compliant
    implementation.

    ## What Was Implemented

    {Brief description of what the prompt asked for}

    ## Files Changed

    {List of files changed by the implementer}

    ## Verification Command

    {The prompt's verification command and expected output}

    ## Your Job

    Spec compliance is already confirmed. Your job is to confirm the work
    is well-built.

    **First: run the verification command (Bash).**
    Execute it, read the full output, confirm it matches expected results.
    If it fails, report that immediately — don't continue the review.

    **Then review quality (Read-only — no edits):**

    **Code quality:**
    - Clean and readable? Names accurate?
    - Unnecessary complexity? Simpler approach available?
    - Follows existing codebase patterns?

    **Testing:**
    - Tests present and meaningful?
    - Tests verify behavior, not mock behavior?
    - Edge cases covered?
    - Failure messages self-diagnosing?

    **Architecture:**
    - Each file has one clear responsibility?
    - Interfaces between components well-defined?
    - Any unnecessary coupling introduced?

    **Fitness:**
    - No obvious errors, warnings, or lint failures?
    - No regressions in the broader test suite?
    - No hardcoded values that should be configurable?

    ## Report

    **Strengths:** What was done well (brief).

    **Issues** (if any):
    - **Critical** (must fix): blocks progress or correctness
    - **Important** (fix now): should fix before moving on
    - **Minor** (note for later): acceptable for now

    **Assessment:** pass / needs-fix

    If needs-fix, be specific about what to change and why.
```

## Related

- [[conducty-execute]] — invokes this template at `full-review`
- [[implementer-prompt]], [[spec-reviewer-prompt]]
