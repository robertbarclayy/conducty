---
name: conducty-terse
description: Caveman-style compression for conducty orchestration artifacts — subagent prompt text, plan note prompt blocks, prompt log entries, checkpoint notes. Cuts token waste in the orchestration layer where "prompt quality is leverage" already demands tight signal-to-noise. Use when user says "conducty-terse", "terse mode", "compress prompts", "tight prompts", or invokes /conducty-terse. Does NOT change subagent output, code, commits, acceptance criteria, no-go zones, or verification commands — those stay verbatim.
aliases:
  - conducty-terse
  - terse
tags:
  - conducty/skill
  - conducty/discipline
---

# Conducty Terse — Compression for Orchestration Artifacts

Caveman energy applied to conducty surface area. Prompts dispatched to subagents, prompt blocks in plan notes, entries in `[[Prompt Log]]`, checkpoint notes — these are the artifacts where extra words cost twice: they bloat your orchestrator window AND every dispatched subagent's window.

This skill is the mechanical follow-through to the Conducty principle that **prompt quality is leverage**. Smaller prompts mean larger usable subagent context windows, which means more room for actual code, file reads, and verification output.

## Scope — what gets compressed

| Artifact | Apply terse? | Reason |
|---|---|---|
| Subagent prompt text (Task tool input) | **Yes** | Every word costs once in your context, again in the subagent's |
| Plan note prompt blocks | **Yes** | Re-read on every dispatch; bloat compounds |
| `[[Prompt Log]]` entries | **Yes** | Append-only; the file grows forever |
| Checkpoint notes | **Yes** | Read by [[conducty-improve]] later |
| Orchestrator status updates to user | **Yes** | Match the user's `caveman` mode if active |
| Subagent reasoning / output | **No** | Subagents write in their own register |
| **Acceptance criteria** | **No** | Precision > brevity |
| **No-go zones** | **No** | Ambiguity = scope creep |
| **Verification commands** | **No** | Exact strings, never paraphrase |
| **Error messages quoted** | **No** | Verbatim or useless |
| Code, commits, PRs | **No** | Same boundary as caveman |
| Security warnings, destructive op confirmations | **No** | Auto-clarity rule |

## Compression rules

**Drop:** articles (a/an/the), filler (just/really/simply/basically/actually), pleasantries (sure/certainly/please/happy to), hedging (might/perhaps/it seems), narrative throat-clearing ("In order to...", "It is important to note that...", "The reason we're doing this is..."), redundant restatement of plan context the subagent already has.

**Keep exact:** technical terms, file paths, error strings, command invocations, model names (`haiku`/`sonnet`/`opus`), type signatures, link targets (`[[wikilink]]`), acceptance criteria text, no-go zone text, verification command strings.

**Style:** Fragments OK. Short synonyms (`big` not `extensive`, `fix` not `implement a solution for`). Bullets over paragraphs when both work. Pattern: `[artifact] [action] [reason]. [next step].`

## Examples

### Subagent prompt — bloated

> Hello! For this task, I'd like you to please go ahead and refactor the user authentication middleware located in `src/middleware/auth.ts` so that it uses the new `verifyToken` function from `src/lib/jwt.ts` instead of the legacy `decodeToken` function. The reason we're doing this refactor is that the legacy function does not handle expired tokens correctly, which has been causing issues in production for the past few weeks. Please make sure that all existing tests continue to pass after your changes.

### Subagent prompt — terse

> Refactor `src/middleware/auth.ts` to use `verifyToken` from `src/lib/jwt.ts`. Replace all `decodeToken` calls.
>
> Reason: legacy `decodeToken` mishandles expired tokens (prod incident).
>
> **Acceptance criteria:** [verbatim from plan, do not paraphrase]
>
> **No-go zones:** [verbatim from plan, do not paraphrase]
>
> **Verify:** `pnpm test src/middleware/auth.test.ts`
>
> Time budget: 20m. Model: sonnet.

### Prompt Log entry — bloated

> 2026-04-27 14:32 — Prompt P3 from Plan 2026-04-27 1400 [Auth Refactor] completed successfully on the first attempt. Verification ran clean and the spec reviewer found no compliance issues. The implementation took roughly 18 minutes, which was within the 20-minute time budget.

### Prompt Log entry — terse

> 2026-04-27 14:32 · P3 [[Plan 2026-04-27 1400 Auth Refactor]] · DONE · 1st attempt · spec-review clean · 18m / 20m budget

### Checkpoint note — bloated

> Group A finished. All four prompts completed without issues. The first-attempt pass rate was 100%, with no retries needed and no prompts blocked. Overall the group went smoothly and we're ready to proceed to Group B.

### Checkpoint note — terse

> Group A · 4/4 done · 1st-attempt 100% · 0 retries · 0 blocked · proceed Group B

## Auto-clarity (override terse)

Always write normal prose when:

- Acceptance criteria — copy verbatim from plan, never compress
- No-go zones — copy verbatim from plan, never compress
- Security warnings or destructive operation confirmations
- Multi-step protocols where fragment order risks misread (e.g. compact-resume sequence)
- Error messages quoted from logs
- Verification command strings

Resume terse after the precision-required part is done.

## Persistence

Active when the skill is invoked. Stays active until the user says "stop terse", "normal mode", or "stop conducty-terse". No drift mid-session. If unsure whether terse still applies, default to **active**.

## Interaction with `caveman`

`caveman` covers user-facing chat compression. `conducty-terse` covers conducty artifacts written to the vault or dispatched to subagents.

- Both can be active simultaneously — they target different surfaces.
- If both active and they conflict: `conducty-terse` wins for vault and subagent artifacts; `caveman` wins for user-facing chat.
- Turning one off does not turn the other off.

## Principles

- **Compression is downstream of clarity** — never sacrifice acceptance criteria precision for terseness
- **Exact strings are sacred** — file paths, errors, commands, link targets, acceptance criteria, no-go zones never paraphrase
- **Terse the prose, not the spec** — narrative shrinks, structure stays
- **Vault artifacts are read many times** — every word saved pays compound interest across plan, checkpoint, review, improve, and future plans loading the same context
- **Subagents inherit your terseness** — a tight prompt teaches the subagent the register; a bloated prompt invites a bloated reply
