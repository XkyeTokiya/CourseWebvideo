# CourseWebvideo

CourseWebvideo 是一套面向课程视频的网页化生产工程，使用单一 Git 仓库串联内容编译、视觉设计、章节制作、音频处理和录屏交付。

项目的生产主线见 [production-pipeline.html](./production-pipeline.html)。直接在浏览器中打开该文件，可以查看完整的数据流、产物路由和人工门禁说明。

## 核心数据流

```text
冻结任务包
  -> narration-pipeline/episodes/
  -> .tmp/narration-pipeline/        # brief、草稿和追踪文件，不进 Git
  -> 人工批准与机器验证
  -> player/episodes/<id>/inputs/    # 三份正式内容产物
  -> player/episodes/<id>/src/       # 章节实现
  -> 预览、构建、录屏与后期
```

上游内容域和下游制作域共享一个 Git 根目录，但职责保持隔离：播放器只消费 `inputs/` 中经过批准和验证的正式输入，不反向修改任务包事实源。

## 目录结构

| 目录或文件 | 职责 |
| --- | --- |
| `narration-pipeline/` | 任务包、连续口播、A-page v6、visual rough v4 及其验证工具 |
| `narration-pipeline/episodes/` | 上游任务包事实源，保持只读 |
| `player/` | Courseplay 网页播放器、章节代码、工具链和测试 |
| `player/episodes/<id>/inputs/` | 下游唯一正式输入入口 |
| `player/episodes/<id>/src/` | 章节组件、样式和 `narrations.ts` |
| `.tmp/` | 过程文件和派生缓存，不提交 Git |
| `production-pipeline.html` | 生产主线的可视化说明页 |

## 上游正式产物

下游章节制作只消费以下三份正式内容产物：

1. `approved-spoken-text.txt`：用户批准的连续口播，决定整集实际说什么。
2. `episode-XX-a-page.json`：每页的 Nx、screen guidance、evidence、relations 和约束。
3. `episode-XX-visual-rough.md`：页面配方、G→U 映射、S/U/M 骨架、媒体需求和 R 关系载体。

验证报告用于治理和验收，不作为章节创作素材。`narration-brief.json` 与 compile trace 等过程文件保留在 `.tmp/narration-pipeline/`。

作者入口：A-page 使用 [A-page v6 作者契约卡](narration-pipeline/.agents/skills/rewrite-course-narration/references/a-page-v6-author-contract.md) 与 [合成示例](narration-pipeline/.agents/skills/rewrite-course-narration/references/examples/a-page-v6/)；visual rough 使用 [visual rough v4 作者契约卡](narration-pipeline/.agents/skills/design-course-visual-rough/references/visual-rough-v4-author-contract.md)、[合成示例](narration-pipeline/.agents/skills/design-course-visual-rough/references/examples/visual-rough-v4/) 和当前 recipe；章节 handoff 使用 [handoff v4 作者契约卡](player/docs/courseplay-handoff-v4-author-contract.md) 与 [合成示例](player/docs/examples/courseplay-handoff-v4/)。

## 标准生产阶段

生产主线按以下顺序推进：

1. Brief：冻结任务包，提炼内容义务和事实边界。
2. 连续口播：隔离生成自然连续稿。
3. 批准口播：用户确认后生成 `approved-spoken-text.txt`。
4. A-page v6：切分 Nx 并生成 screen guidance。
5. 编译追踪：追踪语义原子进入哪个 A/S，或记录省略原因。
6. A-page 验证：检查 schema、覆盖率、证据、关系和 trace。
7. Visual rough v4：确定视觉结构和媒体方案。
8. 下游 Phase 1：从 `inputs/` 生成 `script.md`、`outline.md` 和生产计划。
9. Checkpoint Plan：确认稿子、Outline、主题、素材和开发模式。
10. 可选单章交接：需要压缩上下文时生成 `.handoffs/Axxx.json`。
11. 章节制作：根据 handoff（如有）或等价的当前章节输入，完整创作章节画面。
12. 后续章节：按既定模式生产、审查和修复。
13. 音频：提取并在确认后合成音频分段。
14. 录屏与后期：完成预览、录屏和成片验收。

## 人工门禁

以下节点不能由自动化流程代替用户放行：

