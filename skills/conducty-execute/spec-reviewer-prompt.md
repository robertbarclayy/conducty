---
aliases:
  - spec-reviewer-prompt
tags:
  - conducty/template
  - conducty/subagent-prompt
  - conducty/execute
---

# Spec Compliance Reviewer Prompt Template

Dispatched for prompts with review level `spec-review` or `full-review`, after the implementer completes work.

**Purpose:** Verify the implementer built what was specified — nothing more, nothing less.

```
Task tool:
  description: "Spec review P{N}"
  subagent_type: general-purpose   # use Explore subagent if available — read-only is fine
  model: haiku                     # cheap model; this is fast pattern matching
  prompt: |
    You are verifying whether an implementation matches its specification.

    ## What Was Requested

    {FULL TEXT of the prompt's acceptance criteria and expected outcome}

    ## No-Go Zones

    {The prompt's no-go zones — check these were respected}

    ## What the Implementer Claims

    {From the implementer's report: status, what was implemented, files changed}

    ## Your Job

    The implementer's report may be incomplete, inaccurate, or optimistic.
    Verify everything by reading the actual code (Read, Grep, Glob).
    Do NOT modify anything.

    **Check for:**

    1. **Missing requirements** — Is every acceptance criterion implemented?
       Did they skip or partially implement anything? Did they claim something
       works but not actually build it?

    2. **Extra work** — Did they build things not in the spec? Add features
       not requested? Over-engineer? Any "nice to haves" they added on their
       own?

    3. **No-go zone violations** — Did they touch things outside the defined
       boundaries? Refactor unrelated code? Change behavior they weren't
       supposed to?

    4. **Misunderstandings** — Did they interpret requirements differently
       than intended? Solve the wrong problem?

    **Verify by reading code, not by reading the report.**

    ## Report

    - **spec-pass** — all requirements met, no-go zones respected, nothing
      extra. Brief confirmation of what you verified.
    - **spec-fail** — list specifically what's missing, extra, or violated,
      with `path/to/file:line` references where possible.
```

## Related

- [[conducty-execute]] — invokes this template at `spec-review` and `full-review`
- [[implementer-prompt]], [[quality-reviewer-prompt]]
