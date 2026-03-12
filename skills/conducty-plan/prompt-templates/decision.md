# Decision Prompt Template

Use when generating a prompt for architectural or design decisions.

## Structure

```markdown
- [ ] **P{N}**: [{project}] Decision: {short description}
  - **Type**: decision
  - **Prompt**:
    Analyze and recommend: {decision question} in {project}.

    **Appetite**: {time budget for this analysis}

    **Context**: {why this decision matters now}

    **Options under consideration**:
    - Option A: {description}
    - Option B: {description}
    - Option C: {description} (if applicable)

    **Evaluation criteria** (in priority order):
    1. {criterion 1 — e.g., maintainability}
    2. {criterion 2 — e.g., performance}
    3. {criterion 3 — e.g., team familiarity}

    **Constraints**:
    - {hard constraint 1}
    - {hard constraint 2}

    Use `conducty-dialectic` for structured multi-perspective analysis.

    **Deliverable**: A decision document at the design doc path with:
    - Recommended option and reasoning
    - What was traded away and why that's acceptable
    - Migration/implementation implications
    - Risks and mitigations

    **Report format**:
    - Status: DONE | NEEDS_CONTEXT
    - Recommended option with summary reasoning
    - Key trade-offs
  - **Directory**: /path/to/project
  - **Context**: {relevant architecture docs, existing code}
  - **Design**: ~/.conducty/designs/YYYY-MM-DD-{topic}.md (output location)
  - **Verification**: Decision document exists and addresses all evaluation criteria
  - **Expected outcome**: Written decision with clear recommendation
  - **Complexity**: Medium / High (decisions are never Low)
  - **Review level**: spec-review (verify all criteria addressed)
  - **Time budget**: {minutes}
```

## Guidelines

- Decisions are never Low complexity — they always get at least spec-review
- The evaluation criteria force structured analysis, not gut feelings
- `conducty-dialectic` is the recommended tool for substantive architectural decisions
- The deliverable is a written document, not a conversation — it persists for future reference
