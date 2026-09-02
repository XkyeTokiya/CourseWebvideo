---
name: design-course-visual-rough
description: Use when turning an approved Courseplay A-page v6 guidance document into a human-reviewable, recipe-bound visual rough before downstream production.
---

# Design Course Visual Rough

## Overview

把 `courseplay-a-page/v6` 转换为独立的 `courseplay-visual-rough/v3` Markdown。A-page 提供 screen guidance；本 Skill 只决定 G/R/M 如何参与表达结构、页面配方、图片页与逻辑图资格，不重复抄写 `guidance_text`，也不制作页面、不生成图片、不定义坐标、CSS、字号、动画或图片提示词。冻结的 `courseplay-a-page/v4` / `courseplay-visual-rough/v1` 与 `courseplay-a-page/v5` / `courseplay-visual-rough/v2` 仅由兼容验证路径读取，其中 v5/v2 继续服务既有 ep04。

页面配方来自可人工维护的 `references/page-recipes/*.md`，一份配方一份 Markdown；不得硬编码、临场发明或修改配方库。逻辑图不是默认载体，也不是配额；全篇绝对上限为两页，默认使用零页。

`screen` guidance 决定页面内容方向，`protected_relations` 决定必须保真的关系载体；`silent_constraints` 只用于下游审核，不能绑定到任何可见槽位。G 是粗设中的语义规划单位，不是下游 UI section，也不产生最终逐 G 落屏义务。

## Workflow

1. 校验输入是正式 `courseplay-a-page/v6`，计算源文件 SHA-256；冻结的 v4/v1、v5/v2 继续走兼容路径。
2. 运行 `manage_recipes.py ... list` 读取配方摘要；根据页面需求筛选候选后，必须完整读取每份候选配方 Markdown，再读取 `references/visual-rough-contract.md` 和 `references/forbidden-visual-patterns.md`。不要一次性把整个配方库当作自由灵感池。
3. 先写单集视觉策略，再按 `Q=ceil(A 页面数/3)` 选择图片页；每个图片页一项唯一媒体需求，实景 AI 图严格多数。
4. 按页面顺序理解本页 screen S/G、受保护关系和教学任务，选择局部可行的已注册配方，再写 G/R/M 的结构绑定、辅助句、页面骨架和关系保真。辅助句默认写 `none`；不得把 guidance_text 复制进 rough，不得把 C 绑定到可见槽位，也不得把 S/G/R 机械变成节点或箭头。
5. 使用 `templates/visual-rough-v3-template.md` 成稿，并运行 `scripts/verify_visual_rough.py`。失败时修正文档，不降低校验规则；既有 v1/v2 文档继续使用原模板和兼容校验。
6. 用户审阅后才能把 `status` 从 `draft` 改为 `approved`。源 A-page 哈希变化后必须重新生成并复审。

## Semantic Mapping and Structural Conclusions

- v3 的 `screen.title` 是页面判断方向，不强制建立独立标题区；G 汇集同一制作作用的 guidance，并用于规划语义区域。普通 S 不要求独立绑定，也不要求在最终页面逐项落屏。
- `protected_relations` 必须在“关系保真”中逐项解释，并优先通过对照、顺序、分组、包含或阅读关系表达。关系 carrier 按完整、无重复集合核对，R 的书写顺序没有语义。上屏内容组可以引用 `[R001]`，但不能替代“关系保真”的完整说明。
- `single_message` 只控制全页取舍与论点压缩；`teaching_purpose` 只影响内容角色和配方选择；`entry_condition`、`exit_condition` 与 `callback_a_ids` 只用于页间衔接和验收；`nx` 只提供口播语境；`timing` 只控制信息密度。这些字段都不得单独证明新槽位合理。
- 辅助句字段继续保留，但默认值为 `none`。`none` 不生成文字或布局区域；非 `none` 辅助句不参与 V 覆盖，也不能成为必须语义的唯一载体。删除辅助句会丢失 V/R 时，应把该内容提升为论点标题或上屏内容组。
- v3 每个 source group 必须至少在 rough 中绑定一次；多个 G 可以重复绑定同一槽位，一个 G 也可参与多个区域或关系载体。该检查只证明 rough 完整，不产生下游逐 G 覆盖义务。R 必须在“关系保真”中逐项解释。A/S/G/R/M/E/C ID 只用于制作核对，进入学习者页面前必须移除。
- takeaway、final judgment、bottom thesis 或单独底栏统称“结构性结论槽”。它属于配方结构，不计入 `content_group_min/max`，也不参与 V/R 覆盖；配方要求该槽位时，可以综合或重申已经由标题、内容组或结构关系承载的本页 V/R，不需要为它预留语义。
- 结构性结论是否带来明确的阅读收束价值由人工审阅。若只是无价值地改写标题或主体，优先选择没有独立结论的合适配方；但不得仅因此停止、报告配方缺口或触发全篇重排。

