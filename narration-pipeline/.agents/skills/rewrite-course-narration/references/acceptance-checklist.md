# Acceptance Checklist — 最小验收清单

## A-page v6 机械检查（脚本自动）

| 检查 | 说明 | 失败错误 |
|---|---|---|
| 正式边界 | 严格字段和类型；正式 A JSON 与报告不得含 B ID 或旧包装层 | `B_REFERENCE_FORBIDDEN` / `UNKNOWN_FIELD` / `FIELD_REQUIRED` |
| Nx 无损 | 按数组顺序拼接 `pages[*].nx`，与批准母版逐字符一致；每页恰有一个非空连续 Nx | `NX_REQUIRED` / `NX_NOT_LOSSLESS` |
| A 页面结构 | `a_id` 从 `A001` 连续；数组顺序即页面顺序；callback 只能指向更早 A | `A_ID_SEQUENCE_INVALID` / callback failures |
| 自包含引用 | E 目录字段完整、ID 唯一；页面 E 引用全部在同一 JSON 解析 | evidence failures |
| Screen guidance | 每页标题与内容组均有唯一 S/G ID；条目只含 `guidance_text`、`reference/exact` 与 E 引用；静默护栏不进入 Nx 或 guidance | screen/guidance failures |
| 语义纯净 | 禁止视觉、媒体、图片配额、页面配方和布局字段 | `UNKNOWN_FIELD` |
| A 级时长 | 字符当量与 min/target/max 机械值准确；目标小于 8 秒时必须有独立教学理由 | `TIMING_MISMATCH` / `SHORT_PAGE_REASON_REQUIRED` |
| 编译覆盖 | work trace 覆盖任务包全部编译单元，A 引用存在且顺序单调，`unresolved=[]` | trace failures |

正式发布命令：

```bash
python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py \
  --validation-profile a-page-v6 \
  --task-package episodes/<module>/episode-XX-...-task-package.md \
  --compile-trace ..\.tmp\narration-pipeline\<task>\episode-XX/episode-XX-b-to-a-compile-trace.json \
  --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt \
  --compiled-json ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json \
  --output ..\player\episodes\episode-XX\inputs/episode-XX-a-page-validation.json
```

## 四项人工检查（必须逐项确认）

1. **原 B 必要职责与受保护信息无遗漏**：对照冻结任务包可见信息列，把每个语义原子与 `visible_source_units` 逐项核对；`covered` 必须能沿 A → S 找到实际文本，`omitted` 必须有与当前批准 Nx 一致的理由。`responsibilities_resolved=true` 不能单独证明覆盖完整。
2. **A 页面要求真正支持 Nx**：每页 guidance 的核心对象、条件、区别、结果和受保护关系能支撑对应讲述。`reference` 不产生逐 S 落屏义务。
3. **事实与相邻主题边界无越界**：事实没有越过 Brief 边界，没有侵入相邻主题。
4. **Exact 保持原子化**：`exact` 只包含确需逐字稳定的数字、正式术语、引语或限定表达；不得因为解释句中含有一个锁定原子而锁定整句。该项不设置机械长度阈值。

## 门禁检查（禁止越过）

- 未经用户明确批准，不创建 `approved-spoken-text.txt`、不进入 A 页面编译；
- 不修改冻结任务包；
- 不默认下发 subagent；
- 正式报告只暴露 A 汇总、输入哈希、trace 哈希、覆盖结果和 failures，不暴露 B ID 或映射。

## 完成标准

机械检查全过 + 四项人工检查全确认后，发布到唯一正式 handoff `..\player\episodes\episode-XX\inputs/`。下游只接收：

- `approved-spoken-text.txt`；
- `episode-XX-a-page.json`（production）；
- 由当前正式文件与 work trace 重新生成的 `episode-XX-a-page-validation.json`。

报告必须 `failures=[]` 且 `coverage_passed=true`，包含匹配当前磁盘原始字节的 task package、正式批准稿、正式 A JSON 与 trace SHA-256。冻结任务包仍位于 `episodes/` 且保持只读；trace 和其他 `.tmp/narration-pipeline/` 内容不是跨仓库输入。
