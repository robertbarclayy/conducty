# OpenClaw 200-Commit Historical Replay Stress Benchmark

Generated: 2026-05-06T14:46:12.905Z

This benchmark is a strict checked-in evidence snapshot for the Conducty Codex integration. It samples recent focused non-merge commits across the configured repository set, creates parent-state focused workspaces, applies the real historical patches, and verifies every replayed file exactly matches the target commit.

- **Replay gate:** a row counts only if the historical patch applies to parent-state files and reproduces target-state files byte-for-byte.
- **Host checkout guard:** replay tries the default Git apply behavior first, then an LF-pinned mode, and still accepts only byte-exact target archive matches.
- **Repository gate:** this custom run covers 200 recent focused commits from the OpenClaw TypeScript/Node monorepo at https://github.com/openclaw/openclaw.
- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.
- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.
- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and 3200 fixed tokens for plan/checkpoint/verification overhead.
- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.

This is still not an autonomous-agent success benchmark, product-wide guarantee, or exact provider-billing trace. It is a deterministic historical patch replay benchmark with exact target-file verification.

## Summary

- Repositories measured: 1
- Replayed commits passed: 200/200
- Candidate commits skipped before replay success: 207
- Target files verified exactly: 742
- Patch bytes applied: 3,017,807
- Baseline readable files counted across parent checkouts: 3,434,312
- Focused context files counted across replays: 1,586
- Baseline context tokens: 5,818,083,689
- Focused context tokens: 14,272,890
- One-pass context tokens saved: 5,803,810,799 (99.8%)
- Naive workflow tokens: 23,272,854,756
- Initial architecture workflow tokens: 5,861,655,911
- Initial architecture savings vs naive: 74.8%
- Current PR workflow tokens: 44,212,222
- Current PR savings vs naive: 99.8%
- Current PR saved vs initial: 5,817,443,689 tokens (99.2%)
- Median current-vs-initial per-replay savings: 99.4%

## Repository Results

| Repository | Replays | Skipped candidates | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| openclaw | 200 | 207 | 742 | 5818083689 | 14272890 | 5861655911 | 44212222 | 5817443689 | 99.2% |

## Replay Results

