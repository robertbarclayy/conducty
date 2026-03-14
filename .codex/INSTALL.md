# Installing Conducty for Codex

> WIP: This platform integration is not finalized yet. Conducty is currently focused on the Cursor plugin flow, so Codex instructions may change and may lag behind the Cursor setup.

## Prerequisites

- Git

## Quick Install

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
cd ~/conducty
chmod +x install-codex.sh
./install-codex.sh
```

This will:
1. Symlink all `conducty-*` skills to `~/.agents/skills/`
2. Create the `~/.conducty/` state directory

## Manual Install

### 1. Clone the repo

```bash
git clone https://github.com/conducty/conducty.git ~/conducty
```

### 2. Symlink skills

```bash
mkdir -p ~/.agents/skills
for skill in ~/conducty/skills/conducty-*; do
    ln -sf "$skill" ~/.agents/skills/"$(basename "$skill")"
done
```

**Windows (PowerShell):**

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
Get-ChildItem "$env:USERPROFILE\conducty\skills\conducty-*" -Directory | ForEach-Object {
    cmd /c mklink /J "$env:USERPROFILE\.agents\skills\$($_.Name)" $_.FullName
}
```

### 3. Create state directories

```bash
mkdir -p ~/.conducty/{plans,history,context,designs}
```

### 4. Restart Codex

Restart Codex (quit and relaunch the CLI) to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/conducty-*
```

You should see symlinks pointing to your conducty skills directories.

## Usage

Codex discovers skills from `~/.agents/skills/` automatically. Reference them by name in your prompts:

- "Plan my day" -- triggers `conducty-plan`
- "Load context from /path/to/project" -- triggers `conducty-context`
- "Checkpoint" -- triggers `conducty-checkpoint`

## Updating

```bash
cd ~/conducty && git pull
```

Skills update instantly through the symlinks.

## Uninstalling

```bash
rm -f ~/.agents/skills/conducty-*
```

Optionally delete the clone: `rm -rf ~/conducty`
