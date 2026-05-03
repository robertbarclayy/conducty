# Kernel Contract Template

Use this when the MCP `create_kernel_contract` tool is unavailable or when writing a contract by hand.

```yaml
type: kernel-contract
goal: ""
appetite: ""
state: observe | shape | plan | trace | execute | verify | diagnose | review | ship | learn
context_freshness: fresh | stale | unknown
plan_hypothesis: ""
acceptance_criteria:
  - ""
no_go_zones:
  - ""
scoped_context:
  - ""
tracer:
  id: ""
  validates: ""
  verification: ""
risk:
  score: 0
  band: low | medium | high | critical
  factors:
    - ""
review_level: verify-only | spec-review | full-review
evidence_required:
  - ""
invariant_violations:
  - ""
next_skill: ""
next_action: ""
learning_delta:
  update_templates:
    - ""
  update_risk_model:
    - ""
  refresh_context:
    - ""
```

## Minimum Contract

For small work, the contract can be compact:

```text
Goal:
Appetite:
State:
Accept:
No-go:
Context:
Verify:
Risk:
Next:
```

## Evidence Object Shape

```yaml
evidence:
  command: ""
  result: pass | fail | not-run
  output_summary: ""
  changed_files:
    - ""
  residual_risks:
    - ""
  reviewer_verdict: ""
  rollback_notes: ""
```

## Contract Exit Criteria

A contract is ready to advance only when:

- the next skill is explicit
- missing inputs are named
- risk score is assigned
- required evidence is listed
- invariant violations are empty or the next action is diagnostic
- the user can tell exactly what happens next
