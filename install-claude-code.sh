#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
STATE_DIR="$HOME/.conducty"
CLAUDE_MD="$HOME/.claude/CLAUDE.md"

echo "Conducty — Installing for Claude Code"
echo ""

mkdir -p "$SKILLS_DIR"
mkdir -p "$STATE_DIR/plans"
mkdir -p "$STATE_DIR/history"
mkdir -p "$STATE_DIR/context"
mkdir -p "$STATE_DIR/designs"

for skill_dir in "$SCRIPT_DIR"/skills/conducty-*; do
    skill_name="$(basename "$skill_dir")"
    target="$SKILLS_DIR/$skill_name"

    if [ -L "$target" ]; then
        echo "  Updating symlink: $skill_name"
        rm "$target"
    elif [ -e "$target" ]; then
        echo "  Warning: $target exists and is not a symlink, skipping"
        continue
    else
        echo "  Installing: $skill_name"
    fi

    ln -sf "$skill_dir" "$target"
done

for hist_file in prompt-log failure-patterns improvements metrics; do
    if [ ! -f "$STATE_DIR/history/$hist_file.md" ]; then
        echo "# Conducty ${hist_file//-/ }" > "$STATE_DIR/history/$hist_file.md"
        echo "" >> "$STATE_DIR/history/$hist_file.md"
        echo "---" >> "$STATE_DIR/history/$hist_file.md"
        echo "" >> "$STATE_DIR/history/$hist_file.md"
        echo "  Created: ~/.conducty/history/$hist_file.md"
    fi
done

MARKER="# --- Conducty Rules ---"
if [ -f "$CLAUDE_MD" ] && grep -qF "$MARKER" "$CLAUDE_MD"; then
    echo "  Conducty section already exists in ~/.claude/CLAUDE.md, skipping"
else
    mkdir -p "$(dirname "$CLAUDE_MD")"
    {
        echo ""
        echo "$MARKER"
        echo ""
        sed -n '/^---$/,/^---$/!p' "$SCRIPT_DIR/rules/conducty-workflow.mdc" 2>/dev/null || true
        echo ""
        sed -n '/^---$/,/^---$/!p' "$SCRIPT_DIR/rules/conducty-quality.mdc" 2>/dev/null || true
        echo ""
        echo "# --- End Conducty Rules ---"
    } >> "$CLAUDE_MD"
    echo "  Appended Conducty rules to ~/.claude/CLAUDE.md"
fi

echo ""
echo "Done. Skills installed to $SKILLS_DIR"
echo "State directory at $STATE_DIR"
echo ""
echo "Available skills:"
for skill_dir in "$SKILLS_DIR"/conducty-*; do
    [ -e "$skill_dir" ] && echo "  - $(basename "$skill_dir")"
done
echo ""
echo "Restart Claude Code to pick up the changes."
