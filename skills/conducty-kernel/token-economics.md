# Token Economics

The kernel is designed to save total task tokens, not always first-message tokens.

The savings come from:

- fewer failed prompts
- less repeated context loading
- earlier detection of stale assumptions
- fewer unreviewable parallel diffs
- fewer "it should pass" loops
- clearer evidence at review/ship time

## Estimated Savings

These are planning estimates, not benchmarks. Real savings depend on repo size, test speed, model behavior, and task risk.

| Workflow | Upfront token cost | Retry/failure tokens | Repeated context tokens | Estimated net saving |
|---|---|---|---|---|
| Manual loop | low | very high | very high | baseline |
| Current Conducty cycle | medium | medium | medium-low | 25-40% |
| Conducty kernel | medium-high | low | low | 40-60% |
| Mature optimized Conducty | medium | very low | very low | 55-70% |

## Example on a 100k Token Task

| Workflow | Estimated total tokens | Tokens saved vs manual |
|---|---:|---:|
| Manual loop | 100k | 0 |
| Current Conducty cycle | 60k-75k | 25k-40k |
| Conducty kernel | 40k-60k | 40k-60k |
| Mature optimized Conducty | 30k-45k | 55k-70k |

## By Task Size

| Task type | Current Conducty saving | Kernel saving |
|---|---:|---:|
| Tiny edit | 0-15% | 0-10% |
| Medium PR | 25-40% | 40-55% |
| Large PR | 30-45% | 50-65% |
| Multi-agent parallel work | 35-50% | 55-70% |

For tiny work, the kernel should stay light. For large, risky, or parallel work, the contract pays for itself by preventing expensive loops.
