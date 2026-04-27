---
aliases:
  - migration
  - migration-template
tags:
  - conducty/template
  - conducty/prompt-template
  - conducty/plan
---

# Migration Prompt Template

Use when generating a prompt for schema migrations, data migrations, framework upgrades, or any change with **forward and backward compatibility concerns**.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Migration: {short description}
  - **Type**: migration
  - **Prompt**:
    Migrate {what} in {project}.

    **Appetite**: {time budget for this prompt}

    **Before** (current state): {schema / version / shape}

    **After** (target state): {schema / version / shape}

    **Reversibility**:
    - Can the migration be rolled back? {yes / no / one-way after step N}
    - If irreversible: what's the safety check before proceeding?

    **Compatibility window**:
    - Old code reading new data: {must work / must error gracefully / not applicable}
    - New code reading old data: {must work / migration runs first / not applicable}
    - If a window exists: how long? Is there a feature flag?

    **Data volume / blast radius**:
    - Estimated row count / file count / user count affected
    - Locking behavior: {table lock / online migration / not applicable}
    - Concurrent write safety: {how concurrent writes during migration are handled}

    **Migration steps** (in order, each independently committable):
    1. {step 1 — e.g., add new column nullable}
    2. {step 2 — e.g., backfill in batches}
    3. {step 3 — e.g., switch reads to new column}
    4. {step 4 — e.g., switch writes to new column}
    5. {step 5 — e.g., drop old column}

    **No-go zones** (do NOT do these):
    - Do not run the migration on production (this prompt produces the migration script + tests)
    - Do not skip the backfill step
    - Do not collapse multi-step expand-contract into a single destructive step
    - Do not change unrelated schema while you're here
    - {additional boundaries}

    **Test expectations** (each step):
    - Unit test: each step's idempotency (running twice produces the same result)
    - Integration test: old code path against new schema (compatibility window)
    - Integration test: new code path against old schema (compatibility window — if relevant)
    - Backfill test: a representative slice of data passes through and produces the expected new shape
    - Rollback test: if reversible, the rollback restores the original state

    See [[Context {Project Title Case} Invariants]] for the schema contract and [[Context {Project Title Case} Tests]] for test commands.

    **Before you begin**: If the compatibility window or reversibility isn't clear from the spec, STOP. Migrations done with hand-wave assumptions about old code corrupt data. Get clarity first. If you exceed the appetite ({time budget}), stop and report.

    **Escalation**: A migration that touches a public API surface, a foreign key, or any cross-service contract is design-level work. Report DONE_WITH_CONCERNS or BLOCKED if you uncover hidden coupling.

    **Before reporting — self-review**:
    - Are the steps independently committable? (each step compiles + tests pass on its own)
    - Is the migration idempotent at every step?
    - Did I add a backfill test on a non-trivial data slice?
    - Did I document the rollback procedure (or note one-way step explicitly)?
    - Did I avoid unrelated schema changes?
    - Did I respect the no-go zones?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - Migration steps produced (one commit per step ideally)
    - Compatibility window claimed (and tested)
    - Reversibility (per step)
    - Test results per step
    - Backfill plan (batched? estimated time?)
    - Files changed
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {schema files, ORM models, existing migration files} + [[Context {Project} Invariants]]
  - **No-go zones**: No production runs, no destructive collapses, no unrelated schema changes
  - **Verification**: `{migration test command}` → all step tests pass; `{full suite}` → no regressions
  - **Expected outcome**: Step-wise migration script with tests, compatibility window verified, rollback documented
  - **Complexity**: Medium / High (migrations are rarely Low)
  - **Review level**: full-review (migrations always)
  - **Time budget**: {minutes}
```

## Guidelines

- **Expand-contract over destructive change** — every migration follows add-new → backfill → switch → drop-old. Collapsing this is the #1 migration failure mode.
- **Each step independently committable** — if step 3 fails in production, step 1+2 must already be live and safe.
- **Idempotency required** — a re-run on a partial state must converge, never corrupt.
- **Compatibility window is non-negotiable** — old code reads must work during the window, even if the new path is preferred.
- **No production runs from this prompt** — the prompt produces the script + tests. Production execution is a separate, human-confirmed action.
- **full-review always** — migrations get the highest review tier.
- **Public-API or cross-service migrations** require design-level decomposition before this prompt runs ([[conducty-shape]] or [[conducty-dialectic]]).

## Related

- [[conducty-plan]], [[conducty-tdd]], [[conducty-shape]] (for the design pre-step)
- [[feature]], [[bugfix]], [[refactor]], [[test]], [[decision]], [[security]], [[performance]] — sibling templates