- 批准连续口播
- 批准 visual rough
- Checkpoint Plan
- 第 1 章完整版本验收
- Checkpoint Audio

具体字段和 `exact`/`reference` 语义以各阶段作者契约卡为准。

## 本地运行

播放器使用 Node.js、pnpm、React、TypeScript 和 Vite。

```powershell
cd player
pnpm install
pnpm dev
```

常用命令：

```powershell
pnpm episode:check       # 校验章节和 episode 数据
pnpm typecheck           # TypeScript 类型检查
pnpm lint                # 静态检查
pnpm test:tools          # 工具链测试
pnpm build               # 校验并构建生产版本
pnpm build:inspect       # 校验构建文件的归属、大小与 SHA-256
pnpm courseplay:phase1 -- --help  # 查看 Phase 1 编译与恢复命令
pnpm audio:extract       # 从 narrations.ts 提取音频分段
pnpm audio:providers     # 查看可用音频提供方
```

如需生成可选的单章 handoff，可在 `player/` 目录执行：

```powershell
pnpm courseplay:handoff -- --help
```

Courseplay Phase 1 runner 的命令、候选块契约、状态迁移和错误码见
[Courseplay Phase 1 runner](player/docs/courseplay-phase1-runner.md)。

## 生产约束

- `narration-pipeline/episodes/` 是事实源，不能由下游章节实现反向修复。
- 未经用户明确批准，不得生成批准口播文件或进入 A-page 阶段。
- `visual rough` 经用户审阅后再进入 approved，并作为章节制作输入。
- `inputs/` 只能放经过批准和验证的正式产物。
- `.handoffs/` 是派生缓存，不进入 Git。
- 音频合成前必须先确认分段文本和是否合成。
- 生产媒体按 `dist/media/episodes/<episode-id>/<kind>/` 隔离，禁止回退为 `dist/assets/` 平铺；规则见 `player/docs/media-build-layout.md`。

## 单集总状态控制面

`production-status/` 是跨上游、Player、音频和最终交付的进度工作台；`player/episodes/<episode-id>/project.json` 仍只负责 Player 下游章节状态。工作台的 `episodes/*.json` 与 `index.json` 是本地可重建投影，不是需要提交的事实源。

工作台在线模式通过 `/production-status/index.json` 按当前文件即时生成索引，一次加载全部剧集状态，避免逐集探测不存在的文件。运行 `node production-status/production-status.mjs index` 可手动重建本地索引；索引和每期快照均已加入 `.gitignore`。

工作台使用两类输入：

- `observations`：由磁盘事实同步的文件、验证结果、章节和音频数量；工具可以更新。
- `manual-approvals.json`：可选的轻量人工放行记录；它只影响进度显示，不承载生产内容。

常用命令从仓库根目录执行：

```powershell
node production-status/production-status.mjs init
node production-status/production-status.mjs sync --episode episode-01
node production-status/production-status.mjs check
node production-status/production-status.mjs report
```

### 一键启动工作台

双击仓库根目录的 `启动生产状态工作台.cmd`。它默认以 `D:\00-workspace\005-coursewebvideo\production-status` 作为状态数据目录，启动或复用本机服务后自动打开：

`http://127.0.0.1:8765/production-status/dashboard.html`

Linux/macOS 可执行仓库根目录的 `启动生产状态工作台.sh`；它会自动定位当前仓库、启动或复用本地服务，并尝试打开浏览器：

```bash
./启动生产状态工作台.sh
```

也可从仓库根目录手动启动：

```powershell
node production-status/production-status-server.mjs
```

服务仅绑定到本机 `127.0.0.1`，并托管仓库根目录，以便工作台可直接预览关联的阶段性文件。

`sync` 会从 `manual-approvals.json` 读取阶段放行记录，并重新生成本地 episode 状态。不要直接编辑 `production-status/episodes/*.json`；如果删除人工放行记录，工作台只会显示对应阶段尚未放行，不会影响任何正式生产文件。完整约定见 [`production-status/README.md`](production-status/README.md)。

状态推导规则：存在阻塞或验证失败为 `blocked`；存在待人工门禁为 `awaiting-approval`；最终视频已登记且 `finalDelivery` 已批准才是 `delivered`。因此总状态不会把下游局部完成误认为整期交付完成。
