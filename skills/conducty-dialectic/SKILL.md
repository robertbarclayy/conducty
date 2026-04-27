---
name: conducty-dialectic
description: Multi-persona decision analysis through structured dialectic. Six software-engineering archetypes debate a question to uncover the Design Truth. Use when the user says "analyze this decision", "dialectic", "decision analysis", "think this through", "debate this", or faces an architectural/design choice.
aliases:
  - conducty-dialectic
  - dialectic
tags:
  - conducty/skill
  - conducty/dialectic
  - conducty/decision
---

# Conducty Dialectic — Decision Analysis

Facilitate a structured multi-perspective debate to analyze decisions, architectural trade-offs, and design questions. Six archetypal personas interpret the question from different angles, form cohorts with internal friction, and debate toward a unified Design Truth.

## The Panel

| Persona | Core Lens | Signature Question |
|---------|-----------|-------------------|
| **The Inverter** | Relational reasoning, bidirectionality, constraints | "Can we solve this backwards?" |
| **The Skeptic** | Failure modes, causal lineage, resilience | "Where does the lineage break?" |
| **The Abstractionist** | Metalinguistic abstraction, evolvability | "What language are we failing to build?" |
| **The Simplifier** | De-complecting, immutability, data-orientation | "What's the complecting factor here?" |
| **The Structuralist** | Symmetry, recursion, duality, patterns | "Where does the system stop seeing itself?" |
| **The Composer** | Composability, precise naming, vocabulary growth | "What word of power are we missing?" |

A **Moderator** drives the process: they don't take positions but facilitate, steer, and intervene on the user's behalf.

### Persona Fidelity

- **Do not caricature**: Each persona has a gravitational center, not a cage. The Inverter cares about semantics broadly, not just reversibility.
- **Channel the mindset**: When a Core Drive doesn't fit, fall back to the persona's broader intellectual style.
- **Conservative deviation**: Try the Core Drives first. Only abandon them if they force a contrived take.

See [[dialectic-protocol]] for full persona profiles.

## Workflow

### Step 1: Read the Full Protocol

Read [[dialectic-protocol]] for the complete persona profiles, debate rules, and output contract. Follow it precisely.

### Step 2: Grounding Phase

This is **always the first output**. Do not skip it.

1. **Readings**: All six personas state in one sentence what they understand the question to be. Present these together.
2. **Inquiry** (optional): If readings diverge or the request is ambiguous, personas may ask clarifying questions (max 2 each). Revise readings after.
3. **Value Constraints**: The Moderator proposes the depth/disposition of the investigation (e.g., "minimal effort", "follow the rabbit hole", "challenge the premise"). User confirms.
4. **Grounding Statement**: The Moderator synthesizes into a 2-4 sentence shared reference. User confirms before proceeding.

### Step 3: Trajectory Setting

The Moderator selects a trajectory (Invention / Ideation / Exploration / Diagnostics / Convergence / etc.) and corresponding output bias. User confirms.

### Step 4: Cohort Construction

1. Identify **2-4 tension axes** — genuine trade-offs where personas diverge on this topic.
2. Partition all six personas into **2-3 cohorts**, each straddling at least one tension axis. Internal friction is the goal.
3. Justify the partition. If a cohort has a blind spot, it may draft a **Specialist** (see protocol).

### Step 5: Debate

1. **Discovery** (optional): Only if an Expert Witness was drafted. Cohorts pose questions.
2. **Position**: Each cohort deliberates internally, then presents its joint position.
3. **Rebuttal**: Cohorts critique each other. If positions are irreconcilable, the Moderator may draft a **Designated Challenger**.
4. **Synthesis**: Unify into the Design Truth. Name what was traded away and why.

Use **Round Digests** (one sentence per speaker) for intermediate rounds. Render only final positions in full. The Moderator calls for convergence when no new substantive objection is raised.

### Step 6: Output

Follow the Output Contract from the protocol:
- Grounding Statement first (confirmed by user)
- Trajectory and output bias before the debate
- Tension axes and cohort justification before debate rounds
- Specialist profiles before the phase in which they first speak
- A representative from the most influential cohort summarizes at the end
- Name the **Wrong Turn** only if one occurred
- Include a **Whiteboard Sketch** only when it adds clarity

### Step 7: Log Outcome (Optional)

If a Conducty plan note is active in the vault, update the relevant prompt's status there. Prepend the decision summary and key trade-offs to `[[Prompt Log]]` (the accumulating note — see [[conducty-obsidian]]). If the decision warrants a design note, write `Designs/Design YYYY-MM-DD HHmm {Topic}.md` and link it from the plan.

## Guidelines

- The dialectic is the product — do not shortcut to a conclusion
- Every persona speaks in every phase (via cohorts)
- The Moderator is neutral and procedural; they never argue a position
- Specialists are optional and rare; do not draft them unless a genuine gap exists
- Value constraints and trajectory can be renegotiated mid-debate with user consent
- Keep Round Digests to one sentence per speaker; render only final positions in full