## Recipe Management

配方 Markdown 目录是唯一白名单。以下命令只供人类管理配方；正常视觉粗设 Agent 不得运行会写入配方库的命令：

```powershell
$recipes = ".agents/skills/design-course-visual-rough/references/page-recipes"
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes list
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes new --recipe-id two-panel-case-review
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes validate
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes set-status --recipe-id two-panel-case-review --status active
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes clone --recipe-id two-panel-case-review --new-recipe-id two-panel-case-review-v2
python .agents/skills/design-course-visual-rough/scripts/manage_recipes.py --recipes-dir $recipes remove --recipe-id two-panel-case-review-v2
```

- `new` 只生成 `experimental` Markdown，用户直接编辑；Agent 不得新增、编辑或激活配方。
- `experimental` 仅供 `draft`；`active` 可用于新正式粗设；`restricted` 仅用于具体、模板化的受控逻辑图，并要求必要性理由和人工批准。
- `deprecated` 不得进入新草稿，但既有 `approved` 文档仍可解释；`blocked` 在任何当前验证中均失败。
- 激活时写入 `definition_sha256`。激活后的结构字段不可原地修改，必须 `clone` 为新 ID。
- 只有从未激活、未被任何粗设引用的 `experimental` 配方可物理删除；其余配方通过 `deprecated` 或 `blocked` 管理。
- 缺少合适配方时返回“页面配方缺口”，不得在生产文档写入自由配方名称。

## Hard Constraints

- A 页覆盖、顺序与 A/S/G/R 引用必须与源 v6 完全一致。
- v3 必须考虑每页全部 G，但不要求标题 S 或组内普通 S 独立占槽；rough 中不得出现任一 guidance_text，`silent_constraints` 不得进入可见槽位。
- 图片页恰好 `ceil(A/3)`；M 从 M001 按页面顺序连续编号，每项只用一次。
- 媒体类型只允许 `photorealistic_ai`、`textbook_original`；AI 图不引用证据，教材原图必须引用源 A-page 中可解析证据，禁止重绘、重建或 AI 复刻。
- 实际图片在 PPT 结构完成后补入，不允许 fallback。
- 10 页及以上至少使用四种不同配方；相邻页面不得使用相同配方。
- 非逻辑配方不得映射为流程图、架构图或思维导图。逻辑图全篇最多两页，只能使用用户维护的具体 `restricted` 逻辑配方，并必须写不可由卡片、对照、步骤或文字带保留的拓扑理由。宽泛 `logic-diagram` 已被封禁。单纯“结果成为下一轮输入”不构成必要性，必须采用线性步骤加结论；只有同时存在分支、汇聚或非线性依赖且替代载体会造成错误理解时才可申请。
- A/V/R/M/E ID 只供制作核对，禁止成为学习者可见内容。

## Stop Rules

- 新生产源 A-page 不是 v6、哈希不一致、S/G/R 无法绑定或教材原图证据无法解析时停止；冻结 v4/v5 只允许走对应兼容校验。
- 需要未知配方时停止并报告“页面配方缺口”，列出缺少的槽位与用途，等待用户通过管理命令新增、试用并激活；不得代替用户写配方文件。
- 不因赶工增加逻辑图，不把“最多两页”理解为“必须两页”。
- 不读取冻结任务包的旧 Media Plan，不让旧 `visual_form` 或 B 媒体列影响选择。

## Verification

```powershell
python -m unittest discover -s .agents/skills/design-course-visual-rough/tests -p "test_*.py" -v
python .agents/skills/design-course-visual-rough/scripts/verify_visual_rough.py --a-page ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json --visual-rough ..\player\episodes\episode-XX\inputs/episode-XX-visual-rough.md --recipes-dir .agents/skills/design-course-visual-rough/references/page-recipes --output ..\player\episodes\episode-XX\inputs/episode-XX-visual-rough-validation.json
```
