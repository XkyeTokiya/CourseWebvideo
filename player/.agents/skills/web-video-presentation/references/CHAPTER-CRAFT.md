# 章节开发指引（每章开发必读）

---

> **Courseplay-bound mode**：v5 + v2 或 v6 + v3 输入时读取
> [`COURSEPLAY-BOUND-MODE.md`](COURSEPLAY-BOUND-MODE.md)，状态映射另读
> [`COURSEPLAY-STATE-MECHANISMS.md`](COURSEPLAY-STATE-MECHANISMS.md)。handoff 是
> 可选的当前章节上下文打包工具；Phase 2 可读取 `.handoffs/<Axxx>.json`，也可直接
> 使用等价的当前章节输入。v2 输入提供 beats、`screen_source`、`presentation`、steps
> 和护栏；v3 输入提供 beats、`screen_guidance`、`presentation`、steps、关系和护栏。

## 这是视频，不是 PPT

正在做的是**视频网页** —— 讲者点击 + 口播 + 录屏发出去给观众看。
判断每一步做对没有，标准非常朴素：

- **不像 PPT** —— 观众感觉是在看视频，不是在看翻页幻灯（页面中不得包含页眉页脚，突出主视觉元素）
- **看起来舒服** —— 配色、字体、节奏都让人放松，不得出现大量的纯文字、不得出现字体太小的文字
- **有视觉冲击** —— 画面在演事情，不只是文字堆砌，不得一次性全部罗列所有元素，关键元素随进度逐步推进展现

不得给每章套同一组 kicker、页码、masthead、辅助句、底部 foot 或固定判断条。
标题、媒体区和判断区是否存在、放在哪里，由 handoff 的 presentation 对应当前 visual rough
骨架的声明决定；Courseplay 下 outline 声明 `可见标题：none` 时（见
`COURSEPLAY-BOUND-MODE.md`「可见标题省略（实验性授权）」），页面不渲染
标题区，也不得自行恢复标题或为顶替标题新造文案与槽位。
持续 base-scene 指本章构图持续，不等于整集共享一套幻灯片 chrome。

---

## 必须用 CSS / SVG / Canvas / JS 大胆绘制视觉演示

> **这是底线。**
>
> 每一章都至少要有 1~2 处"动起来的图 / 演示元素"。
> **整章只有纯文字 = 验收不过 = 回去重做。**

视频感最强的来源 —— 用户**看见**了被讲解的东西在屏幕上演给他看：

- 数字在递增 / 横条在生长 / 排名在交换
- 流程节点依次点亮 / 连线自绘
- 对比被一刀切开 / 聚光灯扫过 / 形状在变形
- 粒子聚拢成形 / 噪声背景流动 / 字符雨下落
- 模拟终端交互
- 模拟 AI 对话窗口
- 模拟文件目录树

**怎么组合发挥都行 —— 但每章必须用，不允许整章纯文字。**

---

## 逐步揭示，连续 step 复用主构图

整页内容由**全局 `step` 计数器**驱动。step 是口播与画面实现的交接单位，不等于
一张新页面。先按 outline 的视觉步组搭建稳定主构图，再让连续 step 只更新
其中的节点、数据、重点或关系；只有内容关系或空间组织改变时才切换主构图。

设计每一步时心里要默念：**这一步演什么，下一步在同一构图里发生什么**。

**最重要的一条**：先判断内容关系，再选择状态动作。不要把所有卡片、轨道和
列表统一解释为 active / past / ghost。

- **真实顺序过程**：可以让当前步骤 active、已完成步骤 past、后续步骤 upcoming。
- **并列关系**：各项完成后保持等权；允许在一个 narration step 内依次呈现，
  但不能把最后出现的卡片留成“当前选中项”。
- **核心问题**：前提持续或弱化，问题成为视觉中心。
- **两栏对照**：保持两侧空间，通过权重与判断变化推进。
- **概念定义**：在固定结构中累计组装关键词、范围和组成部分。
- **图片阅读**：图片持续，读图注释或局部焦点迁移。

逐项揭示不要求重新构图，也不自动要求新 narration step。step 数来自批准口播；
一个 step 可以在同一主构图中依次完成多个内部动作并落到一个 semantic state。
相邻 step 也可以保持同一 semantic state，只更新说明或口播焦点。Courseplay-bound
mode 下，除 outline 已声明 accent-frame 或 custom-scene 外，禁止把内容项升级成
新 scene。

