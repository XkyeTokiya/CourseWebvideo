# Courseplay Screen Text Lightweight Flow Implementation Plan

> **Status:** template-first plan; no producer or downstream implementation change is authorized until Task 1 templates and Task 2 fixtures are reviewed.

**Goal:** Make every A-page explicitly provide usable screen text while ensuring the downstream chapter consumer receives no more content than today. Reduce downstream context by removing repeated A-page, visual-rough, and Outline prose rather than by deleting required teaching content.

**Architecture:** Keep the existing production file set. Move screen-text supply from visual rough into A-page, keep visual rough responsible for recipe/media/slot binding, preserve the current human-readable Outline workflow, and mechanically project one compact per-A handoff packet. Downstream may adapt supplied screen text for layout and reading rhythm, subject to semantic and evidence boundaries.

**Non-goals:** Do not repair or migrate the four completed episodes. Do not create a downstream IR, a second authored content file, HTML, components, images, audio, subtitles, or video. Do not introduce short-text variants, optional screen groups, new beat IDs, new scene/state naming, or a general visual-mechanism ontology in the first version.

## Fixed production topology

```text
# Upstream approved outputs
output/episode-XX/
├── approved-spoken-text.txt
├── episode-XX-a-page.json
├── episode-XX-a-page-validation.json
├── episode-XX-visual-rough.md
└── episode-XX-visual-rough-validation.json

# Downstream episode workspace
episodes/episode-XX/
├── approved-spoken-text.txt          # synchronized upstream mirror
├── episode-XX-a-page.json            # synchronized upstream mirror
├── episode-XX-visual-rough.md         # synchronized upstream mirror
├── script.md
├── outline.md
└── .handoffs/Axxx.json                # deterministic ignored cache
```

- Upstream owns the approved text, A-page, and visual rough.
- Downstream root files are synchronized input mirrors; they are not independently edited content authorities.
- Outline remains downstream-owned and human-readable.
- A chapter consumer reads exactly one `.handoffs/Axxx.json` plus the existing fixed skill references and target code. It does not read the mirrored source files.

## First-version authority model

| Concern | Authority | Rule |
|---|---|---|
| Spoken wording | approved text / `nx` / script beats | Downstream does not rewrite narration |
| Screen-text supply | A-page `screen` | Every page supplies usable text, not abstract `meaning` placeholders |
| Final screen wording | downstream chapter implementation | May adapt supplied text within `edit_policy` |
| Recipe, media, static slots | visual rough | References screen IDs; does not rewrite screen copy |
| Per-step display plan | Outline | Keeps the existing scene/state and step presentation |
| Consumer input | handoff | Mechanical per-A projection; not an authored authority |
| Non-visible safeguards | A-page `silent_constraints` | May guide implementation and review; never learner-visible |

Downstream adaptation may shorten, retitle, split, merge, or improve phrasing. It may not change facts, quantities, named objects, scope, polarity, direction, causality, or protected relations; invent unsupported claims; or surface a silent constraint.

---

## Task 1: Approve the four target file templates before changing producers

No skill, compiler, validator, viewer, or downstream generator is modified in this task. Create template/fixture candidates only.

### Template A — A-page with explicit screen-text supply

**Target owner:** `.agents/skills/rewrite-course-narration/`

**Planned template path:**

```text
.agents/skills/rewrite-course-narration/templates/courseplay-a-page-v5-template.json
```

The root keeps the current A-page envelope and evidence/timing model. A page keeps `a_id`, `callback_a_ids`, `nx`, `teaching_purpose`, `single_message`, `protected_relations`, `entry_condition`, `exit_condition`, and `timing`. Replace `must_visible` with the following minimal screen layer:

```json
{
  "screen": {
    "title": {
      "screen_item_id": "S001",
      "source_text": "上游明确提供、可直接使用的标题",
      "edit_policy": "adaptable",
      "evidence_refs": ["E001"]
    },
    "groups": [
      {
        "group_id": "G001",
        "items": [
          {
            "screen_item_id": "S002",
            "source_text": "上游明确提供、可直接使用的屏幕文本",
            "edit_policy": "adaptable",
            "evidence_refs": ["E001"]
          }
        ]
      }
    ]
  },
  "silent_constraints": [
    {
      "constraint_id": "C001",
      "instruction": "只约束下游，不得成为口播或屏幕文本",
      "evidence_refs": ["E001"]
    }
  ]
}
```

