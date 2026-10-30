# 设计参考实例 CSS 统一计划

状态：第一步相近样式整理完成；本次未修改 CSS、组件或播放器。

## 范围与目标

只分析设计参考实例中用户选定的五章：

| 来源 | 章节 | CSS |
| --- | --- | --- |
| 06-03 | 解析到底做什么 | [WhatResolutionDoes.css](../episodes/episode-design-reference/src/chapters/01-ep06-what-resolution-does/WhatResolutionDoes.css)（`wr-`） |
| 06-02 | 身份键与挂载的信息 | [IdentityKey.css](../episodes/episode-design-reference/src/chapters/02-ep06-identity-key/IdentityKey.css)（`ik-`） |
| 35-09 | 真实路线验证 | [RouteValidation.css](../episodes/episode-design-reference/src/chapters/03-ep35-route-validation/RouteValidation.css)（`rv-`） |
| 35-10 | 现场决策顺序 | [DecisionLedger.css](../episodes/episode-design-reference/src/chapters/04-ep35-decision-ledger/DecisionLedger.css)（`dl-`） |
| 35-11 | 选型收束 | [SelectionConclusion.css](../episodes/episode-design-reference/src/chapters/05-ep35-selection-conclusion/SelectionConclusion.css)（`sc-`） |

目标是在保留五章画面构图、视觉重点和节拍的前提下，识别可复用样式，减少维护与按需阅读成本。原始 ep06、ep35 和其他实例暂不纳入范围；是否扩展另行确定。

## 第一步：相近样式整理

### 已经共用的基础

- 五章的组件都使用 `scene-pad`；卡片使用 `card`，部分使用 `card-glass`、`rule`、`hero-num`。这些基础类已在播放器共享的 [base.css](../src/shared/presentation-runtime/styles/base.css) 中定义，后续应先核对已有能力，避免再建一套。
- 颜色、文字和动效已经大量使用 `--text`、`--accent`、`--rule`、`--surface-*`、`--font-*`、`--ease-*` 等主题变量。基础样式允许章节按内容自行设置字号、间距和动效时序，不要求这些数值一致。
- 共享 [animations.css](../src/shared/presentation-runtime/styles/animations.css) 已有通用动效。它的 `rise-in` 与下文 14px 入场相近，但终点是 `translateY(0)` 而非 `none`；不能把两者直接当成代码完全相同或未经验证就替换。

### 候选样式和差异

| 类别 | 已观察到的相似之处 | 必须保留或核对的差异 |
| --- | --- | --- |
| 场景容器 | `wr-scene`、`ik-scene` 均为 `gap: 30px`；`dl-scene`、`sc-scene` 均为顶部对齐和 `gap: 18px`。五章均使用 `scene-pad`。 | `rv-scene` 的间距为 26px；这些容器本身的重复很少，未必值得单独抽象。 |
| 标题栏布局 | `rv-head`、`dl-head`、`sc-head` 都是左右分布、底部对齐、间距 40px。后两者的入场关键帧也相同。 | `rv-head` 的动画分配给内部元素；`dl` 和 `sc` 的说明色、标题字号分别不同。 |
| 主标题与小标签 | 多个主标题使用中文展示字体、900 字重和主题正文色；多个 kicker 使用等宽字体、字间距和主题色。 | 主标题为 46、47、52、58、56px 等不同尺寸；标签的颜色、字间距与上下留白也不完全一致。 |
| 双栏主区 | `wr-main`、`ik-main` 都是可伸展的两栏 grid，间距 56px，并带 `flex: 1`、`min-height: 0`。 | 左栏宽分别为 720px、680px；前者是锚点与关联组，后者是图片与洞察栏。 |
| 未就位的卡片 | `dl-row:not(.is-set)` 与 `sc-outcome:not(.is-on)` 都有透明背景、2px 虚线边框、无阴影。 | `sc` 还负责居中；`rv-node.is-upcoming` 使用不同背景，其过去、当前、未来三态不能和其他章节混同。 |
| 覆盖式占位与内容 | `dl-close-ghost`、`sc-pivot-ghost` 都绝对铺满、居中，使用圆角、等宽字和淡出；对应内容板之后进入。 | 前者虚线是 2px，后者是 3px；实际内容、尺寸、进入动画、延迟及激活条件均不同。 |
| 标签与信息块 | `wr-chip`、`ik-chip`、`dl-chip`、`rv-damage-chip` / `rv-out-chip` 都是有边框或底色的信息块。 | 尺寸、描边、颜色、初始状态和出现顺序不同；相似外观不足以证明可以直接共用一个类。 |
| 状态和色彩 | 各章均使用主题文字、强调、过程、警示等颜色，并根据状态更新样式。 | `is-on`、`is-set`、`is-past`、`is-pivoted` 与 `data-state` 的含义和效果不同；不能只按名称合并状态规则。 |

### 完全相同的关键帧定义

以下是去除空白后内容完全相同的定义；各元素引用它们时的动画时长、延迟、缓动和填充方式仍可能不同：

