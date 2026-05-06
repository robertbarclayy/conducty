# Meta React Token Savings Benchmark

Generated: 2026-05-06T12:10:10.740Z

This benchmark is a focused stress test against Meta's public `facebook/react` repository. It selects recent focused non-merge commits with code changes and compares the same three architecture lanes used by the broader Conducty benchmark.

- **Naive baseline:** reload whole-repo readable context for plan, execute, verify, and review.
- **Initial Conducty proxy:** one broad `conducty-context` pass over readable repo context, then focused plan/execute/verify work and diff review. This proxy is generous because it charges zero extra overhead.
- **Current PR architecture:** focused plan/execute/verify context plus diff evidence and 3200 fixed tokens for plan/checkpoint/verification overhead.
- **Token estimate:** `ceil(total UTF-8 characters / 4)`, deterministic and offline.

This is not an exact provider-billing trace. It measures workflow-context volume under a documented model on a large real-world React repository.

## Summary

- Repository: https://github.com/facebook/react.git
- Commits measured: 20
- Baseline readable files counted across checkouts: 131,840
- Focused context files counted across checkouts: 234
- Baseline context tokens: 134,142,292
- Focused context tokens: 1,016,503
- One-pass context tokens saved: 133,125,789 (99.2%)
- Naive workflow tokens: 536,621,168
- Initial architecture workflow tokens: 137,284,764
- Initial architecture savings vs naive: 74.4%
- Current PR workflow tokens: 3,206,472
- Current PR savings vs naive: 99.4%
- Current PR saved vs initial: 134,078,292 tokens (97.7%)
- Median current-vs-initial per-commit savings: 98.0%

## Results

