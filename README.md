<p align="center">
  <img src="assets/icon.png" alt="Conducty" width="128" />
  <br />
  <a href="https://www.conducty.ai/">conducty.ai</a>
</p>

# Conducty

**Systems-Level AI Agent Orchestration**

Plan once. Run in parallel. Review and ship.

Most AI coding days still look like this: prompt, wait, get distracted, review, fix, repeat. In that loop, the limiting factor is not model capability -- it is human sequencing overhead.

Conducty turns that loop into a structured daily cycle: batch-plan in the morning, run prompts in parallel, then review and ship with evidence. It moves you from working like a sequential programmer to operating as a concurrent orchestration layer for AI agents.

Under the hood, it is grounded in proven engineering thinking: Shape Up's appetite-driven planning, Toyota Kata's improvement loops, tracer bullets from The Pragmatic Programmer, and calibrated rigor from Release It!. The result is a learning system that gets better each day.

## The Conducty Cycle

```
Shape → Plan → Trace → Execute → Verify → Improve
  ↑                                            |
  └────────────── feedback ────────────────────┘
```

1. **Shape** -- set the appetite, define boundaries and no-go zones, produce a design
2. **Plan** -- decompose designs into time-budgeted prompts with tracer markers and calibrated review levels
3. **Trace** -- run one prompt per group as a tracer bullet to validate plan assumptions
4. **Execute** -- dispatch remaining prompts with review rigor scaled to risk
5. **Verify** -- checkpoint between groups with health metrics and hill chart tracking
6. **Improve** -- extract failure patterns, run the improvement kata, shape tomorrow's approach

## Installation

### Cursor (via Plugin Marketplace)

After this repository is published to the Cursor marketplace, install it in Cursor Agent chat with:

```text
/add-plugin conducty
```

or search for `conducty` in the plugin marketplace.

### Cursor Local Package / Publish Prep

```bash
# Clone the repo
git clone https://github.com/conducty/conducty.git
cd conducty

# Validate the root Cursor plugin manifest and contents
node scripts/validate-template.mjs
```

This repo uses a single-plugin Cursor layout at `.cursor-plugin/plugin.json`, pointing directly at the root `skills/`, `rules/`, and `assets/` directories.

### Cursor Manual Install (Legacy)

```bash
chmod +x setup.sh
./setup.sh
```

This legacy path still symlinks skills into `~/.cursor/skills/`, rules into `~/.cursor/rules/`, and creates `~/.conducty/` for persistent state (plans, history, designs, context, metrics).

### Other Platforms

| Platform | Install |
|----------|---------|
| Cursor plugin manifest | `.cursor-plugin/plugin.json` |
| Cursor manual install (legacy) | `./setup.sh` |
| Claude Code | `./install-claude-code.sh` |
| OpenCode | `./install-opencode.sh` |
| Codex | `./install-codex.sh` |
| GitHub Copilot | `./install-copilot.sh` |

## Cursor Plugin Packaging

The root `skills/`, `rules/`, and `assets/` directories are the Cursor plugin payload. Validate the plugin manifest and referenced content with:

```bash
node scripts/validate-template.mjs
```

Before publishing, make sure:

- `.cursor-plugin/plugin.json` has the final public metadata
- `assets/plugin-logo.png` is the intended marketplace logo
- `node scripts/validate-template.mjs` passes from a clean checkout

### Local Test Checklist

Before submitting the plugin, do one local smoke test in Cursor:

1. Run `node scripts/validate-template.mjs`
2. Run `./setup.sh`
3. Start a fresh Cursor session in any project
4. Confirm Conducty rules and skills appear in Cursor settings
5. Try prompts like `plan my day`, `shape this feature`, or `checkpoint this group`

### Submit For Review

When ready, submit the public repository at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).

## Daily Workflow

### Morning: Shape and Plan

Open any project in Cursor and ask the agent to **plan your day**. The `conducty-plan` skill will:

