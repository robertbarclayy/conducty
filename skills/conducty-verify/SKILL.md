---
name: conducty-verify
description: Use when about to claim work is complete, a prompt passed, or any status is being marked as done — the evidence gate that requires running verification and reading output before making claims
---

# Conducty Verify — The Evidence Gate

Run the command. Read the output. Then claim the result. Nothing else qualifies.

## The Gate

Before ANY completion claim, status update, or expression of satisfaction:

```
1. IDENTIFY — What command proves this claim? (from the prompt's Verification field)
2. RUN     — Execute the command fresh and complete
3. READ    — Full output, exit code, failure count
4. JUDGE   — Does the output confirm the claim?
              YES → State the claim WITH the evidence
              NO  → State what actually happened WITH the evidence
5. RECORD  — Log the result for checkpoint and improvement tracking
```

Skip any step and the claim is unsupported. "Should work" is not evidence. "The agent said it passed" is not evidence. Only output from a command you just ran is evidence.

## Calibrated Verification

The plan assigns a review level to each prompt. Verification scales accordingly:

### verify-only (Low complexity)

Run the verification command. Read the output. If it passes, the prompt is done.

```
IDENTIFY: P3 verification is `npm test -- --grep "auth"`
RUN:      npm test -- --grep "auth"
READ:     12/12 tests pass, exit 0
CLAIM:    "P3 verified — 12/12 auth tests pass"
```

### spec-review (Medium complexity)

Run the verification command. If it passes, dispatch the spec compliance reviewer (see `conducty-execute`). Both must pass.

```
IDENTIFY: P5 verification is `cargo test session`
RUN:      cargo test session
READ:     8/8 tests pass, exit 0
THEN:     Dispatch spec reviewer → spec-pass
CLAIM:    "P5 verified — tests pass, spec compliant"
```

### full-review (High complexity)

Run the verification command. If it passes, dispatch spec reviewer. If spec passes, dispatch quality reviewer. All three must pass.

```
IDENTIFY: P7 verification is `make test && make lint`
RUN:      make test && make lint
READ:     all pass, exit 0
THEN:     Spec reviewer → spec-pass → Quality reviewer → pass
CLAIM:    "P7 verified — tests pass, spec compliant, quality approved"
```

## Checkpoint Verification

When verifying an entire group (used by `conducty-checkpoint`):

```
For EACH prompt in the group:
  IDENTIFY → RUN → READ → JUDGE
  Record: pass with evidence / needs-fix with failure output

Report: "Group A: 3/4 passed. P2 needs-fix (2 test failures in auth module)"
```

Never say "Group passed" without individually verifying every prompt.

## Fix Verification

When verifying a fix prompt resolved the original issue:

```
1. Run the ORIGINAL verification command (the one that failed)
2. Run any ADDITIONAL check for the specific failure that triggered the fix
3. Both must pass
CLAIM: "Fix verified — original tests pass AND specific failure resolved"
```

## Evidence Format

For consistency and machine-readability in history/metrics:

```
**P{N} Verification** [{timestamp}]
- Command: `{command}`
- Exit code: {0/1/...}
- Result: {pass/fail}
- Detail: {summary of output — test count, error message, etc.}
- Review: {verify-only/spec-review/full-review} — {outcome}
```

This format feeds into `conducty-checkpoint` health metrics and `conducty-improve` learning.

## When to Apply

- Before marking ANY prompt as completed
- Before passing ANY prompt during checkpoint
- Before claiming ANY fix resolved an issue
- Before moving to the next parallelization group
- Before any expression of satisfaction about work state
