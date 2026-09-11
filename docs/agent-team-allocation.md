# Agent Team 编制说明（CourseWebvideo）

本文件说明本仓库如何用 Cline Agent Team（`cline --team-name <name>`）拆分生产工作。
运行规则以根目录 [`.clinerules/team-roles.md`](../.clinerules/team-roles.md) 为准，本文件补充
理由、角色卡全文与启动命令。

## 1. 为什么这样切

仓库天然是三段式、职责隔离：

| 工作域 | 目录 | 性质 |
| --- | --- | --- |
| 上游内容 | `narration-pipeline/` | 任务包（只读）→ 口播 → A-page v6 → visual rough v4 → 验证 |
| 下游制作 | `player/` | Phase 1 runner → `script.md`/`outline.md` → `src/` 章节 → 音频 → 构建 |
| 跨项目 | 根 `docs`、`scripts/` | 治理、迁移（可重建，非事实源） |

因此分工按“文件所有权互斥”切，而不是按“步骤”切，避免并行队友互相覆盖。
唯一的结构角色是 lead / teammate；每个 teammate 的“职责”由协调者写入 `rolePrompt`。

## 2. 推荐编制

| Agent | 一句话职责 | owner 路径 |
| --- | --- | --- |
| `producer`（lead） | 路由、派发、看板、门禁把关 | 任务看板、`.tmp/` 编排 |
| `narration-author` | 口播润色 → 批准口播 → A-page v6 | `inputs/approved-spoken-text.txt`、`inputs/<id>-a-page.json` |
| `visual-designer` | visual rough v4 | `inputs/<id>-visual-rough.md` |
| `planner` | Phase 1 runner 规划 | `script.md`、`outline.md`（仅经 runner） |
| `chapter-builder` | 章节实现 | `episodes/<id>/src/**` |
| `verifier` | 全链机械验证 | 仅报告 |
| `audio-operator` | 音频提取/合成 | `media/audio/**`、`audio-segments.json` |

## 3. 角色卡（rolePrompt 全文）

**producer（lead）**
> 你是 CourseWebvideo 的生产协调者。开始前先读根 `CLAUDE.md`、对应子项目 `CLAUDE.md` 与
> `.clinerules/team-roles.md`，判断任务属于上游/下游/跨项目再派发。维护任务看板，保持文件
> 所有权互斥。严格遵守硬不变量：任务包只读、下游不得反向修复上游、`inputs/` 只放批准+验证过的
> 产物、Phase 1 唯一持久状态是 `script.md`+`outline.md`。遇到任一个人工门禁必须停并在看板标记
> `awaiting-approval`，不得自行放行。

**narration-author**
> 只负责上游内容。读只读任务包，在 `.tmp/narration-pipeline/<task>/episode-XX/` 产出
> narration-brief 与 Stage1/连续口播草稿，再编译 A-page v6（Nx 切分、screen guidance、
> evidence catalog、relations、compile trace）并运行 A-page 验证脚本。产出批准口播必须等用户
> 在门禁放行。不得改任务包，不得写 `player/` 下除 `inputs/` 外的任何文件。

**visual-designer**
> 只做 visual rough v4。按 `visual-rough-v4-author-contract.md` 与 page recipes 产出页面配方、
> G→U 映射、S/U/M 骨架、S/U/M 媒体需求，并运行 `verify_visual_rough.py`。输出先落 `.tmp`，经
> 用户批准后才发布到 `inputs/`。不得触碰 A-page 与 `episodes/<id>/src`。

**planner**
> 只运行 Phase 1 runner：`pnpm courseplay:phase1 -- init/commit-chapter/finalize`。候选内容在
> 临时位置创作且不带 runner marker，由 runner 校验 Nx 无损还原、Beat/step 数量、A-page 顺序与
> 稳定关系引用后原子提交。绝不手写 `script.md`/`outline.md`，绝不创建旁路状态文件。`status` 报
> `incomplete` 时只重提受影响章节。

**chapter-builder**
> 只按当前章节输入（`script.md`/`outline.md` 或 `.handoffs/Axxx.json`）实现
> `episodes/<id>/src/` 下的章节组件与 `narrations.ts`。素材必须复制到
> `src/chapters/<c>/assets/`（禁止符号链接/跨目录引用）。改完必须跑
> `pnpm episode:check && pnpm typecheck && pnpm lint`；改 `narrations.ts` 追加 `audio:extract`。
> 不得改 `inputs/` 或共享运行时契约。

