# OpenClaw Historical Replay Stress Benchmark

Generated: 2026-05-06T14:05:44.599Z

This benchmark is a strict checked-in evidence snapshot for the Conducty Codex integration. It samples recent focused non-merge commits across the configured repository set, creates parent-state focused workspaces, applies the real historical patches, and verifies every replayed file exactly matches the target commit.

- **Replay gate:** a row counts only if the historical patch applies to parent-state files and reproduces target-state files byte-for-byte.
- **Host checkout guard:** replay tries the default Git apply behavior first, then an LF-pinned mode, and still accepts only byte-exact target archive matches.
- **Repository gate:** this custom run covers the OpenClaw TypeScript/Node monorepo at https://github.com/openclaw/openclaw.
- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.
- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.
- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and 3200 fixed tokens for plan/checkpoint/verification overhead.
- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.

This is still not an autonomous-agent success benchmark, product-wide guarantee, or exact provider-billing trace. It is a deterministic historical patch replay benchmark with exact target-file verification.

## Summary

- Repositories measured: 1
- Replayed commits passed: 30/30
- Candidate commits skipped before replay success: 25
- Target files verified exactly: 92
- Patch bytes applied: 207,558
- Baseline readable files counted across parent checkouts: 518,036
- Focused context files counted across replays: 201
- Baseline context tokens: 879,272,947
- Focused context tokens: 1,994,082
- One-pass context tokens saved: 877,278,865 (99.8%)
- Naive workflow tokens: 3,517,169,788
- Initial architecture workflow tokens: 885,307,090
- Initial architecture savings vs naive: 74.8%
- Current PR workflow tokens: 6,130,143
- Current PR savings vs naive: 99.8%
- Current PR saved vs initial: 879,176,947 tokens (99.3%)
- Median current-vs-initial per-replay savings: 99.4%

## Repository Results

| Repository | Replays | Skipped candidates | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| openclaw | 30 | 25 | 92 | 879272947 | 1994082 | 885307090 | 6130143 | 879176947 | 99.3% |

## Replay Results

