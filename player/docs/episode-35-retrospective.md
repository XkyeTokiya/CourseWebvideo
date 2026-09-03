# Episode 35 视觉制作复盘

> 日期：2026-09-03 · 主题：episode-35（标识载体选型）的视觉实现——subagent 提示词工程、视觉制作流程与验证有效的构图手法。
> 背景：11 个正文章节由第 1 章（主线程）+ 5 个并行 subagent（各 2 章）完成，成品视觉质量超预期。本文沉淀"为什么效果好"，供后续 episode 直接复用。

## 一、视觉制作流程（实际跑通的顺序）

```text
1. 读三源：A-page nx（口播权威）+ visual rough（配方/骨架/媒体）+ 证据目录
2. 写 outline 的"视觉层"：每页 base-scene / 配方 / 结构指纹 / semantic states
   / 视觉步组表（step → state → 场景指令）—— 这是后面一切视觉实现的规格书
3. 主线程写第 1 章：token 用法、placeholder 规范、动画节奏的唯一风格锚点
4. 并行派发：每个 subagent 认领 2 章，prompt 规格见第三节
5. 主线程校验收口：episode:check / typecheck / build + 汇总缺素材清单
```

关键认知：**视觉质量的大头在 outline 的视觉层，不在章节代码本身。** 章节代码只是把"step → semantic state → 场景指令"翻译成 DOM；规格写得越具体（哪个槽位、什么关系、哪一步谁出现谁退后），agent 的自由发挥就越集中在"怎么画好看"上，而不是"画什么"。

## 二、outline 视觉层怎么写（效果最大的四个字段）

1. **结构指纹**（如 `textbook-image | process-band ×6 | key-points ×3`）：一眼锁定构图骨架，agent 不用猜版式；相邻页指纹不同，整集节奏自然错开。
2. **semantic state 用"结束时的稳定画面"命名**（`question-dominant`、`combo-concluded`、`reason-traceable`）：agent 实现时写成 `states[step] ?? last` 数组映射，天然规避"step 当 active 索引、每步换一屏"的 PPT 化。并列关系的页面 state 全程同名，卡落位后等权、无选中项——这正是反 AI 味的关键。
3. **场景指令动词化**：每步写清"建立 / 保持 / 依次落位 / 退后 / 收束"了什么。如"保持三卡等权，牵连收束条就位：任一单项变化牵动整体"。agent 把动词直接翻译成 CSS transition 目标态。
4. **视觉演示建议写进信息池/步组**，但只给意图不给实现：如"SVG 圆柱面刻码 + 曲率形变示意""工艺带扫光""问题卡内两步检查依次呈现"。agent 据此自选 SVG/CSS 手段，才有真演示而不是文字堆。

## 三、subagent 提示词模板（本次实际使用结构，5 个 agent 零返工）

每个 prompt 固定七段，全部内联（agent 不需要回头翻 A-page JSON）：

1. **规范输入**（只给路径让 agent 自己读）：
   - 第 1 章 tsx + css（代码风格锚点：states 数组映射、token、placeholder、keyframes 节奏）
   - outline.md 对应两节（结构指纹 / states / 步组 / 信息池）
   - CHAPTER-CRAFT.md（Part 0/5/6/7）
2. **硬规则清单**：目录与命名（`<NN>-<id>/`、组件名、CSS 前缀如 `pr-`）；narrations.ts 逐字使用给定 beat、不得改写重切；颜色只用 token（`--theme-*` 系列），字体只用 `--font-*`，卡片用 `.card/.card-glass/hero-num` primitive；禁 setTimeout、禁 emoji/紫粉渐变/假数据；动画时长 ≤ 字数/4 秒。
3. **逐字 beat 文本**（N 条，对应 N steps）——防止 agent 自行切分导致音画错位。
4. **states 数组逐字给定**（与 outline 视觉步组一致）。
5. **构图说明**：标题判断方向 + 各槽位内容 + 哪步出现/退后/收束 + 媒体（无媒体则明说"无媒体需求"，有则给 placeholder 文案）。
6. **视觉演示建议**（1~2 处/章，只给意图）。
7. **信息池护栏**：把"可能变化不写成失效""不出现数字""不画回流线"等 silent constraint 逐条列出——这是 agent 最容易越界的地方，必须显式给。
8. **收尾要求**：跑 `pnpm run typecheck`，只许改自己创建的文件；返回文件清单 + 结果 + 缺素材清单。

经验值：**每 agent 2 章是合适的批次**——上下文足够聚焦，单 agent 时长可控（本次约 40–50 分钟/agent），5 个并行互不依赖。

## 四、验证有效的视觉手法（按页面配方归类）

