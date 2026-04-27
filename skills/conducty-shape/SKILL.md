---
name: conducty-shape
description: Defines appetite, scope, no-go zones, and design before any prompts are written. Use when a goal is Medium or High complexity, requirements are unclear, scope needs bounding, or the user says "shape", "design", "brainstorm", "think through".
aliases:
  - conducty-shape
  - shape
tags:
  - conducty/skill
  - conducty/shape
---

# Conducty Shape — Appetite, Boundaries, Design

Turn unclear or complex goals into bounded, executable designs. Shaping answers three questions before any prompt is written: How much is this worth? What's in scope? What's explicitly out?

This is not brainstorming in the open-ended sense. Shaping is opinionated — you propose boundaries, cut rabbit holes, and produce a design that fits the declared appetite. The output is a design doc that [[conducty-plan]] can decompose into prompts.

> [!warning] Hard gate
> Do NOT generate prompts for a non-trivial goal until you have presented a design with appetite, scope, and no-go zones, and the user has approved it.

## When to Use

**Mandatory (invoked by [[conducty-plan]]):**
- Goal is Medium or High complexity
- Goal spans multiple subsystems or projects
- Goal requirements are ambiguous or underspecified

**Optional (user-triggered):**
- User says "shape", "design", "brainstorm", "think through"
- User wants to explore approaches before committing

**Skip when:**
- Goal is Low complexity with clear requirements and obvious implementation
- Goal is a straightforward bugfix with known root cause
- Goal is a mechanical refactor with a clear before/after

## The Shaping Process

### Step 1: Set the Appetite

Before asking what to build, ask what it's worth.

> "How much time should we spend on this? An hour? Half a day? A full day?"

The appetite is a hard constraint, not an estimate. If the design can't fit the appetite, cut scope — don't extend time. This prevents unbounded exploration and forces prioritization decisions early.

If the user hasn't thought about appetite, help them: "This feels like a half-day effort based on what you've described. Does that match your expectation?"

### Step 2: Understand the Goal

Ask questions one at a time to understand what the user wants:
- **Prefer multiple-choice questions** — faster to answer, forces you to have a hypothesis
- **One question per message** — don't overwhelm
- **Check the project context note first** (`[[Context {Project}]]` in the vault — see [[conducty-obsidian]]) before asking questions the context already answers
- Focus on: purpose, constraints, what "done" looks like, who benefits

Keep it tight. You have the appetite as a constraint — don't spend 30 minutes of questions on a 2-hour task.

### Step 3: Scope Check and Decomposition

Before designing, assess scale:
- If the goal describes multiple independent subsystems, flag this immediately
- Help decompose into sub-goals: what are the independent pieces, what order should they be built?
- Each sub-goal gets its own shaping cycle
- A goal that can't be decomposed to fit the appetite is too big

### Step 4: Breadboard the Solution

Define the key components and how they connect — not wireframes, not full specs, just the essential shape:
- What are the main pieces?
- How do they connect?
- What are the critical interactions?
- What existing code is involved?

Think of this as a fat marker sketch — detailed enough to execute, abstract enough to leave room for the implementer to make tactical decisions.

### Step 5: Identify Rabbit Holes and No-Go Zones

This is what separates shaping from open-ended brainstorming.

**Rabbit holes** — areas that could consume disproportionate time:
- Identify them explicitly
- For each: time-box it ("spend max 30 min on this") or cut it ("use the simple approach, don't optimize")
- If a rabbit hole is essential and can't be time-boxed, the appetite is wrong — renegotiate

**No-go zones** — what is explicitly OUT of scope:
- Write these down as carefully as what's IN scope
- "We are NOT building X" / "We will NOT handle Y in this round"
- No-go zones prevent scope creep during execution

### Step 6: Propose Approaches

Present 2-3 approaches with trade-offs:
- Lead with your recommendation and explain why
- Frame trade-offs in terms of the appetite: "Approach A fits the appetite. Approach B is better but needs another half-day."
- Keep it conversational — this is a planning discussion, not a formal document

### Step 7: Present the Design

