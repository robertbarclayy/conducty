---
name: conducty-worktrees
description: Git worktree lifecycle for parallel prompt execution. Creates isolated worktrees per prompt, verifies baselines, merges after checkpoint, cleans up. Use when a parallelization group has 2+ prompts targeting the same repo, or the user says "worktree", "isolate", "parallel branches".
aliases:
  - conducty-worktrees
  - worktrees
tags:
  - conducty/skill
  - conducty/execute
  - conducty/git
---

# Conducty Worktrees — Parallel Isolation

Use git worktrees (Bash) to isolate parallel prompts that target the same repository, preventing conflicts during concurrent execution.

## When to Use

Use worktrees when a parallelization group has **two or more prompts targeting the same repository**. If all prompts in a group target different repos, worktrees are unnecessary.

> [!tip] Claude Code shortcut
> When dispatching a subagent via the Task tool, pass `isolation: "worktree"` to let the harness create and clean up a temporary worktree automatically. Use this skill when you need explicit, named worktrees that survive across multiple subagent dispatches in the same group.

## Tracer Worktree Strategy

The tracer prompt (marked `★ TRACER`) runs on the **main branch**, not in a worktree. It validates plan assumptions against the real repo state. Only after the tracer passes do you create worktrees for the remaining prompts.

This ensures the tracer tests reality, not an isolated copy.

## Workflow

### Step 1: Wait for Tracer

The tracer prompt executes first on the main branch (via [[conducty-execute]]). If it passes, proceed. If it fails, the plan needs revision — don't create worktrees for a flawed plan.

### Step 2: Create Worktrees

For each remaining prompt that targets the same repo:

```bash
cd /path/to/project
git worktree add ../conducty-wt-P{N} -b conducty/P{N}
```

This creates:
- A sibling directory `conducty-wt-P{N}` with a full working copy
- A branch `conducty/P{N}` tracking the current HEAD (which now includes the tracer's commits)

Update each prompt's **Directory** field in the plan to point to the worktree path (Edit tool).

### Step 3: Verify Baselines

For each worktree, run the project's test suite or build command (Bash):

```bash
cd ../conducty-wt-P{N}
# run project-specific test/build command
```

If the baseline fails, the worktree inherits a broken state — flag this before execution begins. A broken baseline wastes the entire prompt.

### Step 4: Execute

Prompts execute in parallel, each in its own worktree directory. No action needed from this skill during execution.

### Step 5: Merge After Checkpoint

After [[conducty-checkpoint]] passes for the group, merge each worktree branch back:

```bash
cd /path/to/project
git merge conducty/P{N} --no-ff -m "conducty: merge P{N} — {short description}"
```

Merge in order of least-dependent to most-dependent when possible.

If there are merge conflicts:
1. Report the conflict to the user
2. Suggest resolving in dependency order
3. After resolution, re-run the verification command from the affected prompt

### Step 6: Clean Up

After all branches are merged (or blocked prompts noted):

```bash
cd /path/to/project
git worktree remove ../conducty-wt-P{N}
git branch -d conducty/P{N}
```

## Guidelines

- Only create worktrees for prompts sharing a repo within the same group
- Use `--no-ff` merges so each prompt's work is visible as a distinct merge commit
- Blocked prompts: clean up worktree but keep the branch for reference
- Worktree paths should be siblings of the project directory, not nested inside
- Always verify baseline before execution — a broken baseline wastes a prompt slot
- This skill pairs with [[conducty-checkpoint]] — always run checkpoint before merging
