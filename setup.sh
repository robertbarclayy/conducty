#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.cursor/skills"
STATE_DIR="$HOME/.conducty"

echo "Conducty — Installing skills and creating state directories"
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

if [ ! -f "$STATE_DIR/history/prompt-log.md" ]; then
    cat > "$STATE_DIR/history/prompt-log.md" << 'EOF'
# Conducty Prompt Log

Append-only log of prompts executed and their outcomes.
Each day's entries are added by the conducty-review skill.

---

EOF
    echo "  Created: ~/.conducty/history/prompt-log.md"
fi

if [ ! -f "$STATE_DIR/history/failure-patterns.md" ]; then
    cat > "$STATE_DIR/history/failure-patterns.md" << 'EOF'
# Conducty Failure Patterns

Accumulated failure patterns from debugging. Read by conducty-plan and
conducty-improve to prevent repeat failures.

---

EOF
    echo "  Created: ~/.conducty/history/failure-patterns.md"
fi

if [ ! -f "$STATE_DIR/history/improvements.md" ]; then
    cat > "$STATE_DIR/history/improvements.md" << 'EOF'
# Conducty Improvement Log

Daily improvement kata notes. Each entry records target vs. actual,
obstacles, and experiments for tomorrow.

---

EOF
    echo "  Created: ~/.conducty/history/improvements.md"
fi

if [ ! -f "$STATE_DIR/history/metrics.md" ]; then
    cat > "$STATE_DIR/history/metrics.md" << 'EOF'
# Conducty Health Metrics

Daily velocity and health metrics. Tracks pass rates, retries, appetite
usage over time.

---

EOF
    echo "  Created: ~/.conducty/history/metrics.md"
fi

RULES_DIR="$HOME/.cursor/rules"
mkdir -p "$RULES_DIR"

for rule_file in "$SCRIPT_DIR"/rules/*.mdc; do
    rule_name="$(basename "$rule_file")"
    target="$RULES_DIR/$rule_name"

    if [ -L "$target" ]; then
        echo "  Updating rule symlink: $rule_name"
        rm "$target"
    elif [ -e "$target" ]; then
        echo "  Warning: $target exists and is not a symlink, skipping"
        continue
    else
        echo "  Installing rule: $rule_name"
    fi

    ln -sf "$rule_file" "$target"
done

echo ""
echo "Done. Skills installed to $SKILLS_DIR"
echo "Rules installed to $RULES_DIR"
echo "State directory at $STATE_DIR"
echo ""
echo "Available skills:"
for skill_dir in "$SKILLS_DIR"/conducty-*; do
    [ -e "$skill_dir" ] && echo "  - $(basename "$skill_dir")"
done

echo ""
echo "Installed rules:"
for rule_file in "$RULES_DIR"/conducty-*.mdc; do
    [ -e "$rule_file" ] && echo "  - $(basename "$rule_file")"
done
