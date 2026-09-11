# Kanban 生产流程

本文件说明如何用 **Kanban 看板**驱动 CourseWebvideo 的生产主线。看板只承担「执行与门禁」；
流程本身定义在仓库里，可复用于任意一集。

相关文档：[`agent-team-allocation.md`](agent-team-allocation.md)（Agent Team 编制与实测结论）、
[`../.clinerules/team-roles.md`](../.clinerules/team-roles.md)（硬不变量与人工门禁）。

## 1. 定位

- **流程的单一事实源在仓库**：`scripts/coursewebvideo-pipeline.json`（阶段、门禁、prompt 模板）。
- **看板是流程的一个实例**：`scripts/kanban_pipeline.py` 按流程定义为目标集生成卡片并串依赖。
- 看板可以随时清空重建，**流程不会丢**。

之所以要自己实现实例化：Kanban 本身**没有流程 / 模板概念**（其实现中 `pipeline` / `workflow` /
`stage` / `phase` 计数均为 0），只有「卡片 + 依赖边」；也没有「一集一板」——**一个仓库路径对应一块看板**。

## 2. 前置条件

1. **安装并启动 Kanban**（首次运行会自动全局安装外部 `kanban` 应用）：
   ```bash
   cd <repo-root>
   cline kanban          # 或： kanban --no-open --port 3484 --skip-shutdown-cleanup
   ```
   浏览器访问 `http://127.0.0.1:3484/<workspaceId>`。`workspaceId` 由仓库目录名派生，
   可用 `cat ~/.cline/kanban/workspaces/index.json` 查看。
2. **该应用是独立工具**：它按 git worktree 隔离任务，与 Cline 的 Agent Team 看板（`team_tasks`）无关，
   两者不要混用。
3. **治理文件必须已在默认分支上**：任务工作区从 `defaults.baseRef` 分叉，
   若 `.clinerules/`、`scripts/` 不在该分支上，卡片里的 agent 读不到规则。
4. `gh` CLI 已登录（用于开 PR；合并必须走 PR）。

## 3. 流程总览

12 个阶段、4 道人工门禁，**止于音频与录屏之前**（阶段 13/14 不在本流程内）：

| # | 阶段 | 域 | 门禁 |
| --- | --- | --- | --- |
| 01 | 冻结任务包 | 上游 | — |
| 02 | Brief 提炼 | 上游 | — |
| 03 | 批准口播 | 上游 | **门禁 1** `narration` |
| 04 | A-page v6 编译 | 上游 | — |
| 05 | 编译追踪 | 上游 | — |
| 06 | A-page 验证 | 上游 | — |
| 07 | Visual rough v4 | 上游 | **门禁 2** `visualRough` |
| 08 | 下游 Phase 1 runner | 下游 | — |
| 09 | Checkpoint Plan | 下游 | **门禁 3** `checkpointPlan` |
| 10 | 可选单章交接 | 下游 | — |
| 11 | 第 1 章完整制作 | 下游 | **门禁 4** `firstChapter` |
| 12 | 第 2～N 章与验收 | 下游 | — |

阶段与门禁的出处：[`../README.md`](../README.md) 的「标准生产阶段 / 人工门禁」、
[`../production-pipeline.html`](../production-pipeline.html)。

**门禁语义**：门禁卡不做放行动作，只把待确认清单交给用户并停在 `review` 列；
必须由用户亲自放行，任何自动化不得越过。

## 4. 文件构成

| 文件 | 作用 |
| --- | --- |
| `scripts/coursewebvideo-pipeline.json` | 流程定义：`stages[]`（含 `zone` / `gate` / `prompt` 模板）、`defaults`、`delivery`、`commonConstraints` |
| `scripts/kanban_pipeline.py` | 实例化器：`seed` / `remove` / `status`，只调用 `kanban task` 公开 CLI |
| `~/.cline/kanban/workspaces/<workspaceId>/board.json` | 看板状态（Kanban 的权威存储，不要手工改） |

## 5. 快速开始

