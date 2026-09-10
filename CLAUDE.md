# Courseplay Web Video Monorepo

本仓库将 Courseplay 的内容生产流程与 Web Video 播放器统一纳入一个 Git 项目，但保留两个清晰的工作边界。

## 子项目路由

- `narration-pipeline/`：51 集任务包事实源、口播、A-page v6、visual rough v4 与验证。
- `player/`：Web Video Studio、51 期播放器实例、章节源码、音频与录屏。
- `player/episodes/<episode-id>/inputs/`：上游批准正式输入的唯一消费入口。
- `player/episodes/<episode-id>/{script.md,outline.md}`：Phase 1 runner 管理的唯一持久计划状态。
- `player/episodes/<episode-id>/.handoffs/`：按需生成的单章交接缓存，不提交 Git。
- `player/episodes/_shared/covers/`：51 集标准封面内容库。
- `.tmp/narration-pipeline/`：上游过程文件目录，不是事实源，不提交 Git。

作者契约路由：A-page 读 [`a-page-v6-author-contract.md`](narration-pipeline/.agents/skills/rewrite-course-narration/references/a-page-v6-author-contract.md)，visual rough 读 [`visual-rough-v4-author-contract.md`](narration-pipeline/.agents/skills/design-course-visual-rough/references/visual-rough-v4-author-contract.md)，可选 handoff 读 [`courseplay-handoff-v4-author-contract.md`](player/docs/courseplay-handoff-v4-author-contract.md)。每张卡链接一个合成成功样例和失败时的错误索引；实现文件不是生产规则来源。

## 数据流

```text
narration-pipeline/episodes/
  -> .tmp/narration-pipeline/
  -> 人工批准与验证
  -> player/episodes/<episode-id>/inputs/
  -> Phase 1 runner：init -> commit-chapter(Axxx) -> finalize
  -> script.md + outline.md -> Checkpoint Plan
  -> 可选 .handoffs/Axxx.json
  -> player/episodes/<episode-id>/src/
  -> player 预览、构建与录屏
```

任务包保持只读。播放器实例不得反向修复、替代或覆盖任务包。过程文件不得进入 `inputs/`；只有经过批准和验证的正式文件才能发布到 `inputs/`。

## 工作目录

普通任务进入对应子项目目录：

```powershell
cd D:\00-workspace\005-coursewebvideo\narration-pipeline
cd D:\00-workspace\005-coursewebvideo\player
```

跨子项目的路径、发布规则和治理修改从仓库根目录审查，但不把根目录作为普通 episode 制作工作目录。

## Git 与敏感文件

- 单一 Git 根位于本目录；两个子目录不再拥有独立 Git 历史。
- 不提交 `.env`、凭据、令牌、`node_modules/`、构建缓存、`.tmp/` 或旧归档。
- 先确认目标子项目和当前状态，再只提交本任务明确修改的路径。
- `.tmp/archives/` 是迁移后的封存历史载荷；未经用户明确授权，Agent 不得读取、解压或将其中内容作为生产依据。它不进 Git，也不是当前流程输入。

## Phase 1 runner

- 从 `player/` 目录运行 `pnpm courseplay:phase1`；正常路径为 `init`、逐 A 的 `commit-chapter`、`finalize`。
- `script.md` 与 `outline.md` 是唯一持久状态。不要创建旁路 `state.json`、review receipt、临时 script blocks、`narration-units.json` 或 `narration-bindings.json`。
- 候选内容在临时位置创作，由 runner 校验后以 script/outline 内容对原子提交；不要手写或复制 runner marker。
- `status`、`resume`、`preflight` 仅用于诊断和恢复；A-page 集合或顺序发生变化时必须显式处理迁移，不能静默覆盖。

## 跨项目单集进度投影

仓库根级 `production-status/` 是跨项目的进度工作台，不属于 `narration-pipeline/` 或 `player/` 任一子项目。它的目标是方便查看任务进度，不是生产事实源。`production-status/episodes/*.json` 与 `production-status/index.json` 都是由脚本生成的本地投影，已加入 `.gitignore`，不提交 Git。

- `observations` 由 `node production-status/production-status.mjs sync` 从任务包、inputs、Player、音频目录同步。
- 可选的少量门禁记录单独保存在 `production-status/manual-approvals.json`；它只记录用户是否放行某个阶段，不承载生产内容，也不应阻塞普通文件同步。
- 工作台启动或同步时重建 episode JSON 与索引；前端仍通过服务端索引读取剧集，不在前端猜测集数。
- `summary`、`stages`、`readiness`、`automation` 与 `index.json` 都是派生结果；源文件变化后重新运行同步即可重建。
- 如果删除 `manual-approvals.json` 中的记录，工作台只会恢复为“未放行”的进度显示，不会影响任务包、正式输入或 Player 产物。

从仓库根目录运行 `node production-status/production-status.mjs check` 校验 51 期状态，运行 `node production-status/production-status.mjs report` 查看全局汇总。同步工具从 `manual-approvals.json` 读取可选的阶段放行记录，episode JSON 和索引均可随时重建。

手动触发全量机械验证使用 `node production-status/production-status.mjs scan`；该命令调用 Player 的 `episode:check`，并记录 A-page、Visual rough、音频文件、输入 SHA-256、命令输出与扫描时间。`scan` 只写入 `automation`、`readiness` 和推导状态，不会写入人工审批结论。需要同时执行 Player 的 `typecheck` 与 `lint` 时使用 `node production-status/production-status.mjs scan --build`。
