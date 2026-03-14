# Installing Conducty for OpenCode

> WIP: This platform integration is not finalized yet. Conducty is currently focused on the Cursor plugin flow, so OpenCode instructions may change and may lag behind the Cursor setup.

## Prerequisites

- [OpenCode](https://opencode.ai) installed
- Git

## Quick Install

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
cd ~/conducty
chmod +x install-opencode.sh
./install-opencode.sh
```

This will:
1. Symlink all `conducty-*` skills to `~/.config/opencode/skills/`
2. Create the `~/.conducty/` state directory

## Manual Install

### 1. Clone the repo

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
```

### 2. Symlink skills

```bash
mkdir -p ~/.config/opencode/skills
for skill in ~/conducty/skills/conducty-*; do
    ln -sf "$skill" ~/.config/opencode/skills/"$(basename "$skill")"
done
```

### 3. Create state directories

```bash
mkdir -p ~/.conducty/{plans,history,context,designs}
```

### 4. Restart OpenCode

Restart OpenCode to discover the newly installed skills.

## Usage

OpenCode discovers skills from `~/.config/opencode/skills/` automatically. Use the native `skill` tool to list and load them:

```
use skill tool to list skills
use skill tool to load conducty-plan
```

### Tool Mapping

When skills reference Cursor-specific tools, substitute OpenCode equivalents:

| Cursor Tool | OpenCode Equivalent |
|-------------|-------------------|
| `TodoWrite` | `todowrite` |
| `Task` (subagents) | `@mention` syntax |
| `Read`, `Write`, `Edit` | Native file tools |
| `Shell` | Native bash tool |

## Updating

```bash
cd ~/conducty && git pull
```

Skills update instantly through the symlinks.

## Uninstalling

```bash
rm -f ~/.config/opencode/skills/conducty-*
```