```bash
cd <repo-root>

# 为某一集建卡（幂等：已存在的阶段卡会跳过）
python3 scripts/kanban_pipeline.py seed --episode 37

# 只看计划，不写看板
python3 scripts/kanban_pipeline.py seed --episode 37 --dry-run

# 只补某几个阶段
python3 scripts/kanban_pipeline.py seed --episode 37 --only 04,05,06

# 看板现状（按集分组，含所在列）
python3 scripts/kanban_pipeline.py status

# 清掉某一集的卡
python3 scripts/kanban_pipeline.py remove --episode 37 --dry-run
python3 scripts/kanban_pipeline.py remove --episode 37

# 清空整块看板（Kanban 原生命令）
kanban task delete --column backlog --project-path <repo-root>
```

参数要点：

- **`--episode` 必填，没有默认值**：可写 `37` / `ep37` / `episode-37`，统一规范化为 `episode-37`；
  缺省时脚本直接报错退出（退出码 2）。
- `--order reverse|forward`：默认 `reverse`（先建末段）。这是为了抵消 Kanban「**新卡前插**」的行为，
  让看板列自上而下读作 01→12。
- agent / provider / model / reasoning / baseRef / autoReviewMode 取自流程定义 `defaults`，
  可用同名命令行参数临时覆盖。
- 脚本**从不调用 `task start`**，也不会写仓库内任何文件。

## 6. 卡片结构

卡片标题：`<episodeId>-<阶段号> <阶段名>`，例如 `episode-37-04 A-page v6 编译`。

每张卡的 prompt = **阶段指令** + **统一的交付约束块**（由 `commonConstraints` 模板渲染）：

```text
[episode-37-04] A-page v6 编译

<阶段指令：前置门禁 · 依据的契约卡 / 输出路径 · 禁止事项 · 完成即停>

【交付与合并约束（每张卡都必须遵守）】
- 本仓库 main 分支受保护：禁止直接 commit 或 push 到 main；任何要落地的改动必须新建分支并通过 PR 合并。
- kanban 的任务 worktree 是 detached HEAD（没有分支）：动手提交前先 `git checkout -b <type>/episode-37-04`。
- 未 push 的工作会随 worktree 清理而丢失：收尾前必须 push 分支并开 PR；本阶段确实没有产出的，明确说明后停下。
- 禁止提交 .tmp/、dist/、媒体文件、.env、凭据或密钥。
- 只提交本阶段实际改动的路径，不要把无关的既有改动一起提交。
- 放行由人类完成：人类在 kanban 里使用 Open PR，不要使用 Commit。
```

prompt 首行 `[<episodeId>-<阶段号>] <阶段名>` 是脚本的**幂等标记**，`status` 也靠它分组，
所以不要在流程定义里改动这个前缀格式。

## 7. 看板行为说明（写卡前必须知道）

| 行为 | 事实 | 对使用的影响 |
| --- | --- | --- |
| 列 | 固定 4 列：`backlog` / `in_progress` / `review` / `trash(Done)`，**没有阶段列** | 阶段靠标题前缀区分；`review` 就是人工门禁列 |
| 新建卡位置 | 新卡**前插**到列顶 | 所以脚本按 `--order reverse` 建卡 |
| 依赖方向 | `--task-id` 等待 `--linked-task-id`；**箭头指向 `--linked-task-id`（前置）** | 箭头语义是「我在等谁」，不是流程方向 |
| 自动启动 | 前置完成（从 `review` 移出）后，等待中的 `backlog` 卡变为可启动 | 门禁靠人工，自动启动只是便利 |
| 任务工作区 | `git worktree add --detach` → **detached HEAD，没有分支** | 提交前必须自己 `git checkout -b` |
| gitignored 路径 | `.tmp/`、`node_modules`、`.local-status/` 等被 **symlink 进工作区**（与主树共享，非隔离） | `.tmp` 草稿不会随 worktree 删除而丢；但并行卡会共用同一 `.tmp` |
| 卡片会话 | 按 `taskId` 绑定会话并持久化 | 卡片在 `review` 停后再继续，**上下文保留**；重启 Kanban 也能续 |
| `task list` | **不返回卡片标题** | 核对标题要读 `board.json`，或用本脚本的 `status` |

## 8. 交付与合并策略

- **`main` 受保护，只能通过 PR 合并**；禁止直接 commit / push 到 `main`。
- 卡片一律以 **`--auto-review-mode pr`** 建立，且**自动交付始终关闭**
  （`autoReviewEnabled=false`）——即使误操作，默认路径也是 PR 而非直接提交。
