# Agent Team 编制与边界（CourseWebvideo）

本文件是 Agent Team（`cline --team-name <name>`）在本仓库内的运行规则。协调者（lead）
必须先读完本文件，再按下面编制分工；任何 teammate 的 rolePrompt 不得与本文件冲突。

优先级：根 `CLAUDE.md` 的路由规则 → 子项目 `CLAUDE.md` → 各作者契约卡 / `SKILL.md`
→ 本文件。本文件只回答“谁做什么、能写哪里”，不重复契约细节。

## 0. 硬不变量（任何角色都不得违反）

- `narration-pipeline/episodes/**` 是任务包事实源，**只读**，不得为通过验证而修改它。
- 下游不得反向修复上游；`inputs/` 只能放“已批准 + 已验证”的正式产物，不得手改既有正式产物。
- Phase 1 唯一持久状态是 `player/episodes/<id>/script.md` 与 `outline.md`；禁止创建
  `state.json`、review receipt、临时 script blocks、`narration-units.json`、`narration-bindings.json`。
- 候选、草稿、compile trace 只写 `.tmp/narration-pipeline/<task>/episode-XX/`；不得污染 `inputs/`。
- 不提交 `.tmp/`、`dist/`、媒体文件、`.env`、凭据或密钥。**不读取、不解压 `.tmp/archives/`**。
- 不得为单期创建独立 `package.json`、锁文件、`node_modules`、Vite 配置或开发服务器。

## 1. 人工门禁（必须停，不得自行放行）

遇到以下任一节点，协调者必须把任务在看板标记为 `awaiting-approval` 并**停止**，等用户明确放行：

1. 批准连续口播 → 才可产出 `inputs/approved-spoken-text.txt`。
2. 批准 visual rough → 才可发布 `inputs/<id>-visual-rough.md`。
3. Checkpoint Plan（`script.md`/`outline.md` 完成后）。
4. 第 1 章完整版本验收。
5. Checkpoint Audio（合成音频前必须确认分段文本与是否合成）。

## 2. 角色与文件所有权（互斥，禁止并行冲突）

同一文件同一时刻只允许一个 owner；跨角色只通过 `inputs/`、`script.md`/`outline.md`
和任务看板交接。

| 角色 | 只读（禁改） | 只写（owner） | 必读 | 关键命令 |
| --- | --- | --- | --- | --- |
| `producer`（lead） | 全部事实源 | 任务看板、`.tmp/` 编排 | 根/子项目 `CLAUDE.md`、本文件 | 协调，不直接产出内容 |
| `narration-author` | `narration-pipeline/episodes/**` | `.tmp/narration-pipeline/...` → `inputs/approved-spoken-text.txt`、`inputs/<id>-a-page.json` | `rewrite-course-narration/SKILL.md`、`polish-stage1-narration/SKILL.md`、`humanizer-zh/SKILL.md`、a-page-v6 契约 | A-page 验证脚本 |
| `visual-designer` | 任务包、已批准口播、A-page | `inputs/<id>-visual-rough.md` + validation | `design-course-visual-rough/SKILL.md`、visual-rough-v4 契约、page recipes | `verify_visual_rough.py` |
| `planner` | `inputs/`、`project.json` | 仅经 runner 写 `script.md`/`outline.md` | `player/docs/courseplay-phase1-runner.md` | `pnpm courseplay:phase1 -- init/commit-chapter/finalize/status` |
| `chapter-builder` | `inputs/`、`script.md`/`outline.md`、共享运行时 | `episodes/<id>/src/**`（含 `narrations.ts`） | `web-video-presentation/SKILL.md`、`docs/media-build-layout.md` | `episode:check`、`typecheck`、`lint`、`audio:extract` |
| `verifier` | 全部（不写生产文件） | 仅 stdout / `.tmp` 报告 | 各契约卡、`player/tools/tests` | `episode:check`、`typecheck`、`lint`、`test:tools`、`build`、`build:inspect`、上游 verify 脚本 |
| `audio-operator` | `src/` | `episodes/<id>/media/audio/**`、`audio-segments.json` | `web-video-presentation/references/AUDIO.md` | `pnpm audio:extract`、`pnpm audio:synthesize` |

