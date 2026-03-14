# Installing Conducty for GitHub Copilot

> WIP: This platform integration is not finalized yet. Conducty is currently focused on the Cursor plugin flow, so GitHub Copilot instructions may change and may lag behind the Cursor setup.

## Prerequisites

- GitHub Copilot with coding agent enabled
- Git

## Quick Install

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
cd ~/conducty
chmod +x install-copilot.sh
./install-copilot.sh
```

This creates the `~/.conducty/` state directory and prints instructions for adding Conducty to your projects.

## How It Works

Unlike Cursor, Claude Code, OpenCode, and Codex, GitHub Copilot does **not** have a global skills directory. It reads instructions from project-level files:

- `AGENTS.md` in your project root
- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`

You need to add Conducty's instruction file to each project where you want it active.

## Per-Project Setup

### Option A: Symlink AGENTS.md (recommended)

Stays in sync when you update the Conducty repo:

```bash
ln -sf ~/conducty/AGENTS.md /path/to/your/project/AGENTS.md
```

### Option B: Copy AGENTS.md

Standalone copy that won't auto-update:

```bash
cp ~/conducty/AGENTS.md /path/to/your/project/AGENTS.md
```

### Option C: Copilot-specific instructions file

If your project already has an `AGENTS.md` for another tool:

```bash
mkdir -p /path/to/your/project/.github
cp ~/conducty/AGENTS.md /path/to/your/project/.github/copilot-instructions.md
```

## Create State Directories

```bash
mkdir -p ~/.conducty/{plans,history,context,designs}
```

## Usage

Once `AGENTS.md` is in your project, Copilot picks up Conducty's workflow rules and quality gates automatically. Reference skills by name:

- "Plan my day using conducty-plan"
- "Run conducty-checkpoint on this group"
- "Use conducty-debug to investigate this failure"

Copilot reads `AGENTS.md` at the start of each session. No restart needed after adding the file.

## Updating

```bash
cd ~/conducty && git pull
```

If you used Option A (symlink), the project picks up changes immediately. For Options B/C, re-copy the file after pulling.

## Regenerating AGENTS.md

If you've modified the `.mdc` rules and want to regenerate:

```bash
cd ~/conducty
./scripts/generate-agents-md.sh
```

Then re-copy to your projects if not using symlinks.

## Uninstalling

Remove the `AGENTS.md` or `.github/copilot-instructions.md` file from your project.
