---
name: web-video-presentation
description: 把文章或口播稿制作成player/ 子项目内的 Web Video Studio 内可播放、可录屏的点击驱动 16:9 网页演示，可选合成口播音频。流程：输入 → 初始化模块化 outline.md 外壳 → 按章节执行 script block → 原位填充 outline section → 完成 script.md 与全局派生区 → 用户一次对齐稿子、outline、主题、素材和开发模式 → 逐章开发 → 可选音频与录屏。Courseplay 的初始 outline 外壳由 A-page JSON 的 `pages[]` 顺序与 `pages[].a_id` 确定性生成，不提前生成视觉判断。新实例必须使用 episodes 下的实例目录、根级 pnpm episode:new 与共享旧播放器运行时，禁止生成独立 Vite 项目。每次点击推进一个口播节拍；连续 step 在同一视觉步组内复用主构图，只更新局部状态。主题由 project.json.theme 动态注入。凡用户要求把文章或口播稿做成网页视频、动态 PPT、交互式解说或录屏课程，均应使用本 Skill。
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
Phase 1   内容编译
   1.1  识别用户输入
   1.2  初始化模块化 outline.md 外壳
   1.3  按章节纵切：script block → 原位填充 outline section
   1.4  完成 script.md + outline 全局派生区
   1.5  全局一致性审查
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

> **关键**：Phase 1 尚未创建 `narrations.ts`，此时由已提交 script Beat 决定计划
> step；Phase 2 将其逐拍复制到 `narrations.ts` 后，后者才是运行时 step 数和音频
> 合成的**唯一真相源**。章节组件可到达的最大 step + 1 必须等于
> `narrations.length`；实现可以使用
> 条件分支、数组映射或状态机，不能只依赖 `if (step === N)`。这保证 script /
> outline / 章节代码 / `entry.tsx` / 音频文件不会漂。

---

## 硬性自检协议（贯穿整个 Skill）

下面三类产出完成后必须自检；自检只用于发现问题，不生成持久 PASS/REVISE 状态：

