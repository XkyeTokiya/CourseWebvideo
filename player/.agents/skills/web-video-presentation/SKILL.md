---
name: web-video-presentation
description: 把文章或口播稿制作成player/ 子项目内的 Web Video Studio 内可播放、可录屏的点击驱动 16:9 网页演示，可选合成口播音频。流程：原始文章 → 一次产出 script.md + outline.md → 用户一次对齐稿子、outline、主题、素材和开发模式 → 逐章开发 → 可选音频与录屏。新实例必须使用 episodes 下的实例目录、根级 pnpm episode:new 与共享旧播放器运行时，禁止生成独立 Vite 项目。每次点击推进一个口播节拍；连续 step 在同一视觉步组内复用主构图，只更新局部状态。主题由 project.json.theme 动态注入。凡用户要求把文章或口播稿做成网页视频、动态 PPT、交互式解说或录屏课程，均应使用本 Skill。
---

# Web Video Presentation

把一篇文章或口播稿，一步步做成可录屏的"伪装成视频的网页"，可选合成
口播音频。产出物 = player/ 子项目内的 Web Video Studio 中的一个 `episodes/<episode-id>/` 实例 + 按章节切分的可选音频。每期默认包含一个独立封面章节：封面固定展示 15 秒，封面主标题与副标题独立于口播稿设计。

## 适用场景

- "我有口播稿 / 一篇文章，帮我做成视频" —— 口播驱动的内容
- 想做 "动态 PPT"
- 16:9 横屏录屏，大字、留白、每屏都要有动效
- 教学 / 产品演示 / keynote 想要电影感
- B 站 / YouTube /抖音视频内容

本 Skill **以方法论 + 协作流程为核心**。根级共享运行时提供舞台、播放器、
token 和原语；每个实例只维护内容、章节、主题选择与音频。不要复制共享
运行时，也不要从旧模板创建第二套播放器。

---

## 工作流总览

```
Phase 1   内容编写
   1.1  识别用户输入
   1.2  一次产出 script.md + outline.md
        （口播稿 + 开发计划）
   ▼
[Checkpoint Plan]      ← 必须停。一次对齐 5 件事：
                         稿子 / outline / 主题 / 素材 / 开发模式
   ▼
Phase 2   网页开发
   2.1  创建 Studio 实例（按选定主题，默认生成 00-cover 封面章节）
   2.2  第 1 章 = 主线程 + 完整版本（强制 anchor）
        ▼
        [硬节点] 用户验收第 1 章 ← 不可跳过
        ▼
   2.3  第 2~N 章（按选定模式：A 逐章 / B 顺序 / C 并行）
   ▼
[Checkpoint Audio]     ← 必须停。是否合成音频
   ▼
Phase 3   音频合成（可选）
   ▼
Phase 4   录屏 + 后期
```

工作目录约定（agent 在用户当前目录下创建 / 编辑）：

```text
episodes/<episode-id>/
├── project.json          # Agent 维护的短状态文件：planned / in-progress / ready
├── article.md            # 用户原稿，如有；开发阶段画面信息源
├── script.md             # 必有：保持原文语言的平台化口播稿
├── outline.md            # 必有：章节、视觉页面与 step 映射
├── approved-spoken-text.txt        # Courseplay 声明 approved_text 时必有
├── <episode-id>-a-page.json        # Courseplay 正式输入
├── <episode-id>-visual-rough.md    # Courseplay 正式输入
├── .handoffs/<Axxx>.json           # Courseplay 按需生成，Git 忽略
├── audio-segments.json   # 根级 audio:extract 生成
├── media/audio/          # 可选音频，按 chapter/step 组织
└── src/
    ├── entry.tsx         # 导出 id / title / CHAPTERS，供 Studio 动态加载
    ├── data/cover.json   # 封面内容；可使用当前项目内容或可选封面内容库
    └── chapters/<NN>-<id>/
        ├── <Chapter>.tsx
        ├── <Chapter>.css
        └── narrations.ts # ★ step 数 + 口播文本的唯一真相源
```

实例不再包含 `package.json`、`pnpm-lock.yaml`、`node_modules`、`vite.config.ts`，也不单独启动 Vite。统一进入 player/ 目录后运行 `pnpm dev`。`player/output/`（已删除）与历史归档 仅作历史资料，不导入新 Studio。

> **关键**：`narrations.ts` 是 step 数和音频合成的**唯一真相源**。
> 章节组件可到达的最大 step + 1 必须等于 `narrations.length`；实现可以使用
> 条件分支、数组映射或状态机，不能只依赖 `if (step === N)`。这保证 script /
> outline / 章节代码 / `entry.tsx` / 音频文件不会漂。

