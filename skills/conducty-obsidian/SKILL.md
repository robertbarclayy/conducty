---
name: conducty-obsidian
description: Conducty's context engine lives in an Obsidian vault. This skill defines the vault layout, naming, linking, and index conventions every other Conducty skill must follow when reading or writing notes. Use when reading/writing any plan, design, context, improvement, failure pattern, metrics, or prompt-log note — or when the user says "vault", "Obsidian", "context engine", "where is X stored".
aliases:
  - conducty-obsidian
  - conducty-vault
  - vault
tags:
  - conducty/skill
  - conducty/obsidian
  - conducty/context-engine
---

# Conducty Obsidian — The Context Engine

Conducty's plans, designs, context, improvements, failure patterns, metrics, and prompt logs all live in an **Obsidian vault**. The vault is not a backup or export target — it IS the context engine. Every Conducty note is written there, linked to its peers, and re-read on future sessions to inform planning.

> [!important] Read this first
> Before writing or reading any state file (plan, design, context, etc.), check this skill for naming and linking conventions. Other Conducty skills assume you've internalized these rules.

## Vault Location

Resolve the vault root in this order:

1. `$CONDUCTY_VAULT` environment variable, if set
2. `~/Obsidian/Conducty/` fallback

When this skill says **"the vault"** or **`{vault}/...`**, substitute the resolved path. Always use absolute paths when invoking Bash/Read/Write/Edit.

```bash
# Resolve in shell:
VAULT="${CONDUCTY_VAULT:-$HOME/Obsidian/Conducty}"
```

If the vault directory doesn't exist, create it (and the seed index notes — see [Bootstrap](#bootstrap)) before writing anything.

## Why a Vault, Not Folders

Earlier Conducty stored state under `~/.conducty/{plans,designs,history,context}/` as flat folders. That worked but produced a write-only log: each file was an island. The vault model fixes this:

- **Wikilinks** make the relationships first-class. A plan links the designs it consumed, the context files it pulled from, and the improvement experiments it's testing.
- **Backlinks** are free. Open `Context My-App` and Obsidian shows every plan and design that referenced it.
- **Graph view** turns the orchestration history into a navigable knowledge map.
- **Future plans read the past** by following links, not by re-grepping flat files.

The vault is the **memory** of the orchestrator. Treat every note as a node in a graph, not a row in a log.

## Layout

**Nested by category, flat-within-category.** Subfolders organize by note type and scope; basenames stay unique and descriptive so wikilinks (which resolve by basename across all subfolders) are unaffected by directory placement.

**Title Case** filenames. Wikilinks resolve by basename, so the filename is the canonical title — never rely on the directory path to disambiguate a wikilink target.

```
{vault}/
├── Conducty Index.md                            # root hub
│
├── Indexes/
│   ├── Plans Index.md                           # links every plan note
│   ├── Designs Index.md                         # links every design doc
│   ├── Context Index.md                         # links every project context hub
│   └── Improvements Index.md                    # links every improvement entry
│
├── Accumulators/
│   ├── Failure Patterns.md                      # accumulating, append-prepend
│   ├── Metrics.md                               # one row per plan run
│   └── Prompt Log.md                            # one entry per prompt outcome
│
├── Plans/
│   ├── Plan 2026-04-27 0930 Auth Cleanup.md
│   └── Plan 2026-04-27 1430 Bug Triage.md
│
├── Designs/
│   └── Design 2026-04-27 0930 Auth Cleanup.md
│
├── Improvements/
│   └── Improvement 2026-04-27 1830.md
│
├── Code Reviews/
│   └── Code Review 2026-04-27 1900.md
│
├── Ship Reports/
│   └── Ship Report 2026-04-27 1915.md
│
└── Context/
    └── My App/                                  # one folder per project
        ├── Context My App.md                    # hub
        ├── Context My App Architecture.md
        ├── Context My App Conventions.md
        ├── Context My App Invariants.md
        ├── Context My App Hotspots.md
        ├── Context My App Tests.md
        ├── Context My App Glossary.md
        ├── Modules/
        │   └── Context My App Auth.md           # per bounded-context deep note
        └── Refreshes/
            └── Context Refresh My App 2026-04-27 1830.md
```

