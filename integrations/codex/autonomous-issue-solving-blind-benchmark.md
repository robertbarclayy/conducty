# Autonomous Issue-Solving Blind Benchmark

Generated: 2026-05-06

This report extends the one-task blind issue-solving smoke test into a small, strict benchmark. It checks whether a Conducty-shaped workflow can solve unseen issues from bug reports without reading the historical patch first.

This is not an official SWE-bench score, not a model solve-rate claim, and not a product-wide guarantee. It is a replayable evidence note for how the workflow behaves under sealed-patch conditions.

## Protocol

Allowed before each fix attempt:

- SWE-bench Pro instance id, repository, base commit, problem statement, and selected public test name
- Source code in the base checkout
- Local project map and focused public tests

Not allowed before each fix attempt:

- Historical gold patch
- Hidden test patch
- Any post-merge target commit contents

After each attempt was locked:

1. Save the code-only patch.
2. Extract the hidden `test_patch`.
3. Apply code-only patch plus hidden test to a clean base checkout, or use whitespace-tolerant `git apply` when Windows checkout context differs.
4. Run the selected focused test.
5. Inspect the historical gold patch.
6. Score the result as full pass, partial, fail, or timeout.

## Results

| Task | Base repo | Selected test | Hidden test | Gold comparison | Verdict |
|------|-----------|---------------|-------------|-----------------|---------|
| `instance_flipt-io__flipt-db1c3b100e231c62f0c90c2ab037614f20a2a63b` | `flipt-io/flipt` | `Test_matchesString` | Passed | Backend evaluator/operator fix matched the core behavior, but the gold patch also updated the UI operator label. | Partial |
| `instance_flipt-io__flipt-c12967bc73fdf02054cf3ef8498c05e25f0a18c0` | `flipt-io/flipt` | `TestErrorUnaryInterceptor` | Passed | The focused context/deadline behavior passed, but the gold patch also changed gRPC server construction in `internal/cmd/grpc.go`. | Partial |
| `instance_flipt-io__flipt-7161f7b876773a911afdd804b281e52681cb7321` | `flipt-io/flipt` | `TestLoad` | Passed | `Load("")` behavior passed hidden config tests, but the gold patch also wired the CLI path so no-config startup calls `config.Load("")`. | Partial |
| `instance_flipt-io__flipt-507170da0f7f4da330f6732bffdf11c4df7fc192` | `flipt-io/flipt` | `TestEngine_IsAuthMethod` | Not reached | Focused Rego package compile ran past the benchmark time budget before a fix attempt was made. No hidden or gold material was opened. | Timeout |

Summary:

- Hidden focused tests passed: 3 / 3 locked fix attempts
- Gold-equivalent complete fixes: 0 / 3 locked fix attempts
- Useful partial fixes: 3 / 3 locked fix attempts
- Timeouts before attempt: 1

## What This Proves

The workflow can localize and implement narrowly testable fixes from bug reports without reading historical patches first. In all three locked attempts, the code-only solution passed the hidden focused test after the attempt was sealed.

The more important result is the gap pattern: hidden focused tests were not enough to prove product completeness. Each partial missed a broader product surface:

- backend behavior also needed a UI type/label surface
- interceptor behavior also touched server construction
- config loader behavior also needed CLI startup wiring

That is useful because it turns a vague autonomy claim into a concrete Conducty improvement target.

## Workflow Lesson

Conducty should add a product-surface sweep gate after the first focused fix and before attempt lock:

1. Extract changed concepts from the bug report and tentative fix.
2. Search adjacent surfaces by concept name: CLI entrypoints, UI types, generated schema, docs, config examples, gateway adapters, and tests.
3. Add or consciously reject each candidate surface with a short reason.
4. Lock the patch only after this sweep.

This gate is small, but it directly addresses the benchmark failure mode. It should improve real-world completeness without turning every issue into whole-repo wandering.

## What This Does Not Prove

- It does not prove a general SWE-bench solve rate.
- It does not prove that Conducty can solve arbitrary new issues without human review.
- It does not prove that hidden tests fully represent product correctness.
- It does not prove token savings for autonomous issue solving; token savings should still be measured separately.

## Next Benchmark

The next serious benchmark should run 10-20 tasks with a fixed per-task budget and predeclared inclusion rules:

- stratify across config, API, storage, UI-adjacent, and runtime behavior
- exclude tasks whose focused package cannot compile within the budget
- score full pass only when hidden tests pass and gold comparison shows no missing product surface
- record timeout and partial results without deleting them from the denominator

