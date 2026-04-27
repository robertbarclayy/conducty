---
aliases:
  - feature
  - feature-template
tags:
  - conducty/template
  - conducty/prompt-template
  - conducty/plan
---

# Feature Prompt Template

Use when generating a prompt for new feature implementation.

## Structure

```markdown
- [ ] **P{N}**: [{project}] {short description}
  - **Type**: feature
  - **Prompt**:
    Implement {feature name} in {project}.

    **Goal**: {one-sentence description of the feature and its purpose}

    **Appetite**: {time budget for this prompt}

    **Acceptance criteria**:
    - {criterion 1 — concrete, verifiable}
    - {criterion 2}

    **Files to create/modify**:
    - {path/to/file} — {what to do}

    **No-go zones** (do NOT do these):
    - {explicit boundary 1}
    - {explicit boundary 2}

    **Characterization** (for existing codebases):
    - Before making changes, verify that `{existing test command}` passes
    - Confirm current behavior of {specific function/module} before modifying

    **Test expectations**:
    - Write a failing test FIRST for each behavior, then implement to make it pass
    - {describe what tests should cover}

    See [[Context {Project Title Case}]] in the vault for architecture overview.

    **Before you begin**: If anything about the requirements, approach, or file
    structure is unclear — ask. Do not guess. It is always better to clarify
    than to build the wrong thing. If you notice the work exceeding the appetite
    ({time budget}), stop and report back rather than continuing.

    **Escalation**: It is always OK to stop. Bad work is worse than no work.
    Report BLOCKED if the task requires decisions not covered here.
    Report NEEDS_CONTEXT if you need information that wasn't provided.

    **Code organization**: Follow existing patterns. Each file has one clear
    responsibility. If a new file is growing large, stop and report.

    **Before reporting — self-review**:
    - Did I implement everything in the acceptance criteria?
    - Did I respect the no-go zones?
    - Did I follow TDD (failing test first)?
    - Did I avoid overbuilding (YAGNI)?
    - Do tests verify behavior, not mock behavior?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - What was implemented and tested
    - Files changed
    - Self-review findings
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {specific files/dirs relevant}
  - **No-go zones**: {same as in prompt, for orchestrator reference}
  - **Verification**: `{test command}` → expect {expected result}
  - **Expected outcome**: {what files change, what the result looks like}
  - **Complexity**: Low / Medium / High
  - **Review level**: verify-only / spec-review / full-review
  - **Time budget**: {minutes}
```

## Guidelines

- No-go zones are mandatory — they prevent the most common agent failure mode (scope creep)
- Characterization step ensures existing behavior is verified before changes
- Time budget creates a natural circuit breaker — the agent stops if it's taking too long
- Acceptance criteria must be concrete enough to verify with a command
- The self-review includes a no-go zone check, not just completeness

## Related

- [[conducty-plan]] — selects this template during Step 5b
- [[conducty-tdd]] — TDD discipline applied within the prompt
- [[bugfix]], [[refactor]], [[test]], [[decision]] — sibling templates