---

## 内容取舍：抓重点，不要原文搬运

Courseplay v2 是冻结兼容规则：`screen_source` 是必须处理的基线，继续使用现有
`validateScreenAdaptation`。Courseplay v3 改用下方“三源创作”：guidance 不是逐条
落屏清单，下游必须重新设计完整上屏内容，不新增 `screenContent`、来源登记或其他 IR。

视频是**音 + 画**：

- **口播**负责把信息线性讲清楚
- **画面**负责把节拍重点放大、节奏感拉出来

每个 step 屏幕上只挂这个节拍**最值得放大的 1~3 个东西** —— 一个
hero 标语 / 一个数字 / 一组对比 + 必要的视觉演示。

不要试图把原文每个字都搬上去。那是论文阅读，不是视频。

---

## 来源：普通项目双源，Courseplay v3 三源

> 普通模式的**节奏 / 顺序 / 节拍切分**跟 **`script.md` 口播稿**；Courseplay
> 则跟交接包中的 `narration.beats`，并以 `narration.authority=a_page.nx` 为口播权威。
> **画面细节 / 数据 / 引用 / 案例** 回 **`article.md` 原文章（如有）**抽；v2 以
> handoff 的 `screen_source`、`presentation`、steps、护栏和素材为准。v3 只读取
> 当前 packet，并综合 `screen_guidance`、`narration.beats` 与 `presentation`。

`outline.md` 已经在每章首段抽了「信息池」做参考。有 `article.md` 时，**实现
章节也必须回去翻本章对应段落** —— 那里有比口播稿更多的细节（具体数字、
引用原话、案例维度、出处时间）。Courseplay 没有 article 时，不得把缺失当成
阻塞，也不得自行补写事实；使用交接包中的 A-page、visual rough 与素材清单。

### Courseplay v3：三源创作（唯一详细规则）

v6 JSON 给出内容方向、重点、事实边界和 exact 义务；当前 A 的
`narration.beats` 提供可直接使用的具体素材；visual rough 投影到
`presentation`，提供配方、表达结构、媒体和关系载体。章节制作必须综合三者，
重新设计足以支撑当前页面的完整上屏内容。最终文字可以直接写在 JSX、局部常量、
数组、SVG 文本或 step 状态中；可以自愿使用局部内容对象，但不得把它升级成全局
`screenContent` 契约，也不登记逐条 guidance/Beat 来源。

允许的创作行为：

- 抽取、压缩、重组和部分复刻当前 A 的任意 narration beat；
- 改写、合并、拆分或展开 `reference` guidance；多个 G 可以合并，一个 G 也可
  分布到标签、数字、注释、关系图和终态判断；
- 使用文字、图形、路径、媒体和视觉关系共同表达 guidance；普通 S/G 不承担
  逐项落屏义务；
- 根据 visual rough、Outline 调度和实际构图决定是否显示独立标题区；
- 定义、数字、正式术语或引语可以较高比例复刻口播，不设置文本重合阈值。

禁止的创作行为：

- 引入当前 packet 外事实、借用其他 A，或改变数字、范围、极性、案例归属和
  `protected_relations`；
- 直接显示或改写泄漏 `silent_constraints`；
- 页面只剩标题、上位概括、通用标签、空语义槽或装饰性伪信息；
- 把整章口播一次铺满，或把每个 beat 逐句同步成字幕式 PPT；
- 为满足 guidance 人为建立 G→section、一 S 一槽或一 Beat 一段文字的机械对应。

`exact` 同时表示“必须可见”和“必须逐字保持”。每个 exact guidance 必须在当前 A
至少一个实际渲染 step 中完整、学习者可见，并保留必要上下文；不建立 S→step
映射，具体出现时机由 rough、Outline 和章节构图决定，并由契约/视觉 reviewer
验收。找到源码字符串不能证明可见，因此不实现 AST、词法或文本搜索门禁。

当前 A 的全部 beats 都属于合法事实素材池，但出现时机仍服从 Outline steps 与
visual rough 的揭示顺序。默认在对应内容讲到时再揭示；后续 beat 的结论、反转、
限制和终态判断不得无依据提前出现。只有 rough/Outline 明确要求整体底图、持续
展示、预告或提前建立时才可提前出现相关结构；已经建立的内容可以持续、弱化或
聚焦。最终 step 必须形成静音也能理解主要对象、关系和判断的页面终态。