- Read improvement notes and failure patterns from yesterday
- Load cached project context
- Ask for goals and the day's **appetite** (time budget)
- **Shape non-trivial goals**: Medium/High complexity goals go through `conducty-shape` for appetite-driven design with no-go zones and rabbit hole management
- Generate a daily plan with parallel groups, tracer markers, and calibrated review levels
- Check every prompt for **prompt smells** before finalizing
- Assign review levels: verify-only (low risk), spec-review (medium), full-review (high)

### Execution: Trace and Execute

**Automated (recommended):** Use `conducty-execute` to run prompts via subagents. The **tracer prompt** in each group runs first — if it fails, the plan needs revision, not just a fix. Remaining prompts execute with review rigor calibrated to their complexity.

**Manual:** Open the daily plan, grab prompts, and run them in separate Cursor windows. All prompts include time budgets, no-go zones, and escalation statuses.

For **parallel prompts targeting the same repo**, use `conducty-worktrees` to create isolated worktrees.

### Between Groups: Checkpoint

After each group, `conducty-checkpoint` computes **health metrics** (first-attempt pass rate, retry rate, blocked count), updates **hill chart positions** for each goal, and detects **systemic failures** (2+ related failures suggest a plan-level issue, not individual code bugs).

Fix prompts are generated at the right **leverage point**: plan-level, prompt-level, or code-level. Three failures on the same prompt triggers a circuit breaker — escalate to the user.

### End of Day: Review and Improve

`conducty-review` audits all changes with evidence-based verdicts, extracts failure patterns, computes velocity metrics, and prepares carry-forward intelligence for tomorrow.

`conducty-improve` runs the **improvement kata**: target vs. actual, obstacles, and specific experiments for tomorrow. This is what makes Conducty a learning system — history that doesn't change behavior is just a log.

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

## Skills In Depth

Conducty has 13 skills organized into three tiers: the **cycle skills** that form the daily workflow, the **discipline skills** that govern how work is done, and the **supporting skills** that provide infrastructure.

### Cycle Skills (the daily workflow)

These skills form the Shape-Plan-Trace-Execute-Verify-Improve cycle. You move through them in order each day.

#### `conducty-system` -- Entry Point

The foundational skill. Read this first. It defines the entire Conducty philosophy: the ten principles drawn from engineering literature, the ubiquitous language (precise definitions of "appetite", "tracer", "prompt smell", "leverage point", etc.), and the daily cycle. It also provides a "where am I?" decision tree that routes you to the right skill based on your current situation.

**When it runs:** Start of every session. The rules files ensure it's always loaded.

#### `conducty-shape` -- Appetite-Driven Design

Replaces open-ended brainstorming with opinionated shaping. Before any prompt is written for a non-trivial goal, this skill forces three questions: How much is this worth (appetite)? What's in scope? What's explicitly out (no-go zones)?

You identify rabbit holes (areas that could eat disproportionate time) and either time-box or cut them. You breadboard the solution at a "fat marker" abstraction level -- detailed enough to execute, abstract enough for implementers to make tactical decisions. The output is a design doc at `~/.conducty/designs/` that `conducty-plan` decomposes into prompts.

**Key concepts:** Appetite as hard constraint (not estimate), no-go zones, rabbit holes, fat marker sketches, characterization needs for existing codebases.

**When it runs:** Invoked by `conducty-plan` for Medium/High complexity goals. Also triggered by "shape this", "design this", "think through".

#### `conducty-plan` -- Daily Batch Planning

The engine of the daily workflow. Loads yesterday's improvement notes and failure patterns, reads project context, asks for goals and the day's appetite, and then:

1. Gates non-trivial goals through `conducty-shape`
2. Maps file structure per goal
3. Decomposes goals into time-budgeted prompts using templates (feature, bugfix, refactor, test, decision)
4. Assigns calibrated review levels: `verify-only` (low risk), `spec-review` (medium), `full-review` (high)
5. Marks the first prompt in each group as a tracer
6. Runs a prompt quality gate checking for prompt smells (vague acceptance, missing context, mixed concerns, etc.)
7. Sets hill chart positions (uphill = figuring it out, downhill = making it happen)
8. Groups prompts for parallelization

**Key concepts:** Prompt smells, tracer markers, calibrated review levels, hill charts, appetite-constrained planning, carry-forward from yesterday.