**verifier**
> 只做验证、不改生产文件。下游跑 `episode:check`、`typecheck`、`lint`、`test:tools`，涉及共享
> 运行时/主题/交付再加 `build` + `build:inspect`；上游跑对应 verify 脚本。输出带证据路径的结论；
> 发现违反事实源边界、旁路状态或媒体平铺立即上报。

**audio-operator**
> 先确认分段文本，等用户在 Checkpoint Audio 放行后才执行 `audio:extract` 与 `audio:synthesize`。
> 只写 `media/audio/` 与 `audio-segments.json`，不改章节源码。

## 4. 启动命令

```bash
cd <coursewebvideo 仓库根>

# 单集生产（示例：episode-36）
cline --team-name episode-36 "按根 CLAUDE.md 与 .clinerules/team-roles.md 路由，组建团队推进
  episode-36：先核对任务包与当前状态，在上游 .tmp 产出 brief 与连续口播草稿；
  人工门禁处停下等我确认。不要修改任何生产文件。"

# 续做：`--team-name` 只是逻辑名，重跑会开一个「新看板」（见 §6.1），不会续旧板。
# 接着同一个「会话」往下走请用 TUI：cline -i --id <sessionId>
cline --team-name episode-36 "继续未完成任务：产物在 .tmp/narration-pipeline/agent-team-trial/
  episode-36/，先核对现状再推进"

# 仓库工具维护
cline --team-name repo-tooling "只动 player/tools 与其测试，改完跑 pnpm test:tools。"
```

## 5. 不交给 agent 的部分

1. 五个人工门禁的放行决定。
2. 修改事实源 `narration-pipeline/episodes/**`。
3. 读取或解压 `.tmp/archives/`。
4. 手改 `inputs/` 中既有正式产物。
5. 提交 `.env`、`.tmp/`、`dist/`、密钥、派生 JSON。

## 6. 团队状态与排错

- 团队状态持久化在 SQLite：`~/.cline/data/db/teams.db`，表 `team_tasks`（看板）、
  `team_runs`（队友运行）、`team_outcomes`、`team_events`、`team_runtime_snapshot`。
  **`team_tasks.team_name` 存的是 lead 的 session id**（形如 `<13位毫秒>_<5位随机>`），
  不是 `--team-name`；按 `--team-name` 查会查不到（见 §6.1）。
  直接查：`sqlite3 ~/.cline/data/db/teams.db "select task_id,status,assignee,title from team_tasks;"`
- 会话记录：`~/.cline/data/sessions/<sessionId>/<sessionId>.messages.json`（ground truth，
  含每条 assistant 消息的 `metrics` 用量）。
- 查看会话：`cline history`（实测**无需 TTY**，无头可用；显示时间/模型/状态/费用/首句）。
- 无头/脚本运行：`cline --json --auto-approve true --timeout <秒> "<prompt>"`。
  **务必加 `--json`**：styled 输出重定向到文件时可能长时间不刷新，看起来像“卡死”；
  `--json` 输出为逐行 JSON 事件（`hook_event` / `agent_event` / `run_result`），其中
  `content_start`+`contentType=tool` 带 `toolName`/`input`，`content_end` 带 `output`，
  `done` 表示结束，非常适合后台跑 + 脚本跟踪。
- 实测（3.0.61，ep36 试跑）：`team_task create`、`team_spawn_teammate`（返回
  `{"agentId":"narration-author","status":"spawned"}`）、`spawn_agent`（只读 subagent，
  `parentAgentId` 为 lead）、`team_mission_log`、`team_await_runs` 在无头 `--json` 模式下均可用。
- 禁用团队：更新版本支持 `--no-teams`；当前 3.0.61 未提供该开关，改用不带 `--team-name` 运行。

### 6.1 怎么看看板、怎么看用量（实测 3.0.61）