| 关键帧内容 | 当前定义 |
| --- | --- |
| 透明且下移 14px，进入后不透明、`transform: none` | `wr-panel-in`、`dl-fade-in`、`dl-part-in`、`sc-fade-in` |
| `stroke-dashoffset` 归零 | `wr-draw`、`ik-draw`、`dl-draw`、`sc-draw` |
| 透明、下移 24px 且缩放至 0.97，进入后不透明、`transform: none` | `dl-row-in`、`sc-cell-in` |
| `scaleX(0)` 到 `scaleX(1)` | `wr-rule-grow`、`rv-strike`；前者用于横线展开，后者用于删除线出现。 |

共享基础只意味着关键帧的声明可作为候选；各章节的状态触发、时长、延迟、填充模式、初始属性和具体语义仍需分别保留。

### 对 token 收益的文字模拟

用 `o200k_base` 对上述四组完全相同的关键帧做了一次内存中的文字模拟：删除各章的重复定义，改用一份共享定义，并把共享 CSS 和入口导入语句计入阅读内容。没有修改仓库中的 CSS，也没有验证模拟代码的运行行为。

| 读取范围 | 当前 | 模拟合并后 | 变化 |
| --- | ---: | ---: | ---: |
| README、入口和五章源码 | 24,647 | 24,386 | 少 261，约 1.1% |
| README 和单章源码，加上合并后需要的共享 CSS | 4,719–6,053 | 4,717–6,108 | 四章各增加 39–130；另一章减少 2 |

这个模拟只覆盖四组完全相同的关键帧，并非其他 CSS 整理的收益上限；但它说明最直接的去重候选不足以显著降低完整读取成本，而单章读取还可能变贵。原本就共用的播放器基础 CSS 没有计入此模拟的两侧。

作为对照，若只读取 README、入口、五章 TSX 和口播文件，不读取五章 CSS，则现有文本从 24,647 降至 9,226 token，少 15,421，约 62.6%。这只是省略 CSS 的理论差额，不包含补充设计说明、截图及其图片 token，也不能证明信息和画面质量不受影响。

因此，若主要目标是减少 token，建议优先探索**分层参考**：先提供简短的五章索引和按章节组织的构图、节拍与动效说明；按需观看相应画面；只有需要精确复用实现细节时才读取相关 TSX / CSS。实际节省应将新说明、图片和额外读取一并计入，并用同一制作任务对比生成效果。CSS 去重更适合作为维护性优化，收益应单独评估。

不读取 CSS 的结构理解盲测见[阅读测试报告](reference-instance-css-reading-test.md)。

### 保留章节独有的部分

- 06-03 的共享锚点、关联信息分批出现，以及错误拆散 / 正确定位示意。
- 06-02 的持续图片、身份键关系图、信息更替和 `data-state` 状态切换。
- 35-09 的步骤带、箭头、路线光点和过去 / 当前 / 未来状态。
- 35-10 的四列台账、逐行落位、理由线与对勾。
- 35-11 的双结局、循环轨道、判断重心迁移和三问印章。

五章 CSS 未发现 `@media` 或 `@container` 规则；当前由播放器将 [1920×1080 舞台整体缩放](../src/shared/presentation-runtime/components/Stage.tsx)。不能仅凭样式重复就把这些画面当成适用于任意尺寸的响应式组件。

## CSS 统一的后续步骤（本次不实施）

1. **选择试点**：优先核对内容完全相同的关键帧，以及 35-10 / 35-11 的标题栏与占位态；判断是否有足够的维护和阅读收益，再确定共享文件、命名和加载范围。主题及现有基础类优先复用，不因为代码相似就增加抽象。
2. **小批量等价整理**：如果试点有收益，优先在参考实例内整理公共部分，并保留每章的布局参数、状态选择器和动画时序。核对 CSS 加载顺序、选择器优先级及全局 `@keyframes` 命名，避免影响其他实例。是否调整共享播放器需另行界定范围。
3. **逐批验证**：对照原画面检查五章全部 17 个节拍，包括前进、后退、跳转和刷新恢复；对涉及动效的部分抽查开始、中途和结束状态，确认无溢出及视觉变化。按章节改动要求执行 `pnpm episode:check`、`pnpm typecheck`、`pnpm lint` 并预览；若变更共享运行时或主题，再执行 `pnpm build`。现有 lint 不覆盖章节源码。
4. **复测阅读成本**：按相同 tokenizer 和读取范围，分别比较「README + 单章 + 必需的共享 CSS」与「README + 五章 + entry + 必需的共享 CSS」，共享文件每次读取集合计一次。对照每章和全量结果，避免只统计删除的代码而漏掉新增的共享依赖；实际对话的额外上下文与缓存另计。如果单章读取反而明显增加，需要重新评估抽象。

当前基线按 `o200k_base` 编码逐文件计数：

- 五章 CSS 合计 2,565 行，约 15,421 个 token。
- README 加任意一章的 TSX、CSS 和口播文件，约 4,719–6,053 个 token。
- README、入口文件和五章的 TSX、CSS、口播文件，合计约 24,647 个 token。

这些是现有文本的输入规模估算，不代表可节省量或实际账单。当前基线没有读取播放器原有共享 CSS；如后续比较需要读取它，应在改造前后都按同一口径计入，新增的必需共享文件也要计入。