| Commit | Focused change | Changed files | Baseline tokens | Focused tokens | Naive workflow | Initial architecture | Current PR | Current saved vs initial | Current saved vs initial % |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 9635257c1b55 | [DevTools] Preserve -Infinity in inspected values (#36347) | 6 | 6714517 | 52866 | 26860668 | 6874347 | 163030 | 6711317 | 97.6% |
| f4e0d4ed0cb4 | [enableInfiniteRenderLoopDetection] Add a flag to force throwing (#36357) | 11 | 6714267 | 99717 | 26859668 | 7017619 | 306552 | 6711067 | 95.6% |
| ad5dfc82b710 | Add react-flight-server-fb package for Meta's internal bundler (#36309) | 22 | 6712504 | 40164 | 26852616 | 6850247 | 140943 | 6709304 | 97.9% |
| 142cfde89eda | Fix FragmentInstance listener leak: normalize boolean vs object capture options per DOM spec (#36047) | 2 | 6699917 | 86196 | 26802268 | 6960307 | 263590 | 6696717 | 96.2% |
| 94643c3b8516 | Suggest correct casing for misspelled credentialless iframe attribute (#36322) | 2 | 6698463 | 41904 | 26796452 | 6824555 | 129292 | 6695263 | 98.1% |
| 306a01b4e024 | Add credentialless as a recognized boolean attribute for iframes (#36148) | 5 | 6698360 | 119903 | 26796040 | 7059365 | 364205 | 6695160 | 94.8% |
| d1727fbf9873 | [eprh] Update changelog for 7.1.1 (#36308) | 2 | 6697873 | 9692 | 26794092 | 6727270 | 32597 | 6694673 | 99.5% |
| bc249804d3c2 | [eprh] Add back a no-op for removed component-hook-factories rule (#36307) | 2 | 6697784 | 6882 | 26793736 | 6718907 | 24323 | 6694584 | 99.6% |
| da9325b51937 | [Fiber] Double invoke Effects in StrictMode after Fast Refresh (#35962) | 2 | 6697715 | 74309 | 26793460 | 6921516 | 227001 | 6694515 | 96.7% |
| 67e47593b607 | [Fiber] Double invoke Effects in Strict Mode during Hydration (#35961) | 5 | 6697101 | 136412 | 26791004 | 7109159 | 415258 | 6693901 | 94.2% |
| 23fcd7cea1ec | Minify prod error messages for all browser bundles (#36277) | 2 | 6695468 | 30820 | 26784472 | 6789269 | 97001 | 6692268 | 98.6% |
| f6fe4275c7ec | Wire up createViewTransitionInstance and suspendOnActiveViewTransition in Fabric (#36196) | 3 | 6694255 | 14888 | 26779620 | 6739814 | 48759 | 6691055 | 99.3% |
| fe5160140d79 | Wire up startViewTransitionReadyFinished in Fabric (#36246) | 2 | 6694128 | 7765 | 26779112 | 6717744 | 26816 | 6690928 | 99.6% |
| ea6792026ff7 | [Fizz] prevent reentrant finishedTask from calling completeAll multiple times (#36287) | 2 | 6694085 | 129102 | 26778940 | 7082704 | 391819 | 6690885 | 94.5% |
| 56922cf751fa | [react-native-renderer] Delete Paper (legacy) renderer (#36285) | 10 | 6693181 | 43864 | 26775324 | 6864609 | 174628 | 6689981 | 97.5% |
| 00f063c31d60 | [test] Make `enableSuspenseyImages` dynamic (#36274) | 2 | 6727881 | 5903 | 26914124 | 6745983 | 21302 | 6724681 | 99.7% |
| 0418c8a8b61a | [RN] Move new event dispatching pipeline to RN (#36266) | 3 | 6727873 | 8748 | 26914092 | 6760989 | 36316 | 6724673 | 99.5% |
| 568244232e29 | [react-native-renderer] EventTarget-based event dispatching (#36253) | 10 | 6733923 | 23398 | 26938292 | 6812940 | 82217 | 6730723 | 98.8% |
| fef12a01c826 | fix: explicitly warn for infinite loops discovered only via enableInfiniteRenderLoopDetection (#36195) | 3 | 6726992 | 74189 | 26910568 | 6951297 | 227505 | 6723792 | 96.7% |
| 705268dcd167 | Fix require('ReactFeatureFlags') in eslint-plugin-react-hooks www build (#36243) | 3 | 6726005 | 9781 | 26906620 | 6756123 | 33318 | 6722805 | 99.5% |

## Selected Changed Files

### 1. 9635257c1b55 - [DevTools] Preserve -Infinity in inspected values (#36347)

- Commit: `9635257c1b557acc81f95b1e974a54c752e703a2`
- Changed readable files selected: 6

- `packages/react-devtools-shared/src/__tests__/inspectedElement-test.js`
- `packages/react-devtools-shared/src/__tests__/legacy/inspectElement-test.js`
- `packages/react-devtools-shared/src/devtools/utils.js`
- `packages/react-devtools-shared/src/hydration.js`
- `packages/react-devtools-shared/src/utils.js`
- `packages/react-devtools-shell/src/app/InspectableElements/SimpleValues.js`

### 2. f4e0d4ed0cb4 - [enableInfiniteRenderLoopDetection] Add a flag to force throwing (#36357)

- Commit: `f4e0d4ed0cb44f5f106579d20824f49ec41247f3`
- Changed readable files selected: 11

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

- Commit: `ad5dfc82b7107728da1430dd142f75b97b684dac`
- Changed readable files selected: 22

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

- Commit: `142cfde89edab3d4eabd6335458b4c8736cebfb6`
- Changed readable files selected: 2

- `packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js`
- `packages/react-dom/src/__tests__/ReactDOMFragmentRefs-test.js`

### 5. 94643c3b8516 - Suggest correct casing for misspelled credentialless iframe attribute (#36322)

- Commit: `94643c3b8516928e4cc7fad99912272670a0a990`
- Changed readable files selected: 2

- `packages/react-dom-bindings/src/shared/possibleStandardNames.js`
- `packages/react-dom/src/__tests__/ReactDOMComponent-test.js`

### 6. 306a01b4e024 - Add credentialless as a recognized boolean attribute for iframes (#36148)

- Commit: `306a01b4e0242e9379ba971c8925670651f16818`
- Changed readable files selected: 5

- `packages/react-dom-bindings/src/client/ReactDOMComponent.js`
- `packages/react-dom-bindings/src/server/ReactFizzConfigDOM.js`
- `packages/react-dom-bindings/src/shared/ReactDOMUnknownPropertyHook.js`
- `packages/react-dom/src/__tests__/DOMPropertyOperations-test.js`
- `packages/react-dom/src/__tests__/ReactDOMServerIntegrationAttributes-test.js`

### 7. d1727fbf9873 - [eprh] Update changelog for 7.1.1 (#36308)

- Commit: `d1727fbf987392749b374f3afe62227d2c70fc41`
- Changed readable files selected: 2

- `packages/eslint-plugin-react-hooks/CHANGELOG.md`
- `ReactVersions.js`

### 8. bc249804d3c2 - [eprh] Add back a no-op for removed component-hook-factories rule (#36307)

- Commit: `bc249804d3c2ea6ee95bc5543c3735a65d1239b5`
- Changed readable files selected: 2

- `packages/eslint-plugin-react-hooks/README.md`
- `packages/eslint-plugin-react-hooks/src/index.ts`

### 9. da9325b51937 - [Fiber] Double invoke Effects in StrictMode after Fast Refresh (#35962)

- Commit: `da9325b519376e2d65cdf6d509ade053e14ec5b3`
- Changed readable files selected: 2

- `packages/react-reconciler/src/ReactFiberBeginWork.js`
- `packages/react-refresh/src/__tests__/ReactFresh-test.js`

### 10. 67e47593b607 - [Fiber] Double invoke Effects in Strict Mode during Hydration (#35961)

- Commit: `67e47593b607ecc08ac59361d8aba7ad2eef028a`
- Changed readable files selected: 5

- `packages/react-dom/src/__tests__/ReactDOMServerPartialHydration-test.internal.js`
- `packages/react-dom/src/__tests__/ReactServerRenderingHydration-test.js`
- `packages/react-reconciler/src/__tests__/ActivityStrictMode-test.js`
- `packages/react-reconciler/src/ReactFiberBeginWork.js`
- `packages/react-reconciler/src/ReactFiberWorkLoop.js`

### 11. 23fcd7cea1ec - Minify prod error messages for all browser bundles (#36277)

- Commit: `23fcd7cea1ec553f9b217bc148e8d94e2d0097bd`
- Changed readable files selected: 2

- `scripts/error-codes/codes.json`
- `scripts/rollup/bundles.js`

### 12. f6fe4275c7ec - Wire up createViewTransitionInstance and suspendOnActiveViewTransition in Fabric (#36196)

- Commit: `f6fe4275c7ec869e20a4b91f70df88cdc14d5161`
- Changed readable files selected: 3

- `packages/react-native-renderer/src/ReactFiberConfigFabric.js`
- `packages/react-native-renderer/src/ReactFiberConfigFabricWithViewTransition.js`
- `scripts/flow/react-native-host-hooks.js`

### 13. fe5160140d79 - Wire up startViewTransitionReadyFinished in Fabric (#36246)

- Commit: `fe5160140d79ea023a9db6fbb914ed6c6b6ae0dd`
- Changed readable files selected: 2

- `packages/react-native-renderer/src/ReactFiberConfigFabricWithViewTransition.js`
- `scripts/flow/react-native-host-hooks.js`

### 14. ea6792026ff7 - [Fizz] prevent reentrant finishedTask from calling completeAll multiple times (#36287)

- Commit: `ea6792026ff7bc4c9c663fd09149cc523490cb1a`
- Changed readable files selected: 2

- `packages/react-dom/src/__tests__/ReactDOMFizzServer-test.js`
- `packages/react-server/src/ReactFizzServer.js`

### 15. 56922cf751fa - [react-native-renderer] Delete Paper (legacy) renderer (#36285)

- Commit: `56922cf751fab6c7ab4c12ddbbd15839959fa255`
- Changed readable files selected: 10

- `packages/react-native-renderer/src/__mocks__/react-native/Libraries/ReactPrivate/ReactNativePrivateInterface.js`
- `packages/react-native-renderer/src/__tests__/ReactFabric-test.internal.js`
- `packages/react-native-renderer/src/ReactFiberConfigFabric.js`
- `packages/react-native-renderer/src/ReactNativeFiberInspector.js`
- `packages/react-native-renderer/src/ReactNativePublicCompat.js`
- `packages/react-native-renderer/src/ReactNativeTypes.js`
- `packages/react/src/__tests__/ReactMismatchedVersions-test.js`
- `scripts/flow/react-native-host-hooks.js`
- `scripts/rollup/forks.js`
- `scripts/shared/inlinedHostConfigs.js`

### 16. 00f063c31d60 - [test] Make `enableSuspenseyImages` dynamic (#36274)

- Commit: `00f063c31d60308f8e4e0fd349b89ed043b9ea54`
- Changed readable files selected: 2

- `packages/shared/forks/ReactFeatureFlags.www-dynamic.js`
- `packages/shared/forks/ReactFeatureFlags.www.js`

### 17. 0418c8a8b61a - [RN] Move new event dispatching pipeline to RN (#36266)

- Commit: `0418c8a8b61a2328fd8e9105a6f49093ee91b436`
- Changed readable files selected: 3

- `packages/react-native-renderer/src/__mocks__/react-native/Libraries/ReactPrivate/ReactNativePrivateInterface.js`
- `packages/react-native-renderer/src/ReactFabricEventEmitter.js`
- `scripts/flow/react-native-host-hooks.js`

### 18. 568244232e29 - [react-native-renderer] EventTarget-based event dispatching (#36253)

- Commit: `568244232e29a0d4524544344aa280917580e8f7`
- Changed readable files selected: 10

- `.eslintrc.js`
- `packages/react-native-renderer/src/legacy-events/PluginModuleType.js`
- `packages/react-native-renderer/src/LegacySyntheticEvent.js`
- `packages/react-native-renderer/src/ReactFabricEventEmitter.js`
- `packages/react-native-renderer/src/ReactNativeEventEmitter.js`
- `packages/react-native-renderer/src/ReactNativeEventTypeMapping.js`
- `packages/react-native-renderer/src/ReactNativeFeatureFlags.js`
- `packages/react-native-renderer/src/ReactNativeResponder.js`
- `scripts/flow/react-native-host-hooks.js`
- `scripts/rollup/validate/eslintrc.rn.js`

### 19. fef12a01c826 - fix: explicitly warn for infinite loops discovered only via enableInfiniteRenderLoopDetection (#36195)

- Commit: `fef12a01c826ce5b8458e82240c659bf51108a46`
- Changed readable files selected: 3

- `packages/react-dom/src/__tests__/ReactUpdates-test.js`
- `packages/react-reconciler/src/ReactFiberConcurrentUpdates.js`
- `packages/react-reconciler/src/ReactFiberWorkLoop.js`

### 20. 705268dcd167 - Fix require('ReactFeatureFlags') in eslint-plugin-react-hooks www build (#36243)

- Commit: `705268dcd16779b1f51f234cebaa588d761202ce`
- Changed readable files selected: 3

- `packages/shared/forks/ReactFeatureFlags.eslint-plugin.www.js`
- `packages/shared/forks/ReactFeatureFlags.www.js`
- `scripts/rollup/forks.js`
