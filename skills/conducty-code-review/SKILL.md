---
name: conducty-code-review
description: Standalone post-implementation code review across a whole branch or PR. Goes beyond the in-cycle spec/quality reviewers (which check single prompts) to assess the diff holistically — security, correctness, perf, idioms, dead code, hidden coupling, test depth. Writes a `Code Review YYYY-MM-DD HHmm.md` note to the vault linked back to the plan. Use when the user says "review my changes", "review this PR", "code review", "is this branch good", or after a plan finishes but before [[conducty-ship]].
aliases:
  - conducty-code-review
  - code-review
tags:
  - conducty/skill
  - conducty/review
  - conducty/quality
---

# Conducty Code Review — Whole-Branch Review

The in-cycle reviewers in [[conducty-execute]] (`spec-review`, `full-review`) verify each prompt against its own acceptance criteria. They do not see the branch as a unit. **conducty-code-review** does: it reads the diff between the branch and its base, looks at the cumulative change as a single artifact, and produces a holistic review note in the vault.

> [!important] Read [[conducty-obsidian]] first
> Output goes to the vault as `Code Review YYYY-MM-DD HHmm.md`, linked from the plan note that produced the changes.

## When to Use

- After a plan finishes and the changes are about to ship
- Before [[conducty-ship]] — code-review is a precondition for ship
- On request: "review my changes", "review this PR", "is this branch ready"
- On a PR URL — fetch the diff via `gh pr diff <id>` and review

Skip when:
- Plan is still mid-execution (use checkpoint instead)
- Single-prompt review is sufficient — that's `spec-review`/`full-review` inside [[conducty-execute]]

## Workflow

### Step 1: Establish the Diff

```bash
# Local branch vs main
git diff $(git merge-base HEAD main)..HEAD

# Or for a PR
gh pr diff <pr-number>
```

Record:
- Base ref + tip ref + commit count
- Files changed (count + list)
- Lines added/removed
- The active plan note(s) that produced these changes (read from `[[Plans Index]]` — pick plans whose execution window matches the commit range)

If the diff is huge (>1000 lines or >40 files), warn the user and ask whether to slice the review (per-module, per-commit, or per-prompt).

### Step 2: Anchor in the Plan(s)

Read the plan note(s) that produced the changes. Note:
- The acceptance criteria for each prompt
- The no-go zones declared
- Any failure patterns logged during execution

The diff should match the plan. Anything in the diff *not* in the plan is scope creep and gets flagged.

### Step 3: Walk the Diff With Five Lenses

Apply each lens to the full diff, not file-by-file. Each lens produces findings.

**Lens 1 — Spec alignment:**
- Did the branch actually implement every acceptance criterion across all plan prompts?
- Anything in the diff that wasn't in any prompt? (scope creep)
- Anything in the no-go zones that got touched anyway?

**Lens 2 — Correctness:**
- Logic errors, off-by-one, null/undefined handling, race conditions
- Are error paths handled or swallowed?
- Boundary cases: empty inputs, very large inputs, concurrent access
- Idempotency where it matters (retries, requeue, replays)

**Lens 3 — Security:**
- Input validation at boundaries (user input, external APIs, deserialization)
- Auth/authz enforcement on every new endpoint or sensitive action
- Secrets in code or logs (`grep -nE 'sk_|api_key|password|secret' diff`)
- SQL/command injection, XSS, SSRF, path traversal
- Dependency additions — new `package.json`/`Cargo.toml`/`requirements.txt` entries flagged for vuln review

**Lens 4 — Architecture & coupling:**
- Did the change respect the project's bounded contexts? (Read `[[Context {Project} Architecture]]` if it exists)
- New cross-module imports that weren't there before
- Circular dependencies introduced
- New singletons / global state
- Any module growing past a clean responsibility

**Lens 5 — Tests & maintainability:**
- Tests added match the criteria? Or just smoke tests?
- Tests verify behavior, not mock behavior
- Failure messages diagnostic
- Dead code / commented-out blocks left behind
- TODO/FIXME comments without an owner or follow-up issue
- Naming clarity; comments justify *why*, not *what*