**When it runs:** Morning. "Plan my day", "batch plan", "create daily plan".

#### `conducty-execute` -- Tracer-First Subagent Execution

Runs prompts from the plan by dispatching fresh subagents with precisely curated context. The tracer prompt runs alone first -- if it fails, the plan's assumptions are wrong and the remaining prompts should not blindly execute.

Each subagent gets exactly the context it needs (the surgical team model from Brooks): the full prompt text, scene-setting, relevant architecture, and the no-go zones. Review rigor scales with the prompt's assigned level -- low-risk prompts get verification only, not a full two-stage review.

Time budgets act as circuit breakers. If a subagent exceeds its budget, that's a signal (misestimated complexity, stuck agent) rather than a hard kill.

**Key concepts:** Tracer-first execution, context curation, calibrated review, time budgets as circuit breakers, implementer statuses (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT).

**Subagent templates:** `implementer-prompt.md` (dispatch work), `spec-reviewer-prompt.md` (verify spec compliance), `quality-reviewer-prompt.md` (verify code quality).

**When it runs:** After planning. "Execute", "run the plan", "start executing".

#### `conducty-checkpoint` -- Health-Aware Group Gate

Quality gate between parallelization groups. Goes beyond pass/fail to compute health metrics: first-attempt pass rate, retry count, blocked count. Updates hill chart positions for each goal. Detects systemic failures -- when 2+ prompts in a group fail with related symptoms, it flags a plan-level issue before generating individual code fixes.

Fix prompts are generated via `conducty-debug` at the right leverage level. Three failures on the same prompt triggers a circuit breaker -- stop retrying and escalate.

**Key concepts:** Health metrics, systemic failure detection, hill chart updates, leverage-appropriate fixes, 3-strike circuit breaker, no group advancement without independent verification.

**When it runs:** Between every parallelization group. "Checkpoint", "verify group".

#### `conducty-review` -- End-of-Day Audit

Walks through every executed prompt, verifies results with evidence, records verdicts (completed / needs-fix / partial / failed / blocked), and extracts failure patterns. Computes velocity metrics (total prompts, pass rate, appetite usage) and prepares carry-forward intelligence -- not just "needs fix" but what went wrong, the root cause, and what to try differently.

**Key concepts:** Evidence-based verdicts, failure pattern extraction, velocity metrics, carry-forward intelligence, retry handling.

**When it runs:** End of day. "Review", "audit", "review today's work".

#### `conducty-improve` -- The Learning Loop

The skill that closes the feedback loop and makes Conducty a learning system instead of an execution pipeline. Uses the Toyota Kata's four questions:

1. **Target condition** -- what did we plan?
2. **Current condition** -- what actually happened?
3. **Obstacles** -- what patterns caused failures?
4. **Next experiment** -- what specific, testable change do we try tomorrow?

Categorizes obstacles (stale context, prompt smell, design gap, calibration error, template weakness, tool limitation) and proposes 1-3 experiments. Tomorrow's `conducty-plan` reads these notes and applies them. If the improvement kata doesn't produce changes to tomorrow's plan, it was just logging.

**Key concepts:** Improvement kata, obstacle categorization, specific and testable experiments, prior experiment evaluation.

**When it runs:** After `conducty-review`. "What did we learn", "improve the process", "retrospective".

### Discipline Skills (how work is done)

These skills govern quality and methodology. They're referenced by the cycle skills, not typically invoked directly.

#### `conducty-tdd` -- Test-Driven Development for Agents

TDD adapted for the orchestrator-implementer model, operating at two levels:

- **Orchestrator level** (plan time): Write the verification command and acceptance criteria BEFORE writing the prompt. If you can't define what success looks like, you don't understand what you're building.
- **Implementer level** (execution time): Classical red-green-refactor within each prompt. Write a failing test, implement the minimum to pass, refactor.

Also defines the **prompt smells catalog** -- nine signs that a prompt will fail before you run it (vague acceptance, missing context, mixed concerns, no verification, unbounded scope, exceeds appetite, missing characterization, implicit knowledge, dependency on luck). These are checked during `conducty-plan` Step 5e.

