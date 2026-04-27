#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
CLAUDE_MD="$HOME/.claude/CLAUDE.md"
VAULT="${CONDUCTY_VAULT:-$HOME/Obsidian/Conducty}"

echo "Conducty — Installing for Claude Code"
echo "Vault root: $VAULT"
echo ""

mkdir -p "$SKILLS_DIR"
mkdir -p "$VAULT"
mkdir -p "$VAULT/Indexes"
mkdir -p "$VAULT/Accumulators"
mkdir -p "$VAULT/Plans"
mkdir -p "$VAULT/Designs"
mkdir -p "$VAULT/Improvements"
mkdir -p "$VAULT/Code Reviews"
mkdir -p "$VAULT/Ship Reports"
mkdir -p "$VAULT/Context"

# 1. Symlink skills
for skill_dir in "$SCRIPT_DIR"/skills/conducty-*; do
    skill_name="$(basename "$skill_dir")"
    target="$SKILLS_DIR/$skill_name"

    if [ -L "$target" ]; then
        echo "  Updating skill symlink: $skill_name"
        rm "$target"
    elif [ -e "$target" ]; then
        echo "  Warning: $target exists and is not a symlink, skipping"
        continue
    else
        echo "  Installing skill: $skill_name"
    fi

    ln -sf "$skill_dir" "$target"
done

# 2. Seed vault index notes
# Conducty Index lives at the vault root; all other indexes live under Indexes/.
seed_root_index() {
    local file="$VAULT/Conducty Index.md"
    if [ -f "$file" ]; then
        return
    fi
    cat > "$file" << 'EOF'
---
type: index
tags: [conducty, conducty/index, conducty/root]
---

# Conducty Index

The Conducty cycle: Shape → Plan → Trace → Execute → Verify → Improve.

## Indexes

- [[Plans Index]]
- [[Designs Index]]
- [[Context Index]]
- [[Improvements Index]]

## Accumulating

- [[Failure Patterns]]
- [[Metrics]]
- [[Prompt Log]]
EOF
    echo "  Created vault root index: Conducty Index.md"
}

seed_index() {
    local name="$1"
    local title="$2"
    local description="$3"
    local file="$VAULT/Indexes/$name.md"
    if [ -f "$file" ]; then
        return
    fi
    cat > "$file" << EOF
---
type: index
tags: [conducty, conducty/index]
---

# $title

$description

EOF
    echo "  Created vault index: Indexes/$name.md"
}

seed_root_index

seed_index "Plans Index" "Plans Index" \
    "Conducty plans. Newest first."

seed_index "Designs Index" "Designs Index" \
    "Conducty design notes. Newest first."

seed_index "Context Index" "Context Index" \
    "Per-project context summaries from [[conducty-context]]."

seed_index "Improvements Index" "Improvements Index" \
    "Conducty improvement kata entries. Newest first."

# 3. Seed accumulating notes (under Accumulators/)
seed_accumulating() {
    local name="$1"
    local title="$2"
    local description="$3"
    local type_tag="$4"
    local file="$VAULT/Accumulators/$name.md"
    if [ -f "$file" ]; then
        return
    fi
    cat > "$file" << EOF
---
type: $type_tag
tags: [conducty, conducty/$type_tag]
---

# $title

$description

EOF
    echo "  Created vault accumulator: Accumulators/$name.md"
}

seed_accumulating "Failure Patterns" "Failure Patterns" \
    "Accumulating failure-pattern entries from [[conducty-debug]] and [[conducty-review]]. Newest first." \
    "failure-patterns"

seed_accumulating "Metrics" "Metrics" \
    "One row per finished plan: prompts, completed, pass rate, retries, appetite usage, top failure pattern. Newest first." \
    "metrics"

seed_accumulating "Prompt Log" "Prompt Log" \
    "Per-prompt outcomes from each plan: status, verification evidence, failure-pattern links. Newest first." \
    "prompt-log"

# 4. Append rules to ~/.claude/CLAUDE.md (between markers, idempotent)
strip_frontmatter() {
    awk 'BEGIN{fm=0; seen=0}
         /^---$/ { if (!seen) { fm=1; seen=1; next } else if (fm) { fm=0; next } }
         { if (!fm && seen) print }' "$1"
}

MARKER="# --- Conducty Rules ---"
if [ -f "$CLAUDE_MD" ] && grep -qF "$MARKER" "$CLAUDE_MD"; then
    echo "  Conducty section already exists in $CLAUDE_MD, skipping"
else
    mkdir -p "$(dirname "$CLAUDE_MD")"
    {
        echo ""
        echo "$MARKER"
        echo ""
        for rule_file in "$SCRIPT_DIR"/rules/*.md; do
            [ -f "$rule_file" ] || continue
            strip_frontmatter "$rule_file"
            echo ""
        done
        echo "# --- End Conducty Rules ---"
    } >> "$CLAUDE_MD"
    echo "  Appended Conducty rules to $CLAUDE_MD"
fi

echo ""
echo "Done."
echo "  Skills installed to: $SKILLS_DIR"
echo "  Vault initialized at: $VAULT"
echo ""
echo "Available skills:"
for skill_dir in "$SKILLS_DIR"/conducty-*; do
    [ -e "$skill_dir" ] && echo "  - $(basename "$skill_dir")"
done
echo ""
if [ -z "${CONDUCTY_VAULT:-}" ]; then
    echo "Note: \$CONDUCTY_VAULT is not set. Default vault at $VAULT was used."
    echo "      Add to your shell profile to override:"
    echo "        export CONDUCTY_VAULT=\"\$HOME/path/to/your/vault\""
    echo ""
fi
echo "Restart Claude Code to pick up the changes."
