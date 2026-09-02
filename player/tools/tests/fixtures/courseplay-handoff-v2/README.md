# Courseplay handoff v2 candidate fixtures

These packets are fixture-only projections for A001, A008, and A009. They are not
written to `episodes/episode-09/.handoffs/` and are not consumed by the current v1
generator.

- `template.json` is the compact per-A packet shape.
- `episode-09/episode-09-a-page-v5-slice.json` and
  `episode-09/episode-09-visual-rough-v2-slice.md` are copied from the upstream
  review fixtures.
- `episode-09/outline-screen-source-slice.md` keeps the human-readable Outline
  presentation while using ID-based source projection.
- `A009.json` is intentionally a candidate: its narration keeps the specific group
  case and three quantities, while source/audit/commitment boundaries remain in
  `silent_constraints`. It must not be treated as approved narration.

The v1 baseline is a raw-byte snapshot of the ten current packets and their source
context. `baseline.json` records the comparison and `raw-byte-manifest.json` records
the frozen bytes.