> **如果你只用了口播稿的内容做章节** —— 屏幕等于把口播打字打了一遍
> —— 那就是 PPT，不是视频。
>
> 有原始文章就回原文抽细节；没有原文就只使用已批准输入，不编造来源。

---

## 字体 / 配色 / 动画 / 留白 —— 视频演示基本审美

视频观众离屏幕远、注意力浮动，所以：

- **字号要大** —— hero 文字至少 80px 起，远观也能看清
- **留白要多** —— 舞台四边都要让出大留白，画面不要塞满
- **配色要舒服** —— **颜色和字体家族必须用主题 token**（保证换主题不破）；
  字号 / 间距 / 时长这些章节按内容自由发挥（详见下方「代码层最小约束」）
- **动画要舒服 + 炫酷** —— 出现得干净利落，停下来不抢戏；炫酷靠
  **设计巧思**（内容驱动的演示动画），不靠**速度暴力**或**密集闪烁**

---

## 避免 AI 味

AI 生成的网页有几种共有的"视觉指纹"，**全部不要**：

- 紫粉 / 蓝紫对角渐变背景
- 圆角卡片 + 彩色左边框装饰
- 渐变按钮 + 大圆角药丸
- emoji 当图标用
- 假数据 / 假 logo / 假"X 万用户"
- 整章 N 步用同一种入场动画（全场 fade / 全场 blur）
- 每步都挂 ken burns / 光晕呼吸 / 持续闪烁
- 每屏右下角都挂 mono 角标 / 序号

缺的东西**承认缺** —— 用 placeholder 占位卡（一张写着"image · 16:9
描述"的卡片，按真实比例留位）。**不要**用 emoji 凑、不要找无关图凑、
不要编数字。**没有就承认没有**，比 fake 强一百倍。

---

## 框架已经搭好的部分（理解就好，不需重写）

- **16:9 固定舞台**：内容设计在 1920×1080 上，外层 transform scale
  缩到任何视口，外围 letterbox 留黑 —— **没有响应式断点**
- **舞台居中 + 大留白**：上下左右四边都让出至少 80px 的安全区
- **隐形进度条**：屏幕底部默认完全透明，鼠标悬到底部边缘才出现，
  支持点击跳转章节（录屏时摄像头看不到任何 chrome 控件）
- **全局 step 驱动**：点击舞台空白处 / 键盘 ←/→ 推进；章节是 `step`
  的纯函数，没有定时器、没有命令式状态

---

## 代码层最小约束

不能踩的红线，其它怎么写都行：

### Courseplay 持续场景模式

Courseplay-bound mode 使用同一 Scene 组件承载一个 A-page 的多个 beat：

```tsx
const stateByStep = [
  "systems-equal",
  "systems-equal",
  "systems-with-takeaway",
] as const;

export function A001Chapter({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) {
    return <StatementFrame>{statement}</StatementFrame>;
  }
  return <A001Scene state={stateByStep[step] ?? stateByStep.at(-1)!} />;
}
```

- `A001Scene` 始终保留 base-scene 的 SceneFrame、媒体区与主要槽位。
- `stateByStep` 显式把 narration step 映射到章节内 semantic state；允许重复。
- semantic state 描述稳定画面；建立、保持、补充、聚焦、更新和收束写在
  outline 的本步场景指令中。
- 禁止把 `step` 直接用作通用 active 索引，也禁止用 `visible = step + 1`
  统一解释所有页面。active / past / upcoming 只适用于真实顺序过程。
- accent-frame 使用低成本共享 StatementFrame 类结构，不借机新增复杂场景。
- custom-scene 只能实现 outline 已声明并在 Checkpoint Plan 确认的场景。
- `narrations.ts` 仍然一条 narration 对应一个 beat；beat 数可以大于 scene 数。
- step 数由批准口播 beat 决定；每个 base-scene step 显式映射一个结束时的
  semantic state。相邻 step 可以复用，因此 unique semantic state 数可以少于或
  等于对应 step 数；不预设每个 A-page 固定有几步或几个 state。
