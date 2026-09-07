---
name: design-course-visual-rough
description: Turn an approved Courseplay A-page v6 guidance document into a human-reviewable visual rough v4 before downstream production.
---

# Design Course Visual Rough

只接受 `courseplay-a-page/v6`，输出 `courseplay-visual-rough/v4`。A-page 的 G 只是 screen guidance 语义分组；G 的数量和边界不得由配方、卡片数或布局反推。

## Workflow

1. 读取已验证的 A-page v6、`references/visual-rough-contract.md`、`references/page-recipe-contract.md` 和候选 recipe v2 文件。
2. 先运行 verifier 的 preflight，查看每页 S/G/R、可用配方、U 范围、媒体要求和未覆盖项。
3. 使用 `templates/visual-rough-v4-template.md` 编写 rough。视觉内容只通过 `Uxxx <- Gxxx [+ Gxxx]` 映射；骨架只绑定 `S/U/M/none`。
4. 运行 `scripts/verify_visual_rough.py`，按 `references/error-catalog.json` 修复结构化错误。
5. `draft` 只有经用户审阅后才能变为 `approved`。

## Contract

- U 在整份 rough 内从 U001 连续编号；一个 U 可引用多个 G，一个 G 可进入多个 U或同时服务主体与结论。
- 每个源 G 至少由一个 U 覆盖；不要求 G 与 U 数量或顺序一致。
- 每个 R 必须有且仅有一个关系载体。
- rough 不复制 `guidance_text`；`silent_constraints` 不得进入可见结构。
- 配方使用 `courseplay-page-recipe/v2`，且范围只按 U 计数。禁止为了满足配方修改上游 G。
- 图片页恰好 `ceil(A/3)`，M 按页面顺序连续编号，实景 AI 图严格多数。
- 没有具体 `restricted` 逻辑配方时逻辑图为零；不存在宽泛 `logic-diagram` 配方。

## Governance

生产 Agent 只读取本 Skill、公开 contract、模板、preflight 和验证报告。不得读取 parser、validator 或 handoff 实现来推断规则。未登记错误码属于工具缺陷。

```powershell
python .agents/skills/design-course-visual-rough/scripts/verify_visual_rough.py --a-page <a-page.json> --visual-rough <rough.md> --recipes-dir .agents/skills/design-course-visual-rough/references/page-recipes --output <validation.json> --preflight-output <preflight.json>
```