**Why nested:** flat root broke at scale — a vault with 50+ plans + multi-project context becomes a wall of files. Nesting by category makes Obsidian's file tree navigable. Wikilinks are unaffected because Obsidian resolves them by basename across the whole vault, not by path.

**Why long unique basenames inside `Context/{Project}/`** (e.g. `Context My App Architecture.md`, not just `Architecture.md`): wikilinks like `[[Architecture]]` would collide across projects. Keeping `Context {Project} {Slice}` as the basename makes every wikilink unambiguous forever.

Two note categories:

- **Per-instance notes** (timestamped or per-project) — get an index
- **Accumulating notes** (singular files appended to over time) — no index, they self-index

## Naming Conventions

### Per-instance notes

| Note type | Directory | Filename pattern | Example |
|-----------|-----------|------------------|---------|
| Plan | `Plans/` | `Plan YYYY-MM-DD HHmm [{Topic Title Case}].md` | `Plans/Plan 2026-04-27 0930 Auth Cleanup.md` |
| Design | `Designs/` | `Design YYYY-MM-DD HHmm {Topic Title Case}.md` | `Designs/Design 2026-04-27 0930 Auth Cleanup.md` |
| Improvement | `Improvements/` | `Improvement YYYY-MM-DD HHmm.md` | `Improvements/Improvement 2026-04-27 1830.md` |
| Code review | `Code Reviews/` | `Code Review YYYY-MM-DD HHmm.md` | `Code Reviews/Code Review 2026-04-27 1900.md` |
| Ship report | `Ship Reports/` | `Ship Report YYYY-MM-DD HHmm.md` | `Ship Reports/Ship Report 2026-04-27 1915.md` |
| Index | `Indexes/` | `{Topic} Index.md` | `Indexes/Plans Index.md` |

### Per-project notes (the context sub-graph — see [[conducty-context]])

All per-project notes live under `Context/{Project}/`. Optional bounded-context deep notes go under `Context/{Project}/Modules/`. Refresh delta notes go under `Context/{Project}/Refreshes/`.

| Note | Path | Purpose |
|------|------|---------|
| Hub | `Context/{Project}/Context {Project}.md` | Project identity, links to slices, last-refreshed |
| Architecture | `Context/{Project}/Context {Project} Architecture.md` | Bounded contexts, module map, Mermaid dep graph, seams |
| Conventions | `Context/{Project}/Context {Project} Conventions.md` | Naming, style, lint/format commands |
| Invariants | `Context/{Project}/Context {Project} Invariants.md` | Public APIs, schemas, contracts |
| Hotspots | `Context/{Project}/Context {Project} Hotspots.md` | Frequently changed files, recent activity |
| Tests | `Context/{Project}/Context {Project} Tests.md` | Test/typecheck/lint/vuln commands; characterization data. Read by [[conducty-ship]]. |
| Glossary | `Context/{Project}/Context {Project} Glossary.md` | Domain terms, ubiquitous language |
| Module deep note | `Context/{Project}/Modules/Context {Project} {Module}.md` | Optional, for non-trivial bounded contexts |
| Refresh delta | `Context/{Project}/Refreshes/Context Refresh {Project} YYYY-MM-DD HHmm.md` | Diff vs prior refresh — temporal record |

**Multiple plans per day are expected** — that's why plans (and the artifacts derived from them) carry an `HHmm` timestamp. The topic suffix on plans is optional but encouraged when more than one plan runs in a day, so the filename alone tells you which plan is which.

### Accumulating notes

All accumulating notes live under `Accumulators/`.

| Note type | Path | Behavior |
|-----------|------|----------|
| Failure Patterns | `Accumulators/Failure Patterns.md` | Append-prepend: newest pattern at top |
| Metrics | `Accumulators/Metrics.md` | Append-prepend: one row per plan run, newest at top |
| Prompt Log | `Accumulators/Prompt Log.md` | Append-prepend: one entry per prompt outcome, newest at top |

Accumulating notes never get a timestamp in their filename — they hold every entry across all plan runs and serve as the cross-time learning corpus.

Always Title Case. Always full ISO date for any dated note.

## Frontmatter

Every Conducty note carries frontmatter. Minimum required fields:

