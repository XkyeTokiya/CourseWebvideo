# Player 控制面

本目录是 Courseplay Web Video 播放器子项目。所有播放器命令都从 `player/` 目录执行；单仓库根目录的跨项目规则见 `../CLAUDE.md`。

## 目录契约

```text
episodes/<episode-id>/
  project.json
  inputs/                         # 上游批准正式输入，只读消费入口
  script.md                       # Phase 1 runner 的正式口播计划状态
  outline.md                      # Phase 1 runner 的正式视觉计划状态
  src/                            # 章节实现
  media/audio/<chapter>/<step>.mp3
  .handoffs/<Axxx>.json           # 播放器生成的临时交接包

episodes/_shared/covers/          # 51 集标准封面库
占位图/                           # 本地占位图素材库，仅用于复制取用
src/                              # 共享播放器与 Studio
tools/                            # 播放器工具
dist/media/episodes/<id>/         # 构建后按期、类型、章节隔离的媒体
dist/manifests/assets.json        # 构建产物完整性与归属清单
```

`episodes/_shared/` 不是 episode，不能被目录扫描或播放路由识别为实例。`player/output/` 已废弃，不得重新创建；截图、构建结果和录屏放在外部临时输出位置。

`占位图/` 是不提交 Git 的本地素材库。Agent 使用时必须把选定文件复制到 `episodes/<id>/src/chapters/<chapter>/assets/` 再由组件导入；禁止创建符号链接、目录联接或从章节代码直接跨目录引用素材库。

## 输入与边界

- `narration-pipeline/episodes/` 是任务包事实源，播放器不得读取它来补齐语义。
- 正式输入只来自 `episodes/<id>/inputs/`，不得从 `.tmp`、历史归档或旧 `output/` 猜测。
- `project.json` 是播放器实例状态；`planned` 允许没有 `src/entry.tsx`，只能显示为待制作，不能进入播放页。
- `in-progress` 与 `ready` 必须具备有效 `src/entry.tsx`。
- Phase 1 的唯一持久状态是 `script.md` 与 `outline.md`；它们由 runner 的 `init`、逐 A `commit-chapter` 和 `finalize` 管理。
- Phase 1 的项目级输入是 `project.json`、批准的 A-page v6、approved visual rough，以及 A-page 声明的批准口播；runner 同时读取并维护本集的 `script.md` / `outline.md` 正式状态，不读取 `narrations.ts`、`.tmp`、历史归档或 narration unit/binding sidecar。
- `narrations.ts` 是 Phase 2 章节实现后的 step 数和 TTS 文本来源，不是 Phase 1 的输入。
- 可选 handoff 的作者规则、canonical example 与错误索引见 [`docs/courseplay-handoff-v4-author-contract.md`](docs/courseplay-handoff-v4-author-contract.md)；handoff 不读取或验证 `narrations.ts`。

## 命令

```powershell
cd D:\00-workspace\005-coursewebvideo\player
pnpm dev
pnpm episode:check
pnpm courseplay:phase1 -- --help
pnpm courseplay:phase1 -- init --episode episode-04
pnpm courseplay:phase1 -- commit-chapter --episode episode-04 --a-page A001 --script <script-candidate.md> --outline <outline-candidate.md>
pnpm courseplay:phase1 -- finalize --episode episode-04
pnpm courseplay:phase1 -- status --episode episode-04
pnpm courseplay:phase1 -- resume --episode episode-04
pnpm courseplay:phase1 -- preflight --episode episode-04
pnpm courseplay:handoff -- --episode episode-04 --a-page A001
pnpm audio:extract -- --episode episode-04
pnpm audio:synthesize -- --episode episode-04 --provider edge
pnpm typecheck
pnpm lint
pnpm build
pnpm build:inspect
```

不得为单期创建独立 `package.json`、锁文件、`node_modules`、Vite 配置或开发服务器。

## 修改与验证

Phase 1 候选在临时位置创作，不得带有 runner marker；提交时 runner 会校验 Nx 无损还原、Beat/step 数量、A-page 顺序和稳定关系引用。`status` 发现 `incomplete` 时只重提受影响章节，不能手工修补另一份正式文件。

章节改动必须运行 `pnpm episode:check`、`pnpm typecheck`、`pnpm lint`；改动 `narrations.ts` 追加 `pnpm audio:extract -- --episode <id>`；共享运行时、主题或完整交付追加 `pnpm build`。

生产构建不得把 episode 媒体平铺到 `dist/assets/`。完整布局、缓存和部署约束见 `docs/media-build-layout.md`。

未经明确授权，不修改上游任务包、正式 inputs 或共享运行时契约。
