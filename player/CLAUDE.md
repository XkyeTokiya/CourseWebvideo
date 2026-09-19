# Player 控制面

本文件是下游独立执行契约。以下路径与命令默认相对 `player/`；所有播放器命令从本目录执行。

## 两种执行模式

- **主 Agent（默认）**：开始执行前完整阅读 [根 CLAUDE.md](../CLAUDE.md)，再按本文工作。同一上下文已完整读取且文件未变化时不逐轮重读；新上下文或不能确认时重新读取。
- **明确受委派的 subagent**：以本文作为唯一需要主动读取的 CLAUDE 文件，不主动上溯根文件。仍须读取任务必需的 Skill、契约、代码和测试；不得忽略宿主已加载的适用规则。
- 只有委派消息或宿主明确标识才采用 subagent 模式；不因任务较小、只做一章或位于 player 就自行认定。委派任务须有修改范围与验收要求；单期任务还须指定 episode；缺失关键范围时向主 Agent 报告。
- subagent 不自行批准内容、扩大修改范围或作跨项目决策；输入缺失、契约冲突、需改正式 inputs 或任务包时向主 Agent 报告，在解决前不推进依赖该问题的工作。

## 按任务加载

章节创作、presentation 和章节验收必须完整阅读 `.agents/skills/web-video-presentation/SKILL.md`，按当前阶段加载其指定材料。工具、共享运行时或配置维护读取相关契约、实现与测试，涉及生产行为时补读对应 Skill；纯文档调整读取受影响规则来源。已读且未变化的材料不必逐轮重读。

批准 visual rough、Checkpoint Plan、第 1 章完整版本验收、Checkpoint Audio 不能用机器验证替代；遵守用户已作出的有效批准，不重复索取。音频合成前确认分段文本与是否合成；subagent 需要用户决策时交由主 Agent 协调。

## 目录契约

```text
episodes/<episode-id>/
  project.json
  inputs/                         # 上游批准正式输入，只读消费入口
  script.md                       # Phase 1 runner 的正式口播计划状态
  outline.md                      # Phase 1 runner 的正式视觉计划状态
  src/                            # 章节实现
  audio-segments.json             # audio:extract 生成的音频分段
  media/audio/<chapter>/<step>.mp3
  .handoffs/<Axxx>.json           # 播放器生成的临时交接包

episodes/_shared/covers/          # 51 集标准封面库
占位图/                           # 本地占位图素材库，仅用于复制取用
src/                              # 共享播放器与 Studio
tools/                            # 播放器工具
dist/media/episodes/<id>/         # 构建后按期、类型、章节隔离的媒体
dist/manifests/assets.json        # 构建产物完整性与归属清单
../.tmp/work/player/<episode-id>/ # Phase 1 候选和播放器过程文件，不提交
```

`episodes/_shared/` 不是 episode，不能被目录扫描或播放路由识别为实例。本目录的 `output/` 与 `.tmp/` 已废弃，不得重新创建；Phase 1 候选等单期过程文件写入 `../.tmp/work/player/<episode-id>/`。同一期确有并行尝试时才增加 `attempt-*` 子目录。标准构建输出到 `dist/`；检查截图和试录放在 `../.tmp/validation/<episode-id>/`。正式录屏与成片放在任务指定交付目录，未指定时先放本期 work 目录并在交付时说明位置。该目录树是目标结构，planned 实例不要求已具备 inputs、计划或章节文件。

`占位图/` 是不提交 Git 的本地素材库。Agent 使用时必须把选定文件复制到 `episodes/<id>/src/chapters/<chapter>/assets/` 再由组件导入；禁止创建符号链接、目录联接或从章节代码直接跨目录引用素材库。

## 输入与边界

