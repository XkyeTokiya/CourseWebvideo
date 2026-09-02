# Courseplay 页面配方 Markdown 库设计

> 状态：活跃。适用于 `courseplay-visual-rough/v1`；取代人工编辑的中央 JSON 配方注册表。

## 1. 边界

`courseplay-a-page/v4` 是纯语义 JSON。视觉粗设是独立 Markdown，负责页面配方、上屏组织、图片需求和受控逻辑图资格。本设计只覆盖上游，不启动 PPT、HTML、Renderer 或实际图片生产。

## 2. 权威源

每份配方是 `.agents/skills/design-course-visual-rough/references/page-recipes/<recipe_id>.md`。文件名必须等于 `recipe_id`，结构遵循 `courseplay-page-recipe/v1`；人工可复制 `templates/page-recipe-template.md` 或运行管理脚本创建。

validator 直接扫描 Markdown 目录，按 `recipe_id` 排序生成内存注册表，并对规范化内容计算 SHA-256。仓库不维护并行的人工 JSON 注册表。

## 3. 人工管理

```powershell
$recipes = ".agents/skills/design-course-visual-rough/references/page-recipes"
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes new --recipe-id <id>
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes list
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes validate
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes set-status --recipe-id <id> --status active
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes clone --recipe-id <old> --new-recipe-id <new>
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes remove --recipe-id <id>
```

正常视觉粗设 Agent 只有读取权：先查看摘要，再完整读取候选配方；缺少合适配方时报告“页面配方缺口”并停止，不得写文件、临场命名或自动激活。

## 4. 生命周期

- `experimental`：人工可编辑，只能进入 draft。
- `active`：新草稿与 approved 均可使用。
- `restricted`：仅具体受控逻辑配方可用，且每次需要必要性理由和人工批准。
- `deprecated`：新草稿禁用，既有 approved 可解释。
- `blocked`：任何当前验证失败。

激活会写入 `definition_sha256`。激活后修改结构会触发 hash drift；需要修改时 clone 新 ID。只有 hash 仍为 `pending`、状态为 experimental 且未被粗设引用的文件可以物理删除。

## 5. 视觉边界

非逻辑配方不得映射为流程图、架构图或思维导图。宽泛 `logic-diagram` 是 blocked 历史项；未来逻辑图必须由用户维护具体 restricted 配方。每期逻辑图最多两页，默认零页。

图片仍遵循三分之一页面、唯一 M、实景 AI 严格多数、教材原图禁止重绘。实际图片在 PPT 结构完成后解析。
