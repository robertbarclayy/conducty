# Conducty Kernel Risk Model

Risk controls rigor. The kernel raises or lowers ceremony based on measurable signals.

Start at 10. Add points:

| Signal | Points |
|---|---:|
| Auth, permissions, security, secrets, privacy, payments, billing, migrations, production, deploy, rollback | +25 |
| 8+ changed files | +15 |
| 3-7 changed files | +8 |
| Parallel prompts beyond the tracer | +6 each, max +20 |
| Missing verification command | +12 |
| Missing acceptance criteria | +8 |
| Missing scoped context | +8 |
| Missing no-go zones | +6 |
| Stale context | +12 |
| Unknown context freshness | +5 |
| Active failure signals | +15 |
| Retry history | +8 each, max +24 |
| Changed files without evidence object | +10 |

Clamp the final score to 0-100.

## Bands

| Score | Band | Review level | Required behavior |
|---:|---|---|---|
| 0-34 | low | verify-only | focused verification is enough |
| 35-64 | medium | spec-review | confirm behavior against plan intent |
| 65-79 | high | full-review | correctness, tests, security, maintainability, residual risk |
| 80-100 | critical | full-review plus recovery | explicit rollback/recovery notes before ship |

## Calibration Notes

- Raise risk when tests are weak or unknown.
- Raise risk when context is old and the repo has moved.
- Raise risk for shared libraries, public APIs, data migrations, auth, payments, deployment, and secrets.
- Lower risk only when the change is local, reversible, covered by focused verification, and has no user-facing blast radius.

Risk scoring is a routing tool, not a claim of objective truth. If the score feels wrong, record why and adjust the next plan's priors.
