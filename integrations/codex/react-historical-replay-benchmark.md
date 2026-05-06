# Meta React Historical Replay Benchmark

Generated: 2026-05-06T12:20:04.476Z

This benchmark is stricter than a context-size estimate. It selects recent focused non-merge commits from Meta's public `facebook/react` repository, creates a parent-state focused workspace for each commit, applies the real historical patch, and verifies every replayed focused file exactly matches the target commit.

- **Replay gate:** the historical patch must apply to parent-state files and reproduce target-state files exactly.
- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.
- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.
- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and 3200 fixed tokens for plan/checkpoint/verification overhead.
- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.

This is still not an autonomous-agent success benchmark or exact provider-billing trace. It is an end-to-end historical patch replay benchmark with exact target-file verification.

## Summary

- Repository: https://github.com/facebook/react.git
- Commits replayed: 12
- Replayed commits passed: 12/12
- Target files verified exactly: 64
- Patch bytes applied: 120,479
- Baseline readable files counted across parent checkouts: 79,034
- Focused context files counted across replays: 148
- Baseline context tokens: 80,398,644
- Focused context tokens: 706,027
- One-pass context tokens saved: 79,692,617 (99.1%)
- Naive workflow tokens: 321,625,776
- Initial architecture workflow tokens: 82,546,849
- Initial architecture savings vs naive: 74.3%
- Current PR workflow tokens: 2,186,605
- Current PR savings vs naive: 99.3%
- Current PR saved vs initial: 80,360,244 tokens (97.4%)
- Median current-vs-initial per-replay savings: 97.8%

## Replay Results

