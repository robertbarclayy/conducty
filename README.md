<p align="center">
  <img src="assets/icon.png" alt="Conducty" width="128" />
  <br />
  <a href="https://www.conducty.ai/">conducty.ai</a>
</p>

# Conducty

**Systems-Level AI Agent Orchestration for [Claude Code](https://code.claude.com/), backed by an Obsidian vault as the context engine.**

Plan once. Run in parallel. Review and ship. Then read your own past back into the next plan.

Most AI coding sessions look like this: prompt, wait, get distracted, review, fix, repeat. In that loop, the limiting factor is not model capability — it is human sequencing overhead, and the fact that lessons from prior sessions evaporate.

Conducty turns that loop into a structured per-plan cycle: batch-plan, run prompts in parallel via Claude Code subagents, review and ship with evidence — and write everything (plans, designs, context, improvements, failure patterns, metrics) into an Obsidian vault as a wikilinked knowledge graph. The next plan reads that graph and gets sharper.

Under the hood, it is grounded in proven engineering thinking: Shape Up's appetite-driven planning, Toyota Kata's improvement loops, tracer bullets from The Pragmatic Programmer, and calibrated rigor from Release It!. The result is a learning system that compounds.

## The Conducty Cycle

```
Shape → Plan → Trace → Execute → Verify → Improve   →   Code Review → Ship
  ↑                                            |
  └────────────── feedback ────────────────────┘
```

1. **Shape** — set the appetite, define boundaries and no-go zones, produce a design note
2. **Plan** — decompose designs into time-budgeted prompts with tracer markers and calibrated review levels
3. **Trace** — run one prompt per group as a tracer bullet to validate plan assumptions
4. **Execute** — dispatch remaining prompts via Claude Code's Task tool with review rigor scaled to risk
5. **Verify** — checkpoint between groups with health metrics and hill chart tracking
6. **Improve** — extract failure patterns, run the improvement kata, shape the next plan
7. **Code Review** *(post-cycle)* — whole-branch holistic review of the plan's cumulative diff
8. **Ship** *(post-cycle)* — pre-merge gate: lint, typecheck, tests, secrets, vuln check, code-review verdict

## Installation

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
cd ~/conducty
# Optional: pick where the vault lives. Defaults to ~/Obsidian/Conducty
export CONDUCTY_VAULT="$HOME/Obsidian/Conducty"
chmod +x install-claude-code.sh
./install-claude-code.sh
```

This will:
1. Symlink all `conducty-*` skills into `~/.claude/skills/`
2. Append the Conducty workflow and quality rules to `~/.claude/CLAUDE.md` (between marker comments so they can be cleanly removed)
3. Create the vault at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`) and seed it with index notes (`Conducty Index`, `Plans Index`, `Designs Index`, `Context Index`, `Improvements Index`) and accumulating notes (`Failure Patterns`, `Metrics`, `Prompt Log`)

Restart Claude Code afterward to pick up the new skills. Open the vault in Obsidian to navigate the graph.

See [`.claude-code/INSTALL.md`](.claude-code/INSTALL.md) for the manual install path and uninstall instructions.

## Codex Integration

Conducty also ships a Codex integration under [`integrations/codex`](integrations/codex/). It packages the Conducty loop as a Codex plugin with one skill and a dependency-free local MCP server.

The MCP server exposes deterministic vault tools for the parts of Conducty that should not depend on hand-edited chat state:

- initialize the Obsidian vault
- create timestamped plan notes
- check prompt smells before execution
- log prompt outcomes
- append checkpoint health metrics to the active plan
- write improvement kata notes
- list recent vault notes

Run the integration smoke test:

```bash
cd integrations/codex
node scripts/smoke-test.mjs
```

## Quickstart — Your First Plan

After install, open Claude Code in any project directory and run:

```
> set up Conducty
```

This triggers `conducty-bootstrap`, which walks you through a tiny scoped first plan end-to-end so you feel the cycle before betting real work on it.

**Worked example.** What the conversation looks like:

```
You: set up Conducty
Claude: Conducty vault is at ~/Obsidian/Conducty. OK to proceed?
You: yes
Claude: Which project should we start with?
You: ~/code/my-app
Claude: [runs conducty-context — produces 7 vault notes:
        Context My App + Architecture/Conventions/Invariants/
        Hotspots/Tests/Glossary]
        Found 4 bounded contexts: auth, billing, api, db.
        Test command: `npm test`. Pick a small first goal.
You: add a date-format helper with TDD
Claude: [runs conducty-plan with 30-min appetite, single prompt,
        verify-only, no parallelism]
        Plan note written: Plan 2026-04-27 1430 Date Helper.md
        Open it in Obsidian — paste the prompt into a fresh
        Claude Code session in ~/code/my-app.
You: [paste prompt → implementer writes test, then code → verifies]
You: it's done
Claude: [runs conducty-checkpoint → conducty-review →
        conducty-improve. Updates Plans Index, Metrics,
        Prompt Log; writes Improvement 2026-04-27 1500.md]
        First plan complete. Pass rate: 100%. Tour the vault?
```