- 人类放行后，在 Kanban 界面使用 **Open PR**，**不要使用 Commit**（Commit 会试图直接落到 `main`）。
- 提交纪律：只提交本阶段实际改动的路径；`.tmp/`、`dist/`、媒体文件、`.env`、凭据禁止入仓。

## 9. 已知限制

1. **一个仓库路径 = 一块看板**，做不到「一集一板」。51 集全铺会得到 51×12 = 612 张卡，
   只能靠标题前缀区分。建议**串行复用**：一次只在板上放当前那一集的卡，
   做完 `remove --episode NN` 再放下一集。
2. **没有流程 / 模板概念**：复用只能靠本仓的流程定义 + 实例化脚本。
3. **`task list` 不返回标题**：脚本用 prompt 首行的 `[episodeId-阶段号]` 标记来识别、去重与分组。
4. **4 列固定**：只能从卡片所在列（backlog / In Progress / Review / Done）看进度，不能按阶段分列。
5. **门禁卡不要自动启动**：放行是人的决定，门禁卡只负责把待确认清单交出来并停在 `review`。
6. **`task done` / `trash` 会清理任务工作区**：被跟踪路径上的改动若未 push 就会丢失；
   `.tmp/` 等 gitignored 路径因为被 symlink 共享，不会丢。
7. **Kanban 是独立第三方应用**（首次安装约 943 MB），与 Cline Agent Team 看板（`team_tasks`）无关，两者不要混用。

## 10. 排错

| 现象 | 原因 / 处理 |
| --- | --- |
| 脚本报「kanban 无输出（exit=…）」 | 运行时服务未启动。先在仓库根执行 `cline kanban` |
| `Error: Unknown session: <id>` | 这是 Cline 会话续接的报错，与看板无关，见 [`agent-team-allocation.md`](agent-team-allocation.md) §6.2 |
| 卡片上看不到标题 | `task list` 本身不返回标题；用 `python3 scripts/kanban_pipeline.py status` 或直接在浏览器里看 |
| 卡片顺序读起来是反的 | 用 `--order reverse`（默认）重建 —— Kanban 新卡前插 |
| 箭头方向像“倒着” | 箭头指向**前置**是 Kanban 的设计，语义是「我在等谁」，不是流程方向 |
| 卡片里读不到 `.clinerules/` | 治理文件不在 `defaults.baseRef` 指向的分支上；先把它合并到该分支 |
| 想彻底清板 | `kanban task delete --column <backlog｜in_progress｜review｜done> --project-path <repo-root>`，四列分别执行 |
| `gh pr create` 失败 | 确认 `gh auth status` 已登录，且远端为 `origin` |

## 11. 修改流程定义

- **增删阶段 / 改门禁 / 改 prompt**：编辑 `scripts/coursewebvideo-pipeline.json` 的 `stages[]`。
  脚本完全数据驱动，改完用 `seed --dry-run` 预览即可。
  注意：**已存在的卡片不会自动更新**，需要先 `remove --episode NN` 再重建。
- **改默认 agent / 模型 / baseRef / 交付模式**：改 `defaults`。
- **改受保护分支名**：同时改 `delivery.protectedBranch` 与 `defaults.baseRef`。
- **改交付约束文字**：改 `commonConstraints`（会注入到每一张卡）。
- **纳入音频 / 录屏阶段**：在 `stages[]` 末尾按顺序追加 `13` / `14` 两个阶段对象，
  并同步更新 `scope.included` / `scope.excluded`。

改动流程定义本身同样要走 PR：

```bash
git checkout -b chore/kanban-pipeline-update
git add scripts/coursewebvideo-pipeline.json
git commit -m "chore(tooling): 调整 kanban 流程定义"
git push -u origin chore/kanban-pipeline-update
gh pr create --base main --head chore/kanban-pipeline-update
```

## 12. 一句话总结

```text
流程定义（仓库）
   │  python3 scripts/kanban_pipeline.py seed --episode NN
   ▼
看板卡片：backlog ──> in_progress ──> review（人工门禁）──> Done
   │                                          │
   └── 每张卡自带交付约束 ──────────────────> 分支 + PR ──> 合并进 main
```

看板只是**执行层**；真正让流程可复用的是仓库里那份定义（`coursewebvideo-pipeline.json`）
加上这个实例化脚本。看板删了可以随时重建，流程不会丢。