```yaml
---
type: plan | design | context | improvement | failure-patterns | metrics | prompt-log | index
date: YYYY-MM-DD          # for per-instance notes
time: HHmm                # for plan / design / improvement
project: {project-name}   # for context, and for plans/designs scoped to one project
topic: {short topic}      # for plan / design (optional but recommended)
tags: [conducty, conducty/<type>]
---
```

Add type-specific fields as the skill requires (e.g., plans add `appetite`, metrics rows add `pass_rate`).

## Linking

**Every per-instance note links its peers and at least one index.** A note with no outgoing links has been written into a void.

Standard link patterns:

- A **plan** links: `[[Plans Index]]`, the design(s) it decomposed (`[[Design 2026-04-27 0930 Auth Cleanup]]`), the context note(s) it loaded (`[[Context My App]]`), the prior improvement entry whose experiments it's testing (`[[Improvement 2026-04-26 1830]]`), and any prior plan whose work carries forward (`[[Plan 2026-04-26 0930]]`). Plans also link the accumulating notes they will append to: `[[Failure Patterns]]`, `[[Metrics]]`, `[[Prompt Log]]`.
- A **design** links: `[[Designs Index]]`, the plan(s) that consume it, the context note(s) for relevant projects, related dialectic decisions.
- A **context note** links: `[[Context Index]]` and any plan/design that depends on the project. Backlinks accumulate naturally as plans reference it.
- An **improvement entry** links: `[[Improvements Index]]`, the plan it reflects on, `[[Failure Patterns]]`, prior improvements being evaluated.
- **Failure Patterns** (accumulating) — each entry inside the file links the plan that surfaced it (`[[Plan 2026-04-27 0930 Auth Cleanup]]`) and the prompt entry in `[[Prompt Log]]`.
- **Metrics** (accumulating) — each row links its plan.
- **Prompt Log** (accumulating) — each entry links its plan and, if a failure pattern was extracted, the entry in `[[Failure Patterns]]`.

Place links in two zones:
1. **Inline** — wherever a name appears in prose, wikilink it on first reference within a section.
2. **Related section** at the bottom of per-instance notes:

```markdown
## Related

- Index: [[Plans Index]]
- Built from: [[Design 2026-04-27 0930 Auth Cleanup]], [[Context My App]]
- Tests experiments from: [[Improvement 2026-04-26 1830]]
- Carries forward from: [[Plan 2026-04-26 0930]]
- Accumulates into: [[Failure Patterns]], [[Metrics]], [[Prompt Log]]
```

## Index Notes

Index notes are flat lists with frontmatter. They serve two purposes:
1. Make Obsidian's left-sidebar useful (navigate by index, not file tree)
2. Catch orphaned per-instance notes — if a new note isn't in its index, it'll get lost

Each index follows this shape:

```markdown
---
type: index
tags: [conducty, conducty/index]
---

# Plans Index

Conducty plans. Newest first.

- [[Plan 2026-04-27 1430 Bug Triage]]
- [[Plan 2026-04-27 0930 Auth Cleanup]]
- [[Plan 2026-04-26 0930]]

## Related

- Root: [[Conducty Index]]
- See also: [[Designs Index]], [[Improvements Index]], [[Failure Patterns]], [[Metrics]], [[Prompt Log]]
```

When you create a new per-instance note, **always** prepend its wikilink to the matching index in the same operation.

`Conducty Index` is the root and links every index plus the accumulating notes:

```markdown
---
type: index
tags: [conducty, conducty/index, conducty/root]
---

# Conducty Index

The Conducty cycle: Shape → Plan → Trace → Execute → Verify → Improve.

## Indexes

- [[Plans Index]]
- [[Designs Index]]
- [[Context Index]]
- [[Improvements Index]]

## Accumulating

- [[Failure Patterns]]
- [[Metrics]]
- [[Prompt Log]]
```

## Bootstrap

If the vault root doesn't exist, create it (with the standard subdirectories) before any other note write:

```bash
VAULT="${CONDUCTY_VAULT:-$HOME/Obsidian/Conducty}"
mkdir -p "$VAULT"/{Indexes,Accumulators,Plans,Designs,Improvements,"Code Reviews","Ship Reports",Context}
```

`Context/{Project}/` and its `Modules/` + `Refreshes/` subfolders are created lazily by [[conducty-context]] when ingesting a project.

