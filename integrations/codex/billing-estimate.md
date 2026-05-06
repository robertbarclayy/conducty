# Billing Estimate From Token Benchmarks

Generated: 2026-05-06T13:46:51.207Z

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

Primary benchmark: Final cross-repo historical replay

- Initial architecture workflow tokens: 25,023,609
- Current PR workflow tokens: 1,334,391
- Input tokens avoided vs initial: 23,689,218 (94.7%)
- Naive workflow tokens: 95,034,072
- Current PR savings vs naive: 98.6%
- Replay pass rate: 18/18
- Target files verified exactly: 88

| Model | Initial input cost | Current PR input cost | Saved vs initial | Naive input cost | Saved vs naive |
|---|---:|---:|---:|---:|---:|
| GPT-5.5 | $125.12 | $6.67 | $118.45 | $475.17 | $468.50 |
| GPT-5.4 | $62.56 | $3.34 | $59.22 | $237.59 | $234.25 |
| GPT-5.4 mini | $18.77 | $1.00 | $17.77 | $71.28 | $70.27 |

## All Benchmark Estimates

These rows should not be summed as independent billing proof because some reports intentionally overlap. They show whether the cost pattern survives across benchmark shapes.

| Benchmark | Initial tokens | Current tokens | Saved vs initial | GPT-5.4 mini saved | GPT-5.4 saved | GPT-5.5 saved | Replay evidence |
|---|---:|---:|---:|---:|---:|---:|---|
| Final cross-repo historical replay | 25,023,609 | 1,334,391 | 23,689,218 (94.7%) | $17.77 | $59.22 | $118.45 | replay 18/18, 88 files |
| Meta React historical replay | 82,546,849 | 2,186,605 | 80,360,244 (97.4%) | $60.27 | $200.90 | $401.80 | replay 12/12, 64 files |
| Meta React focused workflow | 137,284,764 | 3,206,472 | 134,078,292 (97.7%) | $100.56 | $335.20 | $670.39 | context benchmark |
| Fixed public repos workflow | 5,457,937 | 556,180 | 4,901,757 (89.8%) | $3.68 | $12.25 | $24.51 | context benchmark |

## Interpretation

- The billing signal is real as an input-context estimate: fewer input tokens at a fixed model price means lower input-token cost.
- The final cross-repo replay benchmark estimates a GPT-5.4 input-cost drop from $62.56 to $3.34 for that measured workflow shape.
- This is not an invoice-level claim because output tokens and provider-specific cache behavior were not measured.
- To turn this into exact billing proof, run paired live API tasks with usage logs for baseline and Conducty workflows, then feed those actual billed input/output tokens into this report.