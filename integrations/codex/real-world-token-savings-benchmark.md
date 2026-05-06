# Real-World Token Savings Benchmark

Generated: 2026-05-05T20:16:16.083Z

This optional benchmark clones public repositories, selects one recent non-merge commit with a focused code change from each repo, and compares:

- **Baseline context:** every readable project text file in that checkout, excluding dependency, build, generated, binary/media, and lockfile surfaces.
- **Conducty focused context:** the changed readable files for the selected commit plus root manifests such as `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pubspec.yaml`, and `README.md` when present.
- **Workflow model:** a four-phase plan/execute/verify/review estimate. The naive baseline reloads whole-repo readable context in each phase; the Conducty path uses focused context for plan/execute/verify plus commit diff evidence for review, and is charged extra fixed overhead for plan, checkpoint, and verification notes.
- **Initial architecture proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This is a generous proxy because it charges no extra overhead to the initial architecture.
- **Token estimate:** `ceil(total UTF-8 characters / 4)` for a deterministic offline approximation.

This measures context-loading and workflow-context reduction for realistic focused tasks. It does not claim exact provider billing, universal savings for every task, or that an agent never needs more context during debugging.

## Summary

- Repositories measured: 8
- Baseline readable files: 4,362
- Focused context files: 60
- Baseline tokens: 4,927,357
- Focused tokens: 171,573
- Tokens saved: 4,755,784
- Aggregate savings: 96.5%
- Median per-repo savings: 92.1%
- Workflow baseline tokens: 19,730,228
- Initial architecture workflow tokens: 5,457,937
- Initial architecture workflow savings: 72.3%
- Workflow Conducty tokens: 556,180
- Workflow tokens saved: 19,174,048
- Workflow aggregate savings: 97.2%
- Workflow median per-repo savings: 93.6%
- Current architecture saved vs initial: 4,901,757 tokens (89.8%)

## Context Results