**Key concepts:** Two-level TDD, prompt smells catalog, verification command as acceptance test, the iron law (no production code without a failing test first).

#### `conducty-verify` -- The Evidence Gate

The leanest skill in Conducty. One job: run the command, read the output, then claim the result. Defines a five-step gate (IDENTIFY, RUN, READ, JUDGE, RECORD) and a standardized evidence format that feeds into checkpoint health metrics and improvement learning.

Verification is calibrated to the prompt's review level: verify-only just runs the command, spec-review adds the spec reviewer, full-review adds the quality reviewer.

**Key concepts:** Evidence gate, calibrated verification, standardized evidence format.

#### `conducty-debug` -- Leverage Point Analysis

When something fails, the first question is not "what's wrong with the code?" -- it's "where is the highest leverage point to fix this?" The leverage hierarchy:

- **Plan assumptions** (highest leverage) -- the design was wrong; a code fix won't help
- **Prompt quality** -- the prompt was vague/wrong; the code did what it was told
- **Code bug** (lowest leverage) -- the prompt was right but the implementation had a bug

Four phases: classify the failure, investigate the root cause, form and test a hypothesis, generate a fix at the right leverage level. Logs patterns to `~/.conducty/history/failure-patterns.md` so `conducty-plan` can prevent the same failure tomorrow.

**Key concepts:** Leverage hierarchy, prompt forensics, systemic failure detection, failure pattern library, 3-retry circuit breaker.

### Supporting Skills (infrastructure)

These skills provide services to the cycle and discipline skills.

#### `conducty-context` -- Project Ingestion

Ingests an external project directory and produces a summary with bounded context analysis (DDD): module responsibilities, dependencies, interfaces, and seams. Captures characterization data (test coverage, known invariants, critical paths) so prompts can verify existing behavior before changing it.

Identifies frequently changed files (hot spots) and project conventions. The summary goes to `~/.conducty/context/` where `conducty-plan` uses it to write better prompts.

**Key concepts:** Bounded contexts, seams, characterization data, module interfaces, known invariants.

**When it runs:** "Load context from...", "refresh context", "ingest project".

#### `conducty-worktrees` -- Parallel Isolation

Uses git worktrees to isolate parallel prompts targeting the same repository. The tracer runs on the main branch (testing reality, not an isolated copy); only after it passes are worktrees created for remaining prompts. Merges happen only after `conducty-checkpoint` passes, using `--no-ff` so each prompt's work is visible.

**When it runs:** Before executing a group with multiple prompts targeting the same repo.

#### `conducty-dialectic` -- Multi-Persona Decision Analysis

Six archetypal personas (The Inverter, Skeptic, Abstractionist, Simplifier, Structuralist, Composer) debate a question through a structured protocol: grounding phase, trajectory setting, cohort construction with deliberate internal friction, position/rebuttal/synthesis rounds. Produces a "Design Truth" -- a synthesis that names what was traded away and why.

Optional specialist personas can be drafted when the core six lack domain depth. A Moderator drives the process without taking positions.

**When it runs:** "Think this through", "analyze this decision", "dialectic". Also invoked via the `decision.md` prompt template during planning.

## Recommended Path

### First Day: Get Oriented

1. **Read `conducty-system`** -- understand the philosophy, the cycle, and the ubiquitous language
2. **Run `conducty-context`** on your main project -- "Load context from /path/to/my/project"
3. **Run `conducty-plan`** with 2-3 small goals -- "Plan my day". Start with Low complexity goals to see the cycle without the full ceremony
4. **Execute manually** -- copy prompts from the plan into Cursor. Get a feel for the prompt structure, no-go zones, and verification steps
5. **Run `conducty-checkpoint`** on the group
6. **Run `conducty-review`** and `conducty-improve`

This gives you one full trip through the cycle. Don't use `conducty-execute` (automated subagents) on day one -- do it manually so you understand what's happening.

### First Week: Build the Muscle

