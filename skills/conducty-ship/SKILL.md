---
name: conducty-ship
description: Pre-merge / pre-deploy gate. Runs the full ship-readiness battery — lint, typecheck, test suite, secrets scan, dependency-vulnerability check, [[conducty-code-review]] verdict — and writes a `Ship Reports/Ship Report YYYY-MM-DD HHmm.md` note with a single-word verdict. Use when the user says "ship it", "is this ready", "ship gate", "pre-merge check", "ready to merge", or after [[conducty-code-review]] passes.
aliases:
  - conducty-ship
  - ship
tags:
  - conducty/skill
  - conducty/ship
  - conducty/quality
---

# Conducty Ship — The Pre-Merge Gate

[[conducty-checkpoint]] gates a parallelization group inside a plan. [[conducty-code-review]] gives a holistic human-style read of the branch. **conducty-ship** is the last gate before merge: it runs the actual mechanical checks every project must pass and produces a single ship-or-don't verdict.

> [!important] Read [[conducty-obsidian]] first
> Output goes to the vault as `Ship Reports/Ship Report YYYY-MM-DD HHmm.md`, linked from the plan note and the code-review note.

## When to Use

- After [[conducty-code-review]] verdict is `pass` or `needs-fix` (with fixes applied)
- Before merging to main, opening a release PR, or deploying
- The user says "ship it", "ready to merge", "ship gate", "pre-merge check"

Skip when:
- The plan hasn't been reviewed yet — run [[conducty-code-review]] first
- The branch is not yet a candidate for merge (still mid-plan)

## The Battery

Six gates. **Every gate must pass for ship verdict to be `green`.** A single failure in any gate produces verdict `red`. Yellow exists only for `Code review: needs-fix with all fixes applied but not re-reviewed` — flag it but treat operationally as red.

| # | Gate | What runs | Pass criterion |
|---|------|-----------|----------------|
| 1 | **Code review** | Read `Code Reviews/Code Review YYYY-MM-DD HHmm.md` from the vault | Verdict `pass`, or `needs-fix` with all Important/Critical findings checked off |
| 2 | **Lint / format** | Project's lint command (`npm run lint`, `cargo clippy`, `ruff`, etc.) | Exit 0, no warnings the project treats as errors |
| 3 | **Type check** | Project's typechecker (`tsc --noEmit`, `mypy`, `cargo check`) | Exit 0, no errors |
| 4 | **Test suite** | Full test suite (`npm test`, `cargo test`, `pytest`, etc.) | Exit 0, no failures, no skipped tests added in this branch |
| 5 | **Secrets scan** | `git diff $(git merge-base HEAD main)..HEAD` piped through a secret-pattern grep | No matches against secret patterns (API keys, tokens, credentials) |
| 6 | **Dependency vulnerabilities** | `npm audit`, `pip-audit`, `cargo audit`, `osv-scanner`, etc. — whichever fits the project | No new High/Critical vulns introduced by this branch's dependency changes |

## Workflow

### Step 1: Read the Plan + Code Review

From the active plan note, find the wikilinked `Code Review YYYY-MM-DD HHmm` note. Open it. If verdict is `block`, **stop** — the branch is not ship-eligible. If verdict is `needs-fix`, confirm every Critical/Important finding has been addressed (checkbox checked) before proceeding.

### Step 2: Resolve Project Commands

Pull the project's commands from `[[Context {Project} Tests]]` and `[[Context {Project} Conventions]]` (see [[conducty-context]]). Required entries:

- Lint command
- Typecheck command (or "n/a" with justification — e.g. dynamically typed and the project doesn't run a checker)
- Test command
- Vulnerability check command

If any are missing, ask the user, run them, and ask the user to commit the answer to the project's context note before proceeding (so the next ship doesn't re-ask).

### Step 3: Run the Battery

Run gates 2-6 in parallel where possible (Bash with `&&` and `&`, or sequential with concise output). Capture for each:

- Command run
- Exit code
- Pass/fail
- For failures: the exact failing line(s) — copy verbatim, don't paraphrase

