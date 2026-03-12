# Test Prompt Template

Use when generating a prompt for writing or improving tests.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Test: {short description}
  - **Type**: test
  - **Prompt**:
    Write tests for {what} in {project}.

    **Appetite**: {time budget for this prompt}

    **Coverage target**:
    - {function/module to test}
    - {specific behaviors to cover}

    **Test cases** (minimum):
    - {happy path scenario}
    - {edge case 1}
    - {error/failure case}

    **Test design principles**:
    - Test behavior, not implementation — tests should survive refactoring
    - Use real code, not mocks, unless external dependencies force it
    - Each test tests ONE thing — "and" in the name means split it
    - Test names describe the behavior: "rejects empty email", not "test1"
    - Assertion messages should make failures self-diagnosing

    **No-go zones**:
    - Do not modify production code (test-only changes)
    - Do not add test infrastructure beyond what's needed
    - {additional boundaries}

    **Files to create/modify**:
    - {test/path/to/test_file} — {what to test}

    See ~/.conducty/context/{project}.md for architecture overview.

    **Before you begin**: Read the code you're testing. Understand what it does
    and what its edge cases are. If the code is untestable (too coupled, hidden
    dependencies), report DONE_WITH_CONCERNS with what makes it hard to test.

    **Before reporting — self-review**:
    - Does each test verify behavior, not mock behavior?
    - Would a test failure clearly indicate what broke?
    - Are edge cases and error paths covered?
    - Did I avoid testing implementation details?
    - Did I respect the no-go zones?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - What was tested and coverage achieved
    - Any testability issues discovered
    - Files changed
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {source files being tested + existing test files}
  - **No-go zones**: No production code changes
  - **Verification**: `{test command}` → all new tests pass, no regressions
  - **Expected outcome**: New tests pass, existing tests unaffected
  - **Complexity**: Low / Medium / High
  - **Review level**: verify-only / spec-review
  - **Time budget**: {minutes}
```

## Guidelines

- Test prompts rarely need full-review — verify-only or spec-review is sufficient
- Testability issues (DONE_WITH_CONCERNS) are valuable design feedback
- The test cases list prevents the agent from writing only happy-path tests
- No-go on production code changes keeps test prompts focused and safe