Once the approach is chosen, present the design:
- Scale each section to its complexity — a paragraph for simple parts, more detail for complex parts
- Ask after each section: "Does this look right so far?"
- Be ready to revise

**Design for isolation and clarity:**
- Break into units with one clear purpose each
- Well-defined interfaces between units
- Each unit should be testable and understandable independently
- Smaller units are easier for agents to implement reliably — a file that can be held in context produces better results than one that can't

**Working in existing codebases:**
- Explore the current structure (use Glob/Grep) before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work, include targeted improvements as part of the design
- Don't propose unrelated refactoring. Stay focused on what serves the current goal.
- Identify characterization needs: which existing behavior must be verified before changes begin?

### Step 8: Save the Design Note

Write the approved design to the vault as `Design YYYY-MM-DD HHmm {Topic Title Case}.md` (see [[conducty-obsidian]] for full conventions). The timestamp matches the plan that will consume the design.

```markdown
---
type: design
date: YYYY-MM-DD
time: HHmm
topic: {Topic Title Case}
project: {project-name}
appetite: {time budget}
tags: [conducty, conducty/design]
---

# Design: {Topic}

**Goal**: {one-sentence goal}

## Approach
{chosen approach and why}

## Components
{what gets built/changed, with file paths where known}

## Acceptance Criteria
- {criterion 1 — concrete and verifiable}
- {criterion 2}

## No-Go Zones
- {what is explicitly out of scope}
- {what we are deferring}

## Rabbit Holes
- {area of risk} — {mitigation: time-box or cut}

## Characterization Needs
- {existing behavior to verify before changing}

## Trade-offs
- Chose: {what we chose}
- Traded away: {what we gave up and why that's acceptable}

## Testing Strategy
{how to verify the whole thing works}

## Related

- Index: [[Designs Index]]
- Project: [[Context {Project}]]
- Consumed by: [[Plan YYYY-MM-DD HHmm {Topic}]]
```

Then prepend the new design's wikilink to `[[Designs Index]]` (Edit, not Write).

### Step 9: Return to Planning

Hand control back to [[conducty-plan]] with:
- The design note wikilink (e.g. `[[Design 2026-04-27 0930 Auth Cleanup]]`)
- The acceptance criteria (become prompt verification steps)
- The components list (become individual prompts)
- Suggested decomposition: which components are parallel vs. sequential
- The appetite (constrains prompt count and time budgets)
- The no-go zones (included in each prompt to prevent scope creep)

## Core Principles

### Fixed time, variable scope
*Shape Up (Singer)* — The appetite is a circuit breaker. When the design doesn't fit, cut scope — never extend time. Half-finished prompts all need rework.

### The boundaries ARE the design
*Shape Up (Singer)* — What you exclude determines the shape more than what you include. Write no-go zones first, then scope what remains.

### One bet per question
*The Pragmatic Programmer (Hunt & Thomas)* — Every question should carry a hypothesis. Prefer multiple choice. One per message. Exhaust what you know before asking what you don't.

### Rabbit holes are budget items, not risks
*Shape Up (Singer)* — Time-box it or cut it. A rabbit hole without one of those is an unbounded liability in the plan.

### Fat marker over fine tip
*Shape Up (Singer)* — Design at components, interfaces, and data flow. Finer than that and the agent fights you when reality diverges. Vaguer and the agent invents scope.

### Separate what changes from what doesn't
*Working Effectively with Legacy Code (Feathers)* — Find the seam before you cut. Characterization needs go into the design doc before components do.

### Decompose until each piece fits one prompt
*A Philosophy of Software Design (Ousterhout)* — If a component can't be one prompt with clear criteria, file paths, and a verification command, it's too big. Split it.

### Trade-offs are named, not buried
*Designing Data-Intensive Applications (Kleppmann)* — "We chose X over Y because Z." A design that claims no trade-offs hasn't been examined.

### Kill your darlings early
*The Mythical Man-Month (Brooks)* — The most valuable shaping output is often the feature you decided NOT to build. Shaping is cheap. Execution is expensive.
