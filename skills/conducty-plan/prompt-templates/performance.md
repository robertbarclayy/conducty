---
aliases:
  - performance
  - performance-template
tags:
  - conducty/template
  - conducty/prompt-template
  - conducty/plan
---

# Performance Prompt Template

Use when generating a prompt for performance work — latency reduction, throughput increase, memory cuts, query optimization. Performance work is **measurement-driven**: a prompt without before/after numbers is theater.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Performance: {short description}
  - **Type**: performance
  - **Prompt**:
    Improve {metric} in {component} of {project}.

    **Appetite**: {time budget for this prompt}

    **Baseline measurement** (MANDATORY first step):
    Before any change, measure the current state:
    - Command/benchmark: `{exact command, e.g. wrk / ab / cargo bench / pytest-benchmark}`
    - Workload: {what input size, concurrency level, duration}
    - Capture: {p50, p95, p99 latency / throughput / memory / whatever the target is}
    - Save the baseline numbers in your report

    If you can't reproduce the baseline, STOP and report. A target without a baseline is meaningless.

    **Performance target**:
    - {metric}: from {baseline} to {target} (improvement: {%})
    - Constraint: no behavior change, all existing tests still pass

    **Hypothesis**:
    - Suspected bottleneck: {the specific code path / query / allocation pattern}
    - Why this is the bottleneck: {profiling evidence or reasoning}
    - Proposed change: {what to do}

    **Files to modify**:
    - {path} — {what changes}

    **No-go zones** (do NOT do these):
    - Do not change behavior — performance work is structural only
    - Do not micro-optimize without a measured win (per Knuth)
    - Do not change unrelated code paths
    - Do not weaken correctness for speed (no skipped validation, no broken locking, no relaxed isolation levels)
    - {additional boundaries}

    **Approach** (in order):
    1. Run the baseline benchmark, capture numbers
    2. Profile if the bottleneck isn't already evident: `{profiler command}`
    3. Make the proposed change
    4. Re-run the benchmark, capture new numbers
    5. Run the full test suite — confirm no behavior regressions
    6. If the target isn't met, report DONE_WITH_CONCERNS — do not make additional uninvestigated changes piling on

    See [[Context {Project Title Case} Hotspots]] for known hot spots and [[Context {Project Title Case} Tests]] for benchmark commands.

    **Before you begin**: If the baseline command isn't well-defined or the target metric is qualitative ("faster", "snappier"), STOP and ask. Performance work without numbers is fashion. If you exceed the appetite ({time budget}), stop and report.

    **Escalation**: If the bottleneck turns out to be architectural (a fundamentally inefficient design), STOP. Report DONE_WITH_CONCERNS — that's a [[conducty-shape]] question, not an implementation prompt.

    **Before reporting — self-review**:
    - Did I capture a real baseline before changing anything?
    - Did I make ONE change at a time so the win is attributable?
    - Did I re-run the full test suite (not just the benchmark)?
    - Did the metric actually move? By how much?
    - Did I avoid behavioral changes?
    - Did I respect the no-go zones?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - Baseline numbers (verbatim benchmark output, key metrics highlighted)
    - Change made (one specific change)
    - New numbers (verbatim)
    - Delta (% improvement, met target / missed by X)
    - Test suite result (no regressions)
    - Files changed
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {hot path files, benchmark suite} + [[Context {Project} Hotspots]]
  - **No-go zones**: No behavior changes, no correctness compromise, no unrelated optimization
  - **Verification**: `{benchmark command}` → metric moves from {baseline} to within {target}; `{full suite}` → no regressions
  - **Expected outcome**: Measured improvement, no behavior change, no regressions
  - **Complexity**: Medium / High
  - **Review level**: spec-review or full-review (performance never verify-only)
  - **Time budget**: {minutes}
```

## Guidelines

- **Measure first, change second** — the baseline is the contract. No baseline = no prompt.
- **One change at a time** — if you change three things and performance improves, you've learned nothing about which change mattered.
- **Behavior is sacred** — performance work that changes correctness is a regression, not an optimization.
- **Architectural bottlenecks are out of scope for this template** — they go through [[conducty-shape]]. This template is for tactical wins.
- **Numbers in the report** — verbatim benchmark output, not vibes.
- **spec-review minimum** — performance work needs spec compliance verified (the metric was actually met) at a minimum.

## Related

- [[conducty-plan]], [[conducty-tdd]], [[conducty-shape]] (for architectural perf work)
- [[feature]], [[bugfix]], [[refactor]], [[test]], [[decision]], [[security]], [[migration]] — sibling templates
