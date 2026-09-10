# Courseplay Phase 1 runner

`tools/courseplay-phase1.mjs` 确定性执行 Courseplay-bound Phase 1 的文件初始化、
状态迁移、局部提交、正式产物汇总、全局审查门禁和中断恢复。它不生成语义内容；
Agent 负责提供当前章节的 script/outline 候选块与审查结论，runner 负责验证并落盘。

## 输入与边界

runner 只接受以下正式路径和版本：

- `episodes/<id>/project.json`
- `episodes/<id>/inputs/<id>-a-page.json`：`courseplay-a-page/v6`、`production`
- `episodes/<id>/inputs/<id>-a-page-validation.json`：无 errors/failures
- `episodes/<id>/inputs/<id>-visual-rough.md`：`courseplay-visual-rough/v4`、
  `production/approved`
- `episodes/<id>/inputs/<id>-visual-rough-validation.json`：无 errors/failures
- A-page 声明的 `approved_text`（如有）

不支持历史版本、替代路径或“等价输入”降级。输入摘要只保存在 Git 忽略的
`state.json` 中用于恢复与失效判断，不写入正式 outline。

## 命令

在 `player/` 目录执行：

```powershell
pnpm courseplay:phase1 -- preflight --episode episode-07
pnpm courseplay:phase1 -- init --episode episode-07

pnpm courseplay:phase1 -- compile-chapter --episode episode-07 --a-page A001 --script <candidate.md>
pnpm courseplay:phase1 -- review-chapter --episode episode-07 --a-page A001 --stage script --verdict PASS

pnpm courseplay:phase1 -- compile-chapter --episode episode-07 --a-page A001 --outline <candidate.md>
pnpm courseplay:phase1 -- review-chapter --episode episode-07 --a-page A001 --stage outline --verdict PASS

pnpm courseplay:phase1 -- finalize --episode episode-07 --schedule <schedule.md> --materials <materials.md>
pnpm courseplay:phase1 -- review-global --episode episode-07 --verdict PASS

pnpm courseplay:phase1 -- status --episode episode-07
pnpm courseplay:phase1 -- resume --episode episode-07
```

`REVISE` 必须有可执行的最小范围。局部审查天然绑定当前 `--a-page`；全局审查须
通过 `--targets` 指定逗号分隔的 `chapter:Axxx`、`metadata`、`schedule` 或
`materials`：

```powershell
pnpm courseplay:phase1 -- review-global --episode episode-07 --verdict REVISE --targets chapter:A003,schedule
```

可用 `--report <path>` 保存审查报告原文。

## 候选块契约

script 候选块只包含当前 A-page，标题为 `## Axxx · title`。正文按语义边界用独占行
`---` 持久化 Beat；去除分隔符并忽略空白后，正文必须与该页批准 `nx` 一致。

outline 候选块只包含当前章节，必须保留标准章节标题、`A-page / Chapter` 字段和
连续 step 表。标题声明的 step 数、表格行号与冻结 script Beat 数必须完全一致。
custom scene 在这里仅允许 `none` 或 `proposed`，不能提前写成用户已批准。

`finalize` 接收两个 global-derived 候选：schedule 必须按正式 A-page 顺序各含一行；
materials 必须覆盖 visual rough 声明的全部媒体 ID。写入 ready 状态前，runner 会
对每个章节复用 handoff v4 校验器，避免 Phase 1 与 Phase 2 使用不同契约。

## 持久化状态

工作状态位于 Git 忽略目录：

```text
.tmp/player-phase1/<episode-id>/
├── state.json
├── script/A001.md
└── reviews/
    ├── A001-script.json
    ├── A001-outline.json
    └── global.json
```

章节的 `script` 和 `outline` 分别使用 `pending → draft → frozen`；回修或输入变化
进入 `stale`。metadata、schedule、materials 分别使用 `pending → ready`，依赖变化
进入 `stale`。每次写入均采用同目录临时文件加原子 rename。

`resume` 同时检查 state、正式 outline marker 和已落盘 script block：进程若在
文件写入后、state 更新前中断，会把已经验证存在的最远安全状态恢复出来；正式输入
发生合法更新时，只将拥有该输入的章节及其派生区域标为 stale。

若正式 A-page 的章节集合或顺序与既有 state 不同，runner 不猜测重排或删除已冻结
内容，而以 `PHASE1_PAGE_SEQUENCE` 明确停止；在单独审阅迁移范围后重新初始化。

## 诊断码

| 代码 | 含义 |
|---|---|
| `PHASE1_INPUT_MISSING` | 正式输入、候选文件或必需参数缺失 |
| `PHASE1_VERSION_PAIR` | 不是 A-page v6 + visual rough v4 |
| `PHASE1_SOURCE_INTEGRITY` | episode、来源或 validation 摘要不一致 |
| `PHASE1_INPUT_NOT_APPROVED` | 正式输入未达到 production/approved |
| `PHASE1_PAGE_SEQUENCE` | A-page 集合、页序或章节声明不一致 |
| `PHASE1_NX_MISMATCH` | script/approved text 与 A-page nx 不一致 |
| `PHASE1_OUTLINE_CONFLICT` | 既有 outline 不能安全迁移或恢复 |
| `PHASE1_STATE` | 命令不符合当前状态或章节顺序 |
| `PHASE1_BEAT_STEP_MISMATCH` | 冻结 Beat 数与 outline step 不一致 |
| `PHASE1_REVIEW` | 审查结论、custom 状态或回修目标无效 |
| `PHASE1_TOOL_DEFECT` | 未登记的 runner 异常 |

finalize 的跨阶段契约失败沿用现有 `HV4_*` 诊断码，以便直接定位 handoff v4
字段问题，不包装成模糊的 Phase 1 错误。
