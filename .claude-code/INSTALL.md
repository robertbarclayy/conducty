---
aliases:
  - claude-code-install
tags:
  - conducty/install
  - conducty/claude-code
---

# Installing Conducty for Claude Code

## Prerequisites

- [Claude Code](https://code.claude.com/) installed
- Git

## Quick Install

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
cd ~/conducty
# Optional — defaults to ~/Obsidian/Conducty
export CONDUCTY_VAULT="$HOME/Obsidian/Conducty"
chmod +x install-claude-code.sh
./install-claude-code.sh
```

This will:
1. Symlink all `conducty-*` skills to `~/.claude/skills/`
2. Append Conducty workflow and quality rules to `~/.claude/CLAUDE.md`
3. Create the Obsidian vault at `$CONDUCTY_VAULT` (default `~/Obsidian/Conducty/`) and seed it with index notes (`Conducty Index`, `Plans Index`, `Designs Index`, `Context Index`, `Improvements Index`) and accumulating notes (`Failure Patterns`, `Metrics`, `Prompt Log`)

## Manual Install

### 1. Clone the repo

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
```

### 2. Symlink skills

```bash
mkdir -p ~/.claude/skills
for skill in ~/conducty/skills/conducty-*; do
    ln -sf "$skill" ~/.claude/skills/"$(basename "$skill")"
done
```

### 3. Add rules to ~/.claude/CLAUDE.md

The repo root `CLAUDE.md` already contains the rules. Append it to your global Claude Code config:

```bash
cat ~/conducty/CLAUDE.md >> ~/.claude/CLAUDE.md
```

Or run the install script, which strips the rule frontmatter and appends just the rule bodies between marker comments (so it can be cleanly removed later).

### 4. Create the vault

```bash
VAULT="${CONDUCTY_VAULT:-$HOME/Obsidian/Conducty}"
mkdir -p "$VAULT"
# (optional) seed indexes — the install script does this; or open the vault
# in Obsidian and let [[conducty-obsidian]] create them lazily on first write.
```

### 5. Restart Claude Code

Restart Claude Code to discover the newly installed skills.

## Usage

Claude Code discovers skills from `~/.claude/skills/` automatically. They trigger from natural-language phrases described in each skill's frontmatter:

- "Plan this work" → [[conducty-plan]]
- "Load context from /path/to/project" → [[conducty-context]]
- "Checkpoint" → [[conducty-checkpoint]]
- "What is Conducty?" → [[conducty-system]]

## Updating

```bash
cd ~/conducty && git pull
```

Skills update instantly through the symlinks. To refresh rules in `~/.claude/CLAUDE.md`, remove the section between the marker comments and re-run `install-claude-code.sh`.

## Uninstalling

```bash
# Remove skill symlinks
rm -f ~/.claude/skills/conducty-*

# Remove Conducty section from CLAUDE.md (between the marker lines):
#   # --- Conducty Rules ---
#   # --- End Conducty Rules ---
```
