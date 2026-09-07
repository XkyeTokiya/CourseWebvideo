# Production status

`production-status/` 是一个本地进度工作台，不是生产内容的事实源。它从 `narration-pipeline/`、`player/` 和正式输入文件中读取当前状态，生成方便查看的阶段进度、机器检查结果和总览索引。

## Git 边界

提交到 Git 的是脚本、页面、契约和少量可选的门禁记录：

- `production-status.mjs`、`production-status-server.mjs`：生成和服务逻辑；
- `dashboard.html`、`episode-workbench.html`、`status-store.js`：工作台界面；
- `schema/`、`workflow-definition.js`：结构与流程定义；
- `manual-approvals.json`：用户明确放行阶段时的轻量记录。

以下内容是可重建投影，不提交 Git：

- `episodes/*.json`：每集当前状态快照；
- `index.json`：总览索引；
- `.tmp/production-status-scan/`：扫描过程文件。

这样可以避免每次同步只因为日期、扫描时间或派生字段变化，就让几十个文件进入脏状态。

## 唯一的可选人工记录

`manual-approvals.json` 使用如下结构：

```json
{
  "schemaVersion": "coursewebvideo/production-approvals/v1",
  "episodes": {
    "episode-07": {
      "narration": {
        "status": "approved",
        "decidedAt": "2026-09-07",
        "decidedBy": "user",
        "evidence": "…",
        "note": "…"
      }
    }
  }
}
```

它只影响工作台中的阶段显示。删除一条记录会让对应阶段回到未放行状态，不会删除或修改任何正式生产文件。

## 日常使用

```bash
node production-status/production-status.mjs sync --episode episode-07
node production-status/production-status.mjs scan --episode episode-07
node production-status/production-status.mjs report
```

启动工作台时，服务会先按当前仓库内容重建本地投影。生成的 JSON 即使被删除，也可以通过再次启动服务或运行 `sync` 恢复。
