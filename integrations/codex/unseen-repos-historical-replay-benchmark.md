# Unseen Repos Historical Replay Benchmark

Generated: 2026-05-06T17:30:58.050Z

This benchmark is a strict checked-in evidence snapshot for the Conducty Codex integration. It samples recent focused non-merge commits across the configured repository set, creates parent-state focused workspaces, applies the real historical patches, and verifies every replayed file exactly matches the target commit.

- **Replay gate:** a row counts only if the historical patch applies to parent-state files and reproduces target-state files byte-for-byte.
- **Host checkout guard:** replay tries the default Git apply behavior first, then an LF-pinned mode, and still accepts only byte-exact target archive matches.
- **Repository gate:** this custom run covers 30 recent focused commits across six public repositories not used in the prior Conducty benchmark reports: nodejs/undici, colinhacks/zod, pytest-dev/pytest, spf13/cobra, BurntSushi/ripgrep, and vitejs/vite.
- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.
- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.
- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and 3200 fixed tokens for plan/checkpoint/verification overhead.
- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.

This is still not an autonomous-agent success benchmark, product-wide guarantee, or exact provider-billing trace. It is a deterministic historical patch replay benchmark with exact target-file verification.

## Summary

- Repositories measured: 6
- Replayed commits passed: 30/30
- Candidate commits skipped before replay success: 0
- Target files verified exactly: 100
- Patch bytes applied: 138,729
- Baseline readable files counted across parent checkouts: 21,655
- Focused context files counted across replays: 207
- Baseline context tokens: 24,870,867
- Focused context tokens: 915,258
- One-pass context tokens saved: 23,955,609 (96.3%)
- Naive workflow tokens: 99,561,468
- Initial architecture workflow tokens: 27,651,294
- Initial architecture savings vs naive: 72.2%
- Current PR workflow tokens: 2,876,427
- Current PR savings vs naive: 97.1%
- Current PR saved vs initial: 24,774,867 tokens (89.6%)
- Median current-vs-initial per-replay savings: 90.9%

## Repository Results

| Repository | Replays | Skipped candidates | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| undici | 5 | 0 | 14 | 5513362 | 116497 | 5869340 | 371978 | 5497362 | 93.7% |
| zod | 5 | 0 | 17 | 3861898 | 155153 | 4339162 | 493264 | 3845898 | 88.6% |
| pytest | 5 | 0 | 16 | 6491940 | 172018 | 7012279 | 536339 | 6475940 | 92.4% |
| cobra | 5 | 0 | 18 | 800210 | 201739 | 1410805 | 626595 | 784210 | 55.6% |
| ripgrep | 5 | 0 | 11 | 2714194 | 198045 | 3310758 | 612564 | 2698194 | 81.5% |
| vite | 5 | 0 | 24 | 5489263 | 71806 | 5708950 | 235687 | 5473263 | 95.9% |

## Replay Results

