---
aliases:
  - plan-template
tags:
  - conducty/template
  - conducty/plan
---

# Plan Template

Template for vault notes named `Plans/Plan YYYY-MM-DD HHmm [Topic].md`. Multiple plans per day are normal — each gets its own timestamped file.

## Frontmatter

```yaml
---
type: plan
date: YYYY-MM-DD
time: HHmm
topic: {Topic Title Case}        # optional but encouraged
appetite: 4h
project: {project-name}          # if scoped to a single project
tags: [conducty, conducty/plan]
---
```

## Body

```markdown
# Plan YYYY-MM-DD HHmm — {Topic}

## Appetite

**Time budget**: {e.g., 4 hours}

## Goals

| Goal | Appetite | Hill Position | Design |
|------|----------|---------------|--------|
| Goal 1 | 2h | Downhill | [[Design 2026-04-27 0930 Auth Cleanup]] |
| Goal 2 | 1.5h | Peak | N/A |

## Carried Forward

<!-- Items from prior plans (status: needs-fix, partial, blocked) with lessons learned -->
- None

## Improvement Experiments

<!-- From [[conducty-improve]] — what we're trying differently this plan -->
- See [[Improvement 2026-04-26 1830]]

## Context Loaded

<!-- Project context notes referenced -->
- [[Context My App]]

## Health Metrics (Running)

<!-- Updated by [[conducty-checkpoint]] after each group -->
- **First-attempt pass rate**: — / —
- **Total retries**: 0
- **Blocked**: 0

## Prompt Queue

### Group A (parallel — no dependencies)

<!-- First prompt is the tracer. Run it alone before the rest. -->

- [ ] **P1**: [project-name] Short description ★ TRACER
  - **Type**: feature / bugfix / refactor / test
  - **Prompt**: Full prompt text (includes acceptance criteria, self-review, report format, no-go zones)
  - **Directory**: /path/to/project
  - **Context**: Specific files and directories relevant to this prompt
  - **Design**: [[Design YYYY-MM-DD HHmm Topic]] (if applicable)
  - **No-go zones**: What is explicitly out of scope for this prompt
  - **Verification**: `command to run` → expected result
  - **Expected outcome**: What changes, what the result looks like
  - **Complexity**: Low / Medium / High
  - **Review level**: verify-only / spec-review / full-review
  - **Time budget**: {minutes}
  - **Status**: pending
  - **Retries**: 0

- [ ] **P2**: [project-name] Short description
  - **Type**: feature / bugfix / refactor / test
  - **Prompt**: Full prompt text
  - **Directory**: /path/to/project
  - **Context**: Specific files and directories
  - **Design**: N/A
  - **No-go zones**: What is explicitly out of scope
  - **Verification**: `command to run` → expected result
  - **Expected outcome**: Description
  - **Complexity**: Low / Medium / High
  - **Review level**: verify-only / spec-review / full-review
  - **Time budget**: {minutes}
  - **Status**: pending
  - **Retries**: 0

### Group B (depends on Group A)

<!-- Run [[conducty-checkpoint]] on Group A before starting Group B -->

- [ ] **P3**: [project-name] Short description ★ TRACER
  - **Depends on**: P1
  - (same fields as above)

## Checkpoint Notes

<!-- Filled between groups by [[conducty-checkpoint]] -->
<!-- Includes: health metrics, hill chart updates, systemic failure analysis -->

## Review Notes

<!-- Filled during the end-of-plan review sweep ([[conducty-review]]) -->

## End-of-Plan Summary

<!-- Filled after review sweep completes -->
- **Total prompts**: 0
- **Completed**: 0
- **First-attempt passes**: 0
- **Needs fix**: 0
- **Blocked**: 0
- **Total retries**: 0
- **First-attempt pass rate**: —%
- **Carry forward**: None

## Hill Chart Update

<!-- Updated after review — where did each goal end up? -->
| Goal | Start | End | Notes |
|------|-------|-----|-------|

## Post-Cycle

<!-- Wikilinks added by [[conducty-code-review]] and [[conducty-ship]] when they run on this plan's branch. -->

- **Code review**: (none yet — run [[conducty-code-review]] when the branch is review-ready)
- **Ship report**: (none yet — run [[conducty-ship]] after code review passes)

## Related

- Index: [[Plans Index]]
- Built from: [[Design YYYY-MM-DD HHmm Topic]], [[Context My App]]
- Tests experiments from: [[Improvement YYYY-MM-DD HHmm]]
- Carries forward from: [[Plan YYYY-MM-DD HHmm Prior-Topic]]
- Accumulates into: [[Failure Patterns]], [[Metrics]], [[Prompt Log]]
```
