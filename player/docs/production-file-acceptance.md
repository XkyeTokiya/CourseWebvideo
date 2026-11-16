# Player 制作文件与验收入口

本文面向执行单期制作的 Agent 和验收者。路径及命令相对 `player/`；按当前阶段查对应行，**planned 实例不要求提前具备后续产物**。这里是各文件的工作清单和导航，不替代 [Player 执行契约](../CLAUDE.md)、[下游 Skill](../.agents/skills/web-video-presentation/SKILL.md) 及对应作者契约，也不把人工批准变成机器门禁。

## 先找需要的资料

| 要做什么 | 直接入口 |
|---|---|
| 看可选主题、简介、适用场景、气质和预览色 | `pnpm themes:list`；结构化数据用 `pnpm --silent themes:list -- --json`。命令实时读取现有主题，排除 `selectable: false`、缺文件或元数据无法读取的目录；它不完整验证元数据字段，详细 token 与主题制作见 [主题契约](../.agents/skills/web-video-presentation/references/THEMES.md) |
| 看当前期主题、状态与进度 | `episodes/<id>/project.json`；主题的实际颜色和字体在 `.agents/skills/web-video-presentation/themes/<theme>/tokens.css` |
| 查 Courseplay 正式内容 | `episodes/<id>/inputs/` 内的批准口播、A-page、visual rough；缺失或不一致时报告，不能从历史材料猜补 |
| 写或恢复 Phase 1 | [runner 使用说明](courseplay-phase1-runner.md)、[outline 格式](../.agents/skills/web-video-presentation/references/OUTLINE-FORMAT.md)；下面有候选格式速查 |
| 实现和检查当前章 | 当前 A 的正式输入与 outline 章节块，或按需生成的 handoff；[章节创作与自检](../.agents/skills/web-video-presentation/references/CHAPTER-CRAFT.md)、[Courseplay 绑定规则](../.agents/skills/web-video-presentation/references/COURSEPLAY-BOUND-MODE.md)、[状态与关系机制](../.agents/skills/web-video-presentation/references/COURSEPLAY-STATE-MECHANISMS.md) |
| 截图核对章节状态 | 按 [Player 截图规范](../CLAUDE.md#修改与验证)批量采集并拼合成可读总览图；修复后按影响范围批量复验 |
| 查询单章 handoff 的语法、示例与报错 | [handoff 作者契约](courseplay-handoff-v4-author-contract.md)、[示例](examples/courseplay-handoff-v4/)、[错误索引](handoff-v4-error-catalog.json)；它是可选工具，不是制作门禁 |
| 查素材与封面 | 当前 outline 的素材清单和章节 `assets/`；可选封面内容库 `episodes/_shared/covers/`；本地 `占位图/` 需复制到章节目录后使用 |
| 音频、录屏和构建 | [音频](../.agents/skills/web-video-presentation/references/AUDIO.md)、[录屏](../.agents/skills/web-video-presentation/references/RECORDING.md)、[媒体构建布局](media-build-layout.md)、[OBS](obs-browser-source.md) |

主题推荐读取命令输出中的 `nameZh`、`descriptionZh`、`bestFor`、`mood` 和 `preview`，结合本期内容推荐 2–3 个；用户确认后再用于本期。预览色是元数据，不等于实际页面截图。

## 按文件验收

除主题目录和 `dist/` 外，下表文件路径相对 `episodes/<id>/`。“检查”说明可用证据及其边界；未列出的人工质量项仍按对应 Skill 检查。正式输入由上游发布，Player 只读消费。遇到缺项、格式冲突或批准不适用，指出具体文件和字段，不使用旧 episode 或过程文件补语义。

| 文件 | 何时需要、完成标准 | 如何检查 |
|---|---|---|
| `project.json` | 每期必有；`id` 与目录相同，标题非空；状态为 `planned`、`in-progress` 或 `ready`；`theme` 是已安装主题，新选主题须可选；`progress` 和 `updatedAt` 反映实际进度。`planned` 无须入口，后两种状态须有入口；`ready` 仅用于声明章节已完成并通过检查。 | `pnpm episode:check -- --episode <id>` 检查字段、主题是否安装及入口是否存在；`ready` 的完成数不一致仅是警告。人工核对进度与实际、批准情况及所选主题，不能把命令通过当成用户验收。 |
| `.agents/skills/web-video-presentation/themes/<theme>/` 下的 `theme.json` 与 `tokens.css` | 只在创建或修改主题时处理；元数据 ID 与目录名一致，提供名称、简介、`mood`、`bestFor` 和四个预览色；token 符合[主题契约](../.agents/skills/web-video-presentation/references/THEMES.md)，兼容旧实例的主题可标记为不可新选。 | `pnpm themes:list` 核对可选元数据；按主题契约逐章预览并执行工具测试、episode 检查、类型检查和构建。列表可显示不代表颜色对比、字体或页面效果已验收。 |
| `inputs/<id>-a-page.json` | Courseplay Phase 1 前必有；v6、`document_kind: production`，episode 与目录一致；页面 ID 唯一、顺序明确、各 `nx` 非空；页面指导与护栏满足创作需要。 | `pnpm courseplay:phase1 -- preflight --episode <id>` 检查版本、页序、来源一致性等；指导是否足够需按作者契约判断。 |
| `inputs/<id>-visual-rough.md` | Courseplay Phase 1 前必有；v4、production/approved，与 A-page episode、页序、源文件名及 SHA-256 一致；页面配方、关系和媒体需求可供下游使用。 | 同一 preflight 检查结构和来源；媒体资格和创作表达仍需人工核对。 |
| `inputs/<approved_text>` | A-page 声明 `approved_text` 时必有，通常为 `approved-spoken-text.txt`；是用户批准的连续口播。 | preflight 将各 `nx` 按页序拼接并在忽略空白后与文件比较；须保留文字、标点和顺序。 |
| `inputs/*-validation.json` | 上游随正式产物发布的最终验证报告，是治理证据，不是创作素材。 | 按[上游发布约定](../../narration-pipeline/CLAUDE.md)核对；这些报告不是 Phase 1 runner 的运行依赖。 |
| `article.md` | 普通项目提供原文时按需保留；Courseplay 不以它替代正式 inputs。 | 对照原文，画面使用可追溯细节，不编造事实。 |
| `script.md` | Phase 1 正式口播计划；每个 A 一章，Beat 按批准 `nx` 语义切分，顺序拼接后除空白外与 `nx` 一致；由 runner 管理。 | 逐章 `commit-chapter`、最后 `finalize`；对照下方候选格式。标题与分隔线不是口播。 |
| `outline.md` | Phase 1 正式视觉计划；A 页序、章节、Beat/step 一致，章节说明主构图、关系、槽位、状态变化、素材和场景例外；全局区由 runner 派生。 | `commit-chapter` 和 `finalize` 检查页序、step 数、引用及内容对事务；作者另按 [outline 最小审查](../.agents/skills/web-video-presentation/references/OUTLINE-FORMAT.md) 检查语义、媒体和相邻画面。通过不代表视觉质量或用户批准。 |
| `.handoffs/<Axxx>.json` | 仅按需生成的单章派生缓存，不提交；输入或当前章计划变化后应重新生成，再用作该章上下文。 | `pnpm courseplay:handoff -- --episode <id> --a-page <Axxx>`；它检查作者契约列出的输入和引用，**不读取或验证 `narrations.ts`**。失败按其错误索引局部处理。 |
| `src/entry.tsx` | 可播放实例必有；导出 `id`、`title`、按播放顺序排列的 `CHAPTERS`，逐章绑定组件与 narrations，封面按 1 个静默 step、15 秒注册。 | 人工核对注册顺序、chapter ID、组件与 narration 对应关系；构建并在浏览器验证前进、回退、跳转和刷新恢复。`episode:check` 只检查入口是否存在，不检查这些内容。 |
| `src/data/cover.json`、`src/chapters/00-cover/*` | 默认封面包含当前期内容；组件映射 `course`、`module`、`task`、`point`、`lede`、`chips`，忽略 `style`；`narrations = [""]`、`stepDurationsMs = [15000]`。 | 对照当前期内容预览；无 `subtitle` 时使用 `lede`。共享内容库是可选来源，默认模板是可编辑占位，不代表内容已验收。 |
| `src/chapters/<NN>-<id>/<Chapter>.tsx` 与样式 | 每章完整实现 outline 的构图、step/state、关系、受保护内容与素材；颜色和字体使用主题 token，章节样式隔离；无未经确认的场景例外。 | 按章节创作自检在浏览器检查实际渲染、关键状态和终态；`exact` 须在实际画面完整可见。检查截断、遮挡与关键关系；构建成功不等于视觉验收。 |
| 每章 `narrations.ts` | Phase 2 必有静态字符串数组；Courseplay 逐项复制当前 `script.md` Beat，数组长度等于组件可到达 step 数。空字符串表示静默 step。 | 直接逐项比对 script Beat、outline step、组件可达状态；音频阶段再核对提取结果。handoff 不代替这个检查。 |
| `src/chapters/<NN>-<id>/assets/*` | 需要媒体时提供相应素材或明确标记 placeholder；素材 ID、角色和来源符合 rough/outline，要求教材原图时不得用重绘或 AI 图冒充。 | 实际预览并核对清单和来源；告知用户未就位素材。占位图复制入章节 assets，不能跨目录链接本地素材库。 |
| `audio-segments.json` | 仅在音频提取适用时由工具生成；每条非静默 narration 的章、1 起始 step、原文和音频相对路径必须正确。 | `pnpm audio:extract -- --episode <id>` 会**覆盖**该文件；提取后核对文本和数量，并特别核对 `chapter` 与 `CHAPTERS[].id` 一致。任务阶段明确排除音频提取时，直接对照文本，不运行该命令。 |
| `media/audio/<chapter>/<step>.mp3` | 仅在用户通过 Checkpoint Audio、确认分段及同意合成后需要；每个非静默 step 的音频路径和内容与 narration 一致。 | 对照 `audio-segments.json` 与 `CHAPTERS[].id`，实际播放/抽听并检查缺段；未合成应明确报告，不能以自动模式的无音频回退冒充已有音频。 |
| `dist/` 和 `dist/manifests/assets.json` | 需要完整构建/交付时由 `pnpm build` 生成；媒体归属、大小及 SHA-256 通过构建审计。 | `pnpm build` 已包含 episode 检查、类型检查和 build:inspect；构建检查不能证明播放、音画同步或人工验收。`dist/` 不提交 Git。 |
| 录屏与成片 | 仅在任务包含录制或后期时需要；写入任务指定交付目录，未指定时先放本期 work 目录并说明位置。 | 按[录屏流程](../.agents/skills/web-video-presentation/references/RECORDING.md)检查起始状态、画面、音频和时序，并实际回看成品。 |

`audio:extract` 以章节目录名去除开头数字和连字符后的结果作为 `chapter`，并据此生成音频路径。例如目录 `01-a001/` 生成的分段为 `chapter: "a001"`，音频路径为 `a001/1.mp3`。提取过程不读取 `entry.tsx`，因此生成的 ID 可能与播放器注册 ID 不同。

## Phase 1 候选格式速查

从 `player/` 运行 `preflight`、`init`，再为每个 A 在 `../.tmp/work/player/<id>/` 准备一对候选，按 A 顺序提交，最后 `finalize`。候选不包含任何 `CHAPTER` / `GLOBAL` runner marker。下面只示意格式；标题、文本、实际页序、步数、时长、稳定 ID 和媒体必须来自当前正式输入，不能照抄为本期事实。

Script 候选：

```markdown
## A001 · 本页标题

批准口播第一拍。

---

批准口播第二拍。
```

Outline 候选（两拍示意）：

```markdown
## 1. a001 — 本页标题（2 steps · ~24s）

**A-page / Chapter**：`A001`
**基础场景**：`S-A001` — 本页持续主构图
**页面配方**：本页配方
**核心判断**：本页判断
**结构指纹**：本页槽位组合
**语义关系**：本页关系及实际受保护关系 ID
**关系机制**：如何维持构图并推进关系
**持续元素**：持续保留的元素
**内容槽位**：各槽位的作用
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`
**信息池**：当前页可追溯的信息或不承载事实的结构元素

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 第一拍焦点 | `S-A001 · context-established` | 建立基础槽位 |
| 2 | 第二拍焦点 | `S-A001 · context-established` | 保持同一稳定画面，承载第二拍 |
```

根据实际 rough 在章节内补齐媒体 ID、角色和就位状态；需要省略可见标题或提议额外复杂场景时按绑定规则写理由。候选的章节序号从 1 起；heading 须有实际 step 数和以秒为单位的估时，例如 `（2 steps · ~24s）`，不能把 handoff canonical example 的 `（2 steps · canonical）` 当作 Phase 1 候选标题。

| 报错 | 先核对 |
|---|---|
| `PHASE1_PAGE_SEQUENCE` | 标题序号、标题格式、A-page 映射及正式页序；script 标题使用 `## A001 · 标题`。 |
| `PHASE1_NX_MISMATCH` | 去掉标题和独占行的 `---` 后，非空 Beat 顺序拼接与当前 `nx` 是否除空白外完全一致。 |
| `PHASE1_BEAT_STEP_MISMATCH` | heading 的 step 数、从 1 连续编号的表格行数、script Beat 数是否一致。 |
| `PHASE1_REFERENCE_UNKNOWN` | 受保护关系是否完整，S/U/R/M 是否属于当前页；额外复杂场景是否为 `none` 或带必要性的 `proposed`。 |
| `PHASE1_ARTIFACT_CONFLICT` / `PHASE1_INCOMPLETE` | 候选是否误带 marker，正式文件是否可安全迁移、两份同章事务是否一致；用 `status` 定位并只重提受影响章节。 |

更多错误与恢复见 [runner 使用说明](courseplay-phase1-runner.md)。不要改写批准口播来迎合报错。

## 阶段放行和验证边界

1. **Checkpoint Plan**：runner finalize 和作者自检后，与用户确认稿子、outline、主题、素材、开发模式及需要确认的场景例外。
2. **首章**：完成真实章节而非骨架，执行相关命令并预览；用户明确验收后再按已选模式制作后续章节。
3. **Checkpoint Audio**：核对分段并取得用户对合成的确认；没有批准就不调用提供方。录屏和最终交付还须按任务需求检查素材、音频与播放。

章节改动按 [Player 执行契约](../CLAUDE.md#修改与验证)执行 `episode:check`、`typecheck`、`lint` 与预览；需要构建时执行 `pnpm build`。当前 `typecheck` 配置不包含 episodes，`lint` 只覆盖共享 `src` 和 `tools`，因此不能声称章节 TSX/CSS 已通过这两项静态检查。构建会编译章节，但不证明其视觉、音频或用户验收通过。已有且仍适用的用户批准和验证结果可沿用；本次任务明确限定的阶段范围优先。
