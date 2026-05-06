# Final Cross-Repo Historical Replay Benchmark

Generated: 2026-05-06T12:52:45.736Z

This benchmark is the strictest checked-in evidence snapshot for the Conducty Codex integration. It samples recent focused non-merge commits across public repositories and languages, creates parent-state focused workspaces, applies the real historical patches, and verifies every replayed file exactly matches the target commit.

- **Replay gate:** a row counts only if the historical patch applies to parent-state files and reproduces target-state files byte-for-byte.
- **Host checkout guard:** replay tries the default Git apply behavior first, then an LF-pinned mode, and still accepts only byte-exact target archive matches.
- **Cross-repo gate:** the default run covers React, Flutter, Node, Python, Go, TypeScript, Preact, and Rust training repos.
- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.
- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.
- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and 3200 fixed tokens for plan/checkpoint/verification overhead.
- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.

This is still not an autonomous-agent success benchmark, product-wide guarantee, or exact provider-billing trace. It is a deterministic cross-repo historical patch replay benchmark with exact target-file verification.

## Summary

- Repositories measured: 9
- Replayed commits passed: 18/18
- Candidate commits skipped before replay success: 0
- Target files verified exactly: 88
- Patch bytes applied: 109,324
- Baseline readable files counted across parent checkouts: 22,008
- Focused context files counted across replays: 131
- Baseline context tokens: 23,746,818
- Focused context tokens: 416,489
- One-pass context tokens saved: 23,330,329 (98.2%)
- Naive workflow tokens: 95,034,072
- Initial architecture workflow tokens: 25,023,609
- Initial architecture savings vs naive: 73.7%
- Current PR workflow tokens: 1,334,391
- Current PR savings vs naive: 98.6%
- Current PR saved vs initial: 23,689,218 tokens (94.7%)
- Median current-vs-initial per-replay savings: 90.2%

## Repository Results

| Repository | Replays | Skipped candidates | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| react | 2 | 0 | 17 | 13491141 | 149541 | 13945197 | 460456 | 13484741 | 96.7% |
| flutterzon_bloc | 2 | 0 | 13 | 341308 | 22418 | 411734 | 76826 | 334908 | 81.3% |
| express | 2 | 0 | 5 | 361610 | 8052 | 386469 | 31259 | 355210 | 91.9% |
| flask | 2 | 0 | 5 | 593511 | 39723 | 714187 | 127076 | 587111 | 82.2% |
| fastapi | 2 | 0 | 9 | 6850382 | 41223 | 6978524 | 134542 | 6843982 | 98.1% |
| chi | 2 | 0 | 4 | 179052 | 19735 | 238985 | 66333 | 172652 | 72.2% |
| redux | 2 | 0 | 15 | 953461 | 48848 | 1103315 | 156254 | 947061 | 85.8% |
| preact | 2 | 0 | 15 | 724660 | 68248 | 936271 | 218011 | 718260 | 76.7% |
| rustlings | 2 | 0 | 5 | 251693 | 18701 | 308927 | 63634 | 245293 | 79.4% |

## Replay Results