By the end you have a working vault with seven notes per project and your first improvement entry. Every subsequent session begins with `conducty-plan`.

**For the next plan:**

```
> plan this work: refactor the billing module to use the new tax engine
```

`conducty-plan` reads your prior plan, your latest improvement, your failure patterns, your context sub-graph for `my-app`, and proposes a structured plan with tracer markers and calibrated review levels. Approve, then `execute the plan`.

**At the end of the branch (before merge):**

```
> review my changes
> ship it
```

`conducty-code-review` produces a whole-branch review note. `conducty-ship` runs the six-gate battery and writes a green/yellow/red verdict.

## The Context Engine — An Obsidian Vault

Conducty's state is **not** a flat log under `~/.conducty/`. It's an Obsidian vault where every plan, design, project context, improvement, failure pattern, metrics row, and prompt-log entry is a note, and every note is wikilinked to its peers. A plan links the designs it consumed, the context notes it loaded, the improvement experiments it's testing, and the prior plan whose work carries forward. The next plan reads that graph and inherits all of it.

**Vault location**: `$CONDUCTY_VAULT` (env var) → fallback `~/Obsidian/Conducty/`. Set the env var to point at your existing vault if you want.

**Naming**: per-instance notes are timestamped — multiple plans per day are normal.

Vault is **nested by category** — per-instance notes get a dedicated directory; per-project context lives under `Context/{Project}/`; accumulators under `Accumulators/`. Wikilinks resolve by basename across all subfolders, so directory placement is purely organizational.

| Note | Path |
|------|------|
| Plan | `Plans/Plan YYYY-MM-DD HHmm [Topic].md` |
| Design | `Designs/Design YYYY-MM-DD HHmm {Topic}.md` |
| Improvement | `Improvements/Improvement YYYY-MM-DD HHmm.md` |
| Code review | `Code Reviews/Code Review YYYY-MM-DD HHmm.md` |
| Ship report | `Ship Reports/Ship Report YYYY-MM-DD HHmm.md` |
| Context (sub-graph) | `Context/{Project}/Context {Project}.md` (hub) + `Context/{Project}/Context {Project} Architecture/Conventions/Invariants/Hotspots/Tests/Glossary.md` + optional `Context/{Project}/Modules/Context {Project} {Module}.md` deep notes + `Context/{Project}/Refreshes/Context Refresh {Project} YYYY-MM-DD HHmm.md` deltas |
| Failure Patterns | `Accumulators/Failure Patterns.md` (accumulating) |
| Metrics | `Accumulators/Metrics.md` (accumulating) |
| Prompt Log | `Accumulators/Prompt Log.md` (accumulating) |
| Indexes | `Conducty Index.md` (root) + `Indexes/{Plans,Designs,Context,Improvements} Index.md` |

See `skills/conducty-obsidian/SKILL.md` for the complete vault contract: frontmatter, link conventions, index discipline, bootstrap.

The repo itself is also an Obsidian-friendly directory — skill files use frontmatter + `[[wikilinks]]` so you can browse the skill graph by opening the repo as a vault.

## Per-Plan Workflow

### Start a Plan: Shape and Plan

In any project, ask Claude Code to **start a plan**. The `conducty-plan` skill will:

- Read the latest plan, latest improvement note, and `Failure Patterns` / `Metrics` from the vault
- Load cached project context (`Context {Project}.md`)
- Ask for goals and the plan's **appetite** (time budget)
- **Shape non-trivial goals**: Medium/High complexity goals go through `conducty-shape` for appetite-driven design with no-go zones and rabbit hole management
- Generate a plan note with parallel groups, tracer markers, and calibrated review levels
- Check every prompt for **prompt smells** before finalizing
- Assign review levels: verify-only (low risk), spec-review (medium), full-review (high)

### Execution: Trace and Execute

**Automated (recommended):** Use `conducty-execute` to run prompts via Claude Code's **Task** tool. The **tracer prompt** in each group runs first — if it fails, the plan needs revision, not just a fix. Remaining prompts execute as subagents with review rigor calibrated to their complexity.

**Manual:** Open the plan note, grab prompts, and run them in separate Claude Code sessions. All prompts include time budgets, no-go zones, and escalation statuses.

