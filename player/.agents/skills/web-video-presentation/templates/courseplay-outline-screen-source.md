# Courseplay Outline：screen source projection template

> This is a human-readable Outline template for the v2 candidate flow. It keeps the
> current Outline presentation and is not an additional production content authority.
> Screen wording in `[Sxxx]` entries is mechanically resolved from the A-page `screen`
> layer; do not independently rewrite it here.

## 顶部元数据

<保留现有课程、集数、来源、状态和审阅说明；不新增 screen-copy 文件。>

## 整集视觉调度

| A-page | 页面配方 | 语义关系 | 关系机制 | 主体槽位 | 强调页 | 媒体 | 备注 |
|---|---|---|---|---|---|---|---|
| A001 | `<registered-recipe-id>` | `<A-page relation summary>` | `<registered mechanism>` | `<S/G/M IDs>` | `none` | `none` | `<review note>` |

## 1. `<chapter-id>` — `<章节标题>`（`<N> steps · ~<seconds>s`）

**A-page / Chapter**：`A001`
**基础场景**：`S-A001` — `<保留当前场景与语义状态名称>`
**页面配方**：`<registered-recipe-id>`
**核心判断**：`S001`（v2 指向 screen source；v3 只指向判断方向，不复制 guidance）
**结构指纹**：`<现有结构指纹；只引用 S/G/M IDs，不复制 A-page 文本>`
**语义关系**：`<现有关系摘要>`
**关系机制**：`<现有关系机制；只说明关系如何由槽位、分组、顺序或对照承载>`
**持续元素**：`<现有持续元素；用 S/G/M IDs>`
**内容槽位**：`headline <- S001`；`left <- G001`；`media <- M001`
**强调页**：`none`
**额外复杂场景**：`none`
**可见标题**：`保留`
**信息池**（机械投影，供人审阅）：
- 屏幕方向：`S001`、`G001`、`E001`；v2 按冻结 source 规则，v3 不在 Outline 保存最终文案或逐项覆盖表。
- 关系：`R001`；证据：`E001`；静默护栏：`C001`。
- 媒体：`M001`；媒体说明来自 visual rough 的 ID/槽位计划。

**beat 切分**：`N=<script.md beats>`，`<保留当前 beat 合并/扩张说明>`。

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | `<口播焦点>` | `S-A001 · <chapter-local-state>` | `show: G001; keep: []; focus: [G001]; <保留现有场景指令>` |

**口播节选**：`<可选；仅供人阅读，不进入 handoff；准确 beat 由 script.md 提供>`

## 素材清单

### A001

- `M001`：`<media-type>` — `<媒体作用>`

## 内容来源边界

- Outline 保留现有 Markdown 结构、字段顺序、四列表格、素材清单与人工审阅笔记。
- `S/G/M/R/E/C` 只作 ID 引用；它们不替代 A-page 的 screen source、protected_relations
  或 silent_constraints，也不构成第二套手写内容源。
- handoff 只接收结构化投影：v2 `screen_source` / v3 `screen_guidance`、`presentation`、`steps`、`materials_markdown`
  与来源哈希，不嵌入本文件。
