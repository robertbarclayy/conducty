---
name: conducty-vault-graph
description: Vault hygiene audit — finds orphaned notes, broken wikilinks, stale context, never-consumed designs, missing index entries, and unused improvement experiments. Writes a `Vault Audit YYYY-MM-DD HHmm.md` report. Use when the user says "vault audit", "vault health", "find orphans", "stale context", "vault graph", "what's broken in the vault", or weekly as a hygiene cycle.
aliases:
  - conducty-vault-graph
  - vault-graph
  - vault-audit
tags:
  - conducty/skill
  - conducty/vault
  - conducty/maintenance
---

# Conducty Vault Graph — Hygiene + Drift Detection

The vault is now load-bearing. Without periodic hygiene, it accumulates orphans (notes nothing links to), dead wikilinks (links to renamed/deleted notes), stale context (project hubs older than the threshold), unused designs (designs no plan ever consumed), and improvement experiments that nobody evaluated.

This skill runs a structured audit and produces a vault-health report.

> [!important] Read [[conducty-obsidian]] first
> Audit relies on the vault's filename and link conventions.

## When to Use

- Weekly hygiene cycle ("vault audit", "vault health")
- Before a major plan that will rely heavily on context graph navigation
- When backlinks in Obsidian start showing "no backlinks" on notes that should have them
- When [[conducty-context]] flags stale hubs and the user wants the full picture

## Audits

### Audit 1: Orphan Notes

Notes nothing links to. For each per-instance note (`Plan`, `Design`, `Improvement`, `Code Review`, `Ship Report`, `Kernel Contract`, `Context Refresh`, module deep notes), check that at least one other note wikilinks it.

```bash
VAULT="${CONDUCTY_VAULT:-$HOME/Obsidian/Conducty}"
for f in "$VAULT"/Plans/Plan*.md "$VAULT"/Designs/Design*.md \
         "$VAULT"/Improvements/Improvement*.md \
         "$VAULT"/"Code Reviews"/"Code Review"*.md \
         "$VAULT"/"Ship Reports"/"Ship Report"*.md \
         "$VAULT"/"Kernel Contracts"/"Kernel Contract"*.md; do
    [ -f "$f" ] || continue
    base="$(basename "$f" .md)"
    if ! grep -rl --exclude="$base.md" "\\[\\[$base\\]\\]" "$VAULT" > /dev/null; then
        echo "ORPHAN: $base"
    fi
done
```

Indexes are expected to link orphans. If a per-instance note isn't in its index, **that** is the bug — fix the index.

### Audit 2: Broken Wikilinks

Wikilinks pointing at notes that don't exist. Extract every `[[Target]]` from every vault note, check the target file exists.

```bash
# Wikilinks resolve by basename anywhere in the vault, so search recursively.
grep -rho '\[\[[^]]*\]\]' "$VAULT" --include='*.md' | \
  sed 's/\[\[//;s/\]\]//' | sort -u | \
  while read -r target; do
    # Strip alias suffix: [[Note|Display]] → Note
    target="${target%%|*}"
    if ! find "$VAULT" -type f -name "$target.md" -print -quit | grep -q .; then
      echo "BROKEN: [[$target]]"
    fi
  done
```

Common causes: a note got renamed without updating callers; a wikilink was hand-typed with a typo; a placeholder template wikilink (e.g. `[[Plan YYYY-MM-DD HHmm Topic]]`) was never replaced.

### Audit 3: Stale Context Hubs

For each `Context {Project}.md` hub, read `last_refreshed` from frontmatter. Compare against today.

| Age | Status |
|-----|--------|
| ≤ 14 days | Fresh |
| 14–30 days | Stale — recommend refresh |
| > 30 days | Aged — recommend refresh before any plan touches this project |

If the hub frontmatter has `stale_after_days: <N>`, use that instead of 14.

### Audit 4: Never-Consumed Designs

A design note that no plan note links to. Either the design was abandoned (delete or archive it) or the plan that should have used it never linked back (fix the plan).

```bash
for d in "$VAULT"/Designs/Design*.md; do
    base="$(basename "$d" .md)"
    if ! grep -rl --include='Plan*.md' "\\[\\[$base\\]\\]" "$VAULT" > /dev/null; then
        echo "ORPHAN DESIGN: $base"
    fi
done
```

### Audit 5: Improvement Experiments Never Evaluated

Each `Improvements/Improvement YYYY-MM-DD HHmm.md` proposes experiments. The next improvement note's `## Prior Experiments Evaluated` should reference them. Find improvement notes whose experiments aren't evaluated by *any* later improvement.

This is the killer signal: experiments exist as ritual but don't change behavior. If audits show this every week, the improvement kata is broken — flag it.