For **parallel prompts targeting the same repo**, use `conducty-worktrees` (or pass `isolation: "worktree"` directly to the Task tool) to create isolated worktrees.

### Between Groups: Checkpoint

After each group, `conducty-checkpoint` computes **health metrics** (first-attempt pass rate, retry rate, blocked count), updates **hill chart positions** for each goal, and detects **systemic failures** (2+ related failures suggest a plan-level issue, not individual code bugs).

Fix prompts are generated at the right **leverage point**: plan-level, prompt-level, or code-level. Three failures on the same prompt triggers a circuit breaker — escalate to the user.

### End of Plan: Review and Improve

`conducty-review` audits all changes with evidence-based verdicts, prepends entries to `Failure Patterns` and `Metrics` and `Prompt Log` in the vault, and prepares carry-forward intelligence for the next plan.

`conducty-improve` runs the **improvement kata**: target vs. actual, obstacles, and specific experiments for the next plan. Each kata writes a new `Improvement YYYY-MM-DD HHmm.md` note. This is what makes Conducty a learning system — history that doesn't change behavior is just a log.

### Post-Plan: Code Review and Ship

`conducty-code-review` reads the cumulative branch diff against main and runs a holistic review across five lenses (spec alignment, correctness, security, architecture/coupling, tests/maintainability). Findings are triaged Critical / Important / Minor and written to `Code Review YYYY-MM-DD HHmm.md`. Critical+ findings flow back into `Failure Patterns` so the next plan can prevent them.

`conducty-ship` is the pre-merge gate. Six checks: code-review verdict, lint, typecheck, full test suite, secrets scan, dependency-vulnerability check. Outputs a single `green` / `yellow` / `red` verdict in `Ship Report YYYY-MM-DD HHmm.md`. Ship never auto-merges — verdict is advisory; the user owns the merge.

## Quality Principles

Ten engineering-grounded principles enforced across every session:

| Principle | Source | In Practice |
|-----------|--------|-------------|
| Appetite before plan | Shape Up | Time budget constrains the plan, not the other way around |
| Tracer before volley | Pragmatic Programmer | First prompt validates assumptions before full execution |
| Prompt quality is leverage | Thinking in Systems | Invest upstream — bad prompts waste everything downstream |
| Evidence before claims | Release It! | Run verification, read output, then claim (`conducty-verify`) |
| Root cause before fixes | Thinking in Systems | Fix at the highest leverage point: plan > prompt > code |
| Design before implementation | Shape Up | Non-trivial goals get shaped before prompts are written |
| Characterize before changing | Working with Legacy Code | Verify existing behavior before modifying it |
| Deep modules, not ceremony | Philosophy of Software Design | Skills reduce complexity, not add checkboxes |
| Calibrate rigor to risk | Pragmatic Programmer | Low risk = verify-only. High risk = full review. |
| Learn or repeat | Toyota Kata | Daily improvement kata extracts lessons and runs experiments |

## Skills

13 skills, organized into three tiers.

### Foundation

| Skill | Role |
|-------|------|
| `conducty-system` | Philosophy, ten principles, ubiquitous language, "where am I?" router. |
| `conducty-obsidian` | The vault contract. Layout, naming, frontmatter, link conventions, indexes. Read before any state I/O. |
| `conducty-bootstrap` | First-run walkthrough. Confirms vault, runs first context, produces a tiny throwaway first plan. |

### Cycle skills (the per-plan workflow)

| Skill | Role |
|-------|------|
| `conducty-shape` | Appetite-driven design. Non-trivial goals get appetite, scope, no-go zones, rabbit-hole budgets. Writes `Design YYYY-MM-DD HHmm {Topic}.md`. |
| `conducty-plan` | Per-plan batch planning. Decomposes goals into time-budgeted prompts with tracer markers. Writes `Plan YYYY-MM-DD HHmm [Topic].md`. |
| `conducty-execute` | Tracer-first subagent execution via the Task tool. |
| `conducty-checkpoint` | Health-aware group gate. Pass rate, hill charts, systemic-failure detection. |
| `conducty-review` | End-of-plan audit. Evidence-based verdicts; appends to `Failure Patterns`, `Metrics`, `Prompt Log`. |
| `conducty-improve` | Toyota Kata improvement loop. Writes `Improvement YYYY-MM-DD HHmm.md`. |

### Discipline skills (how work is done)

| Skill | Role |
|-------|------|
| `conducty-tdd` | Two-level TDD: orchestrator (verification-first) and implementer (red-green-refactor). Prompt smell catalog. |
| `conducty-verify` | Evidence gate. IDENTIFY → RUN → READ → JUDGE → RECORD. |
| `conducty-debug` | Leverage point analysis. Plan vs. prompt vs. code. 3-retry circuit breaker. |