| 产出 | 自检清单出处 |
|---|---|
| chapter script + outline 内容对 | Courseplay 只检查 nx 无损、Beat/step 和稳定引用；普通项目另按 [`SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) 检查文案质量 |
| 完成后的 `script.md` + `outline.md` | [`OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) 的最小全局检查；只回修被定位的章节 |
| 单章实现完成 | [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 完工自检 |

Phase 1 默认由作者按清单自检并直接修正，不为常规章节启动 reviewer，也不保存
审查报告。独立 reviewer 仅按用户要求或明确高风险触发：

- `review_mode: self`（默认）：作者按 `OUTLINE-FORMAT.md` 的最小清单自检。
- `review_mode: independent`：用户或自动化流程明确指定时，才把审查协议和
  必要输入交给 reviewer agent/subagent。
- 请求 independent 但无可用 reviewer 时回退到 self，并在 Checkpoint Plan
  披露。Reviewer 只报告，原作者负责修正。Phase 2 的实现自检仍按
  `CHAPTER-CRAFT.md` 执行。

**铁律**：拿到结论后先按 fail 项把产出改完，再向用户汇报“做完了 +
自检结论 + 改了什么”。直接拿原始结论汇报但不修复属于违规。

---

## 各阶段文件读取指南

不同阶段读不同的文件。**长会话里 agent 容易遗忘原则**，特别是
Phase 2.4 的"实现单章"会重复 N 次 —— 每次都要回看核心约束。

| 阶段 | 必读（每次都看） | 一次性看完 / 按需查 |
|---|---|---|
| Phase 1.1-1.5 内容编译 | `references/SCRIPT-STYLE.md` + `references/OUTLINE-FORMAT.md` + `article.md`（用户原文，如有）；检测到正式 Courseplay 输入时另读 `references/COURSEPLAY-BOUND-MODE.md` 与 `references/COURSEPLAY-STATE-MECHANISMS.md` | 独立审查只在用户明确要求时按当前章输入执行 |
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

## Phase 1 —— 内容编译（章节纵切）

Phase 1 是一个连续完成的**业务阶段**，不是一个必须塞进同一条模型响应或
同一次思考的推理事务。1.2–1.5 自动连续执行，章节之间不请求用户确认；只有
两份正式产物完成并通过全局审查后，才进入唯一的 Checkpoint Plan。

Phase 1 的基本创作、恢复和修改单位是 **chapter / A-page 内容对**。
`script.md` 与 `outline.md` 从初始化起就是正式文件，runner 只替换同 ID 的章节
范围。任何阶段都不要求模型重新生成完整文件。

Courseplay-bound mode 必须通过确定性 runner 初始化、提交章节内容对、finalize
与恢复；Agent 只创作 script/outline 候选并自检，不得手工伪造 marker。正式
产物是唯一持久状态，不创建 `state.json`、review receipt 或临时 block 仓库。完整命令见
[`docs/courseplay-phase1-runner.md`](../../../docs/courseplay-phase1-runner.md)。

### 1.1 识别用户输入

| 用户给的东西 | 该做的 |
|---|---|
| 同时提供正式 `courseplay-a-page/v6` + `courseplay-visual-rough/v4` | 进入 Courseplay-bound mode；v6 `screen` 是 guidance，当前 A 口播提供具体素材，rough 提供表达结构。三源创作完整规则只读 `references/CHAPTER-CRAFT.md` |
| Courseplay 输入不完整，版本不是 A-page v6 + visual rough v4，未处于 `episodes/<id>/inputs/`，批准状态/episode/source 不一致，或当前页缺少非空 `nx` / 页面指导 | Phase 1 fail-fast，列出缺项或冲突；不得用“等价输入”、历史文件或普通 article 流程降级。等价的当前章节输入只可在正式输入已通过 preflight 后，作为 Phase 2 不调用 handoff 时的上下文传递方式 |
| 原始文章（书面语 / 公众号 / 论文 / 博客） | 划定内容章节后初始化模块化 outline 外壳，按章节完成 script → outline 编译（1.2–1.5），再过 Checkpoint Plan |
| 直接的口播稿 / 视频脚本 | 保持原文内容，按已有章节初始化 outline 外壳并逐章派生（1.2–1.5 简化版），再过 Checkpoint Plan |
| 啥都没有，只说"帮我做个 X 主题的视频" | **反问**：先给一段素材或大纲。Skill 不替用户构思内容 |

Courseplay preflight 的“正式且已批准”只有一种口径，以下条件必须同时成立：

- 文件位于 `episodes/<id>/inputs/`，名称为 `<id>-a-page.json`、
  `<id>-visual-rough.md`，以及 A-page 声明的 `approved_text`；
- A-page 为 `courseplay-a-page/v6`、`document_kind: production`，visual rough 为
  `courseplay-visual-rough/v4`、`document_kind: production`、`status: approved`；
- 两份正文的 `episode_id` 一致，A-page 页序唯一且每页 `nx` 非空，rough 的
  `source_a_page` 与当前文件名和文件内容摘要一致；
- 声明 `approved_text` 时，所有 `nx` 顺序拼接与批准文件一致。

任一条件失败均停止 Phase 1 并报告具体文件和字段；不得读取历史 episode、过程目录
或“等价输入”补齐。上游 validation report 可以作为审计证据保留，但不是
Phase 1 runner 的运行依赖；preflight 使用的摘要不写入正式产物。

### 1.2 初始化两份模块化正式文件

Courseplay-bound mode 直接读取正式 A-page JSON，按 `pages[]` 顺序和
`pages[].a_id` **确定性创建** `script.md` 与 `outline.md` 外壳。初始化只写固定
封面、A-page 数量/顺序、章节边界，以及 metadata、视觉调度、素材汇总的稳定边界；
不得提前生成标题、Beat、step、scene 或其他创作判断。

```markdown
# Video Outline

<!-- GLOBAL:metadata:BEGIN -->
> **编译状态**：in-progress
> **主题**：pending（Checkpoint Plan 待选）
> **章节**：<由 pages.length 计数>
<!-- GLOBAL:metadata:END -->

## 整集视觉调度

<!-- GLOBAL:schedule:BEGIN -->
<!-- GLOBAL-CONTENT: pending -->
<!-- GLOBAL:schedule:END -->

## 0. cover — 封面（1 silent step · fixed 15s）

## 1. A001 — pending

<!-- CHAPTER:A001:BEGIN tx=pending -->
<!-- CHAPTER-CONTENT: pending -->
<!-- CHAPTER:A001:END -->

## 素材清单

<!-- GLOBAL:materials:BEGIN -->
<!-- GLOBAL-CONTENT: pending -->
<!-- GLOBAL:materials:END -->
```

`script.md` 使用相同的 chapter 边界。`tx` 只检测两份正式文件中的同章内容是否
属于同一次提交，不表示审查结论。若文件仍等于 `episode:new` 原始模板，runner
允许迁移；其他既有内容 fail-fast，不覆盖。恢复点直接从两份正式文件计算，不另建
状态文件或工作块目录。

### 1.3 按章节纵切编译

Courseplay 严格按 A-page JSON 顺序处理每一章；普通项目按初始 outline 模块顺序：

1. 普通项目按 [`SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) 创作当前章；
   Courseplay 只把当前 A-page 的非空 `nx` 切成语义 Beat，不改写批准口播，也不套用
   B 站风格或 `script/article ≥ 60%` 门禁。
2. 从当前章 script Beat 派生同章 outline section。Agent 只做一次最小自检：口播
   无损、Beat/step 一一对应、受保护关系和 S/U/R/M 引用完整；质量问题由作者当场
   修正，不生成审查报告或 PASS 状态。
3. 用一次 `commit-chapter --script ... --outline ...` 提交内容对。runner 验证机械
   不变量并原位替换两份正式文件中的同章范围；其他章节保持字节不变。

外壳初始化后，禁止整份覆盖 `script.md` 或 `outline.md`。一次掉线最多留下当前章
两份文件的事务不一致；`status` 会定位该章，重新提交即可。

script 始终是 outline 的口播权威来源。章节纵切改变的是事务边界，不改变
`script → outline` 的依赖方向。Phase 1 的 Courseplay 正式输入只接受已通过
preflight 的 `episodes/<id>/inputs/` A-page v6 + visual rough v4；“等价输入”不能
替代正式输入。显式调用 Courseplay handoff 时，根级输入和
script/outline 语法只按
[`handoff v4 作者契约卡`](../../../docs/courseplay-handoff-v4-author-contract.md)
与 [canonical example](../../../docs/examples/courseplay-handoff-v4/) 准备；
不调用时可在 Phase 2 从已验证正式输入中直接提供等价的当前章节上下文。

Courseplay-bound mode 额外遵守 [`COURSEPLAY-BOUND-MODE.md`](references/COURSEPLAY-BOUND-MODE.md)：
A-page 顺序对应 chapter 顺序，每个 A-page 默认一个持续 base-scene；narration
beat 由批准 `nx` 的语义边界切分并持久化在正式 `script.md`，outline 只读取这些
边界，不从 visual rough 的 G/U、槽位、recipe 或时长反推 step 数。
semantic state 描述稳定画面并可跨 step 重复；关系机制不决定
step 或 state 数，不使用固定全局 state 枚举；accent-frame 允许低成本全屏强调；custom-scene 必须写
必要性并以 `proposed` 状态进入 Checkpoint Plan，局部审查只验证提案理由，不能提前
声称用户已确认。Courseplay 字段只追加场景绑定，不替代通用封面、信息池、时长摘要
或素材清单。A-page / visual rough 决定章节边界、语义、页面配方、骨架与媒体资格；
outline 决定持续构图、结构指纹、内容槽位、每步场景指令与场景例外；chapter agent 决定组件、
CSS、动画和具体视觉实现。Phase 1 以已提交 script beats 作为计划真相源；Phase 2
创建 `narrations.ts` 时必须逐 beat 复制，届时它才成为运行时 step 数与 TTS 文本的
最终真相源，Phase 1 不得依赖尚不存在的文件。

### 1.4 完成正式产物

全部章节提交后，Agent 只检查章节顺序、明显的相邻视觉重复与 custom 候选说明；
需要修改时重提具体章节。随后调用 `finalize`。runner 重新验证全部章节的 nx、
Beat/step、引用与内容对事务，自动生成顶部统计、整集视觉调度和素材汇总，并把
编译状态设为 `awaiting-checkpoint-plan`。这些全局区域没有独立状态机，也不需要
Agent 手工维护。

### 1.5 全局一致性审查与最小回修

Courseplay 的机械全局检查由 `finalize` 完成：每页 `nx` 无损覆盖且顺序正确、
Beat/step 和稳定引用完整、全局派生内容可生成。它不计算 article 比例，也不把
钩子、语气、美感或相邻差异变成阻塞状态。普通文章存在 `article.md` 时才执行全文
信息保留度检查。

修改传播规则：

| 修改 | 自动失效 | 保持有效 |
|---|---|---|
| A-page 集合或顺序经授权变更 | 显式结构迁移；runner 先 fail-fast | 任何未受影响内容不得静默覆盖 |
| A006 script 文案或 Beat | A006 outline 与 A006 内容对重提 | 其他章节 |
| A006 outline scene / state | A006 内容对重提；全局区由 runner 自动重算 | A006 script 内容与其他章节 |
| A006 media | A006 内容对重提；素材汇总自动重算 | narration 与无关章节 |
| 最终自检发现相邻重复 | 被明确选中回修的章节 | 其他章节 |

**硬原则：Repair the smallest invalidated scope.** 局部失败先定位对应 A-page
或普通文章内容段与 chapter；禁止为了方便重写无关章节、完整
`script.md` 或完整 `outline.md`。普通项目只有章节边界本身错误时，才调整受影响
模块；Courseplay 章节结构以正式 A-page 为准。

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

**正式产物完成后必须先做最小全局自检再进 Checkpoint Plan**：机械完整性由
`finalize` 保证；Agent 只修正明确定位的语义或视觉问题。默认 self review，只有
用户明确要求才派 independent reviewer，不保存审查报告。

---

## Checkpoint Plan —— 5 件事一次对齐（**硬节点**）

`script.md` 与 outline 的章节内容/全局派生区通过审查后必须停下来。此时主题字段
仍可为 `pending`，custom-scene 仍为 `proposed`；**用户在这一个节点同时确认 5 件事**。

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
     - 普通项目检查每章「信息池」是否有足够 article 细节；Courseplay v4 检查 guidance、beats 与 presentation 是否足以支撑页面创作
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
- custom-scene：用户确认后将候选状态改为 `approved`；拒绝则回修对应 section，
  不得把未确认候选带入 Phase 2
- **主题必须明确**才进入 Phase 2。用户说"主题你帮我选" → 取你推荐的第 1 个，
  **告诉用户你选了什么、为什么**，给反悔机会；将选定主题原位写入 outline 顶部
  和 `project.json.theme`，这只是 Checkpoint 决策投影，不触发整份 Global Review
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

handoff 是可选上下文打包工具，不是章节制作前置门禁。固定路径、script/outline 语法、
normalizer 边界和真实检查范围只读 [`handoff v4 作者契约卡`](../../../docs/courseplay-handoff-v4-author-contract.md)、
[`canonical example`](../../../docs/examples/courseplay-handoff-v4/)；失败时才按
[`error index`](../../../docs/handoff-v4-error-catalog.json) 查码。不要读取 CLI/parser/validator 实现，
也不要为修复 handoff 输入错误改写批准口播。

生成的 `.handoffs/<Axxx>.json` 可作为 Courseplay Phase 2 的紧凑输入。v4 包提供准确 `narration.beats`、`screen_guidance`、
`presentation`、结构化 `steps`、关系、护栏和素材。章节 Agent 只读该包、`COURSEPLAY-BOUND-MODE.md`、
`COURSEPLAY-STATE-MECHANISMS.md`、`CHAPTER-CRAFT.md`、目标章节代码和必要的第 1 章
代码风格参考；使用该包时不必再把完整内容源加入章节上下文。
`narration.authority` 指向 `a_page.nx`，`narrations.ts` 必须逐 Beat 使用这些文本；这是章节运行时的既有职责，不是 handoff 的读取或验证范围。生成或 `--check` 失败时报告当前输入问题，不从历史章节猜测补齐。
v4 不要求普通 S/G 逐项落屏，也不登记
guidance/Beat 来源；必须综合 guidance、当前 A beats 与 presentation 重新设计完整
上屏内容。不得引入 packet 外事实、改变数字/范围/极性/归属/关系、泄漏
`silent_constraints` 或提前揭示后续 beat。详细且唯一的三源创作规则见
[`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md#courseplay-v4三源创作唯一详细规则)。

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
  □ 内容来源：普通项目按双源原则检查 article 细节；Courseplay v4 检查是否综合 guidance、beats 与 presentation，而非套用 article 规则
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
  Courseplay v4 使用三源——guidance 定方向与边界、当前 A beats 提供具体素材、
  presentation 提供表达结构。
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
| 10 | 内容来源分流 | 普通项目走 script + article 双源；Courseplay v4 走 guidance + beats + presentation 三源 |

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
| [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) | Phase 1.2–1.5 必读 | chapter-local 文章 → 口播稿规则、平台变体、全局审查与最小回修 |
| [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) | Phase 1.2–1.5 必读 | 模块化 outline sections 与 global-derived 区域的字段 spec、命名约定、章节切分、信息池 |
| [`references/COURSEPLAY-BOUND-MODE.md`](references/COURSEPLAY-BOUND-MODE.md) | 检测到正式 v6/v4 时必读 | 当前版本路由、章节输入边界、场景绑定、semantic state / accent / custom 语义；handoff 语法转引公开作者契约卡 |
| [`../../../../narration-pipeline/.agents/skills/rewrite-course-narration/references/a-page-v6-author-contract.md`](../../../../narration-pipeline/.agents/skills/rewrite-course-narration/references/a-page-v6-author-contract.md) | 需要理解 A-page 字段时 | A-page 作者契约与 canonical example 路由 |
| [`../../../../narration-pipeline/.agents/skills/design-course-visual-rough/references/visual-rough-v4-author-contract.md`](../../../../narration-pipeline/.agents/skills/design-course-visual-rough/references/visual-rough-v4-author-contract.md) | 需要理解 visual rough 字段时 | visual rough 作者契约与 canonical example 路由 |
| [`../../../docs/courseplay-handoff-v4-author-contract.md`](../../../docs/courseplay-handoff-v4-author-contract.md) | 显式调用 handoff 时 | 固定输入、script/outline 语法、presentation 和真实检查范围 |
| [`../../../docs/examples/courseplay-handoff-v4/`](../../../docs/examples/courseplay-handoff-v4/) | 显式调用 handoff 时 | 合成成功样例 |
| [`../../../docs/handoff-v4-error-catalog.json`](../../../docs/handoff-v4-error-catalog.json) | handoff 失败时 | 按错误码局部诊断 |
| [`references/COURSEPLAY-STATE-MECHANISMS.md`](references/COURSEPLAY-STATE-MECHANISMS.md) | Courseplay outline 与章节状态映射时必读 | 开放式关系机制、章节内 semantic state、step 复用与实现映射 |
| [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) | **Phase 2.4 每章单一必读入口** | Part 0 十条原则 / Part 1 开工 5 问 / Part 2 关系→动作决策树 / Part 3 视觉工具箱 / Part 4 时长 / Part 5 反 AI 味反模式 / Part 6 代码硬规则 / Part 7 完工自检 / Part 8 反馈速查 |
| [`references/EXAMPLES/`](references/EXAMPLES/) | **可选** —— 看结构 | 章节结构示意（hook / ordered list / equal group / case-tech-review）；**不是抄袭模板** |
| [`references/THEMES.md`](references/THEMES.md) | 选 / 造 / 切主题时 | 完整 token 契约 + 内置主题清单 + 创作流程 |
| [`references/AUDIO.md`](references/AUDIO.md) | Phase 3 才读 | provider-agnostic 音频合成流程、内置 minimax 用法、换 provider 路径、故障排查 |
| `player/tools/tts-providers/` | 换 / 加 TTS provider 时 | Node provider 契约：导出 `check()` 与 `synthesize()`；内置 minimax / openai |
| [`references/RECORDING.md`](references/RECORDING.md) | Phase 4 才读 | 录屏工具 + 后期合成 |
| [`themes/`](themes) | Checkpoint Plan 时翻 | 内置主题（每个含 `theme.json` + `tokens.css`） |
| `player/tools/create-episode.mjs` | Phase 2.1 由 `pnpm episode:new` 调用 | 创建共享运行时实例，不安装重复依赖 |
| `player/src/shared/presentation-runtime/` | 仅需理解现有行为 | 旧播放器兼容契约；未经明确授权不得重写 |
