# Page recipe v1 contract

`references/page-recipes/` 是页面配方的唯一人工权威源；一份配方对应一份 UTF-8 Markdown，文件名必须等于 `recipe_id`。validator 按文件名排序加载目录，在内存生成规范注册表并计算 SHA-256，不读取并行 JSON 注册表。

Frontmatter 只允许：`schema_version`、`recipe_id`、`status`、`content_group_min`、`content_group_max`、`media_mode`、`is_logic_diagram`、`slot_contract`、`downstream_layouts`、`definition_sha256`。`slot_contract` 与 `downstream_layouts` 使用 ` | ` 分隔的非空唯一值。正文必须依次包含且只包含 `# 用途`、`# 正例`、`# 反例`。

状态规则：

- `experimental`：可人工编辑，仅可进入 `draft` 粗设；定义哈希允许 `pending`。
- `active`：可进入新草稿和批准稿；激活后定义哈希必须匹配，结构修改必须 clone 新 ID。
- `restricted`：仅允许具体的 `is_logic_diagram: true` 配方；每次使用均需必要性理由与人工批准。
- `deprecated`：不得进入新草稿；既有 approved 粗设仍可解释。
- `blocked`：任何当前粗设验证均失败。

非逻辑配方的 `downstream_layouts` 不得包含 `flow-diagram`、`arch-diagram` 或 `mindmap`。宽泛 `logic-diagram` 只作为 blocked 历史项保留，不能成为新粗设的选择。
