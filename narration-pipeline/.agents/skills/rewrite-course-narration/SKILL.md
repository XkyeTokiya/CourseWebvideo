---
name: rewrite-course-narration
description: Use when regenerating learner-facing continuous narration from a frozen course task package, then compiling approved narration into one-A-per-page production JSON.
---

# Rewrite Course Narration

## Overview

从冻结课程任务包提炼独立 Brief，仅凭 Brief 与短 Prompt 生成连续口播；用户明确批准后，把批准母版编译为 `courseplay-a-page/v6`。一条 A 严格对应一页，正式 A 文档冻结页面语义、证据、关系、时间和 screen guidance；最终上屏措辞由下游综合 guidance、当前 A 口播与 visual rough 创作。视觉配方和媒体安排由后续 `design-course-visual-rough` 独立完成。`courseplay-a-page/v4` 与 v5 仅作冻结兼容输入，其中 v5 继续服务既有 ep04，不再用于新生产。任务包中的 B 只在编译期用于覆盖验收，不进入正式 JSON、正式报告或下游流程。

## When to Use

- 需要从冻结任务包重新生成整篇 learner-facing 连续口播；
- 既有口播不再作为可继承母版，需要按 Brief 隔离重建；
- 需要把已批准口播编译为一 A 一页的生产契约。

## Routing Boundary

- **唯一入口**：`rewrite-course-narration` — Brief → 隔离连续稿 → 人工批准 → A 页面编译 → 验收发布。
- **既有稿请求**：不复用旧 N 稿、历史母版或停用流程产物；需要新口播时，从冻结任务包重新提炼 Brief 并重新取得批准。
- **任务包边界**：B 是编译期职责、证据和关系输入，不是页面单位。旧 Media Plan 不进入 v4/v5/v6。
- **下游边界**：下游只接收 `..\player\episodes\episode-XX\inputs/` 三份正式文件，不读取任务包或 work trace。本 Skill 不定义坐标、模板、CSS、字号、组件或 renderer。

## Workflow

1. **提炼 Brief**：只读冻结任务包（`episodes/**/episode-XX-*-task-package.md`），生成 `narration-brief.json`。详见 `references/brief-contract.md`。
2. **隔离生成连续稿**：Stage 1 只接收 `narration-brief.json` 与 `templates/stage1-short-prompt.md`。不读取任务包、旧稿、原 B 表、冲突台账或长 Prompt。输出自然连续口播，不含 Nx、A 页面或分隔线。
3. **人工批准**：先核对内容义务与事实边界，再分别完成硬红线审读和常规口播质量审读。任一项不通过均保持 `待修改`；只有用户明确批准后，才生成唯一 `approved-spoken-text.txt`。批准前不得切 Nx 或生成 A 页面。
4. **A 页面编译**：先按页面认知任务切分连续、非空 Nx；再从任务包语义分镜的“必须/必要可见信息”提取语义原子，依据当前 A 的 Nx、教学目的与受保护关系完成归属，并把制作作用相同的原子轻量组合成 screen guidance。原子覆盖只写入 work-only compile trace，不进入正式 A 文档。原 B 与旧 Media Plan 都不决定页面；`concat(pages[*].nx)` 必须与批准母版逐字符一致。详见 `templates/stage2-a-page-compiler.md` 与 `references/courseplay-a-page-v6.schema.json`。
5. **验收并正式发布**：canonical `a-page-v6` validator 同时检查候选 A 文档和 trace。只有 `unresolved=[]`、`coverage_passed=true`、`failures=[]` 才可发布三份语义 handoff；随后再调用 `design-course-visual-rough` 形成 visual rough v3。冻结 v4/v5 页面仍分别用原验证 profile 回归。详见 `references/acceptance-checklist.md`。

## 口播质量契约

- Brief 提炼时必须区分学习者内容义务、Agent 静默护栏和上游冲突；静默护栏约束写作，但不成为台词。
- 任务包中的来源、制作、审计或真实性外壳应先剥离；只有能够独立成立的领域内核才能进入 Brief，不能独立成立时必须上报冲突。
- Stage 1 不得输出情境真实性补丁、课程来源归属、制作或画面说明、审计免责声明和未来待办，也不得用同义改写保留这些内部话语。
- 人工批准前必须分别完成硬红线审读和常规口播质量审读。红线清理不能代替语言、专业关系、节奏和叙事检查；任一通道不通过，状态均为 `待修改`。