| 想要 | 命令 | 说明 |
| --- | --- | --- |
| 独立看板 App（**≠ 团队看板**） | `cline kanban` | 实测：会 npm 全局安装第三方 `kanban@latest`（安装后约 **943 MB**）并起 web 服务 `http://127.0.0.1:3484/<repo>`，还会拉起一个 Claude 侧栏 agent。它管的是 git worktree 里的编码 agent，**与 `team_tasks` 团队看板无关**，别用它看团队进度 |
| 浏览器面板 | `cline dashboard [--no-open] [--port N]` | 实测可启动（HTTP 200）；是 Hub 面板（会话/运行视角），连 `ws://127.0.0.1:25463/hub`；**未验证**其是否呈现 `team_tasks` 团队看板 |
| 会话列表 | `cline history [--limit N] [--json]` | 无头可用；每行 时间 / `provider:model` / 状态 / 费用 / 首句 |
| **本轮用量（最直观）** | `cline -v "<prompt>"` | 结束时打印 `finished (N iterations)` 与 `0.65s \| 7220 in, 1 out, 7040 cache read \| $0.00 est. cost` |
| 看板 + 分 agent 用量 | `python3 scripts/team_report.py --sessions` | 本仓库脚本，读 `teams.db` + `sessions.db` + `messages.json` |
| 原始表 | `sqlite3 ~/.cline/data/db/teams.db "select task_id,status,assignee,title from team_tasks;"` | 看板原始行 |
| 进程体检/清理 | `cline doctor` / `cline doctor fix` | 查看/清理僵尸 hub、sidecar、残留 CLI 进程 |

**四个已实测的坑：**

1. **`--team-name` 不是看板键。** 看板键是 lead 的 session id；`--team-name` 只写进
   `sessions.db.team_name`。实测：`--team-name episode-36` 重跑后调 `team_status`，返回**空看板**
   （"只有 1 名成员（lead，idle），没有任何待办/进行中/阻塞/已完成任务"）。
   → **同名重跑 = 新板（旧板不丢，仍留在 teams.db 里，脚本会按逻辑名标出来）。**
2. **`--id` 不能与 `--json` 同用。** `cline --id <sessionId> --json "..."` 一律报
   `JSON output mode requires a prompt argument or piped stdin`（传参、管道都试过）。
   续会话只能走 TUI：`cline -i --id <sessionId>`。
3. **模型会漂移。** 同一条命令未固定模型时，一次重跑选中 `openai-codex:gpt-5.6` 并整轮失败
   （`The 'gpt-5.6' model is not supported when using Codex with a ChatGPT account.`）。
   无头跑请显式 `-m <model> -P <provider>`。
4. **`cline kanban` 不是团队看板。** 随装 README 只写"外部 kanban 应用，首次运行自动安装"。
   实测它会 npm 全局安装 `kanban@latest`（`~/.local/bin/kanban`，约 943 MB），起一个 web 服务
   在 `http://127.0.0.1:3484/<repo>`，并拉起一个 **Claude Code 侧栏 agent** 进程；它服务的是
   "用 git worktree 并行跑编码 agent" 的独立工作流，与 `team_tasks` 无关。要看本仓库团队看板，
   用 `scripts/team_report.py` 或直接查 teams.db；想启用该 App 请自行评估 943 MB 与额外 agent 进程。
   终止：先 `pgrep -af '[k]anban'` 找到 PID，再按 **PID** `kill`（它启动的子进程用 `timeout` 收不掉）。

**用量数据的四个来源**（按可靠度排序）：

- `~/.cline/data/sessions/<sessionId>/<agent>.messages.json` → 每条 assistant 消息的
  `metrics{inputTokens,outputTokens,cacheReadTokens,cacheWriteTokens}`；lead、subagent、
  teammate 三类文件都有，可逐轮加总（`scripts/team_report.py` 即用此源）。
- `teams.db.team_events` → `event.type='usage'`（逐轮增量与累计）与 `task_end` / `done`（队友总计）。
- `--json` NDJSON 的 `run_result` / `aggregateUsage` → 本次进程级总计（口径比逐轮加总大，
  实测 `inputTokens` 约为 2 倍，别与逐轮数字混用）。
- `cline -v` → 单行人类可读总计。

**清理进程不要用 `pkill`。** 实测：`pkill -f 'cli-linux-x64/bin/cline'` 会匹配到运行 agent
自身的进程并把本次任务打断（命令行的括号技巧只防自匹配，防不住 agent 自身 cmdline 里的
真实二进制路径）。统一用 `cline doctor fix`。

### 6.2 上一轮的任务与队友能不能"继承"？（实测 3.0.61）

**结论：能，但只有一条通道 —— 人工在 TUI 里续接同一个 session，而且是"热恢复"。**