- **Day 2-3:** Add Medium complexity goals. These trigger `conducty-shape`, which teaches you appetite-setting and no-go zones. Use `conducty-execute` for Low complexity prompts; keep doing Medium ones manually.
- **Day 3-4:** Start using `conducty-execute` for everything. Watch how the tracer-first approach catches bad plan assumptions early.
- **Day 4-5:** Review your `~/.conducty/history/improvements.md`. Are the experiments from `conducty-improve` actually changing your plans? If not, the improvement kata needs sharper questions.

### After the First Week: Calibrate

By now you have a week of data in `~/.conducty/history/metrics.md`. Look at:

- **First-attempt pass rate** -- if it's below 70%, your prompts have smells. Focus on the quality gate in `conducty-plan` Step 5e.
- **Most common failure pattern** -- read `failure-patterns.md`. Whatever appears most is your highest-leverage improvement.
- **Appetite accuracy** -- are you consistently over or under budget? Adjust your estimation.
- **Review level calibration** -- are verify-only prompts passing reliably? Are full-review prompts catching real issues? If not, adjust the thresholds.

### Advanced Usage

- **`conducty-dialectic`** for architectural decisions that have genuine trade-offs. Don't use it for simple choices -- it's designed for questions where reasonable people disagree.
- **`conducty-worktrees`** when you have 3+ parallel prompts targeting the same repo. The tracer-first strategy (tracer on main, worktrees for the rest) prevents the most common parallel conflict.
- **Custom prompt templates** -- if you find yourself repeating the same prompt structure for a type of work not covered by the five templates (feature, bugfix, refactor, test, decision), create a new template in `skills/conducty-plan/prompt-templates/`.

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
       └── conducty-review ──► conducty-improve ──► conducty-plan (tomorrow)
```

## Project Structure

```
conducty/
├── README.md
├── .cursor-plugin/
│   └── plugin.json              # Cursor plugin manifest
├── CLAUDE.md                    # Generated — rules for Claude Code
├── AGENTS.md                    # Generated — rules for other platforms
├── assets/
│   └── icon.png                 # Project icon
├── setup.sh                     # Legacy manual Cursor installer
├── install-{platform}.sh        # Platform-specific installers
├── scripts/
│   ├── validate-template.mjs
│   ├── generate-claude-md.sh
│   └── generate-agents-md.sh
├── skills/
│   ├── conducty-system/         # Entry point and philosophy
│   ├── conducty-shape/          # Appetite-driven design
│   ├── conducty-plan/           # Daily planning with templates
│   │   ├── daily-plan-template.md
│   │   └── prompt-templates/
│   ├── conducty-tdd/            # Test-driven development
│   ├── conducty-execute/        # Tracer-first execution
│   │   ├── implementer-prompt.md
│   │   ├── spec-reviewer-prompt.md
│   │   └── quality-reviewer-prompt.md
│   ├── conducty-verify/         # Evidence gate
│   ├── conducty-debug/          # Leverage point analysis
│   ├── conducty-checkpoint/     # Health-aware group gate
│   ├── conducty-review/         # End-of-day audit
│   ├── conducty-improve/        # Improvement kata
│   ├── conducty-context/        # Project ingestion
│   ├── conducty-worktrees/      # Parallel isolation
│   └── conducty-dialectic/      # Decision analysis
│       └── dialectic-protocol.md
└── rules/
    ├── conducty-workflow.mdc
    └── conducty-quality.mdc
```

### State Directory (`~/.conducty/`)

Created by the install scripts, used by skills at runtime:

```
~/.conducty/
├── plans/              # Daily plan files (YYYY-MM-DD.md)
├── designs/            # Design docs from conducty-shape
├── context/            # Project summaries from conducty-context
└── history/
    ├── prompt-log.md        # Prompt outcomes
    ├── failure-patterns.md  # Accumulated failure patterns
    ├── improvements.md      # Improvement kata notes
    └── metrics.md           # Health metrics over time
```

## Contributing

Conducty is open source. Contributions welcome — especially new prompt templates, failure pattern libraries, and platform integrations. If you change `skills/`, `rules/`, or plugin metadata, run `node scripts/validate-template.mjs` before opening a PR.

## License

MIT
