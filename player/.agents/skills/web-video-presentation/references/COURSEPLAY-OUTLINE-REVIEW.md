# Courseplay outline review

本文件是独立、只读的 Courseplay outline 审查协议。它可以由 outline 作者
自行执行，也可以单独交给 reviewer agent 或 subagent。Reviewer 只报告，
不修改 outline、A-page、visual rough 或口播稿。

每次调用必须声明审查范围：

- `review_scope: chapter`：默认，审查 `outline.md` 中一个 chapter section；
- `review_scope: global`：全部 sections 冻结并填充全局派生区后，只审查跨章节约束。

两个 scope 互补。chapter pass 不代表整集不存在重复；global fail 也不允许
无理由重写所有已通过章节。

## 审查目标

判断 outline 是否在保留口播节拍与视觉冲击力的同时：

1. 以每个 A-page 的 base-scene 作为主要制作单位；
2. 让 step 在同一构图内遵循页面关系机制，并允许复用 semantic state；
3. 合理使用低成本 accent-frame；
4. 避免无必要的 custom-scene 候选，并把确认权留给 Checkpoint Plan；
5. 如实报告视觉制作规模。

本审查不评价配色、动画实现、CSS 选型或代码质量，也不因为 narration beat
数量较多、每个 A-page 的 step 数不同或单个 step 超过 10 秒而判失败。

## 必要输入

`review_scope: chapter`：

- `outline.md` 中当前 A-page 对应的 chapter section；
- 当前章已冻结的 script block；
- 对应 A-page；
- 对应 visual rough 页面；
- 可选：当前章批准口播原文。

`review_scope: global`：

- 已完成的模块化 `outline.md`；
- 正式 A-page JSON；
- 所有 chapter review 结论；
- 全部 A-page 与 visual rough；
- 可选：汇总后的 `script.md`。

Reviewer 同时使用
[`COURSEPLAY-STATE-MECHANISMS.md`](COURSEPLAY-STATE-MECHANISMS.md) 的概念
边界，但不得把其中的常见机制家族当成封闭白名单。

chapter scope 缺少当前 A-page、visual rough 页面或已冻结 script block 时停止；
global scope 缺少正式 outline 或完整 A-page / rough 时停止。输出
`REVISE` 并只列出当前 scope 缺少的输入。

## 分类口径

### Base scene

一个 A-page 的主要持续视觉框架。页面配方、媒体区、主体构图和主要内容组
在多个 step 中持续推进。默认每个 A-page 一个。

### Relationship mechanism 与 semantic state

relationship mechanism 说明整章如何表达顺序、并列、对照、汇聚、定义、读图
或其他关系；它不是固定枚举，也不规定 state 数量。semantic state 是某个 step
结束时形成的稳定画面，使用章节内自定义名称，可以被多个 step 重复引用。

Reviewer 先核对机制是否保持 visual rough 的配方、结构指纹和槽位关系，再检查
每条 step 的场景指令能否执行。独立槽位与独立讲解要求说明如何呈现，但不构成
“一槽位一个 state”。一个 step 可以依次呈现多个元素，多个 step 也可以保持同一
state。建立、保持、补充、聚焦、更新和收束是场景指令，不是全局 state 标签。

### Accent frame

用于金句、转折、概念边界或最终判断的低成本独立全屏页。它可以合理存在，
但不应承载新的复杂图表、媒体、卡片体系或关系结构。

### Custom scene

除 base-scene 和 accent-frame 外，需要新构图、新素材或复杂结构的独立场景。
它必须有不能在 base-scene 或 accent-frame 中表达的具体理由。

## 审查步骤

### 1. 核对当前 scope 输入

chapter scope 报告当前 A-page 的 base-scene、accent-frame、custom-scene 与
narration beat 数量；global scope 才统计整集规模并核对 outline 顶部摘要。
不要把 narration beat 数称为页面数，也不设置 accent-frame 的机械上限。

### 2. Chapter scope：检查当前 A-page

逐页检查：

- 是否存在一个明确 base-scene；
- base-scene 是否保留 visual rough 的配方、骨架和媒体资格；
- outline 是否声明结构指纹、语义关系和开放式关系机制；
- relationship mechanism 是否与页面配方和内容关系匹配；
- semantic state 是否描述稳定画面，并允许在画面关系不变时重复；
- 是否为了统一每页步数而压缩了独立卡片或轨道；
- 是否从槽位数量或机制链长度反推 step 数；
- 后续 step 是否写清本步场景指令；重复 state 时是否说明“保持”什么；
- 持续元素是否保留，主构图是否稳定；
- 声明 `可见标题：none` 的页：删除论点标题后，观众是否仍能从当前已有画面
  中完整得到同一判断？明确“是”才允许省略；存在疑问或答案为否 → fail，
  最小修改是恢复标题；
- 是否把并列、对照、定义或读图关系统一实现为卡片轮流 active；
- 是否把普通内容组、V/R 项或解释句误拆成新构图；
- accent-frame 是否承担真实的强调或停顿；
- accent step 是否使用无歧义的 `K-Axxx-xx · accent` 两段格式，而未混入额外
  semantic state 或第三段场景类型；