Seed these notes if missing:

- Root: `Conducty Index.md` (vault root)
- Indexes (under `Indexes/`): `Plans Index`, `Designs Index`, `Context Index`, `Improvements Index`
- Accumulating (under `Accumulators/`): `Failure Patterns`, `Metrics`, `Prompt Log` (each with its frontmatter and an empty body)

The installer (`install-claude-code.sh`) does this on first run. This skill creates them lazily if a write would otherwise create an orphan.

## Cross-Skill Handoff Protocol

Plans, code reviews, and ship reports must find each other reliably. The rules:

### Active Plan Resolution

The "active plan" is the most recent `Plans/Plan *.md` whose `## End-of-Plan Summary` is **not yet filled** (i.e., [[conducty-review]] hasn't closed it). Resolve by:

```bash
# List all plans, newest first
ls -t "$VAULT"/Plans/Plan*.md
```

Read the newest first. If its End-of-Plan Summary is filled, walk backward until one is found that isn't, OR conclude no active plan exists. [[conducty-plan]] starting a new plan creates a fresh active plan; [[conducty-review]] closes the prior one.

### Plan ↔ Code Review

[[conducty-code-review]] reads:
- The plan(s) whose execution window matches the diff. If the user is reviewing a single completed plan, it's the latest closed plan. If reviewing a multi-plan branch, it's all plans whose timestamps fall within the commit range.

[[conducty-code-review]] writes:
- A new `Code Review YYYY-MM-DD HHmm.md` note with `## Related` linking each plan
- An Edit on each linked plan's `## Review Notes` section to add the wikilink to the code-review note

### Plan ↔ Ship Report

[[conducty-ship]] reads:
- The latest `Code Reviews/Code Review *.md` note. Its `verdict` field gates the ship battery.
- The plan(s) referenced by that code review.
- `Context {Project} Tests` for the command set.

[[conducty-ship]] writes:
- A new `Ship Report YYYY-MM-DD HHmm.md`
- An Edit on the code-review note's `## Related` section: add the ship report wikilink
- An Edit on each plan's `## Review Notes` section: add the ship report wikilink

### Long-Running Branch (Multiple Plans, One Branch)

When a branch accumulates work from multiple plans before merging:

- Each plan still produces its own `Improvement` note via [[conducty-improve]] at plan-close
- A **single** `Code Review` runs against the cumulative branch diff at the end (not per-plan)
- A **single** `Ship Report` runs after the code review
- The code-review note's `## Related` lists every plan that contributed to the branch
- The ship report does the same

### Discovery Glob Patterns

Standard globs every skill can rely on. All globs are relative to the resolved `$VAULT` root.

| To find | Glob |
|---------|------|
| Plans | `Plans/Plan *.md` |
| Designs | `Designs/Design *.md` |
| Improvements | `Improvements/Improvement *.md` |
| Code reviews | `Code Reviews/Code Review *.md` |
| Ship reports | `Ship Reports/Ship Report *.md` |
| Project hubs | `Context/*/Context *.md` (filter to depth-2 — the hub sits directly under each project folder) |
| Project slices | `Context/*/Context * Architecture.md`, `Context/*/Context * Conventions.md`, etc. |
| Module deep notes | `Context/*/Modules/Context *.md` |
| Refresh deltas | `Context/*/Refreshes/Context Refresh *.md` |
| Indexes | `Indexes/* Index.md` |
| Accumulators | `Accumulators/Failure Patterns.md`, `Accumulators/Metrics.md`, `Accumulators/Prompt Log.md` |

Skills doing discovery should use these patterns, not improvise.

## Reading the Past

When [[conducty-plan]] starts a new plan, it reads:

- **Latest plan**: glob `Plans/Plan *.md`, sort by `date` then `time` frontmatter, pick newest — that's the prior plan
- **Latest improvement**: glob `Improvements/Improvement *.md`, pick newest
- **All project hubs**: glob `Context/*/Context *.md` (the hub sits at the top of each project folder)
- **`Accumulators/Failure Patterns.md`** — the accumulating learning corpus, especially recent entries
- **`Accumulators/Metrics.md`** — last 7-14 rows for trend data

Use Glob with patterns like `Plans/Plan *.md` against the resolved vault root. Read the resulting notes, follow their wikilinks via Read on the targets, and the orchestrator inherits the full context graph.

## Writing Conventions

- Every Write to a new per-instance note must include frontmatter, a `## Related` section, and an index update in the same Conducty action.
- Use Edit (not Write) to update existing notes — preserve frontmatter, prepend new entries above older ones.
- Never rename a per-instance note silently — wikilinks resolve by basename, so a rename breaks every backlink. If a rename is needed, do it in Obsidian (it updates links) or grep+sed across the vault.
- Code spans (`` `~/.conducty/...` `` or `` `./skills/foo/SKILL.md` ``) are still appropriate for shell paths or external state. Use wikilinks only for vault-resident notes.

### Edit-Prepend Contract for Accumulating Notes

`Failure Patterns`, `Metrics`, and `Prompt Log` are append-mostly but written by multiple skills (sometimes within the same plan). The contract:

1. **Each accumulating note has a stable two-line header anchor** — the H1 plus a one-line intro. New entries are prepended **immediately after the anchor**, never inside it, never appended at the bottom.
2. **Every entry begins with a level-3 heading containing a timestamp**: `### YYYY-MM-DD HHmm — {short label}`. Newest entry is at the top; chronological order descends.
3. **Every entry links its source plan** via wikilink in the body. This is what makes the accumulating note a graph node, not a flat log.
4. **Use Edit, not Write** — Write would clobber prior entries. The Edit's `old_string` is the anchor (H1 + intro), the `new_string` is anchor + new entry.
5. **Atomic per skill invocation** — within a single skill action, prepend all entries the skill is contributing as one Edit (or a sequence on the same anchor with each new entry shifting the anchor down). Don't interleave with other skills' writes inside the same action.

Example anchor for `Accumulators/Failure Patterns.md`:

```markdown
# Failure Patterns

Accumulating failure-pattern entries from [[conducty-debug]] and [[conducty-review]]. Newest first.

### 2026-04-27 1830 — P3 vague acceptance criteria
- **Plan**: [[Plan 2026-04-27 0930 Auth Cleanup]]
- ...
```

To prepend, Edit replaces the intro line with `intro line\n\n### {new entry}`. The H1 + intro stay constant — they're the anchor.

If two plans run in parallel, each appends through Edit on the same anchor. Edit is line-precise so collisions surface as Edit failures (the second one finds the prior one's text and stops). Resolve by re-reading and re-editing.

### Cross-Plan Concurrency

Conducty assumes one orchestrator per vault at a time. Running two `conducty-execute` sessions against the same vault concurrently is supported only when:

- They write to **different per-instance notes** (different timestamps — fine)
- They append to **different accumulating notes** (rare — usually they share)
- Or one is read-only ([[conducty-vault-graph]], [[conducty-code-review]] reading)

When two orchestrators must append to the same accumulating note, serialize: finish one, then the other.

## What This Skill Replaces

Old Conducty stored state at:

```
~/.conducty/plans/, ~/.conducty/designs/, ~/.conducty/context/, ~/.conducty/history/
```

The vault replaces all of it. If you find a Conducty skill that still references the old path, treat the vault path as authoritative and update the skill (or flag the inconsistency). The legacy `~/.conducty/` directory is not used.

## Integration

- [[conducty-plan]] reads/writes `Plan YYYY-MM-DD HHmm [Topic].md`
- [[conducty-plan-audit]] updates the plan note's `## Plan Quality Gate` section before execution
- [[conducty-shape]] writes `Design YYYY-MM-DD HHmm {Topic}.md`
- [[conducty-context]] writes the project sub-graph (`Context {Project}` hub + Architecture/Conventions/Invariants/Hotspots/Tests/Glossary slices, optional module deep notes, refresh deltas)
- [[conducty-improve]] writes `Improvement YYYY-MM-DD HHmm.md`
- [[conducty-debug]] appends entries to `Failure Patterns`
- [[conducty-review]] appends rows to `Metrics` and entries to `Prompt Log`
- [[conducty-code-review]] writes `Code Review YYYY-MM-DD HHmm.md`
- [[conducty-ship]] writes `Ship Report YYYY-MM-DD HHmm.md`
- [[conducty-system]] points new sessions at this skill before they read any state
