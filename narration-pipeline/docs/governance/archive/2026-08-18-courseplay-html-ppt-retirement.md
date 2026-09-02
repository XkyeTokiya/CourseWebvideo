# 弃用决定：courseplay-html-ppt（2026-08-18）

> 状态：已批准执行
> 范围：`006-couseplay-new-episode-deck`（下游）与 `006-couseplay-narration-task-packages`（上游）
> 相关归档：下游 `archive/deprecated-processes/courseplay-html-ppt-2026-08-18/`

## 决定

完全停止 `courseplay-html-ppt` 作为下游 HTML 制作入口，并将它的可执行链路作为不可误用的历史快照归档。

**当前不存在任何已启用的替代 HTML 生产流程。** `courseplay-one-bs-one-page` 仍是尚未启用的研究 pilot，不升级为默认路由，不继承旧链能力。

## 归档内容（下游快照）

下游 `archive/deprecated-processes/courseplay-html-ppt-2026-08-18/` 内的 `snapshot/` 保存以下原始路径（经 `git mv` 保留追溯）：

- `.agents/skills/courseplay-html-ppt/`
- `.agents/skills/courseplay-slide-scene-ir/`（HTML Renderer 链）
- `.agents/skills/add-courseplay-layout/`
- `scripts/`（`new-episode-deck.ps1` 等 5 个装配/抽取/校验脚本）
- `templates/{cream-v2,flat-v2,note-v2,v2}/`
- `work/episode-01/{slides.html,build.ps1}`
- `outputs/episode-01/`（已跟踪的旧 HTML 与两份旧 assets）

## 未改动事实

- 上游 `episodes/**` 冻结任务包：保持只读，未修改、未移动、未复制。
- 上游 `output/episode-XX/` 三份正式 handoff：未改动。
- 下游 `courseplay-one-bs-one-page`、`courseplay-mode-card-authoring`、根 legacy `ir/`、`tools/alignment-viewer/` 及现有 page-first 工作源/产物：保留原位。

## 上游路由后果

- 跨仓库流程文档、本仓库 `CLAUDE.md` 已更新：任何"制作/修改 HTML、IR、模板、播放器、渲染或验收"请求报告"暂无已启用 HTML 生产流程"。
- `output/episode-XX/` handoff 定义保留，但其下游状态写为**等待未来单独批准的生产路由**；不自动触发任何 HTML/IR/模板/播放器/渲染任务。
- 未来若启用新生产链（如 One-Bs-One-Page），须通过独立、明确批准的设计与接入任务完成。
