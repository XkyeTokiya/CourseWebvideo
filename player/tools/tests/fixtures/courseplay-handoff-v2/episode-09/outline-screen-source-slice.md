# Outline v2 candidate slice — episode-09

> Fixture-only projection for A001, A008, and A009. The Markdown presentation stays
> human-readable; screen source is resolved from the candidate v5 A-page and is not
> embedded into any v2 handoff packet.

## 顶部元数据

**Episode**：`episode-09`<br>
**状态**：`candidate-only`<br>
**来源**：candidate v5 A-page + current Outline structure<br>
**审阅边界**：A009 narration is not approved production text.

## 整集视觉调度

| A-page | 页面配方 | 语义关系 | 关系机制 | 主体槽位 | 强调页 | 媒体 | 备注 |
|---|---|---|---|---|---|---|---|
| A001 | `issue-cards-with-image` | 前提→问题 | `premise-to-question` | `M001 + S001 + G001` | `none` | `M001` | 代表开篇情境 |
| A008 | `split-compare-with-thesis` | 前后对照 | `compare-and-reweight` | `S017 + G017 + G018` | `none` | `none` | 代表查找方式对照 |
| A009 | `evidence-cards-with-provenance-boundary` | 归属→结果 | `cumulative-assembly` | `S022 + G020 + G021` | `none` | `none` | 代表候选证据页 |

## 1. after-scan — 认出发动机之后（3 steps · ~41s）

**A-page / Chapter**：`A001`
**基础场景**：`S-A001` — 现场图媒体区 + 四张问题卡阅读列 + takeaway 收束线，全章持续
**页面配方**：`issue-cards-with-image`
**核心判断**：`[S001] 扫描认出发动机，追溯才刚刚开始`
**结构指纹**：`M001 | G001 | takeaway`
**语义关系**：售后识别前提→四类待查问题
**关系机制**：`premise-to-question` — 由媒体、分组与阅读顺序承载
**持续元素**：`S001`、`M001`、`G001`
**内容槽位**：`media-scene <- M001`；`headline <- S001`；`question-cards <- G001`
**强调页**：`none`
**额外复杂场景**：`none`
**可见标题**：`保留`
**信息池**（机械投影，供人审阅）：`S001`、`G001`、`R001`、`R002`、`E007`、`E011`、`C001`、`C002`、`M001`

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 售后情境与前两问 | `S-A001 · scene-and-first-questions` | `show: M001, S001, G001; focus: S001` |
| 2 | 后两问 | `S-A001 · all-questions-visible` | `keep: M001, S001; focus: G001` |
| 3 | 识别缺口与本节引入 | `S-A001 · recognition-gap-stated` | `keep: M001, S001, G001; focus: R002` |

**口播节选**：`<optional; not projected to handoff>`

## 8. lookup-changed — 改变的是查找方式（3 steps · ~41s）

**A-page / Chapter**：`A008`
**基础场景**：`S-A008` — 左右两栏前后对照 + bottom thesis 收束条
**页面配方**：`split-compare-with-thesis`
**核心判断**：`[S017] 统一标识改变记录查找方式，数据价值仍要靠治理、分析和协同`
**结构指纹**：`G017 | G018 | S017`
**语义关系**：前后对照
**关系机制**：`compare-and-reweight` — 两栏持续，关系由栏内顺序承载
**持续元素**：`G017`、`G018`、`S017`
**内容槽位**：`before <- G017`；`after <- G018`；`thesis <- S017`
**强调页**：`none`
**额外复杂场景**：`none`
**可见标题**：`保留`
**信息池**（机械投影，供人审阅）：`S017`、`G017`、`G018`、`R017`、`R018`、`R019`、`E002`、`E004`、`E006`、`E007`、`E010`、`C017`、`C018`

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 改造前 | `S-A008 · before-column-set` | `show: G017; keep: G018; focus: G017` |
| 2 | 改造后 | `S-A008 · after-column-complete` | `keep: G017; show: G018; focus: G018; carry: R017, R018` |
| 3 | 关联能力与价值条件 | `S-A008 · thesis-stated` | `keep: G017, G018; focus: S017; carry: R019` |

**口播节选**：`<optional; not projected to handoff>`

## 9. evidence-boundary — 三项案例数字的证据边界（3 steps · ~21s）

**A-page / Chapter**：`A009`
**基础场景**：`S-A009` — provenance band + 三项结果组
**页面配方**：`evidence-cards-with-provenance-boundary`
**核心判断**：`[S022] 某集团发动机质量追溯案例的三项结果`
**结构指纹**：`G020 | G021`
**语义关系**：案例归属→三项结果
**关系机制**：`cumulative-assembly` — 先归属，再按口播步序组装结果
**持续元素**：`G020`、`G021`
**内容槽位**：`provenance <- G020`；`results <- G021`
**强调页**：`none`
**额外复杂场景**：`none`
**可见标题**：`保留`
**信息池**（机械投影，供人审阅）：`S022`、`G020`、`G021`、`R020`、`R021`、`E008`、`C020`、`C021`、`C022`

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 案例归属与第一项结果 | `S-A009 · provenance-first-result` | `show: G020, S024; focus: G020` |
| 2 | 第二项结果 | `S-A009 · second-result` | `keep: G020, S024; show: S025; focus: G021` |
| 3 | 第三项结果 | `S-A009 · three-results-complete` | `keep: G020, S024, S025; show: S026; focus: G021` |

**口播节选**：`<optional; the removed audit and commitment shells remain C020–C022>`

## 素材清单

### A001

- `M001`：`photorealistic_ai` — 售后扫描情境占位媒体；不承载 screen source。

### A008

- `none`

### A009

- `none`
