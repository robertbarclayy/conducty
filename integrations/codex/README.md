# Conducty Codex Integration

This directory packages Conducty for Codex as:

- a Codex plugin manifest
- one Conducty skill
- a dependency-free local MCP server
- a smoke test that exercises the MCP server over stdio
- a one-command local installer
- a doctor that diagnoses plugin, vault, marketplace, and MCP health

The integration preserves Conducty's existing vault contract. Plans, improvements, prompt logs, metrics, and indexes are still regular Markdown notes in the Obsidian vault.

## Install

From this directory:

```bash
# macOS / Linux
./scripts/install-codex.sh

# Windows PowerShell
./scripts/install-codex.ps1
```

The installer:

1. copies this integration to `~/plugins/conducty-codex`
2. creates or updates `~/.agents/plugins/marketplace.json`
3. enables `conducty-codex@aura-local` in the Codex config
4. registers the local `aura-local` marketplace source
5. bootstraps the Conducty vault skeleton
6. runs the doctor

Restart Codex after install so the plugin catalog and MCP tools are refreshed.

Installer options:

```bash
node scripts/install-codex.mjs --help
```

Useful flags:

- `--vault <path>`: choose the Conducty vault path
- `--codex-home <path>`: choose the Codex config directory
- `--home <path>`: choose the home directory used for `~/.agents` and `~/plugins`
- `--dry-run`: print resolved paths without writing
- `--skip-doctor`: skip the final doctor run

## Doctor

Run the doctor when the plugin does not appear in Codex, the MCP server does not start, or the vault is missing expected notes:

```bash
node scripts/doctor.mjs
```

The doctor checks:

- Node runtime version
- required plugin files
- plugin manifest shape
- MCP config
- skill frontmatter
- vault skeleton
- local marketplace JSON, including UTF-8 BOM detection
- Codex config entries
- MCP smoke test

Use `--fix` to bootstrap missing vault notes and safely remove a UTF-8 BOM from the local marketplace file:

```bash
node scripts/doctor.mjs --fix
```

## What the MCP Server Adds

The MCP server turns Conducty's state operations into deterministic tools:

- `resolve_vault`: show the active vault path and whether it exists
- `bootstrap_vault`: create the vault folders, indexes, and accumulator notes
- `get_cycle`: return the Conducty operating loop
- `check_prompt_smells`: catch vague prompts before execution
- `create_plan`: write a timestamped plan note and update `Plans Index`
- `list_recent_notes`: list recent vault notes by type
- `log_prompt_outcome`: prepend a terse entry to `Prompt Log`
- `record_checkpoint`: append group health metrics to the plan note
- `record_improvement`: write an improvement kata note and update `Improvements Index`
- `create_ship_report`: write a green/yellow/red pre-merge verdict with verification evidence, residual risks, and next steps
- `audit_vault_graph`: report broken wikilinks, duplicate basenames, orphan user notes, plans without ship reports, and plans without checkpoints

## Vault Location

The server resolves the vault in this order:

1. explicit `vault` argument passed to a tool
2. `CONDUCTY_VAULT`
3. `~/Obsidian/Conducty`

For an always-on setup, set `CONDUCTY_VAULT` once at the user or shell-profile level so every project writes to the same learning graph.

## Local Smoke Test

From this directory:

```bash
node scripts/smoke-test.mjs
node scripts/probe-ndjson.mjs
node scripts/path-safety-test.mjs
```

The smoke test creates a temporary vault, initializes the server over stdio, lists tools, creates a plan, checks prompt smells, logs a prompt outcome, records a checkpoint, writes an improvement note, writes a ship report, audits the vault graph, and deletes the temporary vault. The NDJSON probe drives a minimal `initialize` -> `tools/list` -> `tools/call` flow and proves legal callers still work after framing/path changes. The path-safety test asserts that `safeVaultPath` and `findPlanPath` reject symlinked candidate paths and traversal attempts while still allowing a symlinked vault root.

## Manual MCP Run

The plugin manifest points Codex at:

```json
{
  "mcpServers": {
    "conducty-codex": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp/server.mjs"]
    }
  }
}
```

No npm install is required.