- `../narration-pipeline/episodes/` 是任务包事实源，播放器不得读取它来补齐语义。
- 不擅自修改上游任务包、正式 inputs 或共享运行时契约；共享契约变更须在用户授权或明确委派范围内。
- 正式输入只来自 `episodes/<id>/inputs/`，不得从 `.tmp`、历史归档或旧 `output/` 猜测。
- `project.json` 是播放器实例状态；`planned` 允许没有 `src/entry.tsx`，只能显示为待制作，不能进入播放页。
- `in-progress` 与 `ready` 必须具备有效 `src/entry.tsx`。
- Phase 1 的唯一持久状态是 `script.md` 与 `outline.md`；它们由 runner 的 `init`、逐 A `commit-chapter` 和 `finalize` 管理。
- Phase 1 的项目级输入是 `project.json`、批准的 A-page v6、approved visual rough，以及 A-page 声明的批准口播；runner 同时读取并维护本集的 `script.md` / `outline.md` 正式状态；候选内容可从 work 目录显式提交，但不把 `.tmp` 视为正式输入。它不读取 `narrations.ts`、历史归档或 narration unit/binding sidecar。
- `narrations.ts` 是 Phase 2 章节实现后的 step 数和 TTS 文本来源，不是 Phase 1 的输入。
- 可选 handoff 的作者规则、canonical example 与错误索引见 [`docs/courseplay-handoff-v4-author-contract.md`](docs/courseplay-handoff-v4-author-contract.md)；handoff 不读取或验证 `narrations.ts`。

## 命令

```sh
pnpm dev
pnpm courseplay:phase1 -- --help
pnpm courseplay:handoff -- --help
pnpm audio:providers
```

Phase 1 命令与候选内容示例见 [runner 使用说明](docs/courseplay-phase1-runner.md)。单期音频提取使用 `pnpm audio:extract -- --episode episode-XX`（替换期次），会覆盖该期 `audio-segments.json`；当前不省略 `--episode`，避免扫描共享目录或其他实例。取得音频合成批准后才使用 `pnpm audio:synthesize -- --episode episode-XX --provider edge`，该命令会调用提供方并生成音频。

不得为单期创建独立 `package.json`、锁文件、`node_modules`、Vite 配置或开发服务器。

## 修改与验证

Phase 1 按 `init` → 逐 A `commit-chapter` → `finalize` 执行；不创建旁路 `state.json`、review receipt、临时 script blocks 或 narration unit/binding sidecar。候选在本期 work 目录创作，不得带有 runner marker；提交时 runner 会校验 Nx 无损还原、Beat/step 数量、A-page 顺序和稳定关系引用。`status` 发现 `incomplete` 时只重提受影响章节，不能手工修补另一份正式文件。`status`、`resume`、`preflight` 用于诊断和恢复；A-page 集合或顺序变化时显式处理迁移，不能静默覆盖。

临时验证结果写入 `../.tmp/validation/<episode-id>/`，临时测试夹具和备份写入 `../.tmp/tests/<task>/`，运行日志写入 `../.tmp/runtime/<service>/`；禁止在根 `.tmp/` 顶层直接放文件。任务完成并确认无需恢复后，只清理本任务自己的 player work 子树。

| 改动 | 必需验证（从 player 执行） |
| --- | --- |
| 章节实现 | `pnpm episode:check`、`pnpm typecheck`、`pnpm lint`，并预览受影响章节 |
| `narrations.ts` | 上述检查加 `pnpm audio:extract -- --episode episode-XX`，核对生成分段 |
| 共享运行时、主题或完整交付 | 上述相关检查加 `pnpm build` |
| 工具逻辑 | `pnpm test:tools`，并执行受影响命令的相关检查 |
| 纯文档 | 链接、路径、命令与契约一致性检查 |

`pnpm lint` 当前只覆盖共享 src 与 tools，不包含 `episodes/`，不能据此声称章节已通过 lint。`pnpm build` 已包含 episode 检查、类型检查和 build:inspect；构建成功后无需重复执行 `pnpm build:inspect`，除非产物有变化。正式工具回归测试放在 `tools/tests/`。

生产构建不得把 episode 媒体平铺到 `dist/assets/`。完整布局、缓存和部署约束见 `docs/media-build-layout.md`。

## 独立任务的文件纪律

开始前检查 Git 状态，保留他人改动，仅修改和提交任务范围内的路径。不提交 `.env`、凭据、依赖目录、构建产物、缓存、`.tmp/` 或 `.handoffs/`。未经用户明确授权，不读取或解压 `../.tmp/archives/`。工具管理的缓存与发布暂存遵循实现；Agent 手工临时文件使用上述根级 `.tmp/` 分区。
