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

## Skill 阅读与路由

- 开始任何需要执行、修改或验证的任务前，先判断任务属于上游、下游还是跨项目，并完整阅读对应目录中的 `SKILL.md`；不要只根据 Skill 文件名或旧对话记忆执行。
- 上游内容任务从 `narration-pipeline/` 路由：
  - 口播重写、A-page 和批准口播：`narration-pipeline/.agents/skills/rewrite-course-narration/SKILL.md`
  - visual rough 与视觉结构：`narration-pipeline/.agents/skills/design-course-visual-rough/SKILL.md`
  - Stage 1 口播润色：`narration-pipeline/.agents/skills/polish-stage1-narration/SKILL.md`
  - 中文表达自然度：`narration-pipeline/.agents/skills/humanizer-zh/SKILL.md`
- 下游播放器、章节画面、presentation 和章节验收任务从 `player/` 路由，阅读 `player/.agents/skills/web-video-presentation/SKILL.md`。
- 跨项目任务按实际涉及的阶段依次阅读上游和下游 Skill；一个子项目的 Skill 不能替代另一个子项目的规则。根级 `CLAUDE.md` 只负责路由，具体契约以对应 Skill、references 和 examples 为准。
- `SKILL.md` 引用的必需 `references/`、`examples/`、脚本或模板也必须在执行前按其指示读取或调用；不要把历史报告、taste 记录或 `.tmp` 文件当作当前 Skill 规则。
- 用户明确点名某个 Skill 时，即使任务跨域，也必须使用该 Skill；若 Skill 缺失或无法读取，先说明阻塞点，再依据当前子项目 `CLAUDE.md` 和作者契约选择最小安全替代方案。

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
