---
description: Conducty workflow awareness — the Shape-Plan-Trace-Execute-Verify-Improve cycle, vault plan integration, and skill routing
aliases:
  - conducty-workflow
tags:
  - conducty/rule
  - conducty/workflow
alwaysApply: true
---

# Conducty Workflow

Conducty follows a per-plan cycle: **Shape → Plan → Trace → Execute → Verify → Improve**. Each phase has a dedicated skill. You are always somewhere in this cycle. Multiple plans per day are normal — each plan note is timestamped (`Plan YYYY-MM-DD HHmm [Topic].md`).

All Conducty state — plans, designs, context, improvements, failure patterns, metrics, prompt logs — lives in an **Obsidian vault** at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`). Read [[conducty-obsidian]] before any state I/O.

Before starting work, list the vault for the latest `Plans/Plan *.md` note (sort by `date` then `time` frontmatter). If one is active, reference it to understand the current prompt, its scoped context, time budget, and verification step.

**Shape:** For non-trivial goals, use [[conducty-shape]] to define appetite, scope, no-go zones, and design before planning. For architectural decisions, use [[conducty-dialectic]].

**Plan:** Use [[conducty-plan]] to decompose goals into time-budgeted prompts with parallel groups, tracer markers, and calibrated review levels.

**Trace + Execute:** Use [[conducty-execute]] to run prompts. The first prompt in each group is a tracer — if it fails, re-evaluate the plan before running the rest. Review rigor scales with risk: verify-only for low, spec review for medium, full two-stage for high.

**Verify:** Use [[conducty-checkpoint]] between groups. It measures health metrics (first-attempt pass rate, retries, blocked count) and updates hill chart positions — not just pass/fail.

**Improve:** At the end of every plan, use [[conducty-review]] then [[conducty-improve]] to extract failure patterns, update `[[Metrics]]`, and shape the next plan's approach. History feeds forward — learn or repeat.

When finishing a task: (1) run the prompt's verification command via [[conducty-verify]], (2) mark the prompt complete in the plan note, (3) run [[conducty-checkpoint]] when the group is finished. Log outcomes to `[[Prompt Log]]` in the vault.