| 想继承 | 能否 | 依据 |
| --- | --- | --- |
| 看板任务（`team_tasks`） | ✅ 续接同一 session 后可见 | 续接后 agent 开口就是 "I'll resume `task_0003` by re-dispatching the author"，并真的重派了该任务 |
| 队友名册与 rolePrompt | ✅ 随 session 一并加载 | `team_runtime_snapshot.teammates_json` 存着完整 rolePrompt + modelId（本集 1849 字符） |
| run 序号 | ✅ 延续 | 重派拿到 `run_00002`（上一轮是 `run_00001`） |
| 会话上下文 | ✅ 完整回放 | TUI 续接后可见上一轮全部工具调用与结果 |
| **按 `--team-name` 继承** | ❌ | 同名重跑得到**空看板**（见上一条） |
| **无头继承** | ❌ | `--id` + `--json` 报 `JSON output mode requires a prompt argument or piped stdin`；`--id` 单用报 `interactive mode requires a TTY` |
| **单独"恢复"某个 subagent/teammate** | ❌ 无此入口 | 只能按 rolePrompt 重新 spawn（rolePrompt 可从 snapshot 原样复用）；其历史在 `sessions/<sid>/<agent>.messages.json` |

**唯一通道：**

```bash
cline -i --id <leadSessionId>       # 必须用【完整】session id（19 字符）
                                     # 用 substr(...,1,18) 截断会报 Error: Unknown session
```

**两个实测风险：**

1. **热恢复会立刻继续干活。** 续接后 agent 保留"我正卡在 task_0003"的自我认知，会**直接重派队友**。
   实测：即便提示词写明"不要修改或创建任何文件、不要调用写工具"，它仍重派了 narration-author，
   而该队友的职责就是**覆写** `.tmp/.../episode-36/stage1-narration.md`
   → **续接会覆盖你手工改过的产物。**（本次已及时制止，产物保持 6005 B 未被改写。）
2. **强杀会留孤儿行。** 强行终止后续接到的那个 run 会永远停在 `running`（实测 `run_00002`，
   `heartbeat_at` 停在被杀时刻），因为运行状态只在进程内维护、不会回写。

**实践建议：** 不要把看板当持久事实源。要"继承"上一轮成果，**靠文件最稳** —— 在新 run 的任务书里
写明"先读 `.tmp/narration-pipeline/<task>/episode-XX/` 的现有产物，不要重写"。文件在磁盘上谁都能读；
看板与队友状态只在续接同一 session 时才回来。

## 7. 无头试跑模板

```bash
cd <coursewebvideo 仓库根>
# 1) 写任务书
cat > .tmp/team-task.txt <<'EOF'
<你的任务书：目标集、范围、硬约束、停止点、收尾输出格式>
EOF
# 2) 后台跑，NDJSON 落盘
setsid cline --team-name episode-36 --json --thinking medium --timeout 900 \
  "$(cat .tmp/team-task.txt)" < /dev/null > .tmp/team-ep36.json 2>&1 &
# 3) 跟踪：只打印工具调用与结束事件
python3 - <<'PY'
import json
for line in open('.tmp/team-ep36.json', errors='ignore'):
    if not line.startswith('{'): continue
    e = json.loads(line); ev = e.get('event', {})
    if e.get('type') == 'agent_event' and ev.get('type') == 'content_end' and ev.get('contentType') == 'tool':
        print(e['ts'][11:19], ev.get('toolName'), str(ev.get('output'))[:100])
    if e.get('type') == 'agent_event' and ev.get('type') == 'done':
        print('DONE', ev.get('reason'))
PY
```

要点：`--team-name` 只是团队逻辑名，**不续看板**（重跑开新板，见 §6.1）；无头跑请显式
`-m <model> -P <provider>` 固定模型（实测未固定时会漂移到不可用模型导致整轮失败）；
`--thinking medium` 比 `high` 明显更快；`--timeout` 作为硬上限兜底（到达即中止，不会无限等待）。

## 8. 试跑记录：episode-36（2026-09-11）

任务：核对 ep36 状态 + 派 `narration-author` 在 `.tmp` 产出 brief 与 Stage 1 连续稿，
停在人工门禁「批准连续口播」。