### Audit 6: Index Coverage

Every per-instance note should appear in its corresponding index. Check:

- `Plans Index` lists every `Plans/Plan *.md`
- `Designs Index` lists every `Designs/Design *.md`
- `Improvements Index` lists every `Improvements/Improvement *.md`
- `Ship Reports Index` lists every `Ship Reports/Ship Report *.md`
- `Kernel Contracts Index` lists every `Kernel Contracts/Kernel Contract *.md`
- `Context Index` lists every `Context/*/Context *.md` hub (not slices)

Note appearing in vault but not in index → index drift. Add the wikilink.

### Audit 7: Failure-Pattern Recurrence

Read `Accumulators/Failure Patterns.md`. Group entries by symptom. Patterns appearing 3+ times across different plans are **systemic** — flag them prominently. They warrant a template change ([[conducty-plan]] step 5b) or a process change ([[conducty-improve]]), not another individual fix.

### Audit 8: Plan-Without-Closure

A plan note exists without an associated `Improvement YYYY-MM-DD HHmm.md` written after it. Either the plan never finished (still in flight) or [[conducty-review]] / [[conducty-improve]] were skipped. Surface the gap.

## Workflow

### Step 1: Run All Audits

Run audits 1-8 against the vault. Collect findings.

### Step 2: Severity Triage

| Severity | Audit findings |
|----------|----------------|
| **Critical** | Audit 2 (broken wikilinks), Audit 7 (recurring failure patterns 3+ times) |
| **Important** | Audit 3 (stale hubs > 30d), Audit 5 (uneval'd experiments), Audit 8 (plans without closure) |
| **Minor** | Audit 1 (orphans), Audit 4 (never-consumed designs), Audit 3 (stale hubs 14-30d), Audit 6 (index drift) |

### Step 3: Write the Audit Report

Write `Vault Audit YYYY-MM-DD HHmm.md`:

```markdown
---
type: vault-audit
date: YYYY-MM-DD
time: HHmm
tags: [conducty, conducty/vault-audit]
---

# Vault Audit YYYY-MM-DD HHmm

## Summary

- Total notes: {n}
- Orphans: {n}
- Broken wikilinks: {n}
- Stale hubs: {n} (of which aged: {n})
- Never-consumed designs: {n}
- Uneval'd improvement experiments: {n}
- Index drift: {n}
- Recurring failure patterns: {n}
- Plans without closure: {n}

## Critical

### Broken wikilinks
- `[[X]]` referenced from `Plan 2026-04-27 0930.md`, target missing
- ...

### Recurring failure patterns (3+ occurrences)
- "Vague acceptance criteria" — appears in {N} entries across {M} plans
- ...

## Important

### Stale hubs (> 30 days)
- [[Context My App]] — last refreshed 2026-03-10 (53 days)

### Improvement experiments never evaluated
- [[Improvement 2026-04-15 1830]] — proposed 2 experiments; no later kata references them

### Plans without closure
- [[Plan 2026-04-22 1130 Auth]] — no Improvement note follows

## Minor

### Orphans (no backlinks)
- ...

### Designs never consumed
- ...

### Index drift
- `Plans Index` is missing: [[Plan 2026-04-25 1430 Bug Triage]]
- ...

## Recommended Fixes

1. Repair {N} broken wikilinks (Critical)
2. Refresh {N} stale hubs (run `conducty-context` on each)
3. Evaluate {N} prior experiments in next [[conducty-improve]]
4. Update {N} index entries
5. Investigate recurring failure patterns; promote to template change

## Related

- Index: (no index — audits are run on demand)
- Vault contract: [[conducty-obsidian]]
```

### Step 4: Offer Auto-Fixes

For findings the audit can fix mechanically, ask the user before applying:

- **Index drift**: prepend missing wikilinks to the right index
- **Orphan plans**: ensure the plan is in `Plans Index`
- **Broken wikilinks** caused by a known rename: offer to find-and-replace via Edit + Bash `grep -rl`

Never auto-delete. Surface, don't prune.

### Step 5: Hand Off

If Critical findings exist, recommend running [[conducty-plan]] with a small remediation plan. If only Minor, log the audit and move on.

## Cadence

Recommended: weekly. Set a calendar reminder or bake it into the user's Friday wrap-up.

## Principles

- **Hygiene over deletion** — surface problems, don't auto-remove anything
- **Severity drives action** — Critical findings block reliance on the graph; Minor findings are informational
- **Mechanical first** — audits run on filenames and grep, not LLM judgment, so they're cheap and deterministic
- **Audit is also a reflection** — recurring failure patterns and uneval'd experiments diagnose process drift, not just file drift