---

## 硬性自检协议（贯穿整个 Skill）

下面三个产出，每一个**完成后必须走自检 → 修复 → 再汇报 / 推进**：

| 产出 | 自检清单出处 |
|---|---|
| `script.md` | [`SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) 三层自检（形式 / 风骨 / 念出来） |
| `outline.md` | [`OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) 自检；Courseplay 模式另读 [`COURSEPLAY-OUTLINE-REVIEW.md`](references/COURSEPLAY-OUTLINE-REVIEW.md) |
| 单章实现完成 | [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 完工自检 |

**执行方式**（按能力降级，**优先用更隔离的方式**）：

1. **Agent Teams（最优）**：开一个独立的 reviewer agent，给它"产出文件
   路径 + 对应清单 + 关键上下文"，让它逐项核查并**严格汇报结论**
   （哪几条 pass / 哪几条 fail + 证据 + 改写建议）。
2. **subAgent（次优）**：没有 Teams 能力但能开 subagent 就用 subagent
   走同样流程。
3. **自检（兜底）**：当前 agent 都没有上述能力，就自己**严格逐项**
   核查 —— 不允许目测一遍就放行。

Courseplay outline 的作者自检始终必须执行；独立 reviewer 改为按需触发：

- `review_mode: self`（默认）：作者按 `COURSEPLAY-OUTLINE-REVIEW.md` 自检。
- `review_mode: independent`：用户或自动化流程明确指定时，才把审查协议和
  必要输入交给 reviewer agent/subagent。
- 请求 independent 但无可用 reviewer 时回退到 self，并在 Checkpoint Plan
  披露。Reviewer 只报告，原作者负责修正。

**铁律**：拿到结论后先按 fail 项把产出改完，再向用户汇报“做完了 +
自检结论 + 改了什么”。直接拿原始结论汇报但不修复属于违规。

---

## 各阶段文件读取指南

不同阶段读不同的文件。**长会话里 agent 容易遗忘原则**，特别是
Phase 2.4 的"实现单章"会重复 N 次 —— 每次都要回看核心约束。

| 阶段 | 必读（每次都看） | 一次性看完 / 按需查 |
|---|---|---|
| Phase 1.1-1.2 内容编写 | `references/SCRIPT-STYLE.md` + `references/OUTLINE-FORMAT.md` + `article.md`（用户原文，如有）；检测到正式 Courseplay 输入时另读 `references/COURSEPLAY-BOUND-MODE.md` 与 `references/COURSEPLAY-STATE-MECHANISMS.md` | Courseplay 自检按需把 `references/COURSEPLAY-OUTLINE-REVIEW.md` 交给 reviewer |
| **Checkpoint Plan 选主题** | —— | `themes/*/theme.json`（动态读全部，列清单 + `bestFor` 推荐 + `descriptionZh`）；`references/THEMES.md`（用户想了解主题系统时） |
| Phase 2.1 脚手架 | —— | SKILL.md 本节看一次 |
| **Phase 2.4 实现单章（×N 次，被 2.2 / 2.3 调用）** | **`references/CHAPTER-CRAFT.md`** 单一创作入口 + 当前主题 + 当前 outline 章节块 + article 对应段落（如有）+ 素材清单；Courseplay 可使用当前 `.handoffs/<Axxx>.json` + `references/COURSEPLAY-BOUND-MODE.md` + `references/COURSEPLAY-STATE-MECHANISMS.md`，或直接提供等价的当前章节输入 | `references/EXAMPLES/`（结构示意，不是抄袭模板）；`references/THEMES.md` 完整 token 契约 |
| Phase 3 音频合成 | `references/AUDIO.md`（含 narrations.ts → segments.json → 任意 provider 流程，内置 minimax / edge / cosyvoice / openai） | `docs/tts-providers.md`（换 provider / 自带 TTS 时） |
| Phase 4 录屏 + 后期 | `references/RECORDING.md`（含 `?auto=1` 自动录屏） | —— |
| 选 / 造 / 切主题 | —— | `references/THEMES.md` |

> 通用项目写章节时只读一份 `CHAPTER-CRAFT.md`；Courseplay-bound mode
> 额外读取 `COURSEPLAY-BOUND-MODE.md` 与 `COURSEPLAY-STATE-MECHANISMS.md`。十条原则 / 开工 self-prompting /
> 决策树 / 反 AI 味反模式 / 完工自检仍统一由 `CHAPTER-CRAFT.md` 承载。
> `EXAMPLES/` **不是必读** —— 先按内容自由设计，卡壳才翻（按 anchor
> 翻"形"，不要照搬）。

---

## Phase 1 —— 内容编写（一次产出）

### 1.1 识别用户输入

| 用户给的东西 | 该做的 |
|---|---|
| 同时提供正式 `courseplay-a-page/v6` + `courseplay-visual-rough/v3` | 进入 Courseplay-bound mode；v6 `screen` 是 guidance，当前 A 口播提供具体素材，rough 提供表达结构。三源创作完整规则只读 `references/CHAPTER-CRAFT.md` |
| 同时提供正式 `courseplay-a-page/v5` + `courseplay-visual-rough/v2` | 进入冻结兼容的 Courseplay-bound mode，继续使用 v2 `screen_source` 基线与现有 screen adaptation review；用于 ep04 等既有生产 |
| Courseplay 输入不完整，或当前 A-page 缺少可用口播/页面指导 | 报告缺少的内容并请求补充；只要已有等价的当前章节输入，就可继续制作。版本、存放路径和 script 排版只在显式调用 handoff 时按工具契约检查 |
| 原始文章（书面语 / 公众号 / 论文 / 博客） | 一次产出 `script.md` + `outline.md`（1.2），过 Checkpoint Plan |
| 直接的口播稿 / 视频脚本 | 落盘成 `script.md`，一次产出 `outline.md`（1.2 简化版），过 Checkpoint Plan |
| 啥都没有，只说"帮我做个 X 主题的视频" | **反问**：先给一段素材或大纲。Skill 不替用户构思内容 |

### 1.2 一次产出 script.md + outline.md

**两份产出物在一次思考中完成**：

1. **生成 `script.md`**：普通项目按 [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md)
   的规则把 article 转成保持原文语言的平台化口播稿，并保留已有 `article.md`。
   Courseplay 不改写口播，而是按 A-page 顺序从各页非空 `nx` 无损派生 script；
   新写文件推荐每页使用 `## Axxx · <页面标题>`，页内以 `---` 分 Beat；标题和
   metadata 不进入口播。`approved_text` 如有只用于交叉核对。显式调用 handoff
   时按工具要求准备根级文件和可解析的 A-page 标题；不调用时可直接提供等价的
   当前章节输入，不因存放路径或纯排版差异停止制作。
2. **生成 `outline.md`**：按 [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md)
   规则切章节、确定 narration beat、绑定 base-scene、声明语义关系、开放式关系
   机制、semantic state 与场景例外，
   并在每章首段抽**信息池**。

Courseplay-bound mode 额外遵守 [`COURSEPLAY-BOUND-MODE.md`](references/COURSEPLAY-BOUND-MODE.md)：
A-page 顺序默认对应 chapter 顺序，每个 A-page 默认一个持续 base-scene；narration
beat 按 CLAUDE.md §1.4 Beat 切分规则从 visual rough 的 G 组锚定（默认 = N，
偏离须标注合并/扩张/并入触发条件）并决定 step 数，semantic state 描述稳定画面并可跨 step 重复；关系机制不决定
step 或 state 数，不使用固定全局 state 枚举；accent-frame 允许低成本全屏强调；custom-scene 必须写
必要性。Courseplay 字段只追加场景绑定，不替代通用封面、信息池、时长摘要
或素材清单。A-page / visual rough 决定章节边界、语义、页面配方、骨架与媒体资格；
outline 决定持续构图、结构指纹、内容槽位、每步场景指令与场景例外；chapter agent 决定组件、
CSS、动画和具体视觉实现；`narrations.ts` 是运行时 step 数与 TTS 文本的最终真相源。

**默认封面规则**：每期自动生成 `00-cover` 封面章节，只有 1 个 silent step，Auto 模式固定保留 `15000ms` 后推进；手动模式仍可点击或按键推进。封面不计入正文口播节拍，不进入 TTS。

封面内容落在实例内的 `src/data/cover.json`。`episodes/_shared/covers/` 是可选的封面内容库：
存在匹配文件时可以复用，也可以使用用户提供、当前实例已有或根据当前项目编写的
封面内容；内容库缺失或与实例文件不同都不阻止章节制作。不要从无关 episode 或
历史 `.archive/` 猜测封面。`episode:new` 生成的默认 JSON 是可继续编辑的结构占位。
组件必须显式映射 `course`、`module`、`task`、`point`、`lede`、`chips`，并忽略
JSON 的 `style` 字段。JSON 只提供内容，不决定视觉；视觉由实例当前主题决定。
`industrial-clarity` 与 `active-identification-note` 分别对应 `base` 与 `note` 语义。

`point.title` 是主标题；源 JSON 没有 `subtitle` 时，使用 `lede` 作为封面副标题说明，不从正文第一句机械截取。

**outline 的边界**（关键）：

| outline 必须写 | outline 不要写 |
|---|---|
| 章节切分 / 每章 step 数 / 估时 | 具体动画类型（blur clear / wipe / 弹簧） |
| 每步屏幕内容（hero / 数据 / 标语 / 列表项） | CSS 实现手段（filter / SVG / clip-path） |
| 章节级**信息池**：普通项目从 article 抽数字 / 引用 / 案例 / 标签；Courseplay 按 packet 指导组织 | 时长数值（不写 ~2.5s / 80~120ms） |
| 步级关系名前缀（"反差对照" / "递进列表" / "金句" 等可选 hint） | 持续微动 / 错峰量等微观节奏 |

> **outline 不写动画的理由**：写死动画 = chapter agent 退化为翻译机；
> 留白让 chapter agent 在每步开工时按 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
> 的"内容驱动决策树"自由设计，才有真正的视频感。详见
> [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) Part 0 原则 7。

**落盘后必须先走自检再进 Checkpoint Plan**：按上文「硬性自检协议」分别
对 `script.md` / `outline.md` 执行并修复。Courseplay outline 额外按
[`COURSEPLAY-OUTLINE-REVIEW.md`](references/COURSEPLAY-OUTLINE-REVIEW.md)
审查；默认 `review_mode: self`，只有调用方明确要求才派 independent reviewer。

---

## Checkpoint Plan —— 5 件事一次对齐（**硬节点**）

`script.md` + `outline.md` 写完后必须停下来。**用户在这一个节点同时确认
5 件事**。

### agent 此时要做的预备工作

1. 读所有 `themes/*/theme.json` 拿 `nameZh` / `descriptionZh` / `bestFor`
   / `mood` —— **不要硬编码清单**
2. 根据 `script.md` 的内容类型 / 关键词 / 语气，**主动**从主题里挑 2~3
   套**最匹配的推荐**（匹配 `bestFor` 字段）
3. 扫一遍 `outline.md` 末尾"素材清单"部分

### 总结模板（骨架，agent 按情况填充）

```
内容计划写完，产出文件：
  📄 article.md     {若用户给原文则保留}
  📄 script.md      {X} 字 / ~{T} 分钟
  📄 outline.md     {N} 章 / {M} 步 + 每章信息池 + 末尾素材清单

章节速览：
  1. <id>     <章节标题>    <S> 步 ~<T>s
  2. ...

{Courseplay-bound mode 追加：
视觉制作规模：
  Base scenes：<N>
  Accent frames：<K>
  Custom scenes：<C>
  Narration beats：<M>

请重点确认：哪些强调句值得独立全屏、custom-scene 的必要性，以及每个
A-page 是否保持一个持续视觉框架。不要把 narration beat 数称为页面数。}

接下来一次对齐 5 件事：

  1. 稿子 (script.md) 要不要改？
     可以直接编辑文件，或口头告诉我修改方向。

  2. 开发计划 (outline.md) 要不要改？重点看：
     - 章节切分 / step 数 / 估时是否合理；普通项目可参考每章 30~60s，Courseplay
       项目以批准口播的语义完整性、独立焦点和视觉承载能力判断，不因超过 60s
       或 step 数不同而自动否定
     - 每步屏幕内容是否清晰
     - 普通项目检查每章「信息池」是否有足够 article 细节；Courseplay v3 检查 guidance、beats 与 presentation 是否足以支撑页面创作
     - 末尾素材清单是否完整

  3. 选哪个主题？我的推荐：
     ★ <推荐 1：nameZh (id)> — 因为 <bestFor 命中>；<descriptionZh 摘要>
     ★ <推荐 2 / 推荐 3>
     其它可选：<剩余主题，nameZh + 一句话>
     也可以让我帮你做新主题（详见 references/THEMES.md）。

  4. 真素材怎么准备？粗看本视频要的图：<列粗略清单>
     a) 我从 <现有素材路径> 帮你挑   b) 你自己提供   c) 全部 placeholder

  5. 开发模式选哪个？

     **第 1 章无论哪种模式都必须主线程做完 + 用户验收**（强制 anchor）。
     差异在第 2 章及之后：

     A) 默认 · 逐章确认（推荐）
        每章做完都暂停验收 → 风险可控 / 节奏最稳
     B) 第 1 章后顺序开发（不并行）
        第 2~N 章主线程顺序做完后统一验收 → 速度中 / 适合 agent 不支持并行
     C) 第 1 章后并行开发（subagent）
        第 2~N 章用 subagent 并行 → 最快 / 用户控并行数（一次几章）
        ⚠️ 风格各章会有差异（这是预期，主题禁区兜底）
```

收到反馈后：
- 稿子 / outline 要改：直接编辑文件，编辑完 ping 一次（或口头描述 agent 改）
- **主题必须明确**才进入 Phase 2。用户说"主题你帮我选" → 取你推荐的第 1 个，
  **告诉用户你选了什么、为什么**，给反悔机会
- 模式选定 → 进 Phase 2

---

## Phase 2 —— 网页开发

### 2.1 创建 Studio 实例

从player/ 或 monorepo 根目录执行跨平台 Node 入口，不再运行 Bash 脚手架，也不为每期安装依赖：

```powershell
pnpm episode:new -- --id <episode-id> --title "<标题>" --theme <主题-id>
pnpm dev
```

`episode:new` 会验证主题是否真实存在于 `themes/<id>/`，并创建 `episodes/<episode-id>/`。实例直接使用共享的完整旧播放器运行时，章节继续按旧契约导出 `CHAPTERS: ChapterDef[]`；Agent 无需学习另一套章节 API。

> 自定义主题 → 先按 [`references/THEMES.md`](references/THEMES.md) 的“创作新主题”流程创建 `themes/<my-theme>/theme.json + tokens.css`，再传 `--theme=<my-theme>`。Studio 会在构建时发现全部主题，并按 `project.json.theme` 动态注入对应 token。

实例创建器默认生成 `00-cover`、作为结构占位的 `src/data/cover.json` 和
`src/entry.tsx`。可按当前项目需要编辑占位 JSON，或从可选的 `episodes/_shared/covers/`
内容库复用匹配封面；封面内容准备不作为章节推进门禁。
封面组件显式映射内容字段并忽略 `style`；封面保持 `narrations = [""]` 与
`stepDurationsMs = [15000]`。实现首章后将 `project.json.status` 更新为
`in-progress`，Studio 即可预览。

**Courseplay 单章交接包**：需要为主线程或 subagent 生成隔离的当前章节上下文时，
可以执行：

```powershell
pnpm courseplay:handoff -- --episode <episode-id> --a-page <Axxx>
```

handoff 对 outline 的纯排版差异保持兼容：章节标题和 step 估时可使用 ASCII 或全角
括号；已有 A-page 映射行末尾的单个括号附注（如 callback）也不会被误判为缺失映射。
新写 outline 仍优先让 A-page 映射独占一行，callback 等元数据另起字段；不要为修复
这类 handoff 错误改写批准口播内容。

生成的 `.handoffs/<Axxx>.json` 可作为 Courseplay Phase 2 的紧凑输入。v2 包继续提供
`screen_source` 冻结基线；v3 包提供准确 `narration.beats`、`screen_guidance`、
`presentation`、结构化 `steps`、关系、护栏和素材。章节 Agent 只读该包、`COURSEPLAY-BOUND-MODE.md`、
`COURSEPLAY-STATE-MECHANISMS.md`、`CHAPTER-CRAFT.md`、目标章节代码和必要的第 1 章
代码风格参考；使用该包时不必再把完整内容源加入章节上下文。
`narration.authority` 指向 `a_page.nx`（fixture-only 候选除外），`narrations.ts`
必须逐 Beat 使用这些文本。生成或 `--check` 失败时报告当前输入问题，不从历史章节猜测补齐。
v2 继续要求处理全部 `screen_source`。v3 不要求普通 S/G 逐项落屏，也不登记
guidance/Beat 来源；必须综合 guidance、当前 A beats 与 presentation 重新设计完整
上屏内容。不得引入 packet 外事实、改变数字/范围/极性/归属/关系、泄漏
`silent_constraints` 或提前揭示后续 beat。详细且唯一的三源创作规则见
[`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md#courseplay-v3三源创作唯一详细规则)。

### 2.2 第 1 章 —— 主线程 + 强制验收

**核心**：第 1 章 = 完整版本一次到位（节奏 + 视觉 + 真素材齐全）。
**没有"骨架版"概念** —— 第一章就要做出**用户能直接验收**的样板。

为什么第 1 章必须主线程：

- 它是 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 这套指引在**当前
  主题 + 当前题材**下的第一次落地
- 如果指引有盲区 / 主题颜色 / 字体 token 不够用，第 1 章一定会暴露 ——
  这时候有人类反馈就能修指引 / 调主题，**早改成本最低**
- 后续章节（无论顺序 / 并行）都要参考第 1 章的代码模式，所以第 1 章 =
  当次项目的"风格锚点（不强求章节间一致，但单章自身得有完整说服力）"

**做完第 1 章后必须停下来**等用户验收：

```
第 1 章 <id> 做完了，可通过根级 `pnpm dev` 输出的 URL 打开 `/play/<episode-id>` 验收。

验收重点：
  □ 视觉气质对不对？符合 <theme nameZh> 的预期吗？
  □ 节奏对不对？某些步太快 / 太慢 / 信息太薄？
  □ 内容驱动动画是否到位？还是有几步是无脑入场动画？
  □ 内容来源：普通项目按双源原则检查 article 细节；Courseplay v3 检查是否综合 guidance、beats 与 presentation，而非套用 article 规则
  □ 反 AI 味检查：紫粉渐变 / 圆角彩色边框 / 假插画 / emoji 是否有？

问题告诉我，我针对性改。OK 了告诉我"继续"，我按选定模式做第 2 章及之后。
```

### 2.3 第 2~N 章 —— 按选定模式

**所有模式下的共同规则**：每章独立按 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
开发。**风格不强求章节间完全一致** —— 主题颜色 / 字体 token 兜底视觉
统一，动画 / 节奏 / 视觉演示由章节自由发挥是设计预期。

#### 模式 A · 默认 · 逐章确认

第 2 章做完 → 暂停验收 → OK → 第 3 章 → 暂停 → ... → 第 N 章。每章
独立验收，问题随时改，风险最低、节奏最稳。用户不明确选模式时默认走这个。

#### 模式 B · 第 1 章后顺序开发

第 2 章 → 第 3 章 → ... → 第 N 章由主线程顺序做完，最后统一验收。
速度中等，适合 agent 不支持并行任务的环境。

#### 模式 C · 第 1 章后并行开发（subagent）

用 subagent 把第 2~N 章并行做完，最大并行数由用户控制（"一次 4 章"
/ "一次 2 章"）。**最快，但风格各章会有差异** —— 这是预期，因为：

1. 每个 subagent 看不到别的 subagent 产出，无法机械对齐
2. 章节代码物理分离（每章一个文件夹 / 自己的 CSS 前缀），不会互相
   破坏；实例只通过自身 `src/entry.tsx` 连接共享运行时
3. 主题 token 兜底视觉统一（颜色 / 字体 / hero 数字 / 卡片 / 分割线
   性格 / 装饰），气质不会跑偏
4. **风格不一致 = 人手写视频的呼吸感**（多 voice / 多视角）

顺序、并行和主线程的 Courseplay 单章实现都使用同一当前章节输入边界。并行
subagent 的 prompt 至少包含：

- 当前 `.handoffs/<Axxx>.json`，或等价的当前 outline、调度、素材、A-page、Beat、
  visual rough 与主题切片
- `references/CHAPTER-CRAFT.md` 的路径（**单一必读** —— 视觉演示要求 +
  逐步揭示 + 内容来源分流 + 反 AI 味 + 代码红线 + 完工自检全部在这一份里）
- **第 1 章代码作为"代码风格"参考**（不是"视觉抄袭对象"）
- `COURSEPLAY-BOUND-MODE.md` 与 `COURSEPLAY-STATE-MECHANISMS.md`；不得只凭
  outline 标题猜页面关系。handoff 可用于缩小上下文，但不是派发前置条件
- 硬规则：每章独立 CSS 前缀（`.cd-` / `.mg-` / `.pm-` / ...）；
  不修改共享运行时或其他章节；在实例 `src/entry.tsx` 注册章节；完工运行
  `pnpm run episode:check`、`pnpm run typecheck`，并按改动追加音频提取或完整构建

**重要**：用户随时可以中途切换模式。第 2 章完成后用户说“剩下的并行”或
“剩下的逐章”都可以。

### 2.4 实现单章（每章必走）

章节实现或实例架构改动完成后，最低运行：

```powershell
pnpm run episode:check
pnpm run typecheck
pnpm run lint
```

改动 `narrations.ts` 时追加 `pnpm audio:extract -- --episode <episode-id>`；
主题、共享运行时或完整章节交付再运行 `pnpm run build`。失败时停止交付，
先修复再继续。

详细指引见 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) ——
**单一必读入口**，覆盖：视觉演示要求 / 逐步揭示 / 内容取舍 / 内容来源分流
/ 视频演示基本审美 / 反 AI 味 / 代码红线 / 完工自检。

**核心要点**（CHAPTER-CRAFT.md 详述）：

- **每章必须有 CSS / SVG / Canvas / JS 视觉演示**，禁纯文字章节
- **关系驱动状态**：真实顺序过程才使用 active / past / upcoming；并列、对照、
  定义和读图采用各自机制。一个 step 可含多个内部动作，相邻 step 可复用同一
  semantic state；都不因此新增 layout
- **内容来源分流**：普通项目使用双源——script 定节拍、article 提供信息密度；
  Courseplay v3 使用三源——guidance 定方向与边界、当前 A beats 提供具体素材、
  presentation 提供表达结构。v2 继续执行冻结的 `screen_source` 基线规则。
- **完工自检逐项过**，不达标回去改

### 2.5 结构变更后检查持久化游标

增加、删除、重排实例 `src/entry.tsx` 的 `CHAPTERS`，或改变任一章节
`narrations.ts` 长度后，先运行 `pnpm run episode:check`，再检查播放页的
持久化游标是否仍安全。共享运行时当前使用
`presentation-cursor-v8:<episode-id>`；只有旧游标可能落入不再存在的 step 时，
才在用户明确授权下递增 `LegacyPresentationApp.tsx` 中的版本前缀。实例不得
创建自己的 stepper 或 storage key。

---

## Checkpoint Audio —— 是否合成音频（**硬节点**）

Phase 2 结束后必须停下来，问用户：

```
网页做完，{N} 章 {M} 步。通过根级 `pnpm dev` 输出的 URL 打开 `/play/<episode-id>`。

要不要合成音频做"自动播放录屏"？
  ✓ 合成 → 扫所有章节的 narrations.ts 出 audio-segments.json，
           调 TTS provider 合成每步一个 mp3 到
           episodes/<id>/media/audio/<chapter>/<step>.mp3。
           合成完后用 /play/<id>/?auto=1 模式可以一镜到底录屏
           （音视频天然同步）。
           内置四个 provider：
             • minimax (mmx-cli)    —— 默认，中文音色稳
             • edge    (edge-tts)   —— 免费，无需 API Key
             • cosyvoice (DashScope) —— 支持复刻音色
             • openai  (OPENAI_API_KEY) —— HTTP API，多数已有 key
           其它后端 (ElevenLabs / macOS say 离线 /
           Azure / Google) 见 docs/tts-providers.md 的说明。
  ✗ 不合成 → 跳过 Phase 3，直接 Phase 4 用手动录屏 + 后期配音。
```

要合成 → Phase 3。不合成 → 直接 Phase 4。

---

## Phase 3 —— 音频合成（可选）

详细流程见 [`references/AUDIO.md`](references/AUDIO.md)。简版：

```powershell
# 在player/ 或 monorepo 根目录执行
pnpm audio:extract -- --episode <episode-id>
# 让用户扫一眼 episodes/<episode-id>/audio-segments.json 确认文本对
pnpm audio:synthesize -- --episode <episode-id>                         # 默认 minimax，增量
pnpm audio:synthesize -- --episode <episode-id> --provider edge         # 免费 Edge TTS
pnpm audio:synthesize -- --episode <episode-id> --provider cosyvoice    # DASHSCOPE_API_KEY
pnpm audio:synthesize -- --episode <episode-id> --provider openai       # 要 OPENAI_API_KEY
pnpm audio:synthesize -- --episode <episode-id> --force                 # 全部重合成
pnpm audio:providers                                                     # 列出 Node provider
```

Node runner 串行合成、跳过已存在 mp3，并把音频写入 `episodes/<episode-id>/media/audio/<chapter>/<step>.mp3`。内置 provider 位于`player/tools/tts-providers/`；新增 provider 时导出 `check()` 与 `synthesize()`，不再写 `.sh`。

合成完告诉用户：输出位置 / 总段数 / 哪些段值得复核。长段先检查是否包含
多个独立语义焦点，以及当前 base-scene 的稳定画面能否持续承载；时长本身
不要求拆 step。
短段再检查文案是否太薄。给最后一次校准节奏的机会，然后进入 Phase 4。

---

## Phase 4 —— 录屏 + 后期

详见 [`references/RECORDING.md`](references/RECORDING.md)。两种路径：

| 场景 | 推荐路径 |
|---|---|
| Phase 3 已合成音频 | **Auto 模式一镜到底**：在 `pnpm dev` 输出的站点打开 `/play/<id>/?auto=1` → 按 SPACE → 整片自动播完 → 停录 → 裁头尾即成片，**无需后期对音轨** |
| Phase 3 跳过 | 默认 Manual 模式手动点击推进 → 后期任意剪辑工具配音 |

> agent 在 Phase 3 / Checkpoint Audio 后**主动告诉用户**适合的录屏路径。

---

## 十条原则（一句话清单）

完整展开见 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
Part 0 —— **写章节时回那里查**，下面只是索引。

| # | 原则 | 一句话 |
|---|---|---|
| 1 | 16:9 固定舞台 | 内容 1920×1080 + transform scale，没有响应式 |
| 2 | 全局 step 计数器 | 正文章节是 step 的纯函数；封面是唯一允许由 Auto fallback 固定保留时长的 silent step |
| 3 | 当前焦点独占舞台 | 一个视觉场景可承载多个连续 step；step 可以切换场景，也可以只推进同一场景状态 |
| 4 | 口播节拍 = step | 正文一节拍 = 一 step = 一聚焦想法，但不自动等于新 scene；封面为独立 silent step |
| 5 | 隐藏的边角控件 | 进度条 / 翻页器默认 opacity 0 |
| 6 | 舞台无 chrome | 没有 header / footer / 页码 / 品牌条 |
| 7 | **内容驱动动画** | 先找内在动作，找不到才入场动画兜底；持续微动慎用 |
| 8 | 关系驱动状态 | 顺序、并列、对照、定义和读图使用不同机制；step 数不从槽位数量反推 |
| 9 | 整片同一主题 | 章节间不翻表面色；**颜色 / 字体走 token**，其它尺度章节自由 |
| 10 | 内容来源分流 | 普通项目走 script + article 双源；Courseplay v3 走 guidance + beats + presentation 三源 |

---

## 常见用户反馈速查

简化表见 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
Part 8「常见反馈速查」。**关键**：先定位是哪一层（节奏 / 视觉 / 内容
/ 代码），再改最小切片，**不要重做整章**。

---

## 相关资源

按"何时读"标注，避免一次性全读：

| 文件 | 何时读 | 内容 |
|---|---|---|
| [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) | Phase 1.2 必读 | 文章 → 口播稿规则、平台变体 |
| [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) | Phase 1.2 必读 | outline.md 字段 spec、命名约定、章节切分、信息池 |
| [`references/COURSEPLAY-BOUND-MODE.md`](references/COURSEPLAY-BOUND-MODE.md) | 检测到正式 v5/v2 或 v6/v3 时必读 | 版本路由、章节输入边界、场景绑定、semantic state / accent / custom 语义；v3 三源细则转引 CHAPTER-CRAFT |
| [`references/COURSEPLAY-STATE-MECHANISMS.md`](references/COURSEPLAY-STATE-MECHANISMS.md) | Courseplay outline 与章节状态映射时必读 | 开放式关系机制、章节内 semantic state、step 复用与实现映射 |
| [`references/COURSEPLAY-OUTLINE-REVIEW.md`](references/COURSEPLAY-OUTLINE-REVIEW.md) | Courseplay outline 自检；按需交给 reviewer | 场景连续性、强调页、额外复杂场景与制作规模审查协议 |
| [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) | **Phase 2.4 每章单一必读入口** | Part 0 十条原则 / Part 1 开工 5 问 / Part 2 关系→动作决策树 / Part 3 视觉工具箱 / Part 4 时长 / Part 5 反 AI 味反模式 / Part 6 代码硬规则 / Part 7 完工自检 / Part 8 反馈速查 |
| [`references/EXAMPLES/`](references/EXAMPLES/) | **可选** —— 看结构 | 章节结构示意（hook / ordered list / equal group / case-tech-review）；**不是抄袭模板** |
| [`references/THEMES.md`](references/THEMES.md) | 选 / 造 / 切主题时 | 完整 token 契约 + 内置主题清单 + 创作流程 |
| [`references/AUDIO.md`](references/AUDIO.md) | Phase 3 才读 | provider-agnostic 音频合成流程、内置 minimax 用法、换 provider 路径、故障排查 |
| `player/tools/tts-providers/` | 换 / 加 TTS provider 时 | Node provider 契约：导出 `check()` 与 `synthesize()`；内置 minimax / openai |
| [`references/RECORDING.md`](references/RECORDING.md) | Phase 4 才读 | 录屏工具 + 后期合成 |
| [`themes/`](themes) | Checkpoint Plan / Phase 1.2 时翻 | 内置主题（每个含 `theme.json` + `tokens.css`） |
| `player/tools/create-episode.mjs` | Phase 2.1 由 `pnpm episode:new` 调用 | 创建共享运行时实例，不安装重复依赖 |
| `player/src/shared/presentation-runtime/` | 仅需理解现有行为 | 旧播放器兼容契约；未经明确授权不得重写 |