First-version rules:

- `screen.title` may be `null`; `screen.groups` must be non-empty.
- Each `source_text` is production-usable wording, not a semantic description, TODO, placeholder, or production instruction.
- Every screen item is required in v1 of the new flow; no optional/omitted model exists yet.
- `edit_policy` is only `adaptable` or `exact`.
- `adaptable` permits wording changes with semantic equivalence.
- `exact` is reserved for protected quantities, required terms, quotations, or necessary case qualifiers.
- S/G/C IDs are unique within the episode but need not remain numerically continuous after approval; existing IDs are never renumbered solely to close gaps.
- `protected_relations` remains the semantic relationship authority in the first version; do not duplicate it inside `screen`.
- `silent_constraints` are page-level safeguards. Do not add target graphs, categories, variants, approval hashes, or separate screen-copy files in the first version.

### Template B — visual rough as an ID/slot plan

**Target owner:** `.agents/skills/design-course-visual-rough/`

**Planned template path:**

```text
.agents/skills/design-course-visual-rough/templates/visual-rough-v2-template.md
```

Preserve current frontmatter, strategy section, media rules, recipe governance, image quota, and page ordering. Per-page content becomes:

```markdown
## A001｜<页面短名>

- **内容角色**：<内部角色说明>
- **页面配方**：`<registered-recipe-id>`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G001`
2. `G002`

### 页面骨架

- `headline <- S001`
- `left <- G001`
- `right <- G002`

### 关系保真

