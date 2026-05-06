# SWE-bench Pro Preflight

Generated: 2026-05-06T15:21:07.656Z

This is an operational preflight for running Conducty-style evaluation against SWE-bench Pro. It does not claim a SWE-bench Pro solve rate, leaderboard score, model quality result, or provider-billing result. A real solve-rate claim still requires model-generated patches plus the official evaluator completing successfully.

## Source

- Evaluation repo expected: https://github.com/scaleapi/SWE-bench_Pro-os
- Dataset JSONL: sweap_eval_full_v2.jsonl
- Dataset bytes: 25,370,171
- Dataset SHA-256: 5efb0d690335785e9b48a8a5c60413e2b78ee52bc78690a4a2852e34ff25d3ad
- Official run scripts checked: yes

## Data Health

- Rows parsed: 731
- Parse failures: 0
- Repositories: 11
- Rows with gold patches: 731/731
- Rows with run_script.sh and parser.py: 731/731

## Dataset Shape

| Metric | Min | Median | P90 | Max | Total |
|---|---:|---:|---:|---:|---:|
| Problem statement tokens | 14 | 775 | 1,379 | 3,470 | 638,631 |
| Gold patch tokens | 360 | 1,962 | 6,238 | 46,943 | 2,431,322 |
| Test selector tokens | 2 | 174 | 3,667 | 130,299 | 1,326,225 |
| Selected test count | 1 | 9 | 171 | 3,510 | 52,561 |

Token estimates use a transparent bytes/4 approximation. They are sizing signals for context pressure, not provider-side billing records.

## Repository Coverage

| Repository | Tasks |
|---|---:|
| ansible/ansible | 96 |
| internetarchive/openlibrary | 91 |
| flipt-io/flipt | 85 |
| qutebrowser/qutebrowser | 79 |
| gravitational/teleport | 76 |
| protonmail/webclients | 65 |
| future-architect/vuls | 62 |
| navidrome/navidrome | 57 |
| element-hq/element-web | 56 |
| NodeBB/NodeBB | 44 |
| tutao/tutanota | 20 |

## Smallest Official Gold Tracer

- Instance: instance_flipt-io__flipt-518ec324b66a07fdd95464a5e9ca5fe7681ad8f9
- Repository: flipt-io/flipt
- Selected tests: 1 (1 fail-to-pass, 0 pass-to-pass)
- Problem statement tokens: 666
- Gold patch tokens: 371
- Test selector tokens: 2
- Official scripts present: yes
- Tracer files written under: .conducty-eval
- Local tracer note: 2026-05-06 local official gold-patch tracer reached Docker image pull for the smallest instance; Docker Desktop returned (109, GetOverlappedResult, The pipe has been ended), then docker info returned 500, so no solve-rate score is claimed.

To run the official one-instance gold-patch tracer from a SWE-bench_Pro-os checkout after generating tracer files:

```bash
python swe_bench_pro_eval.py \
  --raw_sample_path=.conducty-eval/sample-small.jsonl \
  --patch_path=.conducty-eval/gold-patches-small.json \
  --output_dir=.conducty-eval/official-gold-small \
  --scripts_dir=run_scripts \
  --num_workers=1 \
  --dockerhub_username=jefzda \
  --use_local_docker \
  --redo
```

## Interpretation

| Claim | Status |
|---|---|
| SWE-bench Pro assets can be enumerated and checked deterministically | Supported by this report |
| Every local task row has a gold patch | Supported by this report |
| Every local task row has official run scripts | Supported when --scripts-dir points at the official checkout |
| Conducty has an official SWE-bench Pro solve rate | Not claimed here |
| Conducty reduces model cost on SWE-bench Pro | Not claimed here; requires comparable real model runs |
| The next validation step is clear | Supported: run the one-instance gold tracer, then model-generated patch trials |

## Next Evaluation Gate

1. Confirm Docker can pull and run the official image for the smallest gold tracer.
2. Run gold-patch evaluation for a small stratified set across repositories to validate harness health.
3. Run Conducty-guided model patch generation on the same stratified set.
4. Compare pass rate, retry count, input tokens, output tokens, wall time, and evaluator logs against a non-Conducty baseline.
