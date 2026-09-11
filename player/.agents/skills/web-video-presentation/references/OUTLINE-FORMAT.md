# Courseplay `outline.md` 格式规范

`outline.md` 是批准 A-page、visual rough 与章节实现之间的 Markdown 契约。它只
服务 Courseplay A-page v6 + visual rough v4，不承担普通文章或自由口播流程。

## 来源边界

| 来源 | 提供什么 | 禁止什么 |
|---|---|---|
| 当前章 script 候选 | narration Beat、顺序、口播焦点与估时 | 改写 `nx`；从别章反推当前章 |
| A-page v6 | `nx`、screen guidance、静默护栏、证据和受保护关系 | 保存新的最终文案；泄漏静默约束 |
| visual rough v4 | 页面配方、骨架、S/G/U、关系载体与媒体资格 | 从槽位或 G/U 数量反推 Beat |

Phase 1 只接受 `episodes/<id>/inputs/` 中通过 preflight 的正式输入。完整边界见
[`COURSEPLAY-BOUND-MODE.md`](COURSEPLAY-BOUND-MODE.md)；关系、state 与 step 的区别见
[`COURSEPLAY-STATE-MECHANISMS.md`](COURSEPLAY-STATE-MECHANISMS.md)。

```text
A-page + visual rough → 章节边界、语义、骨架、媒体资格
script.md             → 批准口播的 Beat 边界
outline.md            → 持续构图、槽位、状态变化、场景例外
chapter               → 组件、CSS、动画与具体视觉演示
narrations.ts         → 运行时 step 数与 TTS 文本
```

Outline 不写组件名、DOM、CSS、动画类型、keyframe 或毫秒值。

## 初始化与持久状态

`courseplay:phase1 init` 从 A-page `pages[]` 顺序和 `a_id` 确定性创建两份正式
外壳。文件不存在或仍与仓库原始 episode 模板一致时创建/迁移；已有合法
Courseplay marker 时恢复；任何其他既有内容返回 `PHASE1_ARTIFACT_CONFLICT`，
不得覆盖。

```markdown
# Video Outline

<!-- GLOBAL:metadata:BEGIN -->
> **编译状态**：in-progress
> **主题**：pending（Checkpoint Plan 待选）
> **章节**：<pages.length>
<!-- GLOBAL:metadata:END -->

## 整集视觉调度

<!-- GLOBAL:schedule:BEGIN -->
<!-- GLOBAL-CONTENT: pending -->
<!-- GLOBAL:schedule:END -->

## 0. cover — 封面（1 silent step · fixed 15s）

<!-- CHAPTER:A001:BEGIN tx=pending -->
## 1. a001 — pending（0 steps · ~0s）

**A-page / Chapter**：`A001`

<!-- CHAPTER-CONTENT: pending -->
<!-- CHAPTER:A001:END -->

## 素材清单

<!-- GLOBAL:materials:BEGIN -->
<!-- GLOBAL-CONTENT: pending -->
<!-- GLOBAL:materials:END -->
```

初始化不得提前生成标题、Beat、step、scene、recipe、state、信息池或媒体判断。
chapter marker 内是当前章唯一可写范围；marker 由 runner 维护，候选不得包含。
`tx` 只表示 script/outline 同章事务一致，不表示审查状态。

`finalize` 自动生成 metadata、整集调度和素材汇总；Agent 不手工维护这些区域。

## 全局派生区

Metadata 必须报告：

```markdown
> **编译状态**：awaiting-checkpoint-plan
> **主题**：pending（Checkpoint Plan 待选）
> **章节**：<N>
> **Base scenes**：<B>
> **Accent frames**：<A>
> **Custom scenes**：<C>
> **Narration beats**：<M>
```

封面不计入正文 A-page、base-scene 或 narration beat。不得把 Beat 数称为页面数。

整集视觉调度使用：

```markdown
| A-page | 页面配方 | 语义关系 | 关系机制 | 主构图 | 强调方式 | 媒体 | 与相邻页的主要差异 |
|---|---|---|---|---|---|---|---|
| A001 | `central-question` | 前提汇聚到问题 | `premise-to-question` | 三个前提围绕中心问题 | 中心焦点转移 | none | 与封面不同 |
```

## 章节候选格式

每个候选必须是一段完整 section：