- `[R001]`：<关系如何由上述槽位、分组、顺序或对照承载；不得重复屏幕文案>
```

Rules:

- `论点标题` and `辅助句` accept only S IDs or `none`.
- `上屏内容组` contains only G IDs.
- `页面骨架` binds registered recipe slots to S/G/M IDs.
- `关系保真` may explain the visual carrier, but may not author learner-visible copy.
- All current v1 media, recipe, image, logic-diagram, adjacency, diversity, and evidence checks remain.
- The first version does not add text variants, optional groups, omission reasons, or a mechanism whitelist.

### Template C — Courseplay Outline with its current presentation preserved

**Target owner:** downstream `web-video-presentation`

**Planned template path:**

```text
.agents/skills/web-video-presentation/templates/courseplay-outline-screen-source.md
```

Use the current approved ep09 Outline structure as the source, not the three-line `templates/episode/outline.md` placeholder. Preserve:

- top metadata and visual schedule;
- `S-Axxx` base-scene tokens and chapter-local semantic-state names;
- all existing chapter fields and their order;
- the current four-column step table;
- materials sections and human review notes.

Content-source rules change without redesigning the format:

- `核心判断` may show `[Sxxx] <source_text>` for human readability, but the text must be mechanically resolved from A-page and may not be independently rewritten in Outline.
- `内容槽位` binds slot names to S/G/M IDs.
- `信息池` references S/G/R/E/C IDs and may display mechanically resolved source text for review.
- Step instructions reference S/G/M/R IDs when describing additions, persistence, or focus.
- `口播节选` remains optional and human-readable in Outline, but is not copied into handoff because accurate beats come from `script.md`.
- Downstream final screen edits are made in chapter implementation, not written back as a second Outline content authority.

### Template D — compact per-A handoff

**Target owner:** downstream `courseplay-handoff.mjs`

**Planned fixture path:**

```text
tools/tests/fixtures/courseplay-handoff-v2/template.json
```

```json
{
  "schema_version": "web-video-courseplay-chapter-handoff/v2",
  "episode_id": "episode-XX",
  "chapter": {
    "index": 1,
    "id": "chapter-id",
    "title": "章节标题",
    "a_page_id": "A001",
    "step_count": 2
  },
  "narration": {
    "authority": "a_page.nx",
    "beats": ["批准口播第一拍。", "批准口播第二拍。"]
  },
  "screen_source": {
    "title": {
      "screen_item_id": "S001",
      "source_text": "上游提供的标题",
      "edit_policy": "adaptable",
      "evidence_refs": ["E001"]
    },
    "groups": [
      {
        "group_id": "G001",
        "items": [
          {
            "screen_item_id": "S002",
            "source_text": "上游提供的内容",
            "edit_policy": "adaptable",
            "evidence_refs": ["E001"]
          }
        ]
      }
    ],
    "protected_relations": []
  },
  "presentation": {
    "recipe_id": "registered-recipe",
    "slot_bindings": ["headline <- S001", "body <- G001"],
    "media": [],
    "relation_carriers": []
  },
  "steps": [
    {
      "index": 1,
      "scene_state": "S-A001 · first-state",
      "show_refs": ["G001"],
      "keep_refs": [],
      "focus_refs": [],
      "instruction": "建立主体槽位"
    }
  ],
  "silent_constraints": [],
  "materials_markdown": null,
  "sources": {}
}
```

Rules:

- One packet corresponds to exactly one A-page.
- It contains only that A-page's narration beats, screen source, visual bindings, steps, safeguards, materials, and source hashes.
- `source_text` appears once in the packet.
- Do not embed the full A-page object, Outline chapter Markdown, or visual-rough Markdown.
- Do not create or require a new downstream IR file.
- Chapter code may adapt `adaptable` text; review compares final visible wording with source semantics, evidence, relations, and safeguards.

- [ ] Create the four candidate templates/fixtures without changing active producer behavior.
- [ ] Review them together using ep09 A001, A008, and A009 as representative examples.
- [ ] Confirm that no template introduces a new production file or manual authoring phase.
- [ ] Stop for template approval before Task 2.

---

## Task 2: Freeze legacy and new-flow fixtures and prove the consumer can get lighter

**Upstream fixture scope:** ep09 A001, A008, A009 candidate slices.

**Downstream fixture scope:** current v1 packets and corresponding v2 candidates.

- [ ] Persist the current ten v1 handoffs, current Outline, structure snapshot, source hashes, generator hash, HEAD, dirty marker, and raw-byte manifest under tracked downstream test fixtures.
- [ ] Keep existing completed episodes and their production files untouched.
- [ ] Build A001/A008/A009 v5/v2 fixtures only; do not publish them to formal episode directories.
- [ ] For A009, use a candidate narration that retains the specific group case and the three quantities while moving source/audit/commitment shells into `silent_constraints`; do not call it approved production text before explicit approval.
- [ ] Measure each candidate v2 packet against its corresponding v1 packet using UTF-8 raw bytes.
- [ ] Require every candidate v2 packet to be no larger than its v1 counterpart.
- [ ] Measure the fixed skill/reference files required by the chapter consumer; the new required fixed context must not exceed the current fixed context.
- [ ] Verify every screen source string occurs once in a v2 packet and is absent from embedded rough/Outline Markdown because those documents are not embedded.
- [ ] Stop if screen completeness requires adding a new consumed document or if consumer bytes increase.

Task 2 approval is the authorization boundary for changing upstream generation.

---

## Task 3: Change upstream A-page generation after templates pass

**Modify:**

```text
.agents/skills/rewrite-course-narration/SKILL.md
.agents/skills/rewrite-course-narration/references/courseplay-a-page.schema.json
.agents/skills/rewrite-course-narration/references/workflow.md
.agents/skills/rewrite-course-narration/references/acceptance-checklist.md
.agents/skills/rewrite-course-narration/templates/stage2-a-page-compiler.md
.agents/skills/rewrite-course-narration/scripts/a_page_contract.py
.agents/skills/rewrite-course-narration/scripts/verify_compilation.py
.agents/skills/rewrite-course-narration/tests/
```

Generation rules:

- Approved narration remains immutable during A-page compilation.
- Compile screen source from the frozen task package, evidence, protected relationships, and the approved narration context; do not treat narration wording as the only screen source.
- Produce concise but usable learner-facing text for every title/group item.
- Use `adaptable` by default; use `exact` only for genuinely protected text.
- Move audit gaps, production instructions, promise disclaimers, and similar non-learner constraints into `silent_constraints` instead of narration or screen source.
- If the task package lacks enough evidence to supply a page, return a screen-content gap instead of asking visual rough or downstream to invent facts.
- Keep the existing lossless Nx, evidence, callback, timing, short-page, and compile-trace checks.
- Do not add layout, recipe, media, coordinates, animation, or renderer fields to A-page.

Tests:

- [ ] Valid pages contain at least one non-empty screen group and no placeholder text.
- [ ] Every screen item resolves evidence and uses a legal edit policy.
- [ ] `exact` quantities and qualifiers remain unchanged in fixtures.
- [ ] Silent constraints cannot appear verbatim in `nx` or screen source.
- [ ] The existing narration and v4 regression suite remains unchanged for frozen old fixtures.
- [ ] Update the registry viewer to display v4 and the minimal new screen layer before publishing new-flow A-pages.

---

## Task 4: Change upstream visual-rough generation after A-page generation passes

**Modify:**

```text
.agents/skills/design-course-visual-rough/SKILL.md
.agents/skills/design-course-visual-rough/references/visual-rough-contract.md
.agents/skills/design-course-visual-rough/templates/visual-rough-template.md
.agents/skills/design-course-visual-rough/scripts/visual_rough_contract.py
.agents/skills/design-course-visual-rough/tests/
```

Generation rules:

- Select recipe/media exactly as today.
- Bind A-page S/G IDs into recipe slots.
- Explain R carriers without rewriting learner-visible text.
- Never copy `source_text` into title, content groups, structural conclusions, or relation prose.
- Never reference C IDs in visible slots.
- Preserve all current v1 media, recipe registry, image quota, real-image-majority, M sequence/use, adjacency, diversity, logic-diagram, original-image, and forbidden-pattern validations.

Tests:

- [ ] Every A-page screen group is bound to a registered recipe slot.
- [ ] Every protected relation has a carrier explanation.
- [ ] No A-page `source_text` is duplicated in rough Markdown.
- [ ] No silent constraint is bound to a visible slot.
- [ ] All current visual-rough v1 regression tests continue to pass for frozen old fixtures.

---

## Task 5: Update downstream Outline consumption and compact handoff

**Downstream modify:**

```text
.agents/skills/web-video-presentation/references/OUTLINE-FORMAT.md
.agents/skills/web-video-presentation/references/COURSEPLAY-BOUND-MODE.md
.agents/skills/web-video-presentation/references/CHAPTER-CRAFT.md
.agents/skills/web-video-presentation/references/CHAPTER-REVIEW.md
tools/courseplay-handoff.mjs
tools/chapter-review-contract.mjs
tools/tests/
```

- [ ] Preserve the current Outline Markdown presentation and `S-Axxx` scene/state convention.
- [ ] Define source-text projection fields and ID-based slot/step references without adding an authored IR.
- [ ] Parse current-A Outline state into structured `steps`; do not embed the chapter Markdown.
- [ ] Project A-page screen source once; do not embed the complete page object.
- [ ] Project rough recipe/media/slot/relation data; do not embed rough Markdown.
- [ ] Keep exact narration beats from `script.md` and verify their concatenation against current `nx`.
- [ ] Make `--check` compare all current source hashes before reviewer reads an existing packet.
- [ ] Reviewer permits wording adaptations for `adaptable`, requires exact equality for `exact`, rejects semantic drift, unsupported claims, protected-relation changes, and silent-constraint leakage.
- [ ] Do not add a new required chapter-consumer reference file; revise and shorten existing references so their required total bytes do not increase.

---

## Task 6: Dry-run the new flow without production

- [ ] Run all upstream narration/A-page tests.
- [ ] Run all upstream visual-rough tests.
- [ ] Run downstream `pnpm test:tools` and preserve the current 47/47 baseline or its strictly additive successor.
- [ ] Generate fixture-only v2 handoffs for A001, A008, and A009.
- [ ] Run consumer parsing, state simulation, and reviewer contract checks only.
- [ ] Confirm each v2 packet is no larger than its matching v1 packet.
- [ ] Confirm fixed required consumer context is no larger than the current baseline.
- [ ] Confirm screen source is complete enough that no primary screen content must be invented from narration.
- [ ] Confirm adaptable text can be revised without changing evidence, scope, quantities, polarity, or protected relations.
- [ ] Stop for user review. Do not migrate completed episodes or start HTML/component/image/audio/video production.

## Completion criteria

The new flow is ready for a future unprocessed task package only when:

1. The four templates are approved and represented by committed fixtures.
2. Every A-page explicitly supplies usable screen text.
3. Downstream remains allowed to adapt screen wording within declared boundaries.
4. Visual rough no longer authors or repeats screen copy.
5. Handoff is the only chapter content input and contains screen source exactly once.
6. Every per-A consumer packet is no larger than the corresponding legacy packet.
7. Required fixed consumer context does not grow.
8. Existing completed episodes and their production workflow remain untouched.
