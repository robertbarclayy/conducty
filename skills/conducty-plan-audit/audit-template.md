---
aliases:
  - audit-template
tags:
  - conducty/template
  - conducty/plan-audit
---

# Plan Quality Gate Template

Insert or update this section inside a plan note. Preferred location: after `## Prompt Queue` and before `## Checkpoint Notes`.

```markdown
## Plan Quality Gate

<!-- Filled by [[conducty-plan-audit]] before execution. Red stops. Yellow revises. Green executes. -->

- **Verdict**: green | yellow | red
- **Score**: 0/100
- **Audited at**: YYYY-MM-DD HHmm
- **Execution decision**: execute tracer | revise before execution | reshape before execution

### Must Fix Before Execute

- None

### Should Improve

- None

### Carry-Forward Checked

- **Latest improvement used**: [[Improvement YYYY-MM-DD HHmm]] or none
- **Relevant failure patterns**: [[Failure Patterns]] entries considered
- **Metrics signal**: first-attempt pass rate / retry trend considered

### Tracer Assessment

- Group A: P1 tests {riskiest assumption}
- Group B: P3 tests {riskiest assumption}

### Verification Assessment

- Every prompt has a focused verification command with expected signal.

### Review Calibration

- Low complexity -> verify-only
- Medium complexity -> spec-review
- High complexity -> full-review
```

## Compact Output

When reporting to the user, keep it terse:

```markdown
Plan gate: yellow, 78/100.

Must fix before execute:
- P2 lacks concrete verification.
- Group A tracer is easy; P3 is the riskiest prompt.

Minimal patch:
- Move P3 to first position and mark it tracer.
- Add `npm test -- billing` -> expected pass to P2.
```
