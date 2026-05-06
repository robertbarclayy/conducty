---
description: Conducty quality principles — ten engineering-grounded principles that govern all Conducty workflows
aliases:
  - conducty-quality
tags:
  - conducty/rule
  - conducty/principles
alwaysApply: true
---

# Conducty Quality Principles

**Appetite before plan.** Define the time budget before planning. The plan fits the appetite. A prompt that exceeds its time budget triggers a circuit breaker — stop and re-evaluate, don't spiral.

**Tracer before volley.** Run one prompt end-to-end before parallel execution. If the tracer fails, fix the plan — not just the prompt. Plan assumptions are hypotheses until a tracer validates them.

**Prompt quality is leverage.** Everything downstream compensates for bad prompts. Invest upstream: clear acceptance criteria, scoped context, concrete verification. Check for prompt smells before finalizing any plan.

**Plan gate before execution.** Use [[conducty-plan-audit]] before tracer execution. A red gate stops the plan; a yellow gate gets revised or explicitly accepted; a green gate spends agent time.

**Evidence before claims.** No completion claims without fresh verification output. Use [[conducty-verify]]. Rigor scales with risk: verify-only for low, spec review for medium, full two-stage for high.

**Root cause before fixes.** When a prompt fails, ask WHERE the leverage point is: prompt quality, plan quality, or code quality. Fix at the highest level. Use [[conducty-debug]]. Three failures on the same prompt = circuit breaker — escalate.

**Design before implementation.** For non-trivial goals, use [[conducty-shape]] to define appetite, boundaries, and no-go zones before writing prompts. Skipping design wastes parallel execution slots.

**Characterize before changing.** Before modifying existing code, verify current behavior first. Every refactor starts with characterization, not transformation.

**Learn or repeat.** End every plan with [[conducty-improve]]: target vs. actual, failure patterns, experiments for the next plan. History that doesn't change behavior is just a log.

**Red flags — STOP if you catch yourself thinking:** "should work", "probably fine", "just this once", "too simple to verify", "I'll check later", "the agent said it passed". Run the verification.