For the secrets scan, use a conservative pattern set:

```bash
git diff $(git merge-base HEAD main)..HEAD | \
  grep -inE '(api[_-]?key|secret|password|token|bearer|sk_live|sk_test|aws_access|private[_-]?key|-----BEGIN)' || \
  echo "secrets: clean"
```

Tune patterns to the project. False positives are acceptable — a human will check; false negatives are not.

### Step 4: Compute Verdict

| Verdict | Condition |
|---------|-----------|
| **green** | All 6 gates pass. Ship. |
| **red** | Any gate failed. Do not ship. |
| **yellow** | All mechanical gates pass, but code-review is `needs-fix` with fixes applied but not re-reviewed. Re-run [[conducty-code-review]] before merging. |

### Step 5: Write the Ship Report

```markdown
---
type: ship-report
date: YYYY-MM-DD
time: HHmm
project: {project-name}
branch: {branch-name}
base: {base-ref}
verdict: green | yellow | red
tags: [conducty, conducty/ship]
---

# Ship Report YYYY-MM-DD HHmm — {Branch}

## Verdict

**{green | yellow | red}** — {one-sentence rationale}

## Battery

| Gate | Result | Detail |
|------|--------|--------|
| Code review | {pass / needs-fix-applied / block} | [[Code Review YYYY-MM-DD HHmm]] |
| Lint | {pass / fail} | `{command}` exit {code} |
| Typecheck | {pass / fail / n/a} | `{command}` exit {code} |
| Test suite | {pass / fail} | `{command}` — {N} passed, {M} failed |
| Secrets scan | {pass / fail} | {pattern matches or "clean"} |
| Dep vulnerabilities | {pass / fail} | {new High/Critical CVEs or "clean"} |

## Failure Detail

<!-- For each red gate, paste the exact failing output (truncate sensibly).
     Empty if verdict is green. -->

## Action

- **green**: ready to merge. Suggested next: open or merge the PR. Do not auto-merge — the user owns the ship action.
- **yellow**: re-run [[conducty-code-review]] on the post-fix branch.
- **red**: fix the failing gate(s). For test failures, generate a fix prompt via [[conducty-debug]] and slot it into the next plan or a remediation plan.

## Related

- Plan: [[Plan YYYY-MM-DD HHmm Topic]]
- Code review: [[Code Review YYYY-MM-DD HHmm]]
- Project context: [[Context {Project}]], [[Context {Project} Tests]]
- Patterns surfaced: [[Failure Patterns]]
```

### Step 6: Wire Wikilinks

- Edit the plan note's `## Review Notes` section to add `[[Ship Report YYYY-MM-DD HHmm]]`.
- Edit the code-review note's `## Related` section to add the same.
- If verdict is **red**, prepend an entry to `[[Failure Patterns]]` describing which gate failed and the leverage point ([[conducty-debug]]). Mechanical-gate failures are usually code-level; secrets-scan / vuln failures are usually plan-level (the prompt should have prevented them).

### Step 7: Hand Off

- **green**: report verdict to user. Do **not** push, merge, or deploy autonomously — those are user-confirmed actions per Claude Code's blast-radius rules. Suggest the next command.
- **yellow / red**: present the failures and proposed next plan or fix prompts.

## Principles

- **Mechanical, not subjective** — ship runs commands and reads exit codes. Subjective review is [[conducty-code-review]]'s job.
- **All-or-nothing verdict** — green/red, not 4-out-of-6. Yellow exists only for the post-review-fix re-run case.
- **Failure detail is verbatim** — copy the failing command output, never paraphrase. The user (or the next fix prompt) needs to see exactly what broke.
- **Ship never auto-merges** — verdict is advisory. The user runs `git merge` / `gh pr merge`.
- **Every red gate is a learning** — failures append to `[[Failure Patterns]]` so the next plan's prompt-quality gate can prevent the smell that caused them.
- **Battery is project-specific but consistent** — six gates always run; the *commands* come from the project's context notes.