| Commit | Focused change | Changed files | Verified files | Baseline tokens | Focused tokens | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 9635257c1b55 | [DevTools] Preserve -Infinity in inspected values (#36347) | 6 | 6 | 6714409 | 52758 | 6873915 | 162706 | 6711209 | 97.6% |
| f4e0d4ed0cb4 | [enableInfiniteRenderLoopDetection] Add a flag to force throwing (#36357) | 11 | 11 | 6712504 | 97955 | 7010570 | 301266 | 6709304 | 95.7% |
| ad5dfc82b710 | Add react-flight-server-fb package for Meta's internal bundler (#36309) | 22 | 22 | 6699793 | 39305 | 6832191 | 135598 | 6696593 | 98.0% |
| 142cfde89eda | Fix FragmentInstance listener leak: normalize boolean vs object capture options per DOM spec (#36047) | 2 | 2 | 6698463 | 84743 | 6954494 | 259231 | 6695263 | 96.3% |
| 94643c3b8516 | Suggest correct casing for misspelled credentialless iframe attribute (#36322) | 2 | 2 | 6698360 | 41801 | 6824143 | 128983 | 6695160 | 98.1% |
| 306a01b4e024 | Add credentialless as a recognized boolean attribute for iframes (#36148) | 5 | 5 | 6697885 | 119428 | 7057465 | 362780 | 6694685 | 94.9% |
| d1727fbf9873 | [eprh] Update changelog for 7.1.1 (#36308) | 2 | 2 | 6697784 | 9602 | 6726911 | 32327 | 6694584 | 99.5% |
| bc249804d3c2 | [eprh] Add back a no-op for removed component-hook-factories rule (#36307) | 2 | 2 | 6697715 | 6813 | 6718631 | 24116 | 6694515 | 99.6% |
| da9325b51937 | [Fiber] Double invoke Effects in StrictMode after Fast Refresh (#35962) | 2 | 2 | 6697101 | 73696 | 6919063 | 225162 | 6693901 | 96.7% |
| 67e47593b607 | [Fiber] Double invoke Effects in Strict Mode during Hydration (#35961) | 5 | 5 | 6695468 | 134778 | 7102624 | 410356 | 6692268 | 94.2% |
| 23fcd7cea1ec | Minify prod error messages for all browser bundles (#36277) | 2 | 2 | 6695034 | 30386 | 6787533 | 95699 | 6691834 | 98.6% |
| f6fe4275c7ec | Wire up createViewTransitionInstance and suspendOnActiveViewTransition in Fabric (#36196) | 3 | 3 | 6694128 | 14762 | 6739309 | 48381 | 6690928 | 99.3% |

## Replayed Files

### 1. 9635257c1b55 - [DevTools] Preserve -Infinity in inspected values (#36347)

- Parent: `4f273bd36493cd3e818a15a5da5f82ba6af7f812`
- Commit: `9635257c1b557acc81f95b1e974a54c752e703a2`
- Replay: patch applied and 6 files matched target commit exactly

- `packages/react-devtools-shared/src/__tests__/inspectedElement-test.js`
- `packages/react-devtools-shared/src/__tests__/legacy/inspectElement-test.js`
- `packages/react-devtools-shared/src/devtools/utils.js`
- `packages/react-devtools-shared/src/hydration.js`
- `packages/react-devtools-shared/src/utils.js`
- `packages/react-devtools-shell/src/app/InspectableElements/SimpleValues.js`

### 2. f4e0d4ed0cb4 - [enableInfiniteRenderLoopDetection] Add a flag to force throwing (#36357)

- Parent: `ad5dfc82b7107728da1430dd142f75b97b684dac`
- Commit: `f4e0d4ed0cb44f5f106579d20824f49ec41247f3`
- Replay: patch applied and 11 files matched target commit exactly

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

### 3. ad5dfc82b710 - Add react-flight-server-fb package for Meta's internal bundler (#36309)

- Parent: `561ed529b3a6a16e5b2b76fa5ee86c09f959686c`
- Commit: `ad5dfc82b7107728da1430dd142f75b97b684dac`
- Replay: patch applied and 22 files matched target commit exactly

- `.eslintrc.js`
- `packages/react-client/src/forks/ReactFlightClientConfig.dom-browser-fb.js`
- `packages/react-client/src/forks/ReactFlightClientConfig.dom-node-fb.js`
- `packages/react-flight-server-fb/client.browser.js`
- `packages/react-flight-server-fb/package.json`
- `packages/react-flight-server-fb/README.md`
- `packages/react-flight-server-fb/src/client/ReactFlightClientConfigBundlerFB.js`
- `packages/react-flight-server-fb/src/client/ReactFlightClientConfigDOMFB.js`
- `packages/react-flight-server-fb/src/client/ReactFlightClientConfigTargetFBBrowser.js`
- `packages/react-flight-server-fb/src/client/ReactFlightDOMClientBrowser.js`
- `packages/react-flight-server-fb/src/ReactFlightFBReferences.js`
- `packages/react-flight-server-fb/src/ReactServerStreamConfigFB.js`
- `packages/react-flight-server-fb/src/server/react-flight-dom-server.node.js`
- `packages/react-flight-server-fb/src/server/ReactFlightDOMServerNode.js`
- `packages/react-flight-server-fb/src/server/ReactFlightServerConfigDOMFB.js`
- `packages/react-flight-server-fb/src/server/ReactFlightServerConfigFBBundler.js`
- `packages/react-server/src/forks/ReactFlightServerConfig.dom-browser-fb.js`
- `packages/react-server/src/forks/ReactFlightServerConfig.dom-node-fb.js`
- `packages/react-server/src/forks/ReactServerStreamConfig.dom-browser-fb.js`
- `packages/react-server/src/forks/ReactServerStreamConfig.dom-node-fb.js`
- `scripts/rollup/bundles.js`
- `scripts/shared/inlinedHostConfigs.js`

### 4. 142cfde89eda - Fix FragmentInstance listener leak: normalize boolean vs object capture options per DOM spec (#36047)

- Parent: `94643c3b8516928e4cc7fad99912272670a0a990`
- Commit: `142cfde89edab3d4eabd6335458b4c8736cebfb6`
- Replay: patch applied and 2 files matched target commit exactly

- `packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js`
- `packages/react-dom/src/__tests__/ReactDOMFragmentRefs-test.js`

### 5. 94643c3b8516 - Suggest correct casing for misspelled credentialless iframe attribute (#36322)

- Parent: `306a01b4e0242e9379ba971c8925670651f16818`
- Commit: `94643c3b8516928e4cc7fad99912272670a0a990`
- Replay: patch applied and 2 files matched target commit exactly

- `packages/react-dom-bindings/src/shared/possibleStandardNames.js`
- `packages/react-dom/src/__tests__/ReactDOMComponent-test.js`

### 6. 306a01b4e024 - Add credentialless as a recognized boolean attribute for iframes (#36148)

- Parent: `3ee1fe4a8ead714cee51be09f64ecd3a81df1acb`
- Commit: `306a01b4e0242e9379ba971c8925670651f16818`
- Replay: patch applied and 5 files matched target commit exactly

- `packages/react-dom-bindings/src/client/ReactDOMComponent.js`
- `packages/react-dom-bindings/src/server/ReactFizzConfigDOM.js`
- `packages/react-dom-bindings/src/shared/ReactDOMUnknownPropertyHook.js`
- `packages/react-dom/src/__tests__/DOMPropertyOperations-test.js`
- `packages/react-dom/src/__tests__/ReactDOMServerIntegrationAttributes-test.js`

### 7. d1727fbf9873 - [eprh] Update changelog for 7.1.1 (#36308)

- Parent: `bc249804d3c2ea6ee95bc5543c3735a65d1239b5`
- Commit: `d1727fbf987392749b374f3afe62227d2c70fc41`
- Replay: patch applied and 2 files matched target commit exactly

- `packages/eslint-plugin-react-hooks/CHANGELOG.md`
- `ReactVersions.js`

### 8. bc249804d3c2 - [eprh] Add back a no-op for removed component-hook-factories rule (#36307)

- Parent: `da9325b519376e2d65cdf6d509ade053e14ec5b3`
- Commit: `bc249804d3c2ea6ee95bc5543c3735a65d1239b5`
- Replay: patch applied and 2 files matched target commit exactly

- `packages/eslint-plugin-react-hooks/README.md`
- `packages/eslint-plugin-react-hooks/src/index.ts`

### 9. da9325b51937 - [Fiber] Double invoke Effects in StrictMode after Fast Refresh (#35962)

- Parent: `67e47593b607ecc08ac59361d8aba7ad2eef028a`
- Commit: `da9325b519376e2d65cdf6d509ade053e14ec5b3`
- Replay: patch applied and 2 files matched target commit exactly

- `packages/react-reconciler/src/ReactFiberBeginWork.js`
- `packages/react-refresh/src/__tests__/ReactFresh-test.js`

### 10. 67e47593b607 - [Fiber] Double invoke Effects in Strict Mode during Hydration (#35961)

- Parent: `23fcd7cea1ec553f9b217bc148e8d94e2d0097bd`
- Commit: `67e47593b607ecc08ac59361d8aba7ad2eef028a`
- Replay: patch applied and 5 files matched target commit exactly

- `packages/react-dom/src/__tests__/ReactDOMServerPartialHydration-test.internal.js`
- `packages/react-dom/src/__tests__/ReactServerRenderingHydration-test.js`
- `packages/react-reconciler/src/__tests__/ActivityStrictMode-test.js`
- `packages/react-reconciler/src/ReactFiberBeginWork.js`
- `packages/react-reconciler/src/ReactFiberWorkLoop.js`

### 11. 23fcd7cea1ec - Minify prod error messages for all browser bundles (#36277)

- Parent: `bf45a68dd35ed08860b6a70fed641dfe6d7d290d`
- Commit: `23fcd7cea1ec553f9b217bc148e8d94e2d0097bd`
- Replay: patch applied and 2 files matched target commit exactly

- `scripts/error-codes/codes.json`
- `scripts/rollup/bundles.js`

### 12. f6fe4275c7ec - Wire up createViewTransitionInstance and suspendOnActiveViewTransition in Fabric (#36196)

- Parent: `fe5160140d79ea023a9db6fbb914ed6c6b6ae0dd`
- Commit: `f6fe4275c7ec869e20a4b91f70df88cdc14d5161`
- Replay: patch applied and 3 files matched target commit exactly

- `packages/react-native-renderer/src/ReactFiberConfigFabric.js`
- `packages/react-native-renderer/src/ReactFiberConfigFabricWithViewTransition.js`
- `scripts/flow/react-native-host-hooks.js`