- **时间锚开场（A001）**：SVG 七格 QR 码做"工艺前干净 / 工艺后褪色残缺"两态 + 循环扫描线；问题句用 card-glass 悬浮 plate 从右移入、前提区同步降透明度——"前提弱化、问题成为重心"的 prem-to-question 机制有了具体落点。
- **并列卡（A002/A008）**：落位前用虚线 ghost 槽位（"候选·待落位"），落位后等权、无当前选中项；卡内各嵌一枚迷你 SVG（条码竖条逐根弹出 / 激光光束+火花脉冲 / 扫描锥呼吸）让三卡"各自会动"而不是统一 fade。
- **读图页（A003/A004）**：左图右栏持续构图；图形侧承担演示（参数化齿轮逐齿组装、激光刻印点阵沿曲率弧线逐格形变），文字侧洞察栏逐拍落位——图在"演"，字在"讲"，分工明确。
- **归因/关联页（A005）**：一个大 SVG 当共享锚（圆柱面 + sin 弧映射的刻码形变 + 反光光柱 clip 扫描），三组关联条逐组叠加，末拍锚区退后、归因句 card-glass 收束。
- **顺序过程（A009/A010）**：步骤带用真实 active/past/upcoming 三态；台账行逐行落位 + 行尾"可回查理由"列填充——真实顺序才用三态，这条边界守住了。
- **对照页（A007/A011）**：先单侧就位、另一侧弱化占位，再补齐成等权，最后底部论点条/pivot 区收束重心——对照关系靠权重变化推进，不轮播。

通用手法（全集复用，效果稳定）：

- 落位动画统一 `translateY + scale(0.94) → none`，overshoot 缓动，stagger 用 CSS 变量 `--xxx-i` 乘延迟；单元素 ≤600ms，整步动画链 ≤2.6s（远低于最短口播 ~5s，Auto 模式不会被切断）。
- 判断收束一律 card-glass plate + 大号 display 字（72–84px）+ 强调色 `em`，同一集内不重复同款 kicker/角标。
- 主题性格全走 primitive class（`.card` 硬投影、`.hero-num` 等宽、`.rule` 虚线、方格纸背景由 stage 自动带），章节 CSS 只写布局与动画。

## 五、handoff 未采用与"等价隔离"的实现（流程思考）

本次制作全程未调用 `pnpm courseplay:handoff`。bound-mode 明确 handoff 是可选打包工具，直接提供等价输入不构成停止条件，因此这是流程取舍而非违规。原因：

1. 主线程读完整个 A-page JSON 与 rough 后写 outline，信息已在上下文里；handoff 的价值是给没有全局上下文的消费者打包隔离输入，而主线程统一派发时这个环节由 prompt 内联替代了。
2. 11 页 = 11 次 handoff 生成与校验往返，对"主线程统一派发"的流程是重复劳动；对逐章交接的流程才有意义。
3. 内联 prompt 在打包时做了一轮"消化"：guidance 被翻译成构图指令、silent_constraints 被翻译成护栏清单，agent 拿到的是规格而非原始素材。代价是消化质量完全依赖主线程——**outline 写得糙，内联会把糙放大**，所以这套流程的质量闸门始终是 outline 的视觉层。

但 handoff 的核心思想——"给消费者一份隔离的、最小化的当前章节上下文"——实际上以另一种形式被执行了：

- **outline.md 没有整份发给 agent，而是按节指针分发**：每个 prompt 只指定"读 outline.md 中「## 4.」与「## 5.」两节"，agent 自己按节读取。等价于把 outline 当成了自带目录的打包格式，用"路径 + 节标题"代替了"复制内容进包"。
- 同样按指针分发的还有：第 1 章 tsx/css（风格锚）、CHAPTER-CRAFT.md（规则）、A-page JSON（只让 agent 翻自己页的 nx 与 guidance）。

两种打包方式的分工由此清晰：**prompt 内联的是"消化后的规格 + 逐字 beat"（少而精，不容许歧义），文件指针指向的是"背景与规范"（多而稳，agent 按需读）**。这实际上是 handoff 模式在多 agent 场景下的轻量替代，省去了生成/校验包的往返，同时保住了上下文隔离的效果。

## 六、流程教训（与视觉相关的）

1. Checkpoint Plan 仍是硬节点——视觉规格（outline 视觉层）最好在派发前让用户过目，构图方向错了返工成本最高。
2. entry.tsx 引用了未完成章节会导致整页加载失败（Failed to fetch dynamically imported module）。并行期间先只注册已落盘章节，agent 完成后再补注册。
3. 首章完成即把 project.json 置 in-progress（可预览门禁），交付再置 ready。
4. 素材缺位：M001–M004 用 placeholder 卡（标注尺寸 + 内容描述），outline 素材清单标注"待提供"，交付时单独列缺素材清单——不找无关图凑，不编数据。
