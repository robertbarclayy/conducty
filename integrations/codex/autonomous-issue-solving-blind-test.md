# Autonomous Issue-Solving Blind Test

Generated: 2026-05-06T18:10:00.000Z

This report checks a different claim from historical replay. Replay proves that focused context can reproduce known patches byte-for-byte. This blind test asks whether an agent can infer a fix from a bug report without seeing the historical patch.

This is a one-task smoke test, not a solve-rate benchmark, SWE-bench score, product-wide guarantee, or billing trace.

## Task

- Source: local SWE-bench Pro checkout (`ScaleAI/SWE-bench_Pro` data via `SWE-bench_Pro-os/helper_code/sweap_eval_full_v2.jsonl`)
- Instance: `instance_flipt-io__flipt-db1c3b100e231c62f0c90c2ab037614f20a2a63b`
- Repository: `flipt-io/flipt`
- Base commit: `6c91b1ad50c452d90c484888690eb6257ee2c20a`
- Bug report: missing support for `contains` and `notcontains` operators in constraint evaluation

Allowed before the fix attempt:

- Bug report text
- Repository name and base commit
- Selected public test name: `Test_matchesString`
- Source code in the base checkout

Not inspected before the fix attempt:

- Historical gold patch
- Hidden test patch

## Blind Fix Attempt

The blind fix added:

- `contains` and `notcontains` operator constants
- validation of those operators for string constraints
- validation of those operators for entity ID constraints
- string/entity-ID evaluation through substring matching
- focused local cases for `Test_matchesString`

Touched files in the blind workspace:

- `core/validation/flipt.json`
- `internal/server/evaluation/legacy_evaluator.go`
- `internal/server/evaluation/legacy_evaluator_test.go`
- `rpc/flipt/operators.go`

## Verification

Environment setup:

- Installed Go with `winget install --id GoLang.Go -e --silent --accept-package-agreements --accept-source-agreements`
- Verified `go version go1.26.2 windows/amd64`

Blind workspace check:

```bash
go test ./internal/server/evaluation -run Test_matchesString -count=1
```

Result:

```text
ok go.flipt.io/flipt/internal/server/evaluation 0.995s
```

Hidden-test check:

1. Created a clean checkout at the base commit.
2. Applied only the code portion of the blind solution.
3. Extracted the hidden `test_patch` after the blind fix was complete.
4. Applied the hidden test patch with whitespace tolerance because the raw patch context did not apply cleanly on the Windows checkout.
5. Ran the selected test.

```bash
git apply --ignore-space-change --ignore-whitespace hidden-test.patch
go test ./internal/server/evaluation -run Test_matchesString -count=1
```

Result:

```text
ok go.flipt.io/flipt/internal/server/evaluation 0.233s
```

## Post-Unblind Comparison

After the blind fix and hidden-test verification, the historical gold patch was inspected.

Gold patch files:

- `internal/server/evaluation/legacy_evaluator.go`
- `rpc/flipt/operators.go`
- `ui/src/types/Constraint.ts`

The blind solution overlapped the core backend fix in `legacy_evaluator.go` and `operators.go`, and it passed the hidden backend test. It did not infer the UI label update in `ui/src/types/Constraint.ts`. It also added JSON schema validation in `core/validation/flipt.json`, which is reasonable from the bug report but not present in the gold patch.

## Verdict

This run proves a limited autonomous-solving claim:

- A blind agent run solved this backend behavior from the bug report without seeing the historical patch.
- The code-only solution passed the hidden SWE-bench Pro test for the selected instance.
- The result does not prove a general autonomous issue-solving rate.
- The result does not prove full product completeness, because the gold patch included a UI operator-label update that the blind run missed.

The next stronger gate is a stratified blind benchmark over multiple tasks with fixed time budgets, no gold-patch access until after each attempt, and per-task reporting of pass, fail, partial, timeout, touched files, hidden-test result, and gold-patch overlap.
