# Anchor: list-reveal（真实顺序列表）

> 这是窄范围结构示意，只适用于内容确有先后顺序、且批准口播为每个阶段提供
> 独立 narration beat 的章节。它不是所有“多张卡片”页面的默认实现。

## 适用条件

同时满足以下条件才使用本 anchor：

- 项目之间存在真实的步骤、阶段、排名或时间顺序；
- 每个项目拥有独立 narration beat；
- 当前项确实需要成为视觉焦点；
- visual rough 允许使用一个持续网格或轨道承载全部阶段。

普通并列属性、并列系统、并列原因或组合短语不适用；这些内容参考
[`../equal-group/`](../equal-group/)。

## 状态逻辑

整个章节只有一个持续网格，槽位位置不重排。每个 narration step 映射到一个
真实阶段：当前阶段可以 active，已完成阶段可以 past，尚未到达阶段可以 upcoming。
`active / past / upcoming` 在这里成立，是因为内容本身有顺序，不是因为页面有卡片。

```markdown
**语义关系**：顺序过程
**关系机制**：`ordered-progression` — 当前阶段取得焦点，已完成阶段保留为路径

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 采集 | `S-A003 · collection-active` | 建立固定轨道；采集为当前阶段 |
| 2 | 分析 | `S-A003 · analysis-active` | 保持轨道；采集转为已完成，分析取得焦点 |
| 3 | 行动 | `S-A003 · action-active` | 保持轨道；前两阶段保留，行动取得焦点 |
```

step 数必须来自批准口播，不额外增加“引子 step”，也不能为了填满所有槽位拆分
原本完整的 narration beat。

## 实现重点

- 单网格或单轨道持续存在，React 节点位置不重排。
- 不重新挂载已出现内容，不让旧项目重复入场。
- 当前阶段的强调应来自顺序语义；章节结束时可以让全部阶段回到完整路径状态。
- 若内容最终应保持等权，不使用本 anchor。

文件中的 `chapter.tsx` 和 `chapter.css` 只演示 ordered progression。使用时按当前
主题和内容改写，不复制 masthead、装饰和动画风格。