| Repo | Commit | Focused change | Baseline files | Focused files | Baseline tokens | Focused tokens | Saved tokens | Saved % |
|---|---|---|---:|---:|---:|---:|---:|---:|
| flutterzon_bloc | b3f5166929cb | Updated README.md and necessary packages | 228 | 9 | 170737 | 17053 | 153684 | 90.0% |
| express | 6c4249feec8a | docs: replace dummy with placeholder in example comments (#7064) | 175 | 5 | 180932 | 5217 | 175715 | 97.1% |
| flask | 9368fb3f3c52 | case-insensitive comparison | 216 | 4 | 296731 | 31048 | 265683 | 89.5% |
| fastapi | fb7429378d14 | Add pre-commit to check typos (#15482) | 2740 | 7 | 3262439 | 18008 | 3244431 | 99.4% |
| chi | a54874f0e2f1 | Bump minimum Go to 1.23, always use request.Pattern (#1048) | 84 | 3 | 89281 | 10510 | 78771 | 88.2% |
| redux | 9f3de7448348 | Fix redux-thunk imports in docs examples (#4779) | 361 | 13 | 439792 | 25854 | 413938 | 94.1% |
| preact | 21dd6d04c1a9 | forwardport from v10 (#5053) | 283 | 15 | 362973 | 62610 | 300363 | 82.8% |
| rustlings | 346753b673e0 | Make starting fireworks more fun :) | 275 | 4 | 124472 | 1273 | 123199 | 99.0% |

## Architecture Workflow Comparison

Formula: naive baseline = 4 * whole-repo tokens + 650 prompt tokens per phase. Initial architecture proxy = 1 * whole-repo tokens + 3 * focused tokens + commit diff tokens + 0 overhead tokens. Current PR architecture = 3 * focused tokens + commit diff tokens + 3200 plan/checkpoint/verification overhead tokens.

Initial aggregate savings vs naive baseline: 72.3%. Initial median per-repo savings: 68.8%. Current architecture aggregate savings vs initial proxy: 89.8%. Current median per-repo savings vs initial proxy: 79.6%.

| Repo | Naive workflow tokens | Initial architecture tokens | Current PR tokens | Diff evidence tokens | Current saved vs initial | Current saved vs initial % |
|---|---:|---:|---:|---:|---:|---:|
| flutterzon_bloc | 685548 | 225470 | 57933 | 3574 | 167537 | 74.3% |
| express | 726328 | 196923 | 19191 | 340 | 177732 | 90.3% |
| flask | 1189524 | 390215 | 96684 | 340 | 293531 | 75.2% |
| fastapi | 13052356 | 3317413 | 58174 | 950 | 3259239 | 98.2% |
| chi | 359724 | 121368 | 35287 | 557 | 86081 | 70.9% |
| redux | 1761768 | 520115 | 83523 | 2761 | 436592 | 83.9% |
| preact | 1454492 | 557466 | 197693 | 6663 | 359773 | 64.5% |
| rustlings | 500488 | 128967 | 7695 | 676 | 121272 | 94.0% |

## Selected Focus Files

### flutterzon_bloc

- URL: https://github.com/tejasbadone/flutterzon_bloc.git
- Commit: `b3f5166929cb5d3aff90f312cb45e97fc81ab981`
- Subject: Updated README.md and necessary packages
- Changed readable files selected: 9

- `lib/src/presentation/views/admin/admin_add_offer_screen.dart`
- `lib/src/presentation/views/admin/admin_add_product_screen.dart`
- `lib/src/presentation/views/admin/admin_analytics_screen.dart`
- `lib/src/presentation/widgets/account/account_button.dart`
- `lib/src/presentation/widgets/account/single_wish_list_product.dart`
- `lib/src/presentation/widgets/cart/add_to_card_offer.dart`
- `lib/src/presentation/widgets/common_widgets/custom_elevated_button.dart`
- `pubspec.yaml`
- `README.md`

### express

- URL: https://github.com/expressjs/express.git
- Commit: `6c4249feec8ab40631817c8e7001baf2ed022224`
- Subject: docs: replace dummy with placeholder in example comments (#7064)
- Changed readable files selected: 3

- `examples/auth/index.js`
- `examples/ejs/index.js`
- `examples/route-middleware/index.js`

### flask

- URL: https://github.com/pallets/flask.git
- Commit: `9368fb3f3c52d74534d14c1bef03c79c103356cd`
- Subject: case-insensitive comparison
- Changed readable files selected: 2

- `CHANGES.rst`
- `src/flask/sansio/app.py`

### fastapi

- URL: https://github.com/fastapi/fastapi.git
- Commit: `fb7429378d14bd2d868abf145e1f18724b15e25d`
- Subject: Add pre-commit to check typos (#15482)
- Changed readable files selected: 6

- `.pre-commit-config.yaml`
- `pyproject.toml`
- `tests/test_response_set_response_code_empty.py`
- `tests/test_tutorial/test_body_multiple_params/test_tutorial002.py`
- `tests/test_tutorial/test_body_multiple_params/test_tutorial005.py`
- `tests/test_ws_router.py`

### chi

- URL: https://github.com/go-chi/chi.git
- Commit: `a54874f0e2f12647a19e82ee70dfa8185014100c`
- Subject: Bump minimum Go to 1.23, always use request.Pattern (#1048)
- Changed readable files selected: 2

- `.github/workflows/ci.yml`
- `mux.go`

### redux

- URL: https://github.com/reduxjs/redux.git
- Commit: `9f3de7448348a9f87efc9076c23e245af29dab26`
- Subject: Fix redux-thunk imports in docs examples (#4779)
- Changed readable files selected: 10

- `docs/api/applyMiddleware.md`
- `docs/api/compose.md`
- `docs/tutorials/fundamentals/part-6-async-logic.md`
- `docs/tutorials/fundamentals/part-8-modern-redux.md`
- `docs/usage/ConfiguringYourStore.md`
- `examples/async/src/index.js`
- `examples/real-world/src/store/configureStore.dev.js`
- `examples/real-world/src/store/configureStore.prod.js`
- `examples/shopping-cart/src/index.js`
- `examples/universal/common/store/configureStore.js`

### preact

- URL: https://github.com/preactjs/preact.git
- Commit: `21dd6d04c1a9a43e5b60976bb5eb7d856253195b`
- Subject: forwardport from v10 (#5053)
- Changed readable files selected: 13

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

### rustlings

- URL: https://github.com/rust-lang/rustlings.git
- Commit: `346753b673e0ee0217fe40fcc0ebb21d9c0b0cfc`
- Subject: Make starting fireworks more fun :)
- Changed readable files selected: 2

- `exercises/07_structs/structs3.rs`
- `solutions/07_structs/structs3.rs`
