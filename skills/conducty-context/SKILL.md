---
name: conducty-context
description: Load and summarize context from an external project directory into Conducty's state. Creates a project summary with bounded context analysis, characterization data, and key interfaces for use during batch planning. Use when the user says "load context", "refresh context", "ingest project", or provides a directory path to analyze.
---

# Conducty Context — Project Ingestion with Bounded Context Analysis

Ingest an external project directory and produce a summary that enables high-quality prompt generation. Goes beyond file listing to identify bounded contexts, module interfaces, characterization data, and the seams where Conducty's prompts will interact with existing code.

## Workflow

### Step 1: Identify the Target

The user provides a directory path. Resolve to absolute path. Extract project name from the directory basename.

### Step 2: Read Project Identity

Read these files if they exist (skip any that don't):

- `README.md` or `README`
- `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`, `pom.xml`
- `docker-compose.yml`, `Dockerfile`

### Step 3: Read Conventions and Rules

- `.cursor/rules/*.mdc` — Cursor rules reveal coding conventions
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` — agent instruction files
- `.editorconfig`, `tsconfig.json`, `.eslintrc*`, `prettier*` — style/lint configs

### Step 4: Map Architecture and Bounded Contexts

**Directory structure:** List `src/` or `lib/` two levels deep.

**Bounded context analysis** (from Domain-Driven Design):
- Identify the main modules or packages
- For each: what is its responsibility? What does it depend on? What depends on it?
- Map the interfaces between modules: how do they communicate?
- Identify the seams: where can behavior be changed without modifying everything?

This analysis helps `conducty-plan` decompose goals into prompts that respect module boundaries, and helps `conducty-shape` identify no-go zones.

### Step 5: Gather Characterization Data

**Test coverage:**
- Run the project's test command if identifiable (note: don't modify anything)
- Record: number of tests, pass/fail, approximate coverage
- If tests can't be run, note the test command for future use

**Known invariants:**
- Public API surfaces
- Database schemas
- Configuration contracts
- Anything that MUST NOT change without explicit intent

**Critical paths:**
- Which code paths handle the most important user-facing behavior?
- Which files change most frequently? (`git log --format='%H' -- . | head -50` + `git diff-tree --no-commit-id --name-only -r` on recent commits)

### Step 6: Check Recent Activity

- `git log --oneline -20` — last 20 commits
- `git diff --stat HEAD~5` — recent file changes
- `git branch -a` — active branches
- Any TODO/FIXME markers in recent changes

### Step 7: Generate the Summary

Write to `~/.conducty/context/{project-name}.md`:

```markdown
# Context: {project-name}

**Path**: /absolute/path/to/project
**Last refreshed**: YYYY-MM-DD HH:MM

## Tech Stack
- Language: ...
- Framework: ...
- Key dependencies: ...

## Architecture Overview
- Brief description of project structure
- Key directories and what they contain

## Bounded Contexts
| Module | Responsibility | Depends On | Depended By |
|--------|---------------|------------|-------------|
| {module} | {what it does} | {imports} | {who imports it} |

## Key Interfaces
- {module A} ↔ {module B}: {how they communicate}
- {public API surface}: {contract description}

## Characterization Data
- **Test command**: `{command}`
- **Test count**: {N} tests, {N} passing
- **Known invariants**: {list}
- **Critical paths**: {list of important code paths}

## Seams
- {places where behavior can be changed with minimal blast radius}

## Conventions
- {coding style rules from configs/rules}
- {naming conventions}
- {file organization patterns}

## Recent Changes (last 20 commits)
- {commit summaries}

## Active Branches
- {branch list}

## Frequently Changed Files
- {files that change most often — likely hot spots}

## Notes
- {TODO/FIXME patterns}
- {open work in progress}
- {anything that would surprise someone new to the codebase}
```

### Step 8: Confirm

Tell the user the context was saved. Show a brief summary highlighting:
- Bounded contexts identified
- Key seams for prompt decomposition
- Any characterization concerns (tests failing, missing coverage)
- If this is a refresh, note what changed since last load

## Guidelines

- Keep summaries under 250 lines — they need to fit alongside other projects in context
- **Bounded contexts and seams are the most valuable output** — they directly inform prompt decomposition
- Characterization data prevents prompts from breaking things they didn't intend to change
- Don't include file contents verbatim unless they're short config files
- If the project is very large, prioritize the main source directory and public interfaces
- Always include the absolute path so prompts reference the correct directory
- Flag any surprises (failing tests, no tests, circular dependencies) prominently