```markdown
## 1. a001 — <章节标题>（<S> steps · ~<T>s）

**A-page / Chapter**：`A001`
**基础场景**：`S-A001` — <持续主构图>
**页面配方**：`<recipe>`
**核心判断**：<观众最终形成的判断>
**结构指纹**：`<slot-a | slot-b | slot-c>`
**语义关系**：<顺序 / 并列 / 对照 / 汇聚 / 定义 / 读图 / 其他>
**关系机制**：`<mechanism-id>` — <保持骨架并推进关系的方式>
**持续元素**：<跨 step 保持可识别的元素>
**内容槽位**：<槽位 ID 与语义>
**可见标题**：`保留`
**强调页**：`K-A001-01` 或 `none`
**额外复杂场景**：`none` 或 `<scene-id> proposed — <必要性>`

**信息池**：
- <来自当前 A-page guidance / beats / presentation 的具体视觉信息>

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | <焦点> | `S-A001 · premise-visible` (~12s) | <建立槽位与最终稳定结果> |
| 2 | <焦点> | `S-A001 · question-dominant` (~10s) | <保持什么、更新什么、最终形成什么> |

**本章素材**：
- ⚠️ `M001`：<媒体角色>（待提供 / placeholder）
```

### 字段规则

- 标题序号从 1 开始；chapter id 使用小写字母、数字和连字符。
- `<S>` 必须等于当前 script Beat 数；step 行从 1 连续编号。
- `基础场景`描述持续构图；一个 A-page 默认一个 base-scene。
- `结构指纹`保留该页区别于其他页面的核心槽位组合。
- `关系机制`不规定 step/state 数量。
- `持续元素`不能在后续 step 无理由消失或整体重排。
- `可见标题`默认保留；只有满足 `COURSEPLAY-BOUND-MODE.md` 的受限省略规则时
  才写 `none` 并追加 `**省略理由**`。
- accent-frame 只承载核心句与必要短 kicker。
- custom-scene 在 Phase 1 只能是 `proposed`，并解释为何 base-scene 与
  accent-frame 都不足；用户在 Checkpoint Plan 批准后才能实现。

## Beat、step 与 semantic state

每个批准 narration Beat 对应一个 step，但不自动对应新页面或新 state。

- Beat 只从 `script.md` 当前章的 `---` 边界读取。
- semantic state 使用章节内 `lower-kebab-case`，描述本拍结束后的稳定画面。
- 相邻 step 可以逐字复用同一 state；场景指令写清保持的构图与当前焦点。
- 一个 step 可在同一构图内完成多个内部动作，最终落到一个 state。
- 只有可见信息、视觉权重、焦点对象或关系结果真实变化时才创建新 state。
- 只有当前 base-scene 无法承载新关系或空间组织时才提议新场景。
- 时长超过 10 秒、槽位多个或 G/U 数量变化都不是拆 Beat/state 的理由。

Base/custom scene step：

```markdown
| 2 | 局部职责 | `S-A005 · systems-equal` (~16s) | 保持四卡等权，在原槽位补充职责；不产生当前选中项 |
```

Accent step 只使用两段引用：

```markdown
| 4 | 最终判断 | `K-A015-01 · accent` (~5s) | 切换到已声明的低成本强调页 |
```

不得写成 `accent-frame` 加额外 semantic state。只有真实顺序过程可使用
active/past/upcoming；并列、对照、定义、读图必须使用相应关系机制。

## 信息池与素材

信息池只使用当前 A-page 的 guidance、beats、presentation、受保护关系和合格媒体；
不得添加 packet 外事实、假数字、假 logo 或静默约束。

每章记录媒体 ID、角色与状态。`finalize` 在末尾按 A-page 汇总：

```markdown
## 素材清单

### A001
- ✓ `M001`：<角色>（<已就位路径>）
- ⚠️ `M002`：<角色>（待提供 / placeholder）
```

需要教材原图时不得用 AI 图、描摹或重绘冒充证据。

## 最小自检

- [ ] script Beat 顺序拼接无损还原当前 `nx`
- [ ] Beat 与连续编号 step 一一对应
- [ ] 所有受保护关系出现，S/U/R/M 引用均属于当前页
- [ ] 每个 step 说明稳定结果；无变化时明确复用 state
- [ ] 默认保持一个持续 base-scene，没有逐 step 重构图
- [ ] accent 有真实强调价值；custom 为 `none` 或有理由的 `proposed`
- [ ] 没有从槽位、recipe、G/U、时长或模板反推 Beat 数
- [ ] 媒体需求完整，缺失项明确标为 placeholder

质量问题只重提受影响章节。章节顺序、nx、Beat/step、引用、统计和汇总由 runner
在 `commit-chapter` / `finalize` 中机械验证。
