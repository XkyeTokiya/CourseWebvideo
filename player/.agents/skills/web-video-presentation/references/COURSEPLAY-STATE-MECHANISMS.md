# Courseplay relationship mechanisms

本文件用于 Courseplay outline 设计与章节实现。它帮助 agent 根据 A-page 的
语义关系选择视觉推进方式，但**不是封闭枚举，也不规定 step 或 state 数量**。

## 三个必须分开的概念

- **relationship mechanism**：整章如何表达内容关系，例如并列等权或前提汇聚。
- **semantic state**：某个 narration step 结束时，base-scene 已形成的稳定画面。
- **step instruction**：本 step 内发生的建立、保持、补充、转移焦点或内部依次呈现。

`narration beat` 决定 step 数，关系机制不决定 step 数。每个 base-scene step
引用一个结束时的 semantic state；相邻 step 可以重复引用，因此 unique semantic
state 数可以少于或等于对应 step 数。一个 step 也可以在同一构图内完成多个
内部动作后落到一个稳定 state；内部动作不另计 semantic state。

semantic state 使用章节内自定义的 `lower-kebab-case` 名称，例如
`systems-equal`、`question-dominant`、`definition-assembled`。它应描述画面
已经形成的结果，不使用 `init`、`add`、`focus`、`update`、`conclude` 这类
通用动作词充当全局标签。

## 常见机制家族

| 语义关系 | 常见机制 | 实现约束 |
|---|---|---|
| 顺序过程 | `ordered-progression` | 可以按真实先后使用 active / past / upcoming；不得用于并列内容 |
| 并列关系 | `equal-weight-accumulation` | 卡片保持等权；允许同一 step 内依次出现，完成后不留下当前选中项 |
| 核心问题 | `premise-to-question` | 前提持续存在或弱化，视觉中心转移到问题 |
| 两栏对照 | `compare-and-reweight` | 两侧空间持续，通过权重和判断变化推进，不轮播卡片 |
| 概念定义 | `cumulative-assembly` | 在固定结构内逐层组装定义、范围或组成部分 |
| 图片阅读 | `persistent-media-reading` | 图片持续，注释或阅读焦点迁移，不反复卸载媒体 |
| 时间锚点 | `anchor-and-context` | 年份或事件持续，历史限定和定义在固定区域补充 |
| 往复过程 | `feedback-cycle` | 表达判断、行动返回、状态改变、再次观察等阶段 |

这张表只提供决策起点。visual rough 若表达其他关系，可以命名新的机制并用
一句话说明它如何保持页面骨架、如何改变视觉权重。新增机制不需要新增运行时
类型、组件基类或全局 state 枚举。

## Step 映射规则

outline 的每条 base-scene 或 custom-scene step 必须包含：口播焦点、scene ID、
semantic state 和本步场景指令。semantic state 表示最终稳定画面；场景指令说明
相对前一步发生什么。accent-frame 是唯一格式例外，只写 `K-Axxx-xx · accent`，
不附加 semantic state。

同一 state 可以重复：

```markdown
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 四类系统已经存在 | `S-A005 · systems-equal` (~12s) | 建立四个等权槽位，并在本 step 内依次补齐内容；完成后全部等权 |
| 2 | 它们分别完成局部任务 | `S-A005 · systems-equal` (~16s) | 保持四卡等权，在原槽位补充职责说明；不产生当前选中项 |
```

不同 step 与 state 数量都合法：

```markdown
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 定义与范围 | `S-A009 · definition-assembled` | 在同一 beat 内完成多层组装，最终全部稳定保留 |
```

```markdown
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 判断形成 | `S-A012 · judgment-formed` | 建立判断和固定过程轨道 |
| 2 | 行动返回 | `S-A012 · action-returned` | 保持轨道，行动返回现场 |
| 3 | 状态改变 | `S-A012 · state-changed` | 保持前两阶段，现场状态更新 |
| 4 | 再次观测 | `S-A012 · reobserved` | 保持完整路径，加入再次观测结果 |
```

以上 1、2、4 step 例子用于证明数量是开放的，不是新的数量模板。

## 实现映射

章节组件显式把 narration step 映射到 semantic state，数组中允许重复：

```tsx
const stateByStep = [
  "systems-equal",
  "systems-equal",
  "systems-with-takeaway",
] as const;

export function A005Chapter({ step }: ChapterStepProps) {
  return <A005Scene state={stateByStep[step] ?? stateByStep.at(-1)!} />;
}
```

不要把 `step` 直接当 active 索引，也不要用 `visible = step + 1` 统一解释所有
页面。是否使用 active / past / upcoming，只由真实的顺序关系决定。