### Post-cycle skills (after the plan, before merge)

| Skill | Role |
|-------|------|
| `conducty-code-review` | Whole-branch holistic review: spec alignment, correctness, security, architecture, tests. Writes `Code Review YYYY-MM-DD HHmm.md` linked to the plan. |
| `conducty-ship` | Pre-merge battery: lint, typecheck, tests, secrets scan, vuln check, code-review verdict. Writes `Ship Report YYYY-MM-DD HHmm.md` with green/yellow/red verdict. |

### Supporting skills (infrastructure)

| Skill | Role |
|-------|------|
| `conducty-context` | Project ingestion as a linked sub-graph: hub + Architecture/Conventions/Invariants/Hotspots/Tests/Glossary slices, optional module deep notes, refresh deltas. Stale-context detection. |
| `conducty-worktrees` | Git worktree lifecycle for parallel prompts on the same repo. |
| `conducty-dialectic` | Six-persona structured debate for architectural decisions. |
| `conducty-vault-graph` | Vault hygiene audit: orphans, broken wikilinks, stale context, recurring failure patterns, plans without closure. Run weekly. |

Each skill lives in `skills/<skill-name>/SKILL.md`. Claude Code loads them on demand based on the `description` trigger in the skill's frontmatter.

## Recommended Path

### First Plan: Get Oriented

1. Read `conducty-system` and `conducty-obsidian` — understand the philosophy, the cycle, the ubiquitous language, and the vault contract
2. Run `conducty-context` on your main project — "Load context from /path/to/my/project". A `Context {Project}.md` note appears in the vault.
3. Run `conducty-plan` with 2-3 small goals — "Plan this work". Start with Low complexity goals to see the cycle without the full ceremony. A `Plan YYYY-MM-DD HHmm.md` note appears in the vault.
4. Execute manually — copy prompts from the plan into a fresh Claude Code session. Get a feel for the prompt structure, no-go zones, and verification steps.
5. Run `conducty-checkpoint` on the group
6. Run `conducty-review` and `conducty-improve`. Inspect the new entries in `Metrics`, `Failure Patterns`, `Prompt Log`, and the new `Improvement YYYY-MM-DD HHmm.md` note.

This gives you one full trip through the cycle. Don't use `conducty-execute` (automated subagents) on the first plan — do it manually so you understand what's happening.

### First Few Plans: Build the Muscle

- **Plan 2-3:** Add Medium complexity goals. These trigger `conducty-shape`, which teaches you appetite-setting and no-go zones. Use `conducty-execute` for Low complexity prompts; keep doing Medium ones manually.
- **Plan 3-4:** Start using `conducty-execute` for everything. Watch how the tracer-first approach catches bad plan assumptions early.
- **Plan 4-5:** Open the `Improvements Index` in Obsidian. Are the experiments from `conducty-improve` actually changing your plans? If not, the improvement kata needs sharper questions.

### After Several Plans: Calibrate

By now `Accumulators/Metrics.md` has a healthy run of rows. Look at:

- **First-attempt pass rate** — if it's below 70%, your prompts have smells. Focus on the quality gate in `conducty-plan` Step 5e.
- **Most common failure pattern** — open `Accumulators/Failure Patterns.md`. Whatever appears most is your highest-leverage improvement.
- **Appetite accuracy** — are you consistently over or under budget? Adjust your estimation.
- **Review level calibration** — are verify-only prompts passing reliably? Are full-review prompts catching real issues? If not, adjust the thresholds.

### Advanced Usage

- **`conducty-dialectic`** for architectural decisions that have genuine trade-offs. Don't use it for simple choices — it's designed for questions where reasonable people disagree.
- **`conducty-worktrees`** when you have 3+ parallel prompts targeting the same repo. The tracer-first strategy (tracer on main, worktrees for the rest) prevents the most common parallel conflict.
- **Custom prompt templates** — if you find yourself repeating the same prompt structure for a type of work not covered by the eight built-in templates (feature, bugfix, refactor, test, decision, security, migration, performance), create a new template in `skills/conducty-plan/prompt-templates/`.

### Skill Dependency Map

