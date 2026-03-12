#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT="$REPO_DIR/CLAUDE.md"

strip_frontmatter() {
    local in_frontmatter=false
    local seen_open=false
    while IFS= read -r line; do
        if [ "$seen_open" = false ] && [ "$line" = "---" ]; then
            in_frontmatter=true
            seen_open=true
            continue
        fi
        if [ "$in_frontmatter" = true ] && [ "$line" = "---" ]; then
            in_frontmatter=false
            continue
        fi
        if [ "$in_frontmatter" = false ] && [ "$seen_open" = true ]; then
            printf '%s\n' "$line"
        fi
    done
}

cat > "$OUTPUT" << 'HEADER'
# Conducty

AI Workflow Orchestrator — systems-level orchestration of AI agents with daily-cadence planning, tracer-first execution, calibrated review, and continuous improvement.

## Skills

Conducty skills are installed alongside this file. Use your tool's native skill discovery to list and load them.

Available skills: `conducty-system`, `conducty-shape`, `conducty-plan`, `conducty-tdd`, `conducty-execute`, `conducty-verify`, `conducty-debug`, `conducty-checkpoint`, `conducty-review`, `conducty-improve`, `conducty-context`, `conducty-worktrees`, `conducty-dialectic`.

## State Directory

Conducty stores plans, history, context, and designs in `~/.conducty/`.

## Rules

The following rules apply to all Conducty workflows.

HEADER

for rule_file in "$REPO_DIR"/rules/*.mdc; do
    [ -f "$rule_file" ] || continue
    strip_frontmatter < "$rule_file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "Generated $OUTPUT"
