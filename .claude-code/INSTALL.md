# Installing Conducty for Claude Code

## Prerequisites

- [Claude Code](https://code.claude.com/) installed
- Git

## Quick Install

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
cd ~/conducty
chmod +x install-claude-code.sh
./install-claude-code.sh
```

This will:
1. Symlink all `conducty-*` skills to `~/.claude/skills/`
2. Append Conducty workflow and quality rules to `~/.claude/CLAUDE.md`
3. Create the `~/.conducty/` state directory

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

### 3. Add rules to CLAUDE.md

Copy the contents of the repo's `CLAUDE.md` and append them to `~/.claude/CLAUDE.md`:

```bash
cat ~/conducty/CLAUDE.md >> ~/.claude/CLAUDE.md
```

Or generate fresh from the `.mdc` source rules:

```bash
cd ~/conducty && ./scripts/generate-claude-md.sh
cat CLAUDE.md >> ~/.claude/CLAUDE.md
```

### 4. Create state directories

```bash
mkdir -p ~/.conducty/{plans,history,context,designs}
```

### 5. Restart Claude Code

Restart Claude Code to discover the newly installed skills.

## Usage

Claude Code discovers skills from `~/.claude/skills/` automatically. Use them by name:

- "Plan my day" -- triggers `conducty-plan`
- "Load context from /path/to/project" -- triggers `conducty-context`
- "Checkpoint" -- triggers `conducty-checkpoint`

## Updating

```bash
cd ~/conducty && git pull
```

Skills update instantly through the symlinks. To refresh rules in `~/.claude/CLAUDE.md`, re-run the install script.

## Uninstalling

```bash
# Remove skill symlinks
rm -f ~/.claude/skills/conducty-*

# Remove Conducty section from CLAUDE.md (between the marker lines)
# Edit ~/.claude/CLAUDE.md and remove everything between:
#   # --- Conducty Rules ---
#   # --- End Conducty Rules ---
```