> 建议默认编制：`producer` + `narration-author` + `visual-designer` + `planner` + `chapter-builder`；
> `verifier` 在每个门禁前后各跑一次；`audio-operator` 按需临时拉起。

## 3. 角色职责摘要（rolePrompt 要点）

- **producer**：先按路由判断上游/下游/跨项目，再派发；维护看板；到达门禁必须停并标注
  `awaiting-approval`；不得自行放行任何门禁。
- **narration-author**：读只读任务包 → `.tmp` 产出 brief / Stage1 / 连续口播 → 编译 A-page v6
  （Nx 切分、screen guidance、evidence catalog、relations、compile trace）→ 跑 A-page 验证；
  批准口播必须等用户放行。不得写 `player/` 下除 `inputs/` 外的任何文件。
- **visual-designer**：按 v4 契约与 page recipes 产出配方、G→U 映射、S/U/M 骨架、媒体需求并验证；
  输出到 `.tmp`，经批准后才发布。不得触碰 A-page 与 `episodes/<id>/src`。
- **planner**：只用 runner 管理 `script.md`/`outline.md`；候选不带 runner marker，由 runner 校验
  Nx 无损还原、Beat/step 数量、顺序与稳定引用后原子提交；`status=incomplete` 时只重提受影响章节。
- **chapter-builder**：按当前章节输入实现 `src/`；素材复制到 `src/chapters/<c>/assets/`
  （禁止符号链接/跨目录引用）；改完必须验证。
- **verifier**：只验证不改生产文件，输出带路径的结论；发现越界（改事实源、旁路状态、媒体平铺）立即上报。
- **audio-operator**：先确认分段文本，Checkpoint Audio 放行后才合成。

## 4. 团队协作约定

- 队友（teammate）是可写 agent；subagent 只读，仅用于并行研究。
- 一个文件同一时间只有一个 owner；发现所有权冲突先停下报告，不要抢写。
- **小步增量产出**：队友先落骨架文件、再分次补全，不要把整份长文档压在单轮里生成。
  实测单轮内逐字起草长 JSON/Markdown 会耗时数分钟到十几分钟；分次写文件既快又可观察、可恢复。
- 章节内容只经 Phase 1 runner 提交，禁止手写 `script.md`/`outline.md`。
- 每个可交付改动都必须附验证命令与结果；未验证的改动视为未完成。
- 团队状态持久化在 SQLite `~/.cline/data/db/teams.db`（表 `team_tasks` / `team_runs` /
  `team_outcomes` / `team_events` / `team_runtime_snapshot`）。**看板键是 lead 的 session id，
  不是 `--team-name`**：`--team-name` 只写进 `sessions.db.team_name` 作逻辑名；实测同名重跑
  会开一个**空看板**，不续旧任务（详见 `docs/agent-team-allocation.md` §6.1）。
- 无头运行请加 `--json`：styled 输出在重定向到文件时可能长时间不刷新，`--json` 逐事件流式
  写入，便于用脚本观察团队进度（见 `docs/agent-team-allocation.md` §6）。
- 观测用量：交互式看板用 `cline kanban`，浏览器面板用 `cline dashboard`，会话列表用
  `cline history`，本轮 token/耗时/费用用 `cline -v "<prompt>"`（结束时打印
  `finished (N iterations)` 与 `Xs | N in, N out, N cache read | $X est. cost`），
  分 agent 汇总用 `python3 scripts/team_report.py --sessions`。
- **禁止用 `pkill -f` 清理 cline 进程**：匹配二进制路径或子命令名会命中运行 agent 自身的
  进程并中断本次任务（`[c]` 括号技巧只防命令行自匹配，防不住 agent 自身 cmdline）。查看用
  `cline doctor`，清理用 `cline doctor fix`；必须精确定位时先 `pgrep` 拿 PID 再按 PID `kill`。
- **任务与队友的"继承"只能靠续接同一 session**：看板/队友状态键 = lead 的 session id，
  仅 `cline -i --id <完整 sessionId>`（TUI）可带回。**续接是热恢复，会立刻接着干活并可能覆写
  `.tmp` 产物**；无头不可用（`--id` 需要 TTY）。详见 `docs/agent-team-allocation.md` §6.2。