### Step 4: Severity Triage

Each finding gets one severity:

| Severity | Meaning |
|----------|---------|
| **Critical** | Must fix before merge. Security hole, broken correctness, missing auth, breaks the spec. |
| **Important** | Should fix before merge. Hidden coupling, missing test for a covered branch, sloppy error handling. |
| **Minor** | Acceptable for now; note for follow-up. Naming, micro-refactor, comment quality. |

If 3+ Critical findings: stop the review and recommend revising the plan or splitting the merge.

### Step 5: Write the Review Note

Write `Code Review YYYY-MM-DD HHmm.md` to the vault:

```markdown
---
type: code-review
date: YYYY-MM-DD
time: HHmm
project: {project-name}
branch: {branch-name}
base: {base-ref}
verdict: pass | needs-fix | block
tags: [conducty, conducty/code-review]
---

# Code Review YYYY-MM-DD HHmm — {Branch}

**Diff scope**: {N} commits, {M} files, +{adds}/-{dels} lines
**Plan(s)**: [[Plan YYYY-MM-DD HHmm Topic]]
**Project**: [[Context {Project}]]

## Verdict

**{pass | needs-fix | block}** — {one-sentence rationale}

## Findings

### Critical
- [ ] **{file}:{line}** — {description}. Why critical: {reason}. Fix: {what to do}.

### Important
- [ ] **{file}:{line}** — {description}.

### Minor
- {file}:{line} — {description}.

## Strengths

- {what was done well, briefly}

## Lens Summary

| Lens | Result |
|------|--------|
| Spec alignment | {pass/issues} |
| Correctness | {pass/issues} |
| Security | {pass/issues} |
| Architecture & coupling | {pass/issues} |
| Tests & maintainability | {pass/issues} |

## Related

- Index: (no index — code reviews are per-branch; link from the plan)
- Plan: [[Plan YYYY-MM-DD HHmm Topic]]
- Project context: [[Context {Project}]]
- Patterns surfaced: [[Failure Patterns]]
- Next gate: [[conducty-ship]]
```

### Step 6: Update the Plan + Patterns

- Edit the plan note's `## Review Notes` section to reference the new code-review note via wikilink.
- For any **Critical** or **Important** finding, prepend an entry to `[[Failure Patterns]]` so the next plan can avoid it. Tag it as `code-review` source.
- If `verdict: block`, the plan is **not** ready for [[conducty-ship]]. Generate fix prompts (use [[conducty-debug]] for leverage analysis) and feed them back into the next plan or a remediation plan.

## Verdict Semantics

- **pass** — zero Critical, zero Important. Minor only. Branch is ship-ready (still needs [[conducty-ship]] gate for tests/secrets/vuln).
- **needs-fix** — Important findings present, no Critical. Branch can ship after fixes; small remediation plan recommended.
- **block** — One or more Critical. Do not merge. Fix or revert.

## Subagent Strategy

For large diffs, dispatch a read-only subagent per lens (parallel) so the orchestrator can synthesize:

```
Task tool:
  description: "Code review — {lens}"
  subagent_type: general-purpose   # Explore subagent if available
  model: sonnet
  prompt: |
    Read the diff at {ref-range} for project at {path}.
    Apply only the {lens-name} lens. Report findings with file:line refs.
    Ignore other lenses — another reviewer is handling those.
```

Five subagents, one synthesis pass. Faster than serial. Always synthesize in the orchestrator — never let a subagent write the verdict.

## Principles

- **Whole-branch, not per-prompt** — that's what makes this different from in-cycle review
- **Diff is the artifact** — read code via the diff context, not the full repo, unless a finding requires it
- **Severity drives action** — Critical blocks merge; Important delays it; Minor is informational
- **Findings cite file:line** — vague feedback doesn't fix anything
- **Patterns flow back** — every Important+ finding becomes a `[[Failure Patterns]]` entry to inoculate future plans
- **Code review is a precondition, not a substitute, for [[conducty-ship]]** — ship runs the actual checks (tests, lint, secrets); review is human-style judgment