```
conducty-system (philosophy, language)
       │
       ├── conducty-context ───────────────────► conducty-plan
       │                                              │
       │                                    ┌─────────┼──────────┐
       │                                    ▼         ▼          ▼
       │                              conducty-shape  │   conducty-dialectic
       │                                    │         │
       │                                    └────►────┘
       │                                         │
       │                                         ▼
       │                                   conducty-execute
       │                                         │
       │                          ┌──────────────┼──────────────┐
       │                          ▼              ▼              ▼
       │                   conducty-verify  conducty-tdd  conducty-worktrees
       │                          │
       │                          ▼
       │                   conducty-checkpoint
       │                          │
       │                     ┌────┴────┐
       │                     ▼         ▼
       │              conducty-verify  conducty-debug
       │                                    │
       │                                    ▼
       │                          (failure-patterns.md)
       │
       └── conducty-review ──► conducty-improve ──► conducty-plan (next plan)
```

## Project Structure

```
conducty/
├── README.md
├── CLAUDE.md                    # Repo-level rules; appended to ~/.claude/CLAUDE.md by installer
├── install-claude-code.sh       # Installer
├── assets/
│   └── icon.png
├── integrations/
│   └── codex/                    # Codex plugin + MCP vault tools
│       ├── .codex-plugin/
│       │   └── plugin.json
│       ├── .mcp.json
│       ├── mcp/
│       │   └── server.mjs
│       ├── scripts/
│       │   └── smoke-test.mjs
│       └── skills/
│           └── conducty-codex/
├── .claude-code/
│   └── INSTALL.md               # Detailed install / uninstall guide
├── skills/
│   ├── conducty-system/             # Entry point and philosophy
│   ├── conducty-obsidian/           # Vault contract — context engine
│   ├── conducty-bootstrap/          # First-run walkthrough
│   ├── conducty-shape/              # Appetite-driven design
│   ├── conducty-plan/               # Per-plan batch planning
│   │   ├── plan-template.md
│   │   └── prompt-templates/
│   │       ├── feature.md
│   │       ├── bugfix.md
│   │       ├── refactor.md
│   │       ├── test.md
│   │       ├── decision.md
│   │       ├── security.md
│   │       ├── migration.md
│   │       └── performance.md
│   ├── conducty-tdd/                # Test-driven development
│   ├── conducty-execute/            # Tracer-first execution
│   │   ├── implementer-prompt.md
│   │   ├── spec-reviewer-prompt.md
│   │   └── quality-reviewer-prompt.md
│   ├── conducty-verify/             # Evidence gate
│   ├── conducty-debug/              # Leverage point analysis
│   ├── conducty-checkpoint/         # Health-aware group gate
│   ├── conducty-review/             # End-of-plan audit
│   ├── conducty-improve/            # Improvement kata
│   ├── conducty-code-review/        # Whole-branch post-implementation review
│   ├── conducty-ship/               # Pre-merge battery
│   ├── conducty-context/            # Project ingestion sub-graph
│   ├── conducty-worktrees/          # Parallel isolation
│   ├── conducty-dialectic/          # Decision analysis
│   │   └── dialectic-protocol.md
│   └── conducty-vault-graph/        # Vault hygiene audit
└── rules/
    ├── conducty-workflow.md
    └── conducty-quality.md
```

### State — The Obsidian Vault

Created by `install-claude-code.sh` at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`):

```
{vault}/
├── Conducty Index.md                       # root hub
│
├── Indexes/
│   ├── Plans Index.md
│   ├── Designs Index.md
│   ├── Context Index.md
│   └── Improvements Index.md
│
├── Accumulators/
│   ├── Failure Patterns.md
│   ├── Metrics.md
│   └── Prompt Log.md
│
├── Plans/                                   # Plan YYYY-MM-DD HHmm [Topic].md
├── Designs/                                 # Design YYYY-MM-DD HHmm {Topic}.md
├── Improvements/                            # Improvement YYYY-MM-DD HHmm.md
├── Code Reviews/                            # Code Review YYYY-MM-DD HHmm.md
├── Ship Reports/                            # Ship Report YYYY-MM-DD HHmm.md
│
└── Context/
    └── {Project}/
        ├── Context {Project}.md             # hub
        ├── Context {Project} Architecture.md
        ├── Context {Project} Conventions.md
        ├── Context {Project} Invariants.md
        ├── Context {Project} Hotspots.md
        ├── Context {Project} Tests.md
        ├── Context {Project} Glossary.md
        ├── Modules/
        │   └── Context {Project} {Module}.md       # optional, per bounded context
        └── Refreshes/
            └── Context Refresh {Project} YYYY-MM-DD HHmm.md
```

The legacy `~/.conducty/` directory is no longer used.

## Contributing

Conducty is open source. Contributions welcome — especially new prompt templates, failure pattern libraries, and improvements to skill descriptions / triggers. PRs that touch `skills/` or `rules/` should run cleanly through `install-claude-code.sh` against a clean `~/.claude/`.

## License

MIT
