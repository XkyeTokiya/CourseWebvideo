# Visual rough v3 contract

新生产使用 `courseplay-a-page/v6` + `courseplay-visual-rough/v3`。Frontmatter 字段沿用下表；`document_kind` 可以是 `candidate`（fixture-only）或 `production`，`status` 仍只有 `draft` 与 `approved`。v5/v2 继续服务既有 ep04，不原位改写。

每页标题必须为 `## A001｜页面短名`，并严格包含内容角色、页面配方、论点标题、辅助句、媒体需求、媒体作用、教材证据、逻辑图、逻辑图理由、上屏内容组、页面骨架和关系保真。论点标题绑定源 `screen.title.screen_item_id`，表示页面判断方向，但不要求独立标题区；每个源 `screen.groups[*].group_id` 必须在上屏内容组和页面骨架中至少出现一次，组内普通 S 不要求独立绑定。

v3 的 rough 是配方和槽位关系图，不是第二份屏幕文案。页面骨架只写 `slot <- Sxxx/Gxxx/Mxxx/none`；不得复制任一 `screen.*.guidance_text`，不得写自由屏幕文案。多个 G 可以通过重复 `slot <- Gxxx` 进入同一槽位，一个 G 也可参与多个槽位、关系或视觉载体。所有 G 在 rough 中被考虑只证明粗设完整，不产生下游逐 G 落屏义务；S/G/M 不得指向未知对象。

`protected_relations` 必须在“关系保真”中逐项解释，并由槽位、分组、顺序、对照或阅读关系承载。每个 R 都必须有且仅有一条关系载体说明；验证比较完整、无重复的 R 集合，不解释书写顺序。`silent_constraints` 不进入标题、辅助句、上屏内容组或页面骨架。C ID 只供审核，不得绑定可见槽位。

图片配额、媒体类型、配方生命周期、AI 多数、M 顺序和逻辑图上限继承 v2；v3 还必须保留 source A-page 的屏幕 ID、关系和证据引用完整性。源 A-page 哈希变化后必须重新生成并复审。

以下 v2 规则仅适用于冻结的 `courseplay-a-page/v5` / `courseplay-visual-rough/v2` 文档：标题 S、每个 G 与媒体都必须绑定，rough 不得复制 `source_text`。这些义务不得投射到 v3。

以下 v1 规则仅适用于冻结的 `courseplay-a-page/v4` / `courseplay-visual-rough/v1` 文档，保留用于回归验证。

视觉粗设使用严格 Markdown。Frontmatter 只允许：`schema_version`、`document_kind`、`episode_id`、`source_a_page`、`source_a_page_sha256`、`status`、`image_required_page_fraction`、`logic_diagram_page_limit`。

每页标题必须为 `## A001｜页面短名`，并严格包含以下字段：内容角色、页面配方、论点标题、辅助句、媒体需求、媒体作用、教材证据、逻辑图、逻辑图理由。

论点标题可以使用 `[V001]` 标记其承载的源语义。V 覆盖取论点标题与上屏内容组的并集；旧文档继续只在上屏内容组标记 V 仍然有效。每个上屏内容组至少携带一个本页合法 `[V001]` 或 `[R001]`。内容组中的 R 只声明可见内容来源，不能替代“关系保真”对源页面全部 R 的逐项说明；无关系时写 `- none`。

辅助句字段必须存在，默认写 `` `none` ``。`none` 表示下游不得生成对应文字或布局区域。非 `none` 辅助句只用于阅读提示、术语解释或必要范围限定，不参与 V 覆盖，也不能成为必须 V/R 的唯一载体；若删除后会丢失 V/R，必须把内容提升为论点标题或上屏内容组。

A-page 字段到视觉职责的映射如下：

- `must_visible`：分配给论点标题或上屏内容组。
- `protected_relations`：优先通过对照、顺序、分组、包含和阅读关系表达，并在“关系保真”中完整核对。
- `single_message`：用于全页取舍和论点压缩，不自动生成槽位。
- `teaching_purpose`：用于内容角色和配方选择，不直接上屏。
- `entry_condition`、`exit_condition`、`callback_a_ids`：用于页间衔接和验收，不自动生成槽位。
- `nx`：用于理解批准口播语境，不机械复制上屏。
- `timing`：用于控制信息密度，不生成视觉区域。

takeaway、final judgment、bottom thesis 或单独底栏统称“结构性结论槽”。它属于配方结构，不是编号上屏内容组，因此不计入 `content_group_min/max`，也不参与 V/R 覆盖。配方要求该槽位时，可以综合或重申已经由标题、内容组或结构关系承载的本页 V/R，不需要为结论槽预留语义，也不因缺少额外 V/R 而报告配方缺口。

结构性结论是否提供有效的阅读收束由人工审阅。若只是无价值地改写标题或主体，优先选择没有独立结论的合适配方；这一判断不构成机器失败、停止条件或全篇重排理由。

媒体需求只允许 `` `none` `` 或 `` `M001` / `photorealistic_ai` ``、`` `M001` / `textbook_original` ``。

状态只有 `draft` 与 `approved`。`approved` 表示已经经过人工审阅，不得由 Agent 自行推定。

页面配方按 `page-recipe-contract.md` 从 `page-recipes/*.md` 解析。新草稿不得引用 unknown、deprecated 或 blocked 配方；approved 不得引用 experimental 或 blocked 配方。既有 approved 文档可继续引用 definition hash 有效的 deprecated 配方。
