# A-page v6 作者契约卡

这是 A-page 作者的唯一字段规则入口。作者只需读取本卡、[canonical example](examples/a-page-v6/) 和当前阶段流程；验证器与 parser 是黑盒验收实现，不是规则来源。

## 输入与输出

- 输入：已批准的连续口播（唯一 `nx` 来源）、编译期任务包中的职责/证据/关系，以及可选的 Brief。
- 正式输出：一个 `courseplay-a-page/v6` production JSON，发布到 `player/episodes/<episode-id>/inputs/<episode-id>-a-page.json`。
- 工作输出：`courseplay-b-to-a-trace/v2` trace 和验证报告留在 `.tmp`；trace 不进入正式 JSON，也不进入 handoff。

## 顶层固定字段

顶层只能有以下字段：`schema_version`、`document_kind`、`episode_id`、`approved_text`、`timing_model`、`evidence_catalog`、`pages`。

| 字段 | 固定值/形状 |
|---|---|
| `schema_version` | `courseplay-a-page/v6` |
| `document_kind` | `production` |
| `episode_id` | 非空字符串；与目标 episode 相同 |
| `approved_text` | `approved-spoken-text.txt` |
| `timing_model` | `han_weight=1`、`fullwidth_punctuation_weight=0`、`other_non_whitespace_weight=0.5`；CJK 每分钟 `minimum=220,target=230,maximum=240` |
| `evidence_catalog` | E 目录；每项只有 `evidence_id`、`claim_or_asset`、`source_locator`、`verification_status`、`allowed_use`，文本均非空 |
| `pages` | 非空数组；顺序就是页面顺序 |

## 页面固定字段和允许值

每页只能有：`a_id`、`callback_a_ids`、`nx`、`teaching_purpose`、`single_message`、`screen`、`protected_relations`、`silent_constraints`、`entry_condition`、`exit_condition`、`timing`。除 `callback_a_ids`、关系/约束数组外，必填文本非空。

- `a_id`：`A001` 起按页面顺序连续。
- `nx`：一段非空、连续的批准口播原文；按 `pages` 顺序拼接后必须与批准稿逐字符相同，不增删空白或标点。
- `approved-spoken-text.txt` 交给验证入口前使用 LF、去首尾空白的 canonicalized 文本；文件末尾换行是非语义格式差异，入口会统一处理。
- `callback_a_ids`：数组，只能引用当前页之前的 A。
- `screen.title`：一个 S 条目；`screen.groups`：非空数组，每组有一个或多个条目。
- screen 条目只能有 `screen_item_id`、`guidance_text`、`usage_policy`、`evidence_refs`；`usage_policy` 只能是 `reference` 或 `exact`。`exact` 只锁定必须逐字可见的原子（数字、正式术语、引语或限定表达）；其余用 `reference`。
- `protected_relations` 的每项只能有 `relation_id`、`from`、`relation`、`to`、`direction`，文本非空；关系由此字段表达，不自动变成 `exact`。
- `silent_constraints` 的每项只能有 `constraint_id`、`instruction`、`evidence_refs`。它们是下游静默边界，不得出现在 `nx`、`guidance_text` 或可见槽位。
- `timing` 只能有 `char_equivalent`、`min_seconds`、`target_seconds`、`max_seconds`、`short_page_reason`；后四个秒数由下方公式得到。目标小于 8 秒时 `short_page_reason` 必须是非空字符串，否则为 `null`。

## ID、引用与跨页规则

- E 使用 `E001` 形式，在同一目录中唯一；所有 `evidence_refs` 必须能在本 JSON 的 E 目录解析。
- S、G、R、C 分别在整份 JSON 中从 `001` 起连续且唯一；编号跨页递增，不按页重置。标题也占一个 S，G 只属于 `screen.groups`。
- `screen_item_id` 只能引用本页已有的 S；A callback 只能向前；正式 JSON 不得出现 B ID、B 映射、B 时长、旧包装层或任何视觉、媒体、配方和布局字段。
- 页面可引用同一 E；自包含意味着下游不需要任务包或 trace 才能解释正式 JSON。

## 时间与覆盖

字符当量：空白及全角标点为 0；CJK 为 1；其他非空白字符为 0.5。

```text
min    = ceil(char_equivalent × 60 / 240)
target = round-half-up(char_equivalent × 60 / 230)，再夹在 min 与 max 之间
max    = ceil(char_equivalent × 60 / 220)
```

trace 只在编译期使用：每个任务包编译单元必须有 `visible_source_units`；`covered` 指向实际存在的 A/S，`omitted` 有非空理由，`unresolved` 必须为空。它不是下游逐 S 落屏清单。

## normalizer 能做什么

`compile_a_page_v6.py` 的 normalizer 可以重写顶层固定元数据、按数组顺序重编号 A/S/G/R/C（同步更新 callback 和关系端点），并按 `nx` 重算 timing；它不会创作缺失内容、补 E、替作者选择 `exact` 或替换口播。JSON 的空白格式不具有生产语义。

## 失败处理

按 [A-page error index](error-catalog.json) 的 `code/path/expected/actual/message/hint/contractSection` 处理失败。若出现本卡和错误索引都未覆盖的失败，报告工具缺陷；不要读取 validator、parser 或 handoff 实现来猜规则。