- 超过 10 秒的单一语义 beat 可以停留在同一 semantic state；时长本身不要求
  新增 state、复制 DOM 或切换 scene。
- 额外 base-scene 或 custom-scene 只能使用 outline 已声明、写明必要性并经
  Checkpoint Plan 确认的场景；不要为了让相邻 step 看起来不同而换场。

[`EXAMPLES/list-reveal/`](EXAMPLES/list-reveal/) 仅是“真实顺序列表”的持续场景
正例；并列卡片应参考 [`EXAMPLES/equal-group/`](EXAMPLES/equal-group/)，多个
step 可以共享同一网格和同一 semantic state。

### 必须用 token（换主题不破的底线）

新章节只使用下列标准 token。旧实例抽取的章节可能还写有
`--stage-bg` / `--stage-text` / `--stage-muted`；共享运行时已将它们映射到
`--surface` / `--text` / `--text-mute`，这是兼容层，不能作为新章节 API。

- **颜色**：`--shell` / `--surface` / `--surface-2` / `--surface-3` /
  `--text` / `--text-2` / `--text-mute` / `--text-faint` / `--rule` /
  `--accent` / `--accent-soft` / `--accent-glow` ——
  **禁硬编码 hex / rgb / 颜色名**
- **字体家族**：`--font-display-cn` / `--font-display-en` / `--font-body`
  / `--font-mono` —— **禁硬编码字体名**
- **主题性格签名**通过 primitive class 自动接入，**不要在章节 CSS 里
  重定义它们**：
  - `.hero-num`（hero 数字风格 —— 主题决定衬线 / 等宽 / 粗黑）
  - `.rule`（分割线 —— 主题决定 1px 实线 / 4px 实线 / 2px 虚线）
  - `.card`（卡片 —— 主题决定圆角 + 阴影性格）
  - `.stage-frame`（舞台底色 / 圆角 / 阴影 / 装饰图案 / vignette
    全自动，章节什么都不用做）

### 可硬编码 / 可 token，按内容自由（解锁章节自由设计）

- **字号**：想要 80px 就写 80px，想用 `var(--t-h1)` 也行
- **间距 / padding / margin**：按画面节奏写具体值
- **动画时长 / 缓动 / keyframe**：按动画意图写具体值
  （**节奏气质**参考 `theme.json` 的 `mood` —— 慢主题别写 200ms 的快动画）
- **边框宽度 / 非性格圆角 / 字距**：随手写
- **gap / grid 布局尺寸**：按画面构图写

### 其它工程红线

- 不用 `setTimeout` / `setInterval` 驱动动画 —— 用 CSS keyframes
- 章节内的可交互元素（按钮 / 自定义控件）加 `data-no-advance`，
  否则点了会被舞台误推进 step
- 章节代码物理隔离：每章独立文件夹、独立 CSS 类前缀，不跨章 import
- **每章必须有 `narrations.ts`**（与 `<Chapter>.tsx` 同目录）：
  - 数组长度 **=** 章节渲染逻辑支持的 step 总数；既可以来自条件分支、
    数组映射或状态机，也可以来自传给持续 Scene 的 `phase`
  - 每个元素 = 一个 string，该 step 要播的口播文本（普通模式来自 `script.md`
    对应段；Courseplay 逐项使用交接包 `narration.beats`，不得重新切分或改写）
  - 完全无音频的过场 step 用空串 `""`，Auto 模式会按字数估时撑过
  - 这是**音频合成 + Auto 模式自动推进的唯一真相源**，写错或漏写
    会让录屏对不上嘴
- **动画时长必须 ≤ 该 step 的口播时长**——Auto 模式严格按音频结束推进，
  没有"等动画跑完"的兜底。动画太长 → 三选一：**写更长口播 / 拆 step
  / 调动画速度**。详细机制见 [`AUDIO.md`](AUDIO.md)

---

## 完工自检（写完每章**强制**执行，不可跳过）

> ⚠️ **硬性流程**：章节实现完成后**必须**走完下面的自检 → 修复 → 汇报
> 三步。**禁止**"实现完成 → 直接汇报给用户"。
>
> 所有项目继续使用独立 reviewer → subagent → 自检的降级顺序，并在推进前
> 修复 fail。模式 A 逐章交给用户确认；模式 B 顺序完成后统一验收。

