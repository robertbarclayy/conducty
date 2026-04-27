---
aliases:
  - security
  - security-template
tags:
  - conducty/template
  - conducty/prompt-template
  - conducty/plan
---

# Security Prompt Template

Use when generating a prompt for security-sensitive work: auth flows, input validation, secrets handling, dependency upgrades for CVEs, hardening, threat-model fixes.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Security: {short description}
  - **Type**: security
  - **Prompt**:
    Address the security concern: {description} in {project}.

    **Appetite**: {time budget for this prompt}

    **Threat model**:
    - Asset at risk: {what valuable thing is at stake}
    - Attacker: {who, what capability}
    - Trust boundary: {where untrusted input enters trusted code}

    **Required defenses**:
    - {defense 1 — e.g., input validation at the API boundary}
    - {defense 2 — e.g., authz check on every endpoint touching this resource}

    **Files to modify**:
    - {path} — {what changes}

    **No-go zones** (do NOT do these):
    - Do not add a new auth scheme without explicit approval
    - Do not weaken existing controls (broaden permissions, lower iteration counts, etc.)
    - Do not log secrets, tokens, or PII even in debug paths
    - {additional boundaries}

    **Test expectations**:
    - Write a failing test for the **attacker** path FIRST (negative test): unauthorized request, malformed input, oversized payload, etc.
    - Confirm the test fails for the right reason (the defense isn't there yet)
    - Implement the defense
    - Confirm the test now passes (request rejected)
    - Add a happy-path test confirming legitimate use still works
    - Run the broader test suite — security fixes are a frequent regression source

    See [[Context {Project Title Case}]] and [[Context {Project Title Case} Invariants]] for project-specific contracts.

    **Before you begin**: If the threat model isn't clear or the required defense isn't well-specified, STOP and ask. Security work done on a fuzzy spec produces theater, not protection. If you exceed the appetite ({time budget}), stop and report.

    **Escalation**: If the fix requires changes to a public API surface, schema, or auth scheme — STOP. Report DONE_WITH_CONCERNS with what needs design-level thought. These are not implementer-level decisions.

    **Before reporting — self-review**:
    - Does the negative test FAIL without the defense and PASS with it?
    - Does the happy-path test still pass?
    - Are there any other entry points to the same asset that need the same defense?
    - Did I avoid logging secrets in error paths?
    - Did I avoid weakening any other control while fixing this one?
    - Did I respect the no-go zones?

    **Report format**:
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - Threat addressed (one sentence)
    - Defense added (what + where)
    - Test results: negative test red→green, happy path still green, broader suite clean
    - Files changed
    - Any other entry points considered (and addressed or explicitly noted as not in scope)
    - Time spent (rough estimate)
  - **Directory**: /path/to/project
  - **Context**: {specific files/dirs relevant} + [[Context {Project} Invariants]]
  - **No-go zones**: No new auth schemes, no weakening existing controls, no logging secrets
  - **Verification**: `{negative-test command}` rejects → expect 401/403/422; `{full suite}` → no regressions
  - **Expected outcome**: Defense in place, negative test green, no behavioral regressions
  - **Complexity**: Medium / High (security work is rarely Low)
  - **Review level**: full-review (security never gets verify-only)
  - **Time budget**: {minutes}
```

## Guidelines

- **Threat model is mandatory** — without asset/attacker/boundary, the prompt is theater
- **Negative test first** — the test must reproduce the attack before the defense is added
- **Other entry points** — security fixes are a wack-a-mole risk; force the agent to scan for siblings
- **full-review always** — security gets the highest review tier; spec-review or verify-only is forbidden
- **No logging secrets** — even in error paths, even in debug builds. Make this an explicit no-go zone.
- **Public API / schema / auth changes** require design-level review — escalate, don't decide

## Related

- [[conducty-plan]], [[conducty-tdd]], [[conducty-code-review]] (security lens)
- [[feature]], [[bugfix]], [[refactor]], [[test]], [[decision]], [[migration]], [[performance]] — sibling templates