| Repository | Commit | Focused change | Apply mode | Changed files | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial % |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| openclaw | 5d7878dff165 | test(perf): narrow codex session key test | lf-pinned | 2 | 2 | 29345202 | 86810 | 29607029 | 265027 | 99.1% |
| openclaw | c4537fa6c3ca | test(perf): shorten codex app-server hot test | lf-pinned | 2 | 2 | 29327244 | 87587 | 29591605 | 267561 | 99.1% |
| openclaw | cc9f88e6e62a | ci: fix release cross-os loader path | lf-pinned | 3 | 3 | 29327032 | 53630 | 29488872 | 165040 | 99.4% |
| openclaw | fc1e2c505ad0 | fix(reply): preserve private group replies for text turns | lf-pinned | 2 | 2 | 29326911 | 49680 | 29476736 | 153025 | 99.5% |
| openclaw | cf21cbafc4fa | ci: harden release validation harness checks | lf-pinned | 3 | 3 | 29326760 | 53479 | 29487979 | 164419 | 99.4% |
| openclaw | bb25e48972a9 | test(scripts): clean up temp dirs after each case (#78421) | lf-pinned | 6 | 6 | 29326647 | 53615 | 29489973 | 166526 | 99.4% |
| openclaw | 8256b747bec6 | test(perf): narrow provider contract imports | lf-pinned | 5 | 5 | 29326559 | 48677 | 29473658 | 150299 | 99.5% |
| openclaw | 86c4809a4081 | test(gateway): skip opencode acp image probe by default | lf-pinned | 3 | 3 | 29326249 | 59157 | 29505382 | 182333 | 99.4% |
| openclaw | 7fd7f6f35591 | fix(gateway): mark chat slash commands as text | lf-pinned | 2 | 2 | 29325971 | 97618 | 29619401 | 296630 | 99.0% |
| openclaw | a2f1d1dfd8ab | fix(reply): keep text command replies visible | lf-pinned | 2 | 2 | 29325892 | 49627 | 29475497 | 152805 | 99.5% |
| openclaw | 2dc8748b59d2 | test(gateway): accept compact codex status | lf-pinned | 2 | 2 | 29325383 | 52828 | 29484235 | 162052 | 99.5% |
| openclaw | ff09f8022d5f | test(docker): scope live gateway discovery | lf-pinned | 2 | 2 | 29324570 | 75946 | 29552871 | 231501 | 99.2% |
| openclaw | 8a47c7982678 | test(docker): preserve live gateway heap | lf-pinned | 3 | 3 | 29324338 | 73119 | 29544670 | 223532 | 99.2% |
| openclaw | 11f0aeeb62f6 | test(docker): use matrix live gateway image | lf-pinned | 2 | 2 | 29324297 | 53747 | 29486223 | 165126 | 99.4% |
| openclaw | 64ab50e42bad | fix(update): preserve plugin warning context | lf-pinned | 4 | 4 | 29322567 | 96342 | 29615423 | 296056 | 99.0% |
| openclaw | 1d3efb7e9eda | test(perf): trim focused runtime contract imports | lf-pinned | 6 | 6 | 29321194 | 60642 | 29505751 | 187757 | 99.4% |
| openclaw | 16321a27b64c | fix(talk): add bounded lifecycle logging | lf-pinned | 12 | 12 | 29316191 | 95198 | 29607446 | 294455 | 99.0% |
| openclaw | ceaa56fb1214 | fix(release): stabilize final validation checks | lf-pinned | 4 | 4 | 29309136 | 61907 | 29497583 | 191647 | 99.4% |
| openclaw | ffafa9008da2 | test(agents): avoid provider runtime in fallback tests | lf-pinned | 2 | 2 | 29307365 | 66538 | 29507262 | 203097 | 99.3% |
| openclaw | a24d5fe79066 | perf(config): avoid duplicate plugin auto-enable channel probes | lf-pinned | 2 | 2 | 29307147 | 54599 | 29471999 | 168052 | 99.4% |
| openclaw | 827e602d3a1b | fix(diagnostics): include talk events in stability snapshots | lf-pinned | 2 | 2 | 29306157 | 54200 | 29469700 | 166743 | 99.4% |
| openclaw | 3fb1abcdcbc5 | test: isolate directory contract fixtures | lf-pinned | 2 | 2 | 29288659 | 52820 | 29448384 | 162925 | 99.4% |
| openclaw | 329580c64d13 | fix(onboard): recover externalized channel plugin from stale config (#78328) | lf-pinned | 2 | 2 | 29283463 | 57780 | 29462787 | 182524 | 99.4% |
| openclaw | 3915089a25f3 | test: cache provider contract entries | lf-pinned | 2 | 2 | 29280449 | 47678 | 29424159 | 146910 | 99.5% |
| openclaw | 6be5422fd640 | fix(gateway): avoid plugin model resolution in session lists | lf-pinned | 5 | 5 | 29279888 | 88380 | 29550857 | 274169 | 99.1% |
| openclaw | ef517e1a5473 | Preserve session list model normalization | lf-pinned | 2 | 2 | 29279859 | 80666 | 29523839 | 247180 | 99.2% |
| openclaw | 948375f494f3 | Optimize session list model row resolution | lf-pinned | 2 | 2 | 29279152 | 79959 | 29521093 | 245141 | 99.2% |
| openclaw | d46859d88678 | fix: reuse plugin snapshot for agent metadata | lf-pinned | 2 | 2 | 29269754 | 49920 | 29420417 | 153863 | 99.5% |
| openclaw | fe393e4427e3 | fix: reuse plugin snapshot for read-only channels | lf-pinned | 2 | 2 | 29269569 | 54120 | 29432830 | 166461 | 99.4% |
| openclaw | 5655c2b0666d | fix: pass current snapshot to embedded runs | lf-pinned | 2 | 2 | 29269342 | 97813 | 29563429 | 297287 | 99.0% |

## Replayed Files

### 1. openclaw 5d7878dff165 - test(perf): narrow codex session key test

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `855a7c7be79101d624484e991bb6b333501f233a`
- Commit: `5d7878dff1653c45e3ee488d44dcb65ac2f1f464`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/codex/src/app-server/run-attempt.test.ts`
- `extensions/codex/src/app-server/run-attempt.ts`

### 2. openclaw c4537fa6c3ca - test(perf): shorten codex app-server hot test

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cc9f88e6e62a586dc670ff1bfda7e1dcf1e8d0f7`
- Commit: `c4537fa6c3cae2fe2f2b59be95a35699cf080253`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/codex/src/app-server/run-attempt.test.ts`
- `extensions/codex/src/app-server/run-attempt.ts`

### 3. openclaw cc9f88e6e62a - ci: fix release cross-os loader path

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fc1e2c505ad0ba173b80e0193064798856caf5f4`
- Commit: `cc9f88e6e62a586dc670ff1bfda7e1dcf1e8d0f7`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/github/run-openclaw-cross-os-release-checks.sh`
- `src/gateway/gateway-codex-harness.live-helpers.test.ts`
- `src/gateway/gateway-codex-harness.live-helpers.ts`

### 4. openclaw fc1e2c505ad0 - fix(reply): preserve private group replies for text turns

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cf21cbafc4fa9b8382676fcb13e0a21827668ee4`
- Commit: `fc1e2c505ad0ba173b80e0193064798856caf5f4`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/auto-reply/reply/source-reply-delivery-mode.test.ts`
- `src/auto-reply/reply/source-reply-delivery-mode.ts`

### 5. openclaw cf21cbafc4fa - ci: harden release validation harness checks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9bcb56b45b16a8768697f2b92cf90078c124106e`
- Commit: `cf21cbafc4fa9b8382676fcb13e0a21827668ee4`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/github/run-openclaw-cross-os-release-checks.sh`
- `src/gateway/gateway-codex-harness.live-helpers.test.ts`
- `src/gateway/gateway-codex-harness.live-helpers.ts`

### 6. openclaw bb25e48972a9 - test(scripts): clean up temp dirs after each case (#78421)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7af6c25aa5d4b078bdbf949ae4c4f1c909121926`
- Commit: `bb25e48972a93d82f2cc3b123aac6858e67f7df6`
- Replay: patch applied with `lf-pinned` mode and 6 files matched target commit exactly

- `test/scripts/blacksmith-testbox-runner.test.ts`
- `test/scripts/github-activity-helper.test.ts`
- `test/scripts/mantis-publish-pr-evidence.test.ts`
- `test/scripts/resolve-openclaw-package-candidate.test.ts`
- `test/scripts/rtt-harness.test.ts`
- `test/scripts/vitest-shard-timings.test.ts`

### 7. openclaw 8256b747bec6 - test(perf): narrow provider contract imports

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `86c4809a4081047f40026f69c1910a54a6039832`
- Commit: `8256b747bec6f14297c4f511e5f80e115434d650`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/plugin-sdk/test-helpers/provider-contract.ts`
- `src/plugin-sdk/test-helpers/web-fetch-provider-contract.ts`
- `src/plugin-sdk/test-helpers/web-search-provider-contract.ts`
- `src/plugins/contracts/providers.contract.test.ts`
- `src/plugins/contracts/web-fetch-provider.contract.test.ts`

### 8. openclaw 86c4809a4081 - test(gateway): skip opencode acp image probe by default

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4996153b6debf8507a6e34a1e9eaa18a37dccf67`
- Commit: `86c4809a4081047f40026f69c1910a54a6039832`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/gateway/gateway-acp-bind.live.test.ts`
- `src/gateway/live-agent-probes.test.ts`
- `src/gateway/live-agent-probes.ts`

### 9. openclaw 7fd7f6f35591 - fix(gateway): mark chat slash commands as text

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e4b629c6d309a6a4e3eeca83c69f9e8f0ebc3074`
- Commit: `7fd7f6f355916ef1dbe3b5f0176a80ef44157a50`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/server-methods/chat.directive-tags.test.ts`
- `src/gateway/server-methods/chat.ts`

### 10. openclaw a2f1d1dfd8ab - fix(reply): keep text command replies visible

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5e218b402f832c4c12b772fb1cb2c2b96e1d161f`
- Commit: `a2f1d1dfd8ab464dcf08e91e79d4b7b6cd3fa658`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/auto-reply/reply/source-reply-delivery-mode.test.ts`
- `src/auto-reply/reply/source-reply-delivery-mode.ts`

### 11. openclaw 2dc8748b59d2 - test(gateway): accept compact codex status

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6c7c0e559a1c392ab4c1212edf1b1f56834c60d5`
- Commit: `2dc8748b59d2b2fa8d793908a05e526f855b60f3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/gateway-codex-harness.live-helpers.test.ts`
- `src/gateway/gateway-codex-harness.live-helpers.ts`

### 12. openclaw ff09f8022d5f - test(docker): scope live gateway discovery

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8a47c798267855611a83fcb9fb6f408458d235fe`
- Commit: `ff09f8022d5f29ab91bf58bd7457fed1f2b9fa7f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/lib/docker-e2e-scenarios.mjs`
- `src/gateway/gateway-models.profiles.live.test.ts`

### 13. openclaw 8a47c7982678 - test(docker): preserve live gateway heap

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `11f0aeeb62f6140500e1401b8b01ff4fffd8c2a3`
- Commit: `8a47c798267855611a83fcb9fb6f408458d235fe`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/test-live-gateway-models-docker.sh`
- `scripts/test-live.mjs`
- `src/gateway/gateway-models.profiles.live.test.ts`

### 14. openclaw 11f0aeeb62f6 - test(docker): use matrix live gateway image

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `359c60948f67c394463371478e2ec2dee9d31738`
- Commit: `11f0aeeb62f6140500e1401b8b01ff4fffd8c2a3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/lib/docker-e2e-scenarios.mjs`
- `scripts/test-live-gateway-models-docker.sh`

### 15. openclaw 64ab50e42bad - fix(update): preserve plugin warning context

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a3aa0a457feb3543d643e717dc42153e9b7a4034`
- Commit: `64ab50e42bad42156e275f5b0f8f02d237458e2c`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `scripts/e2e/lib/plugin-update/corrupt-update-scenario.sh`
- `scripts/e2e/lib/plugin-update/probe.mjs`
- `src/cli/update-cli.test.ts`
- `src/cli/update-cli/update-command.ts`

### 16. openclaw 1d3efb7e9eda - test(perf): trim focused runtime contract imports

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cbba122cddebcbed24e7f0414cf7c6a1cef54dba`
- Commit: `1d3efb7e9eda066e5b5ba27f368bfdf95faa9851`
- Replay: patch applied with `lf-pinned` mode and 6 files matched target commit exactly

- `src/agents/pi-embedded-subscribe.tools.extract.test.ts`
- `src/agents/pi-tools.before-tool-call.state.ts`
- `src/agents/pi-tools.before-tool-call.ts`
- `src/commands/configure.gateway-auth.prompt-auth-config.test.ts`
- `src/commands/configure.gateway-auth.ts`
- `src/plugin-sdk/test-helpers/agents/openclaw-owned-tool-runtime-contract.ts`

### 17. openclaw 16321a27b64c - fix(talk): add bounded lifecycle logging

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `28e27ca5d16a9b4e5e42cf4e86492f4188ae4b4e`
- Commit: `16321a27b64c9be1e609eda76e05f1c9d7e3cf58`
- Replay: patch applied with `lf-pinned` mode and 12 files matched target commit exactly

- `extensions/google-meet/src/realtime-node.ts`
- `extensions/google-meet/src/realtime.ts`
- `extensions/voice-call/src/media-stream.ts`
- `extensions/voice-call/src/webhook/realtime-handler.ts`
- `src/gateway/talk-handoff.ts`
- `src/gateway/talk-realtime-relay.ts`
- `src/gateway/talk-transcription-relay.ts`
- `src/plugin-sdk/realtime-voice.ts`
- `src/talk/agent-talkback-runtime.ts`
- `src/talk/logging.test.ts`
- `src/talk/logging.ts`
- `src/talk/observability.ts`

### 18. openclaw ceaa56fb1214 - fix(release): stabilize final validation checks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `bf0f5476323daa9df52694634385f6114ce7a065`
- Commit: `ceaa56fb12142d6e220c57f260ce3d57b8d1c335`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `scripts/e2e/lib/plugin-update/probe.mjs`
- `scripts/verify-docker-attestations.mjs`
- `src/agents/models.profiles.live.test.ts`
- `test/scripts/verify-docker-attestations.test.ts`

### 19. openclaw ffafa9008da2 - test(agents): avoid provider runtime in fallback tests

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a24d5fe79066acfa56288244b3852f4f322cdea1`
- Commit: `ffafa9008da249a07b2950d5747503d551a6e3da`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/model-fallback.probe.test.ts`
- `src/agents/model-fallback.test.ts`

### 20. openclaw a24d5fe79066 - perf(config): avoid duplicate plugin auto-enable channel probes

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `34dc7f6ea6fd6751ff1188b13d4c43a6d0224fe2`
- Commit: `a24d5fe79066acfa56288244b3852f4f322cdea1`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/config/plugin-auto-enable.detect.ts`
- `src/config/plugin-auto-enable.shared.ts`

### 21. openclaw 827e602d3a1b - fix(diagnostics): include talk events in stability snapshots

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8d9e7c8178b6e7db7d1c8340266a987456c0cf24`
- Commit: `827e602d3a1bb726aaf68a02229a25ff3d848fc0`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/logging/diagnostic-stability.test.ts`
- `src/logging/diagnostic-stability.ts`

### 22. openclaw 3fb1abcdcbc5 - test: isolate directory contract fixtures

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9edeffc751e1aa24f1833c5f37f0eaf024b18524`
- Commit: `3fb1abcdcbc556023e0d80ef75b219efb695aeb4`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/mattermost/src/channel.ts`
- `src/channels/plugins/contracts/test-helpers/threading-directory-contract-suites.ts`

### 23. openclaw 329580c64d13 - fix(onboard): recover externalized channel plugin from stale config (#78328)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `58f81b0e04ef0304fc604f378fbcee6be01b1cde`
- Commit: `329580c64d13657592c3fabb97ff567c2e292bb6`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/flows/channel-setup.test.ts`
- `src/flows/channel-setup.ts`

### 24. openclaw 3915089a25f3 - test: cache provider contract entries

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5969ac8ccf8b62d75023cbaadb416d28affac545`
- Commit: `3915089a25f349ee9ca3c4f10acde71d9d44cab3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/plugin-sdk/test-helpers/provider-contract.ts`
- `src/plugin-sdk/test-helpers/web-search-provider-contract.ts`

### 25. openclaw 6be5422fd640 - fix(gateway): avoid plugin model resolution in session lists

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ef517e1a5473bca69f19dee882421ef6412bc12f`
- Commit: `6be5422fd64072a09020d5297d7d683811a4ec5b`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/agents/model-selection.ts`
- `src/gateway/server.sessions.list-changed.test.ts`
- `src/gateway/session-utils.plugin-runtime.test.ts`
- `src/gateway/session-utils.test.ts`
- `src/gateway/session-utils.ts`

### 26. openclaw ef517e1a5473 - Preserve session list model normalization

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `948375f494f34327a9ccd10e3f2eef8c7c3d8171`
- Commit: `ef517e1a5473bca69f19dee882421ef6412bc12f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/session-utils.test.ts`
- `src/gateway/session-utils.ts`

### 27. openclaw 948375f494f3 - Optimize session list model row resolution

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8bfec5b9ac89cad4e696c12a7d6fca974b55a061`
- Commit: `948375f494f34327a9ccd10e3f2eef8c7c3d8171`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/session-utils.test.ts`
- `src/gateway/session-utils.ts`

### 28. openclaw d46859d88678 - fix: reuse plugin snapshot for agent metadata

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fe393e4427e3862eef1cb313f35039c5882c854e`
- Commit: `d46859d88678b220fd383f6c811aa9c4ef3f306f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/provider-auth-aliases.ts`
- `src/agents/skills/plugin-skills.ts`

### 29. openclaw fe393e4427e3 - fix: reuse plugin snapshot for read-only channels

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `df209586bda2e414d2181504698785838f9a5a9c`
- Commit: `fe393e4427e3862eef1cb313f35039c5882c854e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/channels/plugins/read-only-command-defaults.ts`
- `src/channels/plugins/read-only.ts`

### 30. openclaw 5655c2b0666d - fix: pass current snapshot to embedded runs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ba1800e1bd78faf658e8a3725980a60fdfc4a690`
- Commit: `5655c2b0666d83b263d503a6e3cecac75f387dde`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/pi-embedded-runner/compact.ts`
- `src/agents/pi-embedded-runner/run/attempt.ts`
