# Billing Estimate From Token Benchmarks

Generated: 2026-05-06T17:32:33.303Z

This report converts checked-in Conducty token benchmark results into input-token cost estimates. It does not call a paid model API, does not read an OpenAI invoice, and does not include output tokens, tool calls, web search, file storage, retries, or provider-side caching. Exact billing proof requires real API usage logs for comparable task runs.

Pricing source: [OpenAI API Pricing](https://openai.com/api/pricing/), checked 2026-05-06.

## Pricing Snapshot

| Model | Input / 1M | Cached input / 1M | Output / 1M |
|---|---:|---:|---:|
| GPT-5.5 | $5.00 | $0.50 | $30.00 |
| GPT-5.4 | $2.50 | $0.25 | $15.00 |
| GPT-5.4 mini | $0.75 | $0.075 | $4.50 |

Only the standard input-token rate is used in the estimates below because the benchmarks measure workflow context pressure, not generated output.

## Main Billing Result

Primary benchmark: OpenClaw 200-commit historical replay stress

- Initial architecture workflow tokens: 5,861,655,911
- Current PR workflow tokens: 44,212,222
- Input tokens avoided vs initial: 5,817,443,689 (99.2%)
- Naive workflow tokens: 23,272,854,756
- Current PR savings vs naive: 99.8%
- Replay pass rate: 200/200
- Target files verified exactly: 742

| Model | Initial input cost | Current PR input cost | Saved vs initial | Naive input cost | Saved vs naive |
|---|---:|---:|---:|---:|---:|
| GPT-5.5 | $29,308.28 | $221.06 | $29,087.22 | $116,364.27 | $116,143.21 |
| GPT-5.4 | $14,654.14 | $110.53 | $14,543.61 | $58,182.14 | $58,071.61 |
| GPT-5.4 mini | $4,396.24 | $33.16 | $4,363.08 | $17,454.64 | $17,421.48 |

## All Benchmark Estimates

These rows should not be summed as independent billing proof because some reports intentionally overlap. They show whether the cost pattern survives across benchmark shapes.

| Benchmark | Initial tokens | Current tokens | Saved vs initial | GPT-5.4 mini saved | GPT-5.4 saved | GPT-5.5 saved | Replay evidence |
|---|---:|---:|---:|---:|---:|---:|---|
| OpenClaw 200-commit historical replay stress | 5,861,655,911 | 44,212,222 | 5,817,443,689 (99.2%) | $4,363.08 | $14,543.61 | $29,087.22 | replay 200/200, 742 files |
| Unseen repos historical replay | 27,651,294 | 2,876,427 | 24,774,867 (89.6%) | $18.58 | $61.94 | $123.87 | replay 30/30, 100 files |
| Final cross-repo historical replay | 25,023,609 | 1,334,391 | 23,689,218 (94.7%) | $17.77 | $59.22 | $118.45 | replay 18/18, 88 files |
| Meta React historical replay | 82,546,849 | 2,186,605 | 80,360,244 (97.4%) | $60.27 | $200.90 | $401.80 | replay 12/12, 64 files |
| Meta React focused workflow | 137,284,764 | 3,206,472 | 134,078,292 (97.7%) | $100.56 | $335.20 | $670.39 | context benchmark |
| Fixed public repos workflow | 5,457,937 | 556,180 | 4,901,757 (89.8%) | $3.68 | $12.25 | $24.51 | context benchmark |

## Interpretation

- The billing signal is real as an input-context estimate: fewer input tokens at a fixed model price means lower input-token cost.
- The primary benchmark estimates a GPT-5.4 input-cost drop from $14,654.14 to $110.53 for that measured workflow shape.
- This is not an invoice-level claim because output tokens and provider-specific cache behavior were not measured.
- To turn this into exact billing proof, run paired live API tasks with usage logs for baseline and Conducty workflows, then feed those actual billed input/output tokens into this report.