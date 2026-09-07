# visual rough v4 作者契约卡

这是 visual rough 作者的唯一字段规则入口。作者只读本卡、[canonical example](examples/visual-rough-v4/) 和需要使用的当前 recipe 文件；验证器/parser 是黑盒验收实现。失败时按 [error index](error-catalog.json) 局部查码，未登记失败报告为工具缺陷。

## 输入与输出

- 输入：已验证的 `courseplay-a-page/v6`、其原始字节 SHA-256、当前 recipe v2 目录。
- 输出：一个 `courseplay-visual-rough/v4` Markdown；`draft` 经人工审阅后才可变为 `approved`。不修改 A-page 的 G。
- 这是章节制作前的视觉结构草案，不是布局/CSS/最终文案；handoff 是否生成是下游的可选决定。

## 固定 frontmatter

frontmatter 只能有以下字段：

```yaml
schema_version: courseplay-visual-rough/v4
document_kind: candidate | production
episode_id: <非空 episode id>
source_a_page: <源 A-page 文件名>
source_a_page_sha256: <源 A-page 原始字节 SHA-256>
status: draft | approved
image_required_page_fraction: 1/3
logic_diagram_page_limit: <验证报告给出的当前上限>
```

推荐用 `---` 包住 frontmatter；换行是 LF/CRLF 均可。字段值和字段集合不能缺失、重复或改名。

## 页面、字段与精确语法

页面必须与 A-page 完全同序、同数；每页必须有标题行 `## A001｜页面短名`（ASCII `|` 也可）。每页固定出现以下九个字段各一次：

```markdown
- **内容角色**：<非空>
- **页面配方**：`<已登记 recipe_id>`
- **论点标题**：`Sxxx`
- **辅助句**：`Sxxx` 或 `none`
- **媒体需求**：`none` 或 `Mxxx / photorealistic_ai|textbook_original`
- **媒体作用**：<非空或 none>
- **教材证据**：`none` 或有效 E ID
- **逻辑图**：`yes` 或 `no`
- **逻辑图理由**：<非空或 none>
```

字段标签、冒号可用全角或 ASCII 标点；其余空白、反引号和页面标题排版不改变语义。每页必须有三个小节，顺序固定：`视觉内容单元`、`页面骨架`、`关系保真`。

`论点标题` 必须是本页已有的 `Sxxx`，`辅助句` 是本页已有的 `Sxxx` 或 `none`；`媒体需求` 只能是 `none` 或一个 `Mxxx /` 允许类型，`教材证据` 只能是 `none` 或本 A-page 的有效 E ID；`逻辑图` 只能是 `yes`/`no`，理由与之相配。九个字段和三个小节的内容不是可选装饰，不能用自定义标签替代。

- 内容单元每行：``1. `U001 <- G001 + G002` ``。U 在全篇从 U001 连续；一行至少一个 G。一个 U 可合并多个 G；一个 G 可出现在多个 U，包括同时作为主体和结论；每个源 G 至少被一个 U 覆盖。G 数量不由 recipe 反推。
- 页面骨架每行：``- `slot <- S001` ``、``- `slot <- U001` ``、``- `slot <- M001` `` 或 ``- `slot <- none` ``。只绑定本页已有 S/U/M；不得绑定 G、R、E、C。每个声明的 M 必须有一个骨架槽位。
- 关系保真每个源 R 恰好一行：`- [R001]：<唯一载体说明>`；没有关系写 `none`。不要画箭头、网络或拓扑来替代契约中的关系载体。
- rough 不复制任何 A-page `guidance_text`，也不把 `silent_constraints` 的 ID 或 instruction 放进可见结构。

## recipe、媒体与跨页规则

- recipe schema 是 `courseplay-page-recipe/v2`；`status` 允许 `experimental|active|restricted|deprecated|blocked`。`draft` 可用 `experimental`/`active`/具体 `restricted`；`approved` 只能用 `active` 或具体 `restricted`；`deprecated`/`blocked` 不可用。
- `content_unit_min/max` 只统计当前页 U，不统计 G、S、卡片、槽位或 recipe ID。U 数必须落在选定 recipe 范围内；不为适配范围修改 A-page G。
- recipe 的 `media_mode` 为 `required|forbidden`，必须与当前页是否有 M 一致。媒体类型只允许 `photorealistic_ai` 或 `textbook_original`；AI 图的教材证据必须为 `none`，教材原图必须引用有效 E。
- 全篇图片页数恰为 `ceil(A-page 页数 / 3)`；M 只在图片页使用，按页面顺序从 M001 连续且每页一个。AI 图片数量必须严格多于图片总数的一半。
- 相邻页面 recipe 不得相同；十页或以上至少使用四种不同 recipe。逻辑图只有在当前目录存在具体 `restricted` 且 `is_logic_diagram=true` 的 recipe 时才能出现；否则全篇为零，不能使用宽泛 logic-diagram 名称。逻辑图数量上限以当前登记目录为准。

## normalizer 能做什么

`normalize_visual_rough_v4.py` 可统一换行、源文件名和 SHA-256，并把 U/M 重编号为全篇连续、把 U 列表序号重排；它不修改 G、不选择 recipe、不补槽位或关系、不改变媒体资格。parser 会忽略不具生产语义的 CRLF、ASCII/全角冒号、反引号和多余空白。

## 失败处理

验证失败返回 `code/path/expected/actual/message/hint/contractSection`。错误索引是公开事实源；本卡未覆盖的验证失败必须报告为工具缺陷，不能读取 parser、validator 或 handoff 实现。