## A-page Contract

- `pages` 数组顺序就是页面顺序；`a_id` 从 `A001` 连续编号。
- 每个 A 有且仅有一个非空连续 `nx`；不支持无口播页面。
- `callback_a_ids` 只能引用更早的 A。
- 正式 JSON 自包含 `evidence_catalog`；所有 E 引用必须内部解析。
- v6 每页必须提供非空 `screen.title` 和至少一个 `screen.groups`；标题与组内条目使用稳定的 `Sxxx` / `Gxxx` ID、`guidance_text`、`usage_policy` 和 E 引用。`reference` 是内容方向、重点与可复用素材，不产生逐 S 落屏义务；`exact` 表示该原子文字必须完整、逐字、学习者可见。
- 语义原子用于编译覆盖，不等于 S。具有相同制作作用、适合同时呈现的原子可合并为一个 S，但必须保留具体枚举、数值、条件和关系。v6 trace 用 `visible_source_units` 记录每个原子的 A/S 覆盖或有理由的省略；trace 只证明指导池完整。
- `exact` 只锁定确需逐字稳定的数字、正式术语、引语或限定表达，必须保持原子化；所需上下文可由 reference guidance、当前 A 口播或视觉结构补足。原子性由人工 acceptance checklist 判断，不设置机械长度阈值。
- `silent_constraints` 只给下游审阅和实现边界使用，不得成为 `nx` 或 `guidance_text`，也不得绑定到可见槽位。
- v4 禁止 `visual_form`、`visual_priority`、`visual_strategy`、`dominant_visual`、`display_mode`、`media_refs`、`media_usage`、`image_policy` 与 `media_catalog`。A-page 不再提前做任何视觉或媒体决定。
- 图片配额、图片页、媒体类型、页面配方与逻辑图资格全部属于后续视觉粗设，不得从旧 Media Plan 搬回 v4。
- 时间完全由 Nx 字符当量机械计算；目标时长小于 8 秒时默认合并，确需独立页面必须填写 `short_page_reason`。

## Stop Rules

- 冻结任务包只读；发现错漏时记录并上报，不修改。
- 未经用户明确批准，不创建批准母版、不进入 A 页面编译。
- 发生职责冲突、事实边界不清或 trace 有未解决项时，停止并请求决策。
- 不默认下发 subagent；只有用户明确授权或已启用 Skill 的强制验证流程要求时才允许。
- 新生产只生成 v6；v4/v5 保持冻结兼容，不把 B 映射或静默护栏泄漏到正式 handoff。

## Verification

```bash
python -m unittest discover -s .agents/skills/rewrite-course-narration/tests -p "test_*.py" -v
python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py \
  --validation-profile a-page-v6 \
  --task-package episodes/<module>/episode-XX-...-task-package.md \
  --compile-trace ..\.tmp\narration-pipeline\<task>\episode-XX/episode-XX-b-to-a-compile-trace.json \
  --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt \
  --compiled-json ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json \
  --output ..\player\episodes\episode-XX\inputs/episode-XX-a-page-validation.json
```

## Common Pitfalls

- 把任务包、旧稿或原 B 表喂给 Stage 1 → 破坏隔离，重写退化成改写。
- 未经批准就切 Nx 或生成 A 页面。
- 让 B 数量决定页面数量，或在正式 JSON/报告中保留 B ID。
- 生成 3–5 秒的纯过渡 A，却不给独立教学理由。
- 读取旧 N 稿、历史母版或停用流程产物作为输入 → 破坏 Stage 1 隔离；停止并从冻结任务包重新提炼 Brief。
- 在 v6 中保留任何视觉字段、媒体目录、图片配额、页面配方或旧 M 编号。
- 把 `silent_constraints` 写进口播、屏幕文案或可见槽位。
- 把每个语义原子机械拆成一个 S，或把多个具体原子压缩成失去枚举与关系的上位概括。
- 让下游读取任务包或 work trace 来补齐页面语义。
- 把 A 页面误当作已经完成的布局/CSS/renderer 规格。
