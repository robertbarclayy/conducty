# Conducty Codex Integration

This directory packages Conducty for Codex as:

- a Codex plugin manifest
- one Conducty skill
- a dependency-free local MCP server
- a smoke test that exercises the MCP server over stdio

The integration preserves Conducty's existing vault contract. Plans, improvements, prompt logs, metrics, and indexes are still regular Markdown notes in the Obsidian vault.

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

## Vault Location

The server resolves the vault in this order:

1. explicit `vault` argument passed to a tool
2. `CONDUCTY_VAULT`
3. `~/Obsidian/Conducty`

## Local Smoke Test

From this directory:

```bash
node scripts/smoke-test.mjs
```

The smoke test creates a temporary vault, initializes the server over stdio, lists tools, creates a plan, checks prompt smells, logs a prompt outcome, records a checkpoint, writes an improvement note, and deletes the temporary vault.

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
