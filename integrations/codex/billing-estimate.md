# Billing Estimate From Token Benchmarks

Generated: 2026-05-06T14:07:24.334Z

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

Primary benchmark: OpenClaw historical replay stress

- Initial architecture workflow tokens: 885,307,090
- Current PR workflow tokens: 6,130,143
- Input tokens avoided vs initial: 879,176,947 (99.3%)
- Naive workflow tokens: 3,517,169,788
- Current PR savings vs naive: 99.8%
- Replay pass rate: 30/30
- Target files verified exactly: 92

| Model | Initial input cost | Current PR input cost | Saved vs initial | Naive input cost | Saved vs naive |
|---|---:|---:|---:|---:|---:|
| GPT-5.5 | $4,426.54 | $30.65 | $4,395.88 | $17,585.85 | $17,555.20 |
| GPT-5.4 | $2,213.27 | $15.33 | $2,197.94 | $8,792.92 | $8,777.60 |
| GPT-5.4 mini | $663.98 | $4.60 | $659.38 | $2,637.88 | $2,633.28 |

## All Benchmark Estimates

These rows should not be summed as independent billing proof because some reports intentionally overlap. They show whether the cost pattern survives across benchmark shapes.

| Benchmark | Initial tokens | Current tokens | Saved vs initial | GPT-5.4 mini saved | GPT-5.4 saved | GPT-5.5 saved | Replay evidence |
|---|---:|---:|---:|---:|---:|---:|---|
| OpenClaw historical replay stress | 885,307,090 | 6,130,143 | 879,176,947 (99.3%) | $659.38 | $2,197.94 | $4,395.88 | replay 30/30, 92 files |
| Final cross-repo historical replay | 25,023,609 | 1,334,391 | 23,689,218 (94.7%) | $17.77 | $59.22 | $118.45 | replay 18/18, 88 files |
| Meta React historical replay | 82,546,849 | 2,186,605 | 80,360,244 (97.4%) | $60.27 | $200.90 | $401.80 | replay 12/12, 64 files |
| Meta React focused workflow | 137,284,764 | 3,206,472 | 134,078,292 (97.7%) | $100.56 | $335.20 | $670.39 | context benchmark |
| Fixed public repos workflow | 5,457,937 | 556,180 | 4,901,757 (89.8%) | $3.68 | $12.25 | $24.51 | context benchmark |

## Interpretation

- The billing signal is real as an input-context estimate: fewer input tokens at a fixed model price means lower input-token cost.
- The primary benchmark estimates a GPT-5.4 input-cost drop from $2,213.27 to $15.33 for that measured workflow shape.
- This is not an invoice-level claim because output tokens and provider-specific cache behavior were not measured.
- To turn this into exact billing proof, run paired live API tasks with usage logs for baseline and Conducty workflows, then feed those actual billed input/output tokens into this report.