| 项 | 结果 |
| --- | --- |
| 团队 | `--team-name episode-36`，teamId `<teamId>` |
| 看板 | `task_0001` 侦察=completed、`task_0002` 只读契约核对=completed、`task_0003` 作者任务=in_progress、`task_0004` 人工门禁=in_progress |
| 队友 | `narration-author`（`team_spawn_teammate` → `{"status":"spawned"}`），由 `run_00001` 调度 |
| 子代理 | 只读 `recon-contracts`（`spawn_agent`，`parentAgentId` = lead），按时返回结构化结论 |
| 协作工具 | `team_status`、`team_task`、`team_spawn_teammate`、`spawn_agent`、`team_mission_log`、`team_await_runs` 全部可用 |
| 产物 | `.tmp/narration-pipeline/agent-team-trial/episode-36/narration-brief.json`（9416 B；7 条内容义务 / 13 条静默护栏 / 0 冲突）与 `stage1-narration.md`（5842 B / 1982 字符） |
| run_00001 用量 | 7 轮，输入 445,903 / 输出 30,131 tokens（cacheRead 375,424） |
| 结束方式 | 触发 `--timeout 900`，`finishReason=aborted`（产物已落盘，最后一步看板收尾未完成） |
| 边界 | ✅ 试跑期间 `player/`、`narration-pipeline/`、`scripts/` 无任何文件被修改；ep36 仍只有 `project.json` |

### 结论与调优建议

1. **机制可用**：无头 `--json` 模式下团队建队、看板、队友 spawn、只读 subagent、
   mission log、`await_runs` 全部按预期工作；队友确实能写文件且只看守自己的路径。
2. **必须加 `--json`**：styled 输出重定向到文件时会长时间不刷新，曾被误判为“卡死”；
   `--json` 可逐事件跟踪。
3. **单轮可能极长**：产出 brief 的那一轮，模型在 reasoning 里逐字起草 JSON，耗时 ~9 分钟。
   建议给队友更小的任务书（先落骨架文件再增量补全），并把 `--timeout` 放宽到 1800s 以上，
   或按 `.clinerules/team-roles.md` §4 的“小步增量产出”约定执行。
4. **`--thinking medium` 明显更快**；`high`/`xhigh` 在长文档产出上收益不抵耗时。
5. 超时中止会留下 `in_progress` 看板项。**同名 `--team-name` 重跑不会接上这条旧看板**
   （见 §6.1）：重跑即新板，旧的 `in_progress` 行作为历史留在 teams.db 里，用
   `python3 scripts/team_report.py` 按逻辑名查看后人工收口。

### 复测：看板与用量观测（同日）

同一集用同一条命令复测，得到下面几条**修正性**结论（已写入 §6.1）：

| 项 | 结论 |
| --- | --- |
| `--team-name` 语义 | `--team-name episode-36` 重跑后 `team_status` 返回**空看板**；看板真键是 lead 会话 id（即 `~/.cline/data/sessions/<leadSessionId>/`） |
| `--id` 续做 | `--id <sessionId>` **不能**与 `--json` 同用（报 `JSON output mode requires a prompt argument or piped stdin`）；续会话用 `cline -i --id <sessionId>` |
| 模型稳定性 | 未固定模型的重跑一次选中 `openai-codex:gpt-5.6` 并整轮失败；固定 `-m deepseek-flash -P deepseek` 后正常（`finishReason=completed`） |
| 看板入口 | **`cline kanban` 不是团队看板**（实测：装第三方 `kanban@latest` 约 943 MB + web 服务 `:3484` + Claude 侧栏 agent，服务 worktree 编排工作流）；`cline dashboard --no-open --port 4123` 实测 HTTP 200（Hub 面板）；`cline history` 无头可用且带费用列。团队看板用 `scripts/team_report.py` |
| 用量入口 | `cline -v "<prompt>"` → `[0.65s \| 7220 in, 1 out, 7040 cache read \| $0.00 est. cost]`；`scripts/team_report.py` 出分 agent 表 |
| 进程清理 | 用 `cline doctor` / `cline doctor fix`；**曾用 `pkill -f 'cli-linux-x64/bin/cline'` 误杀运行 agent 自身进程** |

**按 agent 的用量（源：`messages.json` 的 `metrics` 逐轮加总）**

| agent | 轮次 | input | cacheRead | output |
| --- | --- | --- | --- | --- |
| lead（本集 lead 会话） | 7 | 223,732 | 191,744 | 8,481 |
| subagent（只读侦察） | 2 | 12,451 | 4,480 | 4,596 |
| teammate `narration-author` | 8 | 222,171 | 183,680 | 21,650 |
| **合计** | 17 | **458,354** | **379,904** | **34,727** |

- 队友合计与 `teams.db` 里 `task_end.usage` 完全一致（222,171 / 21,650），两个源互为校验。
- `--json` NDJSON 的 `run_result` 报的 `inputTokens=445,903 / output=30,131` 是**另一套口径**
  （约为逐轮加总的 2 倍），不要与上表混用。
- 新增脚本：`scripts/team_report.py`（看板 + 分 agent 用量 + 最近会话，只读不写）。


