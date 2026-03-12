#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_DIR="$HOME/.conducty"

echo "Conducty — Installing for GitHub Copilot"
echo ""

mkdir -p "$STATE_DIR/plans"
mkdir -p "$STATE_DIR/history"
mkdir -p "$STATE_DIR/context"
mkdir -p "$STATE_DIR/designs"

for hist_file in prompt-log failure-patterns improvements metrics; do
    if [ ! -f "$STATE_DIR/history/$hist_file.md" ]; then
        echo "# Conducty ${hist_file//-/ }" > "$STATE_DIR/history/$hist_file.md"
        echo "" >> "$STATE_DIR/history/$hist_file.md"
        echo "---" >> "$STATE_DIR/history/$hist_file.md"
        echo "" >> "$STATE_DIR/history/$hist_file.md"
        echo "  Created: ~/.conducty/history/$hist_file.md"
    fi
done

echo "State directory at $STATE_DIR"
echo ""

echo "GitHub Copilot reads instructions from project-level files only."
echo "You need to add Conducty to each project where you want it active."
echo ""
echo "For each project, run ONE of the following:"
echo ""
echo "  Option A — Symlink AGENTS.md (recommended, stays in sync):"
echo "    ln -sf $SCRIPT_DIR/AGENTS.md /path/to/your/project/AGENTS.md"
echo ""
echo "  Option B — Copy AGENTS.md (standalone, won't auto-update):"
echo "    cp $SCRIPT_DIR/AGENTS.md /path/to/your/project/AGENTS.md"
echo ""
echo "  Option C — Copilot-specific instructions file:"
echo "    mkdir -p /path/to/your/project/.github"
echo "    cp $SCRIPT_DIR/AGENTS.md /path/to/your/project/.github/copilot-instructions.md"
echo ""

AGENTS_MD="$SCRIPT_DIR/AGENTS.md"
if [ ! -f "$AGENTS_MD" ]; then
    echo "Warning: AGENTS.md not found in repo root."
    echo "Run scripts/generate-agents-md.sh first to generate it."
fi

echo ""
echo "After adding AGENTS.md to your project, Copilot will pick up"
echo "Conducty's workflow rules and quality gates automatically."
echo ""
echo "For skills, Copilot uses AGENTS.md to understand available"
echo "workflows. Reference skills by name in your prompts:"
echo '  "Use the conducty-plan skill to plan my day"'
echo '  "Run conducty-checkpoint on this group"'