| Repository | Commit | Focused change | Apply mode | Changed files | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial % |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| undici | ef4d1d60b3ed | fix(dispatcher): remove unreachable assert in writeBlob (#5231) | default | 2 | 2 | 1104060 | 28591 | 1190136 | 89276 | 92.5% |
| undici | 584e6aec01a9 | perf(h2): end zero-length request bodies with headers (#5169) | default | 2 | 2 | 1103491 | 21850 | 1169720 | 69429 | 94.1% |
| undici | e2bc508f4f45 | fix(socks5): preserve dispatch backpressure return value (#5166) | default | 2 | 2 | 1103316 | 14083 | 1146052 | 45936 | 96.0% |
| undici | 1a452261fd35 | fix(socks5): use configured connector in Socks5ProxyAgent (#5168) | default | 2 | 2 | 1102373 | 13726 | 1144561 | 45388 | 96.0% |
| undici | ae8df16ca491 | feat(snapshot-agent): add normalizeBody and normalizeQuery options (#5121) | default | 6 | 6 | 1100122 | 38247 | 1218871 | 121949 | 90.0% |
| zod | f29f2a6db443 | fix(v4): cidrv6 JSON schema pattern matches runtime (#5945) | default | 2 | 2 | 773801 | 20210 | 835013 | 64412 | 92.3% |
| zod | dfd8766bf449 | fix(v4): break circular import between classic schemas and iso (#5275) (#5926) | default | 5 | 5 | 773779 | 28431 | 862203 | 91624 | 89.4% |
| zod | fbe8ad1b7094 | fix(v4): allow dynamic `.catch()` under `unrepresentable: "any"` (#5273) (#5925) | default | 2 | 2 | 773707 | 29345 | 862126 | 91619 | 89.4% |
| zod | f3c9ec03ba7a | 4.4.3 | default | 3 | 3 | 773425 | 2714 | 781815 | 11590 | 98.5% |
| zod | c2be4f819064 | fix(v4): generalize optin/fallback to transform; restore preprocess on absent keys (#5941) | default | 5 | 5 | 767186 | 74453 | 998005 | 234019 | 76.6% |
| pytest | 0263914bf9ce | tmpdir: stop relying on atexit and add integration tests for tmpdir fixture | default | 3 | 3 | 1298735 | 23090 | 1369846 | 74311 | 94.6% |
| pytest | deb9f5f79b05 | Add a space after the test name with --setup-show (#14430) | default | 4 | 4 | 1298668 | 57442 | 1471804 | 176336 | 88.0% |
| pytest | 4ee157d2da97 | assertion/rewrite: fix test crash on assert failure with `terminalreporter` disabled | default | 4 | 4 | 1298330 | 44963 | 1433859 | 138729 | 90.3% |
| pytest | 05c837dc3178 | assertion: push `config` access up from `assertrepr_compare` to the hook | default | 2 | 2 | 1298302 | 12204 | 1335352 | 40250 | 97.0% |
| pytest | e178744105e1 | config: fix duplicate values in Config.known_args_namespace for append actions | default | 3 | 3 | 1297905 | 34319 | 1401418 | 106713 | 92.4% |
| cobra | ad460ea8f249 | Add cobra unique args validator (#2397) | default | 3 | 3 | 161474 | 13174 | 201726 | 43452 | 78.5% |
| cobra | 746ef0715872 | fix: prevent completions from mutating os.Args via append side effect (#2356) | default | 2 | 2 | 160934 | 41550 | 286305 | 128571 | 55.1% |
| cobra | 6dec1ae26659 | The default ShellCompDirective can be customized for a command and its subcommands (#2238) | default | 3 | 3 | 159293 | 47691 | 303624 | 147531 | 51.4% |
| cobra | 4af7b64d3198 | refactor: apply golangci-lint autofixes, work around false positives | default | 6 | 6 | 159221 | 46558 | 300898 | 144877 | 51.9% |
| cobra | 75790e48fb73 | chore(golangci-lint): upgrade to v2 | default | 4 | 4 | 159288 | 52766 | 318252 | 162164 | 49.0% |
| ripgrep | 4519153e5e46 | doc: clarify half-boundary syntax for the `-w/--word-regexp` flag | default | 2 | 2 | 542823 | 77524 | 775839 | 236216 | 69.6% |
| ripgrep | 0a88cccd5188 | Fix compression tests in QEMU cross-compilation environments (#3248) | default | 2 | 2 | 542823 | 20330 | 604252 | 64629 | 89.3% |
| ripgrep | 85edf4c79671 | ignore: only stat `.jj` if we actually care | default | 2 | 2 | 542908 | 41354 | 667330 | 127622 | 80.9% |
| ripgrep | 5748f81bb107 | printer: use `doc_cfg` instead of `doc_auto_cfg` | default | 2 | 2 | 542805 | 7656 | 566014 | 26409 | 95.3% |
| ripgrep | d47663b1b454 | searcher: fix regression with `--line-buffered` flag | default | 3 | 3 | 542835 | 51181 | 697323 | 157688 | 77.4% |
| vite | 0c162e96a654 | refactor: show direct path type in bad character warning (#22339) | lf-pinned | 2 | 2 | 1098632 | 32739 | 1197395 | 101963 | 91.5% |
| vite | 1ac46d64b81e | fix(create-vite): use `type="button"` to counter button in templates consistently (#22142) | lf-pinned | 14 | 14 | 1097899 | 17176 | 1151611 | 56912 | 95.1% |
| vite | adc995847f3c | test(glob-import): cover array patterns with sibling dirs sharing a prefix (#22281) | lf-pinned | 4 | 4 | 1097596 | 6895 | 1118846 | 24450 | 97.8% |
| vite | ac36eb690710 | test(glob-import): add backslash-escaped glob pattern test (#22283) | lf-pinned | 2 | 2 | 1097377 | 6666 | 1117908 | 23731 | 97.9% |
| vite | 40a084727650 | refactor: typecheck client directory (#22284) | lf-pinned | 2 | 2 | 1097759 | 8330 | 1123190 | 28631 | 97.5% |

## Replayed Files

### 1. undici ef4d1d60b3ed - fix(dispatcher): remove unreachable assert in writeBlob (#5231)

- Repository: https://github.com/nodejs/undici.git
- Parent: `e58fff7e1ad89f148aef1cca1366b16641029731`
- Commit: `ef4d1d60b3edd5be9205f480d25a969d10b74e31`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `lib/dispatcher/client-h1.js`
- `lib/dispatcher/client-h2.js`

### 2. undici 584e6aec01a9 - perf(h2): end zero-length request bodies with headers (#5169)

- Repository: https://github.com/nodejs/undici.git
- Parent: `e2bc508f4f45fcad9bd183a69e2944a23bde1770`
- Commit: `584e6aec01a922f6e9ba259ee7c153475cb87a44`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `lib/dispatcher/client-h2.js`
- `test/http2-body.js`

### 3. undici e2bc508f4f45 - fix(socks5): preserve dispatch backpressure return value (#5166)

- Repository: https://github.com/nodejs/undici.git
- Parent: `593530f4844545021e3ee3c333053fbc5ebc8ca8`
- Commit: `e2bc508f4f45fcad9bd183a69e2944a23bde1770`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `lib/dispatcher/socks5-proxy-agent.js`
- `test/socks5-proxy-agent.js`

### 4. undici 1a452261fd35 - fix(socks5): use configured connector in Socks5ProxyAgent (#5168)

- Repository: https://github.com/nodejs/undici.git
- Parent: `ae8df16ca4918673391208dafeb7666505dae681`
- Commit: `1a452261fd353819724b3520052d342346208f3a`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `lib/dispatcher/socks5-proxy-agent.js`
- `test/socks5-proxy-agent.js`

### 5. undici ae8df16ca491 - feat(snapshot-agent): add normalizeBody and normalizeQuery options (#5121)

- Repository: https://github.com/nodejs/undici.git
- Parent: `6e042f7bd52aa44c4ca7d4eaf89df61761885286`
- Commit: `ae8df16ca4918673391208dafeb7666505dae681`
- Replay: patch applied with `default` mode and 6 files matched target commit exactly

- `docs/docs/api/SnapshotAgent.md`
- `lib/mock/snapshot-agent.js`
- `lib/mock/snapshot-recorder.js`
- `test/snapshot-testing.js`
- `test/types/snapshot-agent.test-d.ts`
- `types/snapshot-agent.d.ts`

### 6. zod f29f2a6db443 - fix(v4): cidrv6 JSON schema pattern matches runtime (#5945)

- Repository: https://github.com/colinhacks/zod.git
- Parent: `ee7376ad3ac04ede2567a7074762d20b0de1de6d`
- Commit: `f29f2a6db443284eff44db181dbe146df98f92c2`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `packages/zod/src/v4/classic/tests/string.test.ts`
- `packages/zod/src/v4/core/regexes.ts`

### 7. zod dfd8766bf449 - fix(v4): break circular import between classic schemas and iso (#5275) (#5926)

- Repository: https://github.com/colinhacks/zod.git
- Parent: `fbe8ad1b709460fc45d88fdcb5eca591198de60d`
- Commit: `dfd8766bf44943eb0dc136bb87b53f6bde008995`
- Replay: patch applied with `default` mode and 5 files matched target commit exactly

- `packages/treeshake/tests/no-circular-imports.test.ts`
- `packages/treeshake/vitest.config.ts`
- `packages/zod/src/v4/classic/iso.ts`
- `packages/zod/src/v4/classic/schemas.ts`
- `packages/zod/src/v4/classic/tests/no-circular-imports.test.ts`

### 8. zod fbe8ad1b7094 - fix(v4): allow dynamic `.catch()` under `unrepresentable: "any"` (#5273) (#5925)

- Repository: https://github.com/colinhacks/zod.git
- Parent: `1fb56a5c18c27102dbc92260a4007c7732a0ccca`
- Commit: `fbe8ad1b709460fc45d88fdcb5eca591198de60d`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `packages/zod/src/v4/classic/tests/to-json-schema.test.ts`
- `packages/zod/src/v4/core/json-schema-processors.ts`

### 9. zod f3c9ec03ba7a - 4.4.3

- Repository: https://github.com/colinhacks/zod.git
- Parent: `c2be4f819064eed62c7c350a2d399b5faecd15f8`
- Commit: `f3c9ec03ba7a28ae72d25cc295f38674bee0f559`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `packages/zod/jsr.json`
- `packages/zod/package.json`
- `packages/zod/src/v4/core/versions.ts`

### 10. zod c2be4f819064 - fix(v4): generalize optin/fallback to transform; restore preprocess on absent keys (#5941)

- Repository: https://github.com/colinhacks/zod.git
- Parent: `1cab69383fcdeae2a366d5e2a2fc4d8fc765d168`
- Commit: `c2be4f819064eed62c7c350a2d399b5faecd15f8`
- Replay: patch applied with `default` mode and 5 files matched target commit exactly

- `packages/zod/src/v4/classic/schemas.ts`
- `packages/zod/src/v4/classic/tests/catch.test.ts`
- `packages/zod/src/v4/classic/tests/preprocess.test.ts`
- `packages/zod/src/v4/core/schemas.ts`
- `wiki/optionality.md`

### 11. pytest 0263914bf9ce - tmpdir: stop relying on atexit and add integration tests for tmpdir fixture

- Repository: https://github.com/pytest-dev/pytest.git
- Parent: `deb9f5f79b0537a5e80cc26dd11bfb217e263a72`
- Commit: `0263914bf9cec5677783cda7557717e4a9660452`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `src/_pytest/pathlib.py`
- `src/_pytest/tmpdir.py`
- `testing/test_tmpdir.py`

### 12. pytest deb9f5f79b05 - Add a space after the test name with --setup-show (#14430)

- Repository: https://github.com/pytest-dev/pytest.git
- Parent: `2aa07343b6ebcb426f4cc595e3bf1912b0a442de`
- Commit: `deb9f5f79b0537a5e80cc26dd11bfb217e263a72`
- Replay: patch applied with `default` mode and 4 files matched target commit exactly

- `changelog/14430.improvement.rst`
- `src/_pytest/runner.py`
- `testing/python/fixtures.py`
- `testing/test_setuponly.py`

### 13. pytest 4ee157d2da97 - assertion/rewrite: fix test crash on assert failure with `terminalreporter` disabled

- Repository: https://github.com/pytest-dev/pytest.git
- Parent: `05c837dc3178814b581fd378cdda9363c2392ecd`
- Commit: `4ee157d2da975f4c59f24ab99b2f885c3ba96d16`
- Replay: patch applied with `default` mode and 4 files matched target commit exactly

- `changelog/14377.bugfix.rst`
- `src/_pytest/assertion/__init__.py`
- `testing/test_assertion.py`
- `testing/test_assertrewrite.py`

### 14. pytest 05c837dc3178 - assertion: push `config` access up from `assertrepr_compare` to the hook

- Repository: https://github.com/pytest-dev/pytest.git
- Parent: `6f93bd03849570ce53f7bb3608e29442378b4d1a`
- Commit: `05c837dc3178814b581fd378cdda9363c2392ecd`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `src/_pytest/assertion/__init__.py`
- `src/_pytest/assertion/util.py`

### 15. pytest e178744105e1 - config: fix duplicate values in Config.known_args_namespace for append actions

- Repository: https://github.com/pytest-dev/pytest.git
- Parent: `5dfd4eab7d328266fb3788dcbb031c9d67903daf`
- Commit: `e178744105e1493a54377f93172aa5933ac70d3f`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `changelog/13484.bugfix.rst`
- `src/_pytest/config/__init__.py`
- `testing/test_warnings.py`

### 16. cobra ad460ea8f249 - Add cobra unique args validator (#2397)

- Repository: https://github.com/spf13/cobra.git
- Parent: `746ef07158728502482cea9f880a6f4b21ef29a9`
- Commit: `ad460ea8f249db69c943a365fb84f3a59042d54e`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `args_test.go`
- `args.go`
- `site/content/user_guide.md`

### 17. cobra 746ef0715872 - fix: prevent completions from mutating os.Args via append side effect (#2356)

- Repository: https://github.com/spf13/cobra.git
- Parent: `f2878bab8c96afd6e36968af96343b35dbb82a82`
- Commit: `746ef07158728502482cea9f880a6f4b21ef29a9`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `completions_test.go`
- `completions.go`

### 18. cobra 6dec1ae26659 - The default ShellCompDirective can be customized for a command and its subcommands (#2238)

- Repository: https://github.com/spf13/cobra.git
- Parent: `c8289c10302063b9a2e26357e7e0f0bb599f29ce`
- Commit: `6dec1ae26659a130bdb4c985768d1853b0e1bc06`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `completions_test.go`
- `completions.go`
- `site/content/completions/_index.md`

### 19. cobra 4af7b64d3198 - refactor: apply golangci-lint autofixes, work around false positives

- Repository: https://github.com/spf13/cobra.git
- Parent: `75790e48fb73c8ba027e0163157a86ce8604ca3e`
- Commit: `4af7b64d31989e78e86d65304f693a6d9c77c932`
- Replay: patch applied with `default` mode and 6 files matched target commit exactly

- `completions_test.go`
- `completions.go`
- `doc/man_docs.go`
- `doc/md_docs.go`
- `doc/rest_docs.go`
- `doc/yaml_docs.go`

### 20. cobra 75790e48fb73 - chore(golangci-lint): upgrade to v2

- Repository: https://github.com/spf13/cobra.git
- Parent: `db3ddb5cf4968b320ea21f6ee5c2d2202a2e7b22`
- Commit: `75790e48fb73c8ba027e0163157a86ce8604ca3e`
- Replay: patch applied with `default` mode and 4 files matched target commit exactly

- `.github/workflows/test.yml`
- `.golangci.yml`
- `command_test.go`
- `completions_test.go`

### 21. ripgrep 4519153e5e46 - doc: clarify half-boundary syntax for the `-w/--word-regexp` flag

- Repository: https://github.com/BurntSushi/ripgrep.git
- Parent: `cb66736f146f093497f4dc537b33d0826f9af33c`
- Commit: `4519153e5e461527f4bca45b042fff45c4ec6fb9`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `crates/core/flags/defs.rs`
- `GUIDE.md`

### 22. ripgrep 0a88cccd5188 - Fix compression tests in QEMU cross-compilation environments (#3248)

- Repository: https://github.com/BurntSushi/ripgrep.git
- Parent: `cd1f981beafaeb9b61537e47e91314cea125400b`
- Commit: `0a88cccd5188074de96f54a4b6b44a63971ac157`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `tests/misc.rs`
- `tests/util.rs`

### 23. ripgrep 85edf4c79671 - ignore: only stat `.jj` if we actually care

- Repository: https://github.com/BurntSushi/ripgrep.git
- Parent: `36b7597693c994ffaf023b95d2e18aeeda7d9286`
- Commit: `85edf4c79671b00002123a2a43ff5238b6a27891`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `CHANGELOG.md`
- `crates/ignore/src/dir.rs`

### 24. ripgrep 5748f81bb107 - printer: use `doc_cfg` instead of `doc_auto_cfg`

- Repository: https://github.com/BurntSushi/ripgrep.git
- Parent: `d47663b1b4548e4fa02d6e4b575718d0f5f5e7d6`
- Commit: `5748f81bb107ce65f32cff330fe90dc639af262c`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `crates/printer/Cargo.toml`
- `crates/printer/src/lib.rs`

### 25. ripgrep d47663b1b454 - searcher: fix regression with `--line-buffered` flag

- Repository: https://github.com/BurntSushi/ripgrep.git
- Parent: `38d630261aded3a8e535fe85761e68af35bc462d`
- Commit: `d47663b1b4548e4fa02d6e4b575718d0f5f5e7d6`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `CHANGELOG.md`
- `crates/searcher/src/line_buffer.rs`
- `crates/searcher/src/searcher/glue.rs`

### 26. vite 0c162e96a654 - refactor: show direct path type in bad character warning (#22339)

- Repository: https://github.com/vitejs/vite.git
- Parent: `672c96288fd5440bbecddc65551e713edeb8d403`
- Commit: `0c162e96a6545c93808e7338b9adeca2636596fa`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `packages/vite/src/node/__tests__/config.spec.ts`
- `packages/vite/src/node/config.ts`

### 27. vite 1ac46d64b81e - fix(create-vite): use `type="button"` to counter button in templates consistently (#22142)

- Repository: https://github.com/vitejs/vite.git
- Parent: `a4d828f2d5ed85440bc0774eab342e6f9a5e5f62`
- Commit: `1ac46d64b81e0ac12b4df1ed28fd91cee1fd5f0b`
- Replay: patch applied with `lf-pinned` mode and 14 files matched target commit exactly

- `packages/create-vite/template-lit-ts/src/my-element.ts`
- `packages/create-vite/template-lit/src/my-element.js`
- `packages/create-vite/template-preact-ts/src/app.tsx`
- `packages/create-vite/template-preact/src/app.jsx`
- `packages/create-vite/template-qwik-ts/src/app.tsx`
- `packages/create-vite/template-qwik/src/app.jsx`
- `packages/create-vite/template-react-ts/src/App.tsx`
- `packages/create-vite/template-react/src/App.jsx`
- `packages/create-vite/template-solid-ts/src/App.tsx`
- `packages/create-vite/template-solid/src/App.jsx`
- `packages/create-vite/template-svelte-ts/src/lib/Counter.svelte`
- `packages/create-vite/template-svelte/src/lib/Counter.svelte`
- `packages/create-vite/template-vue-ts/src/components/HelloWorld.vue`
- `packages/create-vite/template-vue/src/components/HelloWorld.vue`

### 28. vite adc995847f3c - test(glob-import): cover array patterns with sibling dirs sharing a prefix (#22281)

- Repository: https://github.com/vitejs/vite.git
- Parent: `ac36eb6907107734ff011413efea248b9f775373`
- Commit: `adc995847f3c8f7af01b63b3dd00fb54b11c4d02`
- Replay: patch applied with `lf-pinned` mode and 4 files matched target commit exactly

- `playground/glob-import/__tests__/glob-import.spec.ts`
- `playground/glob-import/array-common-base/pattern1/a.js`
- `playground/glob-import/array-common-base/pattern2/b.js`
- `playground/glob-import/index.html`

### 29. vite ac36eb690710 - test(glob-import): add backslash-escaped glob pattern test (#22283)

- Repository: https://github.com/vitejs/vite.git
- Parent: `83f0a785a2ae48d6761fb69f4b0523a24ae9342c`
- Commit: `ac36eb6907107734ff011413efea248b9f775373`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `playground/glob-import/__tests__/glob-import.spec.ts`
- `playground/glob-import/index.html`

### 30. vite 40a084727650 - refactor: typecheck client directory (#22284)

- Repository: https://github.com/vitejs/vite.git
- Parent: `5c7cec69b637544ab16009d8758df7dbbf7f2674`
- Commit: `40a0847276502b33a3942b3cfab04b20218f3543`
- Replay: patch applied with `lf-pinned` mode and 2 files matched target commit exactly

- `packages/vite/package.json`
- `packages/vite/src/client/client.ts`
