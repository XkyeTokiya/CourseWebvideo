# Courseplay Web Video Monorepo

本仓库将 Courseplay 的内容生产流程与 Web Video 播放器统一纳入一个 Git 项目，但保留两个清晰的工作边界。

## 子项目路由

- `narration-pipeline/`：51 集任务包事实源、口播、A-page v6、visual rough v3 与验证。
- `player/`：Web Video Studio、51 期播放器实例、章节源码、音频与录屏。
- `player/episodes/<episode-id>/inputs/`：上游批准 handoff 的唯一正式消费入口。
- `player/episodes/_shared/covers/`：51 集标准封面内容库。
- `.tmp/narration-pipeline/`：上游过程文件目录，不是事实源，不提交 Git。

## 数据流

```text
narration-pipeline/episodes/
  -> .tmp/narration-pipeline/
  -> 人工批准与验证
  -> player/episodes/<episode-id>/inputs/
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
