# Task 1–2 fixture review record

**Review date**：2026-08-31<br>
**Episode**：`episode-09` representative slices `A001`, `A008`, `A009`<br>
**Status**：`awaiting user approval`

## Candidate surfaces

| Surface | Candidate | Scope |
|---|---|---|
| A-page | `courseplay-a-page-v5-template.json` + upstream v5 slice | `screen.title`, non-empty `screen.groups`, `silent_constraints` |
| Visual rough | `visual-rough-v2-template.md` + upstream v2 slice | S/G/M ID and recipe/slot/relation binding; no copied screen copy |
| Outline | `courseplay-outline-screen-source.md` + candidate slice | Existing human-readable fields and four-column steps; source text projected from S IDs |
| Handoff | `template.json` + A001/A008/A009 packets | One compact packet per A-page; no full A-page, Outline, or rough Markdown |

## Machine checks completed

- The ten v1 packets, current Outline, source snapshots, structure snapshot, generator
  hash, HEAD, dirty marker, and raw-byte manifest are frozen under the v1 fixtures.
- Candidate v2 packet sizes are A001 `5151` vs `10773`, A008 `5368` vs `11410`, and
  A009 `5008` vs `11640` UTF-8 bytes.
- Every candidate screen source item occurs exactly once in its packet.
- Candidate packets do not contain `a_page`, `outline`, `visual_rough_markdown`, or
  `must_visible`, and do not embed full Outline/visual-rough Markdown.
- Fixed consumer context remains four existing references and `45385` bytes; candidate
  delta is `0` and no new required reference file is introduced.
- A009 is explicitly `candidate-only`; its three-beat narration keeps the specific group
  case and three quantities, while `C020`–`C022` carry source/audit/commitment safeguards.
- Reproducible fixture contract test: `4/4` passing.

## Approval boundary

This record does not approve A009 narration or authorize Task 3–6. Before any producer,
validator, viewer, or downstream generator change, review the four templates and the
A001/A008/A009 candidate slices. Approval should confirm:

1. `screen` is the correct upstream source of learner-usable screen text.
2. `visual rough` should remain an ID/slot/recipe/relation plan without screen copy.
3. The current Outline presentation and scene/state vocabulary remain sufficient.
4. The compact packet contains enough information for a chapter consumer without adding
   a second authored content file or increasing fixed context.
5. The A009 candidate treatment is acceptable as a fixture-only example, not as approved
   production narration.

**User approval**：`pending`