| Repository | Commit | Focused change | Apply mode | Changed files | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial % |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| react | 9635257c1b55 | [DevTools] Preserve -Infinity in inspected values (#36347) | default | 6 | 6 | 6746523 | 52172 | 6904271 | 160948 | 97.7% |
| react | f4e0d4ed0cb4 | [enableInfiniteRenderLoopDetection] Add a flag to force throwing (#36357) | default | 11 | 11 | 6744618 | 97369 | 7040926 | 299508 | 95.7% |
| flutterzon_bloc | b3f5166929cb | Updated README.md and necessary packages | default | 9 | 9 | 170666 | 16982 | 223983 | 56517 | 74.8% |
| flutterzon_bloc | 82dda0533d28 | updated Readme and bugs fixed | default | 4 | 4 | 170642 | 5436 | 187751 | 20309 | 89.2% |
| express | 6c4249feec8a | docs: replace dummy with placeholder in example comments (#7064) | default | 3 | 3 | 180928 | 2599 | 189065 | 11337 | 94.0% |
| express | 9c85a25c02e8 | Remove duplicate tests in res.location and res.jsonp (#6996) | default | 2 | 2 | 180682 | 5453 | 197404 | 19922 | 89.9% |
| flask | 9368fb3f3c52 | case-insensitive comparison | default | 2 | 2 | 296669 | 30986 | 389967 | 96498 | 75.3% |
| flask | 06ea505ce2b2 | separate copy per call | default | 3 | 3 | 296842 | 8737 | 324220 | 30578 | 90.6% |
| fastapi | fb7429378d14 | Add pre-commit to check typos (#15482) | default | 5 | 5 | 3425680 | 16818 | 3477023 | 54543 | 98.4% |
| fastapi | b363a1d0023b | Improve layout and styling (#15462) | default | 4 | 4 | 3424702 | 24405 | 3501501 | 79999 | 97.7% |
| chi | a54874f0e2f1 | Bump minimum Go to 1.23, always use request.Pattern (#1048) | default | 2 | 2 | 89512 | 10517 | 121256 | 34944 | 71.2% |
| chi | a36a925a6a19 | Remove last uses of io/ioutil (#1054) | default | 2 | 2 | 89540 | 9218 | 117729 | 31389 | 73.3% |
| redux | 9f3de7448348 | Fix redux-thunk imports in docs examples (#4779) | lf-pinned | 12 | 12 | 476853 | 43152 | 609070 | 135417 | 77.8% |
| redux | fa9dc9d0b4bd | Fix issue with `combineReducer` returning incorrect type when given a custom action (#4765) | lf-pinned | 3 | 3 | 476608 | 5696 | 494245 | 20837 | 95.8% |
| preact | 21dd6d04c1a9 | forwardport from v10 (#5053) | default | 13 | 13 | 362338 | 62178 | 555535 | 196397 | 64.6% |
| preact | 6dd0e3e0b4d3 | Beta.1 (#5009) | default | 2 | 2 | 362322 | 6070 | 380736 | 21614 | 94.3% |
| rustlings | 346753b673e0 | Make starting fireworks more fun :) | default | 2 | 2 | 124561 | 1366 | 129335 | 7974 | 93.8% |
| rustlings | 432d1f84ea68 | Add --no-editor | default | 3 | 3 | 127132 | 17335 | 179592 | 55660 | 69.0% |

## Replayed Files

### 1. react 9635257c1b55 - [DevTools] Preserve -Infinity in inspected values (#36347)

- Repository: https://github.com/facebook/react.git
- Parent: `4f273bd36493cd3e818a15a5da5f82ba6af7f812`
- Commit: `9635257c1b557acc81f95b1e974a54c752e703a2`
- Replay: patch applied with `default` mode and 6 files matched target commit exactly

- `packages/react-devtools-shared/src/__tests__/inspectedElement-test.js`
- `packages/react-devtools-shared/src/__tests__/legacy/inspectElement-test.js`
- `packages/react-devtools-shared/src/devtools/utils.js`
- `packages/react-devtools-shared/src/hydration.js`
- `packages/react-devtools-shared/src/utils.js`
- `packages/react-devtools-shell/src/app/InspectableElements/SimpleValues.js`

### 2. react f4e0d4ed0cb4 - [enableInfiniteRenderLoopDetection] Add a flag to force throwing (#36357)

- Repository: https://github.com/facebook/react.git
- Parent: `ad5dfc82b7107728da1430dd142f75b97b684dac`
- Commit: `f4e0d4ed0cb44f5f106579d20824f49ec41247f3`
- Replay: patch applied with `default` mode and 11 files matched target commit exactly

- `packages/react-dom/src/__tests__/ReactUpdates-test.js`
- `packages/react-reconciler/src/ReactFiberWorkLoop.js`
- `packages/shared/forks/ReactFeatureFlags.native-fb.js`
- `packages/shared/forks/ReactFeatureFlags.native-oss.js`
- `packages/shared/forks/ReactFeatureFlags.test-renderer.js`
- `packages/shared/forks/ReactFeatureFlags.test-renderer.native-fb.js`
- `packages/shared/forks/ReactFeatureFlags.test-renderer.www.js`
- `packages/shared/forks/ReactFeatureFlags.www-dynamic.js`
- `packages/shared/forks/ReactFeatureFlags.www.js`
- `packages/shared/ReactFeatureFlags.js`
- `scripts/error-codes/codes.json`

### 3. flutterzon_bloc b3f5166929cb - Updated README.md and necessary packages

- Repository: https://github.com/tejasbadone/flutterzon_bloc.git
- Parent: `82dda0533d2871afc5207807da1fba4b6ba690da`
- Commit: `b3f5166929cb5d3aff90f312cb45e97fc81ab981`
- Replay: patch applied with `default` mode and 9 files matched target commit exactly

- `lib/src/presentation/views/admin/admin_add_offer_screen.dart`
- `lib/src/presentation/views/admin/admin_add_product_screen.dart`
- `lib/src/presentation/views/admin/admin_analytics_screen.dart`
- `lib/src/presentation/widgets/account/account_button.dart`
- `lib/src/presentation/widgets/account/single_wish_list_product.dart`
- `lib/src/presentation/widgets/cart/add_to_card_offer.dart`
- `lib/src/presentation/widgets/common_widgets/custom_elevated_button.dart`
- `pubspec.yaml`
- `README.md`

### 4. flutterzon_bloc 82dda0533d28 - updated Readme and bugs fixed

- Repository: https://github.com/tejasbadone/flutterzon_bloc.git
- Parent: `eb6f3e7677211d67b9081e3c59fd924061456b85`
- Commit: `82dda0533d2871afc5207807da1fba4b6ba690da`
- Replay: patch applied with `default` mode and 4 files matched target commit exactly

- `lib/src/data/repositories/auth_repository.dart`
- `README.md`
- `server/model/user.js`
- `server/routes/auth.js`

### 5. express 6c4249feec8a - docs: replace dummy with placeholder in example comments (#7064)

- Repository: https://github.com/expressjs/express.git
- Parent: `06e2367f91490f241e8932b56ffda042ec0debb5`
- Commit: `6c4249feec8ab40631817c8e7001baf2ed022224`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `examples/auth/index.js`
- `examples/ejs/index.js`
- `examples/route-middleware/index.js`

### 6. express 9c85a25c02e8 - Remove duplicate tests in res.location and res.jsonp (#6996)

- Repository: https://github.com/expressjs/express.git
- Parent: `1140301f6a0ed5a05bc1ef38d48294f75a49580c`
- Commit: `9c85a25c02e83ad16e1561d02c8ede652f0ef15b`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `test/res.jsonp.js`
- `test/res.location.js`

### 7. flask 9368fb3f3c52 - case-insensitive comparison

- Repository: https://github.com/pallets/flask.git
- Parent: `06ea505ce2b2042af26e96d35ebf159af7c0869d`
- Commit: `9368fb3f3c52d74534d14c1bef03c79c103356cd`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `CHANGES.rst`
- `src/flask/sansio/app.py`

### 8. flask 06ea505ce2b2 - separate copy per call

- Repository: https://github.com/pallets/flask.git
- Parent: `2ac89889f4cc330eabd50f295dcef02828522c69`
- Commit: `06ea505ce2b2042af26e96d35ebf159af7c0869d`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `pyproject.toml`
- `src/flask/ctx.py`
- `tests/test_reqctx.py`

### 9. fastapi fb7429378d14 - Add pre-commit to check typos (#15482)

- Repository: https://github.com/fastapi/fastapi.git
- Parent: `3efd86c1fde830c79b1233b4ecbb46b3dde81066`
- Commit: `fb7429378d14bd2d868abf145e1f18724b15e25d`
- Replay: patch applied with `default` mode and 5 files matched target commit exactly

- `.pre-commit-config.yaml`
- `pyproject.toml`
- `tests/test_tutorial/test_body_multiple_params/test_tutorial002.py`
- `tests/test_tutorial/test_body_multiple_params/test_tutorial005.py`
- `tests/test_ws_router.py`

### 10. fastapi b363a1d0023b - Improve layout and styling (#15462)

- Repository: https://github.com/fastapi/fastapi.git
- Parent: `a3ceb9ca7415d8874233edac857e85e47d2a6680`
- Commit: `b363a1d0023b25fba9231c17ae371c9d44c65c68`
- Replay: patch applied with `default` mode and 4 files matched target commit exactly

- `docs/en/docs/css/custom.css`
- `docs/en/docs/index.md`
- `README.md`
- `scripts/docs.py`

### 11. chi a54874f0e2f1 - Bump minimum Go to 1.23, always use request.Pattern (#1048)

- Repository: https://github.com/go-chi/chi.git
- Parent: `3328d4d3ab8a08547fa419ed657017355e6d3c4d`
- Commit: `a54874f0e2f12647a19e82ee70dfa8185014100c`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `.github/workflows/ci.yml`
- `mux.go`

### 12. chi a36a925a6a19 - Remove last uses of io/ioutil (#1054)

- Repository: https://github.com/go-chi/chi.git
- Parent: `7d93ee3e86b4d477c20d809c9b1ce9a281dfd706`
- Commit: `a36a925a6a195943ec104100d7d18757543e745f`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `middleware/compress_test.go`
- `middleware/throttle_test.go`

### 13. redux 9f3de7448348 - Fix redux-thunk imports in docs examples (#4779)

- Repository: https://github.com/reduxjs/redux.git
- Parent: `7130024ce3777af9d1ff067b0d600bf8953ade48`
- Commit: `9f3de7448348a9f87efc9076c23e245af29dab26`
- Replay: patch applied with `lf-pinned` mode and 12 files matched target commit exactly

- `docs/api/applyMiddleware.md`
- `docs/api/compose.md`
- `docs/tutorials/fundamentals/part-6-async-logic.md`
- `docs/tutorials/fundamentals/part-8-modern-redux.md`
- `docs/usage/ConfiguringYourStore.md`
- `docs/usage/migrating-to-modern-redux.mdx`
- `docs/usage/writing-logic-thunks.mdx`
- `examples/async/src/index.js`
- `examples/real-world/src/store/configureStore.dev.js`
- `examples/real-world/src/store/configureStore.prod.js`
- `examples/shopping-cart/src/index.js`
- `examples/universal/common/store/configureStore.js`

### 14. redux fa9dc9d0b4bd - Fix issue with `combineReducer` returning incorrect type when given a custom action (#4765)

- Repository: https://github.com/reduxjs/redux.git
- Parent: `d129739783b6453ef5b1d4106d28bd268bf7bf0d`
- Commit: `fa9dc9d0b4bd6423b041d68c2f5c312308ae648e`
- Replay: patch applied with `lf-pinned` mode and 3 files matched target commit exactly

- `src/types/reducers.ts`
- `test/typescript/reducers.test-d.ts`
- `tsconfig.base.json`

### 15. preact 21dd6d04c1a9 - forwardport from v10 (#5053)

- Repository: https://github.com/preactjs/preact.git
- Parent: `2459326755dea9ad6184b42bda1128c5004b8544`
- Commit: `21dd6d04c1a9a43e5b60976bb5eb7d856253195b`
- Replay: patch applied with `default` mode and 13 files matched target commit exactly

- `compat/src/index.js`
- `compat/src/memo.js`
- `compat/src/render.js`
- `compat/src/suspense.js`
- `compat/test/browser/component.test.jsx`
- `compat/test/browser/PureComponent.test.jsx`
- `compat/test/browser/useSyncExternalStore.test.jsx`
- `hooks/src/index.js`
- `hooks/test/browser/useEffect.test.jsx`
- `src/component.js`
- `src/diff/index.js`
- `test/browser/components.test.jsx`
- `test/browser/render.test.jsx`

### 16. preact 6dd0e3e0b4d3 - Beta.1 (#5009)

- Repository: https://github.com/preactjs/preact.git
- Parent: `cd939cc53a8054db70cb71fdda735f7b8b2e37ab`
- Commit: `6dd0e3e0b4d3d4e5c1596d123edb86f0119fd854`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `devtools/src/devtools.js`
- `package.json`

### 17. rustlings 346753b673e0 - Make starting fireworks more fun :)

- Repository: https://github.com/rust-lang/rustlings.git
- Parent: `7c1d8ebf49f5dcfe4c6bee0fd881a6922cbc0395`
- Commit: `346753b673e0ee0217fe40fcc0ebb21d9c0b0cfc`
- Replay: patch applied with `default` mode and 2 files matched target commit exactly

- `exercises/07_structs/structs3.rs`
- `solutions/07_structs/structs3.rs`

### 18. rustlings 432d1f84ea68 - Add --no-editor

- Repository: https://github.com/rust-lang/rustlings.git
- Parent: `b5fbf59c0c79a78e06d0fffd9db86abf0774e0f6`
- Commit: `432d1f84ea68d21e865215281764094a73236da0`
- Replay: patch applied with `default` mode and 3 files matched target commit exactly

- `CHANGELOG.md`
- `src/cli.rs`
- `src/main.rs`