写完一章后按职责逐项过；视觉项由当前 visual owner 在浏览器中核对：

- [ ] **每章至少 1~2 处 CSS / SVG / Canvas / JS 视觉演示** —— 没有 = 回去补
- [ ] **不同 step 的主导动作不一样** —— 全章一种动画 = 回去重做
- [ ] 字号大、留白舒服、配色舒服
- [ ] 清单 / 列表按“独立口播焦点 + 独立视觉槽位”逐个揭示；同一槽位的
      组合短语可共同出现，除明确换场外复用同一布局与槽位
- [ ] 普通项目回原文章抽取了画面细节；Courseplay v3 则以三源重组出足够具体的页面信息，不以“字数多于口播”为门禁
- [ ] 没有紫粉渐变 / 圆角彩色边框 / emoji / 假数据 / 假 logo
- [ ] 缺的素材用 placeholder，不是 fake
- [ ] **颜色和字体家族全部走 token**（无硬编码 hex / 字体名）；hero 数字
      / 卡片 / 分割线 / 舞台用 primitive class 接入主题性格 —— 这两条不
      达标 = 换主题就破
- [ ] 章节交付时**主动告诉用户**："本章还缺这些素材"
- [ ] 禁止出现小号字体，大量纯文字（出现后必须回去改）
- [ ] 禁止出现任何形式的页眉页脚，仅展示关键内容（出现后必须回去改）
- [ ] 根级 `pnpm run episode:check`、`pnpm run typecheck`、`pnpm run lint` 通过；
      完整章节或共享改动再运行 `pnpm run build`
- [ ] 章节代码物理隔离：独立 CSS 类前缀（`.cd-` / `.mg-` / ...），
      未跨章 import；只在实例 `src/entry.tsx` 注册章节，未修改共享运行时
- [ ] **`narrations.ts` 存在**且 `narrations.length` === 章节代码支持的
      step 总数（无论使用分支还是持续 Scene 的 `phase`；不一致 = Auto
      模式录屏会错位）
- [ ] outline 的视觉步组与实现一致：连续 step 复用主构图，只有内容关系变化才切换页面
- [ ] 普通模式每条 narration 与 `script.md` 对应段落语义一致；Courseplay
      narration 与交接包 `narration.beats` 逐项一致，拼接后与 `a_page.nx` 一致
- [ ] `narrations.ts` 改动后运行 `pnpm audio:extract -- --episode <id>`，核对
      `audio-segments.json` 的章节、step 与文本
- [ ] **每个 step 的视觉动画时长 ≤ 口播时长**（口播 `字数 ÷ 4` ≈ 秒数）—— 
      超出会被 Auto 模式当场切断，动画演到一半就跳下一步

Courseplay-bound mode 还必须检查：

- [ ] v3 章节综合了 `screen_guidance`、当前 A beats 与 `presentation`，页面不是逐 S/G 清单，也没有新增内容 IR
- [ ] v3 每个 `exact` 在至少一个实际 step 中完整逐字可见且有必要上下文；这是渲染审查，不是源码搜索结论
- [ ] v3 没有 packet 外事实、silent constraint 直接或改写泄漏，也没有提前显示后续 beat 的结论/限制
- [ ] v3 最终 step 静音可理解主要对象、关系与判断；页面不是上位标签、空槽或逐句字幕
- [ ] 每个 A-page 的 base-scene 数与 outline 声明一致
- [ ] narration step 与 semantic state 映射符合 outline；state 可以重复，没有机械统一步数
- [ ] 连续 step 默认复用同一 SceneFrame、媒体区、网格和主要 DOM 位置；场景指令
      能回答新增、保留、弱化、聚焦、更新或收束了什么
- [ ] semantic state 描述稳定画面，不是固定动作标签；并列关系没有被实现为轮流 active
- [ ] 持续元素没有无理由消失或整体重排
- [ ] outline 声明 `可见标题：none` 时，页面不含标题区；未自行恢复标题，
      也未为顶替标题而新造判断文案或槽位
- [ ] 没有给不同页面套同一组 kicker、页码、masthead、辅助句和底部 foot
- [ ] Accent frame 保持低成本，未承载新的复杂卡片、图表、媒体或关系演示
- [ ] 没有实现 outline 未声明的 custom-scene

任一未过 → 回去改。**不要**"先放着以后修"。
