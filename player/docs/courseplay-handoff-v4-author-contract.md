# handoff v4 作者契约卡

handoff 是 `script/outline` 之后、章节制作之前的可选上下文打包工具，不是门禁。作者只需读取本卡、[canonical example](examples/courseplay-handoff-v4/) 和失败时的 [error index](handoff-v4-error-catalog.json)；CLI/parser 是黑盒实现，不是规则来源。不调用 handoff 时，不要求输入套用本卡的 Markdown 排版。

## 固定输入、输出与职责

CLI 从 `player/` 运行，固定读取：

```text
episodes/<episode-id>/project.json
episodes/<episode-id>/inputs/<episode-id>-a-page.json
episodes/<episode-id>/inputs/<episode-id>-visual-rough.md
episodes/<episode-id>/script.md
episodes/<episode-id>/outline.md
```

它只接受 A-page v6 + visual rough v4，且 episode、A-page 文件名和 rough 的 `source_a_page_sha256` 必须相符。输出是 `episodes/<episode-id>/.handoffs/<Axxx>.json` 的确定性 compact packet；`.handoffs/` 是派生缓存，不提交 Git。

handoff 实际读取并检查：项目 ID、版本/源完整性、A-page 页面顺序、script beat 与 outline step、当前页的 S/U/R/M 引用、R 与关系载体的一一对应，以及有媒体时 outline 是否有该 A 的素材清单。它不读取、不验证 `narrations.ts`，也不声称三者相等；`narrations.ts` 由既有提取/运行时流程负责。

## script 输入语法

推荐每个 A 一节，标题和 beat 只用于定位与节拍：

```markdown
## A001 · 页面标题

Beat 1 原文

---

Beat 2 原文
```

页面节次必须与 A-page 完全同序、同数；`---` 独占一行分隔同一 A 内的 beat。删除标题和分隔线后，各 beat 拼接经空白归一化，必须等于该页 `nx`；标点、文字和内容顺序不能改。标题不是口播文本。

## outline 输入语法

每章按 A-page 顺序出现，标题推荐：

```markdown
## 1. chapter-id — 页面标题（2 steps · 说明）

**A-page / Chapter**：`A001`

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 本步焦点 | `S-A001 · state-name` | show: S001, U001, R001 |
| 2 | 本步焦点 | `S-A001 · state-name` | show: U002, M001 |
```

标题序号、A 映射、step 行号必须连续；标题声明的 step 数等于实际行数，且等于当前 A 的 script beat 数。`show:` 只引用当前 A 已声明的 `S/U/R/M`；不要引用 G、E 或 C。ASCII/全角括号、冒号、短横线/长横线、反引号和多余空白是可归一化排版差异。

## 素材清单与 presentation

若当前 A 的 rough 声明媒体，outline 必须包含：

```markdown
## 素材清单

### A001

- M001：素材状态或占位说明
```

handoff 的 `presentation` 原样携带当前 rough 的 recipe、U 映射、骨架、媒体和关系载体；它不把 G 数量变成 step 数，也不复制 A-page guidance 文案。输出的 `narration` 权威是当前 A 的 script beats（来自 A-page nx 的无损切分），`runtime_contract` 只表达 `script beat = outline step`。

## normalizer 与失败处理

handoff 不改写作者文件；读取时只把换行/空白和上述非语义标点排版差异归一化，输出 JSON 以固定缩进确定性生成。它不会替作者补 beat、step、素材、引用或关系载体。

失败返回 `code/path/expected/actual/message/hint/contractSection`，按错误索引局部查码。未覆盖的异常统一报告为已登记的工具缺陷；不要为了修复它读取 CLI、parser 或 validator 实现。只有显式调用 handoff 时才处理这些输入契约，未调用时章节制作仍可使用等价的当前章节输入。
