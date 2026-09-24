# CourseWebvideo

CourseWebvideo 将课程内容编译、视觉设计、网页章节、音频和录屏放在一个 Git 仓库中。目前包含 51 集任务包与播放器实例；各期制作进度不同。

## 从哪里开始

- **上游内容与开发**：从仓库根目录开始，阅读 [根 CLAUDE.md](CLAUDE.md) 与 [上游约束](narration-pipeline/CLAUDE.md)。
- **下游制作与开发**：进入 `player/`，阅读 [Player 执行契约](player/CLAUDE.md)。主 Agent 再完整读取根规则；明确受委派的下游 subagent 以 Player 文件为 CLAUDE 主动阅读入口。
- **了解流程**：在浏览器打开 [生产主线说明](production-pipeline.html)；具体生产规则以当前 CLAUDE、Skill 和作者契约为准。

## 环境与本地启动

播放器使用 Node.js、pnpm、React、TypeScript 和 Vite。当前锁定依赖要求 Node.js `^20.19.0 || >=22.12.0`；工具测试还使用 `--test-isolation=none`，完整开发环境应选支持该参数的 Node.js 版本。仓库尚未用 `engines` / `packageManager` 固定完整工具链版本，安装时以锁文件及实际命令兼容性为准，不把 `@types/node` 版本当作运行时要求。

上游验证与发布工具需要 Python 3；示例使用 `python`，若系统只提供 `python3`，替换命令名。只预览播放器无需运行上游 Python 工具。

从仓库根目录执行（以下命令使用通用单行形式）：

```sh
cd player
pnpm install --frozen-lockfile
pnpm dev
```

默认打开 [本地 Studio](http://127.0.0.1:5174)，实际地址以终端输出为准。在 Studio 选择已进入制作的实例；`planned` 表示待制作，不能播放。首次制作某期时，先核对其 `project.json` 与正式 inputs，再按下游 Skill 进入 Phase 1，不直接跳到章节实现。

## 目录与数据流

```text
narration-pipeline/episodes/（冻结任务包）
  -> .tmp/work/narration-pipeline/<id>/（Brief、草稿、trace）
  -> 人工批准与验证
  -> player/episodes/<id>/inputs/（正式内容与最终验证报告）
  -> Phase 1 runner（init -> 按 A 提交 -> finalize）
  -> script.md + outline.md -> Checkpoint Plan
  -> src/ 章节制作 -> 音频 -> 录屏与交付
```

| 路径 | 用途 |
| --- | --- |
| `narration-pipeline/episodes/` | 只读任务包事实源 |
| `player/episodes/<id>/project.json` | 实例状态与配置 |
| `player/episodes/<id>/inputs/` | 上游正式发布入口 |
| `player/episodes/<id>/{script,outline}.md` | Phase 1 唯一持久计划状态 |
| `player/episodes/<id>/src/` | 章节组件、样式与 `narrations.ts` |
| `player/episodes/<id>/.handoffs/` | 可选单章交接缓存，不提交 Git |
| `player/episodes/_shared/covers/` | 标准封面库；`_shared` 不是实例 |
| `player/src/`、`player/tools/` | 共享播放器、Studio 与工具链 |
| `player/dist/` | 生产构建产物，不提交 Git |
| `.tmp/` | 根级过程文件、验证输出与日志，分区见根 CLAUDE |

以上是生产目标结构，待制作实例可能只有 `project.json`。下游不从任务包或临时文件补齐正式输入的语义。

## 正式输入与阶段

正式内容有三份：

1. `approved-spoken-text.txt`：用户批准的连续口播。
2. `episode-XX-a-page.json`：A-page v6；A 表示一页，Nx 是该页口播片段，screen guidance 描述页面语义与指导。
3. `episode-XX-visual-rough.md`：visual rough v4；描述视觉结构、页面配方、媒体需求与关系呈现。

两份对应的最终通过验证报告随产物发布到 inputs，作为治理证据，不作为章节创作素材或 Phase 1 运行依赖。中间报告、Brief 和 compile trace 的位置及发布步骤见 [上游发布约定](narration-pipeline/CLAUDE.md)。

上游依次完成 Brief、连续口播、用户批准、A-page 编译与验证、visual rough 创作与批准。下游由 runner 成对管理 script 与 outline，完成 Checkpoint Plan 后制作章节；可按需生成 handoff 来传递当前章节上下文。章节实现后的 `narrations.ts` 用于音频分段与 TTS，不是 Phase 1 输入。

人工放行节点为：连续口播批准、visual rough 批准、Checkpoint Plan、第 1 章完整版本验收、Checkpoint Audio。阶段规则与字段释义从以下入口读取：

- [A-page v6 作者契约](narration-pipeline/.agents/skills/rewrite-course-narration/references/a-page-v6-author-contract.md)
- [Visual rough v4 作者契约](narration-pipeline/.agents/skills/design-course-visual-rough/references/visual-rough-v4-author-contract.md)
- [下游生产 Skill](player/.agents/skills/web-video-presentation/SKILL.md)
- [可选 handoff v4 作者契约](player/docs/courseplay-handoff-v4-author-contract.md)

## 常用命令

以下均从 `player/` 执行；具体改动需要哪些检查，见 Player 执行契约。

| 命令 | 行为 |
| --- | --- |
| `pnpm episode:check` | 校验实例与章节数据 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | 检查共享 src 与 tools，当前不包含 episodes |
| `pnpm test:tools` | 工具链回归测试 |
| `pnpm build` | 实例检查、类型检查、生产构建与产物检查；输出 dist |
| `pnpm build:inspect` | 单独检查已有构建的归属、大小与 SHA-256 |
| `pnpm courseplay:phase1 -- --help` | runner 参数帮助 |
| `pnpm courseplay:handoff -- --help` | 可选交接包参数帮助 |
| `pnpm audio:providers` | 列出音频提供方 |

Phase 1 示例：将 `episode-XX` 替换为目标实例，按作者契约先在该期 work 目录准备候选内容；每个 A-page 都需要提交，之后才 finalize。

```sh
pnpm courseplay:phase1 -- init --episode episode-XX
pnpm courseplay:phase1 -- commit-chapter --episode episode-XX --a-page A001 --script ../.tmp/work/player/episode-XX/A001-script.md --outline ../.tmp/work/player/episode-XX/A001-outline.md
pnpm courseplay:phase1 -- finalize --episode episode-XX
```

候选文件不能包含 runner marker。恢复、中断和迁移处理见 [Phase 1 runner](player/docs/courseplay-phase1-runner.md)。

单期音频提取：

```sh
pnpm audio:extract -- --episode episode-XX
```

该命令从 `narrations.ts` 提取并覆盖该期 `audio-segments.json`。当前不要省略 `--episode`，以免扫描共享目录及其他实例。核对分段并取得音频合成批准后，再按下游 Skill 调用提供方。

标准构建使用 `player/dist/`；媒体按期次与类型隔离，详见 [媒体构建布局](player/docs/media-build-layout.md)。检查截图和试录使用 `.tmp/validation/<id>/`；正式录屏与成片写入任务指定交付目录，未指定时暂存本期 work 目录并说明位置。
