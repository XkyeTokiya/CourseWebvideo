# Player 控制面

本目录是 Courseplay Web Video 播放器子项目。所有播放器命令都从 `player/` 目录执行；单仓库根目录的跨项目规则见 `../CLAUDE.md`。

## 目录契约

```text
episodes/<episode-id>/
  project.json
  inputs/                         # 上游批准 handoff，只读消费入口
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
- `narrations.ts` 是 step 数和 TTS 文本的唯一真相源。

## 命令

```powershell
cd D:\00-workspace\005-coursewebvideo\player
pnpm dev
pnpm episode:check
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

章节改动必须运行 `pnpm episode:check`、`pnpm typecheck`、`pnpm lint`；改动 `narrations.ts` 追加 `pnpm audio:extract -- --episode <id>`；共享运行时、主题或完整交付追加 `pnpm build`。

生产构建不得把 episode 媒体平铺到 `dist/assets/`。完整布局、缓存和部署约束见 `docs/media-build-layout.md`。

未经明确授权，不修改上游任务包、正式 inputs 或共享运行时契约。