| Repository | Commit | Focused change | Apply mode | Changed files | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial % |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| openclaw | 9324af7d46bf | test(perf): trim gateway session list fixtures | lf-pinned | 2 | 2 | 29355486 | 72777 | 29574933 | 222647 | 99.2% |
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
| openclaw | ba1800e1bd78 | fix: reuse plugin snapshot for embedded settings | lf-pinned | 3 | 3 | 29268272 | 50305 | 29421525 | 156453 | 99.5% |
| openclaw | 8f3a34e2a18d | refactor: share fs-safe JSON helpers | lf-pinned | 17 | 17 | 29268793 | 79599 | 29518122 | 252529 | 99.1% |
| openclaw | 5107384e6766 | fix: stabilize Matrix tool progress QA (#78179) | lf-pinned | 11 | 11 | 29254386 | 204879 | 29878981 | 627795 | 97.9% |
| openclaw | 7544beea1794 | fix: preserve embedded dispatcher timeouts | lf-pinned | 5 | 5 | 29253713 | 61607 | 29441813 | 191300 | 99.4% |
| openclaw | d52f581f76c2 | fix: avoid fetch runtime proxy imports | lf-pinned | 3 | 3 | 29253095 | 51588 | 29409527 | 159632 | 99.5% |
| openclaw | c9c66d7a1d5c | fix: restore no-proxy dispatcher boundary | lf-pinned | 2 | 2 | 29253356 | 51838 | 29410383 | 160227 | 99.5% |
| openclaw | 6807da544bf6 | fix(net): preserve no-proxy undici stream timeouts | lf-pinned | 2 | 2 | 29253095 | 51576 | 29409336 | 159441 | 99.5% |
| openclaw | 95652d5867b6 | test: cover no-proxy undici startup | lf-pinned | 3 | 3 | 29252558 | 64347 | 29448525 | 199167 | 99.3% |
| openclaw | 85ed972217b7 | fix: lazy-load undici dispatchers | lf-pinned | 3 | 3 | 29251929 | 49870 | 29404304 | 155575 | 99.5% |
| openclaw | 1672d35ef538 | perf: avoid no-op plugin auto-enable scans | lf-pinned | 2 | 2 | 29250691 | 54630 | 29415081 | 167590 | 99.4% |
| openclaw | 5da9f5e57c14 | test: remove cli retry test waits | lf-pinned | 2 | 2 | 29250567 | 56871 | 29422132 | 174765 | 99.4% |
| openclaw | 4ec693a81aaa | test: interleave cold full-suite shards | lf-pinned | 3 | 3 | 29249533 | 77444 | 29484706 | 238373 | 99.2% |
| openclaw | 06c490f81894 | test: support higher vitest shard parallelism | lf-pinned | 2 | 2 | 29249028 | 47729 | 29393043 | 147215 | 99.5% |
| openclaw | 1f6ce72b8aa4 | test: trim cron and context-engine waits | lf-pinned | 3 | 3 | 29248897 | 79743 | 29489690 | 243993 | 99.2% |
| openclaw | f2ce83833a71 | test: avoid spawning cli help in metadata test | lf-pinned | 2 | 2 | 29248745 | 50076 | 29399566 | 154021 | 99.5% |
| openclaw | 6da5eda4880a | test: avoid real waits in cdp and outbound tests | lf-pinned | 2 | 2 | 29248416 | 57828 | 29422536 | 177320 | 99.4% |
| openclaw | e9987ffc3aa0 | fix: clamp xAI live gateway thinking | lf-pinned | 4 | 4 | 29242175 | 96589 | 29536551 | 297576 | 99.0% |
| openclaw | afc2c2e20715 | test(browser): avoid real retry waits | lf-pinned | 2 | 2 | 29241957 | 64641 | 29436793 | 198036 | 99.3% |
| openclaw | d221d7b6a989 | fix(plugins): isolate peer-link repair failures | lf-pinned | 2 | 2 | 29240609 | 87939 | 29505505 | 268096 | 99.1% |
| openclaw | 814b125f114c | fix(telegram): separate progress drafts from final replies | lf-pinned | 4 | 4 | 29237349 | 87393 | 29501372 | 267223 | 99.1% |
| openclaw | 748d6dc75e6a | test(qa): assert telegram streamed final count | lf-pinned | 2 | 2 | 29237160 | 68846 | 29444515 | 210555 | 99.3% |
| openclaw | 512f777099eb | test(qa): thread telegram long final prompts | lf-pinned | 2 | 2 | 29237123 | 68809 | 29444005 | 210082 | 99.3% |
| openclaw | 25fc85afa218 | test(telegram): cover single stream delivery | lf-pinned | 2 | 2 | 29275142 | 99852 | 29624381 | 352439 | 98.8% |
| openclaw | ebb8bed78f90 | fix: cap memory wiki filenames for safe writes | lf-pinned | 2 | 2 | 29281011 | 51854 | 29437007 | 159196 | 99.5% |
| openclaw | 777c539dafc0 | fix: harden sandboxed patch parent paths | lf-pinned | 2 | 2 | 29280622 | 54746 | 29445658 | 168236 | 99.4% |
| openclaw | d71c11983f07 | chore(ui): refresh nl control ui locale | lf-pinned | 2 | 2 | 29276448 | 58445 | 29452375 | 179127 | 99.4% |
| openclaw | 186d247209a6 | chore(ui): refresh fa control ui locale | lf-pinned | 2 | 2 | 29276537 | 58079 | 29451362 | 178025 | 99.4% |
| openclaw | 020581ac7fd4 | chore(ui): refresh vi control ui locale | lf-pinned | 2 | 2 | 29276622 | 58255 | 29451981 | 178559 | 99.4% |
| openclaw | f51436868b2a | chore(ui): refresh th control ui locale | lf-pinned | 2 | 2 | 29276703 | 57762 | 29450581 | 177078 | 99.4% |
| openclaw | 9ce00b77568e | chore(ui): refresh pl control ui locale | lf-pinned | 2 | 2 | 29276783 | 58602 | 29453199 | 179616 | 99.4% |
| openclaw | a0a74608fffe | chore(ui): refresh id control ui locale | lf-pinned | 2 | 2 | 29276868 | 58251 | 29452213 | 178545 | 99.4% |
| openclaw | b868f4e2bed3 | chore(ui): refresh uk control ui locale | lf-pinned | 2 | 2 | 29276950 | 58579 | 29453289 | 179539 | 99.4% |
| openclaw | 4e867ea2c9dc | chore(ui): refresh tr control ui locale | lf-pinned | 2 | 2 | 29277032 | 58407 | 29452852 | 179020 | 99.4% |
| openclaw | 1a3d77531d58 | chore(ui): refresh it control ui locale | lf-pinned | 2 | 2 | 29277104 | 58792 | 29454088 | 180184 | 99.4% |
| openclaw | b9eb969d9a81 | chore(ui): refresh ar control ui locale | lf-pinned | 2 | 2 | 29277195 | 57763 | 29451062 | 177067 | 99.4% |
| openclaw | fc6737bd0ae1 | chore(ui): refresh fr control ui locale | lf-pinned | 2 | 2 | 29277270 | 58993 | 29454854 | 180784 | 99.4% |
| openclaw | c17bcb99e1fe | chore(ui): refresh ko control ui locale | lf-pinned | 2 | 2 | 29277375 | 55993 | 29445903 | 171728 | 99.4% |
| openclaw | 3cff0d3dc837 | chore(ui): refresh ja-JP control ui locale | lf-pinned | 2 | 2 | 29277478 | 56227 | 29446723 | 172445 | 99.4% |
| openclaw | 19071cc6a597 | chore(ui): refresh es control ui locale | lf-pinned | 2 | 2 | 29277561 | 58952 | 29455042 | 180681 | 99.4% |
| openclaw | 76e8f59f178a | chore(ui): refresh zh-CN control ui locale | lf-pinned | 2 | 2 | 29277686 | 55083 | 29443506 | 169020 | 99.4% |
| openclaw | 931645e09043 | chore(ui): refresh zh-TW control ui locale | lf-pinned | 2 | 2 | 29277791 | 55397 | 29444531 | 169940 | 99.4% |
| openclaw | 47b65154ae09 | chore(ui): refresh de control ui locale | lf-pinned | 2 | 2 | 29277871 | 58882 | 29455120 | 180449 | 99.4% |
| openclaw | 9111f8376537 | chore(ui): refresh pt-BR control ui locale | lf-pinned | 2 | 2 | 29277950 | 58558 | 29454230 | 179480 | 99.4% |
| openclaw | e2858e70dde3 | chore: update channel status protocol models | lf-pinned | 2 | 2 | 29268932 | 120523 | 29631367 | 365635 | 98.8% |
| openclaw | ea391c6df280 | test: stabilize cron and pairing shard hangs | lf-pinned | 2 | 2 | 29263182 | 63094 | 29454731 | 194749 | 99.3% |
| openclaw | ae7c13e28467 | test: restore current-main test isolation | lf-pinned | 2 | 2 | 29260645 | 54908 | 29426074 | 168629 | 99.4% |
| openclaw | 8b9b849b19c4 | test: align fs-safe race expectations | lf-pinned | 2 | 2 | 29260648 | 55699 | 29428729 | 171281 | 99.4% |
| openclaw | 9e108fa9a762 | fix: repair fs-safe ci expectations | lf-pinned | 2 | 2 | 29260397 | 51628 | 29415664 | 158467 | 99.5% |
| openclaw | b43efd37935c | fix: clean up post-land CI guards | lf-pinned | 5 | 5 | 29262798 | 83521 | 29515046 | 255448 | 99.1% |
| openclaw | 82942295921e | test: refresh fs-safe boundary expectations | lf-pinned | 6 | 6 | 29262895 | 71742 | 29479982 | 220287 | 99.3% |
| openclaw | a6a4140ee71a | fix(media): handle canonical inbound media paths | lf-pinned | 5 | 5 | 29262664 | 53854 | 29426197 | 166733 | 99.4% |
| openclaw | 057d3a43c049 | feat(mantis): capture logged-in discord web evidence | lf-pinned | 8 | 8 | 29257241 | 98074 | 29560676 | 306635 | 99.0% |
| openclaw | 20163313afc5 | fix: resolve fs-safe post-land fallout | lf-pinned | 13 | 13 | 29255644 | 70792 | 29473728 | 221284 | 99.2% |
| openclaw | df296823844f | test: update talk unit-fast paths | lf-pinned | 2 | 2 | 29269873 | 52096 | 29426696 | 160023 | 99.5% |
| openclaw | e02ddf71afad | fix: guard managed talk room control | lf-pinned | 2 | 2 | 29267888 | 60532 | 29452550 | 187862 | 99.4% |
| openclaw | ada560ece4eb | feat: adapt voice surfaces to talk events | lf-pinned | 14 | 14 | 29298889 | 177443 | 29857720 | 562031 | 98.1% |
| openclaw | 9e6f38f4e1a2 | feat: unify browser realtime talk clients | lf-pinned | 9 | 9 | 29292291 | 62860 | 29495546 | 206455 | 99.3% |
| openclaw | 7225a2678e8c | feat: expose talk-capable realtime providers | lf-pinned | 4 | 4 | 29219496 | 72994 | 29440217 | 223921 | 99.2% |
| openclaw | c90c68c6360a | feat: add shared talk runtime primitives | lf-pinned | 12 | 12 | 29209426 | 80204 | 29461761 | 255535 | 99.1% |
| openclaw | 601b4819cb0c | test: refresh plugin loader boundary assertions | lf-pinned | 2 | 2 | 29197321 | 53372 | 29357920 | 163799 | 99.4% |
| openclaw | 384432fd2250 | test: isolate media factory planning imports | lf-pinned | 3 | 3 | 29247305 | 61132 | 29438017 | 193912 | 99.3% |
| openclaw | e3b0707a5392 | fix: preserve source plugin loading fallbacks | lf-pinned | 11 | 11 | 29223178 | 130171 | 29620143 | 400165 | 98.6% |
| openclaw | 271aac42e4c4 | test: isolate cli provider model-selection coverage | lf-pinned | 2 | 2 | 29108188 | 60945 | 29291923 | 186935 | 99.4% |
| openclaw | d11160545383 | test: streamline model fallback probe coverage | lf-pinned | 3 | 3 | 29080629 | 76431 | 29315560 | 238131 | 99.2% |
| openclaw | 093b2b9b5f97 | test: speed extension and contract scenarios | lf-pinned | 16 | 16 | 29074003 | 199859 | 29681412 | 610609 | 97.9% |
| openclaw | cb42efb6e660 | test: trim slow agent fallback coverage | lf-pinned | 7 | 7 | 29075073 | 105354 | 29404044 | 332171 | 98.9% |
| openclaw | e428a2dfe2a3 | test: add focused seams for faster isolated tests | lf-pinned | 9 | 9 | 29074707 | 101712 | 29383635 | 312128 | 98.9% |
| openclaw | dd643b52df44 | test: expand slack live qa coverage (#77713) | lf-pinned | 3 | 3 | 29049300 | 64439 | 29249572 | 203472 | 99.3% |
| openclaw | 1ff07517b0c3 | test(secrets): trust source plugin contracts in coverage | lf-pinned | 2 | 2 | 29040779 | 52100 | 29198079 | 160500 | 99.5% |
| openclaw | add9a49c40f9 | test: cover generated media delivery evidence fallback | lf-pinned | 2 | 2 | 29040342 | 62603 | 29228925 | 191783 | 99.3% |
| openclaw | 01dda73e9bb1 | Revert "test: narrow changed-test routing for shared internals" | lf-pinned | 2 | 2 | 29034035 | 73999 | 29256544 | 225709 | 99.2% |
| openclaw | 6455ed24cffd | test: scope unit coverage gate | lf-pinned | 3 | 3 | 29033147 | 53010 | 29194263 | 164316 | 99.4% |
| openclaw | c319f3c4d583 | fix: mark accepted Mantis remote runs | lf-pinned | 2 | 2 | 29032998 | 61746 | 29218852 | 189054 | 99.4% |
| openclaw | 782963ae66a0 | refactor: compact generated protocol metadata | lf-pinned | 15 | 15 | 29098831 | 261551 | 30142992 | 1047361 | 96.5% |
| openclaw | e28ad6a8697b | test: narrow changed-test routing for shared internals | lf-pinned | 2 | 2 | 29097566 | 73729 | 29319265 | 224899 | 99.2% |
| openclaw | 55d1cf87d7ca | refactor: compute base config schema at runtime | lf-pinned | 8 | 8 | 29080431 | 68973 | 29290603 | 213372 | 99.3% |
| openclaw | 64b1f5fbf498 | test: speed up changed test paths | lf-pinned | 7 | 7 | 29078209 | 80740 | 29323116 | 248107 | 99.2% |
| openclaw | 7d5ca3064a51 | fix: keep successful Mantis Slack summaries clean | lf-pinned | 2 | 2 | 29078272 | 59803 | 29258117 | 183045 | 99.4% |
| openclaw | b32d4c5255c5 | fix: avoid media completion fallback while announce pending | lf-pinned | 2 | 2 | 29075869 | 67697 | 29279874 | 207205 | 99.3% |
| openclaw | e6f5f5693d22 | ci: allow Slack Mantis failure evidence without screenshots | lf-pinned | 2 | 2 | 29075890 | 51151 | 29230701 | 158011 | 99.5% |
| openclaw | c1a385df8395 | fix(update): stop dev updates after fetch failure | lf-pinned | 2 | 2 | 29071744 | 75742 | 29300349 | 231805 | 99.2% |
| openclaw | 0c977cd68793 | fix: avoid early Slack credential leases in Mantis | lf-pinned | 3 | 3 | 29070941 | 62859 | 29261517 | 193776 | 99.3% |
| openclaw | 4fc352403a1a | fix: default Mantis Slack desktop smoke to AWS | lf-pinned | 4 | 4 | 29070710 | 64920 | 29266850 | 199340 | 99.3% |
| openclaw | 6f6b8fc4650c | fix(release): accept Docker OCI attestations and xAI reasoning defaults | lf-pinned | 9 | 9 | 29070134 | 60848 | 29254928 | 187994 | 99.4% |
| openclaw | 0283b05d702a | fix: harden Mantis Slack desktop gateway proof | lf-pinned | 2 | 2 | 29068790 | 57818 | 29244784 | 179194 | 99.4% |
| openclaw | c3a0fb9325c9 | test(live): bound provider discovery hooks | lf-pinned | 3 | 3 | 29068246 | 58274 | 29244830 | 179784 | 99.4% |
| openclaw | 3b1921b543ff | fix(core): avoid session export filename collisions (#77762) | lf-pinned | 2 | 2 | 29067706 | 50243 | 29219641 | 155135 | 99.5% |
| openclaw | a732208d4504 | fix(qqbot): avoid log export filename collisions (#77765) | lf-pinned | 2 | 2 | 29066989 | 49424 | 29216352 | 152563 | 99.5% |
| openclaw | 6caa365a7ab8 | fix: lease Slack credentials for Mantis gateway setup | lf-pinned | 3 | 3 | 29064546 | 61776 | 29253368 | 192022 | 99.3% |
| openclaw | 9fa685e3b3e4 | test(live): scope provider auth discovery | lf-pinned | 3 | 3 | 29063726 | 58090 | 29239694 | 179168 | 99.4% |
| openclaw | d862e9079342 | test(live): drop off-only Fireworks Kimi from high-signal sweep | lf-pinned | 2 | 2 | 29062851 | 55697 | 29230320 | 170669 | 99.4% |
| openclaw | 9c4a335007d7 | test(live): classify provider HTTP 5xx as server drift | lf-pinned | 2 | 2 | 29062332 | 49747 | 29212053 | 152921 | 99.5% |
| openclaw | f3d531439bc2 | feat: add reusable Mantis evidence publishing | lf-pinned | 8 | 8 | 29052639 | 86282 | 29326728 | 277289 | 99.1% |
| openclaw | 0720c1f77dd2 | fix: sanitize restart handoff diagnostics | lf-pinned | 2 | 2 | 29046670 | 50899 | 29199921 | 156451 | 99.5% |
| openclaw | 3e53580d6311 | refactor: format restart handoff diagnostics | lf-pinned | 2 | 2 | 29044639 | 50470 | 29196764 | 155325 | 99.5% |
| openclaw | 4a24b6dbc4d5 | fix: bound restart handoff ttl | lf-pinned | 2 | 2 | 29044414 | 50245 | 29195648 | 154434 | 99.5% |
| openclaw | acb0acd8dda4 | fix: add gateway supervisor restart handoff | lf-pinned | 5 | 5 | 29039686 | 63270 | 29235720 | 199234 | 99.3% |
| openclaw | f5f11b8d0e96 | fix(doctor): avoid impossible device token rotation advice | lf-pinned | 2 | 2 | 29038962 | 53002 | 29198677 | 162915 | 99.4% |
| openclaw | a34d4ef9d9e7 | fix: normalize video generation fallbacks | lf-pinned | 5 | 5 | 29024917 | 64275 | 29218972 | 197255 | 99.3% |
| openclaw | b4ff3aa73be0 | fix: record full Mantis desktop smoke videos | lf-pinned | 4 | 4 | 29024900 | 62280 | 29212618 | 190918 | 99.3% |
| openclaw | 557c5bf70521 | test(live): soften OpenAI cache telemetry floor | lf-pinned | 3 | 3 | 29018001 | 53279 | 29179718 | 164917 | 99.4% |
| openclaw | 1c3b27718fe8 | ci: shard package upgrade survivor baselines | lf-pinned | 13 | 13 | 28979829 | 156989 | 29460869 | 484240 | 98.4% |
| openclaw | 2e8761c5c154 | fix(plugins): repair missing openclaw peer links on update | lf-pinned | 3 | 3 | 28977438 | 83545 | 29229976 | 255738 | 99.1% |
| openclaw | 30bb88d80e99 | test(live): prefer stable OpenAI cache model | lf-pinned | 2 | 2 | 28965288 | 74320 | 29188581 | 226493 | 99.2% |
| openclaw | c84b7cbffcc3 | ci(release): speed up focused release reruns | lf-pinned | 11 | 11 | 28955946 | 181034 | 29508841 | 556095 | 98.1% |
| openclaw | 0131343db8c6 | docs(doctor): clarify configured plugin repair (#77613) | lf-pinned | 12 | 12 | 28955724 | 117212 | 29310856 | 358332 | 98.8% |
| openclaw | 7168896fdfed | fix(agents): abort post-compaction loops out-of-band | lf-pinned | 2 | 2 | 28953401 | 81593 | 29199738 | 249537 | 99.1% |
| openclaw | ed4b223cf252 | fix(agents): honor scoped post-compaction guard config | lf-pinned | 5 | 5 | 28952527 | 103728 | 29265748 | 316421 | 98.9% |
| openclaw | 1af6855bb0a6 | refactor(agents): thread post-compaction guard observer | lf-pinned | 7 | 7 | 28952581 | 136138 | 29365200 | 415819 | 98.6% |
| openclaw | e0fafdcc1d1d | fix(agents): observe post-compaction guard live | lf-pinned | 7 | 7 | 28953063 | 103378 | 29270424 | 320561 | 98.9% |
| openclaw | 3ba0f588ad56 | fix(agents): observe matched post-compaction tool outcomes | lf-pinned | 4 | 4 | 28952794 | 63757 | 29145929 | 196335 | 99.3% |
| openclaw | 5b863c719eba | fix(agents): address review feedback on post-compaction loop guard | lf-pinned | 3 | 3 | 28946987 | 93324 | 29228197 | 284410 | 99.0% |
| openclaw | 96e7461c8190 | feat(agents): add post-compaction loop guard module + config | lf-pinned | 4 | 4 | 28944469 | 99451 | 29245876 | 304607 | 99.0% |
| openclaw | 2f3a9629d837 | test: use latest kitchen sink canary | lf-pinned | 2 | 2 | 28942899 | 51499 | 29098080 | 158381 | 99.5% |
| openclaw | b378a912573e | test(live): retry cache probe text misses | lf-pinned | 2 | 2 | 28934590 | 52569 | 29093342 | 161952 | 99.4% |
| openclaw | b15682950588 | fix(acpx): resolve plugin manifest from bundled runtime | lf-pinned | 2 | 2 | 28930339 | 50741 | 29083087 | 155948 | 99.5% |
| openclaw | da0a97767833 | test(plugins): refresh kitchen sink docker fixture | lf-pinned | 2 | 2 | 28930162 | 50265 | 29081548 | 154586 | 99.5% |
| openclaw | d253392ea2a3 | fix(plugins): keep explicit web providers on fast path | lf-pinned | 2 | 2 | 28919904 | 81497 | 29165756 | 249052 | 99.1% |
| openclaw | cb9824d6b4a4 | test: add slack onboarding channel smoke (#77575) | lf-pinned | 8 | 8 | 28918929 | 80490 | 29163293 | 247564 | 99.2% |
| openclaw | cf1bd3050947 | test(plugins): add kitchen sink rpc walk | lf-pinned | 2 | 2 | 28913664 | 51347 | 29073577 | 163113 | 99.4% |
| openclaw | edb697e38955 | test(extensions): refresh dependency-backed assertions | lf-pinned | 2 | 2 | 28896921 | 48204 | 29041885 | 148164 | 99.5% |
| openclaw | d36287928259 | fix(plugins): normalize compat allowlist aliases | lf-pinned | 2 | 2 | 28892940 | 48147 | 29037992 | 148252 | 99.5% |
| openclaw | 40e0844133e0 | fix(plugins): preserve bundled allowlist edges | lf-pinned | 4 | 4 | 28892510 | 51083 | 29046964 | 157654 | 99.5% |
| openclaw | f738663c7967 | fix(plugins): add bundledMode to gate runtime provider discovery by allowlist | lf-pinned | 6 | 6 | 28888760 | 67482 | 29093588 | 208028 | 99.3% |
| openclaw | 81035e651bf7 | fix(config): register bundledMode in zod schema and help text | lf-pinned | 2 | 2 | 28888662 | 100207 | 29189655 | 304193 | 99.0% |
| openclaw | ce8bc1a3e39b | fix(lint): cover diagnostic phase events | lf-pinned | 3 | 3 | 28887311 | 75296 | 29113828 | 229717 | 99.2% |
| openclaw | 864b1be1b320 | fix: repair release validation checks | lf-pinned | 4 | 4 | 28887261 | 85543 | 29145170 | 261109 | 99.1% |
| openclaw | d6917edc5329 | fix: preserve gateway watch trace overrides | lf-pinned | 3 | 3 | 28882402 | 60243 | 29063608 | 184406 | 99.4% |
| openclaw | 35e48a049b2e | fix: enable sync io tracing in gateway watch | lf-pinned | 3 | 3 | 28882093 | 57309 | 29054732 | 175839 | 99.4% |
| openclaw | e84d4b27f44c | feat: add gateway stall diagnostics | lf-pinned | 13 | 13 | 28878860 | 127778 | 29269010 | 393350 | 98.7% |
| openclaw | 57ca91ff388e | fix(telegram): clarify model picker runtime scope | lf-pinned | 3 | 3 | 28848578 | 117228 | 29201234 | 355856 | 98.8% |
| openclaw | e091d912ceb2 | fix(model): guide runtime allowlist repairs | lf-pinned | 6 | 6 | 28847921 | 75757 | 29077046 | 232325 | 99.2% |
| openclaw | 343f859b900c | fix: preserve visible Discord labeled replies | lf-pinned | 2 | 2 | 28847035 | 50014 | 28997612 | 153777 | 99.5% |
| openclaw | e259938e9643 | fix: harden startup readiness and discord replies | lf-pinned | 12 | 12 | 28844331 | 77733 | 29084229 | 243098 | 99.2% |
| openclaw | 0909df1a4f3d | refactor: centralize reply followup drain lifecycle | lf-pinned | 5 | 5 | 28837875 | 103333 | 29150744 | 316069 | 98.9% |
| openclaw | 86385f72e98d | fix(update): use absolute npm script shell | lf-pinned | 2 | 2 | 28837289 | 57291 | 29010217 | 176128 | 99.4% |
| openclaw | fdaa5a0c3da1 | fix(update): exit post-core resume without result path | lf-pinned | 2 | 2 | 28833128 | 89011 | 29100425 | 270497 | 99.1% |
| openclaw | e2eb8e3cfe6f | test(plugins): harden kitchen sink live gauntlet | lf-pinned | 10 | 10 | 28829567 | 91464 | 29110267 | 283900 | 99.0% |
| openclaw | 0fc8afeac9a3 | test(package): cover stale source plugin shadows | lf-pinned | 7 | 7 | 28828014 | 84256 | 29083560 | 258746 | 99.1% |
| openclaw | 112924b11394 | fix(update): keep plugin install runtime aliases stable | lf-pinned | 2 | 2 | 28825594 | 51690 | 28984340 | 161946 | 99.4% |
| openclaw | b63336186ae1 | fix(update): stage npm-prefix package updates cleanly | lf-pinned | 3 | 3 | 28823928 | 70524 | 29038151 | 217423 | 99.3% |
| openclaw | 021373a4541e | ci(release): recover Windows packaged update no-restart timeout | lf-pinned | 2 | 2 | 28819757 | 82219 | 29066893 | 250336 | 99.1% |
| openclaw | 3af3fcfebe90 | fix(update): exit post-core package child | lf-pinned | 2 | 2 | 28818563 | 88739 | 29085239 | 269876 | 99.1% |
| openclaw | 3fb8c405eda4 | fix(update): finish post-core package updates | lf-pinned | 2 | 2 | 28817879 | 88055 | 29083846 | 269167 | 99.1% |
| openclaw | 94f8f1914e36 | test(release): match versioned Windows upgrade tarballs | lf-pinned | 2 | 2 | 28812518 | 82140 | 29059526 | 250208 | 99.1% |
| openclaw | 2e399e6f1ab3 | test(release): recover known Windows packaged upgrade timeout | lf-pinned | 2 | 2 | 28812020 | 81642 | 29058002 | 249182 | 99.1% |
| openclaw | 3921e1b0b7c7 | fix(process): kill Windows command trees on timeout | lf-pinned | 2 | 2 | 28811633 | 53646 | 28973171 | 164738 | 99.4% |
| openclaw | a3f6f24b79a5 | ci: gate slack live qa credentials | lf-pinned | 3 | 3 | 28811332 | 72087 | 29028675 | 220543 | 99.2% |
| openclaw | 9aad2b82c30b | Use trusted Windows browser helper root (#77469) | lf-pinned | 2 | 2 | 28808149 | 47206 | 28950472 | 145523 | 99.5% |
| openclaw | 417660b662cc | docs(plugins): explain catalog install trust | lf-pinned | 2 | 2 | 28807281 | 67532 | 29010213 | 206132 | 99.3% |
| openclaw | daefb5e3412f | fix(plugins): trust catalog package installs | lf-pinned | 3 | 3 | 28806999 | 67512 | 29010773 | 206974 | 99.3% |
| openclaw | 841eb81baf37 | chore: better explicit message on whatsapp | lf-pinned | 3 | 3 | 28806980 | 51643 | 28962459 | 158679 | 99.5% |
| openclaw | 2511be524466 | test(release): skip restart in package upgrade lane | lf-pinned | 2 | 2 | 28806778 | 81499 | 29051928 | 248350 | 99.1% |
| openclaw | 30e259b9c565 | test(qa-lab): accept native Windows paths | lf-pinned | 8 | 8 | 28786894 | 71996 | 29007268 | 223574 | 99.2% |
| openclaw | 9008031e96e3 | fix(qa-channel): settle aborted bus polls | lf-pinned | 2 | 2 | 28786570 | 48946 | 28934053 | 150683 | 99.5% |
| openclaw | 3d3b0dad7751 | test(whatsapp): accept native Windows auth paths | lf-pinned | 2 | 2 | 28786492 | 52485 | 28944329 | 161037 | 99.4% |
| openclaw | 0dd30c804cdf | test(memory): cover native Windows paths and locks | lf-pinned | 5 | 5 | 28786363 | 79327 | 29025760 | 242597 | 99.2% |
| openclaw | fa1d826a41cc | test(matrix): cover native Windows file semantics | lf-pinned | 4 | 4 | 28786256 | 56141 | 28955751 | 172695 | 99.4% |
| openclaw | 4f2f5e04610c | test(feishu): cover native Windows webhook and workspace paths | lf-pinned | 2 | 2 | 28785817 | 53857 | 28948685 | 166068 | 99.4% |
| openclaw | 03d04c243b86 | test(acpx): cover Windows extension test paths | lf-pinned | 3 | 3 | 28785525 | 55086 | 28951572 | 169247 | 99.4% |
| openclaw | c59c20e9fd48 | chore(ui): refresh fa control ui locale | lf-pinned | 2 | 2 | 28735470 | 57535 | 28908482 | 176212 | 99.4% |
| openclaw | 1ce136ce16bb | chore(ui): refresh nl control ui locale | lf-pinned | 2 | 2 | 28735488 | 57900 | 28909598 | 177310 | 99.4% |
| openclaw | 909894c8c439 | chore(ui): refresh th control ui locale | lf-pinned | 2 | 2 | 28735512 | 57217 | 28907563 | 175251 | 99.4% |
| openclaw | df7d18f6d316 | chore(ui): refresh vi control ui locale | lf-pinned | 2 | 2 | 28735531 | 57707 | 28909062 | 176731 | 99.4% |
| openclaw | 2db259503ba8 | chore(ui): refresh pl control ui locale | lf-pinned | 2 | 2 | 28735552 | 58054 | 28910127 | 177775 | 99.4% |
| openclaw | 4abba333fe6f | chore(ui): refresh id control ui locale | lf-pinned | 2 | 2 | 28735572 | 57706 | 28909100 | 176728 | 99.4% |
| openclaw | 0909ff16d9c4 | chore(ui): refresh uk control ui locale | lf-pinned | 2 | 2 | 28735592 | 58033 | 28910101 | 177709 | 99.4% |
| openclaw | 87e3f3779f38 | chore(ui): refresh it control ui locale | lf-pinned | 2 | 2 | 28735613 | 58247 | 28910769 | 178356 | 99.4% |
| openclaw | 863e8d0c38b2 | chore(ui): refresh tr control ui locale | lf-pinned | 2 | 2 | 28735635 | 57864 | 28909635 | 177200 | 99.4% |

## Replayed Files

### 1. openclaw 9324af7d46bf - test(perf): trim gateway session list fixtures

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b70a2451f8c9fac9b5724aab0e5d4d6f37bd6725`
- Commit: `9324af7d46bf362f929b2bd04d81eaf255cb37c4`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/server.reload.test.ts`
- `src/gateway/session-utils.test.ts`

### 2. openclaw 5d7878dff165 - test(perf): narrow codex session key test

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `855a7c7be79101d624484e991bb6b333501f233a`
- Commit: `5d7878dff1653c45e3ee488d44dcb65ac2f1f464`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/codex/src/app-server/run-attempt.test.ts`
- `extensions/codex/src/app-server/run-attempt.ts`

### 3. openclaw c4537fa6c3ca - test(perf): shorten codex app-server hot test

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cc9f88e6e62a586dc670ff1bfda7e1dcf1e8d0f7`
- Commit: `c4537fa6c3cae2fe2f2b59be95a35699cf080253`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/codex/src/app-server/run-attempt.test.ts`
- `extensions/codex/src/app-server/run-attempt.ts`

### 4. openclaw cc9f88e6e62a - ci: fix release cross-os loader path

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fc1e2c505ad0ba173b80e0193064798856caf5f4`
- Commit: `cc9f88e6e62a586dc670ff1bfda7e1dcf1e8d0f7`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/github/run-openclaw-cross-os-release-checks.sh`
- `src/gateway/gateway-codex-harness.live-helpers.test.ts`
- `src/gateway/gateway-codex-harness.live-helpers.ts`

### 5. openclaw fc1e2c505ad0 - fix(reply): preserve private group replies for text turns

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cf21cbafc4fa9b8382676fcb13e0a21827668ee4`
- Commit: `fc1e2c505ad0ba173b80e0193064798856caf5f4`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/auto-reply/reply/source-reply-delivery-mode.test.ts`
- `src/auto-reply/reply/source-reply-delivery-mode.ts`

### 6. openclaw cf21cbafc4fa - ci: harden release validation harness checks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9bcb56b45b16a8768697f2b92cf90078c124106e`
- Commit: `cf21cbafc4fa9b8382676fcb13e0a21827668ee4`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/github/run-openclaw-cross-os-release-checks.sh`
- `src/gateway/gateway-codex-harness.live-helpers.test.ts`
- `src/gateway/gateway-codex-harness.live-helpers.ts`

### 7. openclaw bb25e48972a9 - test(scripts): clean up temp dirs after each case (#78421)

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

### 8. openclaw 8256b747bec6 - test(perf): narrow provider contract imports

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `86c4809a4081047f40026f69c1910a54a6039832`
- Commit: `8256b747bec6f14297c4f511e5f80e115434d650`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/plugin-sdk/test-helpers/provider-contract.ts`
- `src/plugin-sdk/test-helpers/web-fetch-provider-contract.ts`
- `src/plugin-sdk/test-helpers/web-search-provider-contract.ts`
- `src/plugins/contracts/providers.contract.test.ts`
- `src/plugins/contracts/web-fetch-provider.contract.test.ts`

### 9. openclaw 86c4809a4081 - test(gateway): skip opencode acp image probe by default

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4996153b6debf8507a6e34a1e9eaa18a37dccf67`
- Commit: `86c4809a4081047f40026f69c1910a54a6039832`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/gateway/gateway-acp-bind.live.test.ts`
- `src/gateway/live-agent-probes.test.ts`
- `src/gateway/live-agent-probes.ts`

### 10. openclaw 7fd7f6f35591 - fix(gateway): mark chat slash commands as text

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e4b629c6d309a6a4e3eeca83c69f9e8f0ebc3074`
- Commit: `7fd7f6f355916ef1dbe3b5f0176a80ef44157a50`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/server-methods/chat.directive-tags.test.ts`
- `src/gateway/server-methods/chat.ts`

### 11. openclaw a2f1d1dfd8ab - fix(reply): keep text command replies visible

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5e218b402f832c4c12b772fb1cb2c2b96e1d161f`
- Commit: `a2f1d1dfd8ab464dcf08e91e79d4b7b6cd3fa658`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/auto-reply/reply/source-reply-delivery-mode.test.ts`
- `src/auto-reply/reply/source-reply-delivery-mode.ts`

### 12. openclaw 2dc8748b59d2 - test(gateway): accept compact codex status

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6c7c0e559a1c392ab4c1212edf1b1f56834c60d5`
- Commit: `2dc8748b59d2b2fa8d793908a05e526f855b60f3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/gateway-codex-harness.live-helpers.test.ts`
- `src/gateway/gateway-codex-harness.live-helpers.ts`

### 13. openclaw ff09f8022d5f - test(docker): scope live gateway discovery

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8a47c798267855611a83fcb9fb6f408458d235fe`
- Commit: `ff09f8022d5f29ab91bf58bd7457fed1f2b9fa7f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/lib/docker-e2e-scenarios.mjs`
- `src/gateway/gateway-models.profiles.live.test.ts`

### 14. openclaw 8a47c7982678 - test(docker): preserve live gateway heap

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `11f0aeeb62f6140500e1401b8b01ff4fffd8c2a3`
- Commit: `8a47c798267855611a83fcb9fb6f408458d235fe`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/test-live-gateway-models-docker.sh`
- `scripts/test-live.mjs`
- `src/gateway/gateway-models.profiles.live.test.ts`

### 15. openclaw 11f0aeeb62f6 - test(docker): use matrix live gateway image

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `359c60948f67c394463371478e2ec2dee9d31738`
- Commit: `11f0aeeb62f6140500e1401b8b01ff4fffd8c2a3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/lib/docker-e2e-scenarios.mjs`
- `scripts/test-live-gateway-models-docker.sh`

### 16. openclaw 64ab50e42bad - fix(update): preserve plugin warning context

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a3aa0a457feb3543d643e717dc42153e9b7a4034`
- Commit: `64ab50e42bad42156e275f5b0f8f02d237458e2c`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `scripts/e2e/lib/plugin-update/corrupt-update-scenario.sh`
- `scripts/e2e/lib/plugin-update/probe.mjs`
- `src/cli/update-cli.test.ts`
- `src/cli/update-cli/update-command.ts`

### 17. openclaw 1d3efb7e9eda - test(perf): trim focused runtime contract imports

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

### 18. openclaw 16321a27b64c - fix(talk): add bounded lifecycle logging

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

### 19. openclaw ceaa56fb1214 - fix(release): stabilize final validation checks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `bf0f5476323daa9df52694634385f6114ce7a065`
- Commit: `ceaa56fb12142d6e220c57f260ce3d57b8d1c335`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `scripts/e2e/lib/plugin-update/probe.mjs`
- `scripts/verify-docker-attestations.mjs`
- `src/agents/models.profiles.live.test.ts`
- `test/scripts/verify-docker-attestations.test.ts`

### 20. openclaw ffafa9008da2 - test(agents): avoid provider runtime in fallback tests

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a24d5fe79066acfa56288244b3852f4f322cdea1`
- Commit: `ffafa9008da249a07b2950d5747503d551a6e3da`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/model-fallback.probe.test.ts`
- `src/agents/model-fallback.test.ts`

### 21. openclaw a24d5fe79066 - perf(config): avoid duplicate plugin auto-enable channel probes

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `34dc7f6ea6fd6751ff1188b13d4c43a6d0224fe2`
- Commit: `a24d5fe79066acfa56288244b3852f4f322cdea1`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/config/plugin-auto-enable.detect.ts`
- `src/config/plugin-auto-enable.shared.ts`

### 22. openclaw 827e602d3a1b - fix(diagnostics): include talk events in stability snapshots

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8d9e7c8178b6e7db7d1c8340266a987456c0cf24`
- Commit: `827e602d3a1bb726aaf68a02229a25ff3d848fc0`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/logging/diagnostic-stability.test.ts`
- `src/logging/diagnostic-stability.ts`

### 23. openclaw 3fb1abcdcbc5 - test: isolate directory contract fixtures

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9edeffc751e1aa24f1833c5f37f0eaf024b18524`
- Commit: `3fb1abcdcbc556023e0d80ef75b219efb695aeb4`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/mattermost/src/channel.ts`
- `src/channels/plugins/contracts/test-helpers/threading-directory-contract-suites.ts`

### 24. openclaw 329580c64d13 - fix(onboard): recover externalized channel plugin from stale config (#78328)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `58f81b0e04ef0304fc604f378fbcee6be01b1cde`
- Commit: `329580c64d13657592c3fabb97ff567c2e292bb6`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/flows/channel-setup.test.ts`
- `src/flows/channel-setup.ts`

### 25. openclaw 3915089a25f3 - test: cache provider contract entries

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5969ac8ccf8b62d75023cbaadb416d28affac545`
- Commit: `3915089a25f349ee9ca3c4f10acde71d9d44cab3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/plugin-sdk/test-helpers/provider-contract.ts`
- `src/plugin-sdk/test-helpers/web-search-provider-contract.ts`

### 26. openclaw 6be5422fd640 - fix(gateway): avoid plugin model resolution in session lists

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ef517e1a5473bca69f19dee882421ef6412bc12f`
- Commit: `6be5422fd64072a09020d5297d7d683811a4ec5b`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/agents/model-selection.ts`
- `src/gateway/server.sessions.list-changed.test.ts`
- `src/gateway/session-utils.plugin-runtime.test.ts`
- `src/gateway/session-utils.test.ts`
- `src/gateway/session-utils.ts`

### 27. openclaw ef517e1a5473 - Preserve session list model normalization

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `948375f494f34327a9ccd10e3f2eef8c7c3d8171`
- Commit: `ef517e1a5473bca69f19dee882421ef6412bc12f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/session-utils.test.ts`
- `src/gateway/session-utils.ts`

### 28. openclaw 948375f494f3 - Optimize session list model row resolution

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8bfec5b9ac89cad4e696c12a7d6fca974b55a061`
- Commit: `948375f494f34327a9ccd10e3f2eef8c7c3d8171`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/session-utils.test.ts`
- `src/gateway/session-utils.ts`

### 29. openclaw d46859d88678 - fix: reuse plugin snapshot for agent metadata

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fe393e4427e3862eef1cb313f35039c5882c854e`
- Commit: `d46859d88678b220fd383f6c811aa9c4ef3f306f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/provider-auth-aliases.ts`
- `src/agents/skills/plugin-skills.ts`

### 30. openclaw fe393e4427e3 - fix: reuse plugin snapshot for read-only channels

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `df209586bda2e414d2181504698785838f9a5a9c`
- Commit: `fe393e4427e3862eef1cb313f35039c5882c854e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/channels/plugins/read-only-command-defaults.ts`
- `src/channels/plugins/read-only.ts`

### 31. openclaw 5655c2b0666d - fix: pass current snapshot to embedded runs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ba1800e1bd78faf658e8a3725980a60fdfc4a690`
- Commit: `5655c2b0666d83b263d503a6e3cecac75f387dde`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/pi-embedded-runner/compact.ts`
- `src/agents/pi-embedded-runner/run/attempt.ts`

### 32. openclaw ba1800e1bd78 - fix: reuse plugin snapshot for embedded settings

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `852b9e7246328d0a4b77a3cdfd92c3e7c66a3dd4`
- Commit: `ba1800e1bd78faf658e8a3725980a60fdfc4a690`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/pi-project-settings-snapshot.ts`
- `src/agents/pi-project-settings.bundle.test.ts`
- `src/agents/pi-project-settings.ts`

### 33. openclaw 8f3a34e2a18d - refactor: share fs-safe JSON helpers

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cf83c5827dd7785876dc3c92ad7c10cdf2196c9f`
- Commit: `8f3a34e2a18da4f0433bf878ca0c96f68d08e21a`
- Replay: patch applied with `lf-pinned` mode and 17 files matched target commit exactly

- `package.json`
- `src/agents/pi-project-settings-snapshot.ts`
- `src/infra/detect-package-manager.ts`
- `src/infra/json-files.ts`
- `src/infra/outbound/delivery-queue-storage.ts`
- `src/infra/package-json.test.ts`
- `src/infra/package-json.ts`
- `src/infra/package-update-utils.ts`
- `src/infra/session-delivery-queue-storage.ts`
- `src/media/store.ts`
- `src/plugins/bundle-commands.ts`
- `src/plugins/bundle-config-shared.ts`
- `src/plugins/bundle-lsp.ts`
- `src/plugins/bundle-manifest.ts`
- `src/plugins/bundle-mcp.test.ts`
- `src/plugins/bundle-mcp.ts`
- `src/plugins/discovery.ts`

### 34. openclaw 5107384e6766 - fix: stabilize Matrix tool progress QA (#78179)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `eb4d6547963ec7887ca7143858308299695bc410`
- Commit: `5107384e67668faef4129b93d4b17b274b545690`
- Replay: patch applied with `lf-pinned` mode and 11 files matched target commit exactly

- `extensions/matrix/src/approval-handler.runtime.test.ts`
- `extensions/matrix/src/approval-handler.runtime.ts`
- `extensions/qa-lab/src/providers/mock-openai/server.test.ts`
- `extensions/qa-lab/src/providers/mock-openai/server.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-media-fixtures.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-runtime-approval.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-runtime-e2ee.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-runtime-media.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-runtime-room.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-types.ts`
- `extensions/qa-matrix/src/runners/contract/scenarios.test.ts`

### 35. openclaw 7544beea1794 - fix: preserve embedded dispatcher timeouts

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `d52f581f76c217fe4d165df38a855982de085fea`
- Commit: `7544beea17943fa16b43bba670ffe089ba00091f`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/agents/pi-embedded-runner/run/attempt-http-runtime.ts`
- `src/agents/pi-embedded-runner/run/attempt.spawn-workspace.test-support.ts`
- `src/agents/pi-embedded-runner/run/attempt.spawn-workspace.timeout.test.ts`
- `src/infra/net/undici-global-dispatcher.test.ts`
- `src/infra/net/undici-global-dispatcher.ts`

### 36. openclaw d52f581f76c2 - fix: avoid fetch runtime proxy imports

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c9c66d7a1d5ca71c1c1b0329f1df61542bcdcade`
- Commit: `d52f581f76c217fe4d165df38a855982de085fea`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/infra/net/fetch-guard.ts`
- `src/plugin-sdk/fetch-runtime.test.ts`
- `src/proxy-capture/env.ts`

### 37. openclaw c9c66d7a1d5c - fix: restore no-proxy dispatcher boundary

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6807da544bf62eaa6c996fe3e0ab948cbf4c616d`
- Commit: `c9c66d7a1d5ca71c1c1b0329f1df61542bcdcade`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/net/undici-global-dispatcher.test.ts`
- `src/infra/net/undici-global-dispatcher.ts`

### 38. openclaw 6807da544bf6 - fix(net): preserve no-proxy undici stream timeouts

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6cf7ae1d98a26062c31b2bdf116a195cf0f21a99`
- Commit: `6807da544bf62eaa6c996fe3e0ab948cbf4c616d`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/net/undici-global-dispatcher.test.ts`
- `src/infra/net/undici-global-dispatcher.ts`

### 39. openclaw 95652d5867b6 - test: cover no-proxy undici startup

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `85ed972217b7c857522a3a9b6249b748d301756f`
- Commit: `95652d5867b6fe99aa2c6e3a2b95bd552ef933e1`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/infra/net/fetch-guard.ssrf.test.ts`
- `src/infra/net/proxy-fetch.test.ts`
- `src/infra/net/undici-global-dispatcher.test.ts`

### 40. openclaw 85ed972217b7 - fix: lazy-load undici dispatchers

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `98cbf7f11c35448072b5ae4a5086c28ee17164cb`
- Commit: `85ed972217b7c857522a3a9b6249b748d301756f`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/infra/net/proxy-fetch.ts`
- `src/infra/net/undici-global-dispatcher.ts`
- `src/infra/net/undici-runtime.ts`

### 41. openclaw 1672d35ef538 - perf: avoid no-op plugin auto-enable scans

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5da9f5e57c145de65c2dfcbba6f9b1845df0ecaa`
- Commit: `1672d35ef538dff212ebfa4f19379425d87d0efa`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/config/plugin-auto-enable.apply.ts`
- `src/config/plugin-auto-enable.shared.ts`

### 42. openclaw 5da9f5e57c14 - test: remove cli retry test waits

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fa2a32d0c5080c4d7eaf6ba9daa955b4cb8ee667`
- Commit: `5da9f5e57c145de65c2dfcbba6f9b1845df0ecaa`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/cli/logs-cli.test.ts`
- `src/cli/update-cli/restart-helper.test.ts`

### 43. openclaw 4ec693a81aaa - test: interleave cold full-suite shards

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `f531eff6292e9beaf3ff274321fb4d595b59d338`
- Commit: `4ec693a81aaa524c3dbaf8fdfe7dd2af30ece5ae`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/test-projects.mjs`
- `scripts/test-projects.test-support.mjs`
- `test/scripts/test-projects.test.ts`

### 44. openclaw 06c490f81894 - test: support higher vitest shard parallelism

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `981e32d05d3b3b420ef16473aed097a72787df82`
- Commit: `06c490f81894f785ed0c061496665a7b3b6ed5a6`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/vitest-process-group.mjs`
- `test/scripts/vitest-process-group.test.ts`

### 45. openclaw 1f6ce72b8aa4 - test: trim cron and context-engine waits

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8a68ea092d0a79e7d95f41f5fe59167a7f37dd92`
- Commit: `1f6ce72b8aa4e3a072d2fc3d1069f6c2da01ee58`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/pi-embedded-runner/run/attempt.spawn-workspace.context-engine.test.ts`
- `src/agents/pi-embedded-runner/run/attempt.spawn-workspace.test-support.ts`
- `src/gateway/server.cron.test.ts`

### 46. openclaw f2ce83833a71 - test: avoid spawning cli help in metadata test

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `963073088d41e900df2ecb5a879a5d1500f1f6a6`
- Commit: `f2ce83833a7187d2e6132ebc2b8d4d37f2a20eae`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/write-cli-startup-metadata.ts`
- `test/scripts/write-cli-startup-metadata.test.ts`

### 47. openclaw 6da5eda4880a - test: avoid real waits in cdp and outbound tests

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cbaf999bd26717ce74a1bb451b98ed2541727425`
- Commit: `6da5eda4880a82baf1ee18d5d175c67d40b6c7ae`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/browser/src/browser/cdp.internal.test.ts`
- `src/infra/outbound/message-action-runner.core-send.test.ts`

### 48. openclaw e9987ffc3aa0 - fix: clamp xAI live gateway thinking

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `afc2c2e20715b9d86deb1ddfacc9b31b08d3ac4e`
- Commit: `e9987ffc3aa0928486ce541952ce47713f6cad66`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `extensions/xai/provider-policy-api.ts`
- `src/gateway/gateway-models.profiles.live.test.ts`
- `src/plugins/provider-runtime.test.ts`
- `src/plugins/provider-runtime.ts`

### 49. openclaw afc2c2e20715 - test(browser): avoid real retry waits

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `1ded8de5a91cd23a5f80d6e5c513a7d8ab36073e`
- Commit: `afc2c2e20715b9d86deb1ddfacc9b31b08d3ac4e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/browser/src/browser/cdp.test.ts`
- `extensions/browser/src/browser/chrome.internal.test.ts`

### 50. openclaw d221d7b6a989 - fix(plugins): isolate peer-link repair failures

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4d248b887f39cb11920c3be1e3bb0d41a7b08496`
- Commit: `d221d7b6a98902e5e3e0c82a48f38a4b9bca7a55`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/plugins/update.test.ts`
- `src/plugins/update.ts`

### 51. openclaw 814b125f114c - fix(telegram): separate progress drafts from final replies

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e27f1793614a93917cd218173e615023f9e1012c`
- Commit: `814b125f114c60fb12a7074c65a747740dc88c37`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `docs/channels/telegram.md`
- `docs/concepts/streaming.md`
- `extensions/telegram/src/bot-message-dispatch.test.ts`
- `extensions/telegram/src/bot-message-dispatch.ts`

### 52. openclaw 748d6dc75e6a - test(qa): assert telegram streamed final count

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `512f777099eb19dfd1d7e07666ddda64e6bc0d28`
- Commit: `748d6dc75e6aa4df68de8d83a4d3f1284479b758`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qa-lab/src/live-transports/telegram/telegram-live.runtime.test.ts`
- `extensions/qa-lab/src/live-transports/telegram/telegram-live.runtime.ts`

### 53. openclaw 512f777099eb - test(qa): thread telegram long final prompts

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `25fc85afa2182c0d6bab2394a6f80d43d70d9874`
- Commit: `512f777099eb19dfd1d7e07666ddda64e6bc0d28`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qa-lab/src/live-transports/telegram/telegram-live.runtime.test.ts`
- `extensions/qa-lab/src/live-transports/telegram/telegram-live.runtime.ts`

### 54. openclaw 25fc85afa218 - test(telegram): cover single stream delivery

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `bca16d0f00c0a1da5cb3c589fa89fcd446967620`
- Commit: `25fc85afa2182c0d6bab2394a6f80d43d70d9874`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/telegram/src/bot-message-dispatch.test.ts`
- `extensions/telegram/src/lane-delivery.test.ts`

### 55. openclaw ebb8bed78f90 - fix: cap memory wiki filenames for safe writes

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `777c539dafc0b3fc1f1eafc7a4cc84076d63d177`
- Commit: `ebb8bed78f909365e8c5b557908bc0ee89244b41`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/memory-wiki/src/markdown.test.ts`
- `extensions/memory-wiki/src/markdown.ts`

### 56. openclaw 777c539dafc0 - fix: harden sandboxed patch parent paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cbc228f0f683189a325773e41cb7b284a88f9c42`
- Commit: `777c539dafc0b3fc1f1eafc7a4cc84076d63d177`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/apply-patch.test.ts`
- `src/agents/apply-patch.ts`

### 57. openclaw d71c11983f07 - chore(ui): refresh nl control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `186d247209a6e2b4ae38607f87e4f373db748522`
- Commit: `d71c11983f072b897def5c349024269f1a2dde7c`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/nl.meta.json`
- `ui/src/i18n/locales/nl.ts`

### 58. openclaw 186d247209a6 - chore(ui): refresh fa control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `020581ac7fd453b907ba6049ce3ba35e9a7a06d4`
- Commit: `186d247209a6e2b4ae38607f87e4f373db748522`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/fa.meta.json`
- `ui/src/i18n/locales/fa.ts`

### 59. openclaw 020581ac7fd4 - chore(ui): refresh vi control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `f51436868b2ae756e2891aab6656e1e3b0f324af`
- Commit: `020581ac7fd453b907ba6049ce3ba35e9a7a06d4`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/vi.meta.json`
- `ui/src/i18n/locales/vi.ts`

### 60. openclaw f51436868b2a - chore(ui): refresh th control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9ce00b77568eb9406e207a6a572239cbdae05ba3`
- Commit: `f51436868b2ae756e2891aab6656e1e3b0f324af`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/th.meta.json`
- `ui/src/i18n/locales/th.ts`

### 61. openclaw 9ce00b77568e - chore(ui): refresh pl control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a0a74608fffe9a0cfce74f04f1fb97d17b6c38bc`
- Commit: `9ce00b77568eb9406e207a6a572239cbdae05ba3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/pl.meta.json`
- `ui/src/i18n/locales/pl.ts`

### 62. openclaw a0a74608fffe - chore(ui): refresh id control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b868f4e2bed3f394599d2885120422d1f68dde01`
- Commit: `a0a74608fffe9a0cfce74f04f1fb97d17b6c38bc`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/id.meta.json`
- `ui/src/i18n/locales/id.ts`

### 63. openclaw b868f4e2bed3 - chore(ui): refresh uk control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4e867ea2c9dc573fdc0d189d2df3c7c4f8ccce9b`
- Commit: `b868f4e2bed3f394599d2885120422d1f68dde01`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/uk.meta.json`
- `ui/src/i18n/locales/uk.ts`

### 64. openclaw 4e867ea2c9dc - chore(ui): refresh tr control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `1a3d77531d58e19e630a9fef7c53e6321b881cbc`
- Commit: `4e867ea2c9dc573fdc0d189d2df3c7c4f8ccce9b`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/tr.meta.json`
- `ui/src/i18n/locales/tr.ts`

### 65. openclaw 1a3d77531d58 - chore(ui): refresh it control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b9eb969d9a818773f71a699a458545e5c458d997`
- Commit: `1a3d77531d58e19e630a9fef7c53e6321b881cbc`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/it.meta.json`
- `ui/src/i18n/locales/it.ts`

### 66. openclaw b9eb969d9a81 - chore(ui): refresh ar control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fc6737bd0ae182e836b4dc01fccd26383bf67395`
- Commit: `b9eb969d9a818773f71a699a458545e5c458d997`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/ar.meta.json`
- `ui/src/i18n/locales/ar.ts`

### 67. openclaw fc6737bd0ae1 - chore(ui): refresh fr control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c17bcb99e1fe5e4e29b60268f6536d54e0374f6e`
- Commit: `fc6737bd0ae182e836b4dc01fccd26383bf67395`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/fr.meta.json`
- `ui/src/i18n/locales/fr.ts`

### 68. openclaw c17bcb99e1fe - chore(ui): refresh ko control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `3cff0d3dc83786f2d24deb138173e5080b930d1a`
- Commit: `c17bcb99e1fe5e4e29b60268f6536d54e0374f6e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/ko.meta.json`
- `ui/src/i18n/locales/ko.ts`

### 69. openclaw 3cff0d3dc837 - chore(ui): refresh ja-JP control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `19071cc6a59766fdc09223e26d74a7ad12f554ce`
- Commit: `3cff0d3dc83786f2d24deb138173e5080b930d1a`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/ja-JP.meta.json`
- `ui/src/i18n/locales/ja-JP.ts`

### 70. openclaw 19071cc6a597 - chore(ui): refresh es control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `76e8f59f178a1a49430e39db85a20c9ff3511292`
- Commit: `19071cc6a59766fdc09223e26d74a7ad12f554ce`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/es.meta.json`
- `ui/src/i18n/locales/es.ts`

### 71. openclaw 76e8f59f178a - chore(ui): refresh zh-CN control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `931645e09043dd2eb685cec2ca370e41683d3808`
- Commit: `76e8f59f178a1a49430e39db85a20c9ff3511292`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/zh-CN.meta.json`
- `ui/src/i18n/locales/zh-CN.ts`

### 72. openclaw 931645e09043 - chore(ui): refresh zh-TW control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `47b65154ae09a383084d8b06c1c705e726438f27`
- Commit: `931645e09043dd2eb685cec2ca370e41683d3808`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/zh-TW.meta.json`
- `ui/src/i18n/locales/zh-TW.ts`

### 73. openclaw 47b65154ae09 - chore(ui): refresh de control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9111f8376537c6dfdf0f06f8010772c7f5a8739d`
- Commit: `47b65154ae09a383084d8b06c1c705e726438f27`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/de.meta.json`
- `ui/src/i18n/locales/de.ts`

### 74. openclaw 9111f8376537 - chore(ui): refresh pt-BR control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c17121b1cc4bd6a42ad5484ec58550173511d744`
- Commit: `9111f8376537c6dfdf0f06f8010772c7f5a8739d`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/pt-BR.meta.json`
- `ui/src/i18n/locales/pt-BR.ts`

### 75. openclaw e2858e70dde3 - chore: update channel status protocol models

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `60171e86388284a8844321bb091cc045483e7885`
- Commit: `e2858e70dde30bf925a4958dbc83d42f539d3fd0`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `apps/macos/Sources/OpenClawProtocol/GatewayModels.swift`
- `apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift`

### 76. openclaw ea391c6df280 - test: stabilize cron and pairing shard hangs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0bdba47a3e89fb2f17a64a0f64d3619da8b13b3d`
- Commit: `ea391c6df2800d65b81d46f8c0e3e9a02cc6a732`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/cron/service.runs-one-shot-main-job-disables-it.test.ts`
- `src/infra/device-pairing.test.ts`

### 77. openclaw ae7c13e28467 - test: restore current-main test isolation

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `bff5051e38e1a2ac1c0ab6aeb88504480d334ea9`
- Commit: `ae7c13e284677a222db3a23e7bbce07bb76f4e72`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qqbot/src/engine/api/media-chunked.test.ts`
- `extensions/voice-call/src/runtime.test.ts`

### 78. openclaw 8b9b849b19c4 - test: align fs-safe race expectations

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9671a915908e35e0e2275945c17961b6f10d61e4`
- Commit: `8b9b849b19c46db8bbeb346123b311a8ed63df14`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/archive.test.ts`
- `src/infra/fs-safe.test.ts`

### 79. openclaw 9e108fa9a762 - fix: repair fs-safe ci expectations

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b43efd37935c1fa4082adb7019f63491829cc3e8`
- Commit: `9e108fa9a76207da1af672f2929b554cca9a1b0f`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/auto-reply/reply.triggers.trigger-handling.stages-inbound-media-into-sandbox-workspace.test.ts`
- `src/plugins/contracts/extension-package-project-boundaries.test.ts`

### 80. openclaw b43efd37935c - fix: clean up post-land CI guards

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `82942295921eb98da0c697e046b409431e072c4d`
- Commit: `b43efd37935c1fa4082adb7019f63491829cc3e8`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `extensions/diagnostics-otel/src/service.ts`
- `extensions/voice-call/src/realtime-fast-context.test.ts`
- `src/agents/bash-tools.exec.script-preflight.test.ts`
- `src/infra/fs-safe.test.ts`
- `src/media-understanding/media-understanding-misc.test.ts`

### 81. openclaw 82942295921e - test: refresh fs-safe boundary expectations

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a6a4140ee71a92e9be56ac825c627ef778d7face`
- Commit: `82942295921eb98da0c697e046b409431e072c4d`
- Replay: patch applied with `lf-pinned` mode and 6 files matched target commit exactly

- `extensions/memory-core/src/memory/manager.read-file.test.ts`
- `extensions/zalouser/src/zalo-js.credentials.test.ts`
- `src/agents/apply-patch.test.ts`
- `src/agents/subagent-registry.persistence.test.ts`
- `src/infra/archive.test.ts`
- `src/plugins/contracts/extension-package-project-boundaries.test.ts`

### 82. openclaw a6a4140ee71a - fix(media): handle canonical inbound media paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `d47c624370af03528566267a7fb291a2e05c7861`
- Commit: `a6a4140ee71a92e9be56ac825c627ef778d7face`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/auto-reply/reply.triggers.trigger-handling.stages-inbound-media-into-sandbox-workspace.test.ts`
- `src/auto-reply/reply/stage-sandbox-media.ts`
- `src/media-understanding/media-understanding-url-fallback.test.ts`
- `src/media/image-ops.tempdir.test.ts`
- `src/media/media-reference.ts`

### 83. openclaw 057d3a43c049 - feat(mantis): capture logged-in discord web evidence

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `20163313afc5f2b67197160c1269b9100ee20b73`
- Commit: `057d3a43c049602326a475ff197f9f3593cdab75`
- Replay: patch applied with `lf-pinned` mode and 8 files matched target commit exactly

- `.github/workflows/mantis-discord-thread-attachment.yml`
- `docs/concepts/mantis.md`
- `docs/concepts/qa-e2e-automation.md`
- `extensions/qa-lab/src/live-transports/discord/discord-live.runtime.test.ts`
- `extensions/qa-lab/src/live-transports/discord/discord-live.runtime.ts`
- `extensions/qa-lab/src/mantis/cli.ts`
- `extensions/qa-lab/src/mantis/desktop-browser-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/desktop-browser-smoke.runtime.ts`

### 84. openclaw 20163313afc5 - fix: resolve fs-safe post-land fallout

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `71cd132f1f3dec572c8b17ede9072542120c6acd`
- Commit: `20163313afc5f2b67197160c1269b9100ee20b73`
- Replay: patch applied with `lf-pinned` mode and 13 files matched target commit exactly

- `config/knip.config.ts`
- `extensions/qqbot/src/engine/api/media-chunked.ts`
- `extensions/slack/src/monitor/provider-support.ts`
- `package.json`
- `packages/memory-host-sdk/src/host/fs-utils.ts`
- `src/auto-reply/reply.triggers.trigger-handling.stages-inbound-media-into-sandbox-workspace.test.ts`
- `src/auto-reply/reply/commands-export-session.test.ts`
- `src/infra/archive.test.ts`
- `src/infra/tmp-openclaw-dir.ts`
- `src/media-understanding/media-understanding-url-fallback.test.ts`
- `src/media/image-ops.tempdir.test.ts`
- `src/media/media-reference.test.ts`
- `test/scripts/lint-suppressions.test.ts`

### 85. openclaw df296823844f - test: update talk unit-fast paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e02ddf71afad3f0421c810aaff950c4105de3d7c`
- Commit: `df296823844f9cb232c3fd47b60702913d0db4ed`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `test/vitest-unit-fast-config.test.ts`
- `test/vitest/vitest.unit-fast-paths.mjs`

### 86. openclaw e02ddf71afad - fix: guard managed talk room control

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0402ae327ed4de1f870984412274ca93a6707930`
- Commit: `e02ddf71afad3f0421c810aaff950c4105de3d7c`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/gateway/server-methods/talk-session.ts`
- `src/gateway/server-methods/talk.test.ts`

### 87. openclaw ada560ece4eb - feat: adapt voice surfaces to talk events

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9e6f38f4e1a29b4787c0742919eb9ea4649b3f29`
- Commit: `ada560ece4ebacb756a07db8cabb15969ae13cf8`
- Replay: patch applied with `lf-pinned` mode and 14 files matched target commit exactly

- `extensions/diagnostics-otel/src/service.ts`
- `extensions/google-meet/index.test.ts`
- `extensions/google-meet/src/agent-consult.ts`
- `extensions/google-meet/src/realtime-node.ts`
- `extensions/google-meet/src/realtime.ts`
- `extensions/google-meet/src/transports/types.ts`
- `extensions/voice-call/src/media-stream.test.ts`
- `extensions/voice-call/src/media-stream.ts`
- `extensions/voice-call/src/realtime-fast-context.test.ts`
- `extensions/voice-call/src/realtime-fast-context.ts`
- `extensions/voice-call/src/webhook.test.ts`
- `extensions/voice-call/src/webhook.ts`
- `extensions/voice-call/src/webhook/realtime-handler.test.ts`
- `extensions/voice-call/src/webhook/realtime-handler.ts`

### 88. openclaw 9e6f38f4e1a2 - feat: unify browser realtime talk clients

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `466f7183207d7bbea206e061d4d1afc5c7a734eb`
- Commit: `9e6f38f4e1a29b4787c0742919eb9ea4649b3f29`
- Replay: patch applied with `lf-pinned` mode and 9 files matched target commit exactly

- `ui/src/ui/chat/realtime-talk-gateway-relay.ts`
- `ui/src/ui/chat/realtime-talk-google-live.ts`
- `ui/src/ui/chat/realtime-talk-shared.ts`
- `ui/src/ui/chat/realtime-talk-webrtc.ts`
- `ui/src/ui/chat/realtime-talk.ts`
- `ui/src/ui/realtime-talk-gateway-relay.test.ts`
- `ui/src/ui/realtime-talk-google-live.test.ts`
- `ui/src/ui/realtime-talk-webrtc.test.ts`
- `ui/src/ui/realtime-talk.test.ts`

### 89. openclaw 7225a2678e8c - feat: expose talk-capable realtime providers

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c90c68c6360a49d5a0f86ab7a53c2ed60bf568c6`
- Commit: `7225a2678e8c3fa155f6bd94f77280c12ac65381`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `extensions/google/realtime-voice-provider.test.ts`
- `extensions/google/realtime-voice-provider.ts`
- `extensions/openai/realtime-voice-provider.test.ts`
- `extensions/openai/realtime-voice-provider.ts`

### 90. openclaw c90c68c6360a - feat: add shared talk runtime primitives

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `24853ced114ac2612d654255cc85549c579c09bc`
- Commit: `c90c68c6360a49d5a0f86ab7a53c2ed60bf568c6`
- Replay: patch applied with `lf-pinned` mode and 12 files matched target commit exactly

- `src/plugin-sdk/realtime-voice.ts`
- `src/plugins/types.ts`
- `src/realtime-voice/agent-talkback-runtime.test.ts`
- `src/realtime-voice/agent-talkback-runtime.ts`
- `src/realtime-voice/fast-context-runtime.ts`
- `src/realtime-voice/provider-types.ts`
- `src/realtime-voice/session-log-runtime.test.ts`
- `src/realtime-voice/session-log-runtime.ts`
- `src/realtime-voice/talk-events.test.ts`
- `src/realtime-voice/talk-events.ts`
- `src/realtime-voice/talk-session-controller.test.ts`
- `src/realtime-voice/talk-session-controller.ts`

### 91. openclaw 601b4819cb0c - test: refresh plugin loader boundary assertions

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `538605ff44d23e4e57ecfd72a8f0b20159ffebbf`
- Commit: `601b4819cb0c212c15fb69b24570337ba1478985`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/plugins/runtime-registry-boundary.test.ts`
- `src/plugins/setup-registry.test.ts`

### 92. openclaw 384432fd2250 - test: isolate media factory planning imports

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fcf0561da0ba68ff91933f71aab22a4c3f2de0e1`
- Commit: `384432fd2250ede09b5495a5381f7122903e37ad`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/openclaw-tools.media-factory-plan.test.ts`
- `src/agents/openclaw-tools.media-factory-plan.ts`
- `src/agents/openclaw-tools.ts`

### 93. openclaw e3b0707a5392 - fix: preserve source plugin loading fallbacks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `05eda57b3c72e61d31a07c38df2edb3ef0843c62`
- Commit: `e3b0707a539214f2732502a0f25b07e393ec61a9`
- Replay: patch applied with `lf-pinned` mode and 11 files matched target commit exactly

- `src/plugins/compat/registry.test.ts`
- `src/plugins/contracts/plugin-sdk-runtime-api-guardrails.test.ts`
- `src/plugins/loader.test.ts`
- `src/plugins/native-module-require.test.ts`
- `src/plugins/native-module-require.ts`
- `src/plugins/plugin-module-loader-cache.test.ts`
- `src/plugins/plugin-module-loader-cache.ts`
- `src/plugins/runtime/runtime-plugin-boundary.ts`
- `src/plugins/session-entry-slot-keys.ts`
- `src/plugins/setup-registry.test.ts`
- `src/plugins/source-checkout-runtime.test.ts`

### 94. openclaw 271aac42e4c4 - test: isolate cli provider model-selection coverage

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `d193d15f1745736c4e7509e870314fa94ec80f5a`
- Commit: `271aac42e4c48e7fd705b67e0d5ce424d7310f03`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/model-selection-cli.test.ts`
- `src/agents/model-selection.test.ts`

### 95. openclaw d11160545383 - test: streamline model fallback probe coverage

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `1daba5240bb27e61f6bc4ee44287512284f7f181`
- Commit: `d11160545383563ab366b79d60aa348c8acb233f`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/model-fallback.probe.test.ts`
- `src/agents/model-fallback.test.ts`
- `src/agents/model-fallback.ts`

### 96. openclaw 093b2b9b5f97 - test: speed extension and contract scenarios

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cb42efb6e660b39ad7ab94e23a454105bfcbc7a3`
- Commit: `093b2b9b5f9704bc5645969d11aeb421fb43739b`
- Replay: patch applied with `lf-pinned` mode and 16 files matched target commit exactly

- `extensions/active-memory/index.test.ts`
- `extensions/active-memory/index.ts`
- `extensions/google-meet/index.test.ts`
- `extensions/matrix/src/matrix/thread-bindings.test.ts`
- `extensions/qa-lab/src/lab-server.test.ts`
- `extensions/qa-lab/src/lab-server.ts`
- `extensions/qa-lab/src/lab-server.types.ts`
- `extensions/qa-lab/src/self-check-scenario.ts`
- `extensions/qa-lab/src/self-check.ts`
- `extensions/qa-matrix/src/runners/contract/scenario-runtime-cli.ts`
- `scripts/lib/config-boundary-guard.mjs`
- `src/config/plugin-auto-enable.core.test.ts`
- `src/gateway/server-http.test-harness.ts`
- `src/gateway/server.chat.gateway-server-chat.test.ts`
- `src/plugins/contracts/plugin-sdk-package-contract-guardrails.test.ts`
- `src/plugins/contracts/plugin-sdk-root-alias.test.ts`

### 97. openclaw cb42efb6e660 - test: trim slow agent fallback coverage

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e428a2dfe2a3c9174e6bf1b5bafd92e2cbb095cd`
- Commit: `cb42efb6e660b39ad7ab94e23a454105bfcbc7a3`
- Replay: patch applied with `lf-pinned` mode and 7 files matched target commit exactly

- `src/agents/model-fallback.test.ts`
- `src/agents/model-fallback.ts`
- `src/agents/model-selection.test.ts`
- `src/agents/outcome-fallback-runtime-contract.test.ts`
- `src/agents/pi-tools.policy.test.ts`
- `src/agents/tools/message-tool.test.ts`
- `src/config/doc-baseline.integration.test.ts`

### 98. openclaw e428a2dfe2a3 - test: add focused seams for faster isolated tests

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `46c99cff0b2ff3fe744bb954b4bd8336907b979a`
- Commit: `e428a2dfe2a3c9174e6bf1b5bafd92e2cbb095cd`
- Replay: patch applied with `lf-pinned` mode and 9 files matched target commit exactly

- `extensions/codex/src/app-server/run-attempt.test.ts`
- `extensions/codex/src/app-server/run-attempt.ts`
- `src/agents/provider-model-normalization.runtime.ts`
- `src/commands/sessions.test.ts`
- `src/commands/sessions.ts`
- `src/logging.ts`
- `src/logging/logger-settings.test.ts`
- `src/logging/logger.ts`
- `src/plugin-sdk/agent-harness-runtime.ts`

### 99. openclaw dd643b52df44 - test: expand slack live qa coverage (#77713)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `33c42c8d3b65dad62a7317345356aa2cb3bd5056`
- Commit: `dd643b52df44273f1ebf9975bc42373b3118c793`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `docs/concepts/qa-e2e-automation.md`
- `extensions/qa-lab/src/live-transports/slack/slack-live.runtime.test.ts`
- `extensions/qa-lab/src/live-transports/slack/slack-live.runtime.ts`

### 100. openclaw 1ff07517b0c3 - test(secrets): trust source plugin contracts in coverage

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `add9a49c40f90353632a9153552cdce0b981bc8d`
- Commit: `1ff07517b0c3d5d05af0fb0e2875be9ccaec873b`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/secrets/runtime.coverage.test.ts`
- `src/secrets/target-registry.docs.test.ts`

### 101. openclaw add9a49c40f9 - test: cover generated media delivery evidence fallback

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a0ea07e462f66d73bdbbd7cbd2e5d456c860ba60`
- Commit: `add9a49c40f90353632a9153552cdce0b981bc8d`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/pi-embedded-subscribe.tools.ts`
- `src/agents/subagent-announce-delivery.test.ts`

### 102. openclaw 01dda73e9bb1 - Revert "test: narrow changed-test routing for shared internals"

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6455ed24cffd55e09e81f76b12687f2bb1c7b204`
- Commit: `01dda73e9bb1ecb787e2762612fc3bb586d731a0`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/test-projects.test-support.mjs`
- `test/scripts/test-projects.test.ts`

### 103. openclaw 6455ed24cffd - test: scope unit coverage gate

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c319f3c4d583a69545713753de5f31d0abf11aed`
- Commit: `6455ed24cffd55e09e81f76b12687f2bb1c7b204`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `docs/reference/test.md`
- `test/vitest-unit-config.test.ts`
- `test/vitest/vitest.unit.config.ts`

### 104. openclaw c319f3c4d583 - fix: mark accepted Mantis remote runs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `d65d401c29f4d15548e18f23cc0987f3649c3173`
- Commit: `c319f3c4d583a69545713753de5f31d0abf11aed`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.ts`

### 105. openclaw 782963ae66a0 - refactor: compact generated protocol metadata

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9abf01faf01b1118b0456104d0814c601201b7ce`
- Commit: `782963ae66a0d129ab3a7c54a5cd789f7af5b367`
- Replay: patch applied with `lf-pinned` mode and 15 files matched target commit exactly

- `extensions/codex/src/app-server/protocol-generated/json/DynamicToolCallParams.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/ErrorNotification.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/GetAccountResponse.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/ModelListResponse.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/ThreadResumeResponse.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/ThreadStartResponse.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/TurnCompletedNotification.json`
- `extensions/codex/src/app-server/protocol-generated/json/v2/TurnStartResponse.json`
- `extensions/codex/src/app-server/run-attempt.ts`
- `scripts/check-codex-app-server-protocol.ts`
- `scripts/generate-bundled-channel-config-metadata.ts`
- `scripts/lib/plugin-npm-package-manifest.mjs`
- `scripts/sync-codex-app-server-protocol.ts`
- `src/config/bundled-channel-config-metadata.generated.ts`
- `src/plugin-sdk/agent-harness-runtime.ts`

### 106. openclaw e28ad6a8697b - test: narrow changed-test routing for shared internals

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `84e8e0972570c58067b6aaff443374bc92fcb7d8`
- Commit: `e28ad6a8697baddd4cd828690c56e895f444e984`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/test-projects.test-support.mjs`
- `test/scripts/test-projects.test.ts`

### 107. openclaw 55d1cf87d7ca - refactor: compute base config schema at runtime

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7dc6007aeea23e4fa8c96db0eaabc455e412a0ce`
- Commit: `55d1cf87d7ca6f3543d7bec2f6c5d11f27ee4c07`
- Replay: patch applied with `lf-pinned` mode and 8 files matched target commit exactly

- `scripts/changed-lanes.mjs`
- `scripts/check-release-metadata-only.mjs`
- `scripts/generate-base-config-schema.ts`
- `src/config/schema.base.generated.test.ts`
- `src/config/schema.ts`
- `src/plugins/contracts/config-footprint-guardrails.test.ts`
- `test/helpers/config/config-honor-audit.ts`
- `test/scripts/changed-lanes.test.ts`

### 108. openclaw 64b1f5fbf498 - test: speed up changed test paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7d5ca3064a513aebc84083c2a1d48b674c9e96c8`
- Commit: `64b1f5fbf498b4b87d3e60e42e61a071f1f4d787`
- Replay: patch applied with `lf-pinned` mode and 7 files matched target commit exactly

- `src/agents/model-fallback-observation.ts`
- `src/agents/model-fallback.probe.test.ts`
- `src/agents/model-fallback.ts`
- `src/commands/models.list.e2e.test.ts`
- `src/config/sessions/transcript-append.ts`
- `src/plugin-activation-boundary.test.ts`
- `src/plugins/bundled-plugin-metadata.test.ts`

### 109. openclaw 7d5ca3064a51 - fix: keep successful Mantis Slack summaries clean

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5fae1c32b5f8e33c9fabcad0cc3cbdbc6e899051`
- Commit: `7d5ca3064a513aebc84083c2a1d48b674c9e96c8`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.ts`

### 110. openclaw b32d4c5255c5 - fix: avoid media completion fallback while announce pending

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fd86ab2e50038eeffb9e106a6ffb77634c83a2b1`
- Commit: `b32d4c5255c5d3ad089bf9a8c6dc25cf9e46c563`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/subagent-announce-delivery.test.ts`
- `src/agents/subagent-announce-delivery.ts`

### 111. openclaw e6f5f5693d22 - ci: allow Slack Mantis failure evidence without screenshots

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `04442f4c059faa5206437f075391a029e18fe394`
- Commit: `e6f5f5693d2204d355b8b50e4ec427d411be3040`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `.github/workflows/mantis-slack-desktop-smoke.yml`
- `test/scripts/mantis-publish-pr-evidence.test.ts`

### 112. openclaw c1a385df8395 - fix(update): stop dev updates after fetch failure

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `10725c9e01444975ed052cc3df5c30feb548f72d`
- Commit: `c1a385df8395a48bb8bf108994aff8cb0d239e07`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/update-runner.test.ts`
- `src/infra/update-runner.ts`

### 113. openclaw 0c977cd68793 - fix: avoid early Slack credential leases in Mantis

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `70d92b5e59df55d6d3d26f2cdb1d6f188182257a`
- Commit: `0c977cd687939eb61f80f6d5d78d57aa9a809e7d`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `.github/workflows/mantis-slack-desktop-smoke.yml`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.ts`

### 114. openclaw 4fc352403a1a - fix: default Mantis Slack desktop smoke to AWS

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7c13004883f6c9dd8e74da7f5913526117661ef8`
- Commit: `4fc352403a1a6aaa6cf31ea5d9973cacfe3a7148`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `.github/workflows/mantis-slack-desktop-smoke.yml`
- `docs/concepts/mantis.md`
- `extensions/qa-lab/src/mantis/cli.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`

### 115. openclaw 6f6b8fc4650c - fix(release): accept Docker OCI attestations and xAI reasoning defaults

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0283b05d702a1666dc760ea2005ebaf6cc7268bd`
- Commit: `6f6b8fc4650c6b94d0b6e85a0ebe826f01c1185c`
- Replay: patch applied with `lf-pinned` mode and 9 files matched target commit exactly

- `extensions/xai/api.ts`
- `extensions/xai/index.test.ts`
- `extensions/xai/index.ts`
- `extensions/xai/provider-models.ts`
- `extensions/xai/runtime-model-compat.ts`
- `extensions/xai/web-search.test.ts`
- `scripts/verify-docker-attestations.mjs`
- `src/agents/xai.live.test.ts`
- `test/scripts/verify-docker-attestations.test.ts`

### 116. openclaw 0283b05d702a - fix: harden Mantis Slack desktop gateway proof

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c3a0fb9325c95f6ae7a8b5bca792f64adb08c71e`
- Commit: `0283b05d702a1666dc760ea2005ebaf6cc7268bd`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.ts`

### 117. openclaw c3a0fb9325c9 - test(live): bound provider discovery hooks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `3b1921b543ff6de4d7dcabd5a6d3b35d663d914a`
- Commit: `c3a0fb9325c95f6ae7a8b5bca792f64adb08c71e`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/models.profiles.live.test.ts`
- `src/agents/pi-auth-discovery.external-cli.test.ts`
- `src/agents/pi-auth-discovery.ts`

### 118. openclaw 3b1921b543ff - fix(core): avoid session export filename collisions (#77762)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a732208d45040bcac5c657196264654434f5bac3`
- Commit: `3b1921b543ff6de4d7dcabd5a6d3b35d663d914a`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/auto-reply/reply/commands-export-session.test.ts`
- `src/auto-reply/reply/commands-export-session.ts`

### 119. openclaw a732208d4504 - fix(qqbot): avoid log export filename collisions (#77765)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6caa365a7ab88f1bb63b35ecd37fcfa73b7bad96`
- Commit: `a732208d45040bcac5c657196264654434f5bac3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qqbot/src/engine/commands/builtin/log-helpers.test.ts`
- `extensions/qqbot/src/engine/commands/builtin/log-helpers.ts`

### 120. openclaw 6caa365a7ab8 - fix: lease Slack credentials for Mantis gateway setup

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9fa685e3b3e48da193be74e13737b4eb746de887`
- Commit: `6caa365a7ab88f1bb63b35ecd37fcfa73b7bad96`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `docs/concepts/mantis.md`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.ts`

### 121. openclaw 9fa685e3b3e4 - test(live): scope provider auth discovery

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `678323d013907974ae75bcdde857de99454ff3f5`
- Commit: `9fa685e3b3e48da193be74e13737b4eb746de887`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/models.profiles.live.test.ts`
- `src/agents/pi-auth-discovery.external-cli.test.ts`
- `src/agents/pi-auth-discovery.ts`

### 122. openclaw d862e9079342 - test(live): drop off-only Fireworks Kimi from high-signal sweep

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6410743e34b0b26f14ba0dfd9c1bed66d4d92894`
- Commit: `d862e9079342592446096e3c5992db6dc297bb46`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/live-model-filter.ts`
- `src/agents/model-compat.test.ts`

### 123. openclaw 9c4a335007d7 - test(live): classify provider HTTP 5xx as server drift

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `61383aff4b8d9cc5def678d01dce9d5d2f111e79`
- Commit: `9c4a335007d7897a94910925f44dc2a4286ff6e1`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/pi-embedded-helpers/failover-matches.test.ts`
- `src/agents/pi-embedded-helpers/failover-matches.ts`

### 124. openclaw f3d531439bc2 - feat: add reusable Mantis evidence publishing

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5a0d6c7ad86b8d9906571142ecb48ac06144b7a1`
- Commit: `f3d531439bc2d4bb9a48e0db1a6fa04ba177b798`
- Replay: patch applied with `lf-pinned` mode and 8 files matched target commit exactly

- `.github/workflows/mantis-discord-status-reactions.yml`
- `.github/workflows/mantis-scenario.yml`
- `.github/workflows/mantis-slack-desktop-smoke.yml`
- `docs/concepts/mantis.md`
- `extensions/qa-lab/src/mantis/run.runtime.ts`
- `scripts/mantis/publish-pr-evidence.mjs`
- `scripts/test-projects.test-support.mjs`
- `test/scripts/mantis-publish-pr-evidence.test.ts`

### 125. openclaw 0720c1f77dd2 - fix: sanitize restart handoff diagnostics

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6d485a9f366d9aaae1d643fa5802a2e765dd58ed`
- Commit: `0720c1f77dd2a9ab61c8533a1557a5b4f1068a24`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/restart-handoff.test.ts`
- `src/infra/restart-handoff.ts`

### 126. openclaw 3e53580d6311 - refactor: format restart handoff diagnostics

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4a24b6dbc4d5798527ac7c9e79083fd640dc762e`
- Commit: `3e53580d6311b14fc3000c23e3f15bf8e6c2baee`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/restart-handoff.test.ts`
- `src/infra/restart-handoff.ts`

### 127. openclaw 4a24b6dbc4d5 - fix: bound restart handoff ttl

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `acb0acd8dda45401fdcee69bc97271daf96d42aa`
- Commit: `4a24b6dbc4d5798527ac7c9e79083fd640dc762e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/restart-handoff.test.ts`
- `src/infra/restart-handoff.ts`

### 128. openclaw acb0acd8dda4 - fix: add gateway supervisor restart handoff

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `f9da4843652e28678839f9c0f927ae33840281ff`
- Commit: `acb0acd8dda45401fdcee69bc97271daf96d42aa`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/cli/gateway-cli/lifecycle.runtime.ts`
- `src/cli/gateway-cli/run-loop.test.ts`
- `src/cli/gateway-cli/run-loop.ts`
- `src/infra/restart-handoff.test.ts`
- `src/infra/restart-handoff.ts`

### 129. openclaw f5f11b8d0e96 - fix(doctor): avoid impossible device token rotation advice

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cbcca6e55ff751f0c6a77f37865c181aa429ddd3`
- Commit: `f5f11b8d0e963ca9227af58ad996f4dbdfa17123`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/commands/doctor-device-pairing.test.ts`
- `src/commands/doctor-device-pairing.ts`

### 130. openclaw a34d4ef9d9e7 - fix: normalize video generation fallbacks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b4ff3aa73be0518b975552bbb40be6891d6e59a9`
- Commit: `a34d4ef9d9e772f1121525092928b9f423a546d8`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `extensions/fal/video-generation-provider.ts`
- `extensions/google/video-generation-provider.test.ts`
- `extensions/google/video-generation-provider.ts`
- `extensions/minimax/video-generation-provider.test.ts`
- `extensions/minimax/video-generation-provider.ts`

### 131. openclaw b4ff3aa73be0 - fix: record full Mantis desktop smoke videos

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `42a7d8485fa5aa02b34a5ebf9c2ed6b422f362b9`
- Commit: `b4ff3aa73be0518b975552bbb40be6891d6e59a9`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `extensions/qa-lab/src/mantis/desktop-browser-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/desktop-browser-smoke.runtime.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.test.ts`
- `extensions/qa-lab/src/mantis/slack-desktop-smoke.runtime.ts`

### 132. openclaw 557c5bf70521 - test(live): soften OpenAI cache telemetry floor

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `1d6de8da9f03b507913ebd6c0e679bdcfe11322b`
- Commit: `557c5bf70521eb87306fbc1fbda429a353143921`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/live-cache-regression-baseline.ts`
- `src/agents/live-cache-regression-runner.test.ts`
- `src/agents/live-cache-regression-runner.ts`

### 133. openclaw 1c3b27718fe8 - ci: shard package upgrade survivor baselines

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a91c17c426f9bf5c0e201f0da99064e088e251fa`
- Commit: `1c3b27718fe84ff4685bd2bbdce9db63f29610e7`
- Replay: patch applied with `lf-pinned` mode and 13 files matched target commit exactly

- `.github/workflows/openclaw-live-and-e2e-checks-reusable.yml`
- `.github/workflows/openclaw-release-checks.yml`
- `.github/workflows/package-acceptance.yml`
- `docs/ci.md`
- `docs/help/testing-updates-plugins.md`
- `docs/help/testing.md`
- `docs/reference/RELEASING.md`
- `docs/reference/test.md`
- `scripts/plan-targeted-docker-lane-groups.mjs`
- `scripts/resolve-upgrade-survivor-baselines.mjs`
- `test/scripts/package-acceptance-workflow.test.ts`
- `test/scripts/targeted-docker-lane-groups.test.ts`
- `test/scripts/upgrade-survivor-baselines.test.ts`

### 134. openclaw 2e8761c5c154 - fix(plugins): repair missing openclaw peer links on update

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0eb06caae3807679b23d2c20a5b464fa46fdc556`
- Commit: `2e8761c5c1541496667201ba02716ab90eb24ee3`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/infra/package-update-utils.ts`
- `src/plugins/update.test.ts`
- `src/plugins/update.ts`

### 135. openclaw 30bb88d80e99 - test(live): prefer stable OpenAI cache model

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `46a04099a456fb125eb381a449571a9786311599`
- Commit: `30bb88d80e991a4ce9bda3da04d4e6eb84934f8e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/live-cache-regression-runner.ts`
- `src/gateway/gateway-models.profiles.live.test.ts`

### 136. openclaw c84b7cbffcc3 - ci(release): speed up focused release reruns

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0131343db8c613ecdbd8853af8044153baa74c04`
- Commit: `c84b7cbffcc305aafa2b9927c6aadf3579a98e4b`
- Replay: patch applied with `lf-pinned` mode and 11 files matched target commit exactly

- `.github/workflows/full-release-validation.yml`
- `.github/workflows/openclaw-cross-os-release-checks-reusable.yml`
- `.github/workflows/openclaw-live-and-e2e-checks-reusable.yml`
- `.github/workflows/openclaw-release-checks.yml`
- `docs/ci.md`
- `docs/reference/full-release-validation.md`
- `docs/reference/RELEASING.md`
- `scripts/openclaw-cross-os-release-checks.ts`
- `test/scripts/openclaw-cross-os-release-checks.test.ts`
- `test/scripts/openclaw-cross-os-release-workflow.test.ts`
- `test/scripts/package-acceptance-workflow.test.ts`

### 137. openclaw 0131343db8c6 - docs(doctor): clarify configured plugin repair (#77613)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b062bb670d2a18bf83da1b24ba8f93a4998fefa6`
- Commit: `0131343db8c613ecdbd8853af8044153baa74c04`
- Replay: patch applied with `lf-pinned` mode and 12 files matched target commit exactly

- `docs/cli/doctor.md`
- `docs/cli/plugins.md`
- `docs/gateway/doctor.md`
- `docs/plugins/bundles.md`
- `docs/plugins/dependency-resolution.md`
- `src/commands/doctor/repair-sequencing.test.ts`
- `src/commands/doctor/shared/missing-configured-plugin-install.test.ts`
- `src/commands/doctor/shared/missing-configured-plugin-install.ts`
- `src/commands/doctor/shared/release-configured-plugin-installs.test.ts`
- `src/flows/doctor-health-contributions.ts`
- `src/plugins/conversation-binding.ts`
- `src/plugins/provider-auth-choice.ts`

### 138. openclaw 7168896fdfed - fix(agents): abort post-compaction loops out-of-band

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `5dfaed184608e0c8a069e35f1c14fb3e222a5e55`
- Commit: `7168896fdfed027cdb5da995bd18c358aab39b66`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/pi-embedded-runner/run.compaction-loop-guard.test.ts`
- `src/agents/pi-embedded-runner/run.ts`

### 139. openclaw ed4b223cf252 - fix(agents): honor scoped post-compaction guard config

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `1af6855bb0a6a799df1dcf2b3f342268f799e6a3`
- Commit: `ed4b223cf25261bbc839407c6d6d887e6fffe5af`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/agents/pi-embedded-runner/run.compaction-loop-guard.test.ts`
- `src/agents/pi-embedded-runner/run.ts`
- `src/agents/pi-tools.ts`
- `src/agents/tool-loop-detection-config.ts`
- `src/config/schema.labels.ts`

### 140. openclaw 1af6855bb0a6 - refactor(agents): thread post-compaction guard observer

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e0fafdcc1d1dbb29546345d4b84d10256121cdc7`
- Commit: `1af6855bb0a6a799df1dcf2b3f342268f799e6a3`
- Replay: patch applied with `lf-pinned` mode and 7 files matched target commit exactly

- `src/agents/pi-embedded-runner/post-compaction-loop-guard.ts`
- `src/agents/pi-embedded-runner/run.compaction-loop-guard.test.ts`
- `src/agents/pi-embedded-runner/run.ts`
- `src/agents/pi-embedded-runner/run/attempt.ts`
- `src/agents/pi-embedded-runner/run/types.ts`
- `src/agents/pi-tools.before-tool-call.ts`
- `src/agents/pi-tools.ts`

### 141. openclaw e0fafdcc1d1d - fix(agents): observe post-compaction guard live

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0d3b74e45a59ac1e053102aa201c89c4a2ecd705`
- Commit: `e0fafdcc1d1dbb29546345d4b84d10256121cdc7`
- Replay: patch applied with `lf-pinned` mode and 7 files matched target commit exactly

- `src/agents/pi-embedded-runner/post-compaction-loop-guard.ts`
- `src/agents/pi-embedded-runner/run.compaction-loop-guard.test.ts`
- `src/agents/pi-embedded-runner/run.ts`
- `src/agents/pi-tools.before-tool-call.ts`
- `src/agents/tool-loop-detection.test.ts`
- `src/agents/tool-loop-detection.ts`
- `src/logging/diagnostic-session-state.ts`

### 142. openclaw 3ba0f588ad56 - fix(agents): observe matched post-compaction tool outcomes

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4c4825679b69ebe6c649ca0eed3ac1a610f01bf4`
- Commit: `3ba0f588ad5623e8c708e7b97ded4ee36440e0fb`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `src/agents/pi-embedded-runner/run.compaction-loop-guard.test.ts`
- `src/agents/tool-loop-detection.test.ts`
- `src/agents/tool-loop-detection.ts`
- `src/logging/diagnostic-session-state.ts`

### 143. openclaw 5b863c719eba - fix(agents): address review feedback on post-compaction loop guard

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `96e7461c81900acd606b8e7f35ae1f0ff058fee7`
- Commit: `5b863c719eba7129af5c28b70dd9677493bcd9f7`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/agents/pi-embedded-runner/post-compaction-loop-guard.test.ts`
- `src/agents/pi-embedded-runner/post-compaction-loop-guard.ts`
- `src/config/schema.help.ts`

### 144. openclaw 96e7461c8190 - feat(agents): add post-compaction loop guard module + config

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7295f19fbc0fb0ba031ddf7035a74f8acd44dc14`
- Commit: `96e7461c81900acd606b8e7f35ae1f0ff058fee7`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `src/agents/pi-embedded-runner/post-compaction-loop-guard.test.ts`
- `src/agents/pi-embedded-runner/post-compaction-loop-guard.ts`
- `src/config/schema.help.ts`
- `src/config/types.tools.ts`

### 145. openclaw 2f3a9629d837 - test: use latest kitchen sink canary

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b17bb63b9eaac43636085b75012b8a5509ddb972`
- Commit: `2f3a9629d837b6f46f26e1b71087718126fd5ee9`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/e2e/kitchen-sink-plugin-docker.sh`
- `test/scripts/plugin-prerelease-test-plan.test.ts`

### 146. openclaw b378a912573e - test(live): retry cache probe text misses

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `967c0981e3fd8923d22609d8ecbfaa12765fd5d3`
- Commit: `b378a912573e1d0d32cf1e20ff51e4d425ada6d1`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/live-cache-regression-runner.test.ts`
- `src/agents/live-cache-regression-runner.ts`

### 147. openclaw b15682950588 - fix(acpx): resolve plugin manifest from bundled runtime

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `44a10ceea2a8338a17bb21da838bd4bc8c96f46c`
- Commit: `b15682950588382cffdf067258a491d6debe3b77`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/acpx/src/codex-auth-bridge.ts`
- `extensions/acpx/src/config.test.ts`

### 148. openclaw da0a97767833 - test(plugins): refresh kitchen sink docker fixture

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `2cb03ee7b526560a9be964ceb4015ed579e1339b`
- Commit: `da0a97767833691520212d073bb4db976900baef`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/e2e/kitchen-sink-plugin-docker.sh`
- `scripts/e2e/lib/clawhub-fixture-server.cjs`

### 149. openclaw d253392ea2a3 - fix(plugins): keep explicit web providers on fast path

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6dae3c273de6b31b591b7981a6687249d39e24b4`
- Commit: `d253392ea2a30d3245164693c2e943daa53ad6c3`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/openai-transport-stream.test.ts`
- `src/plugins/web-provider-public-artifacts.ts`

### 150. openclaw cb9824d6b4a4 - test: add slack onboarding channel smoke (#77575)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `cf1bd30509471145097b950d2be91dcc729072b0`
- Commit: `cb9824d6b4a4fa3bee098e4cb8b15b7465dcacaa`
- Replay: patch applied with `lf-pinned` mode and 8 files matched target commit exactly

- `docs/help/testing.md`
- `package.json`
- `scripts/e2e/lib/npm-onboard-channel-agent/assertions.mjs`
- `scripts/e2e/npm-onboard-channel-agent-docker.sh`
- `scripts/lib/docker-e2e-scenarios.mjs`
- `scripts/lib/plugin-prerelease-test-plan.mjs`
- `test/scripts/docker-e2e-plan.test.ts`
- `test/scripts/plugin-prerelease-test-plan.test.ts`

### 151. openclaw cf1bd3050947 - test(plugins): add kitchen sink rpc walk

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0a62c1e665ad47d7bf2e13914d5b642a0575b4ac`
- Commit: `cf1bd30509471145097b950d2be91dcc729072b0`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `package.json`
- `scripts/e2e/kitchen-sink-rpc-walk.mjs`

### 152. openclaw edb697e38955 - test(extensions): refresh dependency-backed assertions

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ab032675ce09740f72fe4b8ef757338a4a65a173`
- Commit: `edb697e389556537ac15315698329b3280337bb7`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/bonjour/manifest.test.ts`
- `extensions/opencode-go/index.test.ts`

### 153. openclaw d36287928259 - fix(plugins): normalize compat allowlist aliases

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `40e0844133e0dd0e3b26d3b84bf6124e87e3165a`
- Commit: `d3628792825956702be7a6253061b96d976c623d`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/agents/models-config.providers.plugin-allowlist-compat.test.ts`
- `src/plugins/bundled-compat.ts`

### 154. openclaw 40e0844133e0 - fix(plugins): preserve bundled allowlist edges

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fdbfabf9f95d68432ae078dece0a1b3560a2635c`
- Commit: `40e0844133e0dd0e3b26d3b84bf6124e87e3165a`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `src/agents/models-config.providers.plugin-allowlist-compat.test.ts`
- `src/plugins/bundled-compat.ts`
- `src/plugins/web-provider-public-artifacts.fallback.test.ts`
- `src/plugins/web-provider-public-artifacts.ts`

### 155. openclaw f738663c7967 - fix(plugins): add bundledMode to gate runtime provider discovery by allowlist

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `81035e651bf7b8446751182475a820bc65af8d48`
- Commit: `f738663c7967841caa2f5e3c9b53250e3ac938b9`
- Replay: patch applied with `lf-pinned` mode and 6 files matched target commit exactly

- `src/agents/models-config.providers.plugin-allowlist-compat.test.ts`
- `src/config/types.plugins.ts`
- `src/plugins/activation-context.ts`
- `src/plugins/bundled-compat.ts`
- `src/plugins/providers.test.ts`
- `src/plugins/providers.ts`

### 156. openclaw 81035e651bf7 - fix(config): register bundledMode in zod schema and help text

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `eef623671e6de382509a838e6f970e7f65d7712b`
- Commit: `81035e651bf7b8446751182475a820bc65af8d48`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/config/schema.help.ts`
- `src/config/zod-schema.ts`

### 157. openclaw ce8bc1a3e39b - fix(lint): cover diagnostic phase events

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e39d3b42230402de098bd32751b1d251f527e764`
- Commit: `ce8bc1a3e39b92e8803f01967c6a3531a5ad3708`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `extensions/diagnostics-otel/src/service.ts`
- `src/logging/diagnostic-phase.ts`
- `src/logging/diagnostic.test.ts`

### 158. openclaw 864b1be1b320 - fix: repair release validation checks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `f8e080386d8bcad6b90052e97ea9ba16584be30c`
- Commit: `864b1be1b3205141f0e0e8ddf83f38aff334dc23`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `extensions/diagnostics-otel/src/service.ts`
- `src/logging/diagnostic-phase.ts`
- `src/logging/diagnostic.test.ts`
- `test/scripts/package-acceptance-workflow.test.ts`

### 159. openclaw d6917edc5329 - fix: preserve gateway watch trace overrides

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `35e48a049b2e8c45ceb40b8ab93bed55571b9b73`
- Commit: `d6917edc5329343b0707f322b59bacc2e8407f63`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `scripts/gateway-watch-tmux.mjs`
- `src/cli/gateway-cli/run.ts`
- `src/infra/gateway-watch-tmux.test.ts`

### 160. openclaw 35e48a049b2e - fix: enable sync io tracing in gateway watch

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e84d4b27f44ce4c1bca63f9d85c2a65f2ad7f688`
- Commit: `35e48a049b2e8c45ceb40b8ab93bed55571b9b73`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `docs/help/debugging.md`
- `scripts/watch-node.mjs`
- `src/infra/watch-node.test.ts`

### 161. openclaw e84d4b27f44c - feat: add gateway stall diagnostics

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `358cd87ff300fd515bf35f9725dd59198fb9c416`
- Commit: `e84d4b27f44ce4c1bca63f9d85c2a65f2ad7f688`
- Replay: patch applied with `lf-pinned` mode and 13 files matched target commit exactly

- `docs/gateway/diagnostics.md`
- `docs/help/debugging.md`
- `scripts/run-node.mjs`
- `src/cli/gateway-cli/run.ts`
- `src/gateway/server.impl.ts`
- `src/infra/diagnostic-events.ts`
- `src/infra/run-node.test.ts`
- `src/logging/diagnostic-phase.ts`
- `src/logging/diagnostic-run-activity.ts`
- `src/logging/diagnostic-stability-bundle.ts`
- `src/logging/diagnostic-stability.ts`
- `src/logging/diagnostic.test.ts`
- `src/logging/diagnostic.ts`

### 162. openclaw 57ca91ff388e - fix(telegram): clarify model picker runtime scope

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `e091d912ceb245b41f6b55499baf0504056d8338`
- Commit: `57ca91ff388e7114de3e9a0236564004e3d95cf9`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `extensions/telegram/src/bot-handlers.runtime.ts`
- `extensions/telegram/src/bot.create-telegram-bot.test.ts`
- `extensions/telegram/src/bot.test.ts`

### 163. openclaw e091d912ceb2 - fix(model): guide runtime allowlist repairs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `70b1c17ae01ea34cbb928d41fe1248893b019905`
- Commit: `e091d912ceb245b41f6b55499baf0504056d8338`
- Replay: patch applied with `lf-pinned` mode and 6 files matched target commit exactly

- `docs/concepts/models.md`
- `docs/help/faq-models.md`
- `src/auto-reply/reply/directive-handling.model-selection.ts`
- `src/auto-reply/reply/directive-handling.model.test.ts`
- `src/auto-reply/reply/directive-handling.model.ts`
- `src/auto-reply/reply/model-selection-directive.ts`

### 164. openclaw 343f859b900c - fix: preserve visible Discord labeled replies

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `31edc4ee1add3636ce7f4b80678277f8a4779806`
- Commit: `343f859b900c22bb3ef50c3019cf13ca599a7560`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/discord/src/monitor/reply-delivery.test.ts`
- `extensions/discord/src/monitor/reply-safety.ts`

### 165. openclaw e259938e9643 - fix: harden startup readiness and discord replies

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7e229f0d3d63acc52a831d5017b22e45c4feffa5`
- Commit: `e259938e9643a43cdc88aa324e08a2ab5f5d7176`
- Replay: patch applied with `lf-pinned` mode and 12 files matched target commit exactly

- `docs/status/openclaw-startup-readiness-and-leak-fix-20260504.md`
- `extensions/discord/src/monitor/provider.lifecycle.test.ts`
- `extensions/discord/src/monitor/provider.lifecycle.ts`
- `extensions/discord/src/monitor/reply-delivery.test.ts`
- `extensions/discord/src/monitor/reply-delivery.ts`
- `extensions/discord/src/monitor/reply-safety.ts`
- `src/gateway/operator-approvals-client.ts`
- `src/gateway/server-startup-unavailable-methods.ts`
- `src/infra/approval-handler-bootstrap.test.ts`
- `src/infra/approval-handler-bootstrap.ts`
- `src/infra/exec-approval-channel-runtime.test.ts`
- `src/infra/exec-approval-channel-runtime.ts`

### 166. openclaw 0909df1a4f3d - refactor: centralize reply followup drain lifecycle

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `86385f72e98daa3c7c9cbf52069333eb0ca59496`
- Commit: `0909df1a4f3d092dba9fc551e105a0564ff4cdd2`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `src/auto-reply/reply/agent-runner-execution.test.ts`
- `src/auto-reply/reply/agent-runner.ts`
- `src/auto-reply/reply/reply-run-registry.test.ts`
- `src/auto-reply/reply/reply-run-registry.ts`
- `src/gateway/server.chat.gateway-server-chat-b.test.ts`

### 167. openclaw 86385f72e98d - fix(update): use absolute npm script shell

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `828b6be39d85b38a4d7b8ceba117cd7415742e1a`
- Commit: `86385f72e98daa3c7c9cbf52069333eb0ca59496`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/update-global.test.ts`
- `src/infra/update-global.ts`

### 168. openclaw fdaa5a0c3da1 - fix(update): exit post-core resume without result path

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `02ac7dc5a62e1e7726a7436b3e0a79ecd65bd696`
- Commit: `fdaa5a0c3da124920fa0234f76bf82bde946f61e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/cli/update-cli.test.ts`
- `src/cli/update-cli/update-command.ts`

### 169. openclaw e2eb8e3cfe6f - test(plugins): harden kitchen sink live gauntlet

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a71f90683766e92f6fdb76d65b322923d3bffb75`
- Commit: `e2eb8e3cfe6f746e72356ddc9fc3611767cb8220`
- Replay: patch applied with `lf-pinned` mode and 10 files matched target commit exactly

- `docs/help/testing.md`
- `extensions/qa-lab/src/gateway-child.test.ts`
- `extensions/qa-lab/src/gateway-child.ts`
- `extensions/qa-lab/src/providers/live-frontier/auth.ts`
- `extensions/qa-lab/src/providers/shared/auth-store.ts`
- `extensions/qa-lab/src/scenario-catalog.test.ts`
- `extensions/qa-lab/src/suite-runtime-agent-tools.test.ts`
- `extensions/qa-lab/src/suite-runtime-agent-tools.ts`
- `package.json`
- `qa/scenarios/plugins/kitchen-sink-live-openai.md`

### 170. openclaw 0fc8afeac9a3 - test(package): cover stale source plugin shadows

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `112924b11394991bba8db447dcd91a9ac478c7e7`
- Commit: `0fc8afeac9a373df59c0dab731d8751e91d14033`
- Replay: patch applied with `lf-pinned` mode and 7 files matched target commit exactly

- `docs/help/testing-updates-plugins.md`
- `docs/reference/test.md`
- `scripts/e2e/lib/upgrade-survivor/assertions.mjs`
- `scripts/e2e/lib/upgrade-survivor/run.sh`
- `scripts/lib/docker-e2e-plan.mjs`
- `test/scripts/docker-e2e-plan.test.ts`
- `test/scripts/package-acceptance-workflow.test.ts`

### 171. openclaw 112924b11394 - fix(update): keep plugin install runtime aliases stable

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `b63336186ae1cc368a08926c574b026f9fac275e`
- Commit: `112924b11394991bba8db447dcd91a9ac478c7e7`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/runtime-postbuild.mjs`
- `test/scripts/runtime-postbuild.test.ts`

### 172. openclaw b63336186ae1 - fix(update): stage npm-prefix package updates cleanly

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `be8b4dc845146a93e47b64ad9abe962bb3216366`
- Commit: `b63336186ae1cc368a08926c574b026f9fac275e`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/infra/package-update-steps.test.ts`
- `src/infra/package-update-steps.ts`
- `src/infra/update-runner.test.ts`

### 173. openclaw 021373a4541e - ci(release): recover Windows packaged update no-restart timeout

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `982d123b80525067a02ff1c26e0f04dd47697614`
- Commit: `021373a4541e53cc5a29e7cd672e578a96fe3276`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/openclaw-cross-os-release-checks.ts`
- `test/scripts/openclaw-cross-os-release-checks.test.ts`

### 174. openclaw 3af3fcfebe90 - fix(update): exit post-core package child

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `3fb8c405eda48af76bb8b8d7d3f8e5b0ee3c049c`
- Commit: `3af3fcfebe908e29c74fd7e3c1a07e17080a08d5`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/cli/update-cli.test.ts`
- `src/cli/update-cli/update-command.ts`

### 175. openclaw 3fb8c405eda4 - fix(update): finish post-core package updates

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ef0dbcf49d858763a73d2ce5996dc541a45f78e0`
- Commit: `3fb8c405eda48af76bb8b8d7d3f8e5b0ee3c049c`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/cli/update-cli.test.ts`
- `src/cli/update-cli/update-command.ts`

### 176. openclaw 94f8f1914e36 - test(release): match versioned Windows upgrade tarballs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `2e399e6f1ab3bf076d540d21de5e87e8ecb902f9`
- Commit: `94f8f1914e36c6541b43f7099c8c91e6d7e743d9`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/openclaw-cross-os-release-checks.ts`
- `test/scripts/openclaw-cross-os-release-checks.test.ts`

### 177. openclaw 2e399e6f1ab3 - test(release): recover known Windows packaged upgrade timeout

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `3921e1b0b7c7282a8a8e9a450c3386b7f166c7d5`
- Commit: `2e399e6f1ab3bf076d540d21de5e87e8ecb902f9`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/openclaw-cross-os-release-checks.ts`
- `test/scripts/openclaw-cross-os-release-checks.test.ts`

### 178. openclaw 3921e1b0b7c7 - fix(process): kill Windows command trees on timeout

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `a3f6f24b79a5c35bb2267c8936e733c55be67c5f`
- Commit: `3921e1b0b7c7282a8a8e9a450c3386b7f166c7d5`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/process/exec.ts`
- `src/process/exec.windows.test.ts`

### 179. openclaw a3f6f24b79a5 - ci: gate slack live qa credentials

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `2d849bbafa418397429fec1be364afd38c8c1c51`
- Commit: `a3f6f24b79a5c35bb2267c8936e733c55be67c5f`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `.github/workflows/openclaw-release-checks.yml`
- `.github/workflows/qa-live-transports-convex.yml`
- `test/scripts/package-acceptance-workflow.test.ts`

### 180. openclaw 9aad2b82c30b - Use trusted Windows browser helper root (#77469)

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `8c7ec5d1f9ff4e90640af4e72eb47390744412b4`
- Commit: `9aad2b82c30be700ed721f93a6ae7ba4f0cdbb09`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/infra/browser-open.test.ts`
- `src/infra/browser-open.ts`

### 181. openclaw 417660b662cc - docs(plugins): explain catalog install trust

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `daefb5e3412ff4583e39970add35f65acbe8e038`
- Commit: `417660b662ccd1be1345918cca44759c7802a6ab`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `src/cli/plugins-cli.install.test.ts`
- `src/cli/plugins-install-command.ts`

### 182. openclaw daefb5e3412f - fix(plugins): trust catalog package installs

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9dc38f37eab4273ca807eb5b28fa8f74473fe000`
- Commit: `daefb5e3412ff4583e39970add35f65acbe8e038`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/channels/plugins/catalog.test.ts`
- `src/cli/plugins-cli.install.test.ts`
- `src/cli/plugins-install-command.ts`

### 183. openclaw 841eb81baf37 - chore: better explicit message on whatsapp

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fc7e2a10c8fcadf8f38d3645cb05848accfa4b5d`
- Commit: `841eb81baf379e6d38e417cfe41734915df67aaf`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `extensions/whatsapp/src/login.coverage.test.ts`
- `extensions/whatsapp/src/login.ts`
- `extensions/whatsapp/src/session.ts`

### 184. openclaw 2511be524466 - test(release): skip restart in package upgrade lane

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `74ab62c6a297e2f92607c7f165a82598516f7fbb`
- Commit: `2511be52446608ea1d27d7241f22c17ef96c4c86`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `scripts/openclaw-cross-os-release-checks.ts`
- `test/scripts/openclaw-cross-os-release-checks.test.ts`

### 185. openclaw 30e259b9c565 - test(qa-lab): accept native Windows paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `9008031e96e3bdd04ec6d2bf8bf240ba96011a3a`
- Commit: `30e259b9c565bfb57ed51ced07fb4e19cd312b3d`
- Replay: patch applied with `lf-pinned` mode and 8 files matched target commit exactly

- `extensions/qa-lab/src/cli.runtime.test.ts`
- `extensions/qa-lab/src/docker-up.runtime.test.ts`
- `extensions/qa-lab/src/lab-server.test.ts`
- `extensions/qa-lab/src/live-transports/shared/live-transport-cli.runtime.test.ts`
- `extensions/qa-lab/src/model-catalog.runtime.ts`
- `extensions/qa-lab/src/run-config.test.ts`
- `extensions/qa-lab/src/self-check.test.ts`
- `extensions/qa-lab/src/suite-runtime-agent-process.test.ts`

### 186. openclaw 9008031e96e3 - fix(qa-channel): settle aborted bus polls

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `6c2573e37a4cce0de9f5009deed42d7839c210fb`
- Commit: `9008031e96e3bdd04ec6d2bf8bf240ba96011a3a`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/qa-channel/src/bus-client.test.ts`
- `extensions/qa-channel/src/bus-client.ts`

### 187. openclaw 3d3b0dad7751 - test(whatsapp): accept native Windows auth paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `15b9966781a2438c6e558f4f64179f72304461ae`
- Commit: `3d3b0dad77511a2edfb2f47bd61cb6d4735d73ec`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/whatsapp/src/login.coverage.test.ts`
- `extensions/whatsapp/src/session.test.ts`

### 188. openclaw 0dd30c804cdf - test(memory): cover native Windows paths and locks

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `fa1d826a41ccf97f9886b5bccf1b66763c6357ac`
- Commit: `0dd30c804cdfb32c5a3f3bf115c52a592d259a26`
- Replay: patch applied with `lf-pinned` mode and 5 files matched target commit exactly

- `extensions/memory-core/src/dreaming-narrative.test.ts`
- `extensions/memory-core/src/memory/index.test.ts`
- `extensions/memory-core/src/memory/search-manager.test.ts`
- `extensions/memory-wiki/src/config.test.ts`
- `extensions/memory-wiki/src/query.test.ts`

### 189. openclaw fa1d826a41cc - test(matrix): cover native Windows file semantics

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `7c6bf331b89bb9d07c7c87e282c61f7031efe9fc`
- Commit: `fa1d826a41ccf97f9886b5bccf1b66763c6357ac`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `extensions/matrix/src/legacy-crypto-inspector-availability.test.ts`
- `extensions/matrix/src/matrix/credentials.test.ts`
- `extensions/matrix/src/matrix/sdk/idb-persistence.test.ts`
- `extensions/matrix/src/matrix/sdk/recovery-key-store.test.ts`

### 190. openclaw 4f2f5e04610c - test(feishu): cover native Windows webhook and workspace paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `48a3a23d4018c4859a7c2b12bf4e358dad5dff43`
- Commit: `4f2f5e04610c4dea689652d1d0cd8794156e8c3e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `extensions/feishu/src/docx.test.ts`
- `extensions/feishu/src/monitor.webhook-security.test.ts`

### 191. openclaw 03d04c243b86 - test(acpx): cover Windows extension test paths

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `c1da0ddd5452487270530fd254783d7180373454`
- Commit: `03d04c243b86629166386e73ee657ca38c0e42ce`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `extensions/acpx/src/codex-auth-bridge.test.ts`
- `extensions/acpx/src/config.test.ts`
- `test/vitest/vitest.shared.config.ts`

### 192. openclaw c59c20e9fd48 - chore(ui): refresh fa control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `1ce136ce16bb7871f50e50c89883ca20e055cc21`
- Commit: `c59c20e9fd4871b6f48365074740125ee5290ba9`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/fa.meta.json`
- `ui/src/i18n/locales/fa.ts`

### 193. openclaw 1ce136ce16bb - chore(ui): refresh nl control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `909894c8c43903f98f6c9fa211f3ad6226f12693`
- Commit: `1ce136ce16bb7871f50e50c89883ca20e055cc21`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/nl.meta.json`
- `ui/src/i18n/locales/nl.ts`

### 194. openclaw 909894c8c439 - chore(ui): refresh th control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `df7d18f6d316ff1b915329ae897a9116934e4848`
- Commit: `909894c8c43903f98f6c9fa211f3ad6226f12693`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/th.meta.json`
- `ui/src/i18n/locales/th.ts`

### 195. openclaw df7d18f6d316 - chore(ui): refresh vi control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `2db259503ba8e5072db244070c2e6bcbff64828e`
- Commit: `df7d18f6d316ff1b915329ae897a9116934e4848`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/vi.meta.json`
- `ui/src/i18n/locales/vi.ts`

### 196. openclaw 2db259503ba8 - chore(ui): refresh pl control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `4abba333fe6f2bfa5ee0db7a135734f576117d50`
- Commit: `2db259503ba8e5072db244070c2e6bcbff64828e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/pl.meta.json`
- `ui/src/i18n/locales/pl.ts`

### 197. openclaw 4abba333fe6f - chore(ui): refresh id control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `0909ff16d9c467e1f1ea3391f4076d1994c7b82c`
- Commit: `4abba333fe6f2bfa5ee0db7a135734f576117d50`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/id.meta.json`
- `ui/src/i18n/locales/id.ts`

### 198. openclaw 0909ff16d9c4 - chore(ui): refresh uk control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `87e3f3779f38b064288e3178278a9727b885786e`
- Commit: `0909ff16d9c467e1f1ea3391f4076d1994c7b82c`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/uk.meta.json`
- `ui/src/i18n/locales/uk.ts`

### 199. openclaw 87e3f3779f38 - chore(ui): refresh it control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `863e8d0c38b2f103e50f3f61b22ad172cd7ab0b9`
- Commit: `87e3f3779f38b064288e3178278a9727b885786e`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/it.meta.json`
- `ui/src/i18n/locales/it.ts`

### 200. openclaw 863e8d0c38b2 - chore(ui): refresh tr control ui locale

- Repository: https://github.com/openclaw/openclaw.git
- Parent: `ea8d5b187784461dc08f5f064d52b27bb2795ecd`
- Commit: `863e8d0c38b2f103e50f3f61b22ad172cd7ab0b9`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `ui/src/i18n/.i18n/tr.meta.json`
- `ui/src/i18n/locales/tr.ts`
