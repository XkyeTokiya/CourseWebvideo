---
name: design-course-visual-rough
description: Turn an approved Courseplay A-page v6 guidance document into a human-reviewable visual rough v4 before downstream production.
---

# Design Course Visual Rough

只接受 `courseplay-a-page/v6`，输出 `courseplay-visual-rough/v4`。A-page 的 G 只是 screen guidance 语义分组；G 的数量和边界不得由配方、卡片数或布局反推。

## Workflow

1. 读取已验证的 A-page v6、[visual rough v4 作者契约卡](references/visual-rough-v4-author-contract.md)、[canonical example](references/examples/visual-rough-v4/) 和需要使用的当前 recipe v2 文件。
2. 使用模板编写 `draft`；字段和跨页规则统一按作者契约卡处理。正常创作不增加独立创作前检查。
3. 运行现有黑盒验证入口；它的报告可包含验证后的结构摘要，但摘要不是创作前输入。
4. 失败时只按 [error index](references/error-catalog.json) 的错误码局部修复；`draft` 只有经用户审阅后才能变为 `approved`。

## Public author surface

生产 Agent 只读取本 Skill、作者契约卡、canonical example、当前 recipe 和失败时的 error index。不得读取 parser、validator 或 handoff 实现来推断规则；未登记错误码统一报告为工具缺陷。`references/visual-rough-contract.md` 与 `references/page-recipe-contract.md` 作为兼容链接保留，详细作者规则以契约卡为准。

```powershell
python .agents/skills/design-course-visual-rough/scripts/verify_visual_rough.py --a-page <a-page.json> --visual-rough <rough.md> --recipes-dir .agents/skills/design-course-visual-rough/references/page-recipes --output <validation.json>
```