- custom-scene 是否标为 `proposed` 并有充分必要性，且未在 Checkpoint 前伪称批准；
- Beat 是否来自已冻结 script block，全部非空 Beat 顺序拼接与当前 A-page `nx`
  一致；是否错误地从 G/U、槽位、recipe、时长或固定模板反推数量；

### 3. Accent frame 判断

以下情况通常合理：

- 全章核心判断或认知转折；
- 脱离卡片和图形仍独立成立的金句；
- 概念边界、章节转场或最终结论；
- 全屏展示明显优于底部横条；
- 可用共享 StatementFrame 完成，不增加新素材与复杂布局。

以下情况标记为可疑：

- 普通解释句或重复结论；
- 同一句已在 base-scene 底部判断条完整展示；
- 仅为了让相邻 step 看起来不同；
- 本可在 base-scene 内通过槽位、权重或 semantic state 变化完成，却重新设计
  卡片或媒体场景。

### 4. 制作成本检查

重点寻找：

- 同一 A-page 内反复重新构图；
- 每个 step 都更换主视觉；
- 为 V/R 项分别制作独立页面；
- 标题、辅助句、内容组和结论分别成为 custom-scene；
- 无必要新增媒体或复杂视觉演示；
- 用 accent-frame 名义包装实际 custom-scene。

不要把某个 state 超过 10 秒列为制作成本问题。时长只有在暴露出多个独立
语义焦点或当前画面无法持续承载时，才作为内容粒度证据；时长本身不触发
REVISE。

### 5. Global scope：跨章节与派生内容

只在所有 chapter sections 已通过并填充全局派生区后检查：

- 顶部 A-page、base-scene、accent-frame、custom-scene 与 narration beat 统计
  是否与正文一致；
- metadata、schedule、materials 三个 global-derived marker 是否全部为 `ready`；
- A-page JSON 中每个页面是否在 outline 恰好出现一次，顺序与正式输入一致；
- 整集视觉调度是否覆盖每章，调度行是否忠实投影各章已冻结字段；
- 相邻章节是否仅替换文字却复用同一主构图、卡片比例、强调机制和固定 chrome；
- 全集偏离页占比是否超过 50%，或所有页 beat 数恒等于同一数值，形成系统性
  退化；
- 所有页恒等于 N 且存在明显可独立成拍的判断句却未触发扩张核查，锚点是否被
  机械执行；
- 完整素材清单是否无损汇总各章媒体 ID、角色、资格与就位状态；
- 是否出现所有章节机械使用同一 semantic state 链或强调方式的局部最优。

global fail 必须列出具体 A-page 与证据，并给出最小修改范围。只改全局统计或
调度行时，不得触碰 chapter section；需要解决相邻重复时，只回修被选中的页。
禁止使用“整期打回”作为未定位问题的默认建议。

## 判定

### PASS

chapter scope：当前 A-page 有稳定 base-scene；step 遵循页面关系机制；
semantic state 的复用或变化均有明确场景指令；accent-frame 使用合理；
custom-scene 候选有明确必要性且仍等待 Checkpoint Plan 决策。

global scope：整集规模与派生内容真实；章节顺序和素材汇总完整；相邻差异、
beat 分布与机制选择没有系统性退化。

### REVISE

出现任一情况即要求修改：

- A-page 没有持续视觉框架；
- 固定步数模板压缩了 visual rough 中独立讲解的卡片、轨道或内容组；
- 使用固定全局 state 标签或三段链替代章节内语义设计；
- 并列关系被实现为轮流 active，或只有顺序过程才适用的 active / past /
  upcoming 被泛化到其他关系；
- semantic state 只写通用动作，无法说明稳定画面；
- 普通 step 被设计成独立复杂页面；
- custom-scene 缺少必要性；
- accent-frame 大量重复已有结论或承载复杂场景；
- outline 混淆 scene、state 与 narration beat；
- 规模摘要与正文不一致。

## 固定输出格式

```markdown
# Outline Review Report

## Verdict

`PASS` 或 `REVISE`

## Review scope

`chapter: Axxx` 或 `global`

## 制作规模

- A-pages：
- Base scenes：
- Accent frames：
- Custom scenes：
- Narration beats：

## 逐页结论

| A-page | Base scene | Accent | Custom | 连续性 | 结论 |
|---|---:|---:|---:|---|---|
| A001 | 1 | 0 | 0 | 保持同一构图 | PASS |

## 必须修改

1. `<章节或行号>`
   - 问题：
   - 证据：
   - 最小修改建议：

## 可选优化

1. ...

## 保留项

列出已经做得好的场景连续性、强调页与节奏设计，防止修正时误删。
```

没有必须修改项时写 `none`，不要为了填满报告制造问题。

chapter scope 的“逐页结论”只写当前 A-page；global scope 覆盖所有 A-page，
但不要重复 chapter report 的全部细节，只记录跨章与汇总结论。

## 自动化调用

任务级选项：

- `review_mode: self`（默认）：作者按本协议自检并修正。
- `review_mode: independent`：调用方明确要求时，把本协议和全部必要输入
  交给 reviewer agent/subagent；父 agent 根据报告修正 outline。

`review_mode` 决定由谁审查，`review_scope` 决定审查什么，两者不能互相替代。

请求 independent 但无可用 reviewer 时回退到 self，并在 Checkpoint Plan
披露。审查报告默认通过 agent 消息返回，不落盘；只有调用方明确要求时才保存。
