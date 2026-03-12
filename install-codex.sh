#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.agents/skills"
STATE_DIR="$HOME/.conducty"

echo "Conducty — Installing for Codex"
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

echo ""
echo "Done. Skills installed to $SKILLS_DIR"
echo "State directory at $STATE_DIR"
echo ""
echo "Available skills:"
for skill_dir in "$SKILLS_DIR"/conducty-*; do
    [ -e "$skill_dir" ] && echo "  - $(basename "$skill_dir")"
done
echo ""
echo "Codex discovers skills from ~/.agents/skills/ automatically."
echo "Restart Codex to pick up the changes."
