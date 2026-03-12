---
name: conducty-tdd
description: Use when implementing any feature or bugfix, when writing tests, or when the plan specifies TDD — applies test-driven discipline at both the orchestrator level (verification-first planning) and the implementer level (red-green-refactor)
---

# Conducty TDD — Test-Driven Development for Orchestrated Agents

TDD in Conducty operates at two levels: the **orchestrator** writes the "test" (verification command + acceptance criteria) before writing the prompt, and the **implementer** follows red-green-refactor within each prompt. Both levels follow the same discipline: define what success looks like before doing the work.

## The Two Levels

### Level 1: Orchestrator TDD (Plan Time)

The orchestrator (you, during `conducty-plan`) writes the verification step FIRST for every prompt. This is the test. If you can't write a concrete verification command, the acceptance criteria aren't clear enough — fix them before generating the prompt.

```
Define verification → Write prompt → Execute → Verify → Learn
```

This maps directly to red-green-refactor:
- **Red**: The verification command would fail right now (feature doesn't exist yet)
- **Green**: After execution, the verification command passes
- **Refactor**: In `conducty-improve`, refine the prompt template based on what worked

If you can't write the verification step, you don't understand what you're building. Go back to `conducty-shape`.

### Level 2: Implementer TDD (Execution Time)

The implementer subagent follows classical red-green-refactor within each prompt:

1. **RED** — Write one minimal test that describes the desired behavior. Run it. Watch it fail.
2. **Verify RED** — Confirm it fails because the feature is missing, not because of a typo or import error.
3. **GREEN** — Write the simplest code that makes the test pass. Nothing more.
4. **Verify GREEN** — Run the test. Confirm it passes. Run all tests. Confirm no regressions.
5. **REFACTOR** — Clean up: remove duplication, improve names, extract helpers. Keep tests green.
6. **Repeat** — Next behavior, next test.

### How They Connect

The orchestrator's verification step is the **acceptance test**. The implementer's TDD cycle produces **unit tests**. When the implementer finishes, the orchestrator runs the verification command to confirm the acceptance test passes. Both levels must be green.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

This applies to implementers. If code was written before its test, delete the code and start over. Not "adapt it," not "keep it as reference" — delete it and write the test first.

At the orchestrator level: no prompt without a verification step. If the verification field is empty, the prompt is not ready.

## Good Tests

**Test behavior, not implementation.** A test that breaks when you refactor (without changing behavior) is testing the wrong thing. Tests should survive restructuring.

**One test, one behavior.** If the test name contains "and," split it. Each test should have exactly one reason to fail.

**Real code over mocks.** Use mocks only when external dependencies force it (network, database, third-party APIs). Mocking your own code means the code is too coupled — fix the coupling.

**Names describe the behavior.** `rejects empty email` tells you what broke. `test_email_3` tells you nothing.

**Failure messages diagnose the problem.** A good assertion message tells you what happened and what was expected without reading the test code.

## Prompt Smells

Signs that a prompt will fail before you run it. Check for these during `conducty-plan` Step 5e.

| Smell | What It Looks Like | Why It Fails | Fix |
|-------|-------------------|-------------|-----|
| **Vague acceptance** | "Make it work" / "Improve performance" | Agent has no concrete target, builds whatever seems right | Add specific criteria: "response time < 200ms for 1000 records" |
| **Missing context** | Prompt references modules not listed in Context field | Agent can't find the code it needs, guesses at structure | Add the file paths to Context |
| **Mixed concerns** | One prompt creates a new API endpoint AND redesigns the auth system | Agent loses focus, does both poorly | Split into two prompts |
| **No verification** | Verification field is empty or says "check manually" | No objective pass/fail — the agent declares victory, you hope | Write a concrete command: `npm test -- --grep auth` |
| **Unbounded scope** | "And anything else that needs updating" / no no-go zones | Agent restructures half the codebase "while it's there" | Add explicit no-go zones |
| **Exceeds appetite** | Time budget says 30 min but it's a 3-file integration task | Agent runs out of budget or produces rushed work | Simplify scope or increase budget |
| **Missing characterization** | Modifies existing code without verifying current tests pass first | Agent breaks existing behavior without noticing | Add characterization step |
| **Implicit knowledge** | Assumes agent knows project conventions not stated anywhere | Agent uses its own conventions, inconsistent with codebase | State conventions explicitly or reference context file |
| **Dependency on luck** | Correct implementation requires choosing the right library/approach | Agent picks wrong approach, wastes the entire prompt | Specify the approach in the prompt |

## When to Skip TDD

TDD applies to almost all implementation work. Genuine exceptions:

- **Throwaway prototypes** the user explicitly marks as disposable
- **Generated code** from tools (schema generators, scaffolding) where tests are pre-provided
- **Configuration changes** that don't have testable behavior (though verification still applies)

"This is too simple for TDD" is not an exception. Simple code breaks. The test takes 30 seconds. Write it.

## Integration with Conducty

- **`conducty-plan`** references this skill when writing prompt templates — every feature and bugfix template includes TDD steps
- **`conducty-execute`** ensures implementer subagents follow TDD within their prompts
- **`conducty-verify`** is the orchestrator-level "test run" — it validates the acceptance criteria
- **`conducty-improve`** learns from test failures to improve future prompt templates
- **Prompt smells** are checked during `conducty-plan` Step 5e before the plan is finalized